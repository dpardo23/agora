---
id: ADR-001
titulo: La web se construye con Next.js 16, React 19 y TypeScript sobre Supabase
estado: Aceptada
fecha: 2026-10-20
autor: Juan Diego Pardo Pozo
---

# ADR-001 · Stack de la web: Next.js 16 + Supabase

## Contexto
Primero se evaluó Nuxt (Vue) porque el usuario tiene preferencia por Vue. Esa preferencia no era una restricción. El 2026-10-20 se compararon las alternativas según cuatro criterios: rendimiento, librerías disponibles, cantidad de ejemplos y documentación, y capacidad de crecer con el proyecto (la Oficina del Olimpo es escalable, ADR-005).

## Decisión

| Capa | Tecnología |
|---|---|
| Framework | **Next.js 16** (App Router) + **React 19** + **TypeScript** estricto |
| Estilos | Tailwind CSS v4, con tokens en `src/app/globals.css` (`docs/design.md`, sección 2) |
| Componentes | **shadcn/ui** (código propio sobre Radix), iconos `lucide-react` |
| Estado del servidor | TanStack Query v5 (caché, reintentos, Realtime → invalidación) |
| Estado del cliente | Estado local de React; Zustand solo si dos ramas lejanas comparten estado |
| Formularios y validación | React Hook Form + **Zod** (los mismos esquemas en el cliente y en la API) |
| API | Route Handlers en `src/app/api/v1/**`, con contrato OpenAPI generado desde Zod (`docs/api.md`) |
| Datos y autenticación | **Supabase** (`@supabase/ssr`): Postgres + RLS, Auth, Realtime, Storage y pgvector |
| Fuentes | `next/font` (Bricolage Grotesque, Geist, Geist Mono, Pixelify Sans) |
| PWA | Serwist (`@serwist/next`) |
| Fechas y repaso | date-fns + date-fns-tz, ts-fsrs |
| Pruebas | Vitest + Testing Library, Playwright, `@axe-core/playwright`, Lighthouse CI |
| Calidad de código | ESLint (con `eslint-plugin-boundaries` para los límites entre módulos), Prettier, TypeScript `strict` |
| Despliegue | Vercel (una preview por PR, producción desde `main`) |

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **Next.js + Supabase** | Ecosistema más grande; guías oficiales de Supabase pensadas primero para Next; shadcn/ui como base del kit; Vercel nativo; más ejemplos y más mano de obra con experiencia | Más conceptos que aprender (Server y Client Components, caché) |
| Nuxt 4 + Supabase | Sintaxis cercana a los `.dc.html`; preferencia inicial del usuario | Menos ejemplos y librerías; el kit hay que armarlo a mano |
| Next.js + API propia en FastAPI | Contrato de API separado, mismo lenguaje que el worker | Un servicio más que alojar; la VM es frágil (puede ser reclamada) |
| SvelteKit | Muy liviano | Ecosistema chico para este alcance |

En rendimiento, React y Vue son equivalentes para esta aplicación: la parte más pesada, la oficina, se dibuja en canvas (ADR-004).

## Consecuencias
- `docs/referencia/handoff/` queda como referencia histórica; el handoff original ya estaba escrito para Next.
- Skills del proyecto para la web: `nextjs-app-router-patterns`, `vercel-react-best-practices`, `shadcn`, `tanstack-query`.
- Cambiar de framework en el futuro exige un ADR nuevo que reemplace a este.
