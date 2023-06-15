"use strict";
var request = require("request");

// replace the "demo" apikey below with your own key from https://www.alphavantage.co/support/#api-key
// var url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=TTM&interval=1min&apikey=${process.env.API_KEY}`;
var url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=FINEORG.BSE&outputsize=full&apikey=${process.env.API_KEY}`;
// var url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=TTM.NS&interval=15min&apikey=${process.env.API_KEY}&datatype=json`

request.get(
  {
    url: url,
    json: true,
    headers: { "User-Agent": "request" },
  },
  (err, res, data) => {
    if (err) {
      console.log("Error:", err);
    } else if (res.statusCode !== 200) {
      console.log("Status:", res.statusCode);
    } else {
      // data is successfully parsed as a JSON object:
      //   console.log(data);
      const latest = Object.entries(data["Time Series (Daily)"])[0];

      //   const latest = curr[0];
      //   const begining = curr[14];
      console.log(latest);
    }
  }
);
