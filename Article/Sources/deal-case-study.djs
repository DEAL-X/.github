// Single-page catalog workflow for DEAL.JS and the scraper library.
// Configure module paths and output permissions, then replace the example
// endpoint with the authorized source used by the research application.
USE deal;
USE scraper;
USE deal/data/local;
USE "./deal-case-helpers.js";

COMMAND cleanRecords(rows = [], source = "", time = "") {
    return normalizeRecords(rows, source, time);
}

ASSUME CONST sourceURL IS "https://example.org/catalog";
ASSUME CONST destination IS "results/catalog.jsonl";

LOAD sourceURL,
THEN BEGIN
    ASSUME CONST capturedAt IS new Date().toISOString();
    ASSUME CONST rawRows IS extractRows(DOCUMENT, sourceURL);
    ASSUME CONST report IS cleanRecords(rawRows, sourceURL, capturedAt);
    local.save(toJSONL(report.accepted), destination);
    local.save(JSON.stringify(report.rejected), "results/rejected.json");
END;
OTHERWISE BEGIN
    throw new Error("Retrieval failed: " + sourceURL);
END;
