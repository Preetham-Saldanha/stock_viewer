import express from "express";
const app = express();
const port = 3000;
import request from "request";
import fetcher from "./fetcher.js";
import cors from "cors";
import fs from "fs";
import fetch from "node-fetch";
app.use(cors());

const results = [];
// Middleware function
// const getDataMiddleware = (req, res, next) => {
//     const { customURL } = req;

//     request.get(
//         {
//             url: customURL,
//             json: true,
//             headers: { "User-Agent": "request" },
//         },
//         (err, response, data) => {
//             if (err) {
//                 console.log("Error:", err);
//                 // Pass the error to the error handling middleware
//                 return next(err);
//             } else if (response.statusCode !== 200) {
//                 console.log("Status:", response.statusCode);
//                 // Pass the status code to the error handling middleware
//                 return next(new Error(`Request failed with status ${response.statusCode}`));
//             } else {
//                 const latest = Object.entries(data["Time Series (Daily)"])[0];
//                 console.log(latest);

//                 // Push the result to the results array
//                 results.push(latest);

//                 next();
//             }
//         }
//     );
// };

// // Middleware for initial run on 15 URLs
// const initialRunMiddleware = (req, res, next) => {
//     // const urlsCount = Object.keys(urls).length;
//     let count = 0;
//     let urlFirstPart = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol="`
//     let urlSecondPart = `.BSE&outputsize=full&apikey=${process.env.API_KEY}`;
//     const urls = [
//         "RELIANCE",
//         "TCS",
//         "HDFCBANK",
//         "ICICIBANK",
//         "HINDUNILVR",
//         "INFY",
//         "HDFC",
//         "ITC",
//         "SBIN",
//         "BHARTIARTL",
//         // "KOTAKBANK",
//         // "BAJFINANCE",
//         // "LICI",
//         // "LT",
//         // "HCLTECH"
//     ]

//     for (const key in urls) {
//         const customURL = urls[key];

//         req.customURL = urlFirstPart + customURL + urlSecondPart;

//         // Run getDataMiddleware only for the first 15 URLs

//         getDataMiddleware(req, res, () => { });

//     }

//     setTimeout(() => next(), 5000);
// };

// const fs = require("fs");
// const fetch = require("node-fetch");

async function fetchStockData(securityId, isSingleEntry) {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${securityId}.BSE&outputsize=full&apikey=${process.env.API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data["Time Series (Daily)"]) {
      const latestEntry = isSingleEntry
        ? Object.entries(data["Time Series (Daily)"])
        : Object.entries(data["Time Series (Daily)"])[0];
      return latestEntry;
    } else {
      return null;
    }
  } catch (error) {
    console.log(`Error fetching stock data for ${securityId}: ${error}`);
    return null;
  }
}

const initialRunMiddleware = async (req, res, next) => {
  try {
    const fileData = await fs.promises.readFile("finalData.json", "utf8");
    const data = JSON.parse(fileData);
    const top15Entries = Object.keys(data).slice(0, 15);
    const results = [];

    for (const entry of top15Entries) {
      const securityId = data[entry]["Security Id"];

      try {
        const stockData = await fetchStockData(securityId, false);
        if (stockData) {
          data[entry]["Stock Data"] = stockData;
          results.push(data[entry]);
        }
      } catch (error) {
        console.log(`Error fetching stock data for ${securityId}: ${error}`);
      }
    }

    const response = {
      top_15_entries_with_stock_data: results,
    };
    req.data = response;
    console.log(response);
    next();
  } catch (error) {
    console.error("Error reading finalData.json:", error);
  }
};

// Usage:
// initialRunMiddleware(req, res, next);

// Routes
// app.get("/", initialRunMiddleware, (req, res) => {
//   console.log("initial run..", results);
//   const latest = req.data;
//   res.send(latest);
//   // res.send(results);
// });

const initialData = async (req, res, next) => {
  try {
    const fileData = await fs.promises.readFile("finalData.json", "utf8");
    const data = JSON.parse(fileData);

    // Send the data to the frontend
    res.json(data);
  } catch (error) {
    console.error("Error reading finalData.json:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Usage:
// app.get("/api/home", initialData);

app.get("/api/home", (req, res) => {
  // Read the JSON data from "finalData.json" or fetch it from a database
  fs.readFile("friday-16-06.json", "utf8", (err, fileData) => {
    if (err) {
      console.error("Error reading finalData.json:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const data = JSON.parse(fileData)["top_15_entries_with_stock_data"];
    const top15Entries = Object.keys(data);
    console.log(top15Entries.length);
    const results = top15Entries.map((entry) => {
      const stockData = data[entry]["Stock Data"];
      const marketCap = Number.parseFloat(data[entry]["marketCap"]).toFixed(2);
      //   console.log(stockData, "dataaaaaaa");
      return {
        "Security Code": data[entry]["Security Code"],
        "Issuer Name": data[entry]["Issuer Name"],
        "Security Id": data[entry]["Security Id"],
        "Sector Name": data[entry]["Sector Name"],
        Open: stockData[1]["1. open"],
        Close: stockData[1]["4. close"],
        High: stockData[1]["2. high"],
        Low: stockData[1]["3. low"],
        "Open-Close (%)": calculatePercentageChange(
          stockData[1]["1. open"],
          stockData[1]["4. close"]
        ),
        "Market Cap (Lakhs)": marketCap,
      };
    });

    const response = {
      top_15_entries_with_stock_data: results,
    };

    res.json(response);
  });
});

function calculatePercentageChange(open, close) {
  const openPrice = parseFloat(open);
  const closePrice = parseFloat(close);
  return (((closePrice - openPrice) / openPrice) * 100).toFixed(2);
}

app.get("/api/stock/:id", async (req, res) => {
  // const data = await fetcher()
  // console.log("checking", data)
  const securityId = req.params.id;
  console.log(securityId);
  const latest = await fetchStockData(securityId, true);
  console.log(latest);
  res.send(latest);
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
