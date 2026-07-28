# Interactive Slider Showcase Refresh Delta Specification

This delta refreshes the existing showcase datasets and controls while preserving its published-package integration, canonical preview/source pipeline, and protected hero after the user-approved Core-fixture wiring rebaseline.

## 2026-07-28 Sport Fixture Contract Amendment

This amendment is normative and supersedes every earlier ten-record Sport statement below. Sport MUST contain exactly seven ordered records with IDs 1–7: Puma, Reebok, Under Armour, The North Face, Nike, Adidas, and Fila, using the current production URLs/class names. Every Sport record MUST have `style: { transition: "width 1s ease", filter: "invert()" }`. New Balance, Converse, and Asics MUST be absent. Food MUST remain the ten-record Appendix A fixture, and validation MUST retain `MAX_DATASET_SIZE = 10`. Fades expands Sport to 49 images and Food to 100. Earlier ten-record Sport evidence remains historical, not current acceptance authority.

## ADDED Requirements

### Requirement: Exact Showcase Dataset Selection and Integrity

The demonstration dataset selector MUST offer exactly `Core`, `Sport`, and `Food`, in that order, and MUST NOT offer `Frontend`. Sport MUST contain the seven amended records and Food MUST contain the ten records defined in Normative Appendix A, each in exact row order. Every field value, including capitalization and punctuation, MUST equal the corresponding appendix cell. An em dash in the `className` column means the property MUST be omitted rather than emitted with an empty or undefined value.

Dataset validation MUST accept a valid list of ten records and MUST reject a list of eleven records. ID uniqueness MUST be evaluated within one list, so the same ID MAY occur in different datasets while duplicate IDs within one dataset remain invalid. Validation, preview projection, remote-image fallback, and generated-source preparation MUST preserve each record's order, identity, `style`, and optional `className`. Replacing a failed remote image for preview MUST NOT change the canonical URL used in generated source.

#### Normative Appendix A: Exact Sport and Food Fixtures

Each Sport and Food record MUST be represented exactly by its row below. Row order within each dataset is normative.

| Dataset | ID | Name | Canonical `img` URL | `style.transition` | `className` |
| --- | ---: | --- | --- | --- | --- |
| Sport | 1 | Puma | <https://res.cloudinary.com/dmfs1od9n/image/upload/v1744835609/puma-logo-logo-svgrepo-com_ylvldf.svg> | `width 1s ease`; `filter: invert()` | `puma-icon` |
| Sport | 2 | Reebok | <https://res.cloudinary.com/dmfs1od9n/image/upload/v1744835608/reebok-crossfit_ger10e.svg> | `width 1s ease`; `filter: invert()` | `reebok-icon` |
| Sport | 3 | Under Armour | <https://res.cloudinary.com/dmfs1od9n/image/upload/v1744835607/under-armour_ddci89.svg> | `width 1s ease`; `filter: invert()` | `under-armour` |
| Sport | 4 | The North Face | <https://res.cloudinary.com/dmfs1od9n/image/upload/v1744835607/the-north-face_jql7qf.svg> | `width 1s ease`; `filter: invert()` | `northFace-icon` |
| Sport | 5 | Nike | <https://img.icons8.com/ios-filled/500/nike.png> | `width 1s ease`; `filter: invert()` | — |
| Sport | 6 | Adidas | <https://img.icons8.com/ios-filled/500/adidas-trefoil.png> | `width 1s ease`; `filter: invert()` | — |
| Sport | 7 | Fila | <https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111679/fila-svgrepo-com_nitwjq.svg> | `width 1s ease`; `filter: invert()` | — |
| Food | 1 | Papa Johns | <https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111637/papa_dojmtq.svg> | `width 1s ease` | — |
| Food | 2 | Burger King | <https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111638/burger-king_eyaxzl.svg> | `width 1s ease` | — |
| Food | 3 | SubWay | <https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111637/subway_mtrhua.svg> | `width 1s ease` | — |
| Food | 4 | Oreo | <https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111636/oreo_vfrh58.svg> | `width 1s ease` | — |
| Food | 5 | McDonalds | <https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111635/mcdonalds_g2tuh2.svg> | `width 1s ease` | — |
| Food | 6 | KFC | <https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111635/kfc_q9irnf.svg> | `width 1s ease` | — |
| Food | 7 | StarBucks | <https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111635/starbucks_b4obmn.svg> | `width 1s ease` | — |
| Food | 8 | Fritos | <https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111635/fritos_yuzj8p.svg> | `width 1s ease` | — |
| Food | 9 | ``Dunkin`Donuts`` | <https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111633/dunkin-donuts_kiwq2h.svg> | `width 1s ease` | — |
| Food | 10 | ``Domino`s Pizza`` | <https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111633/dominos-pizza_wddklm.svg> | `width 1s ease` | — |

#### Scenario: Selector exposes only the approved datasets

- **Given** the playground is in its initial state
- **When** a developer opens the dataset selector
- **Then** its selectable options are exactly `Core`, `Sport`, and `Food`, in that order
- **And** no `Frontend` option is present

#### Scenario: Sport preserves the normative fixture

- **Given** the seven Sport rows in Normative Appendix A
- **When** Sport is selected
- **Then** the preview and generated dataset preserve those rows in exact appendix order
- **And** every ID, name, canonical `img` URL, transition style, and optional class name equals its appendix cell
- **And** an appendix em dash results in an omitted `className`

#### Scenario: Food preserves the normative fixture

- **Given** the ten Food rows in Normative Appendix A
- **When** Food is selected
- **Then** the preview and generated dataset preserve those rows in exact appendix order
- **And** every ID, name, canonical `img` URL, and transition style equals its appendix cell
- **And** every Food record omits `className`

#### Scenario: Validation applies its maximum per list

- **Given** a dataset whose records otherwise satisfy the brand contract
- **When** the list contains ten records
- **Then** it is accepted as valid
- **But when** the list contains eleven records
- **Then** it is rejected and is not passed to `Slider` as valid data

#### Scenario: Repeated IDs are scoped to a dataset

- **Given** Sport contains IDs `1` through `7` and Food contains IDs `1` through `10`
- **When** either valid dataset is selected independently
- **Then** both datasets are accepted
- **But when** one selected list contains a repeated ID
- **Then** that list is rejected as invalid

#### Scenario: Remote fallback preserves metadata and canonical source

- **Given** a selected metadata-bearing record whose remote image fails
- **When** the preview materializes a readable fallback image
- **Then** the fallback record retains its ID, name, order, transition style, and optional class name
- **And** generated source still contains the record's canonical HTTPS URL
- **And** generated source never contains the fallback data URL

### Requirement: Global Icon Width Applies Across Showcase Fixtures

Core MUST retain its existing record identities and canonical image data while omitting fixture-level `width` and `height` from every Core record. Sport and Food MUST retain their approved metadata without introducing fixture-level dimensions or a `style.width`. As a result, changing the shared `iconWidth` setting MUST change the effective icon width of every record in Core, Sport, and Food. This showcase-data change MUST NOT alter or work around the published package's precedence among record dimensions, record style, and the global `iconWidth` prop.

#### Scenario: Core icons inherit the shared icon width

- **Given** Core is selected
- **When** the developer changes Icon width
- **Then** every Core icon receives the new global width in the published preview
- **And** no Core fixture `width` or `height` masks the setting
- **And** generated source reflects the same `iconWidth`

#### Scenario: Sport and Food icons inherit the shared icon width

- **Given** Sport or Food is selected
- **When** the developer changes Icon width
- **Then** every record in the selected dataset responds to the new global width
- **And** the supplied transition style and optional class name remain unchanged

#### Scenario: Package precedence remains authoritative

- **Given** `react-tech-slider@1.10.1` defines the effective precedence for global and record-level sizing
- **When** the showcase refresh is inspected
- **Then** no wrapper, local package patch, or private package CSS changes that precedence

### Requirement: Live Native Range Controls

The five numeric package controls MUST be native `input[type="range"]` elements with the following inclusive domains, steps, and displayed units. Each range MUST update canonical state on every change while dragging or using the keyboard; preview props, visible value output, and generated source MUST update from that same normalized value without waiting for blur or pointer release.

| Applies to | Control | Public prop | Minimum | Maximum | Step | Displayed unit |
| --- | --- | --- | ---: | ---: | ---: | --- |
| Both variants | Icon width | `iconWidth` | 1 | 10 | 0.25 | `rem` |
| Running | Border width | `borderWidth` | 0 | 8 | 1 | `px` |
| Running | Duration | `durationMs` | 5,000 | 120,000 | 1,000 | `ms` |
| Fades | Gap | `gap` | 0 | 180 | 4 | `px` |
| Fades | Speed | `speed` | 0.25 | 4 | 0.25 | `×` |

The ranges SHALL retain native Arrow-key, Home, and End behavior. Running-only ranges MUST remain absent or inoperable in fades, fades-only ranges MUST remain absent or inoperable in running, and switching variants MUST preserve each variant's prior settings. Reset MUST restore all five settings to their documented initial values and synchronize preview, value output, and generated source.

#### Scenario: Pointer change synchronizes immediately

- **Given** any one of the five ranges is available for the selected variant
- **When** its value changes during a pointer drag
- **Then** the adjacent value output updates before blur or pointer release
- **And** the matching `Slider` prop and generated numeric JSX prop update to the same normalized value

#### Scenario: Keyboard change uses native range behavior

- **Given** keyboard focus is on an available range
- **When** the developer uses Arrow keys, Home, or End
- **Then** the range follows native keyboard adjustment within its declared domain and step
- **And** preview and generated source update continuously to the resulting value

#### Scenario: Every range preserves its exact domain

- **Given** each range is inspected
- **When** its `min`, `max`, `step`, value output, and unit are read
- **Then** they exactly match the corresponding row in the range table
- **And** no non-finite or out-of-domain value reaches preview or generated source

#### Scenario: Variant settings remain isolated and resettable

- **Given** the developer has changed running-only and fades-only ranges
- **When** they switch between running and fades
- **Then** each variant restores its own prior values and emits only its supported props
- **And when** reset is activated
- **Then** shared and variant-specific ranges, preview props, and generated source return to their documented initial values

### Requirement: Alpha-Capable Color Controls with Precise Text Entry

Border color and background color MUST each provide a `HexAlphaColorPicker` from `react-colorful` plus a visible, programmatically labeled text input for precise entry and keyboard fallback. Picker changes MUST update canonical state, the published preview, the text input, and generated source continuously. Eight-digit hex values, including `#00000033`, MUST remain unchanged through picker input, text entry, variant round trips, and reset.

Each text input MUST identify whether it controls Border color or Background color. An invalid or incomplete text draft MUST remain available for correction, MUST expose an invalid state and nearby descriptive feedback, and MUST NOT replace the last valid canonical preview or generated value. Committing a valid draft by the documented text-input interaction MUST synchronize the picker, preview, and source. Reset MUST restore both canonical colors and both text values to their documented initial values.

#### Scenario: Picker emits a live alpha color

- **Given** the Border color or Background color picker is available
- **When** it emits an eight-digit hex color
- **Then** the corresponding text input displays that exact value
- **And** preview props and generated source update to that exact value immediately
- **And** the alpha component is not discarded or converted to an opaque value

#### Scenario: Precise text entry commits a valid color

- **Given** focus is in a color control's labeled text input
- **When** the developer enters a valid CSS color and commits it with the documented Enter or blur interaction
- **Then** the matching picker, preview prop, and generated source use the committed value
- **And** the other color control is unchanged

#### Scenario: Invalid text remains contained

- **Given** a valid canonical color is active
- **When** the developer enters and commits an invalid or incomplete text draft
- **Then** the draft remains visible for correction and is identified as invalid
- **And** nearby feedback is programmatically associated with the text input
- **And** the picker, preview, and generated source retain the last valid canonical color

#### Scenario: Alpha colors survive variant and reset transitions

- **Given** an eight-digit color is active in running
- **When** the developer switches to fades and back to running
- **Then** the eight-digit value is restored exactly in picker, text input, preview, and source
- **And when** reset is activated
- **Then** both colors return consistently to their documented alpha-capable initial values

### Requirement: Safe Read-Only Generated Source Viewer

Generated TypeScript/JSX MUST appear in a syntax-highlighted, read-only viewer with visible line numbers. The source MUST remain selectable and MUST NOT be editable, persisted, or executable. Highlighting MUST render safe React text and element nodes and MUST NOT use `dangerouslySetInnerHTML` or another raw-HTML injection path. External brand names, class names, and URLs MUST therefore render as text regardless of punctuation or markup-like characters.

The viewer MUST preserve one visible line number per source line and MUST preserve the generated source exactly for copying, without including line numbers or presentation tokens in clipboard text. It MUST have a bounded region that contains horizontal and vertical overflow so long metadata-bearing source does not create page-level overflow. Copy MUST remain its only source action.

#### Scenario: Highlighted source is rendered safely

- **Given** generated source contains TypeScript/JSX, URLs, and metadata strings containing punctuation or markup-like characters
- **When** the viewer renders it
- **Then** recognizable token categories are visually distinguished
- **And** all source content is represented through escaped React nodes
- **And** no raw HTML injection API is used

#### Scenario: Line numbers match source lines

- **Given** generated source contains multiple lines
- **When** the viewer is displayed
- **Then** each source line has one corresponding visible line number in sequential order
- **And** selecting the source does not require selecting the line numbers

#### Scenario: Copied source is exact

- **Given** highlighted source is visible
- **When** the developer activates its copy action
- **Then** clipboard text is exactly the canonical generated source
- **And** it contains neither line numbers nor highlighting markup
- **And** success or failure feedback does not replace or alter the visible source

#### Scenario: Viewer cannot edit or execute source

- **Given** keyboard or pointer focus reaches the generated-source region
- **When** the developer interacts with its text
- **Then** the text can be selected but not edited
- **And** no action to execute, save, or persist the source is offered
- **And** the viewer is not content-editable

#### Scenario: Long source remains locally contained

- **Given** a ten-record metadata-bearing dataset produces long lines or many lines
- **When** the viewer is shown at a narrow page width
- **Then** overflow scrolls inside the bounded viewer
- **And** line numbers remain aligned with their source lines
- **And** the document does not gain horizontal overflow from the source

### Requirement: Inline Install Command Copy

The selected install command MUST be presented in a single command field containing a right-aligned inline copy button. The button MUST be keyboard reachable, MUST have the accessible name `Copy install command`, and MUST copy exactly the command displayed for the selected package-manager tab: `npm install react-tech-slider` for npm and `pnpm add react-tech-slider` for pnpm. No separate standalone install-copy action SHALL be presented outside that command field.

Copy success and failure MUST be visible and announced through an assistive-technology-readable status. If clipboard access is absent, denied, or rejects the write, the command MUST remain visible and manually selectable and the failure feedback MUST explain that manual copying remains available. The field and button MUST remain contained without page-level overflow at narrow layouts, and the inline button MUST remain operable without covering the selectable command text.

#### Scenario: npm command is copied from its field

- **Given** the npm tab is selected
- **When** the developer activates `Copy install command` inside the command field
- **Then** the requested clipboard text is exactly `npm install react-tech-slider`
- **And** perceivable success feedback is provided

#### Scenario: pnpm command is copied after tab selection

- **Given** the developer selects the pnpm tab
- **When** they activate the inline copy button
- **Then** the displayed and copied text are exactly `pnpm add react-tech-slider`
- **And** the button remains inside the active command field

#### Scenario: Clipboard failure preserves manual access

- **Given** clipboard writing is unavailable or rejects
- **When** the developer activates the inline copy button
- **Then** no success is announced
- **And** visible and announced failure feedback identifies manual copying as the fallback
- **And** the exact command remains visible and selectable

#### Scenario: Inline field is usable in a narrow layout

- **Given** the page is viewed at a representative narrow width
- **When** the install command field is displayed
- **Then** its command text and inline button remain within the page
- **And** the button does not obscure selection of the command
- **And** no separate block-level copy action appears

### Requirement: Refreshed Source Preserves Optional Brand Metadata

Generated source MUST remain syntactically valid TypeScript/JSX assignable to the published `Brand` type. For every valid selected record it MUST emit the canonical `id`, `name`, and remote `img` value; it MUST also emit `style` and `className` when present and MUST omit either optional field when absent. String and style values MUST be escaped and serialized as valid TypeScript/JSX. Preview and source MUST continue to derive from the same normalized invocation, while source MUST use canonical remote URLs and MUST never expose image-fallback data URLs.

#### Scenario: Optional metadata is emitted as valid TypeScript/JSX

- **Given** a valid record has `style: { transition: "width 1s ease" }` and a supplied `className`
- **When** generated source is produced
- **Then** both properties appear with their exact values in the corresponding brand object
- **And** the generated dataset is assignable to the published `Brand` type

#### Scenario: Absent metadata remains absent

- **Given** a valid record has no `className` or no `style`
- **When** generated source is produced
- **Then** the absent optional property is omitted rather than synthesized with an empty or undefined value

#### Scenario: Metadata-bearing strings are safe and exact

- **Given** names, class names, URLs, or CSS values contain punctuation requiring string escaping
- **When** source is generated and displayed
- **Then** the resulting TypeScript/JSX is syntactically valid
- **And** evaluating its literal values would reproduce the canonical metadata exactly

## MODIFIED Requirements

### Requirement: Published Package Integration

The showcase MUST continue to consume the published `react-tech-slider@1.10.1` package and render both variants through its exported `Slider`. It MUST NOT copy, reimplement, patch, or link to local package source. Published-package fades alignment and animation geometry MUST remain authoritative; showcase styles MUST NOT target private package selectors or add a demo-owned alignment workaround. Generated examples SHALL import `Slider` and optional public types only from the package root.

#### Scenario: Published variants remain authoritative

- **Given** dependencies are installed as declared
- **When** running or fades is selected
- **Then** the preview is rendered by `react-tech-slider@1.10.1`
- **And** no local slider or animation implementation substitutes for the package

#### Scenario: Package-owned fades alignment is preserved

- **Given** fades is selected in any preview preset
- **When** the animation renders
- **Then** its alignment and animation geometry come from the published package
- **And** no showcase rule targets private package classes to alter that behavior

#### Scenario: Generated imports use the public root

- **Given** a developer views or copies generated usage
- **When** its imports are inspected
- **Then** package values and types are imported from `react-tech-slider`
- **And** no internal module path is used

### Requirement: Session State Preservation and Reset

The showcase MUST preserve shared settings and separate running-specific and fades-specific settings during the page session. Switching variants MUST restore the selected variant's prior settings and MUST keep preview props, control values, and generated source synchronized. Reset MUST restore the documented initial selected variant, Core dataset, all shared and variant-specific values including both alpha-capable colors, and the initial preview preset. Reset MUST NOT change the selected install tab or navigate away.

#### Scenario: Variant edits survive a round trip

- **Given** the developer changes shared settings, running settings, fades settings, and a dataset selection
- **When** they switch variants and return
- **Then** shared settings and the selected dataset remain current
- **And** each variant restores only its own prior settings
- **And** preview and generated source match the restored controls

#### Scenario: Reset restores the complete playground

- **Given** dataset, variant, range, color, toggle, or preview-preset state differs from its initial value
- **When** the developer activates reset
- **Then** the selected variant, Core dataset, both variant state stores, shared state, colors, and preview preset return to documented initial values
- **And** preview and generated source update to those same values
- **And** the install tab remains selected as before reset

### Requirement: Responsive Preview Presets and Failure Containment

The existing desktop, tablet, and mobile preview presets MUST remain preview-only controls and MUST NOT appear in generated package props. Package rendering MUST remain contained within the selected preview region, including ten-record fades datasets. Remote-image fallback and the preview error boundary MUST remain available without disabling controls, generated source, install guidance, or reset. At narrow page widths, ranges, color controls, preview, generated-source viewer, and inline install field MUST remain reachable without horizontal page overflow.

#### Scenario: Preview presets remain isolated from package source

- **Given** canonical package settings are unchanged
- **When** the developer selects desktop, tablet, or mobile
- **Then** only the preview canvas constraint changes
- **And** no viewport or preset property appears in generated source

#### Scenario: Image failures remain contained

- **Given** one or more canonical remote images fail
- **When** fallbacks are rendered
- **Then** the preview remains usable with readable stable fallbacks
- **And** controls, source, install guidance, preview presets, and reset remain reachable
- **And** canonical source URLs remain unchanged

#### Scenario: Preview rendering failure remains contained

- **Given** the published package throws while rendering a selected dataset
- **When** the error boundary handles the failure
- **Then** only the preview region shows a recoverable failure state
- **And** the rest of the playground remains operable

#### Scenario: Seven-brand Sport and ten-brand Food fades remain within the preview

- **Given** Sport or Food is selected with fades
- **When** the package renders 49 Sport or 100 Food fade images at supported gap and speed boundaries
- **Then** animation content remains visually contained by the preview preset
- **And** it does not enlarge the document's horizontal scroll area

### Requirement: Protected Hero and Showcase Scope

Per explicit user approval on 2026-07-28, `src/App.tsx` MUST keep exactly one amended hero state: import `CORE_BRANDS`, remove the duplicated hero-local brands array, pass `brandsList={CORE_BRANDS}`, and set the existing hero Slider to `iconWidth={18}`. The hero therefore reuses canonical fixture data while retaining the same published-package integration and all other hero markup/content. The extracted `<section className="hero-shell">` MUST remain byte-for-byte unchanged after this rebaseline, with final protected SHA-256 `aa787e708db68498c3b051446d7416b9933b2455f238bcf49e346bee3b56bdee`. The previous historical protected hash was `2b40e750e89c920657832665f59749b0d97cf7a0069b884b938d99fc71d46346`; the partial `8c04b455f6ea3fe26b12a0a6e16e2c003e7a86297e168bc3eba73bf6dd3c7ca6` rebaseline is superseded and MUST NOT be used as a forward expectation. Unit G stopped when the amended state first appeared without approval, and this amendment resolves that blocker. Any further App/hero change MUST require another explicit user decision. The refresh MUST preserve the existing page information architecture, adoption content, public-package boundary, and preview-preset semantics. It MUST NOT add a package patch, local slider, private package CSS override, editable or executable code environment, persistence, arbitrary dataset editor, backend, or unrelated dependency surface.

#### Scenario: Approved hero wiring reuses the canonical Core fixture

- **Given** the user approved the 2026-07-28 scope amendment
- **When** `src/App.tsx` hero data wiring is inspected
- **Then** it imports and passes `CORE_BRANDS`
- **And** no duplicated hero-local brands array remains
- **And** the existing hero Slider has `iconWidth={18}`
- **And** package integration and all other hero markup/content remain unchanged

#### Scenario: Rebaselined protected hero is unchanged

- **Given** the approved Core wiring amendment is present and the refresh implementation is complete
- **When** the protected hero section is compared byte for byte and hashed
- **Then** no further hero drift exists
- **And** its SHA-256 is exactly `aa787e708db68498c3b051446d7416b9933b2455f238bcf49e346bee3b56bdee`

#### Scenario: Refresh remains within showcase scope

- **Given** the implementation and dependencies are reviewed
- **When** its dataset, controls, viewer, and install changes are inspected
- **Then** they use the existing canonical showcase architecture and published package
- **And** none of the excluded package, editor, persistence, backend, or private-style surfaces has been introduced

### Requirement: Verification and Acceptance

Automated verification MUST cover externally observable state and static contracts that the repository test environment can prove: exact selector options and fixture data, ten-valid/eleven-invalid validation, per-list ID uniqueness, metadata preservation, canonical URL source generation, valid metadata-bearing TypeScript/JSX, all five range domains and immediate event synchronization, picker callbacks and invalid-draft containment, variant isolation and reset, safe read-only viewer structure and exact clipboard text, inline install copy behavior, fallback/error containment, and the protected hero hash. Repository-configured focused tests, full tests, production build, and lint MUST pass before acceptance.

Browser verification MUST separately record pointer and keyboard range behavior, `HexAlphaColorPicker` interaction and alpha rendering, focus order and labeling, selectable highlighted source and line-number alignment, long-line and bounded-overflow behavior, inline install copying at a representative narrow width, all preview presets, image fallback appearance, package-owned fades alignment, and 49-image Sport/100-image Food fades containment and performance at supported gap/speed extremes. Browser-only behavior MUST NOT be reported as passing from jsdom, static inspection, build, lint, or type checking alone. Any browser check not executed MUST be recorded as unverified or waived rather than passing.

#### Scenario: Automated verification proves deterministic contracts

- **Given** implementation is complete
- **When** focused and full automated tests, production build, lint, and the hero hash check run
- **Then** each command exits successfully
- **And** automated assertions cover the deterministic contracts listed in this requirement
- **And** no automated result is presented as proof of browser rendering, pointer behavior, visual overflow, or performance

#### Scenario: Generated metadata compiles

- **Given** representative Sport and Food source includes optional `style` and `className`
- **When** the generated TypeScript/JSX is checked by the project's compiler-based verification
- **Then** it has no syntax or published-type assignment errors
- **And** its image literals are canonical remote HTTPS URLs rather than fallback data URLs

#### Scenario: Browser acceptance records visual and interaction evidence

- **Given** automated verification passes
- **When** the browser acceptance matrix is performed at representative wide and narrow widths
- **Then** each required pointer, keyboard, picker, source-selection, overflow, alignment, fallback, and ten-brand fades check is recorded individually as passing or blocking
- **And** ten-brand fades performance is observed at supported gap and speed extremes

#### Scenario: Browser verification is unavailable

- **Given** no browser run was performed for one or more browser-only checks
- **When** acceptance evidence is reported
- **Then** those checks are marked unverified or explicitly waived
- **And** automated results are not used to claim that the missing visual or interaction checks passed
