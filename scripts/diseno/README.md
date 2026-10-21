# Scripts de diseño

Generan las capturas de `design/mockups/` y las imágenes anotadas por HU de `design/mockups/anotados/` a partir del export del lienzo (`design/fuente/agora.html`, que se guarda solo en local).

| Script | Qué hace |
|---|---|
| `capturar-mockups.mjs` | Una captura por pantalla del lienzo, con el alto completo de cada artboard |
| `extraer-marcas.py` | Lee las tablas de mockup anotado de las HU y escribe `design/mockups/anotados/marcas.json` |
| `anotar-mockups.mjs` | Ubica cada marca por su texto literal, dibuja la insignia numerada y guarda la imagen; deja el resumen en `reporte.json` |

Requisitos: Node 22 con `playwright-core` y Chromium del sistema (`CHROMIUM_PATH`, por defecto `/usr/bin/chromium`). Después de regenerar las imágenes, comprímelas con `pngquant --ext .png --force design/mockups/**/*.png`.
