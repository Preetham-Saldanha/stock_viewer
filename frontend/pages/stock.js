// Data from the provided array
let stockData;
document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);

  // Retrieve the data from the query string
  const securityId = urlParams.get("Security Id");
  const data = {};

  // Iterate over the URL parameters and populate the data object
  for (const [key, value] of urlParams) {
    data[key] = value;
  }

  const container = document.getElementById("stock-details-container");
  document.getElementsByClassName("stock-heading")[0].innerHTML =
    data["Issuer Name"];

  for (const key in data) {
    const card = document.createElement("div");
    card.classList.add("stock-detail-card");

    const heading = document.createElement("h2");
    heading.classList.add("stock-detail-heading");

    heading.textContent = key;

    const value = document.createElement("p");
    value.classList.add("stock-detail-value");
    value.textContent = data[key];

    card.appendChild(heading);
    card.appendChild(value);

    container.appendChild(card);
  }

  // ... retrieve other properties as needed
  stockData = { ...data };
  console.log(urlParams, securityId, data);
  // Use the data to populate and replace the content on the page
  // document.getElementById("securityId").textContent = securityId;
  const response = await fetch(`http://localhost:3000/api/stock/${securityId}`);
  const dataArray = await response.json();
  console.log(dataArray);
  // Extract the first and last dates of each year
  const { yearlyDates, yearlyCloseData } = dataArray;
  console.log(yearlyDates, yearlyCloseData);
  // Get the chart canvas element
  const ctx = document.getElementById("lineChart").getContext("2d");

  // Create the line chart
  new Chart(ctx, {
    type: "line",
    data: {
      labels: yearlyDates,
      datasets: [
        {
          label: "Close Price",
          data: yearlyCloseData,
          borderColor: "blue",
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
});

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

class Stock {
  constructor() {
    this.handleAddToPortfolio();
    this.handleAddToWatchlist();
  }

  addToStorage(storePlace, stockData) {
    console.log(stockData);
    const currentWL = window.localStorage.getItem(storePlace);
    // console.log(currentWL, "curre");
    if (!currentWL) {
      window.localStorage.setItem(
        storePlace,
        JSON.stringify([{ [stockData["Security Code"]]: stockData }])
      );
    } else {
      let flag = false;
      const parsedWL = JSON.parse(currentWL);
      for (let item of parsedWL) {
        if (item[stockData["Security Code"]]) {
          console.log("already present in ", storePlace);
          flag = true;
          break;
        }
      }

      // if stock is not already present in wl
      if (!flag) {
        window.localStorage.setItem(
          storePlace,
          JSON.stringify([
            ...parsedWL,
            { [stockData["Security Code"]]: stockData },
          ])
        );
      }
    }
  }
  // add this method later
  handleEvent(message) {}

  handlePopup(message, link) {
    // Create the modal container
    const modalContainer = document.querySelector(".modal");
    const popupOverlay = document.querySelector(".popup-overlay");
    document.body.style.overflowY = "hidden";
    // Create the heading element
    const heading = document.createElement("h2");
    heading.textContent = message;

    // Create the button container
    const buttonContainer = document.createElement("div");

    // Create the "Yes" button
    const yesButton = document.createElement("button");
    yesButton.classList.add("blue-button");
    yesButton.textContent = "Yes";
    yesButton.onclick = () => {
      window.location.href = link;
    };
    // Create the "Later" button
    const laterButton = document.createElement("button");
    laterButton.classList.add("red-button");
    laterButton.textContent = "Later";
    laterButton.onclick = () => {
      modalContainer.innerHTML = "";
      popupOverlay.style.display = "none";
      modalContainer.style.display = "none";
      document.body.style.overflow = "visible";
    };
    popupOverlay.onclick = () => {
      modalContainer.innerHTML = "";
      popupOverlay.style.display = "none";
      modalContainer.style.display = "none";
      document.body.style.overflow = "visible";
    };
    // Append the buttons to the button container
    buttonContainer.appendChild(yesButton);
    buttonContainer.appendChild(laterButton);

    // Append the heading and button container to the modal container
    modalContainer.appendChild(heading);
    modalContainer.appendChild(buttonContainer);

    popupOverlay.style.display = "block";
    modalContainer.style.display = "flex";
  }

  handleAddToWatchlist() {
    const wlButton = document.querySelector("#addToWL");

    wlButton.addEventListener("click", () => {
      this.addToStorage("wl", stockData);
      this.handlePopup(
        "Do you want to look into your WatchList?",
        "watchList.html"
      );
    });
  }

  handleAddToPortfolio() {
    const pfButton = document.querySelector("#addToPF");

    pfButton.addEventListener("click", () => {
      this.addToStorage("pf", { ...stockData });
      this.handlePopup(
        "Do you want to look into your Portfolio?",
        "portfolio.html"
      );
    });
  }
}
new Stock();
