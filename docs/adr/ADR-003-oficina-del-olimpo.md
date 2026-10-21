---
id: ADR-003
titulo: La sección de agentes se llama Olimpo y cada agente es un dios griego en movimiento continuo
estado: Aceptada
fecha: 2026-10-20
autor: Juan Diego Pardo Pozo
---

# ADR-003 · Oficina del Olimpo

## Contexto
El diseño original (`design/pantallas/Main.dc.html`) llama «Bot» a la sección y dibuja una oficina genérica. El titular definió el 2026-10-20 una dirección nueva (`design/referencias/oficina-olimpo.png`): un templo-oficina en las nubes con salas temáticas, donde cada agente es un dios y **los dioses siempre están en movimiento**. También definió que «Bot» no es el nombre correcto de la sección.

## Decisión
1. **Nombre.** La sección se llama **Olimpo** (ruta `/olimpo`), con las pestañas **Oficina** (`/olimpo`) y **Consumo** (`/olimpo/consumo`). El sistema de agentes que genera los documentos es «el Olimpo». El paquete Python que lo ejecuta es el «motor de agentes» (`worker/`).
2. **Panteón.** Se aprueba la asignación de dioses, salas y paleta de `docs/design.md`, sección 8, incluidas las salas Ágora y Tribunal de Temis.
3. **Movimiento.** Los dioses nunca quedan inmóviles. Con `prefers-reduced-motion` se aplica la **opción C**: siguen caminando entre estaciones, pero a la mitad de la velocidad y sin gestos periódicos, destellos ni brillos.
4. **Escalabilidad.** Dioses y roles son entidades separadas: un dios puede tener varios roles y se pueden sumar dioses o roles nuevos sin tocar el código del render (ADR-005).
5. **Interfaz.** La estructura de `Main.dc.html` se mantiene (panel del dios, pipeline, registro, documentos, nuevo encargo); cambian la escena, los sprites y los nombres.

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| Mantener «Bot» y la oficina genérica | Ya dibujada | El titular la descartó |
| **Olimpo con dioses** | Identidad fuerte, salas con significado, coincide con el nombre del repositorio | Hay que crear sprites y escena nuevos |
| Movimiento reducido sin caminatas (opción A) | Máxima accesibilidad | Contradice la identidad de la oficina |

## Consecuencias
- Los textos del diseño que dicen «Bot» se leen como «Olimpo» (`docs/design.md`, sección 13).
- Las HU de la épica EP-05 se diseñan con detalle visual en su sprint (fondo, sprites, animaciones), con el spike T-05 como primer paso.
