---
id: EP-07
titulo: Motor de agentes
sprints: [SPRINT-06]
puntos_hu: 21
fecha_creacion: 2026-10-20
fecha_edicion: 2026-10-20
version: "1.0"
estado: Abierta
---

# EP-07 · Motor de agentes

## Objetivo
Conectar el worker `umss` de la VM a Supabase sin tocar sus verificaciones, para que procese la cola y publique su avance.

## PBI de la épica

| PBI | Tipo | Título | Sprint | MoSCoW | Pts |
|---|---|---|---|---|---|
| T-07 | Chore | Preparar la VM de Oracle (systemd, TeX Live, credenciales, respaldos) | SPRINT-06 | Must | 5 |
| [HU-07.01](../historias/EP-07-motor-de-agentes/HU-07.01-procesar-encargos-desde-la-cola.md) | Historia | Procesar encargos desde la cola de Supabase | SPRINT-06 | Must | 8 |
| [HU-07.02](../historias/EP-07-motor-de-agentes/HU-07.02-publicar-eventos-de-agentes.md) | Historia | Publicar el avance del pipeline como eventos de los agentes | SPRINT-06 | Must | 5 |
| [HU-07.03](../historias/EP-07-motor-de-agentes/HU-07.03-entregar-pdf.md) | Historia | Entregar el PDF en Storage y en Google Drive | SPRINT-06 | Must | 5 |
| [HU-07.04](../historias/EP-07-motor-de-agentes/HU-07.04-registrar-uso-de-modelos.md) | Historia | Registrar el uso de modelos en cada llamada | SPRINT-06 | Must | 3 |

## Criterio de cierre
El trabajo 13 se regenera desde la web y pasa las mismas verificaciones que en la laptop.

## Referencias
- Diseño: `docs/design.md`
- Especificación: `docs/referencia/handoff/CONTEXTO.md`
- Backlog: `docs/producto/backlog.md`
