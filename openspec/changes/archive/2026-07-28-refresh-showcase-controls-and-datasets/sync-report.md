# Sync Report: Refresh Showcase Controls and Datasets

## Outcome

The verified refresh is synchronized into the new canonical specification at `openspec/specs/interactive-slider-showcase/spec.md`. The canonical document now describes the complete current showcase contract rather than change-relative instructions.

No production code, test, dependency, planning, apply, verification, archive, publication, branch, commit, push, or release action was performed by this sync phase.

## Sources

| Source | Role in the merge |
| --- | --- |
| `openspec/changes/build-interactive-slider-showcase/specs/interactive-slider-showcase/spec.md` | Established the single-page evaluation flow, public-package boundary, variant prop mapping, state/reset, source synchronization, install tabs, responsive presets, fallback/error containment, keyboard/accessibility rules, motion disclosure, scope boundaries, and acceptance model. |
| `openspec/changes/refresh-showcase-controls-and-datasets/specs/interactive-slider-showcase/spec.md` | Supplied the verified current dataset, live range, alpha color, source-viewer, inline install-copy, package-version, hero, and verification contracts. |
| `openspec/changes/refresh-showcase-controls-and-datasets/verify-report.md` | Established formal status `verified-with-waiver`, deterministic conformance, the accepted hero hash, and the rule that browser-only evidence remains waived/unverified. |
| `openspec/changes/refresh-showcase-controls-and-datasets/proposal.md` | Clarified product intent, exact fixture outcomes, package boundaries, current fades expansion, and non-goals. |
| `openspec/changes/refresh-showcase-controls-and-datasets/design.md` | Supplied exact Core data, initial state, color-resolver semantics, canonical preview/source ownership, fallback transport rules, and detailed verification boundaries. |
| `src/showcase/brands.ts` and `package.json` | Read-only confirmation of exact current Core/Sport/Food literals, the size cap, and declared package dependencies. |

## Merge decisions

1. The canonical file is a complete current-state specification. Change-relative labels and amendment prose were removed.
2. The established one-page showcase and adoption flow remains normative unless the verified refresh explicitly replaced a rule.
3. Dataset truth is Core with six records, Sport with seven ordered records, and Food with ten ordered records. The maximum valid list size remains ten.
4. The canonical spec contains exact Core, Sport, and Food tables. Sport records all retain transition and invert-filter metadata; Food records retain transition-only metadata.
5. Fixture dimensions that masked global icon sizing are absent, so one shared `iconWidth` governs every curated record without changing package precedence.
6. Canonical HTTPS URLs and optional metadata remain the source of generated usage. Data-URL substitution is preview transport only.
7. Numeric controls use the five verified native range domains and update one canonical invocation continuously.
8. Both running colors use `HexAlphaColorPicker` plus precise text entry. The merged resolver contract preserves concrete canonical CSS input while deriving an eight-digit sRGB picker value and rejecting context-dependent or unresolvable input.
9. Generated source remains one canonical TypeScript/JSX string. Highlighting, line numbers, and presentation never alter exact copy text.
10. Install tabs remain keyboard-operable, while the copy action is now exclusively inline with the active command field.
11. Published `react-tech-slider@1.10.1` remains authoritative. Private package selectors, local patches, and package alignment workarounds remain forbidden.
12. The accepted hero contract is canonical Core reuse, `iconWidth={18}`, and protected SHA-256 `aa787e708db68498c3b051446d7416b9933b2455f238bcf49e346bee3b56bdee`.
13. Deterministic and browser evidence remain separate. A browser waiver affects the evidence classification, not required product behavior.

## Superseded rules

The following historical rules are intentionally not present in the canonical specification:

- the retired alternate dataset and its selector option;
- a larger Sport fixture than the current seven-record table;
- the earlier six-record validation ceiling;
- fixture-level Core dimensions that masked the global icon width;
- blur-committed numeric text controls;
- text-only color controls and non-interactive color swatches;
- a plain generated-source block without highlighting or line numbers;
- a separate standalone install-copy action;
- the earlier package compatibility baseline;
- prior protected-hero baselines and any hero width other than the accepted value;
- acceptance language that could treat jsdom, build, lint, or static inspection as browser proof.

## Canonical coverage

| Current contract | Canonical location |
| --- | --- |
| Published package and private-override prohibition | `Requirement: Published Package Integration` |
| Single-page evaluation/adoption experience | `Requirement: Single-Page Evaluation and Adoption Flow` |
| Exact fixtures, metadata, and size validation | `Requirement: Exact Showcase Datasets and Validation` |
| Canonical URL and fallback separation | `Requirement: Canonical Metadata and Remote Image Fallback` |
| Running/fades prop isolation | `Requirement: Variant Rendering and Exact Prop Mapping` |
| Shared icon sizing | `Requirement: Global Icon Width Applies to Every Fixture` |
| Five live ranges | `Requirement: Five Live Native Range Controls` |
| Alpha picker, text fallback, and resolver | `Requirement: Alpha-Capable Color Controls and Resolver` |
| Session state and reset | `Requirement: Session State Preservation and Reset` |
| One invocation and metadata-aware source | `Requirement: Canonical Preview and Generated TypeScript/JSX` |
| Highlighted read-only viewer and exact copy | `Requirement: Safe Read-Only Generated Source Viewer` |
| Tabs and inline install copy | `Requirement: Install Tabs and Inline Command Copy` |
| Presets, 49/100 fades expansion, and failure containment | `Requirement: Responsive Preview Presets and Failure Containment` |
| Keyboard, accessibility, and motion disclosure | `Requirement: Keyboard, Accessibility, and Motion Disclosure` |
| Accepted hero and scope boundaries | `Requirement: Protected Hero and Scope Boundaries` |
| Deterministic verification and browser classification | `Requirement: Verification and Truthful Acceptance Classification` |

## Verification status and waiver

The source change's formal status is `verified-with-waiver`.

- No blocker, major, or minor finding was reported for deterministic implementation conformance.
- Focused tests, the full test suite, production build, lint, compiler checks, diff integrity, dependency integrity, and the hero hash are supported by prior attestations recorded in `verify-report.md`; this sync did not rerun production commands.
- Browser tasks remain explicitly waived/unverified. There is no rendered browser, pointer, keyboard, focus, visual overflow, clipboard-permission, alignment, remote-network, memory, or performance evidence.
- The canonical specification deliberately retains normative browser MUST/SHALL behavior. Nothing in the waiver converts an unobserved browser requirement into a pass or removes it from current product truth.

## Sync-phase review findings

- **Blocker:** None in the synchronized specification.
- **Major:** None.
- **Minor:** None.
- **Info:** Browser-only acceptance remains waived/unverified even though deterministic implementation is formally verified.
- **Info:** Automated production-command evidence is prior attestation, not a fresh sync-phase rerun.

## Residual risks

1. Native range pointer and Arrow/Home/End behavior remains unobserved in a real browser.
2. Color-picker pointer/keyboard/focus behavior and production browser color resolution remain unobserved.
3. Source selection, gutter exclusion, line alignment, contrast, focus visibility, and narrow-width overflow remain unobserved.
4. Exact browser clipboard behavior, denial recovery, and rendered target sizing remain unobserved.
5. Package-owned fades alignment and 49/100-image containment, responsiveness, network, memory, and performance remain unobserved.
6. The cumulative uncommitted implementation still represents substantial human-review load.

## Phase result

- **status:** `complete`
- **executive_summary:** The original showcase baseline and verified refresh are merged into one complete current-state canonical specification. Superseded datasets, controls, hero expectations, and evidence language were removed; current normative browser behavior remains intact despite waived evidence.
- **artifacts:** `openspec/specs/interactive-slider-showcase/spec.md`, `openspec/changes/refresh-showcase-controls-and-datasets/sync-report.md`
- **next_recommended:** Archive `refresh-showcase-controls-and-datasets` only after explicit user approval. Do not archive, publish, commit, branch, push, open a pull request, or release from this sync phase.
- **risks:** Browser-only behavior remains waived/unverified; automated command evidence is prior attestation; cumulative review burden remains high.
- **skill_resolution:** `paths-injected`
