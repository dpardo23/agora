# Avisos de terceros

Autor y titular del proyecto: Juan Diego Pardo Pozo. Fecha: 2026-10-20.

La licencia propietaria de `LICENSE` cubre solo la obra original de Ágora. Los componentes de terceros que siguen se incluyen en el repositorio con sus propias licencias, que se respetan y prevalecen sobre `LICENSE` en lo que a ellos se refiere. No son obra del titular del proyecto.

## Skills del entorno de desarrollo (`.claude/skills/`)

Son guías de desarrollo instaladas sin modificaciones desde sus repositorios de origen; las versiones exactas están en `skills-lock.json`.

| Carpeta | Origen | Licencia |
|---|---|---|
| `caveman` | github.com/juliusbrussee/caveman | Apache-2.0 |
| `nextjs-app-router-patterns` | github.com/wshobson/agents | MIT |
| `pixel-art-sprites` | github.com/omer-metin/skills-for-antigravity | Apache-2.0 |
| `playwright-cli` | github.com/microsoft/playwright-cli | Apache-2.0 |
| `security-and-hardening` | github.com/addyosmani/agent-skills | MIT |
| `shadcn` | github.com/shadcn-ui/ui | MIT |
| `supabase`, `supabase-postgres-best-practices` | github.com/supabase/agent-skills | MIT |
| `tanstack-query` | github.com/tanstack-skills/tanstack-skills | MIT |
| `uv` | github.com/astral-sh/claude-code-plugins | Apache-2.0 |
| `vercel-react-best-practices`, `web-design-guidelines` | github.com/vercel-labs/agent-skills | MIT (según los metadatos de la skill) |
| `vitest` | github.com/antfu/skills | MIT |
| `webapp-testing` | github.com/anthropics/skills | Apache-2.0 (texto completo en `.claude/skills/webapp-testing/LICENSE.txt`) |

Las skills propias del proyecto (`escribir-hu`, `escribir-tc`, `reportar-bug` y `portar-pantalla`) son obra original y están cubiertas por `LICENSE`.

## Dependencias de la aplicación

Cuando exista `apps/web/package.json` (SPRINT-00) y `worker/pyproject.toml` (SPRINT-06), sus dependencias se regirán por sus propias licencias. Este archivo se actualizará con un resumen generado por herramienta (por ejemplo, `pnpm licenses list`) antes de cada release.

## Tipografías

Bricolage Grotesque, Geist, Geist Mono y Pixelify Sans se distribuyen bajo la SIL Open Font License 1.1 y se cargan con `next/font`.
