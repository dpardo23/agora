---
name: escribir-hu
description: Redacta o edita una historia de usuario de Ágora con el formato de la materia Gestión de Calidad de Software (ficha de Jaldín, descripción en 6 partes, CA-FE en Gherkin en español, CA-NF como Verificar/Condición/Resultado, mockup anotado). Úsala cuando haya que crear, dividir, revisar o actualizar una HU en docs/producto/historias/.
---

# Escribir una historia de usuario

## Antes de escribir
1. Lee `docs/plantillas/HU.md`, una HU vecina de la misma épica y su fila en `docs/producto/backlog.md`.
2. Ubica el mockup en `design/mockups/` y su fuente en `design/pantallas/*.dc.html`. Extrae los **textos literales** del `.dc.html`; no los inventes. Los textos entre corchetes (`[aula]`) son datos pendientes y se citan así.
3. Si la HU toca la oficina, lee `docs/design.md` sección 8 (dioses, salas y movimiento).

## Reglas de redacción
- **Título:** verbo en infinitivo + objeto + calificador. Nombra la capacidad, no la pantalla. No repite «Como… quiero…».
- **Plantilla:** «Como **{rol}**, quiero **{capacidad}**, para **{beneficio}**». Roles válidos: estudiante, dueño del Olimpo, titular de la cuenta.
- **Descripción en 6 partes:** plantilla, contexto, reglas de negocio (RN-n), datos, supuestos y fuera de alcance (citando la HU que sí lo cubre).
- **INVEST:** si supera 8 puntos, propón dividirla (por paso del flujo, regla, variación de datos o camino feliz frente a excepciones), nunca por capas técnicas.
- **CA-FE:** Gherkin con `# language: es`, en primera persona; un evento (Cuando) por escenario; Entonces con texto literal entre comillas. Cubre el camino feliz, las variaciones (Esquema del escenario + Ejemplos) y los estados de **carga, vacío y error**.
- **CA-NF:** tabla con atributo ISO/IEC 25010, Verificar, Condición y Resultado con un **umbral medible** (s, fps, %, ratio de contraste). Nunca «rápido» ni «correctamente».
- **Cobertura:** cada RN tiene al menos un CA.
- **Mockup anotado:** marcas numeradas → elemento (texto literal) → tipo/estado → validación → CA. Si falta un estado en el diseño, escribe «pendiente de diseño» y el patrón de `docs/design.md` que se aplica.
- **Frontmatter:** fechas ISO (AAAA-MM-DD). Al editar, actualiza `fecha_edicion`, sube la `version` y agrega una fila al historial.

## Después de escribir
- Actualiza `docs/producto/backlog.md`, la épica, el sprint y `docs/qa/matriz-trazabilidad.md` si cambiaste ID, título, puntos o sprint.
- Revisa la ortografía: tildes, ñ, signos de apertura (¿ ¡).
