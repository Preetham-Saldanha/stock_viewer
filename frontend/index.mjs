// import * as SearchBar from "./utils/search.js";
// const SearchBar = require("./utils/search");

function debounce(func, time) {
  let initial;

  function exec() {
    initial = setTimeout(() => {
      func();
    }, time);
  }

  // clearTimeout(initial);
  return function () {
    if (initial !== undefined) clearInterval(initial);
    exec();
  };
}

class App {
  constructor() {
    this.stockData = [];
    // new SearchBar();
    this.createInitialTable();
  }

  createInitialTable() {
    console.log("initiating table...");
    document.addEventListener("DOMContentLoaded", async () => {
      const response = await fetch("http://localhost:3000/api/home");
      const data = await response.json();
      this.stockData = data.top_15_entries_with_stock_data;
      console.log("1", this.stockData);
      const tableBody = document.getElementById("stockTableBody");

      this.stockData.forEach((entry, index) => {
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

      this.addCompanyLinkEventListeners(this.stockData, ".company-link");
    });
  }

  addCompanyLinkEventListeners(dataArray, selectorString) {
    console.log("adding links...");
    const companyLinks = document.querySelectorAll(selectorString);
    companyLinks.forEach((link, index) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();

        // Get the data for the clicked row
        const rowData = dataArray[index];

        // Serialize the data as a query string
        const queryString = new URLSearchParams(rowData).toString();

        // Generate the URL for the new page with the query string
        const url = `stock.html?${queryString}`;

        // Redirect to the new page
        window.location.href = url;
      });
    });
  }
}

class SearchBar {
  constructor() {
    this.searchBar = document.querySelector('#search-bar input[type="text"]');
    this.searchOverlay = document.getElementById("search-overlay");
    this.searchResultSection = document.querySelector(".search-result-section");
    this.onSearchActive();
    this.onSearchInactive();
    this.onSearchInput();
  }

  onSearchActive() {
    this.searchBar.addEventListener("click", () => {
      this.searchOverlay.style.display = "block";
      document.body.style.overflowY = "hidden";
      this.searchResultSection.style.display = "flex";

      // if (this.searchBar.value) {
      //   this.searchResultSection.style.display = "flex";
      // }
    });

    console.log("serach js runs");
  }

  onSearchInactive() {
    this.searchOverlay.addEventListener("click", () => {
      this.searchOverlay.style.display = "none";
      document.body.style.overflowY = "visible";
      this.searchResultSection.style.display = "none";
    });
  }

  onSearchInput() {
    const debouncedSearchHandler = debounce(async () => {
      // console.log(this.searchBar.value);
      const value = this.searchBar.value;
      let response;
      let data;
      if (!value) {
        this.searchResultSection.innerHTML = "";
        this.searchResultSection.style.display = "none";
      } else {
        this.searchResultSection.style.display = "flex";
        response = await fetch(
          `http://localhost:3000/api/search?value=${value}`
        );
        data = await response.json();
      }

      console.log(data, "test");

      this.searchResultSection.innerHTML = "";
      if (data.length === 0) {
        return;
      }
      data?.forEach((stock) => {
        const individualElement = document.createElement("div");
        individualElement.classList.add("searchResult");
        individualElement.innerText = stock["Issuer Name"];
        this.searchResultSection.append(individualElement);
      });
      const stockSearch = new App();
      stockSearch.addCompanyLinkEventListeners(data, ".searchResult");
    }, 500);

    this.searchBar.addEventListener("keyup", debouncedSearchHandler);
  }
}
// function handleSearch() {
//   console.log("handle...");
// }
new App();

new SearchBar();
// Inside the DOMContentLoaded event listener
