---
id: ADR-002
titulo: Monolito modular en la web, API REST versionada, Supabase como datos y worker hexagonal
estado: Aceptada
fecha: 2026-10-20
autor: Juan Diego Pardo Pozo
---

# ADR-002 · Arquitectura general

## Contexto
Hay un solo usuario, pero el sistema tiene que crecer: más agentes, más pantallas y más integraciones. El trabajo pesado (modelos, LaTeX, verificaciones) ya existe en el paquete Python `umss` y corre en una VM de Oracle, que puede ser reclamada por inactividad. Una actualización no puede romper el sistema entero.

## Decisión
Hay tres piezas, y cada una tiene la arquitectura que le conviene:

| Pieza | Dónde corre | Arquitectura | Por qué |
|---|---|---|---|
| **Web** (Next.js) | Vercel | **Monolito modular por dominio** (*vertical slices*) | Cada dominio es independiente, sin capas vacías |
| **Datos** (Supabase) | Supabase Cloud | Postgres + RLS como fuente de verdad; cola de trabajos en tablas | Un solo lugar para el estado y los permisos |
| **Motor de agentes** (worker `umss`) | Oracle VM | **Hexagonal** (puertos y adaptadores) + registro de roles como *plugins* | Sus dependencias externas cambian: modelos, cola, almacenamiento, compilador |

### Web: monolito modular
```
src/features/<dominio>/
  ui/            componentes de la funcionalidad
  application/   casos de uso: orquestan validación, permisos y llamadas a infra
  domain/        tipos, reglas puras y esquemas Zod (sin dependencias de frameworks)
  infra/         acceso a Supabase o a servicios externos
  index.ts       API pública del módulo: lo único que otros módulos pueden importar
```
- Un dominio **no importa el interior de otro**, solo su `index.ts`. Lo comprueba `eslint-plugin-boundaries` en CI.
- La lógica de negocio vive en `domain/` y `application/`, nunca en componentes ni en `route.ts`.

### API
- Toda **escritura con reglas de negocio** pasa por `src/app/api/v1/**`. Cada handler valida con Zod, verifica la sesión, llama al caso de uso y responde con el formato de `docs/api.md`.
- Las **lecturas** pueden ir directo a Supabase con RLS desde Server Components o TanStack Query, y por Realtime en vivo.
- La API está **versionada** (`/v1`). Un cambio incompatible crea `/v2`; nunca rompe a `/v1`.

### Motor de agentes
- Puertos: `Cola`, `ModeloLLM`, `Almacen`, `Compilador`, `Notificador`, `RegistroEventos`.
- Cada **rol** del pipeline (investigar, fichar, redactar…) es un *handler* registrado por nombre. Agregar un rol nuevo es agregar un handler y una fila en `roles`, sin tocar el núcleo (ADR-005).
- Se comunica con la web **solo a través de la base de datos** (cola + eventos), nunca por HTTP: si la VM cae, los encargos esperan.

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| Hexagonal también en la web | Simetría | Puertos y adaptadores vacíos: la web casi solo valida, escribe y muestra |
| Web por capas técnicas (`components/`, `hooks/`, `services/`) | Conocido | Mezcla dominios; un cambio toca muchas carpetas; escala mal |
| Microservicios | Aislamiento | Desproporcionado para un solo usuario y gratuito |
| **Monolito modular + worker hexagonal** | Límites claros, crecimiento por módulos, un solo despliegue web | Hay que hacer cumplir los límites (lint) |

## Consecuencias
- Agregar un dominio nuevo es crear `src/features/<dominio>` y sus endpoints `/api/v1/<recurso>`, sin tocar los demás.
- RLS en todas las tablas; la service role solo se usa en `src/server/**` y en la VM.
- La web nunca compila LaTeX ni llama a modelos para generar documentos.
