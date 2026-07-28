# Technical Design: Refresh Showcase Controls and Datasets

## 2026-07-28 Sport fixture contract amendment

The current production `SPORT_BRANDS` is authoritative by explicit user decision: seven ordered IDs 1–7 for Puma, Reebok, Under Armour, The North Face, Nike, Adidas, and Fila, retaining current URLs/class names and using `{ transition: "width 1s ease", filter: "invert()" }` on every record. New Balance, Converse, and Asics are removed. Food and `MAX_DATASET_SIZE` remain 10. Earlier ten-record Sport design/evidence is historical and superseded. Fades produces 49 Sport images and 100 Food images.

## Phase contract

- **status:** complete
- **executive_summary:** Keep `Playground` as the only package-setting state owner and extend its existing reducer → validated invocation → preview/source pipeline. Add exact Core/Sport/Food fixtures, five live native ranges, alpha pickers whose hex-only model receives a derived `#RRGGBBAA` value, a bounded React-node source highlighter, and an inline install-copy presentation. The user-approved hero amendment reuses `CORE_BRANDS` and removes duplicate fixture data; no package implementation, private package CSS, further hero change, or second prop/source mapping is introduced.
- **artifacts:** `openspec/changes/refresh-showcase-controls-and-datasets/design.md`
- **next_recommended:** `tasks`. There is no blocking spec correction: the non-hex color compatibility gap is resolved by a dependency-free concrete-CSS-color-to-sRGB adapter. Tasks must retain a delivery-decision gate before apply because the forecast exceeds 400 changed lines.
- **risks:** Sport fades renders 49 images and Food renders 100 in the installed package; live controls rerender those trees; browser color conversion, picker interaction, layout containment, and network behavior need truthful browser verification; the implementation forecast exceeds the session review budget; the protected hero must remain byte-identical after its approved rebaseline.
- **skill_resolution:** `paths-injected`

## 1. Decisions and boundaries

The implementation is a refresh of the existing architecture, not a replacement.

1. `src/showcase/components/Playground.tsx` remains the only owner of canonical package settings.
2. `projectSlider` remains the only selector of public package props. Its `SliderInvocation` drives both `toPreviewProps` and `generateSliderCode`.
3. Canonical fixture URLs remain in the invocation and generated source. `useResolvedBrands` may replace only preview `img` values.
4. The runtime authority is the installed `react-tech-slider@1.10.1`. Its root export, prop types, sizing precedence, fades geometry, and approximate quadratic fades rendering are not wrapped or patched.
5. `react-colorful@5.8.0` is the approved picker dependency already represented in `package.json` and `pnpm-lock.yaml`. No additional runtime or highlighting dependency is added.
6. All new selectors belong to demo-owned classes. No `.rts-*`, `.wrapper`, `.item`, `.brand-slider`, or other package-private selector is added.
7. The user-approved 2026-07-28 amendment keeps the current `src/App.tsx` diff exactly: import `CORE_BRANDS`, remove the duplicate hero-local brands array, pass `brandsList={CORE_BRANDS}`, and set the existing hero Slider to `iconWidth={18}`. This reuses canonical fixture data and freezes the accepted hero width without changing the package boundary or any other hero markup/content. The extracted hero moved from historical baseline `2b40e750e89c920657832665f59749b0d97cf7a0069b884b938d99fc71d46346` through superseded intermediate `8c04b455f6ea3fe26b12a0a6e16e2c003e7a86297e168bc3eba73bf6dd3c7ca6` to the final accepted baseline `aa787e708db68498c3b051446d7416b9933b2455f238bcf49e346bee3b56bdee`; neither earlier hash is a forward expectation. No further App/hero change is permitted without another explicit user decision.
8. Unit G was blocked because that amended wiring first appeared outside its frozen scope; the explicit user approval and final artifact rebaseline resolve the blocker without another production edit.
9. No production implementation begins until tasks are complete and the over-budget delivery decision is recorded.

## 2. Fixture and dataset contract

### 2.1 Types, map, and maximum

`src/showcase/model.ts` changes only the dataset union:

```ts
export type DatasetId = "core" | "sport" | "food";
```

`src/showcase/brands.ts` owns the fixtures and named validation policy:

```ts
export const MAX_DATASET_SIZE = 10;

export const CORE_BRANDS = [/* exact records below */] as const
  satisfies readonly Brand[];
export const SPORT_BRANDS = [/* exact records below */] as const
  satisfies readonly Brand[];
export const FOOD_BRANDS = [/* exact records below */] as const
  satisfies readonly Brand[];
```

`src/showcase/components/Playground.tsx` keeps the default map close to the coordinator and makes exhaustiveness explicit:

```ts
const DEFAULT_DATASETS = {
  core: CORE_BRANDS,
  sport: SPORT_BRANDS,
  food: FOOD_BRANDS,
} as const satisfies Readonly<Record<DatasetId, readonly Brand[]>>;
```

The selector renders these options, in order: `Core`, `Sport`, `Food`. The values are `core`, `sport`, and `food`; `frontend` is removed from types, fixtures, defaults, UI, and tests.

`validateBrandDataset` accepts lengths 1–10 and rejects `> MAX_DATASET_SIZE` with a message that names the ten-item limit. ID uniqueness remains scoped to the one array passed to the validator. Sport uses IDs 1–7 and Food uses IDs 1–10; duplicates within either array are invalid.

### 2.2 Exact Core fixture

Core retains the current IDs, names, order, and URLs. Remove only the fixture-level `width` and `height` fields so every Core record inherits the shared `iconWidth`.

```ts
export const CORE_BRANDS = [
  {
    id: 1,
    name: "TypeScript",
    img: "https://cdn.simpleicons.org/typescript",
  },
  {
    id: 2,
    name: "React",
    img: "https://cdn.simpleicons.org/react",
  },
  {
    id: 3,
    name: "npm",
    img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1785109501/idTOrUuxMp_1785109477561_igg5qy.png",
  },
  {
    id: 4,
    name: "css",
    img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1746640784/purple-css-logo_xufnis.webp",
  },
  {
    id: 5,
    name: "GitHub",
    img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1739393991/github_ualv1s.png",
  },
  {
    id: 6,
    name: "pnpm",
    img: "https://cdn.simpleicons.org/pnpm",
  },
] as const satisfies readonly Brand[];
```

The hero now imports and reuses `CORE_BRANDS`; the former hero-local `brands` array and its duplicate values are intentionally removed. The hero remains outside playground state and retains its user-approved fixed `iconWidth={18}`.

### 2.3 Exact Sport fixture

The existing production literal is the design authority. It contains, in order, Puma, Reebok, Under Armour, The North Face, Nike, Adidas, and Fila with IDs 1–7, current URLs/class names, and no New Balance, Converse, or Asics. Every record uses this exact style shape:

```ts
style: { transition: "width 1s ease", filter: "invert()" }
```

Puma, Reebok, Under Armour, and The North Face retain `puma-icon`, `reebok-icon`, `under-armour`, and `northFace-icon` respectively. Nike, Adidas, and Fila omit `className`. `src/showcase/brands.ts` must not be edited for this amendment.

### 2.4 Exact Food fixture

```ts
export const FOOD_BRANDS = [
  {
    id: 1,
    name: "Papa Johns",
    img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111637/papa_dojmtq.svg",
    style: { transition: "width 1s ease" },
  },
  {
    id: 2,
    name: "Burger King",
    img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111638/burger-king_eyaxzl.svg",
    style: { transition: "width 1s ease" },
  },
  {
    id: 3,
    name: "SubWay",
    img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111637/subway_mtrhua.svg",
    style: { transition: "width 1s ease" },
  },
  {
    id: 4,
    name: "Oreo",
    img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111636/oreo_vfrh58.svg",
    style: { transition: "width 1s ease" },
  },
  {
    id: 5,
    name: "McDonalds",
    img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111635/mcdonalds_g2tuh2.svg",
    style: { transition: "width 1s ease" },
  },
  {
    id: 6,
    name: "KFC",
    img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111635/kfc_q9irnf.svg",
    style: { transition: "width 1s ease" },
  },
  {
    id: 7,
    name: "StarBucks",
    img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111635/starbucks_b4obmn.svg",
    style: { transition: "width 1s ease" },
  },
  {
    id: 8,
    name: "Fritos",
    img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111635/fritos_yuzj8p.svg",
    style: { transition: "width 1s ease" },
  },
  {
    id: 9,
    name: "Dunkin`Donuts",
    img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111633/dunkin-donuts_kiwq2h.svg",
    style: { transition: "width 1s ease" },
  },
  {
    id: 10,
    name: "Domino`s Pizza",
    img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111633/dominos-pizza_wddklm.svg",
    style: { transition: "width 1s ease" },
  },
] as const satisfies readonly Brand[];
```

### 2.5 Metadata validation, fallback, and serialization

Validation is non-normalizing. A valid result returns the original array reference and records; it never clones, trims, renames, reorders, or fills optional properties. In addition to the current finite ID, unique-within-list ID, non-empty name, and HTTPS URL checks, serialization safety is guarded at the validation boundary:

- optional `width` and `height`, when present, must be finite numbers;
- optional `className`, when present, must be a string and is preserved exactly, including case;
- optional `style`, when present, must be a non-null, non-array object whose enumerable own values are strings or finite numbers, the serializable subset used by React `CSSProperties` in these fixtures;
- no valid metadata field is stripped; invalid runtime-injected metadata yields the existing contained invalid-dataset flow rather than malformed source.

Both `materializeFallbackBrands` and `useResolvedBrands` continue using `{ ...brand, img: replacement }`. Tests must prove `style`, `className`, dimensions, identity, and order survive pending, ready, and failed transport states. Only `img` may differ in preview. The invocation retains canonical records, so code generation cannot observe a `data:` fallback.

`serializeBrand` in `src/showcase/codegen.ts` emits fields in this stable order: `id`, `name`, `img`, `width` if present, `height` if present, `style` if present, `className` if present. Strings and property keys use `JSON.stringify`. Style entries retain object insertion order; identifier-safe CSS keys may print bare, while custom or otherwise unsafe keys print as JSON strings. Style values print as JSON strings or finite numeric literals. An empty valid style prints `{}`; an absent style is omitted. This is source serialization only—no metadata object is rewritten.

Representative output is:

```ts
{
  id: 2,
  name: "Reebok",
  img: "https://res.cloudinary.com/dmfs1od9n/image/upload/v1744835608/reebok-crossfit_ger10e.svg",
  style: { transition: "width 1s ease", filter: "invert()" },
  className: "reebok-icon",
},
```

Compiler-API tests must compile a generated Sport record, a Food record with a backtick in its name, a record with `style.width`, and a record without optional metadata against the installed public `Brand` declaration.

## 3. Canonical data flow

### 3.1 Normal flow

```text
native control event
  -> field-specific typed action
  -> reducer normalization/validation
  -> one PlaygroundState
  -> selectDataset + validateBrandDataset
  -> projectSlider
  -> one typed SliderInvocation
       -> useResolvedBrands + toPreviewProps -> published Slider
       -> generateSliderCode -> GeneratedCode viewer + exact copy text
```

The rules are:

- UI components dispatch intents; they do not construct `SliderProps` or source fragments.
- The reducer is the normalization boundary for all five numeric values and both canonical colors.
- `projectSlider` reads committed state once and remains exhaustive by `variant`.
- `toPreviewProps` and `generateSliderCode` consume the same `SliderInvocation.props` entries. Neither reselects prop names from raw state.
- The viewer tokenizes the completed source string only for presentation. It does not regenerate, parse back, or mutate source.
- `CopyButton` always receives the original completed `source` prop, never DOM `textContent`.
- Viewport, picker draft/error, source tokens, line numbers, image status, copy status, retry keys, and install tab remain derived/transient state and never enter the invocation.

### 3.2 Variant isolation and reset

Running invocation entries remain exactly `iconWidth`, `borderWidth`, `borderColor`, `backgroundColor`, `isPlay`, `pauseOnHoverActive`, and `durationMs`. Fades entries remain exactly `iconWidth`, `gap`, and `speed`, plus the `variant="fades"` discriminant. Tests compare exact keys and forbid the opposite variant's fields in preview and source.

The reducer continues retaining shared, running, and fades stores across variant switches. `RESET_PLAYGROUND` restores the captured initial state: running, desktop, Core, icon width 5, border width 1, border `#7c05d8`, background `#00000033`, captured playback default, pause-on-hover false, duration 30000, gap 96, and speed 1. `controlsKey` may continue remounting field-local drafts during reset. Install selection is not in this reducer and remains unchanged.

## 4. Shared native `RangeField`

`NumericField` is replaced by one private shared `RangeField` in `ControlPanel.tsx`:

```ts
interface RangeFieldProps {
  id: string;
  label: string;
  unit: string;
  value: number;
  domain: NumericDomain;
  onChange: (raw: string) => void;
}
```

Its stable markup is:

```tsx
<div className="control-field range-field">
  <label htmlFor={id}>{label}</label>
  <input
    id={id}
    type="range"
    min={domain.min}
    max={domain.max}
    step={domain.step}
    value={value}
    onChange={(event) => onChange(event.currentTarget.value)}
  />
  <output htmlFor={id}>{value} {unit}</output>
</div>
```

There is no local numeric draft and no `onBlur` commit. React's range `onChange` dispatches each browser value immediately. The reducer still clamps and quantizes direct/programmatic actions, so the UI is not a second validation authority. Do not add Arrow/Home/End handlers: native range semantics are required and custom keyboard code risks changing step or endpoint behavior.

Use the exact existing `NUMERIC_DOMAINS` and these units:

| Field | Action | Domain | Output |
| --- | --- | --- | --- |
| Icon width | `SET_ICON_WIDTH` | 1–10, step 0.25 | `rem` |
| Border width | `SET_BORDER_WIDTH` | 0–8, step 1 | `px` |
| Duration | `SET_DURATION_MS` | 5000–120000, step 1000 | `ms` |
| Gap | `SET_FADES_GAP` | 0–180, step 4 | `px` |
| Speed | `SET_FADES_SPEED` | 0.25–4, step 0.25 | `×` |

Integration tests dispatch `fireEvent.change` and assert, before blur, the input value, associated `<output>`, latest mocked `Slider` prop, and generated numeric JSX. Cover all five controls, minimum/maximum, one interior step, running/fades round trips, reset, and exact variant absence. Keyboard browser behavior is not proven by jsdom; automated tests assert native type/domain and absence of custom key interception, while the browser matrix exercises Arrow keys, Home, and End.

## 5. `ColorField` and hex-picker compatibility

### 5.1 State ownership

Each running color renders one shared `ColorField` in `ControlPanel.tsx`. It owns only:

```ts
interface ColorDraftState {
  text: string;
  error: string;
}
```

Canonical `borderColor` and `backgroundColor` remain strings in `PlaygroundState`. The picker's hex is derived from the canonical string on every render and is not stored in reducer state. Therefore a picker representation cannot drift into a second package/source value.

Markup and behavior:

- A visible `<label>` names the text input (`Border color` or `Background color`).
- A surrounding `role="group"` and labelled relationship names the combined field.
- `HexAlphaColorPicker` receives an additional precise accessible label such as `Border color picker`; its internal Color, Hue, and Alpha sliders remain library-owned.
- The text input is always visible, uses `aria-invalid` on error, and references nearby error/help text with `aria-describedby`.
- Text edits update only local draft and clear stale error.
- Enter calls `commitDraft` without moving focus. Blur calls the same idempotent commit path. A valid commit trims and dispatches the canonical string; an invalid commit leaves the draft visible and leaves reducer/preview/source/picker unchanged.
- Picker `onChange` receives only library-produced hex. It clears text error, replaces the local draft with that hex, and dispatches immediately.
- A canonical change from picker or successful text commit synchronizes the text draft. Reset remounts controls through the existing `controlsKey`, clearing even an invalid draft when the canonical value was already equal to the default. Reset retains focus on the reset button; invalid Enter retains input focus; blur does not steal focus back.
- Variant unmount/remount preserves canonical running colors but intentionally discards uncommitted local text, consistent with drafts not being session settings.

### 5.2 Deterministic adapter for non-hex canonical colors

`HexAlphaColorPicker` is hex-only. Its installed runtime parses short/long hex and would interpret arbitrary strings such as `rebeccapurple` through invalid hex operations. Non-hex canonical values must never be passed to it.

Add `src/showcase/color.ts` with this boundary:

```ts
export interface ResolvedCssColor {
  canonical: string;
  pickerHex: string; // always #RRGGBBAA
}

export type CssColorResolver = (candidate: string) => ResolvedCssColor | null;
```

`resolveCssColor` performs these deterministic steps without a dependency:

1. Trim the candidate; reject empty input and context-dependent CSS-wide values (`currentColor`, `inherit`, `initial`, `unset`, `revert`, `revert-layer`) and values containing `var(`. These do not identify a self-contained color for a picker.
2. Fast-path `#RGB`, `#RGBA`, `#RRGGBB`, and `#RRGGBBAA`: validate hex digits, expand short channels, append `ff` when alpha is omitted, and return the trimmed input unchanged as `canonical`. Thus canonical `#00000033` is not rewritten, while the picker always receives eight digits.
3. For another concrete CSS color, assign it to a temporary document-owned probe, append the visually hidden probe, and read its computed `color`. Failure to assign/resolve returns `null`; remove the probe in `finally`.
4. Paint the resolved color into a cleared 1×1 default-sRGB canvas and read the unpremultiplied RGBA bytes with `getImageData`. To detect a canvas parser silently ignoring the value, perform the assignment twice from two different sentinel `fillStyle` values; both samples must produce the same RGBA bytes. Convert each byte with lowercase two-digit hex to `#rrggbbaa`.
5. Return `{ canonical: trimmedCandidate, pickerHex }`. If a browser has no usable 2D readback or cannot represent the resolved color, return `null` and show precise-entry validation instead of guessing.

This resolves the required examples deterministically:

```text
rebeccapurple -> canonical "rebeccapurple", picker "#663399ff"
transparent   -> canonical "transparent",   picker "#00000000"
#00000033     -> canonical "#00000033",     picker "#00000033"
```

The default-sRGB canvas deliberately produces an 8-bit sRGB picker projection. A wide-gamut concrete CSS color may be gamut-mapped for the picker while its canonical typed string remains unchanged in preview and source. If the user subsequently moves the picker, that interaction intentionally establishes a new hex canonical color. This is a bounded adapter, not a general CSS color parser.

`Playground` accepts an internal `colorResolver` injection with `resolveCssColor` as its default. Tests inject a deterministic resolver, avoiding false reliance on jsdom canvas/CSS behavior. The reducer keeps a defensive `isValidColor` callback derived from the same resolver so direct actions cannot bypass the UI. `normalizeColor` remains pure and preserves the previous canonical value on rejection.

This design does **not** require a spec correction: named colors and `transparent` remain valid precise entries, alpha is retained, canonical source stays exact, and the picker receives only supported hex. Browser acceptance must verify the production probe/canvas path for hex, named, transparent, rgb/hsl, and one modern concrete color.

## 6. Safe generated-source highlighting

### 6.1 Bounded token model

Add `src/showcase/sourceHighlight.ts` as a pure, testable presentation module:

```ts
export type SourceTokenKind =
  | "plain"
  | "comment"
  | "string"
  | "keyword"
  | "tag"
  | "attribute"
  | "number"
  | "punctuation";

export interface SourceToken {
  kind: SourceTokenKind;
  text: string;
}

export interface SourceLine {
  number: number;
  text: string;
  tokens: readonly SourceToken[];
}

export function highlightGeneratedTsx(source: string): readonly SourceLine[];
```

The scanner is intentionally limited to the generated TSX shape. It scans left-to-right, carries only block-comment state between lines, and applies this priority:

1. existing block comment or `/* ... */` / `// ...` comment;
2. single- or double-quoted string with backslash escape handling;
3. JSX opening/closing punctuation and the component identifier immediately after `<` or `</` as `tag`;
4. an identifier inside an opening JSX tag followed by optional whitespace and `=` as `attribute`;
5. the fixed keywords `import`, `from`, `type`, `const`, `export`, `function`, `return`, `true`, and `false`;
6. a decimal numeric literal at identifier boundaries;
7. punctuation; otherwise accumulate plain text.

It does not parse arbitrary TypeScript, templates, regex literals, nested language grammars, or user-authored code. Those forms are not emitted by `generateSliderCode`. Every line must satisfy:

```ts
line.tokens.map((token) => token.text).join("") === line.text
```

Splitting uses `source.split("\n")`, including the final empty line when source ends in a newline, so the visible line model is exact and stable.

### 6.2 React-only rendering and exact copy

`GeneratedCode.tsx` calls `highlightGeneratedTsx(source)` and renders only React text and `<span>` nodes. It must not use `dangerouslySetInnerHTML`, `innerHTML`, `contentEditable`, a textarea, or an editor runtime.

Each source row has:

- an explicit line-number span with `aria-hidden="true"`, `data-line-number`, and CSS `user-select: none`;
- a source-content span containing token spans with `data-token-kind` and demo-owned `source-token--*` classes;
- an explicit newline text node between rows so text remains selectable as lines.

The viewer is a focusable `<pre className="source-viewer" aria-labelledby="generated-code-heading">` containing `<code data-testid="generated-source">`. It is read-only by element semantics and has no editing/execution/save action. Copy remains the only action and receives the original `source` string directly. Consequently clipboard text contains no line numbers or markup, even if browser selection behavior differs around the visual gutter.

CSS gives the viewer `max-width: 100%`, a bounded `max-height`, `overflow: auto`, `white-space: pre`, `tab-size: 2`, and `min-width: 0`. Lines do not wrap, so gutter/content alignment remains one row per source line; long URLs scroll inside the viewer rather than widening the page.

`src/showcase/sourceHighlight.test.ts` is the stable pure API seam. `src/showcase/components/GeneratedCode.test.tsx` covers DOM/read-only/copy composition. Tests include `<`, `&`, escaped quotes, backticks in data strings, URLs, comments in a direct tokenizer fixture, attributes, numbers, trailing newline, and a long line. They assert reconstruction, sequential line numbers, token categories, absence of raw HTML/editability, exact `navigator.clipboard.writeText(source)`, and CSS hook presence. They do not claim browser selection, color contrast, or pixel overflow.

## 7. Clipboard composition and inline install command

Keep one clipboard state machine in `CopyButton.tsx`: absent API, synchronous throw, rejected promise, stale request, success timeout, unmount cleanup, visible feedback, and `aria-live="polite"` behavior remain unchanged.

Evolve its presentation API so the caller supplies visible source content while `CopyButton` retains the exact copy string:

```ts
interface CopyButtonProps {
  text: string;
  targetLabel: string;
  presentation?: "stacked" | "inline-field";
  children: ReactNode;
}
```

- `GeneratedCode` uses `stacked`, passing the highlighted viewer as `children`; its copy button remains outside the read-only viewer.
- `InstallGuide` uses `inline-field`, passing a selectable `<code className="install-command-text">{command}</code>`.
- In inline mode, the component renders one `.install-command-field` row containing the code and the native button, then renders feedback below that row in the same copy block. There is no second standalone install action.
- The button's accessible name remains exactly `Copy install command`; source uses `Copy generated code`.
- The command strings remain the centralized exact `INSTALL_COMMANDS[selected]`. The selected tab key may continue remounting copy status so stale feedback never describes the new command.

The inline field uses `grid-template-columns: minmax(0, 1fr) auto`. Command text gets local horizontal scrolling/selectability and right padding/gap; the button has a minimum 44px target and never overlays text. At 390px it remains inside the field; if space is insufficient, only the command text region scrolls. Clipboard failure leaves exact text visible and announces the existing manual-copy guidance.

## 8. CSS ownership and responsive strategy

All changes stay in `src/styles.css` and are scoped to these demo-owned hooks:

- `.range-field` and its native range/output;
- `.color-field`, `.color-picker-group`, `.color-picker`, and text/error hooks;
- `.source-viewer`, `.source-line`, `.source-line-number`, `.source-line-content`, and `.source-token--*`;
- `.install-command-field` and `.install-command-text`;
- existing `.copy-block`, `.copy-button`, `.copy-feedback`, `.control-panel`, and responsive section hooks.

The existing page grid, `min-width: 0`, preview containment, and breakpoints remain the layout foundation. At 390px, range/color groups collapse to one column, picker width is `min(100%, 12rem)` (never its intrinsic 200px beyond the container), the install field keeps `minmax(0, 1fr) auto`, and the source viewer owns its overflow. Focus-visible, non-color error/success text, and 44px targets remain visible.

Do not add package alignment wrappers or selectors. `.package-render` may continue centering its child through the existing demo container, but package track/column/image geometry remains untouched. Static tests must fail on newly added `.rts-` selectors and on changes to package animation declarations.

Manifest/lock verification during apply must show `react-tech-slider` resolves to 1.10.1 and `react-colorful` resolves to 5.8.0. Do not update either range, regenerate unrelated lock entries, or add a highlighting/color-normalization dependency.

## 9. Performance and remote-image implications

The installed 1.10.1 fades runtime expands each dataset quadratically. Seven-item Sport produces exactly 49 fade images and ten-item Food produces exactly 100; running produces seven and ten respectively. This design makes no performance guarantee.

Implications:

- Every live range or picker dispatch rerenders `Playground`; when fades is active, the published non-memoized component may reconcile a 49- or 100-image tree.
- Sport's `transition: "width 1s ease"` and `filter: "invert()"`, and Food's transition-only style, apply to each package image. Live icon-width changes can leave Sport/Food width transitions in flight; normative metadata is not removed as an optimization.
- No virtualization, deferred control update, requestAnimationFrame throttle, package memo wrapper, or animation rewrite is introduced because each would change immediate feedback or the package being demonstrated.
- The ten-item ceiling is the hard data bound. Eleven items are rejected before package render.
- `useResolvedBrands` preflights each distinct selected canonical URL with `Image`; selecting Sport can begin up to seven image loads/decode attempts and Food up to ten. Completed ready/failed URLs are cached for the mounted hook. Rapid dataset switching detaches stale callbacks, but it cannot guarantee that the browser cancels underlying network work, and an unfinished URL may be attempted again when revisited.
- While preflight is pending or failed, deterministic SVG data URLs keep preview transport separate from canonical source. No CORS fetch/canvas image conversion is introduced; the canvas used by the color adapter never reads remote images.

Automated evidence can assert the 100-node behavior against the installed package or its observable DOM in a focused integration test, action counts, no repeated completed preflight, and canonical/fallback separation. Only a browser run can report interaction responsiveness, animation smoothness, memory/network behavior, and visual containment. Record observations at gap 0/180, speed 0.25/4, desktop/mobile presets, and rapid dataset/control changes; do not turn observation into a general performance guarantee.

## 10. Strict TDD plan

Every behavior slice records RED, GREEN, TRIANGULATE, and REFACTOR evidence in apply progress. A final green run without the initial intended failure is insufficient.

### Slice A — fixtures, validation, fallback, canonical source

**RED**

- Update `src/showcase/brands.test.ts` for exact Core/Sport/Food records, exact selector order data, Core dimension absence, ten accepted/eleven rejected, and within-list duplicate IDs.
- Update `src/showcase/model.test.ts` for `DatasetId`/map selection and repeated IDs across independent lists.
- Extend `src/showcase/codegen.test.ts` and `src/showcase/useResolvedBrands.test.tsx` for style/className preservation and canonical URLs.

Run focused tests and confirm failures are due to missing fixtures, six-item cap, frontend type/map, and absent metadata serialization.

**GREEN**

Implement fixtures/type/map, named max policy, Core dimension removal, and minimal serializer changes.

**TRIANGULATE**

Cover length 0/10/11, duplicate IDs in one list versus repeated IDs across lists, absent style/className, style width, punctuation/escaping, invalid runtime metadata, fallback pending/ready/failed, and compiler diagnostics for generated metadata TSX.

**REFACTOR**

Keep one validator, one fallback replacement rule, and one serializer; rerun the four focused files.

### Slice B — five live ranges and canonical parity

**RED**

Update `src/showcase/components/Playground.test.tsx` to require `type="range"` and an immediate change in output, latest package props, and generated source without blur.

**GREEN**

Replace `NumericField` with shared `RangeField` and dispatch raw `currentTarget.value` on every change.

**TRIANGULATE**

Table-test all five domains, boundaries, interior steps, running/fades absence, round-trip retention, direct reducer normalization, reset, and all-dataset icon-width props/source.

**REFACTOR**

Remove numeric draft/error code and duplicated markup; keep reducer normalization authoritative.

### Slice C — color adapter and alpha pickers

**RED**

Add `src/showcase/color.test.ts` and picker assertions in `Playground.test.tsx`. Mock `react-colorful` with a labelled callback seam. Require hex-only picker props for canonical `rebeccapurple`, `transparent`, and `#00000033`.

**GREEN**

Implement fast-path hex conversion, probe/canvas adapter, shared `ColorField`, and immediate picker dispatch.

**TRIANGULATE**

Cover 3/4/6/8-digit hex, alpha 00/33/ff, named color, transparent, rgb/hsl/modern sampled color, invalid/incomplete input, rejected context-dependent values, unavailable canvas, independent fields, Enter/blur, variant round-trip, and reset of an invalid draft.

**REFACTOR**

Keep canonical validation and picker projection behind the one resolver interface; prove no non-hex value reaches the mocked picker.

### Slice D — safe highlighted viewer

**RED**

Add `sourceHighlight.test.ts` and `components/GeneratedCode.test.tsx` for line model, token categories, read-only structure, exact copy, and long-line hooks.

**GREEN**

Implement the bounded scanner and React-node viewer.

**TRIANGULATE**

Cover trailing empty line, escaped quotes, `<`/`&`, URLs, metadata, comment state, tags/attributes, numeric props, source reconstruction, and copy excluding line numbers.

**REFACTOR**

Merge adjacent equal-kind tokens, keep the scanner independent of React, and verify no raw-HTML API exists.

### Slice E — inline install copy and responsive ownership

**RED**

Update `InstallGuide.test.tsx`, `CopyButton.test.tsx`, and relevant `App.test.tsx` static CSS assertions for command-field containment, selected command copy, error persistence, and forbidden private selectors.

**GREEN**

Add composable copy presentation and demo-owned CSS.

**TRIANGULATE**

Cover npm/pnpm click and keyboard selection, success/rejection/absent clipboard, independent source/install statuses, selected-tab remount, long command containment hooks, and 390px ownership rules.

**REFACTOR**

Retain one clipboard implementation and remove obsolete swatch/plain-source rules only after all consumers pass.

### Final verification after all slices

Tasks should name these commands:

```text
pnpm exec vitest run src/showcase/brands.test.ts src/showcase/model.test.ts src/showcase/codegen.test.ts src/showcase/useResolvedBrands.test.tsx
pnpm exec vitest run src/showcase/color.test.ts src/showcase/components/Playground.test.tsx
pnpm exec vitest run src/showcase/sourceHighlight.test.ts src/showcase/components/GeneratedCode.test.tsx
pnpm exec vitest run src/showcase/components/CopyButton.test.tsx src/showcase/components/InstallGuide.test.tsx src/App.test.tsx
pnpm test
pnpm build
pnpm lint
```

Generated-source compiler verification stays in `codegen.test.ts` using the TypeScript compiler API and installed package root declarations. Final acceptance extracts and hashes only the protected hero section and expects final accepted SHA-256 `aa787e708db68498c3b051446d7416b9933b2455f238bcf49e346bee3b56bdee`, rather than hashing the whole `App.tsx` file. The accepted section includes `brandsList={CORE_BRANDS}` and `iconWidth={18}`. Browser checks are recorded separately and never inferred from Vitest/build/lint.

## 11. File impact map

| Path | Intended change |
| --- | --- |
| `src/showcase/brands.ts` | Exact three fixtures, remove frontend, named max-ten policy, serialization-safe metadata validation |
| `src/showcase/brands.test.ts` | Exact appendix, cap, uniqueness, Core sizing, metadata fallback tests |
| `src/showcase/model.ts` | `DatasetId` union only plus continued defensive color validator integration |
| `src/showcase/model.test.ts` | Three-dataset selection, reset/variant/parity boundaries |
| `src/showcase/codegen.ts` | Stable optional `style`/`className` serialization |
| `src/showcase/codegen.test.ts` | Metadata escaping and compiler-API TSX checks |
| `src/showcase/color.ts` (new) | Concrete CSS color → canonical plus `#RRGGBBAA` picker adapter |
| `src/showcase/color.test.ts` (new) | Pure/injected adapter matrix |
| `src/showcase/useResolvedBrands.ts` | Expected no production change unless memoization is proven necessary; spread behavior already preserves metadata |
| `src/showcase/useResolvedBrands.test.tsx` | Metadata and canonical URL preservation |
| `src/showcase/sourceHighlight.ts` (new) | Bounded generated-TSX line/token model |
| `src/showcase/sourceHighlight.test.ts` (new) | Token/reconstruction API tests |
| `src/showcase/components/ControlPanel.tsx` | Shared `RangeField`, picker/text `ColorField`, exact selector options |
| `src/showcase/components/Playground.tsx` | Exact default map and color-resolver test seam |
| `src/showcase/components/Playground.test.tsx` | Immediate controls, picker, dataset, reset, invocation/source tests; remove obsolete numeric-draft assumptions |
| `src/showcase/components/GeneratedCode.tsx` | React-node line-number viewer |
| `src/showcase/components/GeneratedCode.test.tsx` (new) | Read-only, safe rendering, exact copy, overflow hooks |
| `src/showcase/components/CopyButton.tsx` | Reusable stacked/inline-field composition; clipboard state unchanged |
| `src/showcase/components/CopyButton.test.tsx` | Composition plus existing race/error semantics |
| `src/showcase/components/InstallGuide.tsx` | Inline command field using shared copy logic |
| `src/showcase/components/InstallGuide.test.tsx` | Containment, exact selected command, accessible status |
| `src/styles.css` | Demo-owned range/picker/viewer/install responsive styles |
| `src/App.test.tsx` | Static scope/private-selector/rebaselined-hero-hash and updated viewer assertions only |
| `src/App.tsx` | **Approved one-time change only:** import/reuse `CORE_BRANDS`, remove the duplicate local fixture, and set the existing hero Slider to `iconWidth={18}`; no further change |
| `package.json`, `pnpm-lock.yaml` | **No design/apply change**; verify approved installed versions only |

No explore, proposal, spec, prior change artifact, production package source, dependency range, or unrelated test is part of this change.

## 12. Rollback

There is no migration or persistence. Rollback reverts the refresh as one behavior set: restore Core/Frontend fixtures and six-item policy, numeric text fields, text/swatch colors, plain source viewer, and standalone install copy presentation; remove the new color/highlight modules and associated tests/styles. The package version remains untouched. The approved hero/Core deduplication is a separately recorded user decision and is not silently reverted with a work-unit rollback.

If one review slice is delivered as a chained PR, revert that complete work unit with its tests rather than removing tests separately. Do not partially revert canonical invocation changes while retaining controls that depend on them. Remote fallback data requires no conversion or cleanup.

## 13. Decision log and tradeoffs

| Decision | Chosen approach | Rejected alternative and reason |
| --- | --- | --- |
| Canonical parity | Existing typed `SliderInvocation` remains the only preview/source input | Independent UI-to-preview and UI-to-code maps can drift |
| Core sizing | Remove fixture dimensions | Package wrapper/CSS override would change public precedence |
| Dataset cap | Named maximum 10 | Unbounded input worsens fades quadratic cost; six rejects approved data |
| Numeric controls | Native range, reducer normalization | Custom slider or blur-committed number input loses native/live semantics |
| Color picker | Hex picker plus derived sRGB hex; canonical CSS string retained | Passing names into a hex parser is invalid; restricting text to hex would require a spec correction |
| Non-hex conversion | Probe + default-sRGB 1×1 canvas with dual-sentinel detection | A handwritten general CSS parser is out of scope; a color dependency is unapproved |
| Context-dependent colors | Reject as non-concrete precise input | Guessing `currentColor`/CSS variables would make picker context differ from package rendering |
| Highlighting | Bounded scanner and React nodes | Prism/Shiki/editor dependencies and raw HTML are disproportionate |
| Line numbers | Explicit non-selectable presentation spans; copy original source | Mutating source with prefixed numbers breaks exact copy |
| Copy reuse | One composable clipboard component with two presentations | Duplicated clipboard promises/status introduces race and accessibility drift |
| Fades performance | Bound at 10 and verify honestly | Virtualization/throttling/package rewrite changes the demonstrated package or live requirement |
| CSS | Demo-owned stylesheet hooks only | Private `.rts-*` overrides are coupled to package internals |
| Hero | One approved `CORE_BRANDS` deduplication with fixed `iconWidth={18}`, then immutable at final extracted SHA-256 `aa787e708db68498c3b051446d7416b9933b2455f238bcf49e346bee3b56bdee` | Retaining duplicate fixture data or the superseded intermediate width was rejected; any further formatting or movement requires a new decision |

## 14. Review workload forecast and delivery gate

The implementation is forecast at **1,450–1,900 changed lines** (additions plus deletions): approximately 650–800 production/CSS lines and 800–1,100 test lines. Exact Sport/Food fixture literals and exact-value tests account for a material but low-complexity portion; picker conversion, control rewiring, highlighting, and clipboard composition are the higher-review portions. This exceeds the session review budget of 400 changed lines.

One writer remains mandatory. One PR is no longer an automatic default: **before `sdd-apply`, the parent must obtain a delivery decision** between:

1. an explicit `size:exception` for one cohesive PR with the five review slices above, or
2. chained PR/work-unit delivery, preserving invocation/source compatibility at every boundary.

If chaining is selected, tasks should target reviewable units and re-estimate each against 400 lines; likely boundaries are (A) fixtures/validation, (B) metadata/codegen, (C) ranges, (D) color adapter/pickers, and (E) viewer/install/CSS. Tests stay in the same work unit as behavior. Do not parallelize writers, and do not silently choose the size exception during apply.

## 15. Residual risks and acceptance boundaries

- **Critical:** Any `src/App.tsx` hero edit beyond the approved `CORE_BRANDS` deduplication and fixed `iconWidth={18}` violates the amended hard constraint. Verify final extracted SHA-256 `aa787e708db68498c3b051446d7416b9933b2455f238bcf49e346bee3b56bdee` at each delivery boundary.
- **High:** Sport fades creates 49 package images and Food creates 100; both can reconcile on every live control event. Only browser observation can judge responsiveness.
- **High:** The delivery forecast exceeds 400 lines; apply is gated on an explicit one-PR exception or chained-PR choice.
- **Medium:** Browser concrete-color resolution and sRGB gamut mapping may differ at rounding edges. Tests prove the adapter contract with injected samples; the production path needs browser evidence.
- **Medium:** `HexAlphaColorPicker` pointer, keyboard, focus, and alpha rendering are browser behaviors. The labelled text fallback remains the guaranteed precise keyboard route.
- **Medium:** A bounded tokenizer may need adjustment if `generateSliderCode` later emits unsupported syntax. Its scope is intentionally generated TSX only.
- **Medium:** Long-line selection, gutter exclusion, contrast, and local scroll containment require browser/manual inspection.
- **Medium:** Rapid dataset switching can leave browser image requests in flight even after callbacks are detached; no cancellation claim is made.
- **Low:** Metadata serialization accepts the runtime serializable `CSSProperties` subset required by the fixtures. A future function/object CSS value would be rejected rather than emitted incorrectly.
- **Tooling:** Engram tools were not exposed in this worker session, so the requested significant-decision save to project `react-tech-slider-demo-v2` could not be performed. The durable decisions are fully recorded in this artifact.
