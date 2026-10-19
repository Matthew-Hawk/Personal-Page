# Final portfolio polish — 19 October 2026

## Changelog

- Sharing: canonical URLs, Open Graph and Twitter large-image metadata, image descriptions and dimensions, Person JSON-LD, separate 1200×630 share previews, and a coordinated star favicon set. Existing Cloudflare URLs retained.
- Credibility: résumé-first hero actions, LinkedIn access, consistent endpoint terminology and target role titles, experience expressed as “Since November 2023,” and hours shown once in contact. Dates and technical scope were checked against the supplied résumé.
- Evidence: résumé links labeled as sources with context-specific accessible names, backup link targets the story itself, and Shellify links to its case study. Added grouped technologies from the site and résumé. Preserved the limited backup validation claim and separated CompTIA certification from TEEX training.
- Narrative: explicit IT/build/design framing, secondary project heading, consistent AI-assisted development wording, and supported Shellify outcomes and Z-Raid iteration. Unconfirmed Promptly feedback remains a visible question.
- Accessibility: real whitespace between paired labels, decorative arrows hidden, a decorative logo mark, names that include visible link/button labels, accessible persisted theme/motion controls, 44px nav/control/CTA tap targets, focus rings, and reduced-motion support. The logo label includes “MH” so voice-control users can match the visible initials.
- Delivery: responsive WebP alternatives with PNG/JPG fallbacks, direct font stylesheet and preconnections, résumé PDF title metadata, dated footer, and a static 404 page. No framework, runtime dependency, analytics, DNS, or hosting changes.

## Visible confirmation items

These four placeholders appear on the home page:

1. Did friends and family test Promptly, and what changed after their feedback?
2. CompTIA A+ issue date and credential URL or ID; TEEX completion date and verification URL or ID, if available.
3. Anonymous backup environment context: industry or organization size, Veeam version, and number of affected jobs. Share only context appropriate for public disclosure.
4. What I’d add next for backups: failure alerting, a documented restore test, or another step. This is a proposed next step, not a claim that it was performed.

No unverified employer scale, credential details, testing outcomes, time savings, or current personal learning activities were added. The résumé update note uses its September 2026 PDF metadata; employment dates are November 2023–May 2025 and May 2025–present as supplied.

## Validation

- Before-edit and after-edit captures: both pages × 375/768/1440px × light/dark × motion on/off, 24 combinations per pass, with no page overflow or runtime errors. Initial review confirmed existing CSS gaps; markup whitespace was added without redesigning those rows.
- Extra HTTP checks at 320px in both themes: local pages and anchors, image alternatives, alt text and dimensions, metadata, 44px nav/control/CTA targets, preference persistence, system reduced motion, and stopped pseudo-element animations.
- Axe: no violations for WCAG 2 A/AA, 2.1 AA, and 2.2 AA tags on both pages in light/dark; explicit visible-label/name rule also passes. Automated checks do not replace a full manual accessibility audit. Both themes use the original ink/paper and red palette; automated contrast checks passed.
- Existing browser suite passed keyboard skip links, theme switching, system reduced motion, clipboard success and denial fallback, PDF signature, and no-JavaScript script access.
- Mobile Lighthouse on local HTTP, simulated mobile defaults: home 93 performance / 100 accessibility / 100 best practices / 100 SEO; Shellify 95 / 100 / 100 / 100. Initial home performance was 84; responsive portrait sizes and removing the CSS font-import chain improved it. Scores describe the tested local runs, not deployed hosting. The subsequent logo-only label change passed the explicit accessibility rule.
- Public projects, repositories, and linked Shellify source files returned HTTP 200. LinkedIn returned its automated-access block (999); check the profile interactively.
- `node --check script.js` and `git diff --check` passed. PDF page count and extracted text match the original after title/author metadata changes. No visible résumé content was rewritten.

The editorial composition, portrait, palette, and typeface remain intact. The primary visual repair was to put résumé access first and keep both section labels available on small screens. Confirmation notes are intentionally visible review content and should be resolved before a job-application release.

## Changed files

- `index.html`, `shellify.html`: metadata, copy, semantics, links, responsive images, font loading, confirmation items.
- `style.css`, `script.js`: responsive spacing, target sizes, logo rendering, preference labels, image-hover selectors.
- `Resources/Matthew_Hawkins_Resume.pdf`: document metadata only.
- `Favicon/*`: star icon set and decorative mark; existing manifest paths preserved.
- `images/*-share.png`, `images/*.webp`: share previews and responsive alternatives; original content imagery retained.
- `404.html`: recovery page; deployed 404 routing needs verification.
- `tools/build-assets.cjs`, `tools/audit-matrix.cjs`, `tools/verify-polish.cjs`, `tools/check-lighthouse.cjs`: reproducible asset generation and QA. Use existing runtime packages through `PORTFOLIO_DEPS`, `PLAYWRIGHT_MODULE`, `AXE_MODULE`, and `LIGHTHOUSE_MODULE`; no project package manifest or new dependencies.
- `docs/screenshots/review-*`: refreshed review captures.
- `README.md`, `docs/content-evidence.md`, this file: current verification and handoff notes.

Temporary QA output is under ignored `tmp/`. Existing untracked brief and WIP screenshots were left outside commits.

## Deployment and personal follow-up

No push or deployment was performed. The checkout has no deployment configuration, and visible factual questions remain. When publishing, include only public pages, styles/scripts, image/favicon assets, manifest, and the authorized résumé. Exclude internal briefs, docs, tools, and `tmp/`.

- Resolve the four visible confirmation items, then publish through the existing Cloudflare Workers setup. Verify its custom 404 routing and consider appropriate asset caching/compression; local Python HTTP does not model Cloudflare caching.
- After deployment, run the home and case-study URLs through [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/). Confirm image, title, description, and crawler access. This cannot verify local files.
- Consider a custom domain and contact address on that domain. Choose and register them yourself; update canonical, social, and JSON-LD URLs if adopted.
- Review Shellify, Z-Raid, and Promptly READMEs for a screenshot, purpose, run instructions, personal contribution/AI assistance, and known limits. No external repositories were edited.
