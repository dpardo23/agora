---
id: BUG-NNN
estado: Nuevo            # Nuevo → Triado → Asignado → En progreso → Corregido → Listo para QA → Verificado/Cerrado · Reabierto · Rechazado · Duplicado · No se corrige · Diferido
severidad: Alta          # Crítica | Alta | Media | Baja   (impacto técnico)
prioridad: Alta          # Urgente | Alta | Media | Baja   (urgencia de negocio)
sprint: SPRINT-NN
fecha_creacion: AAAA-MM-DD
fecha_edicion: AAAA-MM-DD
---

# BUG-NNN · [Qué falla] [dónde] [bajo qué condición]

Reglas (guía de redacción de bug reports, v1.0):

- Un reporte describe un solo defecto, reproducible paso a paso.
- Se escriben hechos observables, sin opiniones.
- El resultado actual y el esperado van enfrentados.
- Toda afirmación lleva evidencia.
- Si un campo no aplica, queda vacío.

| Campo | Valor |
|---|---|
| **ID** | BUG-NNN |
| **Estado** | Nuevo |
| **Severidad** | |
| **Prioridad** | |
| **Historia de Usuario** | HU-XX.YY Título |
| **C.A. violado** | CA-FE-0X |
| **T.C. de origen** | TC-HU-XX.YY-NN |
| **Reproducibilidad** | Siempre (5/5) · Intermitente (n/5) · Una vez |
| **Ambiente** | commit `abc123` · URL · navegador y versión · SO · ancho · tema · datos de semilla |
| **Reportado por** | |

**Descripción.** Qué ocurre, dónde y cuál es el impacto observable (de 2 a 4 oraciones). Si hay una hipótesis de causa, se marca como tal.

**Precondiciones**

- …

**Pasos para reproducir**

| Nro. | Paso | Datos de entrada |
|---|---|---|
| 1 | | |

**Resultado actual**

> Texto, estado o respuesta exactos que se observan.

**Resultado esperado**

> Lo que exige el CA violado, citado.

**Evidencias**

- `docs/qa/bugs/evidencias/BUG-NNN-1.png` · log de la consola · respuesta HTTP · consulta SQL.

### Historial

| Fecha | Estado | Nota |
|---|---|---|
