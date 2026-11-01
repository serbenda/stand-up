// Escribe js/audio-manifest.js con las claves que tienen grabación en los dos acentos
const fs = require("fs"), path = require("path");
const root = path.resolve(__dirname, "../..");
const list = d => new Set(fs.readdirSync(path.join(root, "audio", d)).filter(f => f.endsWith(".mp3")).map(f => f.slice(0, -4)));
const us = list("us"), gb = list("gb");
const keys = [...us].filter(k => gb.has(k)).sort();
fs.writeFileSync(path.join(root, "js/audio-manifest.js"),
  "/* Generado por tools/audio/manifest.js: textos con grabación en audio/us y audio/gb */\nwindow.AUDIO_KEYS = " + JSON.stringify(keys) + ";\n");
console.log(keys.length + " grabaciones en los dos acentos");
