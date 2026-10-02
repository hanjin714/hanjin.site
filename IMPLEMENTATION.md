# Cinematic resume / implementation notes

## Scope

Native static resume with seven readable chapters; no required video download, generation model, external animation service or backend. Dark/cyan/violet/amber palette retained. The flagship has a replaceable image slot; the abstract SVG is not a real system topology.

## Motion extracted from the supplied code-video reference

- Seeded `mulberry32` particle initialization.
- Analytic Canvas trajectories rather than accumulated frame state.
- Four six-second scenes, SVG path drawing, outlined display typography and restrained entry easing.
- `window.DURATION = 24`, `window.renderFrame(t)` and `?t=8` for reproducible frame sampling.
- A separate requestAnimationFrame playback driver for the live website, not inside the frame renderer.
- Scroll chapters change the field's composition. Motion does not control scrolling or hide resume text.
- Pause/scrub, reduced-motion default, hidden-tab suspension and lower particle count on mobile.

This adapts the reference's construction techniques, not its unrelated 61-second WorkBuddy script, audio track or MP4 delivery specification. No audio autoplays.

## Evidence and disclosure

Project records were inspected read-only with the authorized Feishu bot on 2026-10-02. Current aggregate: 21 main projects, 45 detail nodes, 5 main rows labeled completed. These are tracking counts, not a claim of personal completion or full deployment.

The flagship's core listing node is completed in the detail table; its parent still records preparation for deployment and a wider scope. The public page reflects that distinction. Internal URLs, partner identities, restricted recruitment details, videos and credentials are excluded. Operations middleware is described only at capability level.

## Updating

- Edit index.html for public copy and chapter content.
- Edit styles.css for layout and print styles.
- Edit script.js for the deterministic renderer and playback controls.
- The project image slot is in #delivery; only replace it with authorized public imagery.
- Fonts are local OFL assets. Rebuild the Noto Sans SC subset after Chinese copy changes.
- `node scripts/verify.cjs` checks assets, anchors, disclosure boundaries and the renderer using a mocked DOM. It does not prove browser layout; inspect mobile and desktop separately.
- GitHub Pages serves the repository root. Preserve CNAME and .nojekyll.
