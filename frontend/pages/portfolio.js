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
    const currWLString = window.localStorage.getItem("pf");
    const container = document.getElementById("portfolio-container");
    const subHeading = document.getElementById("portfolio-no-of-stocks");
    container.innerHTML = "";
    if (!currWLString || this.portfolioArr.length === 0) {
      const emptyMessage = document.createElement("div");
      emptyMessage.innerText = "No Stocks in your portfolio";
      emptyMessage.classList.add("empty-message");
      container.appendChild(emptyMessage);
    } else {
      for (let stock of this.portfolioArr) {
        const card = document.createElement("div");
        card.classList.add("portfolio-card");
        card.setAttribute("sec-code", stock["Security Code"]);
        card.innerHTML = `<h4 class="card-heading">${stock["Issuer Name"]}</h4><p class="sector-name">${stock["Sector Name"]}`;

        const btnsContainer = document.createElement("div");
        btnsContainer.classList.add("buttons-container");

        const button = document.createElement("button");
        button.classList.add("view-button");
        button.innerHTML = `Details`;

        btnsContainer.appendChild(button);
        const deleteBtn = document.createElement("div");
        deleteBtn.classList.add("remove-button-container");
        deleteBtn.innerHTML = `<i class="fa-solid fa-trash-can remove-button"></i>`;
        deleteBtn.onclick = () => this.removeStock(stock["Security Code"]);
        btnsContainer.appendChild(deleteBtn);

        card.appendChild(btnsContainer);
        container.appendChild(card);
      }
    }

    const navigator = new NavigateToStock();
    navigator.addCompanyLinkEventListeners(this.portfolioArr, ".view-button");
    subHeading.innerText = `You currently have ${this.portfolioArr.length}  stocks to watch`;
  }

  removeStock(secCode) {
    const currWLString = localStorage.getItem("pf");
    const currWLObj = JSON.parse(currWLString);
    let index = 0;
    for (const stockObj of this.portfolioArr) {
      console.log(stockObj["Issuer Name"]);
      if (stockObj["Security Code"] === secCode) {
        console.log("found the stock to delete");
        currWLObj.splice(index, 1);

        // changing the stored array in localStorage and rendering new array
        localStorage.setItem("pf", JSON.stringify(currWLObj));
        this.dataInitializer();
        this.popuplate();

        break;
      }
      index++;
    }
  }
}

new Portfolio();
