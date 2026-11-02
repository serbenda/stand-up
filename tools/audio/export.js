// Extrae todos los textos que la web reproduce y les da la misma clave que usa app.js
const path = process.argv[2] || require("path").resolve(__dirname, "../..");
global.window = {};
require(path + "/js/content.js");
require(path + "/js/terms.js");
require(path + "/js/tools-data.js");
require(path + "/js/cheats.js");
require(path + "/js/daily-guide.js");
require(path + "/js/chat.js");
const hash = s => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); };
const MALE = new Set(["Mike", "Tom"]);
const out = new Map();
const add = (text, role = "narrator", say) => {
  const t = text.trim(); if (!t) return;
  const key = hash(t);
  if (!out.has(key)) out.set(key, { key, text: t, say: (say || t).trim(), role });
};
for (const r of window.ROUTES) for (const u of r.units) for (const l of u.lessons) {
  l.items.forEach(it => add(it.say || it.en));
  if (l.scene) {
    add(l.scene.text, MALE.has(l.scene.who) ? "male" : "female");
    l.scene.options.forEach(o => add(o.en));
  }
}
window.TERMS.forEach(t => add(t.say || t.term, "narrator"));
window.CHEATS.forEach(c => c.items.forEach(it => add(it.say || it.en)));
(window.DAILY_GUIDE || []).forEach(p => p.phrases.forEach(ph => add(ph.en, ph.who === "facilitator" ? "female" : "narrator")));
(window.CHAT || []).forEach(c => { add(c.text, MALE.has(c.who) ? "male" : "female"); c.replies.forEach(r => add(r.en)); });
add("Quick update: the cache is in the queue. Let's take it offline.");
console.log(JSON.stringify([...out.values()], null, 0));
