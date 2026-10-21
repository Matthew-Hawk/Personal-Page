// Shared enhancements for index.html and shellify.html. Loaded with `defer`, so
// their HTML exists before these selectors run. Both pages provide the same
// display-control IDs; only the case study provides the optional copy button.
// The small inline script in each page sets the initial theme before CSS paints.
// This file keeps those preferences and the visible controls in sync afterward.
const root = document.documentElement;
const themeToggle = document.querySelector('#theme-toggle');
const motionToggle = document.querySelector('#motion-toggle');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
const systemMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
// Storage can throw when blocked by browser settings. The controls still work
// for this visit; only remembering the choice between visits is lost.
const readPreference = key => { try { return localStorage.getItem(key); } catch { return null; } };
const savePreference = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Use the preference for this visit. */ } };
let chosenTheme = readPreference('portfolio-theme');
let chosenMotion = readPreference('portfolio-motion');
// data-theme/data-motion on <html> drive CSS. Mirror that state into labels,
// accessible button states, and the browser toolbar color in one place.
function updateDisplay() {
  const dark = root.dataset.theme === 'dark';
  const paused = root.dataset.motion === 'paused';
  themeToggle.setAttribute('aria-pressed', String(dark));
  themeToggle.setAttribute('aria-label', 'Use dark theme');
  document.querySelector('#theme-label').textContent = 'DARK';
  motionToggle.setAttribute('aria-pressed', String(paused));
  // A device-level reduced-motion preference takes priority over the button.
  motionToggle.disabled = systemMotion.matches;
  motionToggle.title = systemMotion.matches ? 'Reduced motion is enabled in your device settings.' : 'Pause or resume decorative motion';
  document.querySelector('#motion-label').textContent = systemMotion.matches ? 'REDUCED' : (paused ? 'MOTION OFF' : 'MOTION ON');
  motionToggle.setAttribute('aria-label', systemMotion.matches ? 'Reduced motion enabled by device settings' : (paused ? 'Motion off — resume animations' : 'Motion on — pause animations'));
  document.querySelector('meta[name="theme-color"]').content = dark ? '#161817' : '#eeeae2';
}
// Explicit choices update the page immediately and are saved for the next visit.
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
// Follow live device theme changes only until the visitor chooses a theme.
systemTheme.addEventListener('change', () => {
  if (chosenTheme !== 'light' && chosenTheme !== 'dark') root.dataset.theme = systemTheme.matches ? 'dark' : 'light';
  updateDisplay();
});
// Resuming motion at device level still respects a visitor's saved pause.
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
const backToTop = document.querySelector('#back-to-top');
// Move keyboard focus back to the main content before the floating control
// disappears. Use instant scrolling when either motion preference requests it.
backToTop.addEventListener('click', () => {
  document.querySelector('#main').focus({preventScroll:true});
  window.scrollTo({top:0, behavior:root.dataset.motion === 'paused' || systemMotion.matches ? 'instant' : 'smooth'});
});
function updateProgress() {
  // Normalize scroll position to 0..1 for CSS scaleX; short pages have no range.
  const distance = root.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${distance > 0 ? Math.min(1, Math.max(0, scrollY / distance)) : 0})`;
  // hidden removes the button from both the page and keyboard navigation at top.
  backToTop.hidden = scrollY <= 0;
  progressFrame = 0;
}
addEventListener('scroll', () => {
  // Scroll fires often. Queue at most one update per rendered frame; the
  // callback clears progressFrame so the next scroll can schedule another.
  if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress);
}, {passive: true});
addEventListener('resize', updateProgress);
addEventListener('load', updateProgress);
addEventListener('pageshow', updateProgress);
// Images and fonts can change page height without a window resize.
if ('ResizeObserver' in window) new ResizeObserver(updateProgress).observe(document.body);
updateProgress();

// Add a one-time entrance effect as each section enters the viewport. Without
// this API (or with motion paused), the HTML remains visible and readable.
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      if (root.dataset.motion !== 'paused') entry.target.classList.add('arrived');
      observer.unobserve(entry.target); // Avoid replaying effects on every scroll.
    }
  }, {threshold: 0.12});
  document.querySelectorAll('.story, .capabilities article, .case-row, .sample').forEach(item => observer.observe(item));
}

// Keep the footer year current; the HTML contains a fallback for no-JS visits.
document.querySelector('#year').textContent = new Date().getFullYear();
const copyButton = document.querySelector('#copy-sample');
// The homepage has no sample. Reveal this control only where it exists and JS
// can handle it; the <details> and selectable code also work without this file.
if (copyButton) {
  copyButton.hidden = false;
  copyButton.addEventListener('click', async () => {
    const status = document.querySelector('#copy-status');
    try {
      await navigator.clipboard.writeText(document.querySelector('#sample-code').textContent);
      status.textContent = 'Sample copied. Review it before running in your environment.';
    } catch {
      // Clipboard access can fail because of permissions or browser context.
      // The role=status element announces this manual fallback to screen readers.
      status.textContent = 'Copy is unavailable. Select the script above and copy it manually.';
    }
  });
}
