---
paths:
  - "supabase/**"
  - "apps/web/src/server/**"
  - "worker/**/adaptadores/supabase*"
---

# Reglas de datos (Supabase)

- Antes de crear o cambiar tablas, políticas o consultas, carga `supabase-postgres-best-practices`. Para Auth, Storage, Realtime o el cliente, carga `supabase`.
- Activa RLS en todas las tablas con `user_id = auth.uid()`.
- `SUPABASE_SERVICE_ROLE_KEY` solo se usa en `apps/web/src/server/` y en el worker. Nunca en componentes ni en código del cliente.
- Nunca edites una migración que ya se aplicó: crea una nueva.
- Después de cada migración, regenera los tipos y revisa los advisors.
- Si tocas autenticación, sesiones o datos sensibles, carga también `security-and-hardening`.
- Modelo del Olimpo: `dioses`, `roles`, `asignaciones_rol` y `pipeline_pasos` (ADR-005). Cada rol del pipeline siempre tiene un dios titular.
- Prueba las políticas RLS con pgTAP en `supabase/tests/`.
