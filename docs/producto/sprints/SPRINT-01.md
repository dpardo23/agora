---
id: SPRINT-01
nombre: "Kit de interfaz (H1)"
hito: H1
estado: Por iniciar
puntos_comprometidos: 34
fecha_creacion: 2026-10-20
fecha_edicion: 2026-10-20
---

# SPRINT-01 · Kit de interfaz (H1)

## Objetivo del sprint
Todos los estados de `Controles` y `ControlesMovil` reproducidos y documentados en una página de muestras (`/dev/kit`, solo en desarrollo).

## Sprint backlog

| PBI | Tipo | Título | Épica | MoSCoW | Pts | Estado |
|---|---|---|---|---|---|---|
| [HU-02.01](../historias/EP-02-kit-de-interfaz/HU-02.01-accionar-botones-con-estados.md) | Historia | Accionar botones con estados consistentes | EP-02 | Must | 3 | Borrador |
| [HU-02.02](../historias/EP-02-kit-de-interfaz/HU-02.02-ingresar-datos-con-validacion.md) | Historia | Ingresar datos en campos con validación visible | EP-02 | Must | 5 | Borrador |
| [HU-02.03](../historias/EP-02-kit-de-interfaz/HU-02.03-elegir-opciones-en-desplegables.md) | Historia | Elegir opciones en select, combobox, multiselección y menú contextual | EP-02 | Must | 8 | Borrador |
| [HU-02.04](../historias/EP-02-kit-de-interfaz/HU-02.04-elegir-fecha-y-hora.md) | Historia | Elegir fecha y hora con el selector | EP-02 | Must | 5 | Borrador |
| [HU-02.05](../historias/EP-02-kit-de-interfaz/HU-02.05-recibir-retroalimentacion.md) | Historia | Recibir retroalimentación con toasts, progreso, esqueletos y estados vacíos | EP-02 | Must | 5 | Borrador |
| [HU-02.06](../historias/EP-02-kit-de-interfaz/HU-02.06-abrir-dialogos-adaptables.md) | Historia | Abrir diálogos como modal o como hoja inferior según el dispositivo | EP-02 | Must | 5 | Borrador |
| [HU-02.07](../historias/EP-02-kit-de-interfaz/HU-02.07-adjuntar-archivos-arrastrando.md) | Historia | Adjuntar archivos arrastrándolos o pegando un enlace o DOI | EP-02 | Should | 3 | Borrador |

**Total comprometido:** 34 puntos.

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
| HU-02.01 | `docs/qa/test-cases/TC-HU-02.01.md` (por redactar) | | | | |
| HU-02.02 | `docs/qa/test-cases/TC-HU-02.02.md` (por redactar) | | | | |
| HU-02.03 | `docs/qa/test-cases/TC-HU-02.03.md` (por redactar) | | | | |
| HU-02.04 | `docs/qa/test-cases/TC-HU-02.04.md` (por redactar) | | | | |
| HU-02.05 | `docs/qa/test-cases/TC-HU-02.05.md` (por redactar) | | | | |
| HU-02.06 | `docs/qa/test-cases/TC-HU-02.06.md` (por redactar) | | | | |
| HU-02.07 | `docs/qa/test-cases/TC-HU-02.07.md` (por redactar) | | | | |

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
