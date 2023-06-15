import express from 'express';
const app = express();
const port = 3000;
import request from 'request';
import fetcher from "./fetcher.js"
import cors from "cors"
import fs from 'fs';
import fetch from 'node-fetch';
app.use(cors());

const results = []
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



function fetchStockData(securityId) {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${securityId}.BSE&outputsize=full&apikey=${process.env.API_KEY}`;

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data["Time Series (Daily)"]) {
                const latestEntry = Object.entries(data["Time Series (Daily)"])[0];
                return latestEntry;
            } else {
                return null;
            }
        })
        .catch(error => {
            console.log(`Error fetching stock data for ${securityId}: ${error}`);
            return null;
        });
}


const initialRunMiddleware =(req,res,next)=> {
    // Read the JSON data from "finalData.json"
    fs.readFile('finalData.json', 'utf8', (err, fileData) => {
        if (err) {
            console.error('Error reading finalData.json:', err);
            return;
        }

        const data = JSON.parse(fileData);
        const top15Entries = Object.keys(data).slice(0, 15);
        const results = [];

        const fetchNextStockData = async () => {
            if (top15Entries.length === 0) {
                // All stock data fetched, send response
                const response = {
                    top_15_entries_with_stock_data: results
                };
                req.data= response
                next()
                console.log(response);
                return;
            }

            const entry = top15Entries.shift();
            const securityId = data[entry]["Security Id"];

            try {
                const stockData = await fetchStockData(securityId);
                if (stockData) {
                    data[entry]["Stock Data"] = stockData;
                    results.push(data[entry]);
                }
            } catch (error) {
                console.log(`Error fetching stock data for ${securityId}: ${error}`);
            }

            // Fetch next stock data
            fetchNextStockData();
        };

        // Start fetching stock data
        fetchNextStockData();
    });

}

// Routes
app.get('/', initialRunMiddleware, (req, res) => {
    console.log("initial run..", results)
    const latest = req.data
    res.send(latest);
    // res.send(results);
});




app.get('/home', fetcher, async (req, res) => {
    // const data = await fetcher()
    // console.log("checking", data)
    const latest = req.data
    res.send(latest);

});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
