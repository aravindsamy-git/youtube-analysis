document.addEventListener("DOMContentLoaded", function () {

  if (window.location.hash === "") {
    window.location.hash = "#search-the-channel";
  }
  const sections = document.querySelectorAll(".nav-section");
  let currentDiv = null;
  let previousUrl = window.location.href;

  function showSectionByHash() {
    const hash = window.location.hash;
    const targetSection = document.querySelector(hash);

    // Hide all sections
    for (const section of sections) {
      section.style.display = "none";
    }
    if (targetSection) {
      targetSection.style.display = "block";
      currentDiv = document.getElementById(targetSection.id + "-div");
      if (currentDiv) {
        currentDiv.style.display = "block";
      }
    }
  }

  window.addEventListener("popstate", function (event) {
    const currentUrl = window.location.href;
    if (previousUrl === "http://127.0.0.1:5000/dashboard" && currentUrl !== "http://127.0.0.1:5000/dashboard") {
      const searchTheChannelDiv = document.querySelector("#search-the-channel-div");
      if (searchTheChannelDiv) {
        searchTheChannelDiv.style.display = "none";
      }
    }
    previousUrl = currentUrl;
    showSectionByHash();
  });
  function sectionchange() {
    showSectionByHash();
  }
  window.addEventListener("hashchange", sectionchange);
  showSectionByHash();

});
