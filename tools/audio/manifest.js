// Escribe js/audio-manifest.js con las claves que tienen grabación en los dos acentos
const fs = require("fs"), path = require("path");
const root = path.resolve(__dirname, "../..");
const list = d => new Set(fs.readdirSync(path.join(root, "audio", d)).filter(f => f.endsWith(".mp3")).map(f => f.slice(0, -4)));
const us = list("us"), gb = list("gb");
// Con la lista de textos (salida de export.js) borra las grabaciones que ya no se usan
if (process.argv[2]) {
  const wanted = new Set(JSON.parse(fs.readFileSync(process.argv[2], "utf8")).map(t => t.key));
  let removed = 0;
  for (const d of ["us", "gb"]) for (const k of list(d)) if (!wanted.has(k)) { fs.unlinkSync(path.join(root, "audio", d, k + ".mp3")); (d === "us" ? us : gb).delete(k); removed++; }
  if (removed) console.log(removed + " grabaciones sin uso borradas");
}
const keys = [...us].filter(k => gb.has(k)).sort();
fs.writeFileSync(path.join(root, "js/audio-manifest.js"),
  "/* Generado por tools/audio/manifest.js: textos con grabación en audio/us y audio/gb */\nwindow.AUDIO_KEYS = " + JSON.stringify(keys) + ";\n");
console.log(keys.length + " grabaciones en los dos acentos");
