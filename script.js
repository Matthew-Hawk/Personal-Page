// Display preferences also work when browser storage is unavailable.
const root = document.documentElement;
const themeToggle = document.querySelector('#theme-toggle');
const motionToggle = document.querySelector('#motion-toggle');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
const systemMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const readPreference = key => { try { return localStorage.getItem(key); } catch { return null; } };
const savePreference = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Use the preference for this visit. */ } };
let chosenTheme = readPreference('portfolio-theme');
let chosenMotion = readPreference('portfolio-motion');
function updateDisplay() {
  const dark = root.dataset.theme === 'dark';
  const paused = root.dataset.motion === 'paused';
  themeToggle.setAttribute('aria-pressed', String(dark));
  document.querySelector('#theme-label').textContent = dark ? 'LIGHT' : 'DARK';
  motionToggle.setAttribute('aria-pressed', String(paused));
  motionToggle.disabled = systemMotion.matches;
  motionToggle.title = systemMotion.matches ? 'Reduced motion is enabled in your device settings.' : 'Pause or resume decorative motion';
  document.querySelector('#motion-label').textContent = systemMotion.matches ? 'REDUCED' : (paused ? 'MOTION OFF' : 'MOTION ON');
  document.querySelector('meta[name="theme-color"]').content = dark ? '#161817' : '#eeeae2';
}
themeToggle.addEventListener('click', () => {
  chosenTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = chosenTheme;
  savePreference('portfolio-theme', chosenTheme);
  updateDisplay();
});
motionToggle.addEventListener('click', () => {
  chosenMotion = root.dataset.motion === 'paused' ? 'on' : 'paused';
  root.dataset.motion = chosenMotion;
  savePreference('portfolio-motion', chosenMotion);
  updateDisplay();
});
systemTheme.addEventListener('change', () => {
  if (chosenTheme !== 'light' && chosenTheme !== 'dark') root.dataset.theme = systemTheme.matches ? 'dark' : 'light';
  updateDisplay();
});
systemMotion.addEventListener('change', () => {
  root.dataset.motion = systemMotion.matches || chosenMotion === 'paused' ? 'paused' : 'on';
  updateDisplay();
});
updateDisplay();

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
  card.style.setProperty('--reveal-delay', `${index * 100}ms`);
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
  card.append(poster, meta);
  if (project.title === "Shellify" || project.title === "Promptly") {
    const badge = document.createElement("span");
    badge.className = "project-wip";
    const spark = document.createElement("span");
    spark.className = "project-wip-spark";
    spark.setAttribute("aria-hidden", "true");
    spark.textContent = "✳";
    const status = document.createElement("span");
    status.textContent = "WORK IN PROGRESS";
    const dots = document.createElement("span");
    dots.className = "project-wip-dots";
    dots.setAttribute("aria-hidden", "true");
    for (let dot = 0; dot < 3; dot++) dots.append(document.createElement("i"));
    badge.append(spark, status, dots);
    card.append(badge);
  }
  card.append(description, repository);
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

// A passive scroll listener schedules at most one progress update per frame.
const progress = document.querySelector('.reading-progress');
let progressFrame = 0;
function updateProgress() {
  const distance = root.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0})`;
  progressFrame = 0;
}
window.addEventListener('scroll', () => {
  if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress);
}, { passive: true });
window.addEventListener('resize', updateProgress);
window.addEventListener('load', updateProgress);
updateProgress();
