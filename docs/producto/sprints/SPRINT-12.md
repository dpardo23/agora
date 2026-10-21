---
id: SPRINT-12
nombre: "Inicio e instalación (H8 + H9)"
hito: H8 + H9
estado: Por iniciar
puntos_comprometidos: 21
fecha_creacion: 2026-10-20
fecha_edicion: 2026-10-20
---

# SPRINT-12 · Inicio e instalación (H8 + H9)

## Objetivo del sprint
El dashboard muestra datos reales y la plataforma se instala como app.

## Sprint backlog

| PBI | Tipo | Título | Épica | MoSCoW | Pts | Estado |
|---|---|---|---|---|---|---|
| [HU-15.01](../historias/EP-15-inicio/HU-15.01-consultar-resumen-del-dia.md) | Historia | Consultar el resumen del día en el inicio | EP-15 | Must | 8 | Borrador |
| [HU-15.02](../historias/EP-15-inicio/HU-15.02-buscar-y-ejecutar-con-ctrl-k.md) | Historia | Buscar y ejecutar acciones con Ctrl K | EP-15 | Should | 5 | Borrador |
| [HU-16.01](../historias/EP-16-pwa-y-notificaciones/HU-16.01-instalar-como-aplicacion.md) | Historia | Instalar la plataforma como aplicación | EP-16 | Must | 3 | Borrador |
| [HU-16.02](../historias/EP-16-pwa-y-notificaciones/HU-16.02-usar-sin-conexion.md) | Historia | Abrir pantallas y documentos sin conexión | EP-16 | Should | 5 | Borrador |

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
| HU-15.01 | `docs/qa/test-cases/TC-HU-15.01.md` (por redactar) | | | | |
| HU-15.02 | `docs/qa/test-cases/TC-HU-15.02.md` (por redactar) | | | | |
| HU-16.01 | `docs/qa/test-cases/TC-HU-16.01.md` (por redactar) | | | | |
| HU-16.02 | `docs/qa/test-cases/TC-HU-16.02.md` (por redactar) | | | | |

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
