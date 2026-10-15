# DEAL.JS Paper: Supplementary Materials

This package accompanies “DEAL.JS: A Constrained, Extensible Programming Layer for Inspectable Human–AI Research Workflows.” It contains the editable manuscript, four original technical figures, a technical review, literature metadata, and reproducible bounded checks.

## Contents and status

- **Manuscript:** `deal-js-academic-paper.pplx.md` and the editable Word version. Revised with numbered in-text citations and a complete end bibliography. Design and artifact-inspection draft, not a completed human or AI evaluation.
- **Technical review:** `deal-js-technical-review.pplx.md`. Findings, claim register, fixes and submission prerequisites.
- **Figure assets:** Four editable `.svg` files and corresponding 2400-pixel-wide `.png` files. Figures are original diagrams, not experimental performance charts.
- **Artifact audit:** `deal-artifact-audit.cjs` and `deal-artifact-audit.json`. Committed output comparisons and isolated behavioral probes; no C# compilation.
- **Reference fixture:** `deal-research-pipeline.cjs`, `deal-reference-pipeline-results.json`, and `deal-reference-records.jsonl`. Independent synthetic-data JavaScript fixture; no DEAL compilation or web scraping.
- **Literature metadata:** `deal-js-literature.bib`. All 23 cited records: 14 scholarly publications/preprints, three official documentation records, and six software/source-code records.
- **Citation map:** `deal-js-citation-map.json`. Crosswalk between the manuscript's numbered citations, bibliographic keys, titles, and URLs.
- **Figure generator:** `make-deal-figures.cjs`. Rebuilds SVG and PNG figures using Node.js and `sharp`.

## Evidence boundary

The primary source snapshot is commit `b85569e1e87428b73b568ffbaa92ef84dc61f1d1` in the [DEAL-JS repository](https://github.com/DEAL-X/DEAL-JS). Source code and committed binaries from upstream repositories are not redistributed in this package.

Audit results are small-sample observations, not general compiler pass rates. The data-processing assertions test the supplementary reference fixture only, and no participant results, model benchmarks, locale validation or additional backends were invented.

## Re-run the checks

Use Node.js 20.20.2 or record your alternative version, install `acorn@8.16.0`, and obtain the pinned repository snapshot. Then run the commands below from this package's directory; the scripts overwrite only their own named local output files.

```sh
node deal-artifact-audit.cjs /path/to/DEAL-JS
node deal-research-pipeline.cjs
```

For figures, install `sharp`, then run `node make-deal-figures.cjs`. The figure generator does not require upstream project code or any external image download.
