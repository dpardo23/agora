---
id: SPRINT-07
nombre: "Consumo bajo control (H6)"
hito: H6
estado: Por iniciar
puntos_comprometidos: 36
fecha_creacion: 2026-10-20
fecha_edicion: 2026-10-20
---

# SPRINT-07 · Consumo bajo control (H6)

## Objetivo del sprint
La pestaña Consumo muestra datos reales de cupo, gasto y VM; los dioses se pueden configurar.

## Sprint backlog

| PBI | Tipo | Título | Épica | MoSCoW | Pts | Estado |
|---|---|---|---|---|---|---|
| [HU-08.01](../historias/EP-08-consumo-e-infraestructura/HU-08.01-consultar-cupo-y-gasto.md) | Historia | Consultar el cupo de Claude y el gasto del Olimpo | EP-08 | Must | 5 | Borrador |
| [HU-08.02](../historias/EP-08-consumo-e-infraestructura/HU-08.02-vigilar-la-vm.md) | Historia | Vigilar el estado de la VM y el riesgo de reclamo | EP-08 | Must | 5 | Borrador |
| [HU-08.03](../historias/EP-08-consumo-e-infraestructura/HU-08.03-consultar-gasto-por-paso-y-documento.md) | Historia | Consultar el gasto por paso y por documento | EP-08 | Should | 3 | Borrador |
| [HU-08.04](../historias/EP-08-consumo-e-infraestructura/HU-08.04-limpiar-cache-de-fuentes.md) | Historia | Limpiar la caché de fuentes de la VM | EP-08 | Should | 2 | Borrador |
| [HU-05.06](../historias/EP-05-oficina-del-olimpo/HU-05.06-configurar-un-dios.md) | Historia | Configurar el motor, los límites y las instrucciones de un rol | EP-05 | Should | 5 | Borrador |
| [HU-05.07](../historias/EP-05-oficina-del-olimpo/HU-05.07-recorrer-dos-plantas.md) | Historia | Recorrer las dos plantas del Olimpo cuando hay más agentes | EP-05 | Could | 8 | Borrador |
| [HU-05.08](../historias/EP-05-oficina-del-olimpo/HU-05.08-gestionar-dioses-y-roles.md) | Historia | Gestionar los dioses del Olimpo y asignarles roles | EP-05 | Should | 5 | Borrador |
| T-09 | Spike | Elegir el motor de imágenes del Ilustrador (Iris) | EP-05 | Could | 3 | Borrador |

**Total comprometido:** 36 puntos.

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
| HU-08.01 | `docs/qa/test-cases/TC-HU-08.01.md` (por redactar) | | | | |
| HU-08.02 | `docs/qa/test-cases/TC-HU-08.02.md` (por redactar) | | | | |
| HU-08.03 | `docs/qa/test-cases/TC-HU-08.03.md` (por redactar) | | | | |
| HU-08.04 | `docs/qa/test-cases/TC-HU-08.04.md` (por redactar) | | | | |
| HU-05.06 | `docs/qa/test-cases/TC-HU-05.06.md` (por redactar) | | | | |
| HU-05.07 | `docs/qa/test-cases/TC-HU-05.07.md` (por redactar) | | | | |
| HU-05.08 | `docs/qa/test-cases/TC-HU-05.08.md` (por redactar) | | | | |

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
