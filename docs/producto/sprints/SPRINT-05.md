---
id: SPRINT-05
nombre: "Encargar y seguir (H4, parte 2)"
hito: H4
estado: Por iniciar
puntos_comprometidos: 28
fecha_creacion: 2026-10-20
fecha_edicion: 2026-10-20
---

# SPRINT-05 · Encargar y seguir (H4, parte 2)

## Objetivo del sprint
Un trabajo simulado se encarga desde la web, pide aprobación del esquema, recorre los 9 pasos en vivo y aparece en Documentos.

## Sprint backlog

| PBI | Tipo | Título | Épica | MoSCoW | Pts | Estado |
|---|---|---|---|---|---|---|
| [HU-06.01](../historias/EP-06-encargos-al-olimpo/HU-06.01-encargar-documento.md) | Historia | Encargar un documento al Olimpo | EP-06 | Must | 5 | Borrador |
| [HU-06.02](../historias/EP-06-encargos-al-olimpo/HU-06.02-seguir-avance-del-pipeline.md) | Historia | Seguir el avance de un trabajo por los 9 pasos del pipeline | EP-06 | Must | 5 | Borrador |
| [HU-06.03](../historias/EP-06-encargos-al-olimpo/HU-06.03-consultar-registro-en-vivo.md) | Historia | Consultar el registro en vivo del Olimpo | EP-06 | Must | 3 | Borrador |
| [HU-06.04](../historias/EP-06-encargos-al-olimpo/HU-06.04-aprobar-esquema.md) | Historia | Aprobar el esquema de un documento o pedir cambios | EP-06 | Must | 5 | Borrador |
| [HU-06.05](../historias/EP-06-encargos-al-olimpo/HU-06.05-consultar-documentos-generados.md) | Historia | Consultar y abrir los documentos generados | EP-06 | Must | 5 | Borrador |
| [HU-06.06](../historias/EP-06-encargos-al-olimpo/HU-06.06-pausar-trabajo.md) | Historia | Pausar y reanudar un trabajo en curso | EP-06 | Should | 2 | Borrador |
| [HU-05.05](../historias/EP-05-oficina-del-olimpo/HU-05.05-pausar-agente.md) | Historia | Pausar y reanudar a un dios | EP-05 | Should | 3 | Borrador |

**Total comprometido:** 28 puntos.

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
| HU-06.01 | `docs/qa/test-cases/TC-HU-06.01.md` (por redactar) | | | | |
| HU-06.02 | `docs/qa/test-cases/TC-HU-06.02.md` (por redactar) | | | | |
| HU-06.03 | `docs/qa/test-cases/TC-HU-06.03.md` (por redactar) | | | | |
| HU-06.04 | `docs/qa/test-cases/TC-HU-06.04.md` (por redactar) | | | | |
| HU-06.05 | `docs/qa/test-cases/TC-HU-06.05.md` (por redactar) | | | | |
| HU-06.06 | `docs/qa/test-cases/TC-HU-06.06.md` (por redactar) | | | | |
| HU-05.05 | `docs/qa/test-cases/TC-HU-05.05.md` (por redactar) | | | | |

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
