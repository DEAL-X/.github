// Author-defined research-case helpers, not built-in DEAL commands.
// Plain JavaScript is intentional: the DEAL orchestration imports these helpers.
function extractRows(doc, sourceURL) {
  return Array.from(doc.querySelectorAll("table.catalog tbody tr")).map(row => ({
    id: row.getAttribute("data-id"),
    title: row.querySelector(".title")?.textContent ?? "",
    main_price: row.querySelector(".price")?.textContent ?? null,
    discount: row.querySelector(".discount")?.textContent ?? null,
    quantity: row.querySelector(".quantity")?.textContent ?? null,
    source_url: sourceURL
  }));
}

function normalizeRecords(rows, sourceURL, retrievedAt) {
  const accepted = [], rejected = [], seen = new Set();
  const numeric = value => value == null || String(value).trim() === ""
    ? NaN : Number(value);
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const id = String(row?.id ?? "").trim();
    const title = String(row?.title ?? "").normalize("NFKC")
      .replace(/\s+/gu, " ").trim();
    const mainPrice = numeric(row?.main_price);
    const discount = numeric(row?.discount);
    const quantity = numeric(row?.quantity);
    const valid = id && title && Number.isFinite(mainPrice) && mainPrice >= 0
      && Number.isFinite(discount) && discount >= 0 && discount <= 1
      && Number.isSafeInteger(quantity) && quantity >= 0;
    if (!valid) { rejected.push({ source_row: i + 1, reason: "invalid" }); continue; }
    if (seen.has(id)) { rejected.push({ source_row: i + 1, reason: "duplicate" }); continue; }
    seen.add(id);
    accepted.push({
      id, title,
      main_price: mainPrice,
      discount,
      net_price: Math.round(mainPrice * (1 - discount) * 100) / 100,
      quantity,
      source_url: sourceURL,
      retrieved_at: retrievedAt,
      schema_version: "deal-paper-example/1"
    });
  }
  return { accepted, rejected };
}

function toJSONL(records) {
  return records.map(record => JSON.stringify(record)).join("\n")
    + (records.length ? "\n" : "");
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { extractRows, normalizeRecords, toJSONL };
}
