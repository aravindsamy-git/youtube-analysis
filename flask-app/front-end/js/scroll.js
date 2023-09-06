document.addEventListener("DOMContentLoaded", function () {
    const navbarLinks = document.querySelectorAll("#menu a");
    
    navbarLinks.forEach(link => {
        link.addEventListener("click", scrollToSection);
    });
    
    function scrollToSection(e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop;
            window.scrollTo({
                top: offsetTop,
                behavior: "smooth"
            });
        }
    }
});

  