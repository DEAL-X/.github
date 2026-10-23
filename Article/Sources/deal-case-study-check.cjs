// Bounded companion check: JavaScript data contract and current ChainDoc library.
// Does not execute the DEAL compiler, browser scraper or DEAL local adapter.
const fs = require("node:fs");
const assert = require("node:assert/strict");
const path = require("node:path");
const { normalizeRecords, toJSONL, extractRows } = require("./deal-case-helpers.js");
const root = path.resolve(process.argv[2] || "deal-js-review");
const { ChainedDocument } = require(path.join(root, "Library/node/ChainDoc/ChainedDocument.js"));
const { MemoryConnector } = require(path.join(root, "Library/node/ChainDoc/Connector/ConnectorBase.js"));
const fixture = [
  { id: " p1 ", title: "  Alpha   study ", main_price: "100", discount: "0.10", quantity: "2" },
  { id: "p1", title: "Duplicate", main_price: "100", discount: "0.10", quantity: "2" },
  { id: "p2", title: "Ｂeta study", main_price: "0", discount: "0", quantity: "0" },
  { id: "p3", title: "Missing price", main_price: null, discount: "0", quantity: "1" },
  { id: "p4", title: "Bad discount", main_price: "10", discount: "1.25", quantity: "1" }
];
const source = "https://example.org/catalog";
const timestamp = "2026-10-19T00:00:00.000Z"; // Fixed synthetic timestamp, not retrieval evidence.
const result = normalizeRecords(fixture, source, timestamp);
const checks = [];
function check(name, fn) { fn(); checks.push({ name, passed: true }); }
check("two accepted rows", () => assert.equal(result.accepted.length, 2));
check("three rejected rows", () => assert.equal(result.rejected.length, 3));
check("ID whitespace", () => assert.equal(result.accepted[0].id, "p1"));
check("title whitespace", () => assert.equal(result.accepted[0].title, "Alpha study"));
check("Unicode normalization", () => assert.equal(result.accepted[1].title, "Beta study"));
check("discount arithmetic", () => assert.equal(result.accepted[0].net_price, 90));
check("zero price preserved", () => assert.equal(result.accepted[1].net_price, 0));
check("zero quantity preserved", () => assert.equal(result.accepted[1].quantity, 0));
check("duplicate classified", () => assert.equal(result.rejected[0].reason, "duplicate"));
check("null price rejected", () => assert.equal(result.rejected[1].reason, "invalid"));
check("out of range discount rejected", () => assert.equal(result.rejected[2].reason, "invalid"));
check("provenance", () => assert.equal(result.accepted[0].source_url, source));
check("fixed fixture timestamp", () => assert.equal(result.accepted[0].retrieved_at, timestamp));
check("schema version", () => assert.equal(result.accepted[0].schema_version, "deal-paper-example/1"));
const jsonl = toJSONL(result.accepted);
check("JSONL round trip", () => assert.deepEqual(jsonl.trim().split("\n").map(JSON.parse), result.accepted));
check("empty JSONL", () => assert.equal(toJSONL([]), ""));
const connector = new MemoryConnector();
const doc = new ChainedDocument("catalog.jsonl", { connector });
doc.writeText(jsonl);
check("ChainDoc memory persistence", () => assert.equal(connector.readText("catalog.jsonl"), jsonl));
check("ChainDoc stored line count", () => assert.equal([...doc.readLines()].length, 2));
// A small DOM-shaped double exercises selector-to-field wiring without a browser.
const fields = { ".title": "Alpha study", ".price": "100", ".discount": "0.10", ".quantity": "2" };
const row = { getAttribute: key => key === "data-id" ? "p1" : null,
  querySelector: selector => fields[selector] == null ? null : { textContent: fields[selector] } };
const documentDouble = { querySelectorAll: selector => {
  assert.equal(selector, "table.catalog tbody tr");
  return [row];
}};
check("selector adapter wiring with test double", () => assert.deepEqual(
  extractRows(documentDouble, source)[0],
  { id: "p1", title: "Alpha study", main_price: "100", discount: "0.10", quantity: "2", source_url: source }));
const report = {
  scope: "Author-written JavaScript helpers, a DOM-shaped double, and current ChainDoc MemoryConnector only; no DEAL compilation or live scraping",
  node: process.version, checks, passed: checks.length, total: checks.length,
  fixture, result
};
fs.writeFileSync("deal-case-study-results.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync("deal-case-study-output.jsonl", jsonl);
console.log(JSON.stringify({ passed: checks.length, total: checks.length, accepted: result.accepted.length,
  rejected: result.rejected.length, scope: report.scope }, null, 2));
