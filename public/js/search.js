// public/js/search.js
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(".search");
  const searchButton = document.querySelector(".search-send");

  function goSearch() {
    const value = searchInput.value.trim();
    if (value) {
      location.href = "/search?val=" + encodeURIComponent(value);
    }
  }

  if (searchInput && searchButton) {
    searchButton.addEventListener("click", goSearch);
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") goSearch();
    });
  }
});
