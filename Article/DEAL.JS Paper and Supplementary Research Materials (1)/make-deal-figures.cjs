const fs = require("node:fs");
const sharp = require("sharp");
const esc = s => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const C = {ink:"#172A35", muted:"#445B67", accent:"#01696F", pale:"#EDF6F5", line:"#8496A0"};
function text(x,y,label,size=20,weight=400,anchor="middle",fill=C.ink) {
  return `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" fill="${fill}">${esc(label)}</text>`;
}
function box(x,y,w,h,title,sub="",future=false) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="${future?"#FFFFFF":C.pale}" stroke="${C.accent}" stroke-width="1.8"${future?' stroke-dasharray="8 5"':""}/>`+
    text(x+w/2,y+(sub?35:h/2+7),title,21,600)+ (sub?text(x+w/2,y+63,sub,16,400,"middle",C.muted):"");
}
function arrow(x1,y1,x2,y2,dashed=false) {
  return `<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="${C.line}" stroke-width="2"${dashed?' stroke-dasharray="7 5"':""} marker-end="url(#a)"/>`;
}
function base(title,body,h=430) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${h}" viewBox="0 0 1200 ${h}" role="img"><title>${esc(title)}</title><rect width="1200" height="${h}" fill="white"/><defs><marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10" fill="${C.line}"/></marker></defs><g font-family="Arial, DejaVu Sans, sans-serif">${body}</g></svg>`;
}
async function save(name,svg) {
  fs.writeFileSync(name+".svg",svg);
  await sharp(Buffer.from(svg)).resize({width:2400}).png().toFile(name+".png");
}
async function main() {
  await save("deal-figure-1-review-boundary",base("DEAL as a reviewable artifact boundary, not an explanation of model internals",
    box(35,95,205,95,"Human intent","Task + constraints")+
    box(275,95,205,95,"AI proposal","Generation remains fallible")+
    box(515,95,270,95,"DEAL source","Shared review artifact")+
    box(820,95,345,95,"Target + execution","JavaScript + declared host")+
    arrow(240,143,275,143)+arrow(480,143,515,143)+arrow(785,143,820,143)+
    text(650,70,"inspect / edit / approve",18,600,"middle",C.accent)+
    text(991,70,"compile → test → execute",18,600,"middle",C.accent)+
    `<path d="M650 190V260H137V190" fill="none" stroke="${C.line}" stroke-width="2" marker-end="url(#a)"/>`+
    text(390,289,"Human review closes the loop",20,600)+
    text(600,352,"Proposed workflow: approval and test gates are not enforced by the current compiler.",18,400,"middle",C.muted),400));
  await save("deal-figure-2-compiler",base("Implemented DEAL.JS stage order and dependency side path",
    box(25,100,210,100,"Tokenizer","USE, RESERVE, casing")+
    box(260,100,210,100,"Preprocessor","Token pass-through")+
    box(495,100,210,100,"Parser","Tokens → flat nodes")+
    box(730,100,210,100,"Assembler","Hierarchy + lowering")+
    box(965,100,210,100,"Generator","JavaScript text")+
    arrow(235,150,260,150)+arrow(470,150,495,150)+arrow(705,150,730,150)+arrow(940,150,965,150)+
    text(130,62,"Mixed DEAL + JS source",18,600)+
    box(25,270,445,95,"Module resources","Compile; execute via configured stage")+
    `<path d="M130 200V270M470 317H600V200" fill="none" stroke="${C.line}" stroke-width="2" marker-end="url(#a)"/>`+
    text(845,294,"Compilation uses mutable command and reserve tables.",17,400,"middle",C.muted)+
    text(845,326,"Default execute stage is identity; host execution is separate.",17,400,"middle",C.muted)+
    text(600,414,"Observed architecture: tokenization precedes preprocessing; lowering is concentrated in the assembler.",18,400,"middle",C.muted),460));
  await save("deal-figure-3-data-pipeline",base("Controlled research extraction pipeline and current evidence boundary",
    box(25,95,210,100,"Retrieve","API or page snapshot")+
    box(260,95,210,100,"Extract","JSON fields / DOM rows")+
    box(495,95,210,100,"Normalize","Unicode + schema")+
    box(730,95,210,100,"Validate","Reject + deduplicate")+
    box(965,95,210,100,"Store","JSONL + provenance")+
    arrow(235,145,260,145)+arrow(470,145,495,145)+arrow(705,145,730,145)+arrow(940,145,965,145)+
    `<path d="M40 245H1160" fill="none" stroke="${C.line}" stroke-width="1"/>`+
    text(600,283,"Standalone JavaScript fixture: local Response → normalized records → JSONL; 17 assertions.",20,600)+
    text(600,326,"DEAL scraper integration remains illustrative: host bindings and several library bodies are incomplete.",18,400,"middle",C.muted)+
    text(600,366,"Provenance contract: source identifier, retrieval time, content hash, schema and module versions.",18,400,"middle",C.muted),410));
  await save("deal-figure-4-extension-contract",base("Vocabulary adaptation and future backend portability contracts",
    box(40,65,300,95,"Localized vocabulary","Spanish / French aliases",true)+
    box(445,65,310,95,"Canonical DEAL core","Stable structural meaning")+
    box(860,65,300,95,"JavaScript backend","Current implementation")+
    arrow(340,113,445,113,true)+arrow(755,113,860,113)+
    box(860,240,300,95,"Additional backends","Proposed; not implemented",true)+
    `<path d="M600 160V287H860" fill="none" stroke="${C.line}" stroke-width="2" stroke-dasharray="7 5" marker-end="url(#a)"/>`+
    text(40,265,"Required equivalence:",19,600,"start")+
    text(40,300,"same task-observable behavior",18,400,"start",C.muted)+
    text(600,390,"Solid outlines: current mechanism. Dashed outlines: proposed packaging or implementation.",18,400,"middle",C.muted),430));
}
main().catch(e => {console.error(e); process.exitCode=1;});
