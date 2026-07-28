# Interactive Slider Showcase Specification

This specification defines the current required behavior of the `react-tech-slider` showcase. It combines the established single-page evaluation experience with the verified dataset, control, source-viewer, install-copy, and protected-hero refresh.

## Requirement: Published Package Integration

The showcase MUST consume the published `react-tech-slider@1.10.1` package and MUST render both slider variants through its root-exported `Slider` component. It MUST NOT copy, reimplement, patch, or link to local package source. Generated examples SHALL import `Slider` and any public types only from the `react-tech-slider` package root and MUST NOT import an internal module or CSS subpath.

Published-package sizing precedence, fades alignment, animation geometry, and runtime behavior MUST remain authoritative. Showcase styles MUST NOT target package-private selectors or add demo-owned package alignment or animation overrides.

### Scenario: Published variants remain authoritative

- **Given** dependencies resolve to `react-tech-slider@1.10.1`
- **When** running or fades is selected
- **Then** the preview is rendered by the published package's `Slider`
- **And** no local slider or showcase-authored animation substitutes for it

### Scenario: Consumer imports use the public root

- **Given** generated usage is displayed or copied
- **When** its imports are inspected
- **Then** package values and public types are imported from `react-tech-slider`
- **And** no internal module path or CSS subpath is used

### Scenario: Package-owned rendering remains unmodified

- **Given** fades or global icon sizing is rendered
- **When** showcase styles and wrappers are inspected
- **Then** package sizing precedence, alignment, and animation geometry remain package-owned
- **And** no private package selector, local patch, or demo alignment workaround changes them

## Requirement: Single-Page Evaluation and Adoption Flow

The showcase SHALL remain one responsive Vite, React, and TypeScript page with a dark editorial presentation, restrained gradients, visible focus, and a high-contrast preview. In one continuous flow it MUST provide a package hero, an in-page primary path to the playground, the live playground, running and fades controls, desktop/tablet/mobile preview presets, install guidance, generated usage, concise feature and public-API guidance, the fades limitation disclosure, and distinct links to the published package and repository.

The playground SHALL remain the primary task surface. On wide layouts the preview SHALL be visually prominent; on narrow layouts all primary controls and adoption guidance MUST remain reachable without page-level horizontal overflow.

### Scenario: Developer moves from evaluation to adoption

- **Given** a developer lands at the top of the page
- **When** they follow the primary hero action
- **Then** focus or navigation reaches the playground on the same page
- **And** they can select a variant and dataset, configure supported props, select an install command, and obtain matching usage without consulting package internals

### Scenario: Package resources are identifiable

- **Given** the developer reviews adoption guidance
- **When** they inspect the resource links
- **Then** distinct links identify the published `react-tech-slider` package and its repository
- **And** package naming is consistent across the page

## Requirement: Exact Showcase Datasets and Validation

The dataset selector MUST offer exactly `Core`, `Sport`, and `Food`, in that order. The selected values MUST correspond to `core`, `sport`, and `food`.

Core MUST contain the six exact ordered records in Table 1. Sport MUST contain the seven exact ordered records in Table 2. Food MUST contain the ten exact ordered records in Table 3. Every field, including capitalization and punctuation, MUST equal its table cell. An em dash in an optional field means that property MUST be omitted.

Core records MUST omit fixture-level `width`, `height`, and `style.width`. Sport and Food MUST omit fixture-level dimensions and `style.width`. Every Sport record MUST include both `transition: "width 1s ease"` and `filter: "invert()"`. Every Food record MUST include `transition: "width 1s ease"` and no filter. No unlisted record may be added to these curated fixtures.

### Table 1: Core fixture

| ID | Name | Canonical `img` URL | `style` | `className` |
| ---: | --- | --- | --- | --- |
| 1 | TypeScript | <https://cdn.simpleicons.org/typescript> | — | — |
| 2 | React | <https://cdn.simpleicons.org/react> | — | — |
| 3 | npm | <https://res.cloudinary.com/dmfs1od9n/image/upload/v1785109501/idTOrUuxMp_1785109477561_igg5qy.png> | — | — |
| 4 | css | <https://res.cloudinary.com/dmfs1od9n/image/upload/v1746640784/purple-css-logo_xufnis.webp> | — | — |
| 5 | GitHub | <https://res.cloudinary.com/dmfs1od9n/image/upload/v1739393991/github_ualv1s.png> | — | — |
| 6 | pnpm | <https://cdn.simpleicons.org/pnpm> | — | — |

### Table 2: Sport fixture

| ID | Name | Canonical `img` URL | `style.transition` | `style.filter` | `className` |
| ---: | --- | --- | --- | --- | --- |
| 1 | Puma | <https://res.cloudinary.com/dmfs1od9n/image/upload/v1744835609/puma-logo-logo-svgrepo-com_ylvldf.svg> | `width 1s ease` | `invert()` | `puma-icon` |
| 2 | Reebok | <https://res.cloudinary.com/dmfs1od9n/image/upload/v1744835608/reebok-crossfit_ger10e.svg> | `width 1s ease` | `invert()` | `reebok-icon` |
| 3 | Under Armour | <https://res.cloudinary.com/dmfs1od9n/image/upload/v1744835607/under-armour_ddci89.svg> | `width 1s ease` | `invert()` | `under-armour` |
| 4 | The North Face | <https://res.cloudinary.com/dmfs1od9n/image/upload/v1744835607/the-north-face_jql7qf.svg> | `width 1s ease` | `invert()` | `northFace-icon` |
| 5 | Nike | <https://img.icons8.com/ios-filled/500/nike.png> | `width 1s ease` | `invert()` | — |
| 6 | Adidas | <https://img.icons8.com/ios-filled/500/adidas-trefoil.png> | `width 1s ease` | `invert()` | — |
| 7 | Fila | <https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111679/fila-svgrepo-com_nitwjq.svg> | `width 1s ease` | `invert()` | — |

### Table 3: Food fixture

| ID | Name | Canonical `img` URL | `style.transition` | `className` |
| ---: | --- | --- | --- | --- |
| 1 | Papa Johns | <https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111637/papa_dojmtq.svg> | `width 1s ease` | — |
| 2 | Burger King | <https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111638/burger-king_eyaxzl.svg> | `width 1s ease` | — |
| 3 | SubWay | <https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111637/subway_mtrhua.svg> | `width 1s ease` | — |
| 4 | Oreo | <https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111636/oreo_vfrh58.svg> | `width 1s ease` | — |
| 5 | McDonalds | <https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111635/mcdonalds_g2tuh2.svg> | `width 1s ease` | — |
| 6 | KFC | <https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111635/kfc_q9irnf.svg> | `width 1s ease` | — |
| 7 | StarBucks | <https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111635/starbucks_b4obmn.svg> | `width 1s ease` | — |
| 8 | Fritos | <https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111635/fritos_yuzj8p.svg> | `width 1s ease` | — |
| 9 | ``Dunkin`Donuts`` | <https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111633/dunkin-donuts_kiwq2h.svg> | `width 1s ease` | — |
| 10 | ``Domino`s Pizza`` | <https://res.cloudinary.com/dmfs1od9n/image/upload/v1745111633/dominos-pizza_wddklm.svg> | `width 1s ease` | — |

Dataset validation MUST accept non-empty valid lists containing at most `MAX_DATASET_SIZE = 10` records and MUST reject lists containing eleven or more. IDs MUST be finite and unique within one list; the same IDs MAY occur in different datasets. Names MUST be non-empty, canonical images MUST be HTTPS URLs, optional dimensions MUST be finite, optional `className` MUST be a string, and optional style values MUST be strings or finite numbers. Validation MUST preserve the original valid records, order, identity, style, and optional class name without normalizing them.

### Scenario: Selector exposes the approved datasets

- **Given** the playground is in its initial state
- **When** a developer opens the dataset selector
- **Then** its options are exactly `Core`, `Sport`, and `Food`, in that order

### Scenario: Curated fixtures preserve exact records

- **Given** any curated dataset table above
- **When** that dataset is selected
- **Then** preview preparation and generated data preserve every row in exact table order
- **And** every ID, name, canonical image URL, style value, and optional class name equals its table cell
- **And** every property represented by an em dash is omitted

### Scenario: Validation applies the maximum per list

- **Given** records that otherwise satisfy the brand contract
- **When** a list contains ten records
- **Then** it is accepted as valid
- **But when** a list contains eleven records
- **Then** it is rejected and is not passed to `Slider` as valid data

### Scenario: Repeated IDs are scoped to one list

- **Given** two valid datasets independently use IDs beginning at `1`
- **When** each list is validated separately
- **Then** both datasets are accepted
- **But when** one list repeats an ID
- **Then** that list is rejected

### Scenario: Empty or invalid data is contained

- **Given** a selected dataset is empty or violates an identity, URL, dimension, class-name, or style rule
- **When** the dataset is prepared
- **Then** invalid data is not passed to `Slider`
- **And** the preview shows a deliberate contained empty or data-error state
- **And** controls, generated guidance, install guidance, navigation, and reset remain usable

## Requirement: Canonical Metadata and Remote Image Fallback

Canonical records MUST remain the source of generated usage. Preview image resolution MAY replace only a record's `img` value with a stable readable SVG data URL while a remote image is pending or after it fails. That preview substitution MUST preserve the record's ID, name, order, dimensions, style, and optional class name. Generated source MUST always retain the canonical HTTPS URL and MUST never expose a fallback data URL.

Remote resolution MUST avoid broken-image chrome, MUST provide a readable brand-name fallback, MUST detach stale callbacks when datasets change, and MUST NOT automatically retry a terminally failed resource in a loop. A late image error after preflight MUST remain contained to the affected preview record. One or many image failures MUST NOT disable the rest of the page.

### Scenario: Remote image succeeds

- **Given** a canonical remote image is available
- **When** preview resolution completes
- **Then** the preview uses the canonical image URL
- **And** brand identity and metadata remain unchanged

### Scenario: Remote image fails

- **Given** a metadata-bearing canonical record whose image is pending or fails
- **When** the preview materializes a fallback
- **Then** the fallback is readable and preserves the logo slot, identity, order, style, and optional class name
- **And** generated source still contains the canonical HTTPS URL
- **And** generated source does not contain the fallback data URL
- **And** the failed resource is not retried automatically in a loop

### Scenario: Broad image failure remains contained

- **Given** multiple remote images fail
- **When** fallbacks are displayed
- **Then** each affected brand remains identifiable
- **And** controls, source, install guidance, preview presets, reset, navigation, and API guidance remain usable

## Requirement: Variant Rendering and Exact Prop Mapping

The playground MUST offer `running` and `fades` as distinct selectable variants. Running MAY omit the variant discriminator because it is the package default. Fades MUST pass and generate `variant="fades"`.

Running preview and source MUST use only `brandsList`, `iconWidth`, `borderWidth`, `borderColor`, `backgroundColor`, `isPlay`, `pauseOnHoverActive`, and `durationMs` as applicable. Fades preview and source MUST use only `variant="fades"`, `brandsList`, `iconWidth`, `gap`, and `speed` as applicable. Preview-only and transient state MUST NOT become package props. Unsupported or obsolete prop names MUST NOT be emitted.

Only controls supported by the active variant SHALL be presented or operable. Running SHALL expose shared dataset and icon-width controls plus border width, border color, background color, playback, pause-on-hover, and duration. Fades SHALL expose shared dataset and icon-width controls plus gap and speed. Switching variants MUST update preview, controls, limitation guidance, and generated source together.

### Scenario: Running exposes only running controls and props

- **Given** running is selected
- **When** the developer inspects controls, preview props, and generated usage
- **Then** shared and running-specific controls are available
- **And** fades-only controls and props are absent or inoperable
- **And** the package default running discriminator may be omitted

### Scenario: Fades exposes only fades controls and props

- **Given** fades is selected
- **When** the developer inspects controls, preview props, and generated usage
- **Then** shared, gap, and speed controls are available
- **And** running-only controls and props are absent or inoperable
- **And** generated usage contains `variant="fades"`

### Scenario: Preview-only state remains isolated

- **Given** package settings are unchanged
- **When** the developer changes a viewport preset, copy status, install tab, or preview retry state
- **Then** no corresponding property appears in preview package props or generated usage

## Requirement: Global Icon Width Applies to Every Fixture

Changing the shared `iconWidth` setting MUST change the effective icon width of every Core, Sport, and Food record. Fixture dimensions or `style.width` MUST NOT mask the global prop. Existing Sport/Food transition and class metadata MUST remain unchanged. The showcase MUST NOT alter package precedence to achieve this behavior.

### Scenario: Every dataset inherits the shared icon width

- **Given** Core, Sport, or Food is selected
- **When** the developer changes Icon width
- **Then** every selected record receives the new global width in the published preview
- **And** generated usage reflects the same `iconWidth`
- **And** no fixture-level dimension or style width masks it

## Requirement: Five Live Native Range Controls

The five numeric package controls MUST be native `input[type="range"]` elements with the exact inclusive domains, steps, and displayed units in the following table.

| Applies to | Control | Public prop | Minimum | Maximum | Step | Displayed unit |
| --- | --- | --- | ---: | ---: | ---: | --- |
| Both variants | Icon width | `iconWidth` | 1 | 10 | 0.25 | `rem` |
| Running | Border width | `borderWidth` | 0 | 8 | 1 | `px` |
| Running | Duration | `durationMs` | 5,000 | 120,000 | 1,000 | `ms` |
| Fades | Gap | `gap` | 0 | 180 | 4 | `px` |
| Fades | Speed | `speed` | 0.25 | 4 | 0.25 | `×` |

Each range MUST update canonical state on every change while dragging or using the keyboard. The visible value output, published preview prop, and generated numeric JSX prop MUST update from the same finite normalized value without waiting for blur or pointer release. Numeric JSX values MUST be numbers rather than quoted strings.

Ranges SHALL retain native Arrow-key, Home, and End behavior. Running-only ranges MUST be absent or inoperable in fades, fades-only ranges MUST be absent or inoperable in running, and switching variants MUST preserve each variant's prior range settings.

### Scenario: Pointer change synchronizes immediately

- **Given** one of the five ranges is available
- **When** its value changes during a pointer drag
- **Then** the adjacent value output updates before blur or pointer release
- **And** the matching preview prop and generated numeric JSX prop use the same normalized value

### Scenario: Keyboard change uses native range behavior

- **Given** keyboard focus is on an available range
- **When** the developer uses Arrow keys, Home, or End
- **Then** native adjustment stays within the declared domain and step
- **And** preview, visible output, and generated source update continuously

### Scenario: Range domains and units are exact

- **Given** each range is inspected
- **When** its `min`, `max`, `step`, output, and unit are read
- **Then** they equal the corresponding table row
- **And** no empty, non-finite, or out-of-domain value reaches preview or source

## Requirement: Alpha-Capable Color Controls and Resolver

Border color and background color MUST each provide a `HexAlphaColorPicker` from `react-colorful` and a visible, programmatically labeled text input for precise entry and keyboard fallback. Picker changes MUST continuously update canonical state, text, published preview, and generated source. Eight-digit hex values, including `#00000033`, MUST remain exact through picker input, text input, variant round trips, and reset.

Each text input MUST identify its color role. Invalid or incomplete text MUST remain available for correction, MUST expose an invalid state and programmatically associated nearby feedback, and MUST NOT replace the last valid canonical preview or generated value. Enter and blur SHALL use the documented commit path. A valid commit MUST synchronize picker, preview, and source without changing the other color.

The color resolver MUST preserve a valid trimmed concrete CSS color as the canonical package/source value while supplying the picker a derived eight-digit `#RRGGBBAA` sRGB value. It MUST directly support valid 3-, 4-, 6-, and 8-digit hex input, adding or expanding alpha only for the picker projection. It SHALL resolve other concrete browser colors, including named, transparent, RGB/HSL, and supported modern concrete colors, through browser color resolution and deterministic sRGB sampling. It MUST reject empty values, CSS-wide keywords, CSS variables, context-dependent colors, unresolved values, and environments that cannot safely resolve a concrete color. Resolver failure MUST preserve the prior canonical color rather than guess.

### Scenario: Picker emits a live alpha color

- **Given** either color picker is available
- **When** it emits an eight-digit hex color
- **Then** the matching text input displays that exact value
- **And** preview and generated source update immediately to that exact value
- **And** alpha is not discarded

### Scenario: Precise text commits a concrete color

- **Given** focus is in a labeled color text input
- **When** the developer enters a valid concrete CSS color and commits with Enter or blur
- **Then** canonical preview and source preserve the trimmed entered value
- **And** the picker receives an equivalent eight-digit sRGB hex projection
- **And** the other color remains unchanged

### Scenario: Invalid text remains contained

- **Given** a valid canonical color is active
- **When** the developer commits an invalid, incomplete, context-dependent, or unresolvable draft
- **Then** the draft remains visible and is identified as invalid
- **And** nearby feedback is programmatically associated with the input
- **And** picker, preview, and source retain the last valid canonical color

### Scenario: Color state survives transitions and reset

- **Given** alpha-capable colors have been changed
- **When** the developer switches variants and returns
- **Then** committed colors are restored exactly in text, picker, preview, and source
- **And when** reset is activated
- **Then** border color returns to `#7c05d8` and background color returns to `#00000033`

## Requirement: Session State Preservation and Reset

The showcase MUST preserve shared settings and independent running-specific and fades-specific settings for the page session. Switching variants MUST restore the selected variant's prior settings while keeping preview, controls, and generated source synchronized. Persistence across reloads or sessions is not required and MUST NOT be implied.

The documented initial playground state SHALL be:

| State | Initial value |
| --- | --- |
| Variant | running |
| Preview preset | desktop |
| Dataset | Core |
| Icon width | `5 rem` |
| Running border width | `1 px` |
| Running border color | `#7c05d8` |
| Running background color | `#00000033` |
| Running playback | on unless the captured reduced-motion session preference initializes it off |
| Running pause on hover | off |
| Running duration | `30000 ms` |
| Fades gap | `96 px` |
| Fades speed | `1×` |
| Install tab | npm, owned separately |

Reset MUST atomically restore the captured initial selected variant, Core dataset, preview preset, shared values, all five numeric settings, both colors, toggles, and both variant stores. Reset MUST keep the selected install tab unchanged and MUST NOT navigate away. Uncommitted field drafts MAY be discarded when their controls unmount or reset.

### Scenario: Variant edits survive a round trip

- **Given** the developer changes shared, running-specific, and fades-specific settings
- **When** they switch variants and return
- **Then** shared settings and selected dataset remain current
- **And** each variant restores only its own prior settings
- **And** preview and generated source match the restored controls

### Scenario: Reset restores the complete playground

- **Given** playground state differs from its captured initial values
- **When** the developer activates reset
- **Then** variant, Core dataset, preview preset, both variant stores, shared settings, ranges, colors, and toggles return to the documented initial state
- **And** preview and source update to the same state
- **And** the install tab remains selected as before reset

### Scenario: Reload starts a new session

- **Given** the developer changed playground state
- **When** they reload the page
- **Then** the showcase MAY initialize a new session
- **And** it does not claim persistent settings

## Requirement: Canonical Preview and Generated TypeScript/JSX

One normalized typed invocation MUST drive both published preview props and generated source. UI components MUST NOT maintain independent prop-selection or source-selection maps.

Generated usage MUST be syntactically valid, copy-ready TypeScript/JSX assignable to the published `Brand` type. It SHALL include a minimal `Brand[]`, a package-root import, and a rendered `Slider`. It MUST include every current non-default setting required to reproduce the visible package result and MUST omit irrelevant or default-equivalent props when omission preserves that result.

For each valid brand, generated source MUST emit canonical `id`, `name`, and remote `img`; it MUST emit optional dimensions, `style`, and `className` when present and MUST omit absent optional fields. Strings, style keys, and style values MUST be escaped and serialized as valid TypeScript/JSX. Generated source MUST exclude preview preset, reset, copy, install-tab, fallback, retry, and field-draft state.

### Scenario: A package control changes

- **Given** preview and generated source are synchronized
- **When** a supported package control changes
- **Then** both update from the same normalized invocation value
- **And** copying immediately afterward yields the updated source

### Scenario: Optional metadata is emitted exactly

- **Given** a valid record contains `style` or `className`
- **When** generated source is produced
- **Then** each supplied optional property appears with its exact value
- **And** the generated dataset is assignable to the published `Brand` type
- **And** any absent optional property remains omitted

### Scenario: Metadata-bearing strings remain safe and canonical

- **Given** names, URLs, class names, or CSS values contain punctuation requiring escaping
- **When** source is generated
- **Then** the TypeScript/JSX remains syntactically valid
- **And** its literals reproduce the canonical metadata exactly
- **And** image literals remain canonical HTTPS URLs rather than preview fallback data URLs

## Requirement: Safe Read-Only Generated Source Viewer

Generated TypeScript/JSX MUST appear in a syntax-highlighted, read-only viewer with visible sequential line numbers. The source MUST remain selectable and MUST NOT be editable, persisted, or executable. Highlighting MUST render escaped React text and element nodes and MUST NOT use `dangerouslySetInnerHTML`, `innerHTML`, or another raw-HTML injection path.

The viewer MUST preserve one visible line number per source line and MUST preserve the canonical generated source exactly for copying. Source selection MUST NOT require selecting the line-number gutter, and clipboard text MUST NOT include line numbers or presentation tokens. The viewer MUST use a bounded region with local horizontal and vertical overflow so long metadata-bearing source does not create page-level overflow. Copy MUST remain its only source action and MUST provide visible, assistive-technology-readable success or failure feedback without replacing or altering the source.

### Scenario: Highlighted source renders safely

- **Given** source contains TypeScript/JSX, URLs, punctuation, and markup-like text
- **When** the viewer renders it
- **Then** recognizable token categories are visually distinguished
- **And** source content is represented through escaped React nodes
- **And** no raw-HTML injection API is used

### Scenario: Line numbers and copied source are exact

- **Given** generated source contains multiple lines
- **When** it is displayed and copied
- **Then** every line has one sequential visible line number
- **And** the clipboard receives exactly the canonical source
- **And** line numbers and highlighting markup are excluded from clipboard text

### Scenario: Viewer remains read-only and locally contained

- **Given** long generated source is visible at a narrow width
- **When** the developer selects or scrolls it
- **Then** source text is selectable but not editable
- **And** no execute, save, or persistence action is offered
- **And** overflow remains within the bounded viewer without widening the document

## Requirement: Install Tabs and Inline Command Copy

Install guidance MUST provide keyboard-operable npm and pnpm tabs using standard single-select tab semantics. The active command MUST appear in one selectable command field with a right-aligned inline copy button. The npm command MUST be exactly `npm install react-tech-slider`; the pnpm command MUST be exactly `pnpm add react-tech-slider`. No separate standalone install-copy action SHALL appear outside the command field.

The inline button MUST be keyboard reachable, MUST have the accessible name `Copy install command`, and MUST copy exactly the displayed active command. Copy success and failure MUST be visible and announced through an assistive-technology-readable status. If clipboard access is absent, denied, or rejects, no success may be announced; the exact command MUST remain visible and manually selectable, and feedback MUST explain that manual copying remains available.

### Scenario: npm command is copied from its field

- **Given** the npm tab is selected
- **When** the developer activates `Copy install command`
- **Then** the displayed and requested clipboard text are exactly `npm install react-tech-slider`
- **And** perceivable success feedback is provided

### Scenario: pnpm command is copied after tab selection

- **Given** the developer selects the pnpm tab
- **When** they activate the inline copy button
- **Then** the displayed and requested clipboard text are exactly `pnpm add react-tech-slider`
- **And** the button remains inside the active command field

### Scenario: Install tabs use standard keyboard behavior

- **Given** keyboard focus is on the install tab list
- **When** the developer uses Arrow Left, Arrow Right, Home, or End
- **Then** focus and selection follow single-select tab semantics
- **And** the active command panel corresponds to the selected tab

### Scenario: Clipboard failure preserves manual access

- **Given** clipboard writing is unavailable or rejects
- **When** either install or source copy is activated
- **Then** no success is announced
- **And** visible and announced failure feedback identifies manual copying as the fallback
- **And** the exact command or source remains visible and selectable

### Scenario: Inline command field remains usable when narrow

- **Given** the page is viewed at a representative narrow width
- **When** the install command field is displayed
- **Then** command text and button remain contained within the page
- **And** the button does not obscure selection of command text

## Requirement: Responsive Preview Presets and Failure Containment

Desktop, tablet, and mobile presets MUST visibly constrain only the preview canvas. They MUST NOT spoof browser globals, change the page viewport, or appear as package props. Preset selection MUST be conveyed by more than color.

The selected preview region MUST contain package rendering at supported boundaries. In fades, Sport produces 49 images and Food produces 100 images; both MUST remain visually contained without enlarging the document's horizontal scroll area. The showcase makes no general performance guarantee beyond required browser verification at supported limits.

A package render failure MUST be contained within the preview region. The contained state SHALL identify the unavailable live preview and offer retry or reset recovery. It MUST NOT remove controls, generated source, install guidance, links, presets, reset, or the fades disclosure. A repeated failure MUST remain contained.

### Scenario: Presets remain preview-only

- **Given** canonical package settings are unchanged
- **When** desktop, tablet, or mobile is selected
- **Then** only the preview canvas constraint changes
- **And** no viewport or preset property appears in package props or generated source

### Scenario: Large fades datasets remain contained

- **Given** Sport or Food is selected with fades
- **When** the package renders 49 or 100 images at supported gap and speed boundaries
- **Then** animation content remains visually contained by the selected preview preset
- **And** it does not enlarge the document's horizontal scroll area

### Scenario: Package rendering failure remains local

- **Given** the published package throws while rendering
- **When** the preview error boundary handles the failure
- **Then** only the preview region shows a recoverable failure state
- **And** controls, source, install guidance, links, presets, reset, and disclosures remain operable

### Scenario: Developer retries a failed preview

- **Given** the preview shows its contained failure state
- **When** the developer retries current normalized state or resets and retries
- **Then** only the preview boundary is remounted
- **And** a repeated error remains contained rather than blanking the page

## Requirement: Keyboard, Accessibility, and Motion Disclosure

All interactive controls MUST be reachable and operable by keyboard, MUST have programmatically associated labels, and MUST expose applicable role, name, value, state, range, and unit. Native buttons and toggles SHALL retain standard Enter and Space behavior. Focus MUST remain visible and move predictably when variant-specific controls disappear. Selection, validation, copy results, play state, and focus MUST NOT rely on color alone.

Normal text SHALL meet 4.5:1 contrast against its background. Large text and essential graphical or control boundaries SHALL meet 3:1. Primary pointer targets SHOULD be at least 44 by 44 CSS pixels without reducing keyboard usability.

Running MUST expose the package playback control mapped to `isPlay`. The captured reduced-motion preference MAY initialize running playback off and MUST be explained. Fades MUST expose no false pause control and MUST state in assistive-technology-available text that it cannot be paused through the public API. The showcase MUST NOT claim complete reduced-motion support or a package-level reduced-motion guarantee.

### Scenario: Playground is operable by keyboard

- **Given** a developer uses no pointing device
- **When** they select variants and datasets, change controls, choose preview and install tabs, reset, and invoke copy actions
- **Then** every action is reachable in a logical focus order
- **And** focus remains visible
- **And** inactive variant controls are absent from the tab order

### Scenario: Focus remains predictable after variant switch

- **Given** focus is on a variant-specific control
- **When** the other variant is selected and that control disappears
- **Then** focus moves to the selected variant control or another logical persistent control
- **And** focus is not lost to the document body or trapped in hidden content

### Scenario: Fades limitation is disclosed

- **Given** fades is selected
- **When** controls or variant guidance are inspected
- **Then** no nonfunctional pause control is present
- **And** nearby text states that fades cannot be paused through the public API
- **And** no complete reduced-motion guarantee is claimed

## Requirement: Protected Hero and Scope Boundaries

`src/App.tsx` MUST import and reuse `CORE_BRANDS` for the hero, MUST NOT contain a duplicated hero-local brand fixture, and MUST pass `brandsList={CORE_BRANDS}` to the existing hero Slider with `iconWidth={18}`. The extracted `<section className="hero-shell">` MUST remain byte-for-byte unchanged at SHA-256 `aa787e708db68498c3b051446d7416b9933b2455f238bcf49e346bee3b56bdee`. Any further hero change requires a new explicit user decision.

The showcase MUST preserve the single-page information architecture, adoption content, public-package boundary, and preview-only preset semantics. It MUST NOT add package patches, local slider implementations, private package CSS overrides, persistence, routes, accounts, analytics, a backend, uploads, arbitrary dataset editing, an editable or executable code environment, or an unrelated dependency surface. It MUST NOT attribute unsupported props, callbacks, pause behavior, animation semantics, or accessibility guarantees to the package.

### Scenario: Hero reuses canonical Core data

- **Given** the accepted hero state is present
- **When** hero wiring is inspected
- **Then** `CORE_BRANDS` is imported and passed to the existing published Slider
- **And** no duplicated hero-local fixture remains
- **And** the hero Slider uses `iconWidth={18}`

### Scenario: Protected hero remains unchanged

- **Given** the current showcase implementation
- **When** the extracted hero section is compared byte for byte and hashed
- **Then** its SHA-256 is exactly `aa787e708db68498c3b051446d7416b9933b2455f238bcf49e346bee3b56bdee`

### Scenario: Showcase remains within scope

- **Given** implementation, dependencies, routes, storage, network submissions, styles, and editing capabilities are inspected
- **When** scope is evaluated
- **Then** the showcase remains a single-page consumer of the published package
- **And** none of the excluded package, persistence, backend, routing, editor, upload, analytics, or private-style surfaces is present

## Requirement: Verification and Truthful Acceptance Classification

Automated verification MUST cover deterministic externally observable state and static contracts: exact selector options and fixture tables; ten-valid and eleven-invalid validation; per-list ID uniqueness; metadata and canonical URL preservation; generated TypeScript/JSX syntax and published-type assignment; exact variant prop isolation; all five native range domains and immediate event synchronization; alpha picker callbacks, resolver boundaries, and invalid-draft containment; session isolation and reset; safe read-only viewer structure and exact clipboard text; install tab and inline copy behavior; fallback and error containment; package-root integration; forbidden private overrides; and the protected hero hash.

Repository-configured focused tests, the full test suite, production build, and lint MUST pass before deterministic acceptance. Compiler-based generated-source checks MUST report no syntax or published-type errors for representative Core, Sport, and Food output.

Browser verification MUST separately record real pointer and keyboard range behavior; color-picker interaction, focus, and alpha rendering; concrete CSS color resolution; focus order and labeling; source selection, gutter exclusion, line alignment, contrast, and bounded overflow; exact clipboard behavior and denial recovery; responsive layout; all preview presets; remote fallback appearance; real published running and fades behavior; package-owned fades alignment; and 49-image Sport/100-image Food fades containment, responsiveness, network, memory, and performance at supported gap and speed extremes.

Browser-only behavior MUST NOT be classified as passing from jsdom, static inspection, build, lint, type checking, or prior implementation intent. Every browser item MUST be classified individually as passing, blocking, or explicitly waived/unverified. A waiver changes evidence status only; it MUST NOT weaken the required product behavior in this specification.

### Scenario: Deterministic verification proves static contracts

- **Given** implementation is complete
- **When** focused and full tests, production build, lint, compiler checks, static scope checks, and the hero hash check run
- **Then** each required command exits successfully
- **And** automated assertions cover the deterministic contracts named above
- **And** no automated result is presented as browser rendering, pointer, visual, accessibility, network, or performance proof

### Scenario: Generated metadata compiles

- **Given** representative generated Core, Sport, and Food TypeScript/JSX includes applicable optional metadata
- **When** compiler-based verification checks it against the installed package's public declarations
- **Then** no syntax or published-type assignment error is reported
- **And** image literals remain canonical remote HTTPS URLs

### Scenario: Browser acceptance records real evidence

- **Given** deterministic verification passes
- **When** browser acceptance is performed at representative wide and narrow widths
- **Then** every required browser interaction, rendering, accessibility, overflow, alignment, fallback, and performance item is recorded individually
- **And** each item is classified only as passing or blocking from observed evidence

### Scenario: Browser verification is unavailable or waived

- **Given** no browser observation exists for one or more browser-only requirements
- **When** acceptance evidence is reported
- **Then** those items are marked unverified or explicitly waived
- **And** automated evidence is not used to claim the missing browser behavior passed
- **And** the normative browser requirement remains unchanged
