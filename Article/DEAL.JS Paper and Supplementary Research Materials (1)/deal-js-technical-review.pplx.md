# DEAL.JS Technical Review and Journal-Submission Readiness

This companion review explains the evidence behind the manuscript and prioritizes work before submission. It distinguishes a promising research contribution from capabilities that the inspected prototype has not yet demonstrated.

## Review scope

The review uses DEAL-JS commit `b85569e1e87428b73b568ffbaa92ef84dc61f1d1`, Engine commit `32431a3ae47367837f195b43767b408cf1788530`, and Environment commit `4a38cf748b4f9040ab3b6d596d495c8883322c4f` ([DEAL-JS](https://github.com/DEAL-X/DEAL-JS); [Engine](https://github.com/DEAL-X/Engine); [Environment](https://github.com/DEAL-X/Environment)). The primary language README, tutorial, library files, 12 compiler/JavaScript stage files, sample families and expected/result artifacts, project configuration, supporting READMEs, generic engine, host integration, and inherited article draft informed the assessment.

Build-output copies and binaries are not independent implementations. No repository was edited, no external content was published, and no live scraping was performed.

## Main editorial recommendation

Frame the work as an inspectable programming representation for human–AI research workflows. Do not frame it as a method that explains the internal computation of neural networks: model transparency and the inspectability of generated programs are distinct claims, consistent with [Lipton's analysis of interpretability](https://vis.csail.mit.edu/classes/6.859/readings/pdfs/Lipton-TheMythosOfModelInterpretability.pdf).

The strongest defensible novelty is a specific integration and its eventual evaluation. English-like web commands and JavaScript integration already appear in [_hyperscript](https://hyperscript.org/), extensible syntax libraries in [SugarJ](https://www.pl.informatik.uni-mainz.de/files/2019/04/sugarj.pdf), and web retrieval/extraction pipelines in [WebL](https://www.ra.ethz.ch/cdstore/www7/1832/com1832.htm).

The manuscript is a substantial working draft, not a submission-ready empirical paper. A target journal's quartile, subject category, ranking year, article type, and scope must be checked when choosing a venue; no acceptance or Q1 classification is assumed here.

## Findings that block strong correctness or reliability claims

### Translation and execution semantics

| Priority | Finding | Evidence and scope | Recommended acceptance test |
|---|---|---|---|
| **Critical** | Sorting comparator returns a function | `ORDER` builds `(a,b)=>(a,b)=>...` in the [assembler](https://github.com/DEAL-X/DEAL-JS/blob/b85569e1e87428b73b568ffbaa92ef84dc61f1d1/DEAL.JS/Assembler.cs); isolated execution leaves `[3,1,2]` unsorted | Correct numeric comparator; numeric/string/null cases; explicit multi-key priority; stability and mutation contract |
| **Critical** | String escapes are not preserved in the stored example | Source `"line\nbreak"` becomes result `"linenbreak"`; tokenizer consumes escape introducers ([source and samples](https://github.com/DEAL-X/DEAL-JS)) | Fresh compile-and-execute tests for `\n`, `\t`, quotes, backslashes, Unicode escapes and templates |
| **Critical** | Sparse destructuring differs | Expected `[, , third]` versus result `[third]` ([samples](https://github.com/DEAL-X/DEAL-JS)); isolated evaluation returns 30 versus 10 | Preserve elisions; distinguish optional separators from semantic empty array slots |
| **High** | Case adaptation discrepancy | Stored DEAL expected/result pair differs in `testE`/`teste` ([samples](https://github.com/DEAL-X/DEAL-JS)) | Table-driven resolution tests across definition, first use, subsequent case variations and dotted properties |
| **High** | Some actions create undeclared assignments | Heading-style actions lower to assignment plus invocation ([README and implementation](https://github.com/DEAL-X/DEAL-JS)) | Define declaration/scope contract; test browser scripts and strict modules separately |
| **High** | Asynchronous completion is not explicit in illustrative scrape loops | Stored outputs launch promise callbacks without an aggregate completion barrier ([samples](https://github.com/DEAL-X/DEAL-JS)) | Ordered mock events; return/await chains; rejected requests; nested JSON parsing; completion before final logging |
| **High** | Promise terminology overstates threading | README categorizes promises as “Threadings” ([README](https://github.com/DEAL-X/DEAL-JS)) | Replace with asynchronous composition; document promise executor resolution/rejection |
| **Medium** | `LIMIT` contract is unclear | README names offset/count while showing `.slice(number, count)` ([README](https://github.com/DEAL-X/DEAL-JS)) | Define offset/end or offset/count, negative values and omitted arguments, then test all boundaries |
| **Medium** | `DISTINCT` lowering needs review | Assembler expression refers to `self`/`index` without clearly supplying a complete callback parameter contract ([assembler](https://github.com/DEAL-X/DEAL-JS/blob/b85569e1e87428b73b568ffbaa92ef84dc61f1d1/DEAL.JS/Assembler.cs)) | Fresh compilation of scalar/object duplicates; equality policy; callback scope |

These are specific findings, not a general verdict that the language design is invalid. Stored mismatches must be reproduced against a clean build before attributing every discrepancy to the current compiler.

### Library and host completeness

The selector commands `all`, `any`, and `one` have incomplete bodies, and transfer commands do not implement a complete retrieval contract in the inspected primary library ([library source](https://github.com/DEAL-X/DEAL-JS)). `collect` returns `arguments`, `select` has only a partial body, and `handle` does not establish all documented workspace identifiers ([library source](https://github.com/DEAL-X/DEAL-JS)). The paper therefore treats scraping as an intended integration rather than a validated end-to-end capability.

The main tutorial and both Markdown sample variants explicitly warn that they are not executable ([tutorials](https://github.com/DEAL-X/DEAL-JS)). Their market URLs, retry logic, browser bindings, resource dialogs, and storage behavior should not appear as working research results.

The long tutorial's retry counter is initialized within the re-invoked action and its retry condition requires review; its nominal daily delay uses `24 * 60 * 60 * 10000` ([tutorial](https://github.com/DEAL-X/DEAL-JS)). If the intended unit is milliseconds, the factor should be 1000 for 24 hours, but the runtime's actual wait contract must first be specified.

The Environment source configures ClearScript V8 and exposes host functions and the compiler object; its project references a Windows x86 native package and sibling project paths ([Environment](https://github.com/DEAL-X/Environment)). A clean clone is not yet evidence of cross-platform, standalone deployment, and the host's exposed capabilities should be reviewed before executing untrusted AI-generated code.

### Modules, state, and diagnostics

| Priority | Finding | Evidence | Recommended action |
|---|---|---|---|
| **High** | Inclusion can invoke configured execution | `UseDependency` calls `Execute(input)` before recording the dependency ([generic engine](https://github.com/DEAL-X/Engine/blob/32431a3ae47367837f195b43767b408cf1788530/Engine/Engine.cs)) | Separate compile-only dependency processing from execution; disclose side effects |
| **High** | Cycle protection needs testing | Dependency path is recorded after nested compilation/execution ([generic engine](https://github.com/DEAL-X/Engine/blob/32431a3ae47367837f195b43767b408cf1788530/Engine/Engine.cs)) | Track “resolving” and “resolved” states; reject cyclic imports with a path trace |
| **High** | Folder order may affect vocabulary | Inclusion enumerates provider results without an explicit ordering in the inspected path ([tokenizer](https://github.com/DEAL-X/DEAL-JS/blob/b85569e1e87428b73b568ffbaa92ef84dc61f1d1/DEAL.JS/Tokenizer.cs)) | Stable import order; explicit entry-point manifests; collision policy |
| **High** | Compiler state persists | Commands, reserves, tokenizer switches and dependencies are mutable instance state ([DEAL-JS](https://github.com/DEAL-X/DEAL-JS); [Engine](https://github.com/DEAL-X/Engine)) | Fresh-engine reproducibility first; explicit reset/session contract; concurrent-use tests |
| **Medium** | URL module loading is not implemented in this path | `UseUrl` returns zero ([tokenizer](https://github.com/DEAL-X/DEAL-JS/blob/b85569e1e87428b73b568ffbaa92ef84dc61f1d1/DEAL.JS/Tokenizer.cs)) | Document unsupported behavior or implement pinned, allowlisted remote resources |
| **Medium** | Several error paths suppress details | Module and reserve handling includes silent catches; missing modules may produce comments ([tokenizer](https://github.com/DEAL-X/DEAL-JS/blob/b85569e1e87428b73b568ffbaa92ef84dc61f1d1/DEAL.JS/Tokenizer.cs)) | Structured error/warning codes, source locations, missing-module failure policy |
| **Medium** | Options are not implementation evidence | Options include source-map/optimization flags, but declaring an option does not show it is implemented ([Engine](https://github.com/DEAL-X/Engine)) | Document effective options; test observable effects; do not claim an optimizer or source maps prematurely |

## What was actually tested

The audit script used Node.js v20.20.2 and Acorn 8.16.0 with ECMAScript 2022 grammar. Full sample programs were not executed, because they contain mixed host requirements and potentially external effects.

| Check | Result | Interpretation |
|---|---:|---|
| Expected/result byte matches | 0/3 | Includes harmless layout differences |
| Normalized AST matches | 1/3 | Complex pair matches structurally; DEAL and JavaScript pairs do not |
| Result parses in script mode | 2/3 | Complex sample includes top-level await |
| Result parses in module mode | 3/3 | Syntax only; not successful module execution |
| Isolated sort probe | Fails intended ascending order | Tests copied comparator expression, not compiler regeneration |
| Isolated destructuring probe | 30 versus 10 | Confirms different behavior of the stored forms |
| Standalone reference-pipeline assertions | 17/17 | Tests newly authored JavaScript only |
| Fresh C# compiler execution | Not performed | No `dotnet` or `mono` executable available |
| Human/AI/localization studies | Not performed | Prospective protocols appear in the manuscript |

No pass rate from this small inspection should be extrapolated to language correctness. In particular, “three files parse” must not be rewritten as “the compiler passes all tests.”

## Reproduction instructions

The following commands inspect pinned source and run only the two accompanying local scripts. They do not execute repository programs or perform network scraping.

```sh
git clone https://github.com/DEAL-X/DEAL-JS.git deal-js-review
git -C deal-js-review checkout b85569e1e87428b73b568ffbaa92ef84dc61f1d1
npm install --no-save acorn@8.16.0
node deal-artifact-audit.cjs ./deal-js-review
node deal-research-pipeline.cjs
```

The audit produces `deal-artifact-audit.json`, including per-file SHA-256 hashes and parser outcomes. The reference program produces `deal-reference-pipeline-results.json` and `deal-reference-records.jsonl`; timestamps in the audit metadata will differ on rerun, while the pinned artifact hashes should match.

For fresh compiler validation, obtain the correct .NET SDK, arrange sibling projects or replace brittle project references with documented references, publish a clean CLI runner, and pin the generic engine commit. Do not rely on committed binaries as a substitute for a reproducible build.

## Manuscript contribution and claim register

| Claim | Current status | Evidence required before strengthening |
|---|---|---|
| Constrained English-like structures and staged compiler exist | Supported by source and documentation ([DEAL-JS](https://github.com/DEAL-X/DEAL-JS)) | Clean build and per-construction behavior tests |
| Vocabulary replacement and noise-word mechanisms exist | Supported by tokenizer source ([tokenizer](https://github.com/DEAL-X/DEAL-JS/blob/b85569e1e87428b73b568ffbaa92ef84dc61f1d1/DEAL.JS/Tokenizer.cs)) | Collision, quote protection, termination and equivalence tests |
| Human readability is improved | Hypothesis | Counterbalanced comprehension and defect-detection experiment |
| AI generates more correct DEAL than JavaScript | Hypothesis | Matched end-to-end benchmark with equal budgets and libraries |
| Compilation is deterministic across environments | Not established | Fresh-state, pinned-module, cross-platform repeated-build hashes |
| Full JavaScript interoperation is preserved | Not established; counterexamples need reproduction | Supported-subset specification and differential execution |
| Scraper integration is complete | Not established by current tutorial/library ([project](https://github.com/DEAL-X/DEAL-JS)) | Implemented adapters and snapshot-driven integration tests |
| Spanish/French support is validated | Proposed | Locale packages, native-speaker review, canonical and behavioral equivalence |
| Other target languages are implemented | Proposed | At least one additional backend and cross-target tests |
| DEAL solves neural-network opacity | Not supported and not the project's demonstrated scope | Remove; replace with program-artifact inspectability |
| DEAL is the first English-like extensible language | Not defensible from this review | Do not claim; discuss prior systems explicitly |

## Recommended revision sequence

- **Correct the semantic foundation:** Fix escape preservation, destructuring, casing and sorting; define strict/module execution and async completion contracts.
- **Publish a reproducible artifact:** Provide a clean CLI build, pinned source dependencies, test runner, fixtures, diagnostics, supported subset and license-aware artifact packaging.
- **Complete a bounded application:** Implement one real scraper adapter and one storage adapter, then evaluate local snapshots with explicit extraction and provenance oracles.
- **Measure human oversight:** Prioritize comprehension, defect detection and false approval over subjective readability ratings.
- **Measure AI generation fairly:** Compare direct JavaScript, JavaScript with identical domain APIs, DEAL, and an appropriate constrained baseline.
- **Validate extension claims:** Add one complete locale package and one additional backend only after canonical semantics are stable.
- **Choose a journal and article type:** Align claims and length with the target's scope and current author guidelines; verify the relevant quartile category and year separately.

## Author and submission checks

The supplied article lists Mohammad Fathi, Mehrdad CheshmeSohrabi, Ahmad Shabani and Ali Mansouri, but also repeats an ORCID for two different authors. Confirm the author list, order, affiliations, corresponding author and identifiers rather than copying this inconsistency into a submission.

Supply truthful funding, conflicts, contributor roles, ethics approval or exemption, and AI-assistance disclosures. The working manuscript intentionally does not fabricate these declarations or populate empirical results that have not been collected.

The manuscript contains inline author-linked scientific citations, with a companion BibTeX file for reference-manager import. Apply the selected journal's citation style after choosing the venue, and verify every reference against the original publication during author review.
