class WatchList {
  constructor() {
    this.watchListArr = [];
    this.dataInitializer();
    this.popuplate();
  }
  dataInitializer() {
    const currWLString = window.localStorage.getItem("wl");
    const arr = [];
    for (let stock of JSON.parse(currWLString)) {
      const data = Object.values(stock)[0];
      arr.push(data);
    }
    this.watchListArr = arr;
    console.log(this.watchListArr, "hi");
  }
  popuplate() {
    const currWLString = window.localStorage.getItem("wl");
    const container = document.getElementById("watchlist-container");
    const subHeading = document.getElementById("watchlist-no-of-stocks");
    if (!currWLString || this.watchListArr.length === 0) {
      const emptyMessage = document.createElement("div");
      emptyMessage.innerText = "No Stocks added to watch yet";
      emptyMessage.classList.add("empty-message");
      container.appendChild(emptyMessage);
    } else {
      for (let stock of this.watchListArr) {
        const card = document.createElement("div");
        card.classList.add("watchlist-card");
        card.innerHTML = `<h4 class="card-heading">${stock["Issuer Name"]}</h4><p class="sector-name">${stock["Sector Name"]}`;
        const button = document.createElement("button");
        button.classList.add("view-button");
        button.innerHTML = "Details";

        card.appendChild(button);
        container.appendChild(card);
      }
    }

    const navigator = new NavigateToStock();
    navigator.addCompanyLinkEventListeners(this.watchListArr, ".view-button");
    subHeading.innerText = `You currently have ${this.watchListArr.length}  stocks to watch`;
  }
}

// navigateToSTock has already been decalred

// class NavigateToStock {
//   constructor() {}

//   addCompanyLinkEventListeners(dataArray, selectorString) {
//     console.log("adding links...");
//     const companyLinks = document.querySelectorAll(selectorString);
//     companyLinks.forEach((link, index) => {
//       link.addEventListener("click", (event) => {
//         event.preventDefault();

//         // Get the data for the clicked row
//         const rowData = dataArray[index];

//         // Serialize the data as a query string
//         const queryString = new URLSearchParams(rowData).toString();

//         // Generate the URL for the new page with the query string
//         const url = `stock.html?${queryString}`;

//         // Redirect to the new page
//         window.location.href = url;
//       });
//     });
//   }
// }
new WatchList();
