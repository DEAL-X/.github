# DEAL.JS: Supplementary Research Materials

This package accompanies “DEAL.JS: An extensible language for inspectable human–AI research programming.” It contains the editable article, seven technical diagrams, bibliographic metadata, and a reproducible catalog-data case. The manuscript is prepared for Information and Software Technology.

## Research materials

- **Manuscript:** `deal-js-academic-paper.docx` is the editable Word article; `deal-js-academic-paper.pplx.md` is its Markdown source.
- **Technical figures:** Seven numbered diagrams are provided in editable SVG and high-resolution PNG formats. `make-deal-figures.cjs` generates them with Node.js and `sharp`.
- **References:** `deal-js-literature.bib` and `.json` contain the reference library; `deal-js-citation-map.json` maps the article's numbered citations.
- **Workflow:** `deal-case-study.djs` expresses acquisition, normalization, validation, and persistence through DEAL.JS and the scraper library.
- **Domain functions:** `deal-case-helpers.js` implements field extraction, normalization, validation, deduplication, and JSONL serialization.
- **Functional validation:** `deal-case-study-check.cjs`, `deal-case-study-results.json`, and `deal-case-study-output.jsonl` provide assertions and their recorded outcomes.
- **Journal highlights:** `deal-ist-highlights.docx` and `.md` contain five separately editable highlights.

Preparation notes and internal source-management records are not part of the scientific supplement. The original background documents are not redistributed.

## Implementation versions

To repeat the component check, obtain the language implementation at the specified version. Compiler-framework and host versions identify the corresponding architecture described by the article.

| Component | Source | Version |
|---|---|---|
| DEAL.JS | [Language implementation](https://github.com/DEAL-X/DEAL-JS) | `d76dcae3bf157e3969be0bd1f98ed2522defc2b9` |
| Engine | [Compiler framework](https://github.com/DEAL-X/Engine) | `8800695b1bbe6274f71f581473943ff7943d5036` |
| Environment | [Execution host](https://github.com/DEAL-X/Environment) | `9ef64b9ae94e1017273f9780a4466973b4d5747d` |

The language's `Samples` directory supplies DEAL, JavaScript, and mixed-source stress examples relevant to the conformance categories in Table 7. They are implementation resources rather than reported pass-rate measurements.

## Repeat the functional assertions

The recorded runtime is Node.js 20.20.2. From this package's directory, run:

```sh
node deal-case-study-check.cjs /absolute/path/to/DEAL-JS
```

The check executes 19 assertions over five synthetic records, the domain functions, a document-shaped test double, and the `ChainDoc` in-memory connector. It produces two accepted records and three rejections. It does not execute the DEAL compiler, browser, network acquisition, or local filesystem resource adapter, and it is not a participant or comparative AI experiment.

The script writes `deal-case-study-results.json` and `deal-case-study-output.jsonl` in the current directory. The fixed timestamp belongs to the synthetic fixture and is not evidence of an acquisition event.

## Deploy the DEAL workflow

Configure the DEAL.JS runtime and scraper library, including module resolution for `deal`, `scraper`, `deal/data/local`, and the adjacent domain-functions module. Replace the example endpoint with an authorized catalog source. The extraction function expects `table.catalog tbody tr`, a `data-id` attribute, and `.title`, `.price`, `.discount`, and `.quantity` fields.

The local adapter exposes `local.save(contents, path)`. Observe the complete promise chain before treating a workflow as finished; multi-page execution needs sequential completion or isolated contexts with explicit aggregation. Acquisition logs and raw source snapshots should accompany a live research deployment.

## Publication declarations

The manuscript retains explicit fields for author contributions, funding, competing interests, acknowledgements, and a persistent research-package identifier. AI assistance is disclosed in the manuscript and figure captions. Authors must verify the scientific content and resolve the journal-specific artwork requirements before submission; no submission or persistent public deposit is claimed.
