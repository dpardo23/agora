---
paths:
  - "apps/web/tests/**"
  - "apps/web/**/*.spec.ts"
  - "apps/web/**/*.test.ts"
  - "worker/tests/**"
---

# Reglas de pruebas automatizadas

- Unitarias y de componentes: carga `vitest` (con Testing Library para componentes React).
- E2E: Playwright (`playwright-cli` para explorar y depurar; `webapp-testing` para guiones con servidor local).
- Cada prueba automatizada cita en un comentario el TC que implementa, por ejemplo `// TC-HU-03.01-02`.
- El nombre de la prueba repite el título del TC, que empieza con «Verificar».
- Worker: pytest ejecutado con `uv run pytest`.
