document.addEventListener("DOMContentLoaded", function () {
    const filterButtons = document.querySelectorAll(".filter-buttons button");
    const images = document.querySelectorAll(".gallery img");
    const lightbox = document.querySelector(".lightbox");
    const lightboxImg = document.querySelector(".lightbox img");
    const closeLightbox = document.querySelector(".lightbox .close");

    // Filtering images based on category
    filterButtons.forEach(button => {
        button.addEventListener("click", function () {
            const category = this.getAttribute("data-category");

            images.forEach(img => {
                if (category === "all" || img.classList.contains(category)) {
                    img.style.display = "block";
                } else {
                    img.style.display = "none";
                }
            });
        });
    });

    // Lightbox functionality
    images.forEach(img => {
        img.addEventListener("click", function () {
            lightbox.style.display = "flex";
            lightboxImg.src = this.src;
        });
    });

    

    lightbox.addEventListener("click", function () {
        lightbox.style.display = "none";
    });
});
