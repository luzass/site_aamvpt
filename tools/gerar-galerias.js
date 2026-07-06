const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dataPath = path.join(root, "assets", "data", "galerias.json");
const galleriesPath = path.join(root, "assets", "images", "galerias");
const imageExtensions = new Set([".webp", ".jpg", ".jpeg", ".png", ".avif"]);

function toSitePath(filePath) {
  return path.relative(root, filePath).split(path.sep).join("/");
}

function getGalleryFiles(slug) {
  const albumPath = path.join(galleriesPath, slug);

  if (!fs.existsSync(albumPath)) {
    return [];
  }

  return fs
    .readdirSync(albumPath, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((fileName) => imageExtensions.has(path.extname(fileName).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true }))
    .map((fileName) => toSitePath(path.join(albumPath, fileName)));
}

const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

data.albums = data.albums.map((album) => {
  const photos = getGalleryFiles(album.slug);

  return {
    ...album,
    cover: photos[0] || album.cover,
    photos: photos.map((src, index) => ({
      src,
      alt: `${album.title} - foto ${index + 1}`
    }))
  };
});

fs.writeFileSync(dataPath, `${JSON.stringify(data, null, 2)}\n`);

console.log("Galerias atualizadas em assets/data/galerias.json");
