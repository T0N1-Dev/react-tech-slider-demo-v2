# Apply Progress: Refresh Showcase Controls and Datasets

## Delivery decision

- **Date:** 2026-07-27
- **Approver:** User
- **Selected strategy:** Chained delivery using Work Units A through H in dependency order
- **Review boundary:** Each work unit must remain independently green and below the 400-changed-line review budget; if a unit reaches 400 lines, stop and split it before lifecycle actions.
- **Writer constraint:** One writer owns all production and test edits. Writes are not parallelized.
- **Publication constraint:** Chained delivery describes implementation/review boundaries only. No commit, branch, push, or PR is authorized by this decision.
- **Pre-implementation statement:** No production implementation task for this change started before this decision. Only OpenSpec exploration, proposal, specification, design, tasks, and this decision record were created.

### Decision-time repository state

```text
 M package.json
 M pnpm-lock.yaml
?? openspec/changes/refresh-showcase-controls-and-datasets/
```

`package.json` and `pnpm-lock.yaml` were modified by the user before apply to install the approved `react-tech-slider@1.10.1` and `react-colorful` dependencies. Their exact preflight hashes and diffs remain to be recorded in task 0.2 before production edits.

## Apply preflight — task 0.2

- **Recorded:** 2026-07-27
- **Git state:** `package.json` and `pnpm-lock.yaml` are modified; this active change directory is untracked. No files are staged.
- **Protected user changes:** `package.json` and `pnpm-lock.yaml` were modified before apply and will not be edited, regenerated, or reformatted by this change. Their existing diff adds only declared/locked `react-colorful@5.8.0` entries; Git also reports the existing LF-to-CRLF working-copy warning for both files.
- **Baseline object hashes:** `package.json` = `df1ec6f7f619ac8438ebc43414a9f7760473d01b`; `pnpm-lock.yaml` = `81942f4e99340591d1039bd31a7b8ba25ebc97b5`.
- **Dependencies:** declared ranges are `react-tech-slider@^1.10.1` and `react-colorful@^5.8.0`; `pnpm list react-tech-slider react-colorful --depth 0` resolves exactly `react-tech-slider@1.10.1` and `react-colorful@5.8.0`.
- **Protected hero:** the approved extraction/hash command returned `2b40e750e89c920657832665f59749b0d97cf7a0069b884b938d99fc71d46346`.
- **Baseline tests:** `pnpm test` exited 1 with 4 failed files / 9 failed tests and 5 passed files / 129 passed tests. The pre-existing failures are six stale `src/App.test.tsx` expectations, one stale Core fixture expectation in `src/showcase/brands.test.ts`, one install-tab cue expectation, and one preview-frame expectation. These failures predate Unit A; they are recorded rather than repaired outside Unit A. Escalation through the supervisor/intercom channel was attempted but the local broker timed out twice.

### Task 0.2 commands

```text
git status --short -> package.json and pnpm-lock.yaml modified; active change directory untracked
git diff -- package.json pnpm-lock.yaml -> only the acknowledged react-colorful manifest/lock additions; existing line-ending warnings
git hash-object package.json pnpm-lock.yaml -> df1ec6f7f619ac8438ebc43414a9f7760473d01b / 81942f4e99340591d1039bd31a7b8ba25ebc97b5
node -e "const p=require('./package.json'); console.log(p.dependencies['react-tech-slider'], p.dependencies['react-colorful'])" -> ^1.10.1 ^5.8.0
pnpm list react-tech-slider react-colorful --depth 0 -> react-tech-slider@1.10.1 / react-colorful@5.8.0
pnpm test -> failed: 4 files, 9 tests; passed: 5 files, 129 tests (pre-existing baseline recorded above)
protected-hero hash command -> 2b40e750e89c920657832665f59749b0d97cf7a0069b884b938d99fc71d46346
```

## Scope freeze — task 0.3

- **Active boundary:** This apply run is limited to Work Unit A and its evidence: `src/showcase/brands.ts`, `src/showcase/brands.test.ts`, `tasks.md`, and `apply-progress.md`. Work Unit B must not start.
- **Read-only/out of scope:** `src/App.tsx`; `package.json`; `pnpm-lock.yaml`; package source; sibling packages; prior/completed changes; approved explore/proposal/spec/design artifacts; and every Work Unit B–H implementation path.
- **Observed pre-RED scope:** `git diff --name-only` listed only `package.json` and `pnpm-lock.yaml`. `git status --short src/App.tsx package.json pnpm-lock.yaml` listed only the two acknowledged dependency files; `src/App.tsx` had no diff. `git diff --cached --name-only` was empty.
- **Stop conditions:** Stop immediately and request parent/user direction for (a) any `src/App.tsx` diff or protected-hero mismatch, (b) any proposed package patch, wrapper, private selector, or animation workaround, (c) dependency range/resolution or manifest/lock drift, (d) generated-code syntax or public `Brand` diagnostics, or (e) a browser blocker affecting required interaction, containment, alignment, or ten-item fades performance. No stop condition may be patched around silently.
- **Review-size condition:** Stop Unit A at or above 400 changed lines and record the required coherent split; do not begin Work Unit B.

### Task 0.3 commands

```text
git diff --name-only -> package.json; pnpm-lock.yaml
git status --short src/App.tsx package.json pnpm-lock.yaml -> package.json and pnpm-lock.yaml modified; no App.tsx entry
git diff --cached --name-only -> empty
```

## Work Unit A — exact fixtures and max-ten validation

- **Dependency:** Gate 0 (tasks 0.1–0.3) complete.
- **Forecast:** 290–360 changed lines; hard stop at 400.
- **Files:** `src/showcase/brands.ts`, `src/showcase/brands.test.ts`, and this unit's task/progress evidence only.

### A.RED — completed

`pnpm exec vitest run src/showcase/brands.test.ts` exited 1 with 12 intended failures and 9 passes. Failures were limited to the specified contract: Core still had fixture dimensions; Sport/Food exports were absent; ten records hit the old six-item cap; and invalid optional dimensions, class name, and style metadata were accepted. The focused runner reported 1 failed test file, 12 failed tests, and 9 passed tests. This RED is distinct from the documented full-suite baseline failures.

### A.GREEN — completed

Added the exact approved Core/Sport/Food fixtures, removed only Core fixture-level dimensions, retained the temporary legacy Frontend export for the independently green pre-Unit-B boundary, named `MAX_DATASET_SIZE = 10`, and added non-normalizing optional metadata guards. `pnpm exec vitest run src/showcase/brands.test.ts` exited 0 with 1 passed file and 21 passed tests.

### A.TRIANGULATE — completed

The focused matrix covers empty/one/ten/eleven lengths; duplicates within one list versus repeated IDs across independently validated Sport/Food lists; absent and empty style; string (`width`) and numeric (`zIndex`) style values; invalid null/array/object/non-finite style values; NaN width; infinite height; exact class-name case; valid list and record reference preservation; fallback replacement of only `img`; and unchanged canonical HTTPS URLs. `pnpm exec vitest run src/showcase/brands.test.ts` exited 0 with 1 passed file and 21 passed tests.

### A.REFACTOR — completed

The implementation retains one non-normalizing validator, one named maximum, and the existing single fallback replacement rule; no additional behavior path was introduced. The closing `pnpm exec vitest run src/showcase/brands.test.ts` exited 0 with 1 passed file and 21 passed tests. `git diff --check` exited 0 (with only the pre-existing Git line-ending warnings). Unit A source/test numstat is 80 additions + 92 deletions in `brands.test.ts` and 62 additions + 42 deletions in `brands.ts`, for **276 actual changed lines**, below the 400-line hard stop. The protected hero hash remains `2b40e750e89c920657832665f59749b0d97cf7a0069b884b938d99fc71d46346`.

### Unit A command evidence

```text
pnpm exec vitest run src/showcase/brands.test.ts [RED] -> failed as intended: 1 file, 12 failed / 9 passed tests
pnpm exec vitest run src/showcase/brands.test.ts [GREEN] -> passed: 1 file, 21 tests
pnpm exec vitest run src/showcase/brands.test.ts [TRIANGULATE] -> passed: 1 file, 21 tests
pnpm exec vitest run src/showcase/brands.test.ts [REFACTOR] -> passed: 1 file, 21 tests
git diff --check -> passed; existing line-ending warnings only
git diff --numstat -- src/showcase/brands.ts src/showcase/brands.test.ts -> 142 additions / 134 deletions = 276 changed lines
protected-hero hash command -> 2b40e750e89c920657832665f59749b0d97cf7a0069b884b938d99fc71d46346
pnpm test [post-A boundary] -> failed only on the recorded out-of-scope baseline areas: 3 files, 8 failed / 135 passed tests; Unit A brands tests passed
final git status/staged check -> only acknowledged package/lock changes, Unit A source/tests, and the active untracked change directory; staged set empty
final package/lock hashes -> unchanged at df1ec6f7f619ac8438ebc43414a9f7760473d01b / 81942f4e99340591d1039bd31a7b8ba25ebc97b5
```

The post-A full run removed the stale preflight `brands.test.ts` failure and introduced no new failing file; the remaining eight failures are the previously recorded six `App.test.tsx`, one `InstallGuide.test.tsx`, and one `Playground.test.tsx` failures. They remain outside this unit.

## Work Unit B — exact dataset wiring and canonical selection

- **Dependency:** Work Unit A is independently green.
- **Forecast:** 130–180 changed lines; hard stop at 400.
- **Files:** `src/showcase/model.ts`, `src/showcase/model.test.ts`, `src/showcase/components/Playground.tsx`, `src/showcase/components/Playground.test.tsx`, `src/showcase/components/ControlPanel.tsx`, `src/showcase/brands.ts`, and this unit's task/progress evidence only.

### B.RED — completed

`pnpm exec vitest run src/showcase/model.test.ts src/showcase/components/Playground.test.tsx` exited 1 with 3 failures and 70 passes across 2 files. Two intended failures proved the old dataset wiring: options were still `Technologies`/`Frontend frameworks` instead of exact Core/Sport/Food, and selecting `sport` failed because no such option existed. The third failure was the already documented pre-existing `preview-slider-frame` expectation; the authoritative design explicitly preserves direct package rendering with no such demo wrapper. `model.test.ts` otherwise passed after defining the new contract, confirming the failure surface was UI/default-map wiring rather than reducer/invocation drift.

### B.GREEN — completed

Updated `DatasetId` and the exhaustive default map to exact `core | sport | food`, changed selector labels/options to Core/Sport/Food in order, removed the temporary Frontend fixture/export and directly dependent Unit A test residue, and retained the existing `Playground -> selectDataset -> validateBrandDataset -> projectSlider -> SliderInvocation -> preview/source` pipeline. The stale `preview-slider-frame` assertion was normalized to assert its approved absence; no production wrapper, alignment selector, or package workaround was added. `pnpm exec vitest run src/showcase/brands.test.ts src/showcase/model.test.ts src/showcase/components/Playground.test.tsx` exited 0 with 3 passed files and 94 passed tests.

### B.TRIANGULATE — completed

The focused matrix proves all three exact selections, Sport/Food repeated IDs accepted independently, ten canonical records reaching preview in order, generated source switching to the same selected canonical names/URLs, reset returning to Core, injected empty/duplicate lists remaining contained, running/fades prop isolation, preview preset exclusion from source, and all Core/Sport/Food records omitting `width`, `height`, and `style.width` while the global preview `iconWidth` remains authoritative. Sport transition/class metadata and Food class-name omission remain preserved in preview records. `pnpm exec vitest run src/showcase/brands.test.ts src/showcase/model.test.ts src/showcase/components/Playground.test.tsx` exited 0 with 3 passed files and 94 passed tests.

### B.REFACTOR — completed

The exact Frontend-residue search returned no matches. The default dataset map is exhaustive through `satisfies Readonly<Record<DatasetId, readonly Brand[]>>`; selection still passes through the existing validator and canonical invocation rather than introducing a second preview/source map. The closing focused command passed 3 files / 94 tests; `git diff --check` exited 0 with only the existing line-ending warnings; and the protected hero hash remains `2b40e750e89c920657832665f59749b0d97cf7a0069b884b938d99fc71d46346`.

Unit B actual edits are **75 additions + 91 deletions = 166 changed lines**, below the 400-line hard stop. Per-path B accounting is: `brands.ts` 0/46, `brands.test.ts` 0/2, `model.ts` 1/1, `model.test.ts` 15/28, `Playground.tsx` 9/3, `Playground.test.tsx` 47/9, and `ControlPanel.tsx` 3/2 (additions/deletions). Because chained units remain uncommitted, raw Git numstat is cumulative for `brands.ts`/`brands.test.ts`; their B-only figures are taken from this unit's exact removal edits against the recorded Unit A boundary. The raw cumulative B-path numstat is preserved below for independent review.

### Unit B command evidence

```text
pnpm exec vitest run src/showcase/model.test.ts src/showcase/components/Playground.test.tsx [RED] -> failed: 2 intended dataset failures + 1 documented stale preview-frame expectation; 70 passed
pnpm exec vitest run src/showcase/brands.test.ts src/showcase/model.test.ts src/showcase/components/Playground.test.tsx [GREEN] -> passed: 3 files / 94 tests
pnpm exec vitest run src/showcase/brands.test.ts src/showcase/model.test.ts src/showcase/components/Playground.test.tsx [TRIANGULATE] -> passed: 3 files / 94 tests
pnpm exec vitest run src/showcase/brands.test.ts src/showcase/model.test.ts src/showcase/components/Playground.test.tsx [REFACTOR] -> passed: 3 files / 94 tests
rg -n 'FRONTEND_BRANDS|DatasetId.*frontend|value="frontend"|Frontend frameworks' src -> no matches (expected rg exit 1)
git diff --check -> passed; existing line-ending warnings only
raw cumulative git diff --numstat for B paths -> brands.test 79/93, brands 59/85, ControlPanel 3/2, Playground.test 47/9, Playground 9/3, model.test 15/28, model 1/1
Unit B boundary accounting -> 75 additions / 91 deletions = 166 changed lines
protected-hero hash command -> 2b40e750e89c920657832665f59749b0d97cf7a0069b884b938d99fc71d46346
```

### B boundary integrity and full-suite measurement

- `pnpm test` exited 1 with 2 failed / 7 passed files and 7 failed / 137 passed tests. All brands/model/Playground tests pass. Remaining failures are pre-existing stale expectations: six in `src/App.test.tsx` (ordered/adoption content, package-resource guidance, selected-cue text, nonexistent preview-frame CSS, preview-failure adoption content, and duplicate fades limitation) to be normalized only when future G/H/final `App.test.tsx` scope is active; and one selected-cue expectation in `InstallGuide.test.tsx`, owned by Work Unit H. No range, color, dataset, model, or Playground failure remains.
- Package/lock object hashes remain exactly `df1ec6f7f619ac8438ebc43414a9f7760473d01b` and `81942f4e99340591d1039bd31a7b8ba25ebc97b5`; declared ranges remain `^1.10.1`/`^5.8.0`; installed resolutions remain exactly `react-tech-slider@1.10.1`/`react-colorful@5.8.0`.
- `git diff -- src/App.tsx` and `git diff --cached --name-only` are empty. Final status contains only the acknowledged user-owned package/lock changes, cumulative Unit A/B files, and the active untracked change artifacts.
- Final protected hero hash is `2b40e750e89c920657832665f59749b0d97cf7a0069b884b938d99fc71d46346`.

## Work Unit C — metadata preservation and stable generated source

- **Dependency:** Work Unit B is independently green.
- **Forecast:** 190–240 changed lines; hard stop at 400.
- **Files:** `src/showcase/codegen.ts`, `src/showcase/codegen.test.ts`, `src/showcase/useResolvedBrands.test.tsx`, optionally `src/showcase/useResolvedBrands.ts` only if RED proves necessary, and this unit's task/progress evidence.

### C.RED — completed

`pnpm exec vitest run src/showcase/codegen.test.ts src/showcase/useResolvedBrands.test.tsx` exited 1 with 3 intended failures and 22 passes across 2 files. Failures were exclusively the missing optional metadata serializer: stable field-order lookup could not find `style`, approved Sport/Food output omitted `style`/`className`, and canonical transport-source coverage likewise showed metadata absent while remote URLs remained canonical. Existing fallback spread behavior preserved metadata in preview states, so RED did not justify a production edit to `useResolvedBrands.ts`.

### C.GREEN — completed

Extended the single `serializeBrand` path with stable optional `style` then `className` emission. Style entries retain insertion order, identifier-safe keys render bare, unsafe keys render through `JSON.stringify`, string values are JSON-escaped, finite numeric values remain numeric literals, empty style emits `{}`, and absent metadata remains omitted. No invocation construction or fallback production code changed. `pnpm exec vitest run src/showcase/brands.test.ts src/showcase/codegen.test.ts src/showcase/useResolvedBrands.test.tsx` exited 0 with 3 passed files and 46 passed tests; compiler-API metadata fixtures reported zero diagnostics against the public package `Brand` type.

### C.TRIANGULATE — completed

The matrix covers quotes, backslashes, `<`/`&`, backticks, identifier-safe and quoted custom style keys, insertion-ordered string/numeric style entries, `style.width`, finite dimensions, empty versus absent style, optional class-name combinations, Sport/Food metadata, canonical record order, pending/ready/failed/late-failed image states, canonical HTTPS source URLs, package-root imports, and generated TypeScript/JSX assignability. `pnpm exec vitest run src/showcase/codegen.test.ts src/showcase/useResolvedBrands.test.tsx` exited 0 with 2 passed files and 25 passed tests; generated compiler diagnostics remained empty.

### C.REFACTOR — completed

Source generation retains one private `serializeBrand` path and one bounded style serializer; no duplicate metadata/source mapping or transport mutation was introduced. `useResolvedBrands.ts` required no production change because its existing `{ ...brand, img: replacement }` rule already preserves metadata. The closing `pnpm exec vitest run src/showcase/brands.test.ts src/showcase/model.test.ts src/showcase/codegen.test.ts src/showcase/useResolvedBrands.test.tsx` exited 0 with 4 passed files and 100 passed tests. `git diff --check` exited 0 with only existing line-ending warnings. Unit C numstat is 48 additions + 14 deletions in `codegen.test.ts`, 23 additions in `codegen.ts`, and 8 additions + 2 deletions in `useResolvedBrands.test.tsx`, for **95 actual changed lines**, below the 400-line hard stop. `useResolvedBrands.ts` is unchanged. The protected hero hash remains `2b40e750e89c920657832665f59749b0d97cf7a0069b884b938d99fc71d46346`.

### Unit C command evidence

```text
pnpm exec vitest run src/showcase/codegen.test.ts src/showcase/useResolvedBrands.test.tsx [RED] -> failed as intended: 3 failed / 22 passed tests
pnpm exec vitest run src/showcase/brands.test.ts src/showcase/codegen.test.ts src/showcase/useResolvedBrands.test.tsx [GREEN] -> passed: 3 files / 46 tests; zero metadata compiler diagnostics
pnpm exec vitest run src/showcase/codegen.test.ts src/showcase/useResolvedBrands.test.tsx [TRIANGULATE] -> passed: 2 files / 25 tests; zero generated diagnostics
pnpm exec vitest run src/showcase/brands.test.ts src/showcase/model.test.ts src/showcase/codegen.test.ts src/showcase/useResolvedBrands.test.tsx [REFACTOR] -> passed: 4 files / 100 tests
git diff --check -> passed; existing line-ending warnings only
git diff --numstat -- C files -> codegen.test 48/14, codegen 23/0, useResolvedBrands.test 8/2, useResolvedBrands 0/0; total 79 additions / 16 deletions = 95 changed lines
protected-hero hash command -> 2b40e750e89c920657832665f59749b0d97cf7a0069b884b938d99fc71d46346
```

### C boundary integrity and full-suite measurement

- `pnpm test` exited 1 with 2 failed / 7 passed files and 7 failed / 139 passed tests. All brands/model/codegen/useResolvedBrands tests pass, including zero generated-source compiler diagnostics. The unchanged seven pre-existing failures remain six stale `App.test.tsx` expectations for future G/H/final normalization and one `InstallGuide.test.tsx` selected-cue expectation owned by Work Unit H. No generated-code, canonical URL, metadata, transport, dataset, or Playground failure remains.
- Package/lock object hashes remain exactly `df1ec6f7f619ac8438ebc43414a9f7760473d01b` and `81942f4e99340591d1039bd31a7b8ba25ebc97b5`; declared ranges remain `^1.10.1`/`^5.8.0`; installed resolutions remain exactly `react-tech-slider@1.10.1`/`react-colorful@5.8.0`.
- `git diff -- src/App.tsx` and `git diff --cached --name-only` are empty. Final status contains only acknowledged user-owned package/lock changes, cumulative Unit A–C files, and the active untracked change artifacts.
- Final protected hero hash is `2b40e750e89c920657832665f59749b0d97cf7a0069b884b938d99fc71d46346`.

## Work Unit D — all five live native ranges

- **Dependency:** Work Unit C is independently green.
- **Forecast:** 150–210 changed lines; hard stop at 400.
- **Files:** `src/showcase/components/ControlPanel.tsx`, `src/showcase/components/Playground.test.tsx`, `src/showcase/model.test.ts`, `src/styles.css`, and this unit's task/progress evidence.

### D.RED — completed

`pnpm exec vitest run src/showcase/model.test.ts src/showcase/components/Playground.test.tsx` exited 1 with 9 intended failures and 65 passes across 2 files. Failures proved the current controls were `type="number"`, kept preview/source values stale on change until blur, exposed number-input value semantics, and prevented live icon-width inheritance, retry-state projection, and reset-and-retry transitions. The pure reducer/model suite remained green, confirming normalization was already authoritative and the missing behavior was the UI event boundary.

### D.GREEN — completed

Replaced the numeric draft/onBlur component with one shared native `RangeField`. All five controls reuse `NUMERIC_DOMAINS`, render `type="range"` with exact min/max/step/value/unit, dispatch `event.currentTarget.value` on every change, and rely on reducer normalization without custom keyboard handlers. Only demo-owned `.range-field` CSS was added. `pnpm exec vitest run src/showcase/model.test.ts src/showcase/components/Playground.test.tsx` exited 0 with 2 passed files and 74 passed tests; output, latest package props, and generated JSX update before blur for all five controls.

### D.TRIANGULATE — completed

The matrix covers exact domains/steps/units, running-only and fades-only presence, native range structure without custom key interception, immediate interior-step updates, reducer min/max/step clamping, direct NaN/infinite containment, variant round trips, reset defaults, retry/reset-and-retry state, exact opposite-variant prop exclusion, and live Core/Sport/Food icon-width inheritance while metadata remains unmasked. Automated assertions prove native structure but do not claim browser Arrow/Home/End behavior. `pnpm exec vitest run src/showcase/model.test.ts src/showcase/components/Playground.test.tsx` exited 0 with 2 passed files and 75 passed tests.

### D.REFACTOR — completed

Removed the numeric draft/error/blur path and retained reducer normalization as the sole numeric authority. The obsolete-code search returned no matches. The closing A–C plus D regression command passed 5 files / 121 tests. The first `git diff --check` identified two trailing-whitespace lines introduced while removing the old import/component; those lines were corrected immediately and the repeated command exited 0 with only existing line-ending warnings. The protected hero hash remains `2b40e750e89c920657832665f59749b0d97cf7a0069b884b938d99fc71d46346`.

Because chained units remain uncommitted, raw D-path numstat is cumulative with Unit B. Raw current values are ControlPanel 22/64, Playground.test 153/124, model.test 29/28, and styles 6/0. Subtracting the recorded Unit B boundary for those same paths (3/2, 47/9, 15/28, 0/0) yields the **Unit D boundary footprint: 145 additions + 177 deletions = 322 actual changed lines**, below the 400-line hard stop.

### Unit D command evidence

```text
pnpm exec vitest run src/showcase/model.test.ts src/showcase/components/Playground.test.tsx [RED] -> failed as intended: 9 failed / 65 passed tests
pnpm exec vitest run src/showcase/model.test.ts src/showcase/components/Playground.test.tsx [GREEN] -> passed: 2 files / 74 tests
pnpm exec vitest run src/showcase/model.test.ts src/showcase/components/Playground.test.tsx [TRIANGULATE] -> passed: 2 files / 75 tests
rg -n 'NumericField|normalizeNumber|Enter a finite value|Adjusted to .*Allowed range' ControlPanel/Playground.test -> no matches (expected rg exit 1)
pnpm exec vitest run src/showcase/brands.test.ts src/showcase/model.test.ts src/showcase/codegen.test.ts src/showcase/useResolvedBrands.test.tsx src/showcase/components/Playground.test.tsx [REFACTOR] -> passed: 5 files / 121 tests
git diff --check [first] -> failed on 2 newly introduced trailing-whitespace lines; corrected immediately
git diff --check [repeat] -> passed; existing line-ending warnings only
raw cumulative D-path numstat -> ControlPanel 22/64, Playground.test 153/124, model.test 29/28, styles 6/0
Unit D boundary accounting -> 145 additions / 177 deletions = 322 changed lines
protected-hero hash command -> 2b40e750e89c920657832665f59749b0d97cf7a0069b884b938d99fc71d46346
```

### D boundary integrity and full-suite measurement

- `pnpm test` exited 1 with 2 failed / 7 passed files and 8 failed / 140 passed tests. All D-focused and A–C regression files pass. Remaining failures are seven stale `App.test.tsx` expectations and one `InstallGuide.test.tsx` cue expectation. Six App failures are the previously recorded content/layout/cue assertions; the seventh is an obsolete invalid-number-draft assertion now exposed because approved native ranges are intentionally non-clearable and have no invalid local draft. `App.test.tsx` is outside Unit D and remains future G/H/final normalization scope. The InstallGuide failure remains owned by H. No range/model/Playground implementation failure remains.
- Package/lock object hashes remain exactly `df1ec6f7f619ac8438ebc43414a9f7760473d01b` and `81942f4e99340591d1039bd31a7b8ba25ebc97b5`; declared ranges remain `^1.10.1`/`^5.8.0`; installed resolutions remain exactly `react-tech-slider@1.10.1`/`react-colorful@5.8.0`.
- `git diff -- src/App.tsx` and `git diff --cached --name-only` are empty. Final status contains only acknowledged user-owned package/lock changes, cumulative Unit A–D files, and active untracked change artifacts.
- Final protected hero hash is `2b40e750e89c920657832665f59749b0d97cf7a0069b884b938d99fc71d46346`.

## Work Unit E — deterministic concrete CSS-color resolver

- **Dependency:** Work Unit D is independently green.
- **Hard stop:** 400 changed lines.
- **Files:** new `src/showcase/color.ts`, new `src/showcase/color.test.ts`, and this unit's task/progress evidence only.

### E.RED — completed

Added a browser-boundary-injected contract matrix for canonical preservation, eight-digit lowercase picker projection, exact 3/4/6/8-digit hex handling, alpha `00`/`33`/`ff`, named/transparent/rgb/hsl/modern concrete samples, context-dependent rejection, unavailable browser/readback paths, cleanup, rounding/padding, assignment/readback failures, and dual-sentinel disagreement. Tests use only injected boundary objects and do not call jsdom canvas/CSS behavior. `pnpm exec vitest run src/showcase/color.test.ts` exited 1 before collecting tests because the required `./color` resolver module did not exist, the intended Work Unit E RED.

### E.GREEN — completed

Implemented the bounded dependency-free resolver in new `src/showcase/color.ts`. Valid hex uses a browser-free fast path while preserving trimmed canonical text; non-hex concrete colors resolve through a temporary hidden document probe and two cleared 1×1 default-sRGB canvas samples initialized from distinct sentinels. Samples must normalize to the same finite RGBA bytes before conversion to lowercase `#rrggbbaa`; all probe/canvas/assignment/readback failures return `null`, and probe ownership is released in `finally`. `pnpm exec vitest run src/showcase/color.test.ts` exited 0 with 1 passed file / 37 passed tests.

### E.TRIANGULATE — completed

Extended the matrix with explicit injected-boundary-only behavior and cleanup-failure containment. The first triangulation command observed 1 failure / 38 passes: an injected throwing `remove()` escaped from `finally`. Production cleanup was then contained without changing success semantics, and the repeated `pnpm exec vitest run src/showcase/color.test.ts` exited 0 with 1 passed file / 39 passed tests. The final matrix covers short-hex expansion, omitted alpha, mixed case, byte rounding/padding, wide-gamut sRGB projection, probe/assignment failures, unavailable sampling, thrown readback, invalid bytes, dual-sentinel disagreement, success/failure cleanup, and no image/network/canvas coupling outside the injected boundary.

### E.REFACTOR — completed

Kept one small public resolver plus explicit probe/sRGB sampling boundary interfaces, with no parser dependency or UI integration. The closing `pnpm exec vitest run src/showcase/color.test.ts` passed 1 file / 39 tests and `git diff --check` exited 0 with existing line-ending warnings only. Both Unit E files are new/untracked, so tracked `git diff --numstat` is empty; direct new-file accounting is 188 lines in `color.ts` plus 207 lines in `color.test.ts`, for **395 additions / 0 deletions = 395 actual changed lines**, below the 400-line hard stop. The protected hero hash remains `2b40e750e89c920657832665f59749b0d97cf7a0069b884b938d99fc71d46346`.

### Unit E command evidence

```text
pnpm exec vitest run src/showcase/color.test.ts [RED] -> failed as intended before collection: missing ./color module
pnpm exec vitest run src/showcase/color.test.ts [GREEN] -> passed: 1 file / 37 tests
pnpm exec vitest run src/showcase/color.test.ts [TRIANGULATE first] -> failed: 1 cleanup-containment failure / 38 passed tests
pnpm exec vitest run src/showcase/color.test.ts [TRIANGULATE repeat] -> passed: 1 file / 39 tests
pnpm exec vitest run src/showcase/color.test.ts [REFACTOR] -> passed: 1 file / 39 tests
git diff --check -> passed; existing line-ending warnings only
git diff --numstat -- src/showcase/color.ts src/showcase/color.test.ts -> empty because both files are untracked
wc -l src/showcase/color.ts src/showcase/color.test.ts -> 188 + 207 = 395 new lines
protected-hero hash command -> 2b40e750e89c920657832665f59749b0d97cf7a0069b884b938d99fc71d46346
```

### E boundary integrity and full-suite measurement

- The A–D regression command passed 5 files / 121 tests; the E-focused command independently passes 1 file / 39 tests.
- `pnpm test` exited 1 with 2 failed / 8 passed files and 8 failed / 179 passed tests. The unchanged failures remain seven later-owned stale `App.test.tsx` expectations and one `InstallGuide.test.tsx` cue expectation; `color.test.ts` passed. No Unit E resolver failure remains.
- Package/lock object hashes remain exactly `df1ec6f7f619ac8438ebc43414a9f7760473d01b` and `81942f4e99340591d1039bd31a7b8ba25ebc97b5`; declared ranges remain `^1.10.1`/`^5.8.0`; installed resolutions remain exactly `react-tech-slider@1.10.1`/`react-colorful@5.8.0`.
- `git diff -- src/App.tsx` and `git diff --cached --name-only` are empty. Final status contains only acknowledged user-owned package/lock changes, cumulative Unit A–D files, Unit E's two new files, and active change artifacts.
- Final protected hero hash is `2b40e750e89c920657832665f59749b0d97cf7a0069b884b938d99fc71d46346`.

## Work Unit F — both alpha pickers with precise text fallback

- **Dependency:** Work Unit E is independently green.
- **Hard stop:** 400 changed lines.
- **Files:** `ControlPanel.tsx`, `Playground.tsx`, `Playground.test.tsx`, `model.ts`, `model.test.ts`, `styles.css`, and this unit's task/progress evidence only.

### F.RED — completed

Mocked installed `HexAlphaColorPicker` behind labelled callback seams, replaced test injection with the canonical `CssColorResolver`, and specified exactly two eight-digit picker projections, alpha-exact immediate picker commits, trimmed precise text commits on Enter/blur, retained focus on Enter, invalid draft containment, picker/preview/source parity, swatch removal, variant unmount/remount isolation, and reset cleanup. `pnpm exec vitest run src/showcase/color.test.ts src/showcase/model.test.ts src/showcase/components/Playground.test.tsx` exited 1 with 3 intended missing-picker failures / 113 passes across 3 files; color/model remained green.

### F.GREEN — completed

Integrated exactly two installed `HexAlphaColorPicker` instances into one shared `ColorField`, each with a precise accessible picker label and always-eight-digit resolver projection. `Playground` now defaults one `resolveCssColor` seam and passes it to reducer validation and control projection. Picker callbacks resolve and dispatch immediately; text remains locally drafted, commits trimmed canonical values on Enter without blur or idempotent blur, and preserves invalid drafts with exact feedback. Removed value-based remount keys and the obsolete swatch, retaining whole-panel reset remount and variant unmount semantics. After correcting two test harness assumptions (Slider props require the real preview path and synthetic keydown requires explicit focus), `pnpm exec vitest run src/showcase/color.test.ts src/showcase/model.test.ts src/showcase/components/Playground.test.tsx` passed 3 files / 116 tests.

### F.TRIANGULATE — completed

Expanded the shared control path across alpha-bearing callbacks for both pickers, independent border/background updates, named/transparent/rgb/hsl canonical text, eight-digit projection after each commit, valid running-state round trips through fades, invalid uncommitted draft discard, reset remount from an invalid default-valued draft, Enter focus retention, and blur idempotence. Existing native range behavior remains in the same focused suite. `pnpm exec vitest run src/showcase/color.test.ts src/showcase/model.test.ts src/showcase/components/Playground.test.tsx` exited 0 with 3 passed files / 116 tests.

### F.REFACTOR — completed

Retained one shared `ColorField`, one `CssColorResolver` flow for reducer validation and picker projection, and one local text/error draft per mounted field. Removed the obsolete swatch and old `supportsColor`/boolean-validator paths; an exact production search found no residue. The closing focused command passed 3 files / 116 tests, and `git diff --check` passed with existing line-ending warnings only. Raw F-path numstat is cumulative with B/D: ControlPanel 51/79, Playground.test 283/146, Playground 15/18, model.test 37/31, model 12/12, styles 11/10. Subtracting the recorded pre-F D boundary (22/64, 153/124, 9/3, 29/28, 1/1, 6/0) yields the **Unit F boundary footprint: 189 additions + 76 deletions = 265 actual changed lines**, below 400. The protected hero hash remains `2b40e750e89c920657832665f59749b0d97cf7a0069b884b938d99fc71d46346`.

### Unit F command evidence

```text
pnpm exec vitest run src/showcase/color.test.ts src/showcase/model.test.ts src/showcase/components/Playground.test.tsx [RED] -> failed as intended: 3 picker/control failures / 113 passed tests
pnpm exec vitest run src/showcase/color.test.ts src/showcase/model.test.ts src/showcase/components/Playground.test.tsx [GREEN] -> passed: 3 files / 116 tests
pnpm exec vitest run src/showcase/color.test.ts src/showcase/model.test.ts src/showcase/components/Playground.test.tsx [TRIANGULATE] -> passed: 3 files / 116 tests
pnpm exec vitest run src/showcase/color.test.ts src/showcase/model.test.ts src/showcase/components/Playground.test.tsx [REFACTOR] -> passed: 3 files / 116 tests
rg -n 'color-swatch|supportsColor|isValidColor' scoped production files and styles -> no matches
raw cumulative F-path numstat -> ControlPanel 51/79, Playground.test 283/146, Playground 15/18, model.test 37/31, model 12/12, styles 11/10
Unit F boundary accounting -> 189 additions / 76 deletions = 265 changed lines
git diff --check -> passed; existing line-ending warnings only
protected-hero hash command -> 2b40e750e89c920657832665f59749b0d97cf7a0069b884b938d99fc71d46346
```

### F boundary integrity and full-suite measurement

- The A–E regression command passed 6 files / 162 tests; the closing F-focused command independently passed 3 files / 116 tests after removing the final obsolete responsive swatch rule.
- `pnpm test` exited 1 with 2 failed / 8 passed files and 8 failed / 181 passed tests. The unchanged failures remain seven later-owned stale `App.test.tsx` expectations and one `InstallGuide.test.tsx` cue expectation. Color/model/Playground suites pass; no picker, resolver, range, preview-prop, or generated-source failure remains.
- Package/lock object hashes remain exactly `df1ec6f7f619ac8438ebc43414a9f7760473d01b` and `81942f4e99340591d1039bd31a7b8ba25ebc97b5`; declared ranges remain `^1.10.1`/`^5.8.0`; installed resolutions remain exactly `react-tech-slider@1.10.1`/`react-colorful@5.8.0`.
- `git diff -- src/App.tsx` and `git diff --cached --name-only` are empty. Final status contains only acknowledged user-owned package/lock changes, cumulative Unit A–F files, and active change artifacts.
- Final protected hero hash is `2b40e750e89c920657832665f59749b0d97cf7a0069b884b938d99fc71d46346`.

## Work Unit G — bounded tokenizer and highlighted read-only viewer

- **Dependency:** Work Unit F is independently green.
- **Hard stop:** 400 changed lines; split tokenizer/viewer if reached.
- **Files:** new `sourceHighlight.ts`/test, `GeneratedCode.tsx`/new test, `styles.css`, G-owned `App.test.tsx` expectations, and task/progress evidence only.

### G.RED — completed

Recovered and repaired the partial tokenizer test without creating a production module, then added viewer composition tests for exact line reconstruction, React-node safety, labelled focusable read-only structure, line-number/token hooks, and original-source clipboard fidelity. `pnpm exec vitest run src/showcase/sourceHighlight.test.ts src/showcase/components/GeneratedCode.test.tsx` exited 1: the pure suite failed before collection because `./sourceHighlight` was missing, while all 3 viewer tests failed because the current plain viewer had no `generated-source` line model. These are the intended G RED failures.

### G.GREEN — completed

Implemented the pure bounded scanner with the exact eight token kinds, line-by-line reconstruction, block-comment carry, string escapes, JSX tag/attribute recognition, fixed keywords, decimal numbers, punctuation, and adjacent-kind merging. `GeneratedCode` now renders a focusable labelled `<pre><code>` from React spans with explicit line numbers/content/newline nodes, while the existing `CopyButton` receives the untouched original source. Added bounded demo-owned viewer/gutter/token CSS and hid only the transitional duplicate plain generated-source node pending H composition. The first GREEN run had 1 test-harness query failure / 6 passes because it selected the first string token; the safe-markup assertion was corrected to search all string tokens. The repeated focused command passed 2 files / 7 tests.

### G.TRIANGULATE — completed

The pure/component matrix now covers block comments, escaped quotes/backslashes, `<`/`&`/backticks inside strings, closing tags, adjacent token merging, decimals, final empty lines, very long URLs, safe markup-like metadata, package-root imports, and exact generated Sport/Food source reconstruction. The exact triangulation command passed both G suites (10 tests) while `App.test.tsx` retained its 7 documented later-owned content/cue/range/layout failures; no new G failure appeared. G-owned App expectations were updated from the plain `.source-code` model to viewer hooks and bounded CSS/raw-API assertions without normalizing those later-owned failures. A direct static extraction reported all six G checks true: max-width, bounded max-height, local overflow, preformatted whitespace, min-width containment, and raw/editable API absence.

### G.REFACTOR — completed

Kept the scanner pure and React-independent, merging adjacent same-kind tokens during emission. Copy remains the viewer's only action and still uses the untouched source string. The forbidden production API search (`dangerouslySetInnerHTML|innerHTML|contentEditable|<textarea`) returned no matches. Parent steering authorized normalization of the seven pre-existing stale `App.test.tsx` assertions only after confirming no production defect: (1) removed the absent adoption heading from page-order expectations; (2) replaced absent adoption-copy assertions with the actual generated package-root import; (3) accepted the current visible `✓` preset cue; (4) removed the obsolete demo alignment-wrapper CSS expectation; (5) replaced obsolete invalid numeric-draft behavior with the approved native range contract; (6) removed the absent adoption heading from preview-failure expectations; and (7) accepted the single current fades limitation. `App.tsx` and InstallGuide tests/behavior remain untouched. The full closing G command then passed 3 files / 17 tests.

The three new files total 266 lines. Tracked G deltas are App.test 20/39 and GeneratedCode 25/4; styles are cumulative 55/10, and subtracting the recorded Unit F styles boundary 11/10 yields 44/0 for G. Therefore the **Unit G boundary footprint is 355 additions + 43 deletions = 398 actual changed lines**, below the 400-line hard stop. `git diff --check` passed with existing line-ending warnings only, and the protected hero hash remains `2b40e750e89c920657832665f59749b0d97cf7a0069b884b938d99fc71d46346`.

### Unit G command evidence

```text
pnpm exec vitest run src/showcase/sourceHighlight.test.ts src/showcase/components/GeneratedCode.test.tsx [RED] -> failed as intended: missing tokenizer module + 3 missing viewer tests
pnpm exec vitest run src/showcase/sourceHighlight.test.ts src/showcase/components/GeneratedCode.test.tsx [GREEN first] -> 1 harness query failure / 6 passed
pnpm exec vitest run src/showcase/sourceHighlight.test.ts src/showcase/components/GeneratedCode.test.tsx [GREEN repeat] -> passed: 2 files / 7 tests
pnpm exec vitest run src/showcase/sourceHighlight.test.ts src/showcase/components/GeneratedCode.test.tsx src/App.test.tsx [TRIANGULATE before authorized debt normalization] -> G suites passed; App retained 7 stale failures / 10 passes
G-owned direct static extraction -> [true, true, true, true, true, true]
pnpm exec vitest run src/App.test.tsx [authorized baseline normalization] -> passed: 1 file / 8 tests
pnpm exec vitest run src/showcase/sourceHighlight.test.ts src/showcase/components/GeneratedCode.test.tsx src/App.test.tsx [REFACTOR] -> passed: 3 files / 17 tests
rg -n 'dangerouslySetInnerHTML|innerHTML|contentEditable|<textarea' sourceHighlight.ts GeneratedCode.tsx -> no matches
new-file accounting -> sourceHighlight.ts 107, sourceHighlight.test.ts 91, GeneratedCode.test.tsx 68 = 266 lines
tracked deltas -> App.test 20/39, GeneratedCode 25/4, styles G-only 44/0
Unit G boundary accounting -> 355 additions / 43 deletions = 398 changed lines
git diff --check -> passed; existing line-ending warnings only
protected-hero hash command -> 2b40e750e89c920657832665f59749b0d97cf7a0069b884b938d99fc71d46346
```

### G boundary integrity and full-suite measurement

- The A–F regression command passed 6 files / 162 tests. The full G/App boundary passes 3 files / 17 tests.
- `pnpm test` exited 1 with 1 failed / 11 passed files and 1 failed / 197 passed tests. The sole remaining failure is the unchanged `InstallGuide.test.tsx` selected-cue expectation explicitly reserved for H; all App, tokenizer, viewer, color, model, Playground, metadata, and generated-source tests pass.
- Package/lock object hashes remain exactly `df1ec6f7f619ac8438ebc43414a9f7760473d01b` and `81942f4e99340591d1039bd31a7b8ba25ebc97b5`; declared ranges remain `^1.10.1`/`^5.8.0`; installed resolutions remain exactly `react-tech-slider@1.10.1`/`react-colorful@5.8.0`.
- `git diff -- src/App.tsx` and `git diff --cached --name-only` are empty. Final status contains only acknowledged user-owned package/lock changes, cumulative Unit A–G files, and active change artifacts.
- Final protected hero hash is `2b40e750e89c920657832665f59749b0d97cf7a0069b884b938d99fc71d46346`.

## Historical intermediate 2026-07-28 scope amendment (superseded)

- **Decision:** The user explicitly approved retaining the current external `src/App.tsx` wiring diff: import `CORE_BRANDS` from `./showcase/brands`, remove the duplicated hero-local brands array, and pass `brandsList={CORE_BRANDS}` to the existing hero `Slider`.
- **Scope effect:** Hero reuse of the canonical Core fixture and removal of duplicate fixture data are now in scope. Published-package integration, the existing hero `Slider` markup, fixed props, surrounding hero markup, and hero content remain otherwise unchanged.
- **Hash rebaseline:** The protected extracted hero baseline changes from `2b40e750e89c920657832665f59749b0d97cf7a0069b884b938d99fc71d46346` to `8c04b455f6ea3fe26b12a0a6e16e2c003e7a86297e168bc3eba73bf6dd3c7ca6`.
- **Unit G blocker resolution:** Unit G was blocked when this external App/hero drift appeared after its recorded green boundary. The user's explicit approval resolves that blocker; the completed Unit G RED/GREEN/TRIANGULATE/REFACTOR evidence and its true-at-the-time old hashes above remain untouched.
- **Forward constraint:** No further `src/App.tsx` or hero edit, movement, reformat, markup change, or content change is permitted without another explicit user approval.
- **Artifact-only boundary:** This amendment changes only the six active OpenSpec artifacts. It does not edit any `src/**` file, does not stage or commit anything, and does not start Work Unit H.
- **Gate result:** Task 0.4 is checked as the explicit approved rebaseline gate. **H.RED remains the next unchecked implementation task.**

## Final 2026-07-28 artifact-only hero rebaseline amendment

- **Authority:** The user explicitly approved and froze the final accepted hero baseline on 2026-07-28.
- **Accepted `src/App.tsx` diff:** Keep the `CORE_BRANDS` import, removal of the duplicate hero-local brands array, `brandsList={CORE_BRANDS}`, and the existing hero Slider at `iconWidth={18}`. Package integration and all other hero markup/content remain unchanged.
- **Final protected hash:** The approved extraction command returns `aa787e708db68498c3b051446d7416b9933b2455f238bcf49e346bee3b56bdee`. This is the only forward expected baseline.
- **Historical context:** The immediately preceding amendment records the interrupted intermediate `8c04b455f6ea3fe26b12a0a6e16e2c003e7a86297e168bc3eba73bf6dd3c7ca6` proposal. It is retained only as historical/intermediate evidence and is superseded by the final accepted hash above. Earlier `2b40e750e89c920657832665f59749b0d97cf7a0069b884b938d99fc71d46346` entries are true-at-the-time historical Unit A–G evidence, not forward expectations.
- **Unit G unblock:** The final approval resolves Unit G's external App-drift blocker. Unit G remains independently green and closed below budget; its prior RED/GREEN/TRIANGULATE/REFACTOR command evidence is not rewritten.
- **Artifact-only boundary:** This final amendment changes only the six active OpenSpec artifacts. It does not edit `src/**`, stage files, or begin Work Unit H.
- **Validation:** The exact protected-section hash command returned `aa787e708db68498c3b051446d7416b9933b2455f238bcf49e346bee3b56bdee`; the six-artifact baseline grep found the final hash and `iconWidth={18}` in every artifact with no superseded hero-width literal remaining; the forward-reference grep showed only the final hash as current; direct artifact trailing-whitespace and `git diff --check` checks were clean; the read-only `src/App.tsx` diff contained only the accepted import, duplicate-fixture removal, `brandsList={CORE_BRANDS}`, and `iconWidth={18}` changes; and `git diff --cached --name-only` was empty.
- **Next task:** **H.RED remains the next unchecked implementation task.**

## Work Unit H — reusable CopyButton and inline install command

- **Dependency:** Work Unit G is independently green and the final hero rebaseline is approved.
- **Forecast:** 130–180 changed lines; hard stop at 400.
- **Files:** `CopyButton.tsx`/test, `InstallGuide.tsx`/test, `GeneratedCode.tsx`/test, `styles.css`, `App.test.tsx`, and this unit's task/progress evidence only.

### H.RED — completed

Added caller-supplied child composition tests for stacked and inline-field presentations, a single inline command row containing exact selectable text plus the native copy button, exact npm/pnpm clipboard values and accessible names, exact manual-copy failure feedback, stale-request handling, status independence/remount behavior, generated-viewer composition, and static containment/private-selector rules. Normalized the one known stale install-tab cue expectation from `✓ Selected` to the current visible `✓`. `pnpm exec vitest run src/showcase/components/CopyButton.test.tsx src/showcase/components/InstallGuide.test.tsx src/showcase/components/GeneratedCode.test.tsx` exited 1 with exactly 3 intended composition failures / 20 passes: the inline field was absent, install still rendered `.source-code`, and the viewer was outside a stacked copy block. Existing clipboard success/failure/race/unmount behavior remained green.

### H.GREEN — completed

Extended the single `CopyButton` state machine with caller-supplied children and `stacked | inline-field` composition without changing clipboard request, timeout, stale-request, or unmount logic. `GeneratedCode` now passes its unchanged highlighted viewer as stacked content; `InstallGuide` passes the exact active command as selectable inline content. Added demo-owned grid/overflow/44px CSS and removed obsolete duplicate `.source-code` presentation rules. The repeated focused command exited 0 with 3 passed files / 23 tests.

### H.TRIANGULATE — completed

The matrix covers npm/pnpm click and native keyboard tab selection, exact selected-command copying, success, rejected/synchronously throwing/absent clipboard, exact manual-copy guidance, rapid stale requests, StrictMode/unmount cleanup, selected-tab status remount, instance status independence, generated/install status independence, one inline button, command selectability, and 390px static ownership hooks. `pnpm exec vitest run src/showcase/components/CopyButton.test.tsx src/showcase/components/InstallGuide.test.tsx src/showcase/components/GeneratedCode.test.tsx src/App.test.tsx` exited 0 with 4 passed files / 31 tests. The forbidden selector/declaration search returned no matches.

### H.REFACTOR — completed

Retained one clipboard implementation and removed only the obsolete hidden duplicate source/install layout. The closing H/G/App command passed 5 files / 37 tests, preserving all tokenizer/viewer behavior and exact copy source. `git diff --check` exited 0 with existing line-ending warnings only. The protected hero hash remains exactly `aa787e708db68498c3b051446d7416b9933b2455f238bcf49e346bee3b56bdee`; dependency hashes remain `df1ec6f7f619ac8438ebc43414a9f7760473d01b` / `81942f4e99340591d1039bd31a7b8ba25ebc97b5`; and the staged set is empty.

Raw current tracked deltas are cumulative for `App.test.tsx`, `GeneratedCode.tsx`, and `styles.css`. Subtracting the recorded G boundary gives H-only deltas of App test 26/0, GeneratedCode 6/1, and styles 15/3. The other tracked H files contribute CopyButton test 76/92, CopyButton 30/9, InstallGuide test 25/5, and InstallGuide 10/5. The untracked GeneratedCode test grew from the recorded G boundary of 68 lines to 74 lines, contributing 6 additions. Therefore the **Unit H boundary footprint is 194 additions + 115 deletions = 309 actual changed lines**, below the 400-line hard stop.

### Unit H command evidence

```text
pnpm exec vitest run src/showcase/components/CopyButton.test.tsx src/showcase/components/InstallGuide.test.tsx src/showcase/components/GeneratedCode.test.tsx [RED] -> failed as intended: 3 composition failures / 20 passed tests
same focused command [GREEN] -> passed: 3 files / 23 tests
pnpm exec vitest run src/showcase/components/CopyButton.test.tsx src/showcase/components/InstallGuide.test.tsx src/showcase/components/GeneratedCode.test.tsx src/App.test.tsx [TRIANGULATE] -> passed: 4 files / 31 tests
pnpm exec vitest run src/showcase/sourceHighlight.test.ts src/showcase/components/GeneratedCode.test.tsx src/showcase/components/CopyButton.test.tsx src/showcase/components/InstallGuide.test.tsx src/App.test.tsx [REFACTOR] -> passed: 5 files / 37 tests
rg forbidden selector/animation pattern in src/styles.css -> no matches
A–G regression measurement -> failed: 3 failures / 168 passes across 8 files because current out-of-scope SPORT_BRANDS has 7 Puma–Fila records with filter metadata instead of the approved 10-record fixture
pnpm test -> failed: 3 failures / 197 passes across 12 files for the same out-of-scope Sport fixture drift; all H/G/App tests pass
git diff --check -> passed; existing line-ending warnings only
declared dependencies -> react-tech-slider ^1.10.1 / react-colorful ^5.8.0
installed dependencies -> react-tech-slider@1.10.1 / react-colorful@5.8.0
package/lock hashes -> df1ec6f7f619ac8438ebc43414a9f7760473d01b / 81942f4e99340591d1039bd31a7b8ba25ebc97b5
protected-hero hash -> aa787e708db68498c3b051446d7416b9933b2455f238bcf49e346bee3b56bdee
git diff --cached --name-only -> empty
Unit H boundary accounting -> 194 additions / 115 deletions = 309 changed lines
```

### H boundary integrity and regression state

- H, G, and App focused suites are green, and H stayed below budget with no private package selector, animation override, dependency edit, or `App.tsx` edit.
- The requested A–G regression measurement and full suite are not green because `src/showcase/brands.ts`, outside H's allowed edit surface, currently exposes a seven-record Sport fixture beginning with Puma and adds `filter: "invert()"`. This conflicts with the completed Unit A contract and causes the exact fixture, generated metadata, and Playground selection tests to fail. H did not rewrite or work around that drift.
- Browser-only containment, selection, clipboard denial, and target-size observations remain unverified; static CSS/jsdom results are not claimed as visual browser proof.

## Historical pre-amendment apply status

Work Unit H is implemented, focused-green, and closed at 309 changed lines. Final tasks 10.x were not started or checked. **10.1 is the next unchecked task**, but its A–G suites currently expose the out-of-scope Sport fixture regression recorded above and must not be reported green until that drift is resolved by the owning scope.

## 2026-07-28 Sport fixture contract amendment

- **Authority:** By explicit user decision, the current production `SPORT_BRANDS` is the fixture authority and production `src/showcase/brands.ts` was not edited by this amendment.
- **Current contract:** Seven ordered records with IDs 1–7: Puma, Reebok, Under Armour, The North Face, Nike, Adidas, and Fila. Current URLs/class names are preserved; every style contains `transition: "width 1s ease"` plus `filter: "invert()"`; New Balance, Converse, and Asics are removed.
- **Preserved adjacent contracts:** Food remains 10 records; `MAX_DATASET_SIZE` remains 10; the protected hero remains `iconWidth={18}` at SHA-256 `aa787e708db68498c3b051446d7416b9933b2455f238bcf49e346bee3b56bdee`.
- **Performance contract:** Published fades expansion is 49 images for seven-record Sport and 100 images for ten-record Food.
- **Historical evidence:** All earlier Unit A–H ten-record Sport RED/GREEN and boundary evidence above remains unchanged and true at the time it was recorded. It is historical and no longer current fixture authority.

### Amendment strict-TDD evidence

- **RED:** `pnpm test -- src/showcase/brands.test.ts` exited 1 before amendment edits. Because the package script forwards `--` to Vitest rather than filtering, Vitest ran 12 files and reported exactly 3 stale-contract failures / 197 passes: `src/showcase/brands.test.ts` expected ten New Balance–Fila records, `src/showcase/codegen.test.ts` expected Converse transition-only metadata, and `src/showcase/components/Playground.test.tsx` expected New Balance plus ten Sport records.
- **GREEN:** Updated only the three directly affected test expectations. `pnpm exec vitest run src/showcase/brands.test.ts src/showcase/codegen.test.ts src/showcase/components/Playground.test.tsx` exited 0 with 3 passed files / 56 passed tests.
- **TRIANGULATE/REFACTOR:** Exact fixture equality now proves all seven ordered records and complete transition/filter styles; generated source proves Reebok class/style metadata and Food transition-only metadata; Playground proves preview/source parity, IDs 1–7, absence of removed brands, Food length 10, and unchanged global sizing behavior. No production refactor was required. `pnpm test` exited 0 with 12 passed files / 200 passed tests.

### Amendment integrity evidence

```text
git diff --check -> passed; existing LF-to-CRLF warnings only
git hash-object package.json pnpm-lock.yaml -> df1ec6f7f619ac8438ebc43414a9f7760473d01b / 81942f4e99340591d1039bd31a7b8ba25ebc97b5
protected-hero hash command -> aa787e708db68498c3b051446d7416b9933b2455f238bcf49e346bee3b56bdee
git diff --cached --name-only -> empty
```

### Amendment boundary and next task

The amendment changed only `src/showcase/brands.test.ts`, `src/showcase/codegen.test.ts`, `src/showcase/components/Playground.test.tsx`, and the six active OpenSpec artifacts. It did not edit `src/showcase/brands.ts`, `src/App.tsx`, dependency files, package source, sibling/private selectors, or publication state. Final tasks 10.x were not started or checked. **10.1 remains the first unchecked task.**

## Final automated verification — tasks 10.1–10.4

Final automated verification was completed by the verification worker and recorded from `.pi-subagents/artifacts/314085d5_gentle-ai-verify_0_output.md`. This artifact-only recording did not rerun production tests, edit `src/**`, start a browser server, or use browser tooling.

### 10.1 Focused suites

All four focused commands exited zero:

- Brands/model/codegen/resolved-brands: **4 files / 101 tests passed**.
- Color/Playground: **2 files / 61 tests passed**.
- Source highlighter/generated-code viewer: **2 files / 9 tests passed**.
- CopyButton/InstallGuide/App: **3 files / 28 tests passed**.

Positive compiler-API assertions in `src/showcase/codegen.test.ts:239-241,270-276` produced empty diagnostic arrays. Negative type-guard cases intentionally continued to assert diagnostics for invalid inputs.

### 10.2 Repository verification

- `pnpm test` passed: **12 files / 200 tests**.
- `pnpm build` passed (`tsc -b && vite build`): 33 modules transformed; `dist/index.html` 0.47 kB, CSS 12.55 kB, and JS 232.04 kB.
- `pnpm lint` passed with no ESLint diagnostics.
- `git diff --check` exited zero; only existing LF-to-CRLF warnings were printed.

These automated results do not prove pointer behavior, browser accessibility, visual containment, package alignment, or performance.

### 10.3 Dependency, scope, and generated-source integrity

- Declared dependency ranges remain `react-tech-slider@^1.10.1` and `react-colorful@^5.8.0`; installed resolutions remain exactly `react-tech-slider@1.10.1` and `react-colorful@5.8.0`.
- Object hashes exactly match preflight: `package.json` = `df1ec6f7f619ac8438ebc43414a9f7760473d01b`; `pnpm-lock.yaml` = `81942f4e99340591d1039bd31a7b8ba25ebc97b5`. Their diff remains limited to the protected preflight `react-colorful` manifest/lock additions.
- The accepted `src/App.tsx` diff contains only the `CORE_BRANDS` import, removal of the duplicate local fixture, `brandsList={CORE_BRANDS}`, and `iconWidth={18}`.
- The forbidden selector/animation search returned no matches; `rg` exit 1 was the expected empty-result status.
- Canonical generated-code flow remains `Playground.tsx` generation from the canonical invocation before preview resolution. `codegen.ts` has no fallback-data generation; passing assertions at `codegen.test.ts:240` and `useResolvedBrands.test.tsx:229` reject fallback data URLs in generated source. Production `data:` use is confined to preview fallback handling in `brands.ts`, `useResolvedBrands.ts`, and `PreviewPanel.tsx`.
- Final verification observed 20 modified and 6 untracked entries. Every entry was within the declared implementation/OpenSpec scope or the protected preflight package/lock changes; **no unrelated file was found**.
- `git diff --cached --name-only` returned no output; **no file was staged**.

### 10.4 Protected hero

The approved extraction/hash command returned exactly `aa787e708db68498c3b051446d7416b9933b2455f238bcf49e346bee3b56bdee`. This matches the final accepted hero baseline with `iconWidth={18}`.

## Browser waiver closeout — tasks 11.1–11.4

- **Decision:** On 2026-07-28, the user explicitly selected **Waive and finish**.
- **Classification:** Every item below is **waived/unverified**, never passed. The waiver closes the apply checkbox but does not convert missing observations into evidence.
- **Execution:** No browser server, manual browser session, browser tooling, or other browser/runtime command ran. No browser version or viewport was observed. The waiver provides no rendered evidence, and automated Vitest/build/lint results do not prove any browser-only behavior.
- **Evidence location:** This section in `openspec/changes/refresh-showcase-controls-and-datasets/apply-progress.md`.

### 11.1 Browser matrix — individually waived/unverified

| Browser row | Version | Viewport | Operator/date | Classification | Rendered evidence |
| --- | --- | --- | --- | --- | --- |
| Chromium | Not observed | Not observed | User waiver / 2026-07-28 | waived/unverified | None |
| Firefox | Not observed | Not observed | User waiver / 2026-07-28 | waived/unverified | None |
| WebKit/Safari | Not observed | Not observed | User waiver / 2026-07-28 | waived/unverified | None |

### 11.2 Range, picker, focus, and parity items — individually waived/unverified

| Item | Classification |
| --- | --- |
| Icon width range pointer dragging | waived/unverified |
| Icon width range Arrow/Home/End | waived/unverified |
| Border width range pointer dragging | waived/unverified |
| Border width range Arrow/Home/End | waived/unverified |
| Duration range pointer dragging | waived/unverified |
| Duration range Arrow/Home/End | waived/unverified |
| Gap range pointer dragging | waived/unverified |
| Gap range Arrow/Home/End | waived/unverified |
| Speed range pointer dragging | waived/unverified |
| Speed range Arrow/Home/End | waived/unverified |
| Immediate visible output/preview/source parity | waived/unverified |
| Core icon resizing | waived/unverified |
| Sport icon resizing | waived/unverified |
| Food icon resizing | waived/unverified |
| Border `HexAlphaColorPicker` pointer behavior | waived/unverified |
| Border `HexAlphaColorPicker` keyboard behavior | waived/unverified |
| Background `HexAlphaColorPicker` pointer behavior | waived/unverified |
| Background `HexAlphaColorPicker` keyboard behavior | waived/unverified |
| Picker focus order and focus retention | waived/unverified |
| Picker alpha rendering | waived/unverified |
| `#00000033` text fallback | waived/unverified |
| Named-color text fallback | waived/unverified |
| Transparent text fallback | waived/unverified |
| RGB/HSL text fallback | waived/unverified |
| Modern concrete CSS-color text fallback through the production canvas resolver | waived/unverified |
| Invalid draft and last-valid containment | waived/unverified |
| Enter commit | waived/unverified |
| Blur commit | waived/unverified |
| Reset behavior | waived/unverified |
| Running/fades round trip | waived/unverified |

### 11.3 Viewer/install responsive and accessibility items — individually waived/unverified

| Item | Classification |
| --- | --- |
| Wide-viewport line-number alignment | waived/unverified |
| 390px line-number alignment | waived/unverified |
| Wide-viewport source selection | waived/unverified |
| 390px source selection | waived/unverified |
| Line-number gutter exclusion from selection where supported | waived/unverified |
| Long-line local scrolling | waived/unverified |
| Source token/text contrast | waived/unverified |
| Viewer and copy-control focus visibility | waived/unverified |
| Exact generated-code clipboard copy | waived/unverified |
| Exact npm inline command copy | waived/unverified |
| Exact pnpm inline command copy | waived/unverified |
| Command selection after clipboard denial | waived/unverified |
| Clipboard-denial text visibility and manual-copy recovery | waived/unverified |
| 44px copy target | waived/unverified |
| 390px page-level horizontal overflow absence | waived/unverified |

### 11.4 Package-owned fades and bounded dataset items — individually waived/unverified

| Item | Classification |
| --- | --- |
| Sport running at desktop preset | waived/unverified |
| Sport running at tablet preset | waived/unverified |
| Sport running at mobile preset | waived/unverified |
| Food running at desktop preset | waived/unverified |
| Food running at tablet preset | waived/unverified |
| Food running at mobile preset | waived/unverified |
| Sport fades at desktop preset | waived/unverified |
| Sport fades at tablet preset | waived/unverified |
| Sport fades at mobile preset | waived/unverified |
| Food fades at desktop preset | waived/unverified |
| Food fades at tablet preset | waived/unverified |
| Food fades at mobile preset | waived/unverified |
| Observable 49-image Sport fades tree | waived/unverified |
| Observable 100-image Food fades tree | waived/unverified |
| Gap `0` | waived/unverified |
| Gap `180` | waived/unverified |
| Speed `0.25` | waived/unverified |
| Speed `4` | waived/unverified |
| Rapid dataset switches | waived/unverified |
| Rapid live-control updates | waived/unverified |
| Dataset containment | waived/unverified |
| Package-owned fades alignment | waived/unverified |
| Animation responsiveness | waived/unverified |
| Memory behavior | waived/unverified |
| Network behavior | waived/unverified |
| Image fallback appearance | waived/unverified |

### Exact residual risks after waiver

- Native range pointer/Arrow/Home/End.
- Production CSS-color canvas resolver and picker pointer/keyboard/focus/alpha.
- 390px overflow/selection/gutter/contrast/focus/clipboard denial/44px target.
- Package-owned fades alignment and 49-image Sport/100-image Food responsiveness/network/memory/fallback.

These risks remain waived/unverified. No browser pass, rendered observation, accessibility observation, performance claim, or package-alignment claim is made.

## Task 12.1 — per-slice evidence audit

All dependency-ordered Work Unit A–H lifecycle sections and amendment records are present above. Each unit records its dependency, files/scope, observed RED failure, GREEN result, TRIANGULATE matrix, REFACTOR result, focused commands, integrity/hash evidence, stop/resolution where applicable, and actual review size. The recorded actual sizes are **A 276, B 166, C 95, D 322, E 395, F 265, G 398, and H 309 changed lines**; every unit remained below the 400-line boundary. The final hero rebaseline and seven-record Sport fixture amendment preserve the historical true-at-the-time evidence rather than rewriting it. No lifecycle phase is inferred only from the final green run.

## Task 12.2 — final verification handoff without publication

- **Delivery:** Chained delivery using Work Units A through H was selected; no one-PR `size:exception` was used.
- **Actual per-unit sizes:** A 276; B 166; C 95; D 322; E 395; F 265; G 398; H 309 changed lines.
- **Automated results:** Focused suites passed at 101/61/9/28 tests; the full suite passed 12 files/200 tests; build passed with the recorded artifacts; lint passed; diff check passed; compiler-API positive diagnostics were empty. Historical automated evidence and amendments above are preserved.
- **Integrity:** Dependency versions and preflight hashes match; the accepted App diff and protected hero hash match; forbidden selector/animation search produced the expected no-match; canonical generated URLs remain free of preview fallback data; no unrelated or staged file was found.
- **Browser waiver:** On 2026-07-28, the user explicitly selected **Waive and finish**. Tasks 11.1–11.4 are checked complete only by that decision; every browser matrix, interaction, viewer/install, and fades/performance item remains individually waived/unverified, never passed.
- **Browser/runtime execution:** No browser server, browser tooling, manual browser session, or other browser/runtime command ran. The waiver provides no rendered evidence.
- **Residual risks:** Native range pointer/Arrow/Home/End; production CSS-color canvas resolver and picker pointer/keyboard/focus/alpha; 390px overflow/selection/gutter/contrast/focus/clipboard denial/44px target; package-owned fades alignment and 49-image Sport/100-image Food responsiveness/network/memory/fallback.
- **Publication state:** No file is staged. This handoff performed no commit, branch, push, PR, release, sync, archive, or other publication action.
- **Apply status:** Complete. Every task checkbox is complete after the explicit waiver; no unchecked task remains.
- **Next recommended:** Formal SDD verify, not sync, archive, or publication.
