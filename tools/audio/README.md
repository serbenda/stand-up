# Audio de stand-up

Las frases se reproducen con grabaciones generadas con **Kokoro**, un modelo de voz neuronal abierto (licencia Apache 2.0), en lugar de con las voces del navegador. Cada texto tiene un mp3 por acento:

```
audio/us/<clave>.mp3   voz americana (af_heart; en situaciones, af_bella y am_michael)
audio/gb/<clave>.mp3   voz británica (bf_emma; en situaciones, bm_george)
```

La clave es un hash del texto, el mismo que calcula `js/app.js`. Si un texto no tiene grabación (por ejemplo, el daily que montas tú), la web usa la voz del navegador.

## Regenerar al añadir frases

1. Descarga en `tools/audio/vendor/` (no se sube al repo):
   - `piper/`: el paquete [piper_linux_x86_64](https://github.com/rhasspy/piper/releases/tag/2023.11.14-2), que trae `espeak-ng` y sus datos.
   - `model/kokoro.onnx` y `model/voices.bin`: de las [releases de kokoro-onnx](https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0) (`kokoro-v1.0.int8.onnx` y `voices-v1.0.bin`).
   - `src-kokoro/`: un clon de [kokoro-onnx](https://github.com/thewh1teagle/kokoro-onnx), del que solo se usa el vocabulario.
2. Necesitas Python con `numpy` y `onnxruntime`, Node y `ffmpeg`.
3. Ejecuta desde la raíz del repo:

```sh
node tools/audio/export.js > /tmp/texts.json
python3 tools/audio/generate.py /tmp/texts.json audio
node tools/audio/manifest.js /tmp/texts.json   # con la lista, borra además las grabaciones sin uso
```

`generate.py` solo crea los mp3 que faltan, así que añadir frases nuevas es rápido.
