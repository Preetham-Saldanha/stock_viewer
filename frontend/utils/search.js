class SearchBar {
  constructor() {
    this.searchBar = document.querySelector('#search-bar input[type="text"]');
    this.searchOverlay = document.getElementById("search-overlay");
    this.onSearchActive();
    this.onSearchInactive();
  }

  onSearchActive() {
    searchBar.addEventListener("click", () => {
      searchOverlay.style.display = "block";
      document.body.style.overflow = "hidden";
    });

    console.log("serach js runs");
  }

  onSearchInactive() {
    searchOverlay.addEventListener("click", () => {
      searchOverlay.style.display = "none";
      document.body.style.overflow = "visible";
    });
  }

  onSearchInput() {
    this.searchBar.addEventListener("keyup", () => {
      console.log(this.searchBar.value);
    });
  }
}
