---
id: SPRINT-06
nombre: "El Olimpo trabaja de verdad (H5)"
hito: H5
estado: Por iniciar
puntos_comprometidos: 26
fecha_creacion: 2026-10-20
fecha_edicion: 2026-10-20
---

# SPRINT-06 · El Olimpo trabaja de verdad (H5)

## Objetivo del sprint
El trabajo 13 se regenera desde la web con el worker real, con las mismas verificaciones.

## Sprint backlog

| PBI | Tipo | Título | Épica | MoSCoW | Pts | Estado |
|---|---|---|---|---|---|---|
| T-07 | Chore | Preparar la VM de Oracle (systemd, TeX Live, credenciales, respaldos) | EP-07 | Must | 5 | Borrador |
| [HU-07.01](../historias/EP-07-motor-de-agentes/HU-07.01-procesar-encargos-desde-la-cola.md) | Historia | Procesar encargos desde la cola de Supabase | EP-07 | Must | 8 | Borrador |
| [HU-07.02](../historias/EP-07-motor-de-agentes/HU-07.02-publicar-eventos-de-agentes.md) | Historia | Publicar el avance del pipeline como eventos de los agentes | EP-07 | Must | 5 | Borrador |
| [HU-07.03](../historias/EP-07-motor-de-agentes/HU-07.03-entregar-pdf.md) | Historia | Entregar el PDF en Storage y en Google Drive | EP-07 | Must | 5 | Borrador |
| [HU-07.04](../historias/EP-07-motor-de-agentes/HU-07.04-registrar-uso-de-modelos.md) | Historia | Registrar el uso de modelos en cada llamada | EP-07 | Must | 3 | Borrador |

**Total comprometido:** 26 puntos.

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
| HU-07.01 | `docs/qa/test-cases/TC-HU-07.01.md` (por redactar) | | | | |
| HU-07.02 | `docs/qa/test-cases/TC-HU-07.02.md` (por redactar) | | | | |
| HU-07.03 | `docs/qa/test-cases/TC-HU-07.03.md` (por redactar) | | | | |
| HU-07.04 | `docs/qa/test-cases/TC-HU-07.04.md` (por redactar) | | | | |

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
