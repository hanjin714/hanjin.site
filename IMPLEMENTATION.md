# Cinematic resume / implementation notes

## Scope

Native static resume with seven readable chapters; no required video download, generation model, external animation service or backend. Dark/cyan/violet/amber palette retained. The flagship has a replaceable image slot; the abstract SVG is not a real system topology.

## Motion extracted from the supplied code-video reference

- Four simultaneous project/career panels move around a fixed, real speaking photograph. No keyword slideshow or player shell.
- Analytic 3D DOM transforms, depth ordering and opacity based on orbit position rather than accumulated frame state.
- A restrained 48-second full revolution; decorative particle fields and orbit typography were removed after user feedback.
- `window.DURATION = 48`, `window.renderFrame(t)` and `?t=8` for reproducible frame sampling.
- A separate requestAnimationFrame playback driver for the live website, not inside the frame renderer.
- Motion does not control scrolling or hide resume text.
- Header pause/resume, reduced-motion static composition, offscreen/hidden-tab suspension, hover and keyboard-focus pause. No player or page progress bar.
- Orbit panels are real in-page links. Keyboard focus switches to an unobstructed stable arrangement.

This adapts the reference's construction techniques, not its unrelated 61-second WorkBuddy script, audio track or MP4 delivery specification. No audio autoplays.

## Evidence and disclosure

Project records were inspected read-only with the authorized Feishu bot on 2026-10-02. Current aggregate: 21 main projects, 45 detail nodes, 5 main rows labeled completed. These are tracking counts, not a claim of personal completion or full deployment.

The flagship's core listing node is completed in the detail table; its parent still records preparation for deployment and a wider scope. The public page reflects that distinction. Internal URLs, partner identities, restricted recruitment details, videos and credentials are excluded. Operations middleware is described only at capability level.

## Updating

- Edit index.html for public copy and chapter content.
- Edit styles.css for baseline layout and review.css for the final editorial/responsive pass.
- Edit src/portfolio.ts for interactions. Run npm ci, npm run build and npm run check. script.js is generated and committed so Pages needs no runtime bundler.
- The project image slot is in #delivery; only replace it with authorized public imagery.
- Fonts are local OFL assets. Rebuild the Noto Sans SC subset after Chinese copy changes.
- `node scripts/verify.cjs` checks assets, anchors, disclosure boundaries and the renderer using a mocked DOM. It does not prove browser layout; inspect mobile and desktop separately.
- GitHub Pages serves the repository root. Preserve CNAME and .nojekyll.

## Final interview-oriented pass / 2026-10-02

Headline responsibility is explicit; recent cases stay distinct from historical works. Three native disclosures expose design judgment, individual vs shared responsibility, and the evidence boundary without expanding confidential details.

Browser checks covered desktop 1280x720 and mobile 390x844: no horizontal overflow; native disclosure click/Enter, in-page navigation and active-state updates, stable keyboard panel layout, gallery selection and email clipboard feedback. Runtime error log was empty. A mobile backdrop-filter containing-block issue was found and fixed.

TypeScript strict checks and mocked runtime checks cover deterministic sampling, periodicity, reduced-motion default, hover/focus/offscreen RAF suspension and public asset/anchor checks. These do not prove full accessibility compliance or performance on low-end devices. Print CSS exists but an exported PDF was not visually validated in this pass.
