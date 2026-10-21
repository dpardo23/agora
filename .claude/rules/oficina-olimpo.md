---
paths:
  - "apps/web/src/features/oficina/**"
  - "design/sprites/**"
  - "docs/producto/historias/EP-05-oficina-del-olimpo/**"
  - "worker/umss/roles/**"
---

# Reglas de la Oficina del Olimpo

- Carga la skill `pixel-art-sprites` para diseñar sprites, paletas y ciclos de animación.
- Las fuentes de verdad son `docs/design.md` sección 8 (dioses, salas, paleta, movimiento) y `design/referencias/oficina-olimpo.png`.
- Render: Canvas 2D a escala entera con `imageSmoothingEnabled = false` y la hoja de sprites generada una sola vez (ADR-004). No metas PixiJS ni otro motor sin un ADR nuevo.
- Los dioses nunca están quietos: cada estado tiene animación propia (`docs/design.md`, sección 8.4). Con `prefers-reduced-motion` se aplica la opción C: caminan a la mitad de la velocidad, sin gestos ni destellos. El botón «Pausar animación» siempre está disponible.
- **Escalabilidad (ADR-005):** dioses y roles están separados. El pipeline apunta a roles; un dios puede tener varios roles. No escribas condiciones por nombre de dios (`if (dios === 'zeus')`): decide por rol. Un dios nuevo se agrega con datos, sin cambiar el código del render.
- La sección se llama **Olimpo**, nunca «Bot».
- El movimiento lo dirigen los eventos de `eventos_agente`. El bucle de demostración se usa solo en desarrollo.
- Todo lo que muestra la escena también debe poder consultarse en la lista accesible de chips.
