---
id: SPRINT-08
nombre: "Mis materias (H7, parte 1)"
hito: H7
estado: Por iniciar
puntos_comprometidos: 21
fecha_creacion: 2026-10-20
fecha_edicion: 2026-10-20
---

# SPRINT-08 · Mis materias (H7, parte 1)

## Objetivo del sprint
Una materia creada guarda horario, docente y Drive, y muestra su detalle con la nota necesaria para aprobar.

## Sprint backlog

| PBI | Tipo | Título | Épica | MoSCoW | Pts | Estado |
|---|---|---|---|---|---|---|
| [HU-09.01](../historias/EP-09-materias/HU-09.01-agregar-materia.md) | Historia | Agregar una materia con horario, docente y carpeta de Drive | EP-09 | Must | 8 | Borrador |
| [HU-09.02](../historias/EP-09-materias/HU-09.02-consultar-mis-materias.md) | Historia | Consultar mis materias de la gestión y su detalle | EP-09 | Must | 5 | Borrador |
| [HU-09.03](../historias/EP-09-materias/HU-09.03-calcular-nota-necesaria.md) | Historia | Calcular la nota necesaria para aprobar una materia | EP-09 | Must | 3 | Borrador |
| [HU-09.04](../historias/EP-09-materias/HU-09.04-editar-materia.md) | Historia | Editar los datos de una materia | EP-09 | Must | 3 | Borrador |
| [HU-09.05](../historias/EP-09-materias/HU-09.05-eliminar-materia.md) | Historia | Eliminar una materia confirmando su nombre | EP-09 | Should | 2 | Borrador |

**Total comprometido:** 21 puntos.

## Incremento esperado
Al cerrar el sprint, el objetivo de arriba se puede demostrar en la preview de Vercel (o en local, si el sprint es de infraestructura), en ambos temas y a 390, 834 y 1440 px.

## Flujo de trabajo del sprint
1. **Planning:** confirmar que cada HU cumple la DoR (descripción, CA y mockup anotado) y desglosar las tareas.
2. **Test cases:** redactar `docs/qa/test-cases/TC-HU-XX.YY.md` para cada HU, antes de programar (skill `escribir-tc`).
3. **Desarrollo:** una rama `feat/` por HU, con commits en Conventional Commits.
4. **Ejecución de TC:** registrar cada run en el TC.
5. **Bug reports:** un `docs/qa/bugs/BUG-NNN-*.md` por defecto (skill `reportar-bug`).
6. **Corrección y verificación** de los bugs.
7. **Review y retrospectiva** en este archivo.

## Test cases del sprint

| HU | Archivo de TC | Casos | Pasan | Fallan | Bloqueados |
|---|---|---|---|---|---|
| HU-09.01 | `docs/qa/test-cases/TC-HU-09.01.md` (por redactar) | | | | |
| HU-09.02 | `docs/qa/test-cases/TC-HU-09.02.md` (por redactar) | | | | |
| HU-09.03 | `docs/qa/test-cases/TC-HU-09.03.md` (por redactar) | | | | |
| HU-09.04 | `docs/qa/test-cases/TC-HU-09.04.md` (por redactar) | | | | |
| HU-09.05 | `docs/qa/test-cases/TC-HU-09.05.md` (por redactar) | | | | |

## Bugs del sprint

| Bug | Título | Severidad | Prioridad | HU | Estado |
|---|---|---|---|---|---|
| | | | | | |

## Definition of Done del sprint
- [ ] Todas las HU comprometidas están en estado «Hecha».
- [ ] TC redactados y ejecutados; ningún TC de prioridad Alta en «Falla».
- [ ] Sin bugs abiertos de severidad Crítica o Alta.
- [ ] CI en verde en `main`; preview desplegada.
- [ ] Backlog, matriz de trazabilidad y este archivo actualizados.

## Review
_(se completa al cerrar el sprint: qué se demostró y qué feedback hubo)_

## Retrospectiva
| Qué funcionó | Qué mejorar | Acción para el próximo sprint |
|---|---|---|
| | | |
