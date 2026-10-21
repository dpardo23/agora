---
id: EP-02
titulo: Kit de interfaz
sprints: [SPRINT-01]
puntos_hu: 34
fecha_creacion: 2026-10-20
fecha_edicion: 2026-10-20
version: "1.0"
estado: Abierta
---

# EP-02 · Kit de interfaz

## Objetivo
Construir una sola vez, con todos sus estados y su accesibilidad, los componentes del diseño (`Controles` y `ControlesMovil`) para que ninguna pantalla reinvente un control.

## PBI de la épica

| PBI | Tipo | Título | Sprint | MoSCoW | Pts |
|---|---|---|---|---|---|
| [HU-02.01](../historias/EP-02-kit-de-interfaz/HU-02.01-accionar-botones-con-estados.md) | Historia | Accionar botones con estados consistentes | SPRINT-01 | Must | 3 |
| [HU-02.02](../historias/EP-02-kit-de-interfaz/HU-02.02-ingresar-datos-con-validacion.md) | Historia | Ingresar datos en campos con validación visible | SPRINT-01 | Must | 5 |
| [HU-02.03](../historias/EP-02-kit-de-interfaz/HU-02.03-elegir-opciones-en-desplegables.md) | Historia | Elegir opciones en select, combobox, multiselección y menú contextual | SPRINT-01 | Must | 8 |
| [HU-02.04](../historias/EP-02-kit-de-interfaz/HU-02.04-elegir-fecha-y-hora.md) | Historia | Elegir fecha y hora con el selector | SPRINT-01 | Must | 5 |
| [HU-02.05](../historias/EP-02-kit-de-interfaz/HU-02.05-recibir-retroalimentacion.md) | Historia | Recibir retroalimentación con toasts, progreso, esqueletos y estados vacíos | SPRINT-01 | Must | 5 |
| [HU-02.06](../historias/EP-02-kit-de-interfaz/HU-02.06-abrir-dialogos-adaptables.md) | Historia | Abrir diálogos como modal o como hoja inferior según el dispositivo | SPRINT-01 | Must | 5 |
| [HU-02.07](../historias/EP-02-kit-de-interfaz/HU-02.07-adjuntar-archivos-arrastrando.md) | Historia | Adjuntar archivos arrastrándolos o pegando un enlace o DOI | SPRINT-01 | Should | 3 |

## Criterio de cierre
Todos los estados de `Controles` y `ControlesMovil` están reproducidos en `/dev/kit` y pasan axe sin errores.

## Referencias
- Diseño: `docs/design.md`
- Especificación: `docs/referencia/handoff/CONTEXTO.md`
- Backlog: `docs/producto/backlog.md`
