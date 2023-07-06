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
    container.innerHTML = "";
    if (!currWLString || this.watchListArr.length === 0) {
      const emptyMessage = document.createElement("div");
      emptyMessage.innerText = "No Stocks added to watch yet";
      emptyMessage.classList.add("empty-message");
      container.appendChild(emptyMessage);
    } else {
      for (let stock of this.watchListArr) {
        const card = document.createElement("div");
        card.classList.add("watchlist-card");
        card.setAttribute("sec-code", stock["Security Code"]);
        card.innerHTML = `<p class="card-heading">${stock["Issuer Name"]}</p><p class="sector-name">${stock["Sector Name"]}</p>`;

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
    navigator.addCompanyLinkEventListeners(this.watchListArr, ".view-button");
    subHeading.innerText = `You currently have ${this.watchListArr.length}  stocks to watch`;
  }

  removeStock(secCode) {
    const currWLString = localStorage.getItem("wl");
    const currWLObj = JSON.parse(currWLString);
    let index = 0;
    for (const stockObj of this.watchListArr) {
      console.log(stockObj["Issuer Name"]);
      if (stockObj["Security Code"] === secCode) {
        console.log("found the stock to delete");
        currWLObj.splice(index, 1);

        // changing the stored array in localStorage and rendering new array
        localStorage.setItem("wl", JSON.stringify(currWLObj));
        this.dataInitializer();
        this.popuplate();

        break;
      }
      index++;
    }
  }

  handlePopup(message, link) {
    // Create the modal container
    const modalContainer = document.querySelector(".modal");
    const popupOverlay = document.querySelector(".popup-overlay");

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
