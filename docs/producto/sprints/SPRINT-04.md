---
id: SPRINT-04
nombre: "El Olimpo cobra vida (H4, parte 1)"
hito: H4
estado: Por iniciar
puntos_comprometidos: 37
fecha_creacion: 2026-10-20
fecha_edicion: 2026-10-20
---

# SPRINT-04 · El Olimpo cobra vida (H4, parte 1)

## Objetivo del sprint
La oficina muestra a los 10 dioses en sus salas, siempre en movimiento y dirigidos por eventos simulados en Realtime.

## Sprint backlog

| PBI | Tipo | Título | Épica | MoSCoW | Pts | Estado |
|---|---|---|---|---|---|---|
| T-05 | Spike | Diseñar la hoja de sprites de los dioses y la escena del Olimpo | EP-05 | Must | 5 | Borrador |
| T-06 | Historia técnica | Crear un simulador de eventos de agentes para desarrollo y demos | EP-05 | Must | 3 | Borrador |
| [HU-05.01](../historias/EP-05-oficina-del-olimpo/HU-05.01-ver-oficina-del-olimpo.md) | Historia | Ver la Oficina del Olimpo con cada dios en su sala | EP-05 | Must | 8 | Borrador |
| [HU-05.02](../historias/EP-05-oficina-del-olimpo/HU-05.02-ver-dioses-en-movimiento.md) | Historia | Ver a los dioses moverse según su estado en tiempo real | EP-05 | Must | 13 | Borrador |
| [HU-05.03](../historias/EP-05-oficina-del-olimpo/HU-05.03-consultar-detalle-de-un-dios.md) | Historia | Consultar el detalle de un dios seleccionado | EP-05 | Must | 5 | Borrador |
| [HU-05.04](../historias/EP-05-oficina-del-olimpo/HU-05.04-consultar-oficina-sin-escena.md) | Historia | Consultar la oficina sin la escena desde la lista accesible y el móvil | EP-05 | Must | 3 | Borrador |

**Total comprometido:** 37 puntos.

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
| HU-05.01 | `docs/qa/test-cases/TC-HU-05.01.md` (por redactar) | | | | |
| HU-05.02 | `docs/qa/test-cases/TC-HU-05.02.md` (por redactar) | | | | |
| HU-05.03 | `docs/qa/test-cases/TC-HU-05.03.md` (por redactar) | | | | |
| HU-05.04 | `docs/qa/test-cases/TC-HU-05.04.md` (por redactar) | | | | |

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
