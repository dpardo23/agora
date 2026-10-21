# Ágora · plataforma universitaria personal

PWA de un solo usuario: Juan Diego Pardo Pozo (`dpardo23`), Ingeniería de Sistemas, UMSS, FCyT. Su centro es **el Olimpo**: un sistema de agentes que genera documentos de estudio en PDF y se muestra como una oficina donde cada agente es un dios griego que siempre está en movimiento. Alrededor están tareas, materias, malla, agenda, repaso, pomodoro y avisos. La marca visible es **Ágora** (con tilde; en mayúsculas, ÁGORA). El repositorio, la carpeta y los identificadores de código usan `agora` (sin tilde).

## Forma de trabajo
- Scrum sin fechas: épicas → HU → backlog → sprint. En cada sprint: **test cases → código → bug reports**, y cada sprint entrega algo funcional.
- **Antes de escribir código, propón un plan y espera la aprobación del titular.** Avanza paso a paso.
- Sprint siguiente: `docs/producto/sprints/SPRINT-00.md`. Al implementar una HU, lee primero su archivo y su TC.
- El Olimpo es **escalable**: dioses y roles están separados y un dios puede tener varios roles (ADR-005). Ningún código ata un rol a un dios concreto.

## Autoría (obligatorio)
- Documentos, commits, PR y comentarios nombran como autor o responsable **solo** a Juan Diego Pardo Pozo (`dpardo23`, jdiegopardo23@gmail.com).
- Nunca se menciona una herramienta de IA ni un asistente como autor o colaborador. Tampoco se agregan líneas `Co-Authored-By` ni enlaces de sesión en los commits.
- Los modelos que usa el producto (Claude y Gemini como motores de los roles) sí se nombran: son datos del sistema.

## Comunicación
- El chat va siempre en modo caveman (skill `caveman`; lo activa el hook `SessionStart` de `.claude/settings.json`), en español y con ortografía completa.
- Lo que se persiste (código, comentarios, documentos, commits, memoria) va en **prosa completa**.

## Stack (ADR-001, ADR-002)
| Capa | Tecnología |
|---|---|
| Web | Next.js 16 (App Router) + React 19 + TypeScript estricto, Tailwind v4, shadcn/ui (Radix), TanStack Query, React Hook Form + Zod, Serwist, `next/font`, date-fns(-tz), ts-fsrs. Despliegue en Vercel |
| API | REST versionada `/api/v1` (Route Handlers), con contrato OpenAPI generado desde Zod (`docs/api.md`) |
| Datos | Supabase: Postgres + RLS, Auth, Storage, Realtime, pgvector, cola de trabajos (`@supabase/ssr`) |
| Motor de agentes | Paquete Python `umss` en una Oracle VM ARM, con `uv`, arquitectura hexagonal y roles como plugins |
| Automatización | n8n en la VM, con webhooks firmados |
| Pruebas | Vitest + Testing Library, Playwright + axe, Lighthouse CI, pgTAP, pytest |

## Comandos (a partir de SPRINT-00)
- `pnpm -C apps/web dev` · `pnpm lint` · `pnpm typecheck` · `pnpm test:unit` · `pnpm test:e2e`
- `supabase start` · `supabase db reset` · `supabase test db`
- `uv run pytest` (en `worker/`) · `python scripts/verificar-docs.py` (enlaces, autoría y formato de la documentación)

## Mapa del repositorio
- `apps/web/src/` web (`app/`, `features/<dominio>/`, `components/ui/`, `shared/`, `server/`) · `worker/` motor de agentes · `supabase/` · `n8n/` · `infra/` · `scripts/`
- `design/pantallas/*.dc.html` diseño fuente · `design/mockups/*.png` capturas · `design/mockups/anotados/` mockups con marcas por HU · `design/referencias/oficina-olimpo.png` ambientación · `design/fuente/agora.html` export local (no versionado)

## Documentación (se lee cuando hace falta)
- Arquitectura: `docs/arquitectura.md` · decisiones: `docs/adr/` · rutas y API: `docs/api.md` · accesibilidad: `docs/accesibilidad.md` (WCAG 2.2 AA)
- Sistema de diseño: `docs/design.md` (Oficina del Olimpo en la sección 8)
- Producto: `docs/producto/vision.md`, `backlog.md`, `epicas/`, `historias/EP-XX-*/HU-XX.YY-*.md`, `sprints/`
- QA: `docs/qa/plan-pruebas.md`, `matriz-trazabilidad.md`, `test-cases/`, `bugs/`
- Plantillas: `docs/plantillas/` · guías de redacción de la materia: `docs/referencia/guias-calidad/`
- Flujo de Git, commits y releases: `CONTRIBUTING.md`
- Especificación original (histórica; ante diferencias mandan los ADR): `docs/referencia/handoff/CONTEXTO.md`

## Cuándo usar cada skill
| Situación | Skills |
|---|---|
| Escribir o editar HU, TC o bugs | `escribir-hu`, `escribir-tc`, `reportar-bug` |
| Implementar la interfaz de una HU desde su mockup | `portar-pantalla` + `nextjs-app-router-patterns`, `vercel-react-best-practices`, `shadcn` |
| Datos del servidor en el cliente, caché, Realtime | `tanstack-query` |
| Tablas, RLS, migraciones, SQL, Realtime, Auth, Storage | `supabase-postgres-best-practices`, `supabase` |
| Login, 2FA, sesiones, secretos, contenido externo, API | `security-and-hardening` (+ subagente `security-reviewer`) |
| Sprites, animación y escena del Olimpo | `pixel-art-sprites` |
| Pruebas unitarias y de componentes | `vitest` |
| E2E, capturas, depurar en el navegador | `playwright-cli`, `webapp-testing` |
| Revisión de UI y accesibilidad | `web-design-guidelines` |
| Motor de agentes (Python) | `uv` |
| Revisión de documentos de QA | subagente `qa-reviewer` |

Las reglas de `.claude/rules/` se cargan solas al tocar cada zona del repositorio (web, API, datos, worker, documentos, Olimpo, Git).

## Reglas no negociables
- RLS en todas las tablas (`user_id = auth.uid()`). La service role solo se usa en `apps/web/src/server/` y en la VM.
- Toda escritura con reglas de negocio pasa por `/api/v1` con validación Zod. Un cambio incompatible crea `/v2`.
- Un módulo de `src/features/` solo importa la API pública (`index.ts`) de otro módulo.
- La web nunca compila LaTeX ni llama a modelos para generar documentos: inserta trabajos y escucha Realtime.
- Las verificaciones del motor (citas literales, DOI, barrera de entrega, recetas de LaTeX) no se tocan. Regla «entrega completa a la primera».
- Interfaz en español de Bolivia, `America/La_Paz`, coma decimal, sin emoji (iconos Lucide). Texto sobre pastel siempre `#0B0B0B`.
- Los datos entre corchetes del diseño (`[aula]`) vienen de la base de datos; nunca se inventan. El correo se muestra enmascarado: `jdiego•••@gmail.com`.
- Nunca edites una migración aplicada. Ramas, commits y PR según `CONTRIBUTING.md`; nada directo a `main` ni a `develop`.
