import path from "path";
import fs from "fs";
// const currentDate = formatDateToString();
// console.log("checking date here", currentDate);
// // Define the file path
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
import { fileURLToPath } from "url";
const filePath = path.join(__dirname, "data_per_day", "Saturday-06-17.json");
// // console.log(typeof path, __dirname);

// function formatDateToString() {
//   const date = new Date();
//   const options = {
//     weekday: "long",
//     day: "2-digit",
//     month: "2-digit",
//   };

//   const formattedDate = date.toLocaleString("en-us", options);
//   console.log(formattedDate, formattedDate.split(/,\s+|\/+/));
//   const [weekday, day, month] = formattedDate.split(/,\s+|\/+/);
//   console.log(weekday, typeof weekday);
//   const formattedString = `${weekday}-${day}-${month}`;
//   return formattedString;
// }

// // Example usage
// console.log(__dirname);

fs.readFile(filePath, "utf8", (err, fileData) => {
  const data = JSON.parse(fileData);
  console.log(data["top_15_entries_with_stock_data"].length);
});
