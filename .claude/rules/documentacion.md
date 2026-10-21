---
paths:
  - "docs/**"
---

# Reglas de la documentación de producto y QA

- Para escribir o editar una HU, usa la skill `escribir-hu`. Para un test case, `escribir-tc`. Para un bug report, `reportar-bug`.
- Parte siempre de la plantilla en `docs/plantillas/`. No elimines campos de la plantilla.
- Los documentos van en prosa completa y en español correcto. El modo caveman no se aplica aquí.
- Al editar un documento, actualiza `fecha_edicion` (formato ISO, AAAA-MM-DD) y sube la `version`. Agrega una fila al historial de cambios.
- Si cambias un ID, título, sprint o estado, actualiza también `docs/producto/backlog.md` y `docs/qa/matriz-trazabilidad.md`.
- **Autoría:** `elaborado_por` y `responsable` son siempre «Juan Diego Pardo Pozo»; en el historial, el autor también. Nunca se nombra una herramienta de IA ni un asistente.
- Escribe «sección 8.4»; no uses el signo de sección. Las rutas citadas deben existir: verifícalo con `python scripts/verificar-docs.py`.
- Las HU van en `docs/producto/historias/EP-XX-slug/` según su épica.
