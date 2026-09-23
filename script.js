/* EDIT YOUR CONTENT HERE. Leave an image path empty to keep its placeholder. */
const portfolio = {
  profileImage: "images/Matthew_pfp.png", 
  movies: [
    { title: "Interstellar", detail: "2014 / SCI-FI", poster: "", background: "#252b3b", ink: "#f1ede3" },
    { title: "The Batman", detail: "2022 / THRILLER", poster: "", background: "#8e3029", ink: "#fff0e6" },
    { title: "The Truman Show", detail: "1998 / DRAMA", poster: "", background: "#467e9a", ink: "#f7e6ae" }
  ]
};

// Add your portrait without changing HTML.
const photo = document.querySelector("#profile-photo");
const photoPlaceholder = document.querySelector("#portrait-placeholder");
if (portfolio.profileImage.trim()) {
  photo.addEventListener("load", () => {
    photo.hidden = false;
    photoPlaceholder.hidden = true;
  });
  photo.addEventListener("error", () => console.warn("Profile image not found:", portfolio.profileImage));
  photo.src = portfolio.profileImage;
}

// Build movie cards. Text is assigned via textContent so edits remain safe.
const movieGrid = document.querySelector("#movie-grid");
portfolio.movies.forEach((movie, index) => {
  const card = document.createElement("article");
  card.className = "movie-card reveal";
  const poster = document.createElement("div");
  poster.className = "movie-poster";
  poster.style.setProperty("--poster-bg", movie.background);
  poster.style.setProperty("--poster-ink", movie.ink);
  const number = document.createElement("span");
  number.className = "movie-number";
  number.textContent = `FILM / ${String(index + 1).padStart(2, "0")}`;
  const placeholder = document.createElement("div");
  placeholder.className = "movie-placeholder";
  const displayTitle = document.createElement("strong");
  displayTitle.textContent = movie.title;
  const placeholderLabel = document.createElement("small");
  placeholderLabel.textContent = "ADD YOUR POSTER ↗";
  placeholder.append(displayTitle, placeholderLabel);
  poster.append(number, placeholder);
  if (movie.poster.trim()) {
    const image = document.createElement("img");
    image.alt = `${movie.title} movie poster`;
    image.loading = "lazy";
    image.addEventListener("load", () => poster.classList.add("has-image"));
    image.addEventListener("error", () => image.remove());
    image.src = movie.poster;
    poster.append(image);
  }
  const meta = document.createElement("div");
  meta.className = "movie-meta";
  const label = document.createElement("span");
  label.textContent = "A PERSONAL FAVORITE";
  const detail = document.createElement("span");
  detail.textContent = movie.detail;
  meta.append(label, detail);
  const title = document.createElement("h3");
  title.textContent = movie.title;
  card.append(poster, meta, title);
  movieGrid.append(card);
});

// Reveal elements as they enter the viewport. Respect reduced-motion settings.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".reveal");
if (!reducedMotion && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -25px 0px" });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("is-visible"));
}

document.querySelector("#year").textContent = new Date().getFullYear();
