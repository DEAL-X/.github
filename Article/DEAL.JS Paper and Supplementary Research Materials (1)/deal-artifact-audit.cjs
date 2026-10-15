const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const cp = require("child_process");
const acorn = require("acorn");
const root = path.resolve(process.argv[2] || "deal-js-review");
const dir = path.join(root, "Samples");
const sha = b => crypto.createHash("sha256").update(b).digest("hex");
function parse(code, sourceType) {
  try {
    const ast = acorn.parse(code, {ecmaVersion: 2022, sourceType, locations: true});
    return {valid: true, topLevelStatements: ast.body.length};
  } catch (e) {
    return {valid: false, message: e.message, line: e.loc?.line, column: e.loc?.column};
  }
}
function normalizedAst(code) {
  return JSON.stringify(acorn.parse(code, {ecmaVersion: 2022, sourceType: "module"}), (key, value) =>
    ["start", "end", "loc", "raw"].includes(key) ? undefined : value);
}
const pairs = ["DEAL Stress Test", "Complex Stress Test", "JavaScript Stress Test"].map(name => {
  const expected = fs.readFileSync(path.join(dir, `${name} - Expected.js`));
  const result = fs.readFileSync(path.join(dir, `${name} - Result.js`));
  return {name, byteEqual: expected.equals(result), structuralAstEqual: normalizedAst(expected.toString()) === normalizedAst(result.toString()), expectedSha256: sha(expected), resultSha256: sha(result),
    expectedParse: {script: parse(expected.toString(), "script"), module: parse(expected.toString(), "module")},
    resultParse: {script: parse(result.toString(), "script"), module: parse(result.toString(), "module")}};
});
// Execute only this isolated, hand-transcribed comparator, never repository programs.
const comparator = (a,b)=>(a,b)=>a.k>b.k?1:a.k==b.k?0:-1;
const sorted = [{k: 3}, {k: 1}, {k: 2}].sort(comparator).map(x => x.k);
const jsSource = fs.readFileSync(path.join(dir, "JavaScript Stress Test.djs"), "utf8");
const jsResult = fs.readFileSync(path.join(dir, "JavaScript Stress Test - Result.js"), "utf8");
const report = {
  auditKind: "stored-artifact inspection; not compiler execution or a conformance benchmark",
  timestamp: new Date().toISOString(),
  commit: cp.execFileSync("git", ["-C", root, "rev-parse", "HEAD"], {encoding: "utf8"}).trim(),
  node: process.version,
  acorn: require("acorn/package.json").version,
  grammar: "ECMAScript 2022, script and module modes, no permissive parser flags",
  pairs,
  totals: {
    pairs: pairs.length,
    byteEqualPairs: pairs.filter(x => x.byteEqual).length,
    structuralAstEqualPairs: pairs.filter(x => x.structuralAstEqual).length,
    resultScriptParseable: pairs.filter(x => x.resultParse.script.valid).length,
    resultModuleParseable: pairs.filter(x => x.resultParse.module.valid).length
  },
  focusedChecks: {
    comparatorProbe: {input: [3,1,2], actual: sorted, desired: [1,2,3], matchesDesired: JSON.stringify(sorted) === "[1,2,3]", comparatorReturnType: typeof comparator({k:3},{k:1})},
    escapeArtifact: {sourceHasEscapedLineBreak: jsSource.includes('"line\\nbreak"'), resultHasLiteralLetterN: jsResult.includes('"linenbreak"')},
    destructuringProbe: {
      expected: (() => {const values = [10,20,30]; const [,,third] = values; return third;})(),
      result: (() => {const values = [10,20,30]; const [third] = values; return third;})(),
      note: "isolated execution of the two stored declaration forms, not fresh compilation"
    },
    compilerRun: "not performed: no dotnet or mono executable available",
    fullStoredProgramExecution: "not performed: mixed host requirements, external side effects, and intentionally broad stress fixtures"
  }
};
fs.writeFileSync("deal-artifact-audit.json", JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
