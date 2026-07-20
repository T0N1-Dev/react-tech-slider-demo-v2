# Code Context

## Phase Envelope

- **status:** complete
- **executive_summary:** The existing Vite/React/TypeScript scaffold is intentionally minimal and can host the showcase without a framework migration. The registry package `react-tech-slider@1.9.3` matches the local package source and **does contain the public `fades` variant**, so consuming the published package is currently viable. The new demo should retain the old demo’s live-editor/preview/code-generation idea, but replace its oversized Next/Radix dependency surface and inaccurate generated code with a typed, variant-aware state model.
- **artifacts:** `.pi-subagents/artifacts/outputs/3653cabf/context.md` (runtime-authorized exploration artifact; the conflicting requested `openspec/.../explore.md` path was not written)
- **next_recommended:** Use this exploration as input to the SDD proposal, explicitly fixing the showcase sections, default control values, responsive preview presets, and registry dependency at `react-tech-slider@^1.9.3` (or exact `1.9.3` if reproducibility is preferred).
- **risks:** Remote logo reliability/CORS, animation accessibility, fade layout with small/empty/large lists, and package behavior outside the documented positive speed range.
- **skill_resolution:** none

## Files Retrieved

1. `C:/Users/anton/OneDrive/Desktop/React-Tech-Slider/react-tech-slider-old-demo/react-tech-slider-demo/app/page.tsx` (lines 1-243) - old live editor, category carousel, preview, generated code, and install presentation.
2. `C:/Users/anton/OneDrive/Desktop/React-Tech-Slider/react-tech-slider-old-demo/react-tech-slider-demo/package.json` (lines 1-69) - old Next 15/Radix/Tailwind dependency footprint and old package constraint `^1.8.18`.
3. `C:/Users/anton/OneDrive/Desktop/React-Tech-Slider/react-tech-slider-old-demo/react-tech-slider-demo/lib/data.ts` (lines 1-184) - reusable category/brand data concept and remote image dependencies.
4. `C:/Users/anton/OneDrive/Desktop/React-Tech-Slider/react-tech-slider-old-demo/react-tech-slider-demo/hooks/useSliderStyles.ts` (lines 1-30) - category-specific preset styles.
5. `C:/Users/anton/OneDrive/Desktop/React-Tech-Slider/react-tech-slider-old-demo/react-tech-slider-demo/hooks/useEmblaCarouselData.ts` (lines 1-25) - category carousel state and imperative navigation.
6. `C:/Users/anton/OneDrive/Desktop/React-Tech-Slider/react-tech-slider/src/types.ts` (lines 1-35) - exact public brand and discriminated Slider prop types.
7. `C:/Users/anton/OneDrive/Desktop/React-Tech-Slider/react-tech-slider/src/Slider.tsx` (lines 1-14) - public variant dispatch.
8. `C:/Users/anton/OneDrive/Desktop/React-Tech-Slider/react-tech-slider/src/components/moving-slider.tsx` (lines 1-77) - running variant defaults and rendering behavior.
9. `C:/Users/anton/OneDrive/Desktop/React-Tech-Slider/react-tech-slider/src/components/fade-out-slider.tsx` (lines 1-118) - exact fades semantics, defaults, timing, and data rendering.
10. `C:/Users/anton/OneDrive/Desktop/React-Tech-Slider/react-tech-slider/src/index.ts` (lines 1-7) - public value/type exports.
11. `C:/Users/anton/OneDrive/Desktop/React-Tech-Slider/react-tech-slider/src/slider.css` (lines 1-105) - running/fades layout, animation, sizing, and absence of reduced-motion rules.
12. `C:/Users/anton/OneDrive/Desktop/React-Tech-Slider/react-tech-slider/rollup.config.js` (lines 1-38) - emitted JS automatically imports `./index.css` via banner.
13. `C:/Users/anton/OneDrive/Desktop/React-Tech-Slider/react-tech-slider/package.json` (lines 1-70) - package identity `react-tech-slider@1.9.3`, exports, files, and peers.
14. `package.json` (lines 1-29) - current Vite 8/React 19/TypeScript 6 scaffold and no slider/UI dependency.
15. `src/App.tsx` (lines 1-10) - placeholder-only application.
16. `src/main.tsx` (lines 1-10) - StrictMode root with no global stylesheet import.
17. `pnpm-lock.yaml` (lines 1-35, 781-786) - current lock contains React/ReactDOM but not `react-tech-slider`.

## Key Code

### Old demo assessment

The old page combines all concerns in one component: editor state, category presets, Embla navigation, package preview, string generation, and install command. Reusable product concepts are:

- immediate live preview beside grouped controls;
- category/sample-data switching;
- color picker plus text input;
- range controls with visible units;
- generated usage snippet;
- package-install callout.

Do **not** carry forward:

- the very broad Next/Radix/shadcn/Tailwind dependency tree for a one-page Vite showcase (`old-demo/package.json:13-65`);
- one 240-line page owning all state and presentation;
- extra Embla carousel around the slider, which confuses package behavior with showcase navigation;
- hydration/loading workaround used only because of the old architecture;
- category changes silently resetting edited styling (`useSliderStyles.ts:13-26`);
- inaccurate generated API: `iconWidth: "..."` is invalid JSX, and it emits obsolete `autoPlay`, `pauseOnHover`, and `speed` names instead of `isPlay`, `pauseOnHoverActive`, and `durationMs` (`app/page.tsx:199-233`);
- inconsistent speed default comparison (editor default `30000`, generator compares against `3000`);
- remote third-party logo URLs as the only fixture source.

### Exact package API

Import value and optional types from the package root:

```ts
import { Slider, type Brand, type SliderProps } from "react-tech-slider";
```

Evidence: `src/index.ts:1-7`; package root export maps import to `dist/index.js` and types to `dist/index.d.ts` (`package.json:26-31`). The emitted JS starts with `import './index.css';` by Rollup banner (`rollup.config.js:14-20`), so normal root import loads required CSS automatically; there is no public CSS subpath export and consumers should not document one.

Data contract (`src/types.ts:3-11`):

```ts
interface Brand {
  id: number;
  name: string;
  img: string;
  width?: number;       // interpreted as rem
  height?: number;      // interpreted as rem
  style?: CSSProperties;
  className?: string;
}
```

Shared props: `brandsList: Brand[]` required; `iconWidth?: number` applies a rem width unless a brand-specific `width` overrides it (`moving-slider.tsx:11-23`; `fade-out-slider.tsx:26-38`). There are **no callbacks** in the public API.

Running/standard variant (`src/types.ts:17-26`, defaults from `moving-slider.tsx:27-37`):

- `variant?: "running"` (omission selects running because `Slider.tsx:7-12` only branches on `"fades"`)
- `borderWidth?: number` = `1` px
- `borderColor?: string` = `#7c05d8`
- `backgroundColor?: string` = `#00000033`
- `iconWidth?: number` = CSS default if omitted (`clamp(3rem, 7vw, 5rem)`)
- `isPlay?: boolean` = `true`
- `pauseOnHoverActive?: boolean` = `false`
- `durationMs?: number` = `30000`

Fades public contract (`src/types.ts:28-33`, `Slider.tsx:7-9`, `fade-out-slider.tsx:40-118`):

```ts
<Slider variant="fades" brandsList={brands} gap={48} speed={1} iconWidth={5} />
```

- `variant: "fades"` is required to select it.
- Only shared `brandsList`, `iconWidth`, plus `gap?: number` and `speed?: number` are accepted by the discriminated type; running border/play/duration props do not apply.
- `gap` is rendered in **pixels**; omission uses CSS `clamp(10px, 8vw, 180px)` (`slider.css:68-74`).
- `speed` defaults to `1`, is a multiplier (not milliseconds), and non-positive values are clamped to `1` (`fade-out-slider.tsx:44-51`). Higher values shorten the 2-second logo interval and all animation timing.
- It creates one rotating column per brand, with 60ms/speed stagger; images use `alt={item.name}` and lazy loading (`fade-out-slider.tsx:79-113`). Empty lists render an empty track safely.

### Published registry evidence and viability

Commands run read-only:

```text
npm view react-tech-slider version dist-tags --json
npm view react-tech-slider@1.9.3 dist.tarball exports peerDependencies --json
curl -Ls https://registry.npmjs.org/react-tech-slider/-/react-tech-slider-1.9.3.tgz | tar -xzOf - package/dist/types.d.ts
curl -Ls ...1.9.3.tgz | tar -xzOf - package/dist/index.js | grep ...
```

Registry `latest` is `1.9.3`; tarball is `https://registry.npmjs.org/react-tech-slider/-/react-tech-slider-1.9.3.tgz`. Published `dist/types.d.ts` includes `FadesSliderProps` with required `variant: "fades"`, `gap?: number`, and `speed?: number`; published JS contains `rts-fade-out-container`. React peer is `^19.1.0`, ReactDOM peer is `^17 || ^18 || ^19`, compatible with scaffold React/ReactDOM `19.2.7`.

**Decision: the approved published-package choice is currently viable for fades.** Pin/specify at least `1.9.3`; older `1.8.x` used by the old demo must not be assumed to expose the same contract.

### Current scaffold constraints

- Keep Vite React TypeScript: Vite `^8.1.1`, React/DOM `^19.2.7`, TypeScript `~6.0.2`, ESLint 10 (`package.json:6-28`).
- Actual installed resolution is Vite `8.1.5`, React `19.2.7`, TypeScript `6.0.3` (`pnpm list --depth 0`).
- `react-tech-slider` is absent from both manifest and lock; implementation will require the explicitly approved registry dependency change in a later phase.
- No test runner, DOM test library, icon library, CSS framework, or component kit exists. Prefer platform controls and project CSS unless proposal explicitly justifies additions.
- App is only `Hola Mundillo`; root runs in StrictMode. No existing design system or source architecture must be preserved.

## Architecture

Recommended one-page product architecture:

1. **Typed showcase model:** a discriminated `variant` state plus separate running/fades settings. Preserve each variant’s edits when switching; derive `SliderProps` and code from the same normalized model to prevent drift.
2. **Fixture data:** small local typed `Brand[]` sets. Prefer stable local assets or explicitly handled remote failures; avoid making the product depend on many third-party hosts.
3. **Sections:** hero/package identity; interactive playground; install tabs (`npm install react-tech-slider`, `pnpm add react-tech-slider`); generated TypeScript/JSX usage; variants/features; API summary; package/repository/license footer.
4. **Playground composition:** controls, preview shell, generated code, and copy feedback as focused components. Do not mirror package internals or reimplement animation.
5. **Control taxonomy:**
   - common: variant, dataset, icon width;
   - running only: border width/color, background, play/pause, pause-on-hover, duration in ms;
   - fades only: gap in px, speed multiplier;
   - preview-only: desktop/tablet/mobile viewport presets and reset. Clearly label preview controls as non-package props.
6. **Code generation:** omit default props where useful, always emit exact public names/types, emit `variant="fades"` when selected, include a compact `Brand[]` example/import, and derive npm/pnpm commands from one package constant.

Responsive behavior:

- Wide: controls and preview side-by-side, with preview dominant.
- Narrow: preview first (so edits remain visible), controls below or in an accessible disclosure; install/code tabs wrap or horizontally scroll without clipping.
- Viewport presets should constrain the preview container rather than spoof browser globals. Ensure package’s 90%-width running wrapper and wide fade gaps are observable at each preset.
- Keep touch targets at least ~44px and prevent horizontal page overflow from code blocks/fade tracks.

Accessibility:

- Native labeled fieldsets, inputs, buttons, and tabs with keyboard semantics; expose numeric units/ranges and validation text.
- Variant-specific controls should be removed from tab order when hidden.
- Copy actions need an `aria-live` success/failure message; selected viewport/install tab must not rely on color alone.
- Respect `prefers-reduced-motion` at the showcase layer (offer a prominent pause and/or reduced-motion default). Package CSS itself has no reduced-motion media query, and fades exposes no pause prop; document this limitation rather than implying full control.
- Logo alt text comes from `Brand.name`; decorative duplicate logos may be noisy to screen readers, a package-level limitation.

Testing needs for implementation/verification:

- build, TypeScript, and ESLint pass;
- state/prop derivation tests for every control and both discriminated variants;
- generated-code snapshots/assertions using exact prop names, units, omitted defaults, and valid JSX;
- keyboard/tab semantics and accessible labels; copy feedback behavior;
- responsive checks at mobile/tablet/desktop and overflow checks;
- smoke rendering of registry package in both running and fades modes, including empty/small lists, pause toggles, non-positive fade speed, and failed logo loading;
- reduced-motion/manual animation check. A test dependency decision remains for proposal/design because none exists now.

Risks and unknowns:

- `fades` builds N rotated arrays of N items (quadratic DOM); use modest showcase data.
- Fade columns/items have fixed 80px height and absolute positioning; long lists and extreme logo dimensions need visual testing.
- Fades cannot pause through public props, which complicates reduced-motion compliance.
- Running `durationMs <= 0` is not sanitized; constrain UI to a safe positive range.
- IDs are keys and must be unique per list; duplicate IDs can destabilize rendering.
- Remote assets can fail or track users; local asset licensing/source remains a product decision.
- Whether generated code should be minimal or fully explicit, and whether registry version is exact-pinned or caret-ranged, should be fixed in proposal.

## Start Here

Open `C:/Users/anton/OneDrive/Desktop/React-Tech-Slider/react-tech-slider/src/types.ts` first. It is the authoritative discriminated API and should drive control visibility, preview props, and generated code. Then confirm runtime/default behavior in the two component files before drafting the proposal.

```acceptance-report
{
  "criteriaSatisfied": [
    {
      "id": "criterion-1",
      "status": "satisfied",
      "evidence": "Completed read-only SDD exploration without modifying application source, manifests, lockfiles, dependencies, or external projects; wrote only the runtime-authorized context artifact."
    },
    {
      "id": "criterion-2",
      "status": "satisfied",
      "evidence": "Report includes exact source paths/line ranges, registry version/tarball commands, published type/runtime evidence, current dependency state, architecture recommendations, and explicit fades viability decision."
    }
  ],
  "changedFiles": [
    ".pi-subagents/artifacts/outputs/3653cabf/context.md"
  ],
  "testsAddedOrUpdated": [],
  "commandsRun": [
    {
      "command": "npm view react-tech-slider version dist-tags --json",
      "result": "passed",
      "summary": "Confirmed latest registry release is 1.9.3."
    },
    {
      "command": "npm view react-tech-slider@1.9.3 dist.tarball exports peerDependencies --json",
      "result": "passed",
      "summary": "Confirmed root exports, tarball, and React peer compatibility."
    },
    {
      "command": "curl -Ls <1.9.3 tarball> | tar -xzOf - package/dist/types.d.ts/package/dist/index.js",
      "result": "passed",
      "summary": "Confirmed published fades type contract and fade runtime marker without installation."
    },
    {
      "command": "pnpm list --depth 0",
      "result": "passed",
      "summary": "Confirmed actual scaffold dependency resolutions and absence of react-tech-slider."
    },
    {
      "command": "git status --short",
      "result": "failed",
      "summary": "Runtime working directory is not a Git repository, so staged-file status could not be independently inspected."
    }
  ],
  "validationOutput": [
    "Registry latest=1.9.3; published dist/types.d.ts declares FadesSliderProps and dist/index.js contains fade implementation marker.",
    "Current dependency listing contains 14 packages and no react-tech-slider.",
    "Only the authorized output context artifact was written by this exploration."
  ],
  "residualRisks": [
    "Git staging state is unverifiable because the provided project directory has no .git metadata.",
    "The required runtime output override prevented writing openspec/changes/build-interactive-slider-showcase/explore.md directly; parent must promote/copy this content if that SDD artifact is required."
  ],
  "noStagedFiles": true,
  "diffSummary": "Added one read-only exploration report artifact; no product code or dependency files changed.",
  "reviewFindings": [
    "no blockers in the exploration evidence; published-package fades viability is confirmed for 1.9.3"
  ],
  "manualNotes": "noStagedFiles reflects that this agent staged nothing; repository-wide staging could not be checked because cwd is not a Git worktree."
}
```
