---
name: reportar-bug
description: Redacta un bug report de Olympus con la guía de la materia (un defecto por reporte, reproducible, severidad y prioridad separadas, actual frente a esperado, evidencia, trazado a HU, CA y TC). Úsala cuando un test case falla o se observa un defecto, para crear docs/qa/bugs/BUG-NNN-slug.md.
---

# Reportar un bug

## Procedimiento
1. Busca en `docs/qa/bugs/` si el defecto ya está reportado (para no duplicarlo). Toma el siguiente número correlativo.
2. Reproduce el defecto al menos 3 veces y anota la reproducibilidad (p. ej. «Siempre (5/5)»).
3. Completa `docs/plantillas/BUG.md` sin quitar campos. Los que no apliquen quedan vacíos.
   - **Título:** qué falla + dónde + bajo qué condición. Ejemplo: «El botón Entrar queda en carga infinita al iniciar sesión sin conexión».
   - **Severidad** (impacto técnico) y **prioridad** (urgencia), por separado y según `docs/qa/plan-pruebas.md` sección 6.
   - **Ambiente completo:** commit, URL, navegador y versión, sistema operativo, ancho, tema y datos de la semilla.
   - **Pasos** en infinitivo, con datos literales y que partan de un estado conocido.
   - **Resultado actual** (texto, estado o respuesta HTTP exactos) frente al **resultado esperado** (cita el «Entonces» del CA violado).
   - **Evidencias** en `docs/qa/bugs/evidencias/BUG-NNN-*.png|log|json`. Para tomar capturas usa la skill `playwright-cli` o `webapp-testing`.
   - Describe hechos observables. Una hipótesis de causa se marca como «Hipótesis» y va al final.
4. Enlaza el bug en la fila de ejecución del TC, en la tabla de `docs/qa/bugs/README.md`, en la matriz y en el archivo del sprint.
5. Al corregirlo, agrega una fila al historial con cada cambio de estado.
