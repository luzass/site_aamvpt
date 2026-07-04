const heroSlides = Array.from(document.querySelectorAll(".hero__slide"));
let activeSlide = 0;

if (heroSlides.length > 1) {
  window.setInterval(() => {
    heroSlides[activeSlide].classList.remove("is-active");
    activeSlide = (activeSlide + 1) % heroSlides.length;
    heroSlides[activeSlide].classList.add("is-active");
  }, 6200);
}

document.querySelectorAll(".site-header__logo").forEach((logo) => {
  logo.addEventListener("error", () => {
    logo.closest(".site-header__brand")?.classList.add("is-missing");
  });
});

document.querySelectorAll(".events-section__video").forEach((video) => {
  video.addEventListener("loadeddata", () => {
    video.closest(".events-section")?.classList.add("has-video");
    video.play().catch(() => {});
  });
});

const galleryFilterButtons = Array.from(document.querySelectorAll("[data-gallery-filter]"));
const galleryAlbums = Array.from(document.querySelectorAll("[data-gallery-category]"));

galleryFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.galleryFilter;

    galleryFilterButtons.forEach((filterButton) => {
      filterButton.classList.toggle("is-active", filterButton === button);
    });

    galleryAlbums.forEach((album) => {
      const shouldShow = selectedFilter === "todos" || album.dataset.galleryCategory === selectedFilter;
      album.classList.toggle("is-hidden", !shouldShow);
    });
  });
});
