/* EDIT YOUR CONTENT HERE. Leave an image path empty to keep its placeholder. */
const portfolio = {
  profileImage: "images/Matthew_pfp.png",
  projects: [
    { title: "Portfolio Site", detail: "2026 / FRONTEND", poster: "", background: "#252b3b", ink: "#f1ede3" },
    { title: "Auto Tasks", detail: "2025 / PRODUCTIVITY", poster: "", background: "#8e3029", ink: "#fff0e6" },
    { title: "Data Dashboard", detail: "2024 / ANALYTICS", poster: "", background: "#467e9a", ink: "#f7e6ae" }
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

// Build project cards. Text is assigned via textContent so edits remain safe.
const projectGrid = document.querySelector("#project-grid");
portfolio.projects.forEach((project, index) => {
  const card = document.createElement("article");
  card.className = "project-card reveal";
  const poster = document.createElement("div");
  poster.className = "project-poster";
  poster.style.setProperty("--poster-bg", project.background);
  poster.style.setProperty("--poster-ink", project.ink);
  const number = document.createElement("span");
  number.className = "project-number";
  number.textContent = `PROJECT / ${String(index + 1).padStart(2, "0")}`;
  const placeholder = document.createElement("div");
  placeholder.className = "project-placeholder";
  const displayTitle = document.createElement("strong");
  displayTitle.textContent = project.title;
  const placeholderLabel = document.createElement("small");
  placeholderLabel.textContent = "VIEW ON GITHUB ↗";
  placeholder.append(displayTitle, placeholderLabel);
  poster.append(number, placeholder);
  if (project.poster.trim()) {
    const image = document.createElement("img");
    image.alt = `${project.title} project preview`;
    image.loading = "lazy";
    image.addEventListener("load", () => poster.classList.add("has-image"));
    image.addEventListener("error", () => image.remove());
    image.src = project.poster;
    poster.append(image);
  }
  const meta = document.createElement("div");
  meta.className = "project-meta";
  const label = document.createElement("span");
  label.textContent = "A RECENT BUILD";
  const detail = document.createElement("span");
  detail.textContent = project.detail;
  meta.append(label, detail);
  const title = document.createElement("h3");
  title.textContent = project.title;
  card.append(poster, meta, title);
  projectGrid.append(card);
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
