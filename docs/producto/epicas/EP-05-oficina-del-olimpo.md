---
id: EP-05
titulo: Oficina del Olimpo
sprints: [SPRINT-04, SPRINT-05, SPRINT-07]
puntos_hu: 50
fecha_creacion: 2026-10-20
fecha_edicion: 2026-10-20
version: "1.0"
estado: Abierta
---

# EP-05 · Oficina del Olimpo

## Objetivo
Mostrar el sistema de agentes como una oficina en el Olimpo donde cada agente es un dios que siempre está en movimiento y refleja en vivo lo que hace el pipeline.

## PBI de la épica

| PBI | Tipo | Título | Sprint | MoSCoW | Pts |
|---|---|---|---|---|---|
| T-05 | Spike | Diseñar la hoja de sprites de los dioses y la escena del Olimpo | SPRINT-04 | Must | 5 |
| T-06 | Historia técnica | Crear un simulador de eventos de agentes para desarrollo y demos | SPRINT-04 | Must | 3 |
| [HU-05.01](../historias/EP-05-oficina-del-olimpo/HU-05.01-ver-oficina-del-olimpo.md) | Historia | Ver la Oficina del Olimpo con cada dios en su sala | SPRINT-04 | Must | 8 |
| [HU-05.02](../historias/EP-05-oficina-del-olimpo/HU-05.02-ver-dioses-en-movimiento.md) | Historia | Ver a los dioses moverse según su estado en tiempo real | SPRINT-04 | Must | 13 |
| [HU-05.03](../historias/EP-05-oficina-del-olimpo/HU-05.03-consultar-detalle-de-un-dios.md) | Historia | Consultar el detalle de un dios seleccionado | SPRINT-04 | Must | 5 |
| [HU-05.04](../historias/EP-05-oficina-del-olimpo/HU-05.04-consultar-oficina-sin-escena.md) | Historia | Consultar la oficina sin la escena desde la lista accesible y el móvil | SPRINT-04 | Must | 3 |
| [HU-05.05](../historias/EP-05-oficina-del-olimpo/HU-05.05-pausar-agente.md) | Historia | Pausar y reanudar a un dios | SPRINT-05 | Should | 3 |
| [HU-05.06](../historias/EP-05-oficina-del-olimpo/HU-05.06-configurar-un-dios.md) | Historia | Configurar el motor, los límites y las instrucciones de un rol | SPRINT-07 | Should | 5 |
| [HU-05.07](../historias/EP-05-oficina-del-olimpo/HU-05.07-recorrer-dos-plantas.md) | Historia | Recorrer las dos plantas del Olimpo cuando hay más agentes | SPRINT-07 | Could | 8 |
| [HU-05.08](../historias/EP-05-oficina-del-olimpo/HU-05.08-gestionar-dioses-y-roles.md) | Historia | Gestionar los dioses del Olimpo y asignarles roles | SPRINT-07 | Should | 5 |
| T-09 | Spike | Elegir el motor de imágenes del Ilustrador (Iris) | SPRINT-07 | Could | 3 |

## Criterio de cierre
Un trabajo de punta a punta anima a los dioses (resueltos por rol, ADR-005) por todas sus salas y estados, con 60 fps p95 en escritorio y la lista accesible equivalente.

## Referencias
- Diseño: `docs/design.md`
- Especificación: `docs/referencia/handoff/CONTEXTO.md`
- Backlog: `docs/producto/backlog.md`
