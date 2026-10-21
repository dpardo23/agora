---
id: SPRINT-00
nombre: "Cimientos navegables (H0)"
hito: H0
estado: Siguiente
puntos_comprometidos: 19
fecha_creacion: 2026-10-20
fecha_edicion: 2026-10-20
---

# SPRINT-00 · Cimientos navegables (H0)

## Objetivo del sprint
Abrir la web, navegar por las 17 rutas vacías en ambos temas y en tres anchos.

## Sprint backlog

| PBI | Tipo | Título | Épica | MoSCoW | Pts | Estado |
|---|---|---|---|---|---|---|
| T-01 | Historia técnica | Crear el proyecto Next.js 16 con TypeScript estricto, Tailwind v4, tokens y fuentes | EP-01 | Must | 5 | Borrador |
| T-02 | Chore | Configurar CI en GitHub Actions y previews en Vercel | EP-01 | Must | 3 | Borrador |
| [HU-01.01](../historias/EP-01-base-y-navegacion/HU-01.01-navegar-entre-secciones.md) | Historia | Navegar entre las secciones de la plataforma | EP-01 | Must | 5 | Borrador |
| [HU-01.02](../historias/EP-01-base-y-navegacion/HU-01.02-alternar-tema-claro-oscuro.md) | Historia | Alternar entre el tema claro y el oscuro sin parpadeo | EP-01 | Must | 3 | Borrador |
| [HU-01.03](../historias/EP-01-base-y-navegacion/HU-01.03-adaptar-interfaz-al-dispositivo.md) | Historia | Usar la plataforma en móvil, tablet y escritorio | EP-01 | Must | 3 | Borrador |

**Total comprometido:** 19 puntos.

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
| HU-01.01 | `docs/qa/test-cases/TC-HU-01.01.md` (por redactar) | | | | |
| HU-01.02 | `docs/qa/test-cases/TC-HU-01.02.md` (por redactar) | | | | |
| HU-01.03 | `docs/qa/test-cases/TC-HU-01.03.md` (por redactar) | | | | |

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
