# Interactive Slider Showcase Delta Specification

## ADDED Requirements

### Requirement: Published Package Integration

The showcase MUST consume a published `react-tech-slider` release compatible with version 1.9.3 as an application dependency. It MUST render both slider variants by using the package's exported `Slider` component and MUST NOT copy, reimplement, patch, or link to local package source. Application examples and generated code SHALL import values and optional public types only from the `react-tech-slider` package root. They MUST NOT instruct consumers to import a CSS subpath because no CSS subpath is part of the public integration contract.

#### Scenario: Published running variant renders

- **Given** the showcase is installed from its declared dependencies
- **When** a developer opens the playground with running selected
- **Then** the preview renders the running behavior supplied by a published `react-tech-slider` 1.9.3-compatible release
- **And** no local package source or showcase-authored animation substitutes for the package

#### Scenario: Published fades variant renders

- **Given** the same published dependency is installed
- **When** the developer selects fades
- **Then** the preview renders the package's fades behavior through `variant="fades"`
- **And** it does not use a separately implemented fade animation

#### Scenario: Consumer import guidance uses the public root

- **Given** a developer views or copies generated usage guidance
- **When** imports are shown
- **Then** `Slider` and any public types are imported from `react-tech-slider`
- **And** no internal module path or CSS subpath import is shown

### Requirement: Single-Page Evaluation and Adoption Flow

The showcase SHALL be one responsive page with a dark editorial presentation, restrained gradients, and a high-contrast preview. In a continuous page flow it MUST provide a package hero, a primary path to the playground, the live playground, variant-aware controls, preview viewport presets, install guidance, generated usage code, concise variant/feature/public-API guidance, and links to the published package and its repository. The playground SHALL remain the primary task surface and the preview SHALL be visually prominent on wide screens.

#### Scenario: Developer moves from evaluation to adoption

- **Given** a developer lands at the top of the page
- **When** they follow the primary hero action
- **Then** focus or navigation reaches the playground on the same page
- **And** they can choose a variant, configure it, select an install command, and obtain matching usage code without consulting package internals

#### Scenario: Package resources are identifiable

- **Given** the developer is reviewing adoption guidance
- **When** they inspect the resource links
- **Then** distinct links identify the published `react-tech-slider` package and its repository
- **And** package naming is consistent across the page

### Requirement: Variant Rendering and Control Availability

The playground MUST offer running and fades as distinct selectable variants. Running SHALL be selected by the package default behavior, so generated running usage MAY omit `variant="running"`. Fades MUST be selected with `variant="fades"`. Only controls supported by the active variant SHALL be operable or presented as package controls; inactive variant controls MUST be absent or unavailable to both keyboard and pointer interaction.

#### Scenario: Running controls are shown

- **Given** running is selected
- **When** the developer inspects the package controls
- **Then** shared brand data and icon width controls are available
- **And** border width, border color, background color, playback, pause on hover, and duration controls are available
- **And** fades gap and speed controls are not operable

#### Scenario: Fades controls are shown

- **Given** fades is selected
- **When** the developer inspects the package controls
- **Then** shared brand data and icon width controls are available
- **And** gap and speed controls are available
- **And** running border, background, playback, hover-pause, and duration controls are not operable

#### Scenario: Variant selection changes package rendering

- **Given** one variant is rendering successfully
- **When** the developer selects the other variant
- **Then** the preview uses the corresponding package variant
- **And** the available controls, API guidance, and generated usage update to that variant

### Requirement: Exact Prop Mapping and Safe Control Domains

Every package control MUST map to exactly one supported public prop for the active variant. Before rendering or generating code, numeric values MUST be finite and normalized to the following inclusive showcase domains. Units MUST appear in the control label or adjacent value output.

| Applies to | Control | Public prop | Showcase domain | Unit |
| --- | --- | --- | --- | --- |
| Both variants | Demonstration dataset | `brandsList` | one curated, validated `Brand[]` selection | list |
| Both variants | Icon width | `iconWidth` | 1 to 10, step 0.25 | rem |
| Running | Border width | `borderWidth` | 0 to 8, step 1 | px |
| Running | Border color | `borderColor` | valid CSS color | color value |
| Running | Background color | `backgroundColor` | valid CSS color | color value |
| Running | Playback | `isPlay` | boolean | on/off |
| Running | Pause on hover | `pauseOnHoverActive` | boolean | on/off |
| Running | Duration | `durationMs` | 5,000 to 120,000, step 1,000 | ms |
| Fades | Gap | `gap` | 0 to 180, step 4 | px |
| Fades | Speed | `speed` | 0.25 to 4, step 0.25 | multiplier (`×`) |

The running preview MUST pass only `brandsList`, `iconWidth`, `borderWidth`, `borderColor`, `backgroundColor`, `isPlay`, `pauseOnHoverActive`, and `durationMs` as applicable. The fades preview MUST pass only `variant="fades"`, `brandsList`, `iconWidth`, `gap`, and `speed`. Preview-only state MUST NOT be passed as package props. The showcase MUST NOT use the obsolete names `autoPlay` or `pauseOnHover`, and it MUST NOT map a running control to `speed`.

#### Scenario: Boundary values are accepted

- **Given** a numeric control is at either inclusive boundary documented in the table
- **When** the preview and generated code update
- **Then** the exact finite boundary value is represented using the documented unit
- **And** the value is passed only to its mapped public prop

#### Scenario: Out-of-range or non-numeric input is attempted

- **Given** a developer enters a value below the minimum, above the maximum, empty, infinite, or not a number
- **When** the value is committed
- **Then** the showcase prevents or normalizes it to a finite value within the documented domain
- **And** nearby validation communicates the allowed range and unit
- **And** the unsafe value is never passed to `Slider` or emitted in generated code

#### Scenario: Fades speed is explained correctly

- **Given** the fades speed control is visible
- **When** the developer reads or changes it
- **Then** its value is identified as a multiplier using `×`
- **And** it is never described or generated as milliseconds

#### Scenario: Invalid color input is attempted

- **Given** a developer can enter a textual color value
- **When** the entered value is not a valid CSS color
- **Then** the prior valid value remains effective or a documented valid value is restored
- **And** the invalid value is not passed to the package
- **And** nearby validation identifies the problem

### Requirement: Session State Preservation and Reset

The showcase MUST keep shared package settings plus separate running-specific and fades-specific setting state for the current page session. Switching variants MUST preserve the shared settings and each variant's specific edits, and MUST restore the selected variant's prior specific values when revisited. Persistence across reloads or sessions is not required. A clearly labeled reset action MUST restore the shared settings, both variant-specific state stores, the demonstration dataset, selected variant, and preview viewport preset to the page's documented initial values. Reset MUST NOT alter the selected install tab or navigate away from the playground.

#### Scenario: Variant edits survive round-trip switching

- **Given** the developer edits running settings and then edits fades settings
- **When** they switch from fades to running and back to fades
- **Then** each variant restores its last edited variant-specific values
- **And** shared settings retain their last edited values across both variants
- **And** the preview and generated code match the restored values at each step

#### Scenario: Playground state is reset

- **Given** either or both variants and the preview preset differ from their initial values
- **When** the developer activates reset
- **Then** the selected variant, both variant state stores, dataset, and preview preset return to the visibly documented initial state
- **And** generated code and preview update to that same state
- **And** the install tab selection is unchanged

#### Scenario: Reload starts a new session

- **Given** a developer has edited playground state
- **When** they reload the page
- **Then** the showcase MAY return to its initial state
- **And** it does not claim that settings are persisted

### Requirement: Synchronized Minimal TypeScript/JSX

The showcase MUST generate syntactically valid, copy-ready TypeScript/JSX from the same normalized state used to derive preview props. The snippet SHALL include a minimal valid `Brand[]` dataset, a package-root import for `Slider` and any used public type, and a rendered `Slider` expression. It MUST include every non-default current setting required to reproduce the visible package result and MUST omit irrelevant or default-equivalent props where omission preserves that result. Numeric props MUST be JSX numbers rather than quoted strings.

Running code MUST use only running-supported props and MAY omit the running variant discriminator. Fades code MUST emit `variant="fades"` and only fades-supported props. Generated code MUST exclude preview presets, reset state, copy state, install-tab state, fallback bookkeeping, obsolete API names, and any unsupported callbacks.

#### Scenario: Running code follows current preview state

- **Given** running is selected with normalized current settings
- **When** generated code is displayed
- **Then** it imports from `react-tech-slider`
- **And** its `Slider` uses `brandsList` plus only applicable running and shared props needed to reproduce the preview
- **And** it contains none of `autoPlay`, `pauseOnHover`, or a running `speed` prop

#### Scenario: Fades code follows current preview state

- **Given** fades is selected with normalized current settings
- **When** generated code is displayed
- **Then** its `Slider` includes `variant="fades"`
- **And** it uses only `brandsList`, `iconWidth`, `gap`, and `speed` as applicable
- **And** numeric values are unquoted finite numbers

#### Scenario: A package control changes

- **Given** generated code and preview are synchronized
- **When** the developer changes an applicable package control
- **Then** both update from the same normalized value
- **And** copying immediately afterward yields the updated snippet

#### Scenario: A preview-only control changes

- **Given** generated code reflects the current package settings
- **When** the developer changes the viewport preset or invokes reset
- **Then** viewport metadata is not added to the package usage
- **And** reset affects generated code only through the package settings it resets

### Requirement: Install Guidance and Clipboard Feedback

The install guidance MUST provide keyboard-operable npm and pnpm tabs. The npm tab SHALL show exactly `npm install react-tech-slider`, and the pnpm tab SHALL show exactly `pnpm add react-tech-slider`. The displayed command and the command copied MUST always correspond to the selected tab. Install-command and generated-code copy actions MUST provide perceivable, assistive-technology-readable success or failure feedback without replacing or hiding the source.

#### Scenario: npm install command is selected and copied

- **Given** the npm tab is selected
- **When** the developer activates its copy action
- **Then** the requested clipboard text is exactly `npm install react-tech-slider`
- **And** success feedback identifies that the command was copied

#### Scenario: pnpm install command is selected and copied

- **Given** the pnpm tab is selected
- **When** the developer activates its copy action
- **Then** the requested clipboard text is exactly `pnpm add react-tech-slider`
- **And** success feedback is exposed visually and through an announcement region

#### Scenario: Clipboard access fails

- **Given** clipboard access is denied, unavailable, or rejects the write
- **When** the developer activates any copy action
- **Then** the original command or code remains visible and selectable
- **And** a visible and assistive-technology-readable failure message explains that manual copying remains available
- **And** no success state is announced

#### Scenario: Install tabs are used from a keyboard

- **Given** keyboard focus is on the install tab list
- **When** the developer uses Arrow Left or Arrow Right, Home, or End
- **Then** focus and selection follow standard single-select tab semantics
- **And** the associated command panel is exposed as the active tab panel

### Requirement: Responsive Preview Presets and Overflow Containment

The playground MUST provide desktop, tablet, and mobile preview presets as preview-only controls. Each preset SHALL visibly constrain the preview canvas itself and MUST NOT spoof browser globals, change the page viewport, or be represented as a package prop. The selected preset MUST be conveyed by more than color. At representative wide and narrow page widths, navigation, controls, install guidance, copy actions, and code SHALL remain reachable without horizontal page overflow. Content that is intrinsically wide, including generated code, MAY scroll only inside a bounded region.

#### Scenario: Preview preset changes

- **Given** the page viewport remains unchanged
- **When** the developer selects desktop, tablet, or mobile
- **Then** only the preview canvas changes to the corresponding visibly distinct width constraint
- **And** the package preview rerenders within that canvas
- **And** generated package code remains free of viewport props

#### Scenario: Page is narrow

- **Given** the showcase is viewed at a representative mobile page width
- **When** all sections and a long generated line are present
- **Then** the document has no horizontal page overflow
- **And** the preview remains observable while controls and adoption guidance remain reachable
- **And** long code scrolls within its own bounded region if needed

#### Scenario: Fades content exceeds the preset canvas

- **Given** fades content is wider than the selected preview canvas
- **When** it renders or animates
- **Then** it is visually contained by the preview region
- **And** it does not enlarge the document's horizontal scroll area

### Requirement: Brand Data Integrity and Remote Image Failure Handling

The normal demonstration dataset MUST contain a modest set of recognizable remote technology logos. Every brand MUST have a non-empty meaningful name and an ID unique within the rendered list. Remote image success or failure MUST NOT determine whether controls, code, install guidance, or navigation remain usable. A failed logo MUST be replaced by a stable readable fallback that communicates its brand name, preserves the logo slot and slider layout, avoids broken-image chrome, and does not repeatedly retry the failed resource.

#### Scenario: Remote logos load successfully

- **Given** the remote resources are available
- **When** the demonstration list renders
- **Then** recognizable technology logos appear with meaningful brand names available to assistive technology
- **And** all IDs in the list are unique

#### Scenario: One logo fails

- **Given** one remote logo cannot load
- **When** that failure is detected
- **Then** only that logo is replaced by its readable brand fallback
- **And** the remaining logos continue to render
- **And** slider layout and controls remain stable
- **And** the failed resource is not retried in a loop

#### Scenario: Many or all logos fail

- **Given** a host outage, policy restriction, or broad network failure affects multiple images
- **When** the failures occur
- **Then** each affected logo is represented by its brand fallback without broken-image chrome
- **And** preview framing, controls, generated code, install guidance, and API guidance remain usable

#### Scenario: Duplicate or missing fixture identity is detected

- **Given** demonstration data contains a duplicate ID or an empty brand name
- **When** the data is prepared for the preview
- **Then** the invalid dataset is not passed to the package as if valid
- **And** the preview shows a contained data-error state that identifies the requirement for unique IDs and meaningful names

#### Scenario: Brand data is empty

- **Given** the current `brandsList` is empty
- **When** the preview renders
- **Then** the page shows a deliberate empty-preview message or safe empty track without crashing
- **And** the rest of the page remains usable
- **And** generated guidance makes clear that `brandsList` is a required input

### Requirement: Keyboard and Accessible Interaction

All interactive controls MUST be reachable and operable by keyboard, MUST have programmatically associated labels, and MUST expose role, name, value, state, range, and unit where applicable. Native buttons and toggles SHALL operate with their standard Enter and Space semantics; range and numeric inputs SHALL support their standard keyboard adjustment semantics. Focus MUST remain visible and MUST move predictably when variant-specific controls disappear. Selection, validation, success, failure, play state, and focus MUST NOT be communicated by color alone.

Normal text SHALL meet a contrast ratio of at least 4.5:1 against its background; large text and essential graphical/control boundaries SHALL meet at least 3:1. Primary pointer targets SHOULD be at least 44 by 44 CSS pixels without reducing keyboard usability.

#### Scenario: Playground is completed with a keyboard

- **Given** a developer uses no pointing device
- **When** they enter the playground, select each variant, change its controls, select viewport and install tabs, reset state, and invoke copy actions
- **Then** every action is reachable and operable in a logical focus order
- **And** focus is visibly indicated throughout
- **And** hidden variant controls are not in the tab order

#### Scenario: Focused control is removed by a variant switch

- **Given** focus is on a variant-specific control
- **When** the developer selects the other variant
- **Then** focus moves to the selected variant control or another logical persistent control
- **And** it is not lost to the document body or trapped in hidden content

#### Scenario: State is perceived without color

- **Given** a developer cannot distinguish the interface's colors
- **When** a tab, variant, viewport preset, toggle, validation state, or copy result changes
- **Then** text, iconography, shape, position, or programmatic state also conveys the change

### Requirement: Animation Accessibility Disclosure

When running is selected, the showcase MUST expose the package's supported play/pause control and MUST accurately map it to `isPlay`. When fades is selected, it MUST not show or imply a pause control because the public API has none. The fades playground and variant/API guidance MUST explicitly disclose, in text available to assistive technology, that fades cannot be paused through the public API. The showcase MUST NOT claim full reduced-motion support or a package-level reduced-motion guarantee.

#### Scenario: Running animation is paused

- **Given** running is selected and playing
- **When** the developer turns playback off
- **Then** the preview receives `isPlay={false}`
- **And** the control exposes its paused state without relying on color alone

#### Scenario: Fades limitation is disclosed

- **Given** fades is selected
- **When** the developer inspects the controls or variant guidance
- **Then** no nonfunctional pause control is present
- **And** nearby text states that fades cannot be paused through the public API
- **And** no text claims complete reduced-motion accommodation

### Requirement: Preview Failure Containment

A package render or preview failure MUST be contained within the preview region. The contained state SHALL explain that the live preview is unavailable and offer a recoverable action such as retry or reset. A preview failure MUST NOT blank the page, remove the controls and adoption guidance, or prevent access to install commands, generated source, API guidance, package links, or the fades accessibility disclosure.

#### Scenario: Package preview throws during rendering

- **Given** the package preview encounters a rendering failure
- **When** the failure occurs
- **Then** only the preview region is replaced by an understandable failure state
- **And** the page shell, controls, generated source, install guidance, resource links, and disclosures remain reachable

#### Scenario: Developer recovers from preview failure

- **Given** the preview is showing its contained failure state
- **When** the developer invokes its offered recovery action
- **Then** the showcase retries with normalized current state or documented initial state
- **And** a repeated failure remains contained in the preview

### Requirement: Scope Boundaries

The first slice MUST remain a single-page showcase on the existing Vite, React, and TypeScript foundation. It MUST NOT add or imply package props, callbacks, pause behavior, animation semantics, or a package-level accessibility guarantee that the public API does not provide. It MUST NOT become a package rebuild, package patch, multi-page documentation site, routed marketing site, account system, persistence layer, analytics product, backend, arbitrary user-data editor, asset uploader, or general-purpose code sandbox. It MUST NOT recreate the prior demo's framework, UI-kit, CSS-framework, or carousel dependency surface, and MUST NOT present preview presets as package capabilities.

#### Scenario: Product guidance describes supported capabilities

- **Given** a developer reads the page's feature and API guidance
- **When** a capability is attributed to `react-tech-slider`
- **Then** that capability exists in the 1.9.3-compatible public API
- **And** preview-only showcase behavior is visibly distinguished from package behavior

#### Scenario: First-slice boundaries are reviewed

- **Given** the completed showcase is reviewed against its approved scope
- **When** routes, storage, network submissions, editing capabilities, and dependencies are inspected
- **Then** no account, persistence, analytics, backend, multi-page routing, arbitrary dataset input, asset upload, general sandbox, unrelated carousel, or package-source modification has been introduced

### Requirement: Verification and Acceptance

The implementation MUST pass the repository-configured production build and lint commands: `pnpm build` and `pnpm lint`. Because no dedicated automated test script is currently configured, acceptance MUST also include a documented manual pass at representative wide, tablet, and mobile page widths. The manual pass SHALL cover both variants, every visible control and boundary, variant state preservation and reset, install switching, generated-code synchronization and copying, keyboard operation, focus behavior, responsive presets, page overflow, successful logos, individual and broad remote-image failure, unique and invalid IDs, empty data, clipboard denial, contained preview failure, contrast and non-color indicators, and the fades animation disclosure.

#### Scenario: Static verification passes

- **Given** the showcase implementation is complete
- **When** `pnpm build` and `pnpm lint` are run from the repository root
- **Then** both commands exit successfully
- **And** generated usage examples contain no TypeScript/JSX syntax or public-prop mismatch identified by the acceptance review

#### Scenario: Manual acceptance covers the interaction matrix

- **Given** build and lint pass
- **When** the documented manual acceptance pass is performed
- **Then** running and fades behavior, all mapped control boundaries, state round trips, reset, install tabs, both copy outcomes, keyboard semantics, focus, responsive presets, overflow containment, image success/failures, ID validation, empty data, preview containment, contrast, non-color indicators, and accessibility disclosure are each recorded as passing or as an explicit blocker

#### Scenario: Acceptance finds a control mismatch

- **Given** manual or static verification finds a visible control that maps to an unsupported prop, unsafe value, wrong unit, or stale generated value
- **When** acceptance is evaluated
- **Then** the showcase is not accepted until the mismatch is corrected and the affected scenarios are repeated
