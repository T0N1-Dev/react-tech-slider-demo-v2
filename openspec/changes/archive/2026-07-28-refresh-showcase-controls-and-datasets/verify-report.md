# Formal SDD Verification Report

**Change:** `refresh-showcase-controls-and-datasets`

**Status:** `verified-with-waiver`

No blocker, major, or minor findings were identified. The deterministic implementation conforms to the current specification and automated evidence. Every browser-only item is explicitly **waived/unverified**, never passing, under the user's 2026-07-28 **Waive and finish** decision.

## Findings

| Severity | Finding |
| --- | --- |
| Blocker | None. |
| Major | None. |
| Minor | None. |
| Info | Browser tasks 11.1–11.4 are complete only by explicit waiver; they provide no rendered, interaction, accessibility, alignment, or performance evidence. |
| Info | Automated production-command results are prior command attestations. This formal verification used current read-only integrity checks rather than rerunning tests, build, lint, compiler, or browser commands. |

## Requirement verdicts

| # | Requirement | Verdict | Evidence |
| ---: | --- | --- | --- |
| 1 | Exact showcase dataset selection and integrity | **Conforms.** Selector order is Core, Sport, Food. Sport has exactly 7 ordered records and Food exactly 10. Validation retains `MAX_DATASET_SIZE = 10`; IDs are list-scoped; metadata and canonical URLs are preserved. | `openspec/changes/refresh-showcase-controls-and-datasets/specs/interactive-slider-showcase/spec.md`; `src/showcase/brands.ts`; `src/showcase/brands.test.ts`; `src/showcase/components/Playground.test.tsx`; `src/showcase/useResolvedBrands.test.tsx` |
| 2 | Global icon width | **Conforms deterministically; browser response waived/unverified.** Fixtures do not mask the public `iconWidth` prop. | `src/showcase/brands.ts`; `src/showcase/components/Playground.tsx`; `src/showcase/components/Playground.test.tsx` |
| 3 | Five live native ranges | **Conforms deterministically; native browser interaction waived/unverified.** Domains are Icon width 1–10/0.25, Border width 0–8/1, Duration 5000–120000/1000, Gap 0–180/4, and Speed 0.25–4/0.25. | `src/showcase/components/ControlPanel.tsx`; `src/showcase/model.ts`; `src/showcase/model.test.ts`; `src/showcase/components/Playground.test.tsx` |
| 4 | Alpha-capable color controls | **Conforms deterministically; browser behavior waived/unverified.** Two `HexAlphaColorPicker` controls, eight-digit projection, exact `#00000033`, precise text fallback, and invalid-draft containment are covered. | `src/showcase/color.ts`; `src/showcase/color.test.ts`; `src/showcase/components/ControlPanel.tsx`; `src/showcase/components/Playground.test.tsx` |
| 5 | Safe read-only generated source viewer | **Conforms structurally; visual/selection behavior waived/unverified.** React nodes, sequential line numbers, exact source copy, no editable/raw-HTML path, and bounded local overflow hooks are present. | `src/showcase/sourceHighlight.ts`; `src/showcase/sourceHighlight.test.ts`; `src/showcase/components/GeneratedCode.tsx`; `src/showcase/components/GeneratedCode.test.tsx`; `src/styles.css` |
| 6 | Inline install command copy | **Conforms deterministically; rendered browser behavior waived/unverified.** One inline `Copy install command` action copies the exact active npm/pnpm command and retains manual-copy recovery. | `src/showcase/components/CopyButton.tsx`; `src/showcase/components/CopyButton.test.tsx`; `src/showcase/components/InstallGuide.tsx`; `src/showcase/components/InstallGuide.test.tsx` |
| 7 | Optional Brand metadata and public compilation | **Conforms.** Stable serialization preserves and omits optional fields correctly, escapes values, uses canonical HTTPS URLs, and compiles against the installed public `Brand` declaration. | `src/showcase/codegen.ts`; `src/showcase/codegen.test.ts`; `node_modules/react-tech-slider/dist/types.d.ts` |
| 8 | Published-package integration | **Conforms deterministically; rendered alignment waived/unverified.** Declared `react-tech-slider@^1.10.1` resolves to `1.10.1`; preview and generated source use package-root imports; no private selector or animation workaround was found. | `package.json`; `pnpm-lock.yaml`; `src/showcase/components/Playground.tsx`; `src/showcase/codegen.ts`; `src/styles.css` |
| 9 | Session preservation and reset | **Conforms.** Shared/running/fades state survives round trips; reset restores the specified playground defaults without changing the install tab. | `src/showcase/model.ts`; `src/showcase/model.test.ts`; `src/showcase/components/Playground.test.tsx` |
| 10 | Responsive presets and failure containment | **Conforms deterministically; visual containment waived/unverified.** Presets remain preview-only; fallback, canonical-source isolation, and local error-boundary containment are covered. Sport fades expands 7 brands to 49 images; Food fades expands 10 brands to 100 images. | `src/showcase/components/Playground.tsx`; `src/showcase/components/Playground.test.tsx`; `src/showcase/useResolvedBrands.test.tsx`; `openspec/changes/refresh-showcase-controls-and-datasets/apply-progress.md` |
| 11 | Protected hero and showcase scope | **Conforms.** The accepted `src/App.tsx` diff is limited to importing `CORE_BRANDS`, removing the duplicate local fixture, using `brandsList={CORE_BRANDS}`, and setting `iconWidth={18}`. The protected hero hash is `aa787e708db68498c3b051446d7416b9933b2455f238bcf49e346bee3b56bdee`. | `src/App.tsx`; `openspec/changes/refresh-showcase-controls-and-datasets/specs/interactive-slider-showcase/spec.md`; `.pi-subagents/artifacts/64363ad6_gentle-ai-verify_0_output.md` |
| 12 | Verification and acceptance | **Conforms with waiver.** Deterministic checks pass by prior attestation; all browser-only checks remain individually waived/unverified and are never represented as passing. | `.pi-subagents/artifacts/314085d5_gentle-ai-verify_0_output.md`; `.pi-subagents/artifacts/64363ad6_gentle-ai-verify_0_output.md`; `openspec/changes/refresh-showcase-controls-and-datasets/apply-progress.md` |

## Verification evidence

### Prior production-command attestation

The following commands were executed before this formal report and are attested by `.pi-subagents/artifacts/314085d5_gentle-ai-verify_0_output.md`, as incorporated into `apply-progress.md`. They were **not rerun** during formal verification:

- Focused suites passed: **101 / 61 / 9 / 28 tests**.
- Full suite passed: **12 files / 200 tests**.
- Production build passed: `tsc -b && vite build`, 33 modules transformed.
- Lint passed with no ESLint diagnostics.
- Positive compiler-API checks produced empty diagnostic arrays; negative guard cases continued to require diagnostics.
- Diff check passed; only existing LF-to-CRLF warnings were emitted.

These results prove deterministic test, build, lint, type, and static contracts only. They do not prove browser rendering or interaction.

### Current read-only integrity checks

The formal verifier recorded these current checks in `.pi-subagents/artifacts/64363ad6_gentle-ai-verify_0_output.md` without rerunning production commands:

- Declared dependencies: `react-tech-slider@^1.10.1`, `react-colorful@^5.8.0`.
- Installed dependencies: `react-tech-slider@1.10.1`, `react-colorful@5.8.0`.
- Protected preflight object hashes: `package.json` = `df1ec6f7f619ac8438ebc43414a9f7760473d01b`; `pnpm-lock.yaml` = `81942f4e99340591d1039bd31a7b8ba25ebc97b5`.
- Dependency diff remained limited to the protected preflight `react-colorful` manifest/lock additions.
- `src/App.tsx` matched the accepted four-part hero diff; the protected section hash was exactly `aa787e708db68498c3b051446d7416b9933b2455f238bcf49e346bee3b56bdee`.
- Forbidden private-selector/animation search returned no matches, with expected search exit 1.
- Scope contained 20 modified and 6 untracked entries, all expected implementation/OpenSpec files or protected preflight dependency files; no unrelated file was found.
- The staged set was empty.
- Current diff integrity passed; only existing LF-to-CRLF warnings were observed.

## Browser waiver: every item remains waived/unverified

No browser server, browser session, browser tooling, runtime observation, browser version, or viewport evidence exists. The following are all **waived/unverified**, never passing:

- **Browser matrix:** Chromium, Firefox, and WebKit/Safari.
- **Ranges:** pointer dragging and Arrow/Home/End behavior for Icon width, Border width, Duration, Gap, and Speed; immediate rendered output/preview/source parity; Core, Sport, and Food icon resizing.
- **Colors:** both picker pointer and keyboard behavior; focus order/retention; alpha rendering; production canvas resolution for named, transparent, RGB/HSL, and modern concrete colors; `#00000033`; invalid-draft containment; Enter/blur commits; reset; running/fades round trips.
- **Generated source viewer:** wide and 390px line alignment; source selection; gutter exclusion; long-line scrolling; contrast; focus visibility; exact browser clipboard behavior.
- **Install copy:** exact npm/pnpm browser clipboard behavior; denial recovery and manual selection; visible retained text; 44px target; 390px page-overflow containment.
- **Package rendering:** Sport and Food running/fades at desktop, tablet, and mobile presets; observable 49-image Sport and 100-image Food fades trees; gap 0/180; speed 0.25/4; rapid dataset/control changes; containment; package-owned alignment; animation responsiveness; memory/network behavior; fallback appearance.

The waiver closes tasks 11.1–11.4 administratively but supplies no passing browser evidence.

## Tasks, TDD, and implementation drift

- Every checkbox in `openspec/changes/refresh-showcase-controls-and-datasets/tasks.md` is complete; no unchecked task remains.
- Strict-TDD evidence is credible. Work Units A–H and the Sport amendment record observed RED, GREEN, TRIANGULATE, and REFACTOR stages, including intended and intermediate failures rather than reconstructing lifecycle evidence from a final green run.
- Historical ten-record Sport evidence is retained as true at the time and explicitly superseded by the current seven-record amendment.
- Current fixture truth is **Sport 7 / Food 10**, producing **49 / 100 fades images** respectively.
- No normative implementation drift was found.

## Review workload

Chained delivery was selected. Recorded logical unit sizes are:

| Unit | Changed lines |
| --- | ---: |
| A | 276 |
| B | 166 |
| C | 95 |
| D | 322 |
| E | 395 |
| F | 265 |
| G | 398 |
| H | 309 |

Each unit stayed below the 400-line review boundary, though E and G nearly reached it. The logical units total **2,226 changed lines**. The cumulative working tree remains a substantial review burden: the formal verifier's current tracked diff stat was **20 files, 1,324 insertions and 975 deletions** (**2,299 tracked changed lines**), excluding untracked files. Lifecycle review should preserve the documented A–H boundaries rather than presenting the cumulative tree as one undifferentiated review.

## Residual risks

1. Native range pointer and Arrow/Home/End behavior is unobserved.
2. Production CSS-color canvas conversion and picker pointer/keyboard/focus/alpha rendering are unobserved.
3. Source selection, gutter exclusion, line alignment, contrast, focus visibility, and 390px overflow are unobserved.
4. Clipboard-denial recovery, exact browser clipboard behavior, and the rendered 44px target are unobserved.
5. Package-owned fades alignment and 49/100-image responsiveness, containment, memory, network, performance, and fallback appearance are unobserved.
6. Focused/full tests, build, lint, and compiler results are prior attestations rather than fresh reruns during formal verification.
7. The cumulative uncommitted working tree creates significant human-review load despite compliant per-unit slices.

## Phase result

- **status:** `verified-with-waiver`
- **executive_summary:** Deterministic requirements conform with no blocker, major, or minor findings. All tasks are complete, Strict-TDD evidence is credible, dependency/scope/hero integrity is preserved, and no implementation drift was found. Every browser-only claim remains explicitly waived/unverified, never passing.
- **artifacts:** `openspec/changes/refresh-showcase-controls-and-datasets/verify-report.md`
- **next_recommended:** `sync`, only after explicit user approval. Do not sync, archive, publish, commit, branch, push, open a PR, or release from this phase.
- **risks:** Browser interaction/rendering/accessibility/alignment/performance remain waived and unverified; automated command results are prior attestations; cumulative review burden remains high.
- **skill_resolution:** `paths-injected`
