---
id: SPRINT-09
nombre: "Malla y agenda (H7, parte 2)"
hito: H7
estado: Por iniciar
puntos_comprometidos: 39
fecha_creacion: 2026-10-20
fecha_edicion: 2026-10-20
---

# SPRINT-09 · Malla y agenda (H7, parte 2)

## Objetivo del sprint
La materia creada aparece en el horario, el calendario y la malla.

## Sprint backlog

| PBI | Tipo | Título | Épica | MoSCoW | Pts | Estado |
|---|---|---|---|---|---|---|
| [HU-10.01](../historias/EP-10-malla-curricular/HU-10.01-consultar-malla.md) | Historia | Consultar la malla curricular con el estado de cada materia | EP-10 | Must | 5 | Borrador |
| [HU-10.02](../historias/EP-10-malla-curricular/HU-10.02-ver-prerrequisitos-y-desbloqueos.md) | Historia | Ver los prerrequisitos y lo que desbloquea una materia | EP-10 | Must | 3 | Borrador |
| [HU-10.03](../historias/EP-10-malla-curricular/HU-10.03-importar-plan-oficial.md) | Historia | Importar el plan de estudios oficial | EP-10 | Should | 8 | Borrador |
| [HU-11.01](../historias/EP-11-agenda/HU-11.01-consultar-calendario.md) | Historia | Consultar el calendario por mes, semana y agenda | EP-11 | Must | 8 | Borrador |
| [HU-11.02](../historias/EP-11-agenda/HU-11.02-crear-evento.md) | Historia | Crear un evento con recordatorios | EP-11 | Must | 5 | Borrador |
| [HU-11.03](../historias/EP-11-agenda/HU-11.03-consultar-horario-semanal.md) | Historia | Consultar el horario semanal de clases | EP-11 | Must | 5 | Borrador |
| [HU-11.04](../historias/EP-11-agenda/HU-11.04-exportar-a-google-calendar.md) | Historia | Exportar el horario y los eventos a Google Calendar | EP-11 | Should | 5 | Borrador |

**Total comprometido:** 39 puntos.

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
| HU-10.01 | `docs/qa/test-cases/TC-HU-10.01.md` (por redactar) | | | | |
| HU-10.02 | `docs/qa/test-cases/TC-HU-10.02.md` (por redactar) | | | | |
| HU-10.03 | `docs/qa/test-cases/TC-HU-10.03.md` (por redactar) | | | | |
| HU-11.01 | `docs/qa/test-cases/TC-HU-11.01.md` (por redactar) | | | | |
| HU-11.02 | `docs/qa/test-cases/TC-HU-11.02.md` (por redactar) | | | | |
| HU-11.03 | `docs/qa/test-cases/TC-HU-11.03.md` (por redactar) | | | | |
| HU-11.04 | `docs/qa/test-cases/TC-HU-11.04.md` (por redactar) | | | | |

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
