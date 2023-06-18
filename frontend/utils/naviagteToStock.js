class NavigateToStock {
  constructor() {}

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
