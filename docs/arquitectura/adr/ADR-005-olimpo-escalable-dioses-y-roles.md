---
id: ADR-005
titulo: Dioses y roles son entidades separadas para que el Olimpo crezca sin reescribirse
estado: Aceptada
fecha: 2026-10-20
autor: Juan Diego Pardo Pozo
---

# ADR-005 · Olimpo escalable: dioses y roles desacoplados

## Contexto
El Olimpo va a crecer: entrarán dioses nuevos y un mismo dios podrá **reciclarse**, es decir, asumir más de una tarea. Si el código atara «un agente = un dios = un paso», cada cambio obligaría a tocar la base de datos, el worker, la escena y la interfaz a la vez. Eso es justo el tipo de cambio que rompe un sistema en una actualización.

## Decisión

### Modelo
| Entidad | Qué es | Ejemplo |
|---|---|---|
| **Rol** (`roles`) | Una capacidad del sistema, con su motor, su configuración y su *handler* en el worker | `redactar`, `verificar_citas`, `compilar_latex` |
| **Dios** (`dioses`) | La persona visible en el Olimpo: nombre, sprite, paleta, sala y escritorio | Apolo, Temis, Hefesto |
| **Asignación** (`asignaciones_rol`) | Qué roles ejerce cada dios (de muchos a muchos), con prioridad | Temis → `verificar_citas`, `barrera_entrega` |
| **Paso del pipeline** (`pipeline_pasos`) | Orden de los pasos de un tipo de trabajo; cada paso apunta a un **rol**, no a un dios | Paso 5 → `verificar_citas` |

### Reglas
1. El pipeline y el worker hablan de **roles**. Qué dios lo ejecuta se resuelve en tiempo de ejecución con `asignaciones_rol`.
2. Un rol tiene **un solo dios titular** a la vez; un dios puede tener **N roles**. Reasignar un rol no cambia el pipeline.
3. Los eventos (`eventos_agente`) registran el `dios_id` y el `rol_id`, para que la escena anime al dios y el panel muestre qué rol ejecutó.
4. La escena, las salas y los escritorios son **datos** (`oficina_salas`, `dioses.sala_id`, `dioses.escritorio`). Un dios nuevo aparece sin cambiar código.
5. Los sprites se describen como datos (mapa de caracteres + paleta + atributos). Un dios nuevo es una entrada nueva en el catálogo de sprites.
6. Un rol nuevo en el worker es un *handler* registrado por nombre (`@registrar_rol("nombre")`). El núcleo no cambia.
7. Ningún componente de la interfaz tiene condiciones del tipo `if (dios === 'zeus')`. El comportamiento especial (por ejemplo, que el dios con rol `orquestar` muestre el formulario de encargo) se decide por **rol**.
8. Retirar un dios exige reasignar antes sus roles. La base de datos lo impide con una restricción.

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| Un agente = un dios = un rol (modelo del handoff) | Simple | Cada cambio toca todo el sistema; no permite reciclar dioses |
| **Dioses y roles separados** | Crecer y reciclar sin reescribir; configuración por datos | Una tabla y una resolución más |

## Consecuencias
- La migración (T-03) crea `dioses`, `roles`, `asignaciones_rol` y `pipeline_pasos` en lugar de una sola tabla `agentes`.
- HU-05.08 cubre la gestión de dioses y roles desde la interfaz.
- Toda HU nueva de la épica EP-05 debe verificar que no ata un rol a un dios concreto.
