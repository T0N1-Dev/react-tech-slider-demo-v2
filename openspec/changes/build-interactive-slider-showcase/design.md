# Technical Design: Interactive Slider Showcase

## Phase Envelope

- **status:** complete
- **executive_summary:** The showcase will remain a single Vite/React/TypeScript page and consume the published `react-tech-slider` package. A small reducer owns normalized playground state, while one pure projection layer produces both package props and a code-generation model so variant props cannot diverge. Remote logos are resolved before they reach the URL-only package API, with data-URL fallbacks and preview-level image-error capture. A preview-only error boundary contains package failures. Strict TDD will be enabled proportionately with Vitest, jsdom, and Testing Library, and implementation must record RED, GREEN, TRIANGULATE, and REFACTOR evidence for each behavior slice.
- **artifacts:** `openspec/changes/build-interactive-slider-showcase/design.md` and Engram topic `sdd/build-interactive-slider-showcase/design`
- **next_recommended:** Create implementation tasks that begin with the test-harness slice, then implement the pure model/projection, asset resolution, playground interactions, preview containment, and responsive page in dependency order.
- **risks:** The package exposes no fades pause control; a remote image can still fail after successful preflight; jsdom cannot prove real package animation, layout overflow, visual contrast, or browser clipboard behavior; the fades implementation grows quadratically with dataset size; the single-PR plan must be reassessed if cohesion or reviewer burden becomes unsafe.
- **skill_resolution:** none

## 1. Design Drivers and Decisions

This design follows these constraints from the approved proposal and delta specification:

1. The application remains one responsive Vite page. No router, backend, persistence, analytics, CSS framework, UI kit, or package-source link is introduced.
2. `react-tech-slider` is used through its published package root. The showcase does not reproduce either animation.
3. Running and fades are treated as a discriminated public API, not as one bag of optional props.
4. Only finite, normalized values enter the package or generated source.
5. The preview and source are projections of the same normalized invocation model.
6. Remote asset failure is handled outside the package because `Slider` accepts URL strings and has no image callback.
7. Package rendering is isolated from the rest of the adoption page by an error boundary.
8. The visual system is project CSS plus native HTML controls. Small decorative icons, if used, are local inline SVGs; no icon dependency is justified.
9. Automated tests cover deterministic state, DOM semantics, failure flows, and integration contracts. Real layout, motion, network, and visual quality remain explicit manual acceptance work.

## 2. One-Page Architecture and Composition

`src/App.tsx` is the page composition root. It owns no field-by-field control logic. Its responsibilities are to render the editorial sections in this order:

1. `Hero` — package identity, concise value proposition, resource links, and an in-page link to `#playground`.
2. `Playground` — live preview, variant/package controls, preview presets, reset, generated source, and fades limitation disclosure.
3. `InstallGuide` — npm/pnpm tabs and command copying.
4. `PackageGuide` — concise variant, feature, and public-API guidance, including the public-root import rule and animation limitations.
5. `SiteFooter` — distinct npm package and repository links.

The playground is the primary visual surface. Its DOM places the preview before the control panel so narrow layouts expose the result first. At the wide breakpoint, CSS Grid presents a bounded control column beside a larger preview/code column. Source order remains logical without CSS-only focus reordering.

`App` does not catch preview errors globally. Only the package render subtree is wrapped, so hero, controls, source, install commands, disclosures, and links survive a package failure.

## 3. Intended File Tree and Module Boundaries

Implementation should use the following tree. Tests stay beside the behavior they specify; there is no generic utility or component library layer.

```text
package.json
pnpm-lock.yaml
vitest.config.ts
src/
  App.tsx                         # One-page section composition only
  main.tsx                        # Existing React root; imports styles.css
  styles.css                     # Entire dark editorial/responsive system
  test/
    setup.ts                      # jest-dom registration and stable browser shims
  showcase/
    constants.ts                 # Package name/URLs, commands, preset widths
    model.ts                     # State, reducer, normalization, canonical invocation
    model.test.ts
    codegen.ts                   # Invocation-to-source renderer
    codegen.test.ts
    brands.ts                    # Remote fixtures, validation, fallback data URLs
    brands.test.ts
    useResolvedBrands.ts         # Client preflight and terminal URL state
    useResolvedBrands.test.tsx
    components/
      Playground.tsx             # State owner and data-flow coordinator
      Playground.test.tsx
      ControlPanel.tsx           # Active-discriminant native controls
      PreviewPanel.tsx           # Canvas, asset capture, empty/data states
      PreviewErrorBoundary.tsx   # Package-only error containment
      PreviewErrorBoundary.test.tsx
      GeneratedCode.tsx          # Source display and copy action
      InstallGuide.tsx           # Accessible tabs and command copy
      InstallGuide.test.tsx
      CopyButton.tsx             # Clipboard state and aria-live feedback
      CopyButton.test.tsx
  App.test.tsx                   # Page-level landmarks and links
```

Static hero, guide, and footer markup remains in `App.tsx` until size or reuse justifies extraction. Tiny decorative SVGs remain inline beside their text labels; no one-use `Icon` abstraction is required.

Boundary rules:

- `model.ts` and `codegen.ts` are pure and cannot import React.
- `brands.ts` is pure and owns fixture integrity and deterministic fallback URL generation.
- `useResolvedBrands.ts` owns browser image preflight only; it does not own playground settings.
- `Playground.tsx` is the only owner of package-setting state.
- `ControlPanel.tsx` receives state and typed dispatch callbacks; it never constructs `SliderProps`.
- `PreviewPanel.tsx` receives already-derived preview props and does not know how code is generated.
- `GeneratedCode.tsx` receives a completed string and does not inspect state.
- `InstallGuide.tsx` owns install-tab selection independently so playground reset cannot change it.
- `CopyButton.tsx` owns only transient copy feedback.

## 4. State Model, Defaults, Normalization, and Reset

### 4.1 Persisted session state

The state retains both variant stores while exposing a discriminated active configuration:

```ts
type SliderVariant = "running" | "fades";
type ViewportPreset = "desktop" | "tablet" | "mobile";
type DatasetId = "core" | "frontend";

interface SharedSettings {
  datasetId: DatasetId;
  iconWidth: number;
}

interface RunningSettings {
  borderWidth: number;
  borderColor: string;
  backgroundColor: string;
  isPlay: boolean;
  pauseOnHoverActive: boolean;
  durationMs: number;
}

interface FadesSettings {
  gap: number;
  speed: number;
}

interface PlaygroundState {
  variant: SliderVariant;
  viewport: ViewportPreset;
  shared: SharedSettings;
  running: RunningSettings;
  fades: FadesSettings;
}

type ActiveSliderConfig =
  | { variant: "running"; shared: SharedSettings; settings: RunningSettings }
  | { variant: "fades"; shared: SharedSettings; settings: FadesSettings };
```

The reducer accepts field-specific actions rather than a generic string-path update. This lets TypeScript prevent, for example, assigning `speed` to running state. Variant-specific groups are conditionally mounted; inactive controls therefore cannot remain in the tab order.

Install selection, clipboard status, logo-resolution status, and preview retry keys are intentionally outside `PlaygroundState`. They are UI/transient state and never become package props or generated code.

### 4.2 Documented initial values

```text
variant: running
viewport: desktop
datasetId: core
iconWidth: 5 rem
running.borderWidth: 1 px
running.borderColor: #7c05d8
running.backgroundColor: #00000033
running.isPlay: true
running.pauseOnHoverActive: false
running.durationMs: 30000 ms
fades.gap: 48 px
fades.speed: 1×
install tab: npm (owned separately and not reset)
```

At first load, `createInitialPlaygroundState(reduceMotion)` changes only `running.isPlay` to `false` when `matchMedia("(prefers-reduced-motion: reduce)")` matches. The captured session default is visibly explained near playback. Reset returns to that same captured initial state, so behavior is deterministic within the page session. This is not claimed as full reduced-motion support: fades still cannot be paused through the public API.

### 4.3 Normalization

State always contains committed valid values. Text fields may keep an ephemeral draft locally until commit, but a draft never enters `PlaygroundState`.

```ts
interface NumericDomain {
  min: number;
  max: number;
  step: number;
}

normalizeNumber(raw, domain, previous):
  parse Number(raw)
  if non-finite or empty => return previous plus validation error
  clamp to [min, max]
  quantize from min to the nearest step
  remove floating-point residue based on step precision
  return normalized value and optional correction message
```

Domains are exactly those in the specification:

- `iconWidth`: 1–10, step 0.25 rem
- `borderWidth`: 0–8, step 1 px
- `durationMs`: 5,000–120,000, step 1,000 ms
- `gap`: 0–180, step 4 px
- `speed`: 0.25–4, step 0.25×

Color controls use a validated text field as the sole authoritative value, paired with a non-interactive color swatch preview. A native `<input type="color">` is intentionally not used because it cannot portably round-trip the alpha-bearing default `#00000033` or arbitrary valid CSS colors. On text commit, `CSS.supports("color", candidate)` validates the value. Empty/invalid values keep the previous valid color and produce adjacent validation text. The pure normalization function accepts an `isValidColor` callback so tests do not depend on jsdom's incomplete CSS implementation. Tests cover the alpha default and a valid non-hex CSS color.

Every control label includes its unit and a visible normalized output. Range inputs also expose `min`, `max`, `step`, and the current value through native semantics. Validation is associated with `aria-describedby`; invalid drafts use `aria-invalid="true"`.

### 4.4 Reset and focus

`RESET_PLAYGROUND` replaces `PlaygroundState` with the captured initial state in one reducer transition. It resets selected variant, viewport, dataset, shared settings, and both variant stores. It does not affect the separately owned install tab.

Variant selection is a labeled native radio group. After a variant switch, focus remains on or is explicitly returned to the selected variant radio. This guarantees a predictable target if a previously focused variant-specific subtree is removed. Reset returns focus to the reset button after announcing completion; it does not navigate.

## 5. Single Projection for Preview Props and Generated Source

The implementation must not independently construct JSX props in `PreviewPanel` and string-concatenate a second interpretation in `GeneratedCode`. `model.ts` instead creates one typed invocation descriptor:

```ts
type PropEntry<Name extends string, Value> = {
  name: Name;
  value: Value;
  source: "always" | "omit-when-package-default";
};

type RunningPropEntry =
  | PropEntry<"iconWidth" | "borderWidth" | "durationMs", number>
  | PropEntry<"borderColor" | "backgroundColor", string>
  | PropEntry<"isPlay" | "pauseOnHoverActive", boolean>;

type FadesPropEntry =
  | PropEntry<"iconWidth" | "gap" | "speed", number>;

type SliderInvocation =
  | {
      variant: "running";
      dataset: ValidatedBrandDataset;
      props: readonly RunningPropEntry[];
    }
  | {
      variant: "fades";
      dataset: ValidatedBrandDataset;
      props: readonly FadesPropEntry[];
    };

type InvocationResult =
  | { status: "ready"; invocation: SliderInvocation }
  | { status: "empty"; guidanceCode: string }
  | { status: "invalid"; reason: string; guidanceCode: string };
```

`projectSlider(activeConfig, validatedDataset)` is exhaustive on `variant` and returns `InvocationResult`. For a ready result, it is the only function that selects public prop names. It creates one canonical `SliderInvocation` containing canonical brands, the variant discriminant, and an ordered typed prop-entry list. Each entry carries the normalized runtime value and the source-emission rule.

`toPreviewProps(invocation, resolvedBrands)` iterates those entries to construct `SliderProps`; `toCodeModel(invocation)` iterates the same entries to construct serializable JSX nodes. Both consumers exhaustively handle the invocation discriminant, but neither may select, add, or rename package props. Resolved-logo substitution occurs only while `toPreviewProps` replaces the canonical `brandsList` URLs with the same identities and ordering. Invariant tests compare the exact entry names and non-asset values consumed by both outputs. Representative generated running and fades TSX strings are compiled with the TypeScript compiler API against the installed `react-tech-slider` declarations, in addition to exact-string tests.

The invocation builder applies these emission rules:

- running entries are limited by type to `iconWidth`, `borderWidth`, `borderColor`, `backgroundColor`, `isPlay`, `pauseOnHoverActive`, and `durationMs`; the running discriminant may be omitted from source because omission selects running;
- fades entries are limited by type to `iconWidth`, `gap`, and `speed`; both preview and source add `variant="fades"` from the invocation discriminant;
- running source may omit exact package-default entries because omission reproduces the same result;
- fades source may omit `speed={1}`, but must emit `gap={48}` because the package's omitted gap is responsive rather than equivalent to 48;
- `iconWidth={5}` is emitted because the package's omitted CSS width is responsive and not equivalent to the controlled fixed value;
- numeric entries become numeric JSX nodes, never prequoted strings.

`codegen.ts` only renders the `SliderCodeModel` produced from the invocation entries; it cannot choose props. It always emits a package-root import, a minimal `Brand[]` declaration, and the invocation. Exact-string tests, forbidden-name assertions, entry-parity tests, and generated-TSX compilation protect the contract.

Remote resolution is a deliberate transport boundary. The invocation and generated example retain the validated canonical dataset. Immediately before rendering, `toPreviewProps(invocation, resolvedBrands)` substitutes only `brandsList` URLs while preserving each brand's ID, name, dimensions, and order. Tests assert that all prop entries and brand identities are identical between the invocation, preview, and source model. Transient fallback URLs are never copied into consumer guidance because a network incident must not mutate adoption code.

## 6. Brand Integrity and Remote Logo Fallback

### 6.1 Curated data and validation

`brands.ts` exports two modest curated lists, each capped at six brands. Each canonical item has a stable unique numeric ID, non-empty name, HTTPS logo URL, and optional dimensions. Six items bound fades expansion to approximately 36 rendered image items rather than allowing arbitrary quadratic growth.

`validateBrandDataset` checks, before projection:

- the list is non-empty for normal rendering;
- IDs are finite and unique within the selected list;
- names are non-empty after trimming;
- image values are non-empty HTTPS URLs in canonical fixtures.

An empty list returns an explicit empty result. Invalid identity returns a data-error result; neither is passed to `Slider`. Tests inject empty/invalid fixtures even though the first-slice UI does not accept arbitrary data.

### 6.2 Feasible client-side preflight

The package accepts `img: string` and offers no image callbacks. The showcase therefore resolves strings before passing the list:

```ts
type AssetStatus =
  | { state: "pending" }
  | { state: "ready"; url: string }
  | { state: "failed"; fallbackUrl: string };
```

`useResolvedBrands(canonicalBrands)` performs these steps:

1. Build a deterministic SVG data URL for every brand from its initials/name and stable accent. It has the same intended slot dimensions, requires no network, and remains readable.
2. Initially materialize pending brands with that fallback URL, so broken-image chrome is never shown while remote status is unknown.
3. For each distinct canonical URL, create one browser `Image`, attach `onload` and `onerror`, then assign the URL. `decode()` may be used after load when available, but decode rejection is treated as failure.
4. On success, mark the URL `ready`; the package receives the canonical URL, normally from browser cache.
5. On failure, mark it terminal `failed`; the package continues receiving the fallback data URL. No timer or automatic retry is scheduled.
6. Guard callbacks with an effect generation token and detach handlers on cleanup so stale datasets cannot update current state.

Image-element loading is appropriate here because displaying an image does not require reading response bytes and therefore does not require CORS-enabled `fetch`. Canvas conversion and blob creation are intentionally not used because cross-origin images commonly taint canvas or reject fetch.

A preflight success cannot guarantee the package's later `<img>` will never fail because the resource can disappear between requests. `PreviewPanel` therefore adds `onErrorCapture` to the preview container. If an image inside the package fails and its `currentSrc` matches a canonical ready URL, it reports that URL to `useResolvedBrands`, which terminally marks only that source failed and rerenders with the data URL. Errors from already-generated fallback URLs are not retried. This capture is a showcase containment mechanism, not a package callback or package patch.

The fallback preserves ID, name, order, width, and height. The package continues to receive meaningful `Brand.name` values for its alt text. Broad failure affects only URL resolution; controls, code, install guidance, links, and disclosures are independent.

## 7. Preview Rendering, Error Boundary, and Recovery

`PreviewPanel` handles three pre-render states:

- valid non-empty dataset: render the published `Slider` with materialized props;
- empty dataset: show a deliberate message that `brandsList` is required;
- invalid dataset: show a contained data error naming unique IDs and meaningful names as requirements.

For empty or invalid data, `InvocationResult` supplies a clearly labeled static guidance snippet built from the documented valid initial dataset. The UI states that this is integration guidance rather than the unavailable current preview. Invalid data never reaches `Slider`, and canonical valid guidance—not fallback URLs or invalid records—remains copyable.

For a valid dataset, only this subtree is guarded:

```text
PreviewPanel frame and preset label
  PreviewErrorBoundary key={retryKey}
    asset-error capture container
      Slider from "react-tech-slider"
```

`PreviewErrorBoundary` is a small class component because React has no function-component error-boundary primitive. It catches render/lifecycle errors below it and renders an in-canvas `role="alert"` message: “Live preview unavailable.” It exposes:

- **Retry preview** — increments a dedicated retry counter and remounts the boundary with the current normalized projection;
- **Reset settings and retry** — dispatches the atomic playground reset, increments the same retry counter, and retries documented initial state.

Only the dedicated retry counter keys the boundary; ordinary setting edits, viewport changes, install tabs, and copy status do not remount it. Recovery is explicit after a failure. The preview heading/status target lives outside the keyed boundary and is programmatically focused after retry or reset activation, so focus does not disappear with the fallback buttons. A repeated failure is announced again by the alert while remaining contained.

The boundary does not wrap controls, generated source, install tabs, package links, or fades disclosure. Development logging may use `console.error`; no telemetry or network submission is added. Tests suppress expected React error output only within the relevant test.

## 8. Install Tabs, Copy Feedback, and Keyboard Semantics

`constants.ts` is the single authority, using the canonical URLs from the published package metadata:

```ts
PACKAGE_NAME = "react-tech-slider"
PACKAGE_URL = "https://www.npmjs.com/package/react-tech-slider"
REPOSITORY_URL = "https://github.com/T0N1-Dev/react-tech-slider"
INSTALL_COMMANDS = {
  npm: "npm install react-tech-slider",
  pnpm: "pnpm add react-tech-slider"
}
```

Package links and generator imports derive from `PACKAGE_NAME`; commands are exact constants to avoid accidental grammar generation.

`InstallGuide` implements an automatic-activation, single-select WAI-ARIA tab set:

- container `role="tablist"` with an accessible name;
- each tab is a `<button role="tab">` with `aria-selected`, `aria-controls`, and roving `tabIndex` (`0` selected, `-1` otherwise);
- Arrow Left/Right wrap, Home selects/focuses npm, End selects/focuses pnpm;
- clicking, Enter, or Space uses native button activation;
- the active command is in `role="tabpanel"`, labeled by its tab;
- visible text/checkmark and programmatic state convey selection in addition to color.

`CopyButton` receives the exact current string. It calls `navigator.clipboard.writeText` only from activation, catches synchronous absence and asynchronous rejection, and uses a local discriminated status:

```ts
type CopyStatus =
  | { state: "idle" }
  | { state: "success"; message: string }
  | { state: "error"; message: string };
```

A visible `aria-live="polite"` status announces success or manual-copy guidance on failure. Failure never clears, replaces, or hides the selectable `<code>` content. A short success timeout may restore the button label; cleanup prevents state updates after unmount. Generated source uses the same component but a separate status instance, so command and source feedback cannot overwrite each other.

## 9. Responsive Preview and CSS System

### 9.1 Preview presets

Preview-only constants are:

```text
desktop: max-width 960px
tablet:  max-width 768px
mobile:  max-width 390px
```

The preset changes a CSS custom property or data attribute on the preview canvas. It never changes `window`, browser globals, media-query mocks, or slider props. Each preset button uses visible text plus `aria-pressed`; the selected item also has a textual “Selected” marker or check icon, not color alone.

The canvas uses `width: min(100%, var(--preview-width))`, is centered, and has `overflow: hidden`/`overflow: clip` where supported. A containing frame has `min-width: 0` and `max-width: 100%`. Fade tracks cannot enlarge the document scroll area. Generated code uses `overflow-x: auto`, `max-width: 100%`, and an accessible label; only the code region may scroll horizontally.

### 9.2 Page layout

- Wide screens: two-column playground grid, approximately `minmax(18rem, 24rem) minmax(0, 1fr)`, preview dominant.
- Narrow screens: one column with preview, controls, generated code, then adoption guidance.
- All grid/flex children use `min-width: 0`.
- Page sections use bounded content width and responsive padding.
- Tab and preset groups wrap when necessary; they do not force page width.
- Primary buttons and tabs target at least 44×44 CSS pixels.
- The document must not rely solely on `body { overflow-x: hidden }` to conceal layout defects. A final `overflow-x: clip` may be a defensive safeguard, but manual scroll-width checks must still pass without hidden unreachable controls.

### 9.3 Dark editorial visual system

`src/styles.css` defines a small token system with CSS custom properties for canvas, elevated surfaces, preview surface, text, muted text, accent, warning, danger, borders, focus ring, radii, shadows, and spacing. Typography uses a system sans stack and a system monospace stack; no remote font is required. Restrained radial/linear gradients appear only in background accents and do not carry meaning.

Native controls are restyled consistently while preserving platform behavior. Focus uses a high-contrast `:focus-visible` outline. Selected, invalid, success, warning, and paused states include text/shape/icon cues. CSS provides print-safe and reduced-transparency-friendly fallbacks where practical. No Tailwind, CSS Modules requirement, styled-components, Radix, or component CSS framework is introduced.

## 10. Accessibility and Honest Motion Disclosure

- The page uses landmarks and ordered headings; the hero action targets a focusable playground heading or region.
- Fieldsets/legends group variant, viewport, and package controls.
- Every input has a programmatic label; units and constraints are associated descriptions.
- Inactive variant controls are unmounted, not visually hidden while focusable.
- Focus is restored to the selected variant control when a switch removes the active subtree.
- Toggle text states “Playing/Paused” and “Pause on hover on/off”; color is supplemental.
- Copy and reset results are announced without stealing focus.
- Logo names remain meaningful; the design discloses that package-rendered repeated logos may produce repeated alt announcements because that behavior is owned by the package.
- Text and control colors are chosen for WCAG contrast targets (4.5:1 normal text, 3:1 large text and essential boundaries), then verified manually with browser tooling.
- The running play control maps only to `isPlay`. A detected reduced-motion preference initializes running paused and this behavior is explained.
- Fades exposes no pause control. A persistent nearby `role="note"` states: “The fades variant cannot be paused through the current public API. This showcase does not claim full reduced-motion support.” The same limitation appears in variant/API guidance.
- The showcase does not override package animation CSS in a way that would make preview behavior differ from copied package usage.

## 11. Dependency and Script Decisions

### 11.1 Runtime

Add `react-tech-slider` as a normal application dependency at `^1.9.3`. This states the approved compatibility baseline while allowing compatible patch/minor releases. The lockfile provides reproducibility for the deployed showcase. Imports use only:

```ts
import { Slider, type Brand, type SliderProps } from "react-tech-slider";
```

No CSS subpath import is added; the package root is the public integration path.

No icon package or `Icon.tsx` abstraction is added. If copy, check, external-link, or warning decoration benefits from a glyph, its tiny inline SVG stays beside the relevant text and is `aria-hidden="true"`; accessible names come from the button or link text.

### 11.2 Proportionate test harness

Strict TDD cannot be satisfied by build and lint alone. Add these development dependencies, selecting releases compatible with the installed React 19/Vite 8/TypeScript versions during implementation:

- `vitest`
- `jsdom`
- `@testing-library/react`
- `@testing-library/user-event`
- `@testing-library/jest-dom`

Do not add Cypress, Playwright, a coverage service, Storybook, axe wrappers, or a browser farm in this first slice. Browser-level behavior is handled by the required manual pass.

Add scripts:

```json
{
  "test": "vitest run",
  "test:watch": "vitest"
}
```

`vitest.config.ts` uses the React Vite plugin already present, `environment: "jsdom"`, `setupFiles: ["./src/test/setup.ts"]`, globals disabled, and test cleanup through Testing Library. Tests import Vitest APIs explicitly. `setup.ts` registers jest-dom and only the minimal deterministic shims required by tests (`matchMedia`, clipboard per test, and image constructors per resolver test). It must not globally pretend layout or successful network behavior.

`pnpm test`, `pnpm build`, and `pnpm lint` become the automated verification commands. The existing build and lint commands remain unchanged.

## 12. Strict TDD Execution and Evidence

### 12.1 Resolving the missing-runner contradiction

The implementation starts with a tooling-only bootstrap before application behavior changes:

1. Add only the five test dependencies, scripts, Vitest config, and setup file needed to execute product tests.
2. Write the first real `model.test.ts` assertion for a running invocation before implementing `model.ts`.
3. Run `pnpm exec vitest run src/showcase/model.test.ts` and record the intended missing-behavior failure as **RED**.
4. Implement the minimum model behavior and rerun the same command for **GREEN**.
5. TRIANGULATE with the fades discriminant and forbidden running keys, then REFACTOR under the focused and full suites. No temporary sentinel test is created.

After bootstrap, every production behavior slice follows this evidence cycle:

- **RED:** add the smallest behavior assertion first; run a focused Vitest command; capture the expected failure and confirm it fails for the intended missing/wrong behavior, not configuration.
- **GREEN:** implement the minimum behavior; rerun the same focused command and capture success.
- **TRIANGULATE:** add at least one boundary, alternate variant, failure, or counterexample that would defeat a hard-coded solution. Capture its initial RED when it demands new behavior, then GREEN after generalization.
- **REFACTOR:** improve names/structure without changing behavior; rerun the focused file and all tests, then build and lint at the end of the slice.

Evidence is recorded in the SDD apply-progress artifact or implementation report with command, phase label, failing/passing test names, and concise output. A final green suite alone is not accepted as strict TDD evidence. Production code must not precede the corresponding first RED, except the tooling needed to make RED executable.

### 12.2 Test matrix mapped to the specification

| Specification area | Automated RED/GREEN/TRIANGULATE coverage | Manual evidence still required |
| --- | --- | --- |
| Published integration | Mock/spy package root export in component tests; assert both projection variants and no internal/CSS import in generated source | Confirm installed published package visibly performs both real animations |
| One-page flow | `App.test.tsx` asserts hero, playground target, guidance, install area, and distinct resource links | Editorial hierarchy and preview prominence |
| Variant controls | Keyboard/user-event switch tests; running/fades controls appear exclusively; round-trip preserves both stores | Natural focus order through the complete rendered page |
| Exact prop domains | Table-driven pure tests for every min/max, step, empty, NaN, Infinity, below/above range; color validator success/failure | Native range/color behavior in target browsers |
| State/reset | Reducer tests cover shared preservation, both variant stores, viewport/dataset reset, reduced-motion initial state; integration test proves install tab is unchanged | Reload starts a fresh session |
| Source synchronization | For each variant and changed prop, assert preview projection and code model share the normalized value; exact snippets assert numeric JSX, omissions, `variant="fades"`, root imports, and forbidden-name absence | Paste generated snippets into a real TSX consumer/build check if feasible during acceptance |
| Install tabs | Arrow Left/Right wrapping, Home, End, click, roving tabIndex, selected panel, exact copied command | Screen-reader announcement quality |
| Clipboard | Resolve/reject/absent clipboard tests; visible source retained; correct live success/error text; no false success | Real secure-context clipboard allow/deny behavior |
| Preview presets | State and `aria-pressed` tests; preset data attribute/width token changes; source model unchanged | Actual 960/768/390 canvas widths and document scroll-width at wide/mobile page sizes |
| Brand integrity | Unique/missing/empty validation tests; deterministic readable SVG data URL; identity/order preservation | Logo recognizability and fallback visual stability |
| Remote failures | Fake `Image` tests for pending, success, one failure, all failures, stale cleanup, no retry; captured post-preflight error marks only matching URL failed | Real remote host success, offline/blocked host, and late failure in browser devtools |
| Keyboard/accessibility | Label/name/state/range assertions; hidden controls absent; focus after switch; native button semantics; fades note presence | Full keyboard walkthrough, screen reader spot-check, focus visibility, contrast measurement, 44px targets |
| Motion disclosure | Running `isPlay=false` projection; reduced-motion initialization; no fades pause control; exact limitation note | Observe running pause and verify fades remains honestly unpausable |
| Preview containment | Boundary unit test with throwing child; retry/reset remount tests; surrounding controls/source/install/disclosure remain present | Force the real package subtree to fail and inspect contained visual recovery |
| Empty/data errors | Preview tests ensure package mock is not called and deliberate message remains local | Visual empty/error state quality |
| Scope boundaries | Static review of dependencies/imports and page structure | Confirm no routes, storage, analytics, backend requests, arbitrary editor, or package changes |
| Build/lint/test | CI/local commands must all exit zero | None beyond recording versions/environment |

Triangulation must be substantive. Examples: after the running default test passes, add fades and assert forbidden running keys; after one invalid number, table-test both boundaries and non-finite values; after one logo failure, simulate broad failure and a stale callback; after Arrow Right, test wrapping plus Home/End.

### 12.3 Manual acceptance checklist

The implementation report must record pass/blocker at representative page widths (approximately 1440, 1024/768, and 390 CSS pixels) for:

- real published running and fades behavior;
- every visible control, both inclusive boundaries, units, and invalid text commits;
- variant round-trip preservation and full reset while install selection persists;
- generated code updates and copyability;
- npm/pnpm keyboard tabs and exact commands;
- keyboard-only completion, focus after switches, visible focus, and non-color state indicators;
- no document horizontal overflow; only bounded code scrolling; fades contained in each preset;
- normal remote logos, one failed URL, broad/offline failure, and stable readable fallbacks;
- empty list, invalid ID/name fixture through a development test seam, clipboard denial, and forced preview throw;
- contrast using browser accessibility/color tooling;
- running pause, operating-system reduced-motion initialization, repeated package alt behavior, and the visible fades limitation disclosure;
- package and repository links and consistent package naming.

jsdom results must not be cited as proof of pixel layout, CSS overflow, computed contrast, real remote network/CORS behavior, actual clipboard permissions, animation timing, pause visuals, or screen-reader quality.

## 13. Data Flow, Failure Flow, and Ownership

### 13.1 Normal flow

```text
native control draft
  -> normalization/validation
  -> Playground reducer (committed valid state)
  -> selectActiveConfig (discriminated)
  -> validate selected canonical dataset
  -> projectSlider (one canonical invocation with typed prop entries)
       -> toPreviewProps + useResolvedBrands -> PreviewErrorBoundary -> published Slider
       -> toCodeModel -> codegen -> GeneratedCode
```

Viewport selection bypasses `projectSlider` and changes only the preview frame. Install selection stays inside `InstallGuide`. Copy status stays inside each `CopyButton`.

### 13.2 Failure flow

```text
invalid numeric/color draft
  -> keep/normalize prior committed state
  -> adjacent validation; package/source never see unsafe value

invalid/empty canonical data
  -> PreviewPanel data/empty state; Slider not invoked
  -> source remains available and explains required brandsList

remote preflight failure
  -> terminal failed status -> deterministic fallback URL
  -> settings/source/install unaffected

late package image failure
  -> preview onErrorCapture -> terminal failure for matching source URL
  -> rerender same identities with fallback URL; no retry loop

Slider render failure
  -> PreviewErrorBoundary fallback only
  -> Retry current normalized state or Reset settings and retry
  -> rest of page remains usable

clipboard rejection
  -> local error status and manual-copy message
  -> visible/selectable source remains unchanged
```

### 13.3 State ownership summary

| State | Owner | Reset by playground reset? | Enters package props/source? |
| --- | --- | --- | --- |
| Variant/shared/running/fades/viewport | `Playground` reducer | Yes | Package settings do; viewport does not |
| Captured reduced-motion session default | `Playground` initialization | Reused by reset | Only through normalized `isPlay` |
| Install tab | `InstallGuide` | No | No |
| Clipboard result | Each `CopyButton` | No | No |
| Asset resolution | `useResolvedBrands` | No automatic reset/retry | Preview URLs only; not source bookkeeping |
| Preview failure/retry key | `PreviewPanel` | Recovery coordinates with reset | No |
| Field draft/validation message | Individual field component | Unmounted/reset with controls | Only committed valid value enters projection |

## 14. Fades Performance Safeguards

The published fades implementation expands an `N`-brand list into approximately `N²` rendered items. The showcase therefore:

- caps curated datasets at six brands and provides no arbitrary list editor;
- rejects duplicate/invalid fixtures before render;
- memoizes validated canonical datasets, resolved arrays, active config, and projection by their actual dependencies;
- keeps fallback SVG strings deterministic and cached by brand identity;
- preflights each distinct URL once per mounted dataset and never retries terminal failures automatically;
- avoids remounting `Slider` for viewport, install-tab, or copy-status changes;
- constrains `speed` to 0.25–4× and `gap` to 0–180px;
- contains paint/layout within the preview using `overflow` and, where safe, `contain: layout paint` on the canvas rather than the package element itself;
- avoids observers or animation-frame loops for layout sizing;
- validates performance manually with fades at both speed extremes and all three preview presets.

No virtualization or package animation rewrite is proposed because either would change the component being demonstrated.

## 15. Delivery, Review, and Rollback Boundaries

### 15.1 Delivery slices

Implementation should remain single-writer and proceed in reviewable dependency order:

1. Test harness and evidence bootstrap.
2. Pure state, normalization, dataset validation, projection, and code generation.
3. Remote asset resolver and fallback behavior.
4. Controls, install tabs, copy state, and preview error boundary.
5. Page composition and dark responsive CSS.
6. Full automated verification and documented manual acceptance.

Each slice completes its RED/GREEN/TRIANGULATE/REFACTOR evidence before the next. Do not edit the `react-tech-slider` source, add a backend/proxy, or broaden scope to routing/documentation infrastructure.

The session uses a single PR by default and no fixed changed-line threshold. Before `sdd-apply`, tasks must still forecast qualitative reviewer burden from cohesion, risk, generated lockfile noise, CSS volume, and the number of behavioral slices. The delivery slices below are checkpoints within that single PR unless the forecast shows the change has become incoherent or unsafe to review; only then should the parent pause for a new delivery decision. Logical review boundaries are pure model/codegen, failure containment/assets, interactions/accessibility, and CSS/responsive behavior. Fresh review should emphasize reliability for state/source parity and resilience for remote/preview/clipboard failures; readability review should confirm the page did not grow unnecessary abstractions.

Dependency review must confirm only the published package and proportionate test stack were added. Lockfile changes are expected; package source, unrelated manifests, and external repositories are not.

### 15.2 Rollback

A full rollback removes the one-page showcase modules/styles/tests, `vitest.config.ts`, the added test scripts/dependencies, `react-tech-slider`, and their lockfile entries, then restores the current Vite placeholder imports and content. There is no persisted data, migration, route, backend, service worker, or package API change.

If only remote logos are unacceptable, replace canonical remote fixtures with a separately approved controlled asset strategy while retaining the reducer, projection, controls, error boundary, and adoption guidance. Do not introduce a backend as an emergency fallback without a new decision.

## 16. Rejected Alternatives

1. **Copy or modify package animation source.** Rejected because the showcase must prove the published consumer experience and package changes are out of scope.
2. **Use one loose object with every optional prop.** Rejected because it permits unsupported running/fades combinations and makes source drift likely.
3. **Construct preview JSX and source strings independently.** Rejected because every new control would require two mappings with no structural parity guarantee.
4. **Attach an image callback prop to `Slider`.** Rejected because no such public callback exists. Preflight plus preview error capture works with the URL-only contract without package changes.
5. **Use `fetch`/canvas to turn every remote logo into a blob/data URL.** Rejected because third-party CORS policy commonly blocks fetch or taints canvas. Browser image preflight is more compatible and still allows deterministic failure substitution.
6. **Use a backend image proxy or service worker.** Rejected as disproportionate, privacy-sensitive, and outside the no-backend first slice.
7. **Use only `img` error handling inside generated brand objects.** Rejected because brand records accept strings, not React image nodes or callbacks.
8. **Show broken remote URLs until they fail.** Rejected because the package owns the image elements and broken chrome/layout instability would be visible. Pending fallback avoids this.
9. **Inject showcase CSS to stop fades under reduced motion.** Rejected because it would demonstrate behavior copied usage does not receive and could be mistaken for package support. Honest disclosure is required.
10. **Add Tailwind, Radix, shadcn, a CSS-in-JS runtime, or a general component library.** Rejected because native controls and one stylesheet meet the one-page requirement with lower dependency and review cost.
11. **Add a full icon library.** Rejected because four optional decorative glyphs do not justify another runtime dependency.
12. **Use only build/lint plus manual testing.** Rejected because strict TDD is active and interactive state/source/failure contracts are deterministic and testable.
13. **Add Playwright/Cypress immediately.** Rejected as disproportionate to the first slice. The required browser/manual matrix covers the few claims jsdom cannot establish; browser automation can be proposed later if maintenance value is demonstrated.
14. **Persist settings in local storage.** Rejected because session persistence is explicitly unnecessary and would add reset/privacy semantics.
15. **Make viewport presets alter browser globals.** Rejected because presets are preview-only evaluation aids, not package props or device emulation.
16. **Allow arbitrary brand editing.** Rejected because it broadens scope and removes the dataset bound that protects fades performance.

## Review Findings and Residual Risks

### Review findings

- **no blockers:** `openspec/changes/build-interactive-slider-showcase/design.md` defines an implementation-ready architecture without application-code changes.
- **high:** `openspec/changes/build-interactive-slider-showcase/design.md` — fades cannot satisfy a complete pause/reduced-motion guarantee because the published API has no pause prop; the design requires explicit disclosure rather than a false control.
- **medium:** `openspec/changes/build-interactive-slider-showcase/design.md` — a remote asset can fail after successful preflight; preview-level captured image errors provide best-effort late recovery without backend or package changes.
- **medium:** `openspec/changes/build-interactive-slider-showcase/design.md` — the single-PR default still requires a qualitative cohesion and reviewer-burden forecast before apply; lockfile, tests, and CSS must not obscure behavioral review boundaries.

### Residual risks

- Browser cache/network races can briefly show a remote image between preflight success and a late failure before fallback state rerenders.
- Package-rendered duplicate logo alt text and unpausable fades behavior cannot be corrected without changing the package API.
- jsdom cannot validate real animation, layout containment, computed contrast, remote host policy, or secure-context clipboard permissions; acceptance depends on a recorded manual browser pass.
- Compatible caret upgrades of `react-tech-slider` may change behavior later; the lockfile limits immediate delivery variance, while future dependency updates require regression verification.

```acceptance-report
{
  "criteriaSatisfied": [
    {
      "id": "criterion-1",
      "status": "satisfied",
      "evidence": "The design artifact contains path-specific review findings with high/medium severities and a separate residual-risks section; it also specifies concrete module paths, interfaces, test files, commands, and failure boundaries."
    }
  ],
  "changedFiles": [
    "openspec/changes/build-interactive-slider-showcase/design.md"
  ],
  "testsAddedOrUpdated": [],
  "commandsRun": [],
  "validationOutput": [
    "Wrote exactly the requested technical design artifact and did not implement application code.",
    "The design resolves strict TDD with a proportionate Vitest/jsdom/Testing Library harness and explicit RED, GREEN, TRIANGULATE, and REFACTOR evidence rules.",
    "The design maps automated and manual verification to the approved specification, including package integration, state/source parity, remote failures, accessibility, containment, responsive behavior, and scope boundaries."
  ],
  "residualRisks": [
    "Fades cannot be paused through the published API and cannot claim full reduced-motion support.",
    "Remote images may still fail after preflight; late captured errors provide best-effort client-side recovery.",
    "Real layout, motion, contrast, network, clipboard, and screen-reader behavior require documented manual browser verification.",
    "The single-PR default may become unsafe if qualitative cohesion and reviewer-burden forecasting reveals obscured behavioral boundaries; that decision is not tied to a fixed line threshold."
  ],
  "noStagedFiles": true,
  "diffSummary": "Added one implementation-ready SDD design artifact; no application code, tests, manifest, lockfile, or other files were changed.",
  "reviewFindings": [
    "no blockers: openspec/changes/build-interactive-slider-showcase/design.md - requested design scope is complete without implementation",
    "high: openspec/changes/build-interactive-slider-showcase/design.md - published fades API has no pause control, so only honest limitation disclosure is feasible",
    "medium: openspec/changes/build-interactive-slider-showcase/design.md - remote image success cannot be guaranteed after preflight; late error capture is best-effort",
    "medium: openspec/changes/build-interactive-slider-showcase/design.md - single-PR delivery requires qualitative cohesion and reviewer-burden forecasting before apply"
  ],
  "manualNotes": "No tests were run because this phase produced design only. noStagedFiles attests that this agent did not stage files; repository-wide staging state was not inspected."
}
```
