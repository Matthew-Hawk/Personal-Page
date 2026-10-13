/* EDIT YOUR CONTENT HERE. Leave an image path empty to keep its placeholder. */
const portfolio = {
  profileImage: "images/Matthew_pfp.png",
  projects: [
    { title: "Z-Raid", detail: "SURVIVAL GAME", description: "Pick your survivor, raid the ruins, and recover the cure. Three raids. One life.", poster: "images/z-raid.jpg", liveUrl: "https://z-raid.pages.dev/", repoUrl: "https://github.com/Matthew-Hawk/Z-Raid", background: "#101b21", ink: "#f1ede3" },
    { title: "Shellify", detail: "POWERSHELL BUILDER", description: "Build PowerShell visually. Choose commands, shape your workflow, and export a script.", poster: "images/shellify.jpg", liveUrl: "https://shellify.pages.dev/", repoUrl: "https://github.com/Matthew-Hawk/Shellify", background: "#121326", ink: "#f1ede3" },
    { title: "Promptly", detail: "AI PROMPT BUILDER", description: "Turn a few simple details into a clear, ready-to-paste request for your favorite AI.", poster: "images/promptly.jpg", liveUrl: "https://promptly.thehawk6353.workers.dev/#home", repoUrl: "https://github.com/Matthew-Hawk/Promptly", background: "#202d40", ink: "#f1ede3" }
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
  const poster = document.createElement("a");
  poster.className = "project-poster";
  poster.href = project.liveUrl;
  poster.target = "_blank";
  poster.rel = "noopener noreferrer";
  poster.setAttribute("aria-label", `Visit ${project.title} live site (opens in new tab)`);
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
  placeholderLabel.textContent = "VIEW LIVE SITE ↗";
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
  label.textContent = "BUILT BY ME";
  const detail = document.createElement("span");
  detail.textContent = project.detail;
  meta.append(label, detail);
  const title = document.createElement("h3");
  title.textContent = project.title;
  const caption = document.createElement("div");
  caption.className = "project-caption";
  const liveLabel = document.createElement("span");
  liveLabel.className = "project-live-label";
  liveLabel.textContent = "VIEW LIVE SITE ↗";
  caption.append(title, liveLabel);
  poster.append(caption);
  const description = document.createElement("p");
  description.className = "project-description";
  description.textContent = project.description;
  const repository = document.createElement("a");
  repository.className = "project-repo-link";
  repository.href = project.repoUrl;
  repository.target = "_blank";
  repository.rel = "noopener noreferrer";
  repository.setAttribute("aria-label", `View ${project.title} on GitHub (opens in new tab)`);
  repository.textContent = "VIEW ON GITHUB ↗";
  card.append(poster, meta, description, repository);
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
