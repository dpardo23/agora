---
id: ADR-004
titulo: La escena de la oficina se dibuja con Canvas 2D propio, sin motor de juegos
estado: Aceptada
fecha: 2026-10-20
---

# ADR-004 · Render con Canvas 2D

## Contexto
La oficina tiene entre 10 y 15 sprites de 12×18 px en movimiento continuo, una escena de unos 960×720 px lógicos y textos accesibles encima. La especificación (sección 7.4) ya proponía hacer la hoja de sprites con `OffscreenCanvas → ImageBitmap` y dibujar en Canvas 2D.

## Decisión
Se usa Canvas 2D con escala entera e `imageSmoothingEnabled = false`. El bucle va con `requestAnimationFrame` y se pausa cuando la pestaña no está visible. Burbujas, rótulos y panel van en el DOM, encima de la escena. Las rutas se calculan sobre un grafo de puntos (escritorios, puertas, hall).

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **Canvas 2D propio** | Sin dependencias, control total, peso mínimo | Hay que escribir el bucle, el orden por profundidad y las rutas |
| PixiJS v8 | Sprites, ticker y WebGL | Unos 450 KB más para pocos sprites; es una capa más que aprender |
| DOM con `box-shadow` (el diseño actual) | Ya existe | Caro de animar y no escala a 15 agentes |

## Consecuencias
- No se instala la skill `pixijs`. Si el rendimiento no alcanza (CA-NF de HU-05.02: 60 fps p95 en escritorio y 30 en móvil), se abre un ADR nuevo.
