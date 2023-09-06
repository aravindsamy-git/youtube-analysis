document.addEventListener("DOMContentLoaded", function () {

  if (window.location.hash === "") {
    window.location.hash = "#search-the-channel";
  }
  const sections = document.querySelectorAll(".nav-section");
  let currentDiv = null; // Track the currently displayed div
  let previousUrl = window.location.href; // Track the previous URL

  // Function to show the section based on the URL hash
  function showSectionByHash() {
    const hash = window.location.hash;
    const targetSection = document.querySelector(hash);

    // Hide all sections
    for (const section of sections) {
      section.style.display = "none";
    }

    // Show the selected section
    if (targetSection) {
      targetSection.style.display = "block";
      currentDiv = document.getElementById(targetSection.id + "-div");
      if (currentDiv) {
        currentDiv.style.display = "block";
      }
    }
  }

  // Add event listener to the popstate event (URL change)
  window.addEventListener("popstate", function (event) {
    const currentUrl = window.location.href;
    if (previousUrl === "http://127.0.0.1:5000/dashboard" && currentUrl !== "http://127.0.0.1:5000/dashboard") {
      const searchTheChannelDiv = document.querySelector("#search-the-channel-div");
      if (searchTheChannelDiv) {
        searchTheChannelDiv.style.display = "none";
      }
    }
    previousUrl = currentUrl;
    showSectionByHash(); // Show the section based on the new hash
  });

  // Function to handle hashchange event
  function sectionchange() {
    showSectionByHash();
  }

  // Add event listener to the URL hash change
  window.addEventListener("hashchange", sectionchange);

  // Initially, show the section based on the current URL hash
  showSectionByHash();

});
