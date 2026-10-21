---
id: SPRINT-10
nombre: "Tareas (H8, parte 1)"
hito: H8
estado: Por iniciar
puntos_comprometidos: 27
fecha_creacion: 2026-10-20
fecha_edicion: 2026-10-20
---

# SPRINT-10 · Tareas (H8, parte 1)

## Objetivo del sprint
Tareas al estilo Google Tasks, sincronizadas, con la opción de pedir apoyo al Olimpo.

## Sprint backlog

| PBI | Tipo | Título | Épica | MoSCoW | Pts | Estado |
|---|---|---|---|---|---|---|
| T-08 | Chore | Instalar n8n en la VM y versionar sus flujos | EP-12 | Must | 3 | Borrador |
| [HU-12.01](../historias/EP-12-tareas/HU-12.01-crear-tarea-rapida.md) | Historia | Crear una tarea rápida con Enter | EP-12 | Must | 3 | Borrador |
| [HU-12.02](../historias/EP-12-tareas/HU-12.02-organizar-tareas-en-listas.md) | Historia | Organizar las tareas en listas y filtros | EP-12 | Must | 5 | Borrador |
| [HU-12.03](../historias/EP-12-tareas/HU-12.03-detallar-tarea.md) | Historia | Detallar una tarea con vencimiento, recordatorio, repetición y subtareas | EP-12 | Must | 5 | Borrador |
| [HU-12.04](../historias/EP-12-tareas/HU-12.04-pedir-documento-de-apoyo.md) | Historia | Pedir al Olimpo un documento de apoyo desde una tarea | EP-12 | Should | 3 | Borrador |
| [HU-12.05](../historias/EP-12-tareas/HU-12.05-sincronizar-google-tasks.md) | Historia | Sincronizar las tareas con Google Tasks | EP-12 | Should | 5 | Borrador |
| [HU-04.04](../historias/EP-04-configuracion/HU-04.04-configurar-integraciones-google.md) | Historia | Configurar la carpeta de Drive y la sincronización con Google | EP-04 | Should | 3 | Borrador |

**Total comprometido:** 27 puntos.

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
| HU-12.01 | `docs/qa/test-cases/TC-HU-12.01.md` (por redactar) | | | | |
| HU-12.02 | `docs/qa/test-cases/TC-HU-12.02.md` (por redactar) | | | | |
| HU-12.03 | `docs/qa/test-cases/TC-HU-12.03.md` (por redactar) | | | | |
| HU-12.04 | `docs/qa/test-cases/TC-HU-12.04.md` (por redactar) | | | | |
| HU-12.05 | `docs/qa/test-cases/TC-HU-12.05.md` (por redactar) | | | | |
| HU-04.04 | `docs/qa/test-cases/TC-HU-04.04.md` (por redactar) | | | | |

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
