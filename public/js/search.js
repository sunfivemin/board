// public/js/search.js
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.querySelector(".search-send");

  function performSearch() {
    const value = searchInput.value.trim();
    if (!value) {
      alert("검색어를 입력해주세요.");
      searchInput.focus();
      return;
    }

    if (value.length < 2) {
      alert("검색어는 2글자 이상 입력해주세요.");
      searchInput.focus();
      return;
    }

    location.href = "/search?val=" + encodeURIComponent(value);
  }

  // 전역 함수로 등록 (onclick에서 사용)
  window.performSearch = performSearch;

  if (searchInput && searchButton) {
    searchButton.addEventListener("click", performSearch);
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") performSearch();
    });

    // 검색 입력 필드에 포커스
    searchInput.focus();
  }
});
