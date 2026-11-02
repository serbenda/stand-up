"""
Construye js/terms.js a partir de terms_src.py.

La pronunciación aproximada «a la española» se calcula con la misma fonética
(espeak-ng, inglés americano) que usa el generador de audio, así el texto y la
grabación siempre coinciden. Se puede fijar a mano con «sounds».

Uso: STANDUP_TTS_DIR=<carpeta con piper/> python3 tools/terms/build.py
"""
import json, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
sys.path.insert(0, HERE)
from terms_src import CATS, TERMS  # noqa: E402

DL = os.environ.get("STANDUP_TTS_DIR", os.path.join(ROOT, "tools", "audio", "vendor"))
PIPER = os.path.join(DL, "piper", "piper")


def ipa(text):
    env = dict(os.environ, LD_LIBRARY_PATH=PIPER)
    r = subprocess.run([os.path.join(PIPER, "espeak-ng"), f"--path={PIPER}", "-q", "--ipa", "-v", "en-us", text],
                       capture_output=True, text=True, env=env, check=True)
    return re.sub(r"\([a-z-]+\)", "", " ".join(r.stdout.split()))


# ── IPA → sílabas «a la española» ──
VOWELS = [("ɑːɹ", "ar"), ("ɔːɹ", "or"), ("ɛɹ", "er"), ("ɪɹ", "ir"), ("ʊɹ", "ur"), ("aɪɚ", "aier"), ("aɪə", "aie"),
          ("iəɹ", "ir"), ("eə", "e"), ("ʊə", "u"),
          ("eɪ", "ei"), ("aɪ", "ai"), ("aʊ", "au"), ("ɔɪ", "oi"), ("oʊ", "ou"), ("əʊ", "ou"),
          ("ɜː", "er"), ("iː", "i"), ("uː", "u"), ("ɑː", "a"), ("ɔː", "o"),
          ("ɚ", "er"), ("ɝ", "er"), ("i", "i"), ("ɪ", "i"), ("ᵻ", "i"), ("e", "e"), ("ɛ", "e"), ("æ", "a"),
          ("ɑ", "a"), ("ɒ", "o"), ("ɔ", "o"), ("ʌ", "a"), ("ə", "e"), ("ɐ", "a"), ("ʊ", "u"), ("u", "u"), ("o", "o"), ("a", "a")]
CONS = [("tʃ", "ch"), ("dʒ", "y"), ("ŋ", "ng"), ("θ", "z"), ("ð", "d"), ("ʃ", "sh"), ("ʒ", "zh"), ("ɹ", "r"),
        ("ɾ", "t"), ("ɡ", "g"), ("h", "j"), ("j", "y"), ("w", "u"), ("x", "j"), ("ʔ", "")]
CONS += [(c, c) for c in "pbtdkfvszmnl"]
ONSET2 = {("p", "ɹ"), ("b", "ɹ"), ("t", "ɹ"), ("d", "ɹ"), ("k", "ɹ"), ("ɡ", "ɹ"), ("f", "ɹ"), ("θ", "ɹ"), ("ʃ", "ɹ"),
          ("p", "l"), ("b", "l"), ("k", "l"), ("ɡ", "l"), ("f", "l"), ("s", "l")}
GLIDES = {"w", "j"}


def tokenize(word):
    out, i = [], 0
    while i < len(word):
        ch = word[i]
        if ch in "ˈˌ":
            out.append(("S", ch)); i += 1; continue
        if ch in "ː.'-":
            i += 1; continue
        for ph, sp in VOWELS:
            if word.startswith(ph, i):
                out.append(("V", ph, sp)); i += len(ph); break
        else:
            for ph, sp in CONS:
                if word.startswith(ph, i):
                    out.append(("C", ph, sp)); i += len(ph); break
            else:
                i += 1
    return out


def syllabify(word):
    toks = tokenize(word)
    sylls, onset, pending_stress = [], [], None
    vowel_idx = [k for k, t in enumerate(toks) if t[0] == "V"]
    if not vowel_idx:
        return [("".join(t[2] for t in toks if t[0] == "C"), False)]
    # stress marks: the next vowel gets the stress
    stress_of = {}
    mark = None
    for t in toks:
        if t[0] == "S":
            mark = t[1]
        elif t[0] == "V":
            stress_of[id(t)] = mark == "ˈ"
            mark = None
    cons_runs, cur = [], []
    parts = []  # alternating consonant clusters and vowels
    for t in toks:
        if t[0] == "C":
            cur.append(t)
        elif t[0] == "V":
            parts.append(cur); cur = []; parts.append(t)
    parts.append(cur)
    # parts: [C*, V, C*, V, ..., C*]
    nv = (len(parts) - 1) // 2
    syl = [{"on": [], "v": None, "co": []} for _ in range(nv)]
    syl[0]["on"] = parts[0]
    for k in range(nv):
        syl[k]["v"] = parts[2 * k + 1]
        cl = parts[2 * k + 2]
        if k == nv - 1:
            syl[k]["co"] = cl
            continue
        if len(cl) == 0:
            continue
        if len(cl) == 1:
            syl[k + 1]["on"] = cl
            continue
        a, b = cl[-2][1], cl[-1][1]
        if (a, b) in ONSET2 or b in GLIDES:
            syl[k]["co"], syl[k + 1]["on"] = cl[:-2], cl[-2:]
        else:
            syl[k]["co"], syl[k + 1]["on"] = cl[:-1], cl[-1:]
    out = []
    for k, s in enumerate(syl):
        v = s["v"][2]
        if s["v"][1] == "ə" and k == nv - 1 and not s["co"]:
            v = "a"  # schwa final: «data» → «DÉI-ta»
        letters = "".join(c[2] for c in s["on"]) + "\u0000" + v + "\u0000" + "".join(c[2] for c in s["co"])
        out.append((letters, stress_of.get(id(s["v"]), False)))
    return out


ACUTE = {"a": "Á", "e": "É", "i": "Í", "o": "Ó", "u": "Ú"}


def render_syllable(letters, stressed):
    on, v, co = letters.split("\u0000")
    s = on + v + co
    s = re.sub(r"g(?=[ei])", "gu", s)
    if not stressed:
        return s
    on2 = re.sub(r"g(?=[ei])", "gu", on + v)[: -len(v)] if v else on
    # acento en la vocal núcleo («iu» lo lleva en la u)
    if v == "iu":
        vv = "IÚ"
    elif v:
        vv = ACUTE.get(v[0], v[0].upper()) + v[1:].upper()
    else:
        vv = ""
    return (on2.upper() + vv + co.upper())


def respell(ipa_text, drop_first=False):
    ipa_text = ipa_text.replace("ɚɹ", "əɹ")  # «authorization» → «o-ze-ri-…», sin doble r
    words = []
    parts = ipa_text.split()
    if drop_first and len(parts) > 1:
        parts = parts[1:]
    for w in parts:
        syl = syllabify(w)
        if len(syl) == 1:
            words.append(syl[0][0].replace("\u0000", ""))
        else:
            words.append("-".join(render_syllable(l, st) for l, st in syl))
    # «dʒ» al final de palabra suena más a «ch» para un hispanohablante: «knowledge» → «NÁ-lich»
    return " ".join(re.sub(r"(?<=[aeiouáéíóúAEIOUÁÉÍÓÚ])y$|(?<=[aeiouáéíóú])Y$", lambda m: "ch" if m.group(0) == "y" else "CH", w) for w in words)


LETTERS = {"A": "ei", "B": "bi", "C": "si", "D": "di", "E": "i", "F": "ef", "G": "yi", "H": "eich", "I": "ai",
           "J": "yei", "K": "kei", "L": "el", "M": "em", "N": "en", "O": "ou", "P": "pi", "Q": "kiu", "R": "ar",
           "S": "es", "T": "ti", "U": "iu", "V": "vi", "W": "dabliu", "X": "ex", "Y": "uai", "Z": "zi",
           "2": "tu", "3": "zri", "4": "for", "6": "six", "8": "eit"}


def spell_sounds(term):
    letters = [ch for ch in term.upper() if ch in LETTERS]
    parts = [LETTERS[c] for c in letters]
    last = parts[-1]
    up = render_syllable("\u0000" + last + "\u0000", True) if last in ("ei", "i", "ai", "ou", "iu", "uai") else last.upper().replace("A", "Á", 1) if last.startswith("a") else (last[0].upper() + ACUTE.get(last[1], last[1]).upper() + last[2:].upper() if len(last) > 1 and last[1] in "aeiou" else last.upper())
    if last in ("ef", "el", "em", "en", "es", "ex", "ar"):
        up = ACUTE[last[0]] + last[1:].upper()
    return "-".join(parts[:-1] + [up])


def spelled_say(term):
    return ". ".join(ch for ch in term.upper() if ch.isalnum()) + "."


def main():
    seen, out = set(), []
    for cat, _ in CATS:
        for entry in TERMS[cat]:
            term, opt = (entry, {}) if isinstance(entry, str) else entry
            key = (cat, term.lower())
            if key in seen or (term.lower() in {t["term"].lower() for t in out} and cat not in ("trap", "silent")):
                continue
            seen.add(key)
            say = opt.get("say")
            if opt.get("spell") and not say:
                say = spelled_say(term)
            spoken = say or re.sub(r"\s*\((noun|verb)\)", "", term)
            if "sounds" in opt:
                sounds = opt["sounds"]
            elif opt.get("spell"):
                sounds = spell_sounds(term)
            else:
                art = re.match(r"(a|an|to|the) ", spoken)
                sounds = respell(ipa(spoken), drop_first=bool(art))
            item = {"cat": cat, "term": term, "sounds": sounds}
            if spoken != term:
                item["say"] = spoken
            for k in ("wrong", "note"):
                if opt.get(k):
                    item[k] = opt[k]
            out.append(item)
    js = ("/* Generado por tools/terms/build.py a partir de tools/terms/terms_src.py. No editar a mano. */\n"
          "window.TERM_CATS = " + json.dumps([{"id": c, "name": n} for c, n in CATS], ensure_ascii=False) + ";\n"
          "window.TERMS = [\n" + ",\n".join("  " + json.dumps(t, ensure_ascii=False) for t in out) + "\n];\n")
    with open(os.path.join(ROOT, "js", "terms.js"), "w") as f:
        f.write(js)
    print(len(out), "términos")


if __name__ == "__main__":
    main()
