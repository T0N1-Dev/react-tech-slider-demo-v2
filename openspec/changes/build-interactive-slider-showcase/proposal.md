# Proposal: Build Interactive Slider Showcase

## Intent and Business Problem

`react-tech-slider` needs a credible product showcase that helps React developers decide whether the package fits their project and move from evaluation to adoption without reconciling incomplete examples or undocumented behavior. The current repository presents only the Vite placeholder, while the previous demo is tied to an oversized stack and generates examples that do not match the current public API.

Build a developer-first interactive playground with strong visual polish. It must demonstrate the package itself, make the differences between the running and fades variants understandable, and produce minimal, trustworthy installation and usage guidance.

## Target Users and Use Moment

The primary audience is React developers evaluating or adopting the package. Their core use moments are:

- quickly judging the package's visual quality and variant behavior;
- experimenting with relevant public props before adding the dependency;
- checking the result at representative viewport widths;
- copying a valid install command and a minimal TypeScript/JSX example;
- understanding package capabilities and limitations before integration.

## Current-State Gap

The Vite React TypeScript application is still a placeholder and offers no package demonstration, adoption path, or API guidance. The old demo contains a useful live-editor concept, but it uses an unrelated Next/Radix/Tailwind-heavy architecture and generates obsolete or invalid props. Neither state provides a polished, accurate demonstration of the published `react-tech-slider` 1.9.3-compatible API.

Without a focused showcase, developers must infer behavior from package internals or incomplete documentation, increasing evaluation friction and the risk of copying invalid integration code.

## Goals and Product Outcomes

- Create a polished, high-confidence first impression of `react-tech-slider`.
- Let developers change variant-appropriate public props and see the result immediately.
- Make running and fades behavior easy to compare without implying that they share unsupported controls.
- Provide minimal valid copy-ready TypeScript/JSX using only relevant props.
- Reduce adoption friction with npm and pnpm install instructions, generated usage code, concise feature/API guidance, and direct package links.
- Keep the experience responsive and useful across desktop, tablet, and mobile preview presets.
- Communicate animation and image limitations honestly, especially where the public API cannot provide a complete accessibility control.

## First-Slice Scope

Deliver one responsive page containing:

1. A hero that identifies the package, its purpose, and the primary path into the playground.
2. An interactive playground with a live package preview and variant selection.
3. Variant-aware controls:
   - shared data and icon sizing controls;
   - running-only border, background, playback, hover-pause, and duration controls;
   - fades-only gap and speed controls.
4. Desktop, tablet, and mobile viewport presets that resize the preview area rather than emulate browser globals.
5. npm and pnpm install tabs.
6. Generated minimal TypeScript/JSX that stays synchronized with the preview and can be copied.
7. Concise variant, feature, and public API guidance.
8. Links to relevant package resources, including the published package and repository.
9. Recognizable remote tech logos in the demonstration, with graceful image-failure handling.
10. A cohesive dark editorial visual direction with restrained gradients and a high-contrast preview.

The first slice remains a single-page showcase. It keeps the existing Vite React TypeScript foundation and consumes a published `react-tech-slider` 1.9.3-compatible release rather than copying or reimplementing package internals.

## Non-Goals

- Rebuilding, patching, or extending the `react-tech-slider` package itself.
- Adding new public slider props, callbacks, pause behavior, or animation semantics.
- Claiming full reduced-motion support; the fades variant cannot be paused through the public API.
- Recreating the previous demo's framework, UI-kit, CSS-framework, or carousel dependency surface.
- Building documentation routing, accounts, persistence, analytics, a backend, or a multi-page marketing site.
- Supporting arbitrary user-provided datasets, asset uploads, or a general-purpose code sandbox in the first slice.
- Presenting preview viewport presets as package props.
- Exhaustively documenting package internals or every possible styling composition.

## Affected Areas

- The existing Vite React TypeScript showcase application and its page-level styling.
- Application dependency metadata and lock state for the published package during implementation.
- Showcase data for recognizable tech brands and remote image fallback behavior.
- Playground state, package prop mapping, generated examples, install guidance, and copy feedback.
- Responsive, keyboard, focus, contrast, overflow, and animation-related behavior.
- Package and repository navigation links.

No package source or public package API is in scope.

## User Experience

The page opens with a concise hero and a visually prominent live example. The playground is the main task surface: developers choose a variant, adjust only the controls valid for that variant, and see the package respond immediately in a high-contrast preview.

On wide screens, controls and preview are presented together with the preview visually dominant. On narrower screens, the preview remains easy to observe while controls, install guidance, and code adapt without page-level horizontal overflow. Desktop, tablet, and mobile presets clearly affect only the preview canvas.

Switching between running and fades preserves the user's settings for each variant during the session. Controls that do not apply to the selected variant are not presented as usable. Labels include units and make the difference between duration in milliseconds, gap in pixels, and fades speed as a multiplier clear.

The generated example always reflects the selected variant and relevant current settings. It uses valid package-root imports and omits irrelevant props. Install tabs switch between `npm install react-tech-slider` and `pnpm add react-tech-slider`. Copy actions provide perceivable success or failure feedback.

The visual system is dark and editorial, uses restrained gradients, and maintains strong contrast in the preview and interactive controls. Recognizable remote tech logos support rapid product comprehension; a failed image degrades to an intentional fallback that retains the brand name and does not collapse the slider layout.

## Product and Business Rules

1. The published package is the source of slider behavior; the showcase must not imitate its animations with a separate implementation.
2. The implementation baseline is a published `react-tech-slider` 1.9.3-compatible release. Examples must match that release's discriminated public API.
3. Running mode may expose only its supported shared and running-specific props: `brandsList`, `iconWidth`, `borderWidth`, `borderColor`, `backgroundColor`, `isPlay`, `pauseOnHoverActive`, and `durationMs`. Omitting `variant` is valid for running mode.
4. Fades mode must emit `variant="fades"` and may expose only `brandsList`, `iconWidth`, `gap`, and `speed`.
5. Generated TypeScript/JSX must be minimal, valid, copy-ready, and include only relevant props. It must not emit obsolete API names or invalid string values for numeric props.
6. Preview-only settings, including viewport presets and reset behavior, must be visibly distinguished from package props and excluded from generated package usage.
7. Running duration inputs must remain in a safe positive range. Fades speed must be presented as a multiplier, not milliseconds.
8. Each demonstration list must use unique brand IDs.
9. Variant-specific edits are retained when switching variants for the current page session; persistence across sessions is not required.
10. Remote tech logos must be recognizable, include meaningful brand names, and have graceful per-image failure handling. A single failed host or asset must not make the playground unusable.
11. The experience must explicitly disclose that fades cannot be paused through the public API. It must not claim full reduced-motion support.
12. Package-root imports are the documented integration path; the showcase must not instruct users to import a non-exported CSS subpath.
13. npm and pnpm commands, package naming, generated imports, and package links must consistently identify `react-tech-slider`.

## Failure and Empty States

- **Remote logo failure:** Replace the failed image with a stable, readable brand fallback while preserving layout and the rest of the dataset. Do not repeatedly retry or block rendering.
- **Multiple remote failures:** Keep controls, preview framing, code, and guidance usable; communicate brands through their names rather than presenting broken-image chrome.
- **Empty brand list:** Render a deliberate empty-preview message or safe empty track without crashing. Generated guidance must make the required `brandsList` input clear.
- **Invalid or out-of-range numeric input:** Prevent or normalize values outside the supported showcase range and provide nearby validation rather than passing unsafe values to the package.
- **Clipboard failure:** Keep the source visible and provide a perceivable failure message so the user can copy manually.
- **Package preview failure:** Contain the failure within the preview and leave installation/API guidance accessible; do not present a blank page.
- **Narrow viewport or long code:** Preserve page navigation and controls without horizontal page overflow; code may scroll within its own bounded region.
- **Animation limitation:** When fades is selected, disclose that it has no public pause control. Do not show a nonfunctional pause action or imply complete reduced-motion accommodation.

## Dependencies and Constraints

- Retain Vite, React, and TypeScript as the application foundation.
- Consume a published `react-tech-slider` 1.9.3-compatible release; do not link to local package source as the product path.
- The package's current React peer requirements must remain compatible with the scaffold's React 19 setup.
- The package public API and runtime behavior are authoritative for visible controls and generated code.
- The current project has ESLint and build verification but no dedicated automated test runner; any later test-tooling addition requires an explicit, proportionate implementation decision.
- The package has no callbacks, fades pause prop, or package-level full reduced-motion guarantee.
- Remote logo availability, host policy, privacy characteristics, and CORS behavior are outside showcase control, so failure handling is mandatory.
- Showcase datasets must remain modest because fades behavior can expand rendered elements substantially as list size grows.
- The first slice must remain one responsive page and avoid unnecessary framework or component-system migration.

## Risks and Tradeoffs

- **Remote recognition versus reliability/privacy:** Remote logos make the demo immediately recognizable but can fail, change, or disclose requests to third parties. Graceful fallback reduces functional risk but does not eliminate the network/privacy tradeoff.
- **Visual motion versus accessibility:** Animation is central to the package demonstration. Running can expose its public pause control, but fades cannot be paused through the public API; transparent disclosure is more accurate than claiming complete reduced-motion support.
- **Minimal examples versus full configuration:** Omitting irrelevant and default props makes examples easier to adopt, but developers will need API guidance to discover the full supported surface. The page balances this with a concise variant-aware API summary.
- **Single-page density versus completeness:** Combining playground, code, and guidance supports evaluation in one flow but risks visual overload. Editorial hierarchy and progressive grouping must keep the playground primary.
- **Published dependency versus local control:** Using the published release proves the real consumer experience but makes the showcase dependent on registry availability and the release's existing constraints.
- **No test runner versus interactive complexity:** Build and lint alone cannot fully establish control, copy, accessibility, and responsive behavior. The implementation plan must choose proportionate automated or manual verification without expanding this proposal into a tooling project.

## Rollback

If the showcase causes unacceptable regressions, revert the single-page showcase changes and remove the added published package dependency and associated lockfile entries, restoring the existing Vite placeholder. No migration, persisted user data, backend state, or package API change is introduced, so rollback does not require data conversion or compatibility shims.

If only remote logo delivery proves unreliable, retain the showcase and replace the remote demonstration dataset with a controlled fallback approach in a separately approved change; package behavior, controls, and generated examples remain unaffected.

## Measurable Acceptance and Success Criteria

The first slice is accepted when all of the following are true:

1. One responsive page contains the hero, interactive playground, variant-aware controls, desktop/tablet/mobile preview presets, npm/pnpm install tabs, generated code, feature/API guidance, and package links.
2. Both running and fades variants from a published `react-tech-slider` 1.9.3-compatible release render in the live preview without a local package-source dependency.
3. Every visible package control maps to a supported prop for the selected variant, and unsupported variant controls are absent or unavailable to keyboard and pointer interaction.
4. Switching variants preserves each variant's edited settings during the session and updates the preview and generated example consistently.
5. Generated TypeScript/JSX is valid and copy-ready, uses the package-root import, emits `variant="fades"` for fades, includes only relevant props, and contains none of the obsolete names `autoPlay`, `pauseOnHover`, or running `speed`.
6. npm and pnpm tabs show the correct commands and their copy actions provide visible and assistive-technology-readable success or failure feedback.
7. Desktop, tablet, and mobile presets visibly constrain only the preview; at representative narrow and wide page widths, the page has no horizontal overflow and all primary actions remain reachable.
8. Recognizable remote tech logos are shown under normal network conditions. Simulating an individual or broad image failure produces readable brand fallbacks, preserves preview layout, and does not crash the page.
9. Running duration and fades speed controls do not pass unsafe non-positive values. Units are visible for duration, gap, icon width, and speed multiplier.
10. The dark editorial presentation uses restrained gradients, keeps the preview high contrast, and maintains visible keyboard focus and non-color-only selection indicators.
11. The page explicitly states that fades cannot be paused through the public API and nowhere claims full reduced-motion support.
12. Empty brand data, clipboard denial, and preview failure have contained, understandable states that leave the rest of the page usable.
13. Production build and lint verification pass using the repository-configured commands.
14. A manual acceptance pass confirms both variants, all controls, install switching, code copying, keyboard operation, responsive presets, overflow handling, remote-image fallback, and the fades animation disclosure.

Success after release is demonstrated by a developer being able to reach a chosen variant, configure it, select an install command, and obtain a valid minimal example in one uninterrupted page flow, without consulting package internals or encountering an undocumented control mismatch.
