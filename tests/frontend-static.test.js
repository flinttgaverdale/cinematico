// Syntax and static UI wiring smoke tests; no browser substitute.
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const html=fs.readFileSync(path.join(__dirname,"..","index.html"),"utf8");
const inline=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(x=>x.trim());
assert.ok(inline.length>0,"Expected an inline application script");
for(const script of inline)assert.doesNotThrow(()=>new vm.Script(script),"Inline script must parse");
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(ids.length,new Set(ids).size,"Duplicate element IDs");
for(const id of ["quickKey","guideToggle","guideSteps","labVoiceCount","labVoiceStyle","techCards","userAlternatives"])
 assert.ok(ids.includes(id),"Missing UI element "+id);
assert.ok(html.includes('id="guideSteps" hidden'),"Guide should be collapsed initially");
assert.ok(html.includes('guideToggle").onclick'),"Guide must have a toggle handler");
assert.ok(html.includes('name="viewport"'),"Mobile viewport required");
assert.ok(html.includes(":focus-visible"),"Visible keyboard focus required");
console.log("Frontend inline JavaScript syntax and static wiring passed");

assert.ok(html.includes("function readNotebook()"),"Notebook must tolerate corrupt storage");
assert.ok(html.includes("Array.isArray(value)"),"Notebook must reject non-array storage");
assert.ok(html.includes("function writeNotebook(items)"),"Notebook writes must handle unavailable storage");
assert.ok(html.includes("if(writeNotebook(a)){saved();toast"),"Do not announce a save when persistence fails");
