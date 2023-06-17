// async function handleStockClick(securityId) {
//   console.log(data), "ee";
//   const response = await fetch(`http://localhost:3000/api/stock/${securityId}`);
//   const data = await response.json();
//   console.log(data);
// }

class App {
  constructor() {
    this.stockData = {};
  }

  createInitialTable() {}
}

document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch("http://localhost:3000/api/home");
  const data = await response.json();

  const stockData = data.top_15_entries_with_stock_data;

  const tableBody = document.getElementById("stockTableBody");

  stockData.forEach((entry, index) => {
    const {
      "Security Code": securityCode,
      "Issuer Name": issuerName,
      "Security Id": securityId,
      "Sector Name": sectorName,
      Open,
      Close,
      High,
      Low,
      "Open-Close (%)": openClosePercentage,
      "Market Cap (Lakhs)": marketCap,
    } = entry;

    const row = document.createElement("tr");
    const currData = {
      issuerName,
      sectorName,
      securityCode,
      Open,
      Close,
      High,
      Low,
      openClosePercentage: openClosePercentage,
      marketCap: marketCap,
    };
    row.innerHTML = `
        <td>${index + 1}</td>
        <td ><a href="stock.html" class="company-link issuer">${issuerName}</a></td>
        <td>${securityId}</td>
        <td>${sectorName}</td>
        <td>${Open}</td>
        <td>${Close}</td>
        <td>${High}</td>
        <td>${Low}</td>
        <td>${openClosePercentage}%</td>
        <td>${marketCap}</td>
      `;

    tableBody.appendChild(row);
  });

  const companyLinks = document.querySelectorAll(".company-link");
  companyLinks.forEach((link, index) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      // Get the data for the clicked row
      const rowData = stockData[index];

      // Serialize the data as a query string
      const queryString = new URLSearchParams(rowData).toString();

      // Generate the URL for the new page with the query string
      const url = `stock.html?${queryString}`;

      // Redirect to the new page
      window.location.href = url;
    });
  });
});

class Test {
  constructor() {
    this.greet = "hello";
    this.run();
  }

  run() {
    console.log("running...");
  }
}

new Test();
// Inside the DOMContentLoaded event listener
