# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Prototype design context

- This prototype compares two selected MotionWallpaper marketing directions from the latest ideation set: Option 2 (Aqua Glass) and Option 3 (Cloudline Motion).
- Keep both variants bright and cyan-leaning: pearl white and pale sky/aqua blue with deep ink-teal typography. Avoid dark full-page backgrounds, purple atmospheres, neon, and pure-black body text.
- The user wants abundant motion and layered depth; "minimal" applies to the restrained palette, not to the amount of visual movement or content.
- Use the real MotionWallpaper icon and factual product claims from the repository. Do not use Apple or macOS wallpaper assets or imitate recognizable Apple wallpaper compositions.
- Provide independent URLs for both variants so they can be evaluated separately.
