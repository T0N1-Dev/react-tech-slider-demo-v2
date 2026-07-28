# Proposal: Refresh Showcase Controls and Datasets

## 2026-07-28 Sport fixture contract amendment

The user-approved current Sport contract is the seven-record `SPORT_BRANDS` already present in production: Puma, Reebok, Under Armour, The North Face, Nike, Adidas, and Fila, ordered with IDs 1–7 and retaining current URLs/class names. Every Sport style includes `transition: "width 1s ease"` and `filter: "invert()"`; New Balance, Converse, and Asics are removed. Food and the validation ceiling remain 10. Earlier ten-record Sport proposal text is retained only as historical context and is superseded by this amendment. Fades currently expands Sport to 49 images and Food to 100.

## Decision

Refresh the existing playground without changing its architecture: keep Core technologies, replace Frontend frameworks with the exact supplied Sport and Food datasets, make numeric controls live range sliders, add alpha-capable color pickers, upgrade generated code to a highlighted read-only viewer with line numbers, and place the install copy action inside the command field.

The existing canonical pipeline remains authoritative: one normalized invocation must drive both the published `react-tech-slider@1.10.1` preview and generated source. The user-approved 2026-07-28 scope amendment also makes the hero reuse `CORE_BRANDS` instead of duplicating fixture data and freezes its fixed `iconWidth={18}`; package integration and all other hero markup/content remain unchanged. No shadcn/Tailwind migration, package-source patch, or private package CSS override is needed.

## Problem and Current Gap

The showcase works, but several interactions do not yet communicate the package effectively:

- The Frontend frameworks dataset does not match the requested brand demonstrations, while the validator rejects the new ten-item lists.
- Core fixture-level `width` and `height` values override the global `iconWidth`, so changing that control appears ineffective for most Core icons.
- Numeric fields commit on blur instead of giving immediate visual feedback.
- Border and background colors are text-only despite alpha color being part of the existing configuration.
- Generated code is copyable but visually reads as plain text rather than a code viewer.
- The install copy action is separate from the command it operates on.

These gaps increase evaluation friction and can make valid package behavior look broken or disconnected from the controls.

## Product Outcome

A developer can select any supported showcase dataset, adjust every numeric or color setting with immediate feedback, inspect readable generated TypeScript/JSX, and copy the selected install command from the same visual field. Preview props and generated source stay synchronized throughout.

## In Scope

### 1. Dataset refresh

The selector will expose exactly:

1. Core technologies
2. Sport brands
3. Food brands

Frontend frameworks will be removed.

Sport contains seven records, preserving the current record order and every authoritative value exactly:

- IDs `1` through `7` for Puma, Reebok, Under Armour, The North Face, Nike, Adidas, and Fila;
- current HTTPS image URLs;
- `style: { transition: "width 1s ease", filter: "invert()" }` on every record;
- current class names for Puma (`puma-icon`), Reebok (`reebok-icon`), Under Armour (`under-armour`), and The North Face (`northFace-icon`), with no class name on Nike, Adidas, or Fila;
- no New Balance, Converse, or Asics records.

Food retains ten records, IDs `1` through `10`, exact URLs, transition-only styles, and supplied capitalization/punctuation including `SubWay`, `StarBucks`, ``Dunkin`Donuts``, and ``Domino`s Pizza``. Repeated IDs across separate datasets remain valid because uniqueness is evaluated within the selected list. The validation ceiling remains ten; eleven or more remains invalid.

Core records will retain their existing identity and image data but remove fixture-level `width` and `height` overrides. This lets the public global `iconWidth` prop visibly affect every showcase icon. It does not change package precedence or runtime behavior.

Optional `Brand` metadata must survive validation, remote-image fallback, preview projection, and generated-source serialization. Generated code must include supplied `style` and `className` values when present and omit absent metadata.

### 2. Live range controls

Use native `input[type="range"]` controls for:

- Icon width (shared)
- Border width (running)
- Duration (running)
- Gap (fades)
- Speed (fades)

Each range preserves its existing minimum, maximum, step, unit, normalization, and visible value output. Pointer and keyboard changes update the canonical state, published Slider props, and generated code continuously—without waiting for blur or pointer release.

### 3. Alpha color pickers

Border and background colors will each use the installed `react-colorful` `HexAlphaColorPicker`.

Both controls must:

- update preview and generated source continuously;
- preserve eight-digit hex values such as `#00000033`;
- retain a labeled text input for precise entry and keyboard fallback;
- keep invalid text drafts local while the last valid canonical color remains active;
- expose nearby validation and accessible labeling.

### 4. Generated-code viewer

Generated code will become a read-only syntax-highlighted viewer with visible line numbers.

It must:

- remain selectable but not editable;
- preserve the generated source exactly for copying;
- highlight a bounded TypeScript/JSX token set without `dangerouslySetInnerHTML`;
- render external names and URLs safely as text;
- scroll inside its own bounded region for long lines or many records;
- retain copy as its only action.

No full editor, execution sandbox, or additional highlighting dependency is required.

### 5. Inline install copy

The npm/pnpm tabs and exact commands remain unchanged. The standalone install copy presentation will be replaced by one command field with a right-aligned inline copy button.

The button must remain keyboard reachable, retain the accessible name `Copy install command`, copy the currently selected command, and provide perceivable success or failure feedback. The command remains visible and manually selectable if clipboard access fails.

### 6. Package, hero, and layout boundaries

Published `react-tech-slider@1.10.1` remains the runtime authority, including corrected fades alignment. The showcase will not target private `.rts-*` selectors, alter package animations, or add a local Slider implementation.

**2026-07-28 scope amendment (explicit user approval):** Keep the current `src/App.tsx` diff exactly: import `CORE_BRANDS`, remove the duplicated hero-local brands array, pass `brandsList={CORE_BRANDS}`, and set the existing hero Slider to `iconWidth={18}`. This reuses the canonical Core fixture and freezes the accepted width without changing package integration or any other hero markup/content. The protected extracted hero SHA-256 changes from historical baseline `2b40e750e89c920657832665f59749b0d97cf7a0069b884b938d99fc71d46346` to final approved baseline `aa787e708db68498c3b051446d7416b9933b2455f238bcf49e346bee3b56bdee`; `8c04b455f6ea3fe26b12a0a6e16e2c003e7a86297e168bc3eba73bf6dd3c7ca6` is superseded intermediate context, not a forward expectation. Unit G was blocked when that diff first appeared without approval; this explicit decision resolves the blocker. No further App/hero edit is in scope without another explicit user decision.

The existing page, preview presets, variant rules, remote-image fallback, error boundary, reset behavior, install tabs, and generated-code copy behavior remain in place unless explicitly changed above.

## Product Rules

1. One canonical invocation drives preview props and generated source.
2. Dataset changes update preview and source together; generated source uses canonical remote URLs, never local fallback data URLs.
3. The global icon-width control must visibly affect every record in Core, Sport, and Food.
4. Supplied Sport/Food metadata is data, not showcase styling, and must be preserved exactly.
5. Native ranges update while dragging and through keyboard input.
6. Variant boundaries remain strict: running-only props never appear in fades output, and fades-only props never appear in running output.
7. Alpha colors remain supported; opaque-only normalization is not acceptable.
8. Invalid precise color text cannot replace the last valid preview/source value.
9. The generated viewer is read-only and copy-only; it must not imply code execution or persistence.
10. Install copy feedback remains available to assistive technology and clipboard failure never hides the command.
11. Fades alignment is package-owned in `1.10.1`; no demo workaround may depend on private package classes.
12. After the approved one-time `CORE_BRANDS` wiring and `iconWidth={18}` amendment, `<section className="hero-shell">` must not be edited, moved, reformatted, or otherwise changed without another explicit user decision. Its protected SHA-256 is `aa787e708db68498c3b051446d7416b9933b2455f238bcf49e346bee3b56bdee`.

## Edge and Failure Cases

- **Dataset sizes:** Seven-item Sport and ten-item Food are accepted; an eleven-item custom fixture remains rejected with clear guidance.
- **Repeated IDs between datasets:** Accepted because only within-list uniqueness is required.
- **Invalid or empty dataset:** Existing contained preview guidance remains usable; controls and adoption content do not crash.
- **Remote image failure:** The fallback replaces only the image while preserving style, class name, identity, order, and canonical generated URL.
- **Range boundaries:** Min/max/step normalization remains authoritative at direct state boundaries as well as through the UI.
- **Invalid color draft:** The text remains available for correction, reports invalid state, and does not drift preview/source.
- **Alpha color:** Eight-digit values remain synchronized between picker, text fallback, preview, reset, and generated code.
- **Long generated source:** The viewer contains overflow locally and keeps line numbers aligned with selectable source.
- **Clipboard absent or denied:** Exact command/source remains visible and a live failure message is announced.
- **Narrow layout:** The inline copy field, color pickers, ranges, and code viewer must not create page-level horizontal overflow.
- **Fades dataset cost:** The package renders 49 fade images for Sport and 100 for Food; behavior must remain contained and usable at supported gap/speed limits.

## Non-Goals

- Adding shadcn/ui, Tailwind, another component system, or a general styling migration.
- Editing or republishing `react-tech-slider`, changing its public API, or overriding package internals.
- Adding package props, animation controls, persistence, arbitrary user-entered datasets, uploads, or a backend.
- Building an editable or executable code editor.
- Adding Prism, Shiki, CodeMirror, Monaco, or another syntax-highlighting dependency for this bounded viewer.
- Any further hero change after the approved `CORE_BRANDS` deduplication, or changing page information architecture, preview preset semantics, or package adoption content beyond the requested install copy layout.
- Claiming browser-rendered accessibility, visual alignment, or performance evidence from jsdom tests alone.

## Impact and Implications

### Affected areas

- Showcase fixtures, validation, dataset identifiers, selector labels, and fallback preservation.
- Canonical model tests and generated-code serialization for optional metadata.
- Control rendering and live event wiring for running and fades variants.
- Color validation, picker/text synchronization, and accessibility markup.
- Generated-code presentation and install-command copy layout.
- Responsive CSS scoped to showcase-owned elements.

### Compatibility

No package API or application route changes are introduced. Existing canonical reducer normalization and preview/source projection remain the integration boundary. The hero now consumes the same exported `CORE_BRANDS` fixture instead of a duplicate local array, but still calls the same published `Slider` with the same fixed hero props. Removing Core fixture-level dimensions changes only showcase data precedence so the already-supported global `iconWidth` becomes visible.

### Performance

Fades expands the seven-brand Sport list to 49 images and the ten-brand Food list to 100. This requires focused and browser-level observation at extreme gap/speed values and narrow widths.

## Acceptance Summary

The change is acceptable when:

- the selector offers Core, Sport, and Food only, with exact supplied Sport/Food records and metadata;
- ten records validate and eleven do not;
- Core no longer masks the global `iconWidth`, and all three datasets visibly respond to it;
- all five numeric controls are native ranges that update preview and generated source continuously;
- both colors use alpha-capable pickers with synchronized accessible text fallbacks;
- generated source preserves optional `style`/`className`, remains valid TypeScript/JSX, and appears in a highlighted read-only viewer with line numbers;
- the install copy button is inside the selected command field and keeps success/failure feedback;
- running/fades prop isolation, reset behavior, image fallback, viewport presets, and package-owned fades alignment remain intact;
- focused tests, full tests, build, lint, and the rebaselined protected hero hash check (`aa787e708db68498c3b051446d7416b9933b2455f238bcf49e346bee3b56bdee`) pass;
- manual browser checks truthfully cover pointer/keyboard ranges, picker behavior, code selection/overflow, inline copy at narrow width, ten-brand fades performance, and visual containment.

Browser checks that cannot be executed must remain recorded as waived or unverified—not reported as passing.

## Review and Delivery Forecast

Deliver as one PR because dataset/model, preview projection, generated source, and controls share one canonical contract. Structure review into three explicit slices:

1. **Datasets and canonical source:** fixtures, validation cap, Core size precedence, metadata preservation, code generation.
2. **Live controls and colors:** native ranges, alpha pickers, precise text fallback, accessibility.
3. **Viewer and install interaction:** highlighted line-number viewer, inline copy layout, responsive styling.

Reconsider splitting only if implementation requires an unapproved dependency or expands into package/API work. The expected implementation spans multiple production and test files and should follow strict RED → GREEN → TRIANGULATE → REFACTOR evidence.

## Risks and Mitigations

| Risk | Level | Mitigation |
| --- | --- | --- |
| Protected hero changes after the approved rebaseline | Critical | Permit only the exact `CORE_BRANDS` deduplication already approved; reject further drift and verify the new exact hash before completion. |
| Ten-item fades rendering cost | High | Keep the cap at ten, test selected datasets, and perform truthful browser observation. |
| Fixture metadata or URLs drift | High | Transcribe exact supplied records and assert order plus representative exact metadata. |
| Core dimensions continue masking icon width | High | Remove only fixture-level Core width/height and test all datasets against live global props. |
| Unsafe or invalid highlighted markup | Medium | Tokenize to React text/span nodes; do not use raw HTML injection. |
| Picker keyboard/focus or alpha rendering differs in browsers | Medium | Keep precise text fallback and require browser verification. |
| Inline command field overflows at narrow widths | Medium | Contain overflow, preserve a 44px button target, and verify at 390px. |
| Generated metadata is not valid TypeScript/JSX | Medium | Serialize optional values deliberately and compile representative generated output in tests. |

## Rollback

The refresh contains no persistence or migration. If it regresses the showcase, revert its fixture, control, viewer, and install-layout changes together to restore the existing canonical playground. No package rollback or data conversion is required.

## Next Step

Create the change specification that translates these product decisions into testable requirements and scenarios. Implementation remains blocked until specification, design, and task artifacts are complete.
