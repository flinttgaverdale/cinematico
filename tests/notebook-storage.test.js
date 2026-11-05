const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const html=fs.readFileSync(path.join(__dirname,"..","index.html"),"utf8");
const start=html.indexOf("function readNotebook()"),end=html.indexOf("function saved()",start);
assert.ok(start>=0&&end>start,"Notebook helper functions must be present");
const helpers=html.slice(start,end);
function load(raw,blocked=false){
 const notices=[],writes=[];
 const context={localStorage:{getItem(){return raw},setItem(key,value){if(blocked)throw Error("storage blocked");writes.push({key,value})}},toast:msg=>notices.push(msg)};
 vm.runInNewContext(helpers,context);
 return {context,notices,writes};
}
for(const raw of ["{bad", "{}", "null", "42", '"string"']){
 const {context}=load(raw);
 assert.equal(context.readNotebook().length,0,"Malformed notebook should safely become empty: "+raw);
}
const {context}=load('[null,1,{"title":"A"},{"title":"B"}]');
assert.deepEqual(Array.from(context.readNotebook().map(x=>x.title)),["A","B"]);
assert.equal(context.writeNotebook([{title:"OK"}]),true);
const blocked=load("[]",true);
assert.equal(blocked.context.writeNotebook([{title:"Not saved"}]),false);
assert.equal(blocked.notices.length,1,"A blocked save must show an error");
console.log("Notebook storage edge cases passed");
