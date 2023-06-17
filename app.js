import express from "express";
const app = express();
const port = 3000;
import request from "request";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get the directory name
// import fetcher from "./fetcher.js";
import cors from "cors";
import fs from "fs";

import fetch from "node-fetch";
app.use(cors());

const results = [];

const __dirname = dirname(fileURLToPath(import.meta.url));
async function fetchStockData(securityId, isSingleEntry) {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${securityId}.BSE&outputsize=full&apikey=${process.env.API_KEY}`;

  try {
    console.log("start");
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

app.get("/api/home", (req, res) => {
  // Read the JSON data from "finalData.json" or fetch it from a database
  fs.readFile(
    path.join(__dirname, "data_per_day", `${formatDateToString()}.json`),
    "utf8",
    (err, fileData) => {
      if (err) {
        console.error(`Error reading .json:`, err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const data = JSON.parse(fileData);
      // const top15Entries = Object.keys(data);
      // console.log(top15Entries.length);
      console.log(data.length);

      const response = {
        top_15_entries_with_stock_data: data.slice(0, 50),
      };

      res.json(response);
    }
  );
});

app.get("/api/stock/:id", async (req, res) => {
  // const data = await fetcher()
  // console.log("checking", data)
  const securityId = req.params.id;
  console.log(securityId);
  const latest = await fetchStockData(securityId, true);

  const refined = filterData(latest);
  console.log(refined);
  res.send(refined);
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

function calculatePercentageChange(open, close) {
  const openPrice = parseFloat(open);
  const closePrice = parseFloat(close);
  return (((closePrice - openPrice) / openPrice) * 100).toFixed(2);
}

function filterData(dataArray) {
  const yearlyDates = [];
  dataArray.forEach(([date, _], index) => {
    const year = date.substr(0, 4);
    if (
      index === 0 ||
      date.substr(0, 4) !== dataArray[index - 1][0].substr(0, 4)
    ) {
      yearlyDates.unshift(date);
    } else if (
      index === dataArray.length - 1 ||
      date.substr(0, 4) !== dataArray[index + 1][0].substr(0, 4)
    ) {
      yearlyDates.unshift(date);
    }
  });

  // Extract the "close" values for the yearly dates
  const yearlyCloseData = yearlyDates.map((yearlyDate) => {
    const matchingData = dataArray.find(([date, _]) => date === yearlyDate);
    return parseFloat(matchingData[1]["4. close"]);
  });
  return { yearlyDates, yearlyCloseData };
}

function formatDateToString() {
  const date = new Date();
  const options = {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
  };

  const formattedDate = date.toLocaleString("en-US", options);
  const [weekday, day, month] = formattedDate.split(/,\s+|\/+/);
  const formattedString = `${weekday}-${day}-${month}`;
  return formattedString;
}
