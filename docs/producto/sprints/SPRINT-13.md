---
id: SPRINT-13
nombre: "Notificaciones y calidad final (H9)"
hito: H9
estado: Por iniciar
puntos_comprometidos: 10
fecha_creacion: 2026-10-20
fecha_edicion: 2026-10-20
---

# SPRINT-13 · Notificaciones y calidad final (H9)

## Objetivo del sprint
Lighthouse PWA aprobado, sin errores de axe y con notificaciones push.

## Sprint backlog

| PBI | Tipo | Título | Épica | MoSCoW | Pts | Estado |
|---|---|---|---|---|---|---|
| [HU-16.03](../historias/EP-16-pwa-y-notificaciones/HU-16.03-recibir-notificaciones-push.md) | Historia | Recibir notificaciones push | EP-16 | Should | 5 | Borrador |
| [HU-16.04](../historias/EP-16-pwa-y-notificaciones/HU-16.04-cumplir-accesibilidad-y-rendimiento.md) | Historia no funcional | Cumplir los umbrales de accesibilidad y rendimiento en toda la plataforma | EP-16 | Must | 5 | Borrador |

**Total comprometido:** 10 puntos.

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
| HU-16.03 | `docs/qa/test-cases/TC-HU-16.03.md` (por redactar) | | | | |
| HU-16.04 | `docs/qa/test-cases/TC-HU-16.04.md` (por redactar) | | | | |

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
