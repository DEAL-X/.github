// Standalone reference fixture, NOT output from the DEAL.JS compiler.
// No network calls and no repository or user files are modified.
const assert = require("node:assert/strict");
const fs = require("node:fs");
function normalize(row) {
  if (!row || row.id == null || typeof row.title !== "string") return null;
  const id = String(row.id).trim();
  const title = row.title.normalize("NFKC").replace(/\s+/gu, " ").trim();
  if (!id || !title || row.price == null || String(row.price).trim() === "") return null;
  const price = Number(row.price);
  if (!Number.isFinite(price) || price < 0) return null;
  return {id, title, price};
}
function processRows(rows) {
  const seen = new Set();
  const accepted = [];
  const rejected = [];
  rows.forEach((row, sourceRow) => {
    const record = normalize(row);
    if (!record) rejected.push({sourceRow, reason: "invalid"});
    else if (seen.has(record.id)) rejected.push({sourceRow, reason: "duplicate"});
    else {seen.add(record.id); accepted.push(record);}
  });
  return {accepted, rejected};
}
async function retrieveFixture() {
  // Response.json() is awaited, unlike the illustrative repository tutorial.
  const response = new Response(JSON.stringify([
    {id:"p1", title:"  Alpha   study ", price:"12.50"},
    {id:"p2", title:"Ｂｅｔａ", price:0},
    {id:"p1", title:"Duplicate", price:20},
    {id:"p3", title:"Bad", price:""},
    {id:"p4", title:"Bad", price:-1}
  ]), {status: 200, headers: {"content-type": "application/json"}});
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
async function main() {
  const checks = [];
  const check = (name, fn) => {fn(); checks.push({name, passed: true});};
  check("whitespace", () => assert.equal(normalize({id:"a",title:" A  B ",price:1}).title,"A B"));
  check("unicode NFKC", () => assert.equal(normalize({id:"a",title:"Ｂｅｔａ",price:1}).title,"Beta"));
  check("zero retained", () => assert.equal(normalize({id:"a",title:"A",price:0}).price,0));
  check("numeric string", () => assert.equal(normalize({id:"a",title:"A",price:"12.5"}).price,12.5));
  for (const value of [null, "", "  ", -1, "NaN", Infinity]) {
    check(`reject price ${String(value)}`, () => assert.equal(normalize({id:"a",title:"A",price:value}),null));
  }
  check("missing id", () => assert.equal(normalize({title:"A",price:1}),null));
  check("empty title", () => assert.equal(normalize({id:"a",title:" ",price:1}),null));
  check("null row", () => assert.equal(normalize(null),null));
  const data = processRows(await retrieveFixture());
  check("two accepted", () => assert.equal(data.accepted.length,2));
  check("three rejected", () => assert.equal(data.rejected.length,3));
  check("duplicate reason", () => assert.equal(data.rejected[0].reason,"duplicate"));
  check("JSONL round trip", () => {
    const jsonl = data.accepted.map(JSON.stringify).join("\n") + "\n";
    assert.deepEqual(jsonl.trim().split("\n").map(line => JSON.parse(line)),data.accepted);
  });
  fs.writeFileSync("deal-reference-records.jsonl", data.accepted.map(JSON.stringify).join("\n") + "\n");
  const report = {kind: "standalone JavaScript reference fixture; no DEAL compilation", node: process.version,
    checks, total: checks.length, passed: checks.length, data};
  fs.writeFileSync("deal-reference-pipeline-results.json",JSON.stringify(report,null,2)+"\n");
  console.log(JSON.stringify(report,null,2));
}
if (require.main === module) main().catch(e => {console.error(e); process.exitCode = 1;});
module.exports = {normalize, processRows};
