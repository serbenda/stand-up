"""
Genera los audios de stand-up con Kokoro (voz neuronal) en local.
Uso: python3 generate.py <texts.json> <out_dir> [solo_claves_separadas_por_comas]
Fonética con espeak-ng (del paquete de Piper) y síntesis con onnxruntime.
"""
import json, os, re, subprocess, sys, wave, tempfile
import numpy as np
import onnxruntime as rt

# Carpeta con las descargas (ver README): piper/, model/kokoro.onnx, model/voices.bin, src-kokoro/
DL = os.environ.get("STANDUP_TTS_DIR", os.path.join(os.path.dirname(os.path.abspath(__file__)), "vendor"))
PIPER = os.path.join(DL, "piper", "piper")
MODEL = os.path.join(DL, "model", "kokoro.onnx")
VOICES = os.path.join(DL, "model", "voices.bin")
VOCAB = json.load(open(os.path.join(DL, "src-kokoro", "src", "kokoro_onnx", "config.json")))["vocab"]
SR = 24000

ACCENTS = {
    "us": {"lang": "en-us", "narrator": "af_heart", "female": "af_bella", "male": "am_michael"},
    "gb": {"lang": "en-gb", "narrator": "bf_emma", "female": "bf_emma", "male": "bm_george"},
}

PUNCT = re.compile(r"([,.!?;:…—]+)")


def espeak(text, lang):
    env = dict(os.environ, LD_LIBRARY_PATH=PIPER)
    r = subprocess.run([os.path.join(PIPER, "espeak-ng"), f"--path={PIPER}", "-q", "--ipa", "-v", lang, text],
                       capture_output=True, text=True, env=env, check=True)
    ph = " ".join(r.stdout.split())
    return re.sub(r"\([a-z-]+\)", "", ph)  # quita marcas de cambio de idioma


def phonemize(text, lang):
    """Fonetiza por trozos y vuelve a poner la puntuación, como hace phonemizer."""
    text = text.replace("«", "").replace("»", "").replace("...", "…")
    parts = PUNCT.split(text)
    out = ""
    for p in parts:
        if not p:
            continue
        if PUNCT.fullmatch(p):
            out = out.rstrip() + p.replace("…", "…") + " "
        elif p.strip():
            out += espeak(p.strip(), lang) + " "
    ph = "".join(c for c in out if c in VOCAB)
    return " ".join(ph.split()).strip()


def trim(audio, thr=0.01, pad=0.06):
    idx = np.where(np.abs(audio) > thr)[0]
    if not len(idx):
        return audio
    a, b = max(0, idx[0] - int(pad * SR)), min(len(audio), idx[-1] + int(pad * 1.6 * SR))
    return audio[a:b]


def main():
    texts = json.load(open(sys.argv[1]))
    out_dir = sys.argv[2]
    only = set(sys.argv[3].split(",")) if len(sys.argv) > 3 and sys.argv[3] else None
    sess = rt.InferenceSession(MODEL, providers=["CPUExecutionProvider"])
    voices = np.load(VOICES)
    done = 0
    for acc, cfg in ACCENTS.items():
        os.makedirs(os.path.join(out_dir, acc), exist_ok=True)
        for t in texts:
            if only and t["key"] not in only:
                continue
            dest = os.path.join(out_dir, acc, t["key"] + ".mp3")
            if os.path.exists(dest):
                continue
            ph = phonemize(t["say"], cfg["lang"])
            tokens = [VOCAB[c] for c in ph if c in VOCAB][:510]
            voice = voices[cfg[t["role"]]]
            style = voice[len(tokens) - 1]
            audio = sess.run(None, {
                "tokens": np.array([[0, *tokens, 0]], dtype=np.int64),
                "style": np.asarray(style, dtype=np.float32),
                "speed": np.array([0.95], dtype=np.float32),
            })[0].ravel()
            audio = trim(audio)
            pcm = (np.clip(audio, -1, 1) * 32767).astype(np.int16)
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
                with wave.open(tmp.name, "wb") as w:
                    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
                subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", tmp.name, "-ac", "1", "-codec:a", "libmp3lame", "-b:a", "48k", dest], check=True)
                os.unlink(tmp.name)
            done += 1
            print(f"{acc} {t['key']} {len(pcm)/SR:.2f}s  {t['text'][:50]}  |  {ph[:60]}", flush=True)
    print("generated", done)


if __name__ == "__main__":
    main()
