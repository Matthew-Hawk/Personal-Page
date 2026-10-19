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
  themeToggle.setAttribute('aria-label', 'Use dark theme');
  document.querySelector('#theme-label').textContent = dark ? 'LIGHT' : 'DARK';
  motionToggle.setAttribute('aria-pressed', String(paused));
  motionToggle.setAttribute('aria-label', 'Pause animations');
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

// Scroll feedback is decorative: content never depends on animation to appear.
const progress = document.createElement('div');
progress.className = 'reading-progress';
progress.setAttribute('aria-hidden', 'true');
document.body.prepend(progress);
let progressFrame = 0;
function updateProgress() {
  const distance = root.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${distance > 0 ? Math.min(1, Math.max(0, scrollY / distance)) : 0})`;
  progressFrame = 0;
}
addEventListener('scroll', () => {
  if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress);
}, {passive: true});
addEventListener('resize', updateProgress);
addEventListener('load', updateProgress);
if ('ResizeObserver' in window) new ResizeObserver(updateProgress).observe(document.body);
updateProgress();

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      if (root.dataset.motion !== 'paused') entry.target.classList.add('arrived');
      observer.unobserve(entry.target);
    }
  }, {threshold: 0.12});
  document.querySelectorAll('.featured, .supporting-grid article, .story, .capabilities article, .case-row, .sample').forEach(item => observer.observe(item));
}

document.querySelector('#year').textContent = new Date().getFullYear();
const copyButton = document.querySelector('#copy-sample');
if (copyButton) {
  copyButton.hidden = false;
  copyButton.addEventListener('click', async () => {
    const status = document.querySelector('#copy-status');
    try {
      await navigator.clipboard.writeText(document.querySelector('#sample-code').textContent);
      status.textContent = 'Sample copied. Review it before running in your environment.';
    } catch {
      status.textContent = 'Copy is unavailable. Select the script above and copy it manually.';
    }
  });
}
