"use strict";
import request from "request";

// replace the "demo" apikey below with your own key from https://www.alphavantage.co/support/#api-key
// var url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=TTM&interval=1min&apikey=${process.env.API_KEY}`;
var url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=FINEORG.BSE&outputsize=full&apikey=${process.env.API_KEY}`;
// var url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=TTM.NS&interval=15min&apikey=${process.env.API_KEY}&datatype=json`


export default function fetcher(req, res, next) {
  console.log("reached to fetcher...s")
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
        // console.log(Object.entries(data["Time Series (Daily)"]).length)
        const latest = Object.entries(data["Time Series (Daily)"])[0];
        // console.log(latest);
        req.data = latest
        //   const latest = curr[0];
        //   const begining = curr[14];
        next()
      }
    }
  );
}




// [
//   '2023-06-14',
//   {
//     '1. open': '4883.1499',
//     '2. high': '4950.0',
//     '3. low': '4819.0',
//     '4. close': '4927.8501',
//     '5. adjusted close': '4927.8501',
//     '6. volume': '5425',
//     '7. dividend amount': '0.0000',
//     '8. split coefficient': '1.0'
//   }
// ],
//   [
//     '2023-06-13',
//     {
//       '1. open': '4923.3999',
//       '2. high': '4954.25',
//       '3. low': '4857.0498',
//       '4. close': '4885.2002',
//       '5. adjusted close': '4885.2002',
//       '6. volume': '2392',
//       '7. dividend amount': '0.0000',
//       '8. split coefficient': '1.0'
//     }
//   ],
//   [
//     '2023-06-12',
//     {
//       '1. open': '5041.8999',
//       '2. high': '5080.0',
//       '3. low': '4911.3999',
//       '4. close': '4921.6001',
//       '5. adjusted close': '4921.6001',
//       '6. volume': '2353',
//       '7. dividend amount': '0.0000',
//       '8. split coefficient': '1.0'
//     }
//   ],
//   [
//     '2023-06-09',
//     {
//       '1. open': '5105.0',
//       '2. high': '5105.0',
//       '3. low': '5004.0',
//       '4. close': '5030.6001',
//       '5. adjusted close': '5030.6001',
//       '6. volume': '3038',
//       '7. dividend amount': '0.0000',
//       '8. split coefficient': '1.0'
//     }
//   ],
//   [
//     '2023-06-08',
//     {
//       '1. open': '5049.9502',
//       '2. high': '5125.0',
//       '3. low': '4998.0',
//       '4. close': '5058.8501',
//       '5. adjusted close': '5058.8501',
//       '6. volume': '4852',
//       '7. dividend amount': '0.0000',
//       '8. split coefficient': '1.0'
//     }
//   ],
//   [
//     '2023-06-07',
//     {
//       '1. open': '4955.0498',
//       '2. high': '5015.1001',
//       '3. low': '4842.0',
//       '4. close': '4998.9502',
//       '5. adjusted close': '4998.9502',
//       '6. volume': '9124',
//       '7. dividend amount': '0.0000',
//       '8. split coefficient': '1.0'
//     }
//   ],
//   [
//     '2023-06-06',
//     {
//       '1. open': '4815.0',
//       '2. high': '4970.0',
//       '3. low': '4779.25',
//       '4. close': '4942.2002',
//       '5. adjusted close': '4942.2002',
//       '6. volume': '7686',
//       '7. dividend amount': '0.0000',
//       '8. split coefficient': '1.0'
//     }
//   ],
//   [
//     '2023-06-05',
//     {
//       '1. open': '4550.1001',
//       '2. high': '4797.9502',
//       '3. low': '4550.1001',
//       '4. close': '4762.3999',
//       '5. adjusted close': '4762.3999',
//       '6. volume': '23933',
//       '7. dividend amount': '0.0000',
//       '8. split coefficient': '1.0'
//     }
//   ],
//   [
//     '2023-06-02',
//     {
//       '1. open': '4538.9502',
//       '2. high': '4548.2002',
//       '3. low': '4491.2002',
//       '4. close': '4501.0498',
//       '5. adjusted close': '4501.0498',
//       '6. volume': '3706',
//       '7. dividend amount': '0.0000',
//       '8. split coefficient': '1.0'
//     }
//   ],
//   [
//     '2023-06-01',
//     {
//       '1. open': '4507.9502',
//       '2. high': '4530.5498',
//       '3. low': '4487.0498',
//       '4. close': '4506.9502',
//       '5. adjusted close': '4506.9502',
//       '6. volume': '5211',
//       '7. dividend amount': '0.0000',
//       '8. split coefficient': '1.0'
//     }
//   ],
//   [
//     '2023-05-31',
//     {
//       '1. open': '4490.0498',
//       '2. high': '4504.4502',
//       '3. low': '4470.5498',
//       '4. close': '4499.25',
//       '5. adjusted close': '4499.25',
//       '6. volume': '1158',
//       '7. dividend amount': '0.0000',
//       '8. split coefficient': '1.0'
//     }
//   ],
//   [
//     '2023-05-30',
//     {
//       '1. open': '4480.0498',
//       '2. high': '4503.8999',
//       '3. low': '4448.5498',
//       '4. close': '4487.75',
//       '5. adjusted close': '4487.75',
//       '6. volume': '4991',
//       '7. dividend amount': '0.0000',
//       '8. split coefficient': '1.0'
//     }
//   ],
//   [
//     '2023-05-29',
//     {
//       '1. open': '4500.0',
//       '2. high': '4506.2',
//       '3. low': '4457.0',
//       '4. close': '4471.2',
//       '5. adjusted close': '4471.2',
//       '6. volume': '3998',
//       '7. dividend amount': '0.0000',
//       '8. split coefficient': '1.0'
//     }
//   ],
//   [
//     '2023-05-26',
//     {
//       '1. open': '4450.0',
//       '2. high': '4523.75',
//       '3. low': '4450.0',
//       '4. close': '4474.8501',
//       '5. adjusted close': '4474.8501',
//       '6. volume': '5912',
//       '7. dividend amount': '0.0000',
//       '8. split coefficient': '1.0'
//     }
//   ],
//   [
//     '2023-05-25',
//     {
//       '1. open': '4604.0',
//       '2. high': '4810.9502',
//       '3. low': '4404.3501',
//       '4. close': '4469.3501',
//       '5. adjusted close': '4469.3501',
//       '6. volume': '8825',
//       '7. dividend amount': '0.0000',
//       '8. split coefficient': '1.0'
//     }
//   ]
