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

const galleryGrid = document.querySelector("[data-gallery-grid]");
const galleryFilterButtons = Array.from(document.querySelectorAll("[data-gallery-filter]"));
const galleryModal = document.querySelector("[data-gallery-modal]");
const galleryModalTitle = document.querySelector("[data-gallery-modal-title]");
const galleryModalLabel = document.querySelector("[data-gallery-modal-label]");
const galleryModalDescription = document.querySelector("[data-gallery-modal-description]");
const galleryModalGrid = document.querySelector("[data-gallery-modal-grid]");
const galleryModalCloseButtons = Array.from(document.querySelectorAll("[data-gallery-close]"));
let activeGalleryFilter = "todos";

function getAlbumBackground(album) {
  return [album.cover, album.fallbackCover]
    .filter(Boolean)
    .map((imagePath) => `url("${imagePath}")`)
    .join(", ");
}

function applyGalleryFilter(selectedFilter) {
  activeGalleryFilter = selectedFilter;

  galleryFilterButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.galleryFilter === selectedFilter);
  });

  document.querySelectorAll("[data-gallery-category]").forEach((album) => {
    const shouldShow = selectedFilter === "todos" || album.dataset.galleryCategory === selectedFilter;
    album.classList.toggle("is-hidden", !shouldShow);
  });
}

function closeGalleryModal() {
  if (!galleryModal) {
    return;
  }

  galleryModal.hidden = true;
  document.body.classList.remove("has-gallery-modal");
}

function openGalleryModal(album) {
  if (!galleryModal || !galleryModalGrid) {
    return;
  }

  const photos = Array.isArray(album.photos) ? album.photos : [];

  galleryModalTitle.textContent = album.title || "";
  galleryModalLabel.textContent = album.label || "";
  galleryModalDescription.textContent = album.description || "";
  galleryModalDescription.hidden = !album.description;
  galleryModalGrid.innerHTML = "";

  if (!photos.length) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "gallery-modal__empty";
    emptyMessage.textContent = "Fotos em breve.";
    galleryModalGrid.append(emptyMessage);
  } else {
    photos.forEach((photo) => {
      const figure = document.createElement("figure");
      figure.className = "gallery-modal__photo";

      const image = document.createElement("img");
      image.src = photo.src;
      image.alt = photo.alt || album.title || "";
      image.loading = "lazy";
      image.decoding = "async";

      figure.append(image);
      galleryModalGrid.append(figure);
    });
  }

  galleryModal.hidden = false;
  document.body.classList.add("has-gallery-modal");
  galleryModal.querySelector(".gallery-modal__close")?.focus();
}

function createGalleryAlbum(album) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = `photo-album${album.featured ? " photo-album--featured" : ""}`;
  card.dataset.galleryCategory = album.category || "";
  card.dataset.albumSlug = album.slug || "";
  card.setAttribute("aria-label", `Abrir fotos: ${album.title}`);

  if (album.event) {
    card.dataset.event = album.event;
  }

  if (album.year) {
    card.dataset.year = album.year;
  }

  if (album.sport) {
    card.dataset.sport = album.sport;
  }

  const backgroundImage = getAlbumBackground(album);

  if (backgroundImage) {
    card.style.backgroundImage = backgroundImage;
  }

  const content = document.createElement("div");
  content.className = "photo-album__content";

  const label = document.createElement("span");
  label.textContent = album.label || album.category || "";

  const title = document.createElement("h3");
  title.textContent = album.title || "";

  content.append(label, title);

  if (album.description) {
    const description = document.createElement("p");
    description.textContent = album.description;
    content.append(description);
  }

  card.append(content);
  card.addEventListener("click", () => openGalleryModal(album));

  return card;
}

function renderGalleryAlbums(albums) {
  if (!galleryGrid) {
    return;
  }

  galleryGrid.innerHTML = "";

  if (!albums.length) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "photos-section__empty";
    emptyMessage.textContent = "Fotos em breve.";
    galleryGrid.append(emptyMessage);
    return;
  }

  albums.forEach((album) => {
    galleryGrid.append(createGalleryAlbum(album));
  });

  applyGalleryFilter(activeGalleryFilter);
}

async function loadGalleryAlbums() {
  if (!galleryGrid) {
    return;
  }

  try {
    const response = await fetch("assets/data/galerias.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Nao foi possivel carregar as galerias.");
    }

    const data = await response.json();
    renderGalleryAlbums(Array.isArray(data.albums) ? data.albums : []);
  } catch (error) {
    renderGalleryAlbums([]);
  }
}

galleryFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyGalleryFilter(button.dataset.galleryFilter || "todos");
  });
});

galleryModalCloseButtons.forEach((button) => {
  button.addEventListener("click", closeGalleryModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeGalleryModal();
  }
});

loadGalleryAlbums();
