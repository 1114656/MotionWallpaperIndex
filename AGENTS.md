# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Prototype design context

- This prototype compares two selected MotionWallpaper marketing directions from the latest ideation set: Option 2 (Aqua Glass) and Option 3 (Cloudline Motion).
- Keep both variants bright and cyan-leaning: pearl white and pale sky/aqua blue with deep ink-teal typography. Avoid dark full-page backgrounds, purple atmospheres, neon, and pure-black body text.
- The user wants abundant motion and layered depth; "minimal" applies to the restrained palette, not to the amount of visual movement or content.
- The user rejected three glossy AI-generated redesign comps as too "AI-like." Avoid oversized generic slogans, fabricated desktop windows, floating devices, heavy glass pills, wave separators, and over-saturated scenic effects. Ground future redesigns in real software sites and functional browser motion using the project's own assets.
- `/new` is a restrained local redesign preview. Keep `/` on Aqua until the user reviews the runnable new page. Its wallpaper scenes use existing PNG assets with web animations; do not describe them as product video footage.
- Use the real MotionWallpaper icon and factual product claims from the repository. Do not use Apple or macOS wallpaper assets or imitate recognizable Apple wallpaper compositions.
- Provide independent URLs for both variants so they can be evaluated separately.
- Do not show the four-item MIT/Windows/source-file/multi-display trust strip between the hero and the next section in either variant.
- Keep Aqua's hero water background visibly flowing, and make its existing pause control stop the motion.
- The public v1.0.0 GitHub Release is now available. Main download controls should go directly to its actual installer asset; keep the installation and checksum details accessible separately. Use the asset URLs published by GitHub, because the uploaded filenames differ from the Chinese filenames in the release notes.
- The user asked for a fresh (清新) redesign: `src/FreshPage.jsx` + `src/fresh-page.css` now serve `/` and `/fresh` (pearl white, mint and sky, deep ink-teal text, rounded cards, gentle drifting motion). Keep Aqua at `/aqua`, Cloudline at `/cloudline`, and the chooser at `/versions`.
- Production is served at `https://xiaozhizi.top` from the `c4` SSH host. 1Panel's OpenResty serves static releases from `/opt/1panel/apps/openresty/openresty/www/sites/motionwallpaper/releases/`; the `current` symlink selects the live release. Its site config is `/opt/1panel/apps/openresty/openresty/conf/conf.d/xiaozhizi.top.conf`. Preserve the other virtual hosts on this server.
