---
id: EP-08
titulo: Consumo e infraestructura
sprints: [SPRINT-07]
puntos_hu: 15
fecha_creacion: 2026-10-20
fecha_edicion: 2026-10-20
version: "1.0"
estado: Abierta
---

# EP-08 · Consumo e infraestructura

## Objetivo
Que el dueño del Olimpo vea cuánto cupo y dinero equivalente consume el Olimpo y en qué estado está la VM, para evitar sorpresas y el reclamo de Oracle.

## PBI de la épica

| PBI | Tipo | Título | Sprint | MoSCoW | Pts |
|---|---|---|---|---|---|
| [HU-08.01](../historias/EP-08-consumo-e-infraestructura/HU-08.01-consultar-cupo-y-gasto.md) | Historia | Consultar el cupo de Claude y el gasto del Olimpo | SPRINT-07 | Must | 5 |
| [HU-08.02](../historias/EP-08-consumo-e-infraestructura/HU-08.02-vigilar-la-vm.md) | Historia | Vigilar el estado de la VM y el riesgo de reclamo | SPRINT-07 | Must | 5 |
| [HU-08.03](../historias/EP-08-consumo-e-infraestructura/HU-08.03-consultar-gasto-por-paso-y-documento.md) | Historia | Consultar el gasto por paso y por documento | SPRINT-07 | Should | 3 |
| [HU-08.04](../historias/EP-08-consumo-e-infraestructura/HU-08.04-limpiar-cache-de-fuentes.md) | Historia | Limpiar la caché de fuentes de la VM | SPRINT-07 | Should | 2 |

## Criterio de cierre
La pestaña Consumo muestra datos reales de `uso_modelo`, `metricas_vm` y `servicios_estado`.

## Referencias
- Diseño: `docs/design.md`
- Especificación: `docs/referencia/handoff/CONTEXTO.md`
- Backlog: `docs/producto/backlog.md`
