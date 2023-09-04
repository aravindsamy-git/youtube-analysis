window.addEventListener('DOMContentLoaded', (event) => {
    const defaultSection = document.getElementById('search-the-channel');
    defaultSection.style.display = 'block';
  });
  
  document.addEventListener("DOMContentLoaded", function () {
    const navButtons = document.querySelectorAll(".nav-button");
    const sections = document.querySelectorAll(".nav-section");
  
    navButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
        sections.forEach((section) => {
          section.style.display = "none";
        });
        sections[index].style.display = "block";
      });
    });
  });

function scrollToSectionAndChannel(channelId, sectionId) {
    sessionStorage.setItem("selectedChannelId", channelId);
    const section = document.getElementById(sectionId);
    const csection = document.getElementById("search-the-channel")
    if (section) {
      csection.style.display = "none";
      section.style.display = "block";
    }
}