---
id: SPRINT-11
nombre: "Avisos y estudio (H8, parte 2)"
hito: H8
estado: Por iniciar
puntos_comprometidos: 32
fecha_creacion: 2026-10-20
fecha_edicion: 2026-10-20
---

# SPRINT-11 · Avisos y estudio (H8, parte 2)

## Objetivo del sprint
La bandeja recibe avisos filtrados y el estudiante repasa con FSRS y estudia con pomodoro.

## Sprint backlog

| PBI | Tipo | Título | Épica | MoSCoW | Pts | Estado |
|---|---|---|---|---|---|---|
| [HU-13.01](../historias/EP-13-avisos/HU-13.01-consultar-bandeja-de-avisos.md) | Historia | Consultar la bandeja de avisos con filtros | EP-13 | Must | 5 | Borrador |
| [HU-13.02](../historias/EP-13-avisos/HU-13.02-convertir-aviso-en-accion.md) | Historia | Convertir un aviso en tarea o aplicar el dato detectado | EP-13 | Must | 3 | Borrador |
| [HU-13.03](../historias/EP-13-avisos/HU-13.03-editar-reglas-de-bandeja.md) | Historia | Editar las reglas de la bandeja | EP-13 | Should | 3 | Borrador |
| [HU-14.01](../historias/EP-14-estudiar/HU-14.01-repasar-tarjetas.md) | Historia | Repasar tarjetas con repetición espaciada | EP-14 | Must | 8 | Borrador |
| [HU-14.02](../historias/EP-14-estudiar/HU-14.02-generar-tarjetas-de-documento.md) | Historia | Generar tarjetas de repaso a partir de un documento | EP-14 | Must | 5 | Borrador |
| [HU-14.03](../historias/EP-14-estudiar/HU-14.03-estudiar-con-pomodoro.md) | Historia | Estudiar con el temporizador pomodoro | EP-14 | Must | 5 | Borrador |
| [HU-14.04](../historias/EP-14-estudiar/HU-14.04-consultar-estadisticas-de-estudio.md) | Historia | Consultar mis estadísticas de estudio | EP-14 | Should | 3 | Borrador |

**Total comprometido:** 32 puntos.

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
| HU-13.01 | `docs/qa/test-cases/TC-HU-13.01.md` (por redactar) | | | | |
| HU-13.02 | `docs/qa/test-cases/TC-HU-13.02.md` (por redactar) | | | | |
| HU-13.03 | `docs/qa/test-cases/TC-HU-13.03.md` (por redactar) | | | | |
| HU-14.01 | `docs/qa/test-cases/TC-HU-14.01.md` (por redactar) | | | | |
| HU-14.02 | `docs/qa/test-cases/TC-HU-14.02.md` (por redactar) | | | | |
| HU-14.03 | `docs/qa/test-cases/TC-HU-14.03.md` (por redactar) | | | | |
| HU-14.04 | `docs/qa/test-cases/TC-HU-14.04.md` (por redactar) | | | | |

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
