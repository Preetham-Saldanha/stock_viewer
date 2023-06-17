import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import fetch from "node-fetch";
const __dirname = dirname(fileURLToPath(import.meta.url));

async function fetchStockData(securityId, isSingleEntry) {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${securityId}.BSE&outputsize=full&apikey=${process.env.API_KEY}`;

  await new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("end");
      resolve(true);
    }, 10000);
  });

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

const initialRunner = async () => {
  try {
    console.time("fetchTop-15");
    const fileData = await fs.promises.readFile("companyList.json", "utf8");
    const data = JSON.parse(fileData);
    const top15Entries = Object.keys(data).slice(0, 50);
    const results = [];
    console.log(top15Entries.length, "total stocks count");
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

    // Example object (dictionary)

    // Convert the object to JSON format
    const response = top15Entries.map((entry) => {
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

    const jsonData = JSON.stringify(response);

    // Example usage
    const currentDate = formatDateToString();
    console.log("checking date here", currentDate);
    // Define the file path
    const filePath = path.join(
      __dirname,
      "data_per_day",
      `${currentDate}.json`
    );

    // Write the JSON data to the file
    fs.writeFile(filePath, jsonData, (err) => {
      if (err) {
        console.error("Error writing JSON file:", err);
      } else {
        console.log("JSON file has been written successfully.");
      }
    });

    // req.data = response;
    // console.log(response);
    console.timeEnd("fetchTop-15");
    // next();
  } catch (error) {
    console.error("Error reading finalData.json:", error);
  }
};

initialRunner();

// +========================function+++++====================

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
