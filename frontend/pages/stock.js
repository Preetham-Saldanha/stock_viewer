// Data from the provided array
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
