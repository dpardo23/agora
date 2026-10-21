---
id: EP-03
titulo: Acceso y seguridad
sprints: [SPRINT-02, SPRINT-03]
puntos_hu: 24
fecha_creacion: 2026-10-20
fecha_edicion: 2026-10-20
version: "1.0"
estado: Abierta
---

# EP-03 · Acceso y seguridad

## Objetivo
Que solo el titular entre a la plataforma: usuario y contraseña, segundo factor por Gmail en dispositivos nuevos, recuperación y cierre de sesión. Incluye el esquema de datos con RLS sobre el que se apoya todo.

## PBI de la épica

| PBI | Tipo | Título | Sprint | MoSCoW | Pts |
|---|---|---|---|---|---|
| T-03 | Historia técnica | Corregir y aplicar la migración 0001 con RLS, Realtime y tipos generados | SPRINT-02 | Must | 8 |
| T-04 | Chore | Crear la semilla de datos de ejemplo para desarrollo y QA | SPRINT-02 | Must | 3 |
| T-10 | Spike | Elegir el canal de envío de correo transaccional (Gmail API o proveedor SMTP) | SPRINT-02 | Must | 2 |
| [HU-03.01](../historias/EP-03-acceso-y-seguridad/HU-03.01-iniciar-sesion-con-usuario.md) | Historia | Iniciar sesión con usuario y contraseña | SPRINT-02 | Must | 5 |
| [HU-03.02](../historias/EP-03-acceso-y-seguridad/HU-03.02-verificar-dispositivo-nuevo.md) | Historia | Verificar un dispositivo nuevo con un código enviado a Gmail | SPRINT-02 | Must | 8 |
| [HU-03.03](../historias/EP-03-acceso-y-seguridad/HU-03.03-recordar-dispositivo-confiable.md) | Historia | Recordar un dispositivo de confianza durante 30 días | SPRINT-02 | Must | 3 |
| [HU-03.04](../historias/EP-03-acceso-y-seguridad/HU-03.04-recuperar-acceso.md) | Historia | Recuperar el acceso con un código enviado a Gmail | SPRINT-03 | Must | 5 |
| [HU-03.05](../historias/EP-03-acceso-y-seguridad/HU-03.05-cerrar-sesion.md) | Historia | Cerrar sesión en este dispositivo o en todos | SPRINT-03 | Must | 3 |

## Criterio de cierre
Flujo completo (login, 2FA, recordar dispositivo, recuperar, cerrar sesión) automatizado en Playwright y en verde; advisors de Supabase sin errores.

## Referencias
- Diseño: `docs/design.md`
- Especificación: `docs/referencia/handoff/CONTEXTO.md`
- Backlog: `docs/producto/backlog.md`
