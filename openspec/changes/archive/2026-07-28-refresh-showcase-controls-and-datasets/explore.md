# Exploration: refresh-showcase-controls-and-datasets

## 2026-07-28 Sport fixture contract amendment

By explicit user decision, the current `SPORT_BRANDS` implementation is authoritative: seven ordered records with IDs 1–7 (`Puma`, `Reebok`, `Under Armour`, `The North Face`, `Nike`, `Adidas`, `Fila`), preserving the current URLs and class names. Every Sport style contains both `transition: "width 1s ease"` and `filter: "invert()"`; New Balance, Converse, and Asics are removed. Food remains the historical ten-record fixture, and `MAX_DATASET_SIZE` remains 10. Earlier ten-record Sport exploration below is retained only as historical evidence and is superseded wherever it conflicts with this amendment. Current fades expansion is 49 images for Sport and 100 for Food.

## Phase result

- **status:** complete
- **executive_summary:** The existing canonical preview/source pipeline can support the refresh through bounded fixture, control, viewer, and install-layout changes; no package change or private package CSS override is needed.
- **artifacts:** `openspec/changes/refresh-showcase-controls-and-datasets/explore.md`
- **next_recommended:** Proceed to proposal with Core + Sport + Food, live range controls, alpha pickers with text fallbacks, a highlighted read-only code viewer, and inline install copying as the locked scope.
- **risks:** Seven-item Sport/ten-item Food fades performance, color-picker browser accessibility, custom highlighting correctness, narrow inline-copy layout, and the protected hero hash require explicit verification.
- **skill_resolution:** none (the registry was read; it contains no matching project-specific skill)
- **artifact store:** openspec
- **production edits:** none
- **blockers:** none

## Executive summary

The prior change already provides a sound canonical pipeline: `Playground` owns state, `projectSlider` selects typed package props in `src/showcase/model.ts`, `toPreviewProps` drives the published preview, and `generateSliderCode` renders the same invocation. This change should preserve that pipeline and make a focused UI/data refresh rather than introduce another mapping.

The current implementation has seven concrete gaps:

1. It models only `core` and `frontend`, and the validator rejects lists larger than six; the locked Core + Sport + Food product therefore requires a `DatasetId`/fixture/selector expansion and a cap of at least ten.
2. The amended Sport input contains seven records with IDs 1–7 in this order: Puma, Reebok, Under Armour, The North Face, Nike, Adidas, Fila. It preserves the current HTTPS URLs/class names and requires `style: { transition: "width 1s ease", filter: "invert()" }` on every record. New Balance, Converse, and Asics are removed. Food remains ten records with IDs 1–10 and its original transition-only style.
3. Numeric controls are `type="number"` and commit on blur. They need native `type="range"` inputs and `onChange` dispatch so preview and source update while dragging.
4. `iconWidth` is passed to the package, but package runtime semantics intentionally let each brand's `width` override it, and `style.width` can override both. Five current Core records set `width: 5` and `height: 5`, so the global control visibly changes only npm. The product requirement is that Icon width visibly resize all showcase dataset icons; remove the optional Core fixture-level `width` and `height` overrides while preserving the exact supplied Sport/Food metadata. No package change is required.
5. The installed `react-colorful@5.8.0` exports `HexAlphaColorPicker`; current fields are text plus a non-interactive swatch. Picker changes must preserve eight-digit hex (including `#00000033`) while retaining a labeled text/keyboard fallback.
6. No syntax-highlighting package is installed. `GeneratedCode` currently renders a selectable plain `<code>` block and a copy button. A small local tokenizer/CSS presentation is the minimal-dependency option; adding a highlighter should be a deliberate dependency decision, not an accidental framework surface.
7. `InstallGuide` currently delegates a standalone-looking `CopyButton` containing the command and button. The same exact clipboard semantics can be retained while rendering the button inside the command field at its right edge.

The protected `<section className="hero-shell">` in `src/App.tsx` is now locked at the user-approved 2026-07-28 rebaseline. The one-time amendment imports `CORE_BRANDS`, removes the duplicated hero-local brands array, passes `brandsList={CORE_BRANDS}`, and fixes the existing hero Slider at `iconWidth={18}`; no other hero markup, content, behavior, or package integration changes. Current `PreviewPanel.tsx` has no `preview-slider-frame` element and `styles.css` has no matching rule. Fades alignment remains owned by published `react-tech-slider@1.10.1`; this refresh must not add demo overrides against private `.rts-*` selectors or package animation geometry.

## Findings by area

### 1. Dataset model, records, and metadata

**Current paths:**

- `src/showcase/brands.ts:3-44` — `CORE_BRANDS`, currently six records.
- `src/showcase/brands.ts:46-89` — `FRONTEND_BRANDS`, currently six records and must be removed/replaced.
- `src/showcase/model.ts:9` — `DatasetId = "core" | "frontend"`.
- `src/showcase/model.ts:145-156` — initial dataset is `core`.
- `src/showcase/components/Playground.tsx:4,17-20` — default dataset map imports Core/Frontend.
- `src/showcase/components/ControlPanel.tsx:201-207` — selector labels Technologies and Frontend frameworks.

**Required fixture contract:** Sport has exactly seven ordered records with IDs 1–7: Puma (`puma-icon`), Reebok (`reebok-icon`), Under Armour (`under-armour`), The North Face (`northFace-icon`), Nike, Adidas, and Fila. It preserves the current exact HTTPS URLs and every style is `{ transition: "width 1s ease", filter: "invert()" }`; Nike, Adidas, and Fila omit `className`. New Balance, Converse, and Asics are absent. Food retains its ten ordered IDs 1–10, transition-only styles, exact URLs and names—including “SubWay,” “StarBucks,” “Dunkin`Donuts,” and “Domino`s Pizza”—and no class names. Repeated IDs across datasets are valid because validation scopes uniqueness to one list.

**High — size policy and performance:** `MAX_DATASET_SIZE = 10` remains the validation ceiling, so seven-record Sport and ten-record Food are valid while eleven records remain invalid. The published fades implementation expands a list into roughly N² image items: Sport yields 49 and Food yields 100. Browser/manual performance remains a risk, especially for Food.

**Medium — optional Brand metadata is only partially supported by source generation:** Published `Brand` declarations (`node_modules/react-tech-slider/dist/types.d.ts:1-9`) include `width?`, `height?`, `style?: CSSProperties`, and `className?: string`. Validation only inspects ID/name/image (`src/showcase/brands.ts:105-137`) and should continue to avoid mutating valid metadata. `materializeFallbackBrands` spreads each record before replacing only `img` (`src/showcase/brands.ts:156-160`), and `useResolvedBrands` likewise spreads each record (`src/showcase/useResolvedBrands.ts:78-85`); both already preserve `style`, `className`, dimensions, identity, and order.

`serializeBrand` in `src/showcase/codegen.ts:43-52` currently emits only `id`, `name`, `img`, `width`, and `height`. It must conditionally emit `style` and `className` as valid TSX values, with tests for string class names and representative CSSProperties (including a `style.width` case). Serialization must omit absent fields, JSON-escape strings, preserve metadata exactly, and never emit fallback `data:` URLs. The generated record should remain assignable to the published `Brand` type; a compiler-API fixture should cover metadata-bearing records.

**Icon-width diagnosis:** The installed published runtime (`node_modules/react-tech-slider/dist/index.js`, package `1.10.1`) computes image style as brand width-or-global `iconWidth`, then height, then spreads `brand.style`; its effective rule is equivalent to `{ width: (brand.width ?? iconWidth) + "rem", height..., ...brand.style }`. Therefore:

- a record with `width` set intentionally wins over the global slider value;
- a record with `style.width` wins over both;
- current Core sets width and height 5 on five of six records (`src/showcase/brands.ts:3-44`), making the global control visibly affect only npm;
- the supplied Sport/Food records contain no `width`, `height`, or `style.width`, so their transition metadata does not mask the global size;
- `App.tsx`'s hero slider now reuses protected `CORE_BRANDS`, but its user-approved fixed `iconWidth={18}` means it is not evidence about the playground's live control.

The accepted product behavior is that the global Icon width control visibly resizes every icon in every showcase dataset. Remove the optional `width` and `height` fields from the Core fixture records so all three datasets inherit `iconWidth`; preserve the supplied Sport/Food metadata exactly. Verify every dataset's mocked Slider props and generated source change continuously. Do not edit or wrap the package to change its documented precedence.

### 2. Native range controls and live synchronization

**Current paths:** `src/showcase/components/ControlPanel.tsx:19-95` (`NumericField`) and calls at `209-216`, `220-226`, `278-286`, `290-305`.

All five numeric controls use `type="number"`; the draft state and `onBlur` commit mean dragging is impossible and preview/source remain stale until blur. Replace the three running fields (icon width, border width, duration) and two fades fields (gap, speed) with native range controls whose `onChange` dispatches the field-specific action immediately. Keep `min`, `max`, `step`, unit, visible `<output>`, labels, and keyboard arrow/Home/End behavior. A text/numeric fallback is optional but must not become the authoritative path; any fallback must use the same normalizer.

Reducer normalization in `src/showcase/model.ts:57-69,172-269` already accepts finite values and quantizes to domain steps, so range events can dispatch `event.currentTarget.value` (or numeric value) and reuse it. Tests should assert each `fireEvent.change`/user-event range update changes both mocked `Slider` props and generated source without blur, including boundaries and step values. Existing invalid-draft tests in `Playground.test.tsx` (around the numeric/color interaction cases) must be rewritten for a separate text fallback or removed if range-only is chosen.

### 3. Alpha color pickers

**Current paths:** `src/showcase/components/ControlPanel.tsx:97-165` (`ColorField`), `src/showcase/model.ts:100-123` (`normalizeColor`), and `src/showcase/Playground.tsx:86-94` (`supportsColor`).

`react-colorful@5.8.0` is already a runtime dependency and exports `HexAlphaColorPicker` from its package root (`node_modules/react-colorful/dist/index.d.ts:1-18`; prop type at `dist/types.d.ts:32-38`: `color`, `onChange`, optional `onChangeEnd`, standard HTML div attributes). Use it for both border/background. The picker should use the canonical color as `color` and dispatch on every picker `onChange` so preview/source are live. Keep a visible text input as the fallback/precise entry route, with a programmatic label, `aria-describedby` error/help text, Enter/blur commit, and `aria-invalid` on invalid draft. Add an accessible `aria-label` or labelled relationship to the picker container; do not assume the picker alone provides a useful keyboard text-entry route.

The canonical default `#00000033` must remain eight-digit hex. Tests need to mock `react-colorful` or exercise its callback and assert alpha-bearing values reach reducer, preview props, and generated code unchanged. `normalizeColor` must continue accepting 8-digit hex and arbitrary valid CSS colors through the injected validator; invalid partial text must leave the prior canonical color effective. Browser-only risks include picker pointer/keyboard behavior, focus order between picker and text fallback, and actual alpha support/rendering in CSS; jsdom cannot verify those.

### 4. Read-only highlighted code viewer

**Current paths:** `src/showcase/components/GeneratedCode.tsx:1-19`, `src/showcase/components/CopyButton.tsx:61-72`, and `src/styles.css:412-443`.

No syntax-highlighting dependency is present in `package.json`; the installed graph contains React, `react-colorful`, `react-tech-slider`, and the test/build stack, but no Prism/Shiki/Highlight.js/CodeMirror/Monaco package. Prefer a small dependency-free tokenizer that emits spans for comments, strings, keywords, tags, attributes, and numbers, with CSS classes and a stable fallback to plain text. Do not use `dangerouslySetInnerHTML` unless a trusted tokenizer proves every generated token is escaped. Generated source is application-produced, but source strings include external brand names and URLs.

Render a bounded `<pre>`/`<code>` viewer with `aria-label`/heading association, line-number markup (CSS counters or explicit per-line spans), selectable text, and no `contentEditable`; copy remains the only action. Keep the viewer read-only and avoid a textarea because it conflicts with highlighting/line numbers. Preserve source text exactly for `CopyButton`. Tests should assert line count, visible line numbers, highlighted token classes, source text, `contentEditable` absence/false, bounded overflow hooks, and copy of the unmodified source. Browser/manual checks must cover long lines, focus/selection, contrast, and keyboard copy.

### 5. Install copy interaction

**Current paths:** `src/showcase/components/InstallGuide.tsx:84-94`, `src/showcase/components/CopyButton.tsx:62-72`, and `src/showcase/components/InstallGuide.test.tsx:20-120`.

Current tests establish required semantics: exact command text, selected npm/pnpm tab association, `Copy install command` button name, clipboard rejection message, and source visibility/selectability. The requested interaction should preserve those semantics while changing layout: command field contains selectable/readonly command text and a single inline button aligned at its right; no separate block-level action below/next to the field. Keep `CopyButton`'s independent status, `aria-live="polite"`, absent/rejected clipboard handling, and exact selected command (`InstallGuide.tsx:15-20,89-93`). A small `inline`/`compact` presentation prop or a dedicated command-field wrapper is preferable to duplicating clipboard logic. Update tests to assert the button is inside the command-field region, remains named `Copy install command`, copies the selected command after tab changes, and leaves command text visible after errors. Do not remove generated-code copy.

### 6. Protected hero and fades alignment

**2026-07-28 scope amendment (explicit user approval):** Keep the current `src/App.tsx` wiring that imports `CORE_BRANDS`, removes the duplicate hero-local brands array, passes `brandsList={CORE_BRANDS}`, and sets the existing hero Slider to `iconWidth={18}`. This deliberately reuses the canonical Core fixture and freezes the accepted hero width without changing the published-package integration or any other hero markup/content. The extracted hero SHA-256 is rebaselined from the historical `2b40e750e89c920657832665f59749b0d97cf7a0069b884b938d99fc71d46346` to the final approved `aa787e708db68498c3b051446d7416b9933b2455f238bcf49e346bee3b56bdee`; the partial `8c04b455f6ea3fe26b12a0a6e16e2c003e7a86297e168bc3eba73bf6dd3c7ca6` proposal is superseded intermediate context and is not a valid forward baseline. Unit G stopped when the unapproved drift was detected; explicit approval resolves that blocker. No further `src/App.tsx` or hero edit, movement, or reformat is permitted without another explicit user decision.

**Critical forward constraint:** Preserve the rebaselined hero byte-for-byte at SHA-256 `aa787e708db68498c3b051446d7416b9933b2455f238bcf49e346bee3b56bdee`. Dataset/control/code/viewer changes remain under `src/showcase/**` and `src/styles.css`; do not alter the approved `iconWidth={18}`.

**Package-owned alignment:** Current `src/showcase/components/PreviewPanel.tsx` renders the published `<Slider>` directly inside `.package-render`; it does not contain a `preview-slider-frame`. Current `src/styles.css` likewise has no `preview-slider-frame`, `data-preview-alignment`, or private fades selector. Published `react-tech-slider@1.10.1` owns the corrected fades geometry. Preserve that integration and avoid selectors targeting private package classes or modifying package animations; new viewer/control CSS must remain scoped to demo-owned elements.

## Strict-TDD coverage plan (RED → GREEN → TRIANGULATE → REFACTOR)

1. **Datasets/metadata (RED):** add failing fixture/selector tests for `core`, `sport`, `food`, ten-item acceptance, frontend absence, the exact supplied records, Core records without fixture-level size overrides, and metadata-preserving fallback/codegen. **GREEN:** add typed fixtures, `DatasetId`, selector/options, max-ten validation, and remove only Core `width`/`height` overrides. **TRIANGULATE:** duplicate IDs within one list, repeated IDs across independently selected lists, empty/invalid lists, ten vs eleven, `style`/`className` combinations, escaped metadata, fallback identity, and global icon-width changes across all datasets. **REFACTOR:** one validator policy and one canonical source serializer.
2. **Live ranges (RED):** assert `type="range"`, domains, and a drag/change updates mock preview props/source before blur; current implementation should fail because it exposes number fields and onBlur commits. **GREEN:** native range event wiring. **TRIANGULATE:** all five fields, min/max/step, keyboard changes, variant round trips/reset, no invalid transient range states. **REFACTOR:** shared field component without duplicate dispatch/model logic.
3. **Color pickers (RED):** assert both `HexAlphaColorPicker` instances and callback propagation of `#00000033`/other 8-digit values; current UI has no picker. **GREEN:** picker + text fallback. **TRIANGULATE:** alpha, non-hex text, invalid text, picker/text synchronization, labels/focus/order. **REFACTOR:** shared color-field adapter and centralized normalization.
4. **Code viewer (RED):** assert read-only highlighted lines and line numbers; current plain code fails. **GREEN:** trusted minimal tokenizer/viewer. **TRIANGULATE:** strings containing `<`, `&`, URLs, metadata, long lines, exact copy, no editing. **REFACTOR:** isolate tokenizer from `GeneratedCode` and keep source model untouched.
5. **Install inline copy (RED):** assert command-field containment and no standalone layout; current wrapper fails placement. **GREEN:** inline presentation. **TRIANGULATE:** npm/pnpm switching, keyboard tabs, clipboard absent/rejected/success, live announcements. **REFACTOR:** keep clipboard component reusable for generated code.
6. Run focused suites (`brands`, `model`, `codegen`, `Playground`, `InstallGuide`, new `GeneratedCode`/color tests), then full `pnpm test`, `pnpm build`, and `pnpm lint`. Compiler-API generated-TSX tests must cover optional metadata and alpha colors.

## Risks and review forecast

- **No blocker:** the complete Sport/Food records and metadata are available in the initiating request.
- **High:** the max-ten cap permits 49 Sport fades images and 100 Food fades images; manual performance checks are needed at speed/gap extremes and 390px.
- **High:** package precedence lets fixture-level `width`/`style.width` mask global `iconWidth`; remove the current Core fixture size overrides and guard the all-datasets live-resize behavior with tests while retaining supplied Sport/Food metadata.
- **Medium:** CSSProperties serialization can drift from valid generated TSX if metadata includes non-JSON values; constrain fixture metadata to serializable CSSProperties and test compiler diagnostics.
- **Medium:** picker keyboard/focus and alpha rendering are browser behaviors not proven by jsdom; retain text fallback and run a manual browser pass.
- **Medium:** a custom highlighter can mishandle TSX escaping or inflate review complexity; keep tokenizer narrow and dependency-free unless a package is explicitly approved.
- **Medium:** inline copy layout can regress narrow-width overflow or command selection; preserve bounded overflow and 44px target rules.
- **Critical:** after the approved one-time Core wiring amendment, any further incidental formatting or edit in the `App.tsx` hero section invalidates the rebaselined protected hash.

**Recommendation: one PR with explicit internal review slices.** The state/data changes, controls, picker, viewer, and install layout all touch the same canonical playground and need parity tests; splitting would make synchronized invocation/source and CSS behavior harder to review. Use review slices for (A) datasets/model/codegen, (B) live controls/colors, and (C) viewer/install/accessibility. Reconsider a split only if the viewer requires a substantial new dependency or dataset work expands into unrelated package/API changes.

## Residual browser-only checks

No browser runner was used in exploration. Before release, manually verify: range dragging visibly resizes every icon in all three showcase datasets; picker alpha value and text fallback with keyboard; focus order and labels; highlighted code selection/scrolling/contrast; inline install copy at 390px; all three datasets in running/fades; package-owned fades alignment; seven-item Sport and ten-item Food fades containment/performance; and the rebaselined protected hero hash `aa787e708db68498c3b051446d7416b9933b2455f238bcf49e346bee3b56bdee`.
