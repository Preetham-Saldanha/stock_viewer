class Portfolio {
  constructor() {
    this.portfolioArr = [];
    this.dataInitializer();
    this.popuplate();
  }
  dataInitializer() {
    const currWLString = window.localStorage.getItem("pf");
    const arr = [];
    for (let stock of JSON.parse(currWLString)) {
      const data = Object.values(stock)[0];
      arr.push(data);
    }
    this.portfolioArr = arr;
    console.log(this.portfolioArr, "hi");
  }
  popuplate() {
    const currWLString = window.localStorage.getItem("wl");
    const container = document.getElementById("portfolio-container");
    const subHeading = document.getElementById("portfolio-no-of-stocks");
    if (!currWLString || this.portfolioArr.length === 0) {
      const emptyMessage = document.createElement("div");
      emptyMessage.innerText = "No Stocks added to watch yet";
      emptyMessage.classList.add("empty-message");
      container.appendChild(emptyMessage);
    } else {
      for (let stock of this.portfolioArr) {
        const card = document.createElement("div");
        card.classList.add("portfolio-card");
        card.innerHTML = `<h4 class="card-heading">${stock["Issuer Name"]}</h4><p class="sector-name">${stock["Sector Name"]}`;
        const button = document.createElement("button");
        button.classList.add("view-button");
        button.innerHTML = "Details";

        card.appendChild(button);
        container.appendChild(card);
      }
    }

    const navigator = new NavigateToStock();
    navigator.addCompanyLinkEventListeners(this.portfolioArr, ".view-button");
    subHeading.innerText = `You currently have ${this.portfolioArr.length}  stocks to watch`;
  }
}

new Portfolio();
