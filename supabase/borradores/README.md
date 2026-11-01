# supabase/borradores

Borradores del esquema que todavía **no son migraciones**. La CLI de Supabase y el CD solo aplican lo que está en `supabase/migrations/`, así que nada de esta carpeta llega a la base local ni a la nube.

| Archivo | Qué es | Cuándo pasa a ser migración |
|---|---|---|
| `0001_init.sql` | Esquema inicial completo (tipos, tablas, RLS) para revisar | T-03 (SPRINT-03): se revisa, se divide en migraciones con `supabase migration new` y se le agregan los GRANT explícitos y el revoke de `public.rls_auto_enable()` (backlog, T-03) |
| `seed.sql` | Semilla de la oficina (salas de la planta 1) | Junto con las tablas que usa; entonces se vuelve a activar `[db.seed]` en `supabase/config.toml` |

Se movieron aquí en T-12 porque, en cuanto existe `supabase/config.toml`, el CD aplica en `agora-dev` todo lo que haya en `supabase/migrations/`, y una migración aplicada ya no se puede editar.
