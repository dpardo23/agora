---
id: ADR-006
titulo: El entorno de desarrollo se aísla con mise y Docker, y la web corre fuera de contenedores
estado: Aceptada
fecha: 2026-10-21
autor: Juan Diego Pardo Pozo
---

# ADR-006 · Entorno de desarrollo aislado

## Contexto
Ágora tiene cuatro piezas que corren en local: la web (Next.js), Supabase, n8n y el worker `umss` (Python, TeX Live y Chromium). El equipo del titular tiene otros proyectos con sus propias versiones de Node y Python, bases de datos y puertos ocupados. Instalar cada herramienta a mano y de forma global, a medida que hace falta, mezcla versiones entre proyectos, rompe la reproducibilidad entre el equipo local, el CI, Vercel y la VM ARM de Oracle, y deja restos difíciles de limpiar.

Además, el primer push al repositorio público subió configuración local de herramientas que no debía publicarse.

## Decisión

### 1. Solo tres herramientas en el sistema
En el sistema operativo se instalan únicamente Git, Docker (con Compose y Buildx) y **mise**, más la CLI de GitHub (`gh`) para la gestión del repositorio. Todo lo demás pertenece al proyecto.

### 2. mise fija las versiones dentro de la carpeta del proyecto
`mise.toml`, en la raíz del repositorio, fija Node, pnpm, Python, uv y la CLI de Supabase. mise las activa al entrar en la carpeta y las desactiva al salir; fuera de ella, el sistema conserva sus propias versiones. mise también carga las variables de `.env.local` solo dentro del proyecto. Las versiones salen de la matriz verificada de la guía 0 (`docs/guias/entorno/`) y se replican sin cambios en `package.json` (`engines` y `packageManager`), en el CI y en Vercel.

Versiones de referencia al 2026-10-21:

| Pieza | Versión | Motivo |
|---|---|---|
| Node.js | 24 LTS | Es la versión por defecto de Vercel; Node 26 todavía no es LTS y Vercel no la ofrece |
| pnpm | 12 | Admitida por Vercel. La instala mise: Corepack es experimental y Node la deja de distribuir desde la versión 25 |
| TypeScript | 6.0 | `typescript-eslint` (usado por `eslint-config-next`) no admite TypeScript 7 |
| ESLint | 9 | Los plugins de `eslint-config-next` no admiten ESLint 10 |
| Python | 3.14 | Versión estable actual, con ruedas para las dependencias del worker; se confirma al incorporar el código de `umss` |
| PostgreSQL | 17 | La CLI de Supabase la usa por defecto; debe coincidir con el proyecto en la nube |

### 3. Docker para los servicios, no para la web

| Pieza | Cómo corre en local | Por qué |
|---|---|---|
| Supabase | `supabase start` (la CLI administra sus contenedores) | Reproduce el servicio administrado tal como lo prueba el CI; un Compose propio se desfasaría con la CLI |
| n8n | `infra/local/compose.yaml`, proyecto de Compose `agora`, versión fija de la imagen | Es la misma imagen que corre en la VM |
| Worker | Imagen propia multiarquitectura (amd64 y arm64) con Python, uv, TeX Live y Chromium | La VM es ARM y TeX Live pesa varios GB: la imagen garantiza la misma compilación en ambos lados |
| Web | Nativa, con `pnpm dev` | La recarga en caliente es más rápida fuera de un contenedor y Vercel no usa Docker; mise ya fija sus versiones |

Los contenedores no se reinician solos ni arrancan con el sistema: se levantan y se bajan a pedido con un solo comando. Docker se activa por socket (`docker.socket`), no como servicio permanente.

### 4. Bloque de puertos propio
Para no chocar con otros proyectos, Ágora usa un bloque fijo:

| Servicio | Puerto |
|---|---|
| Web (Next.js) | 3100 |
| Supabase: shadow, API, base de datos, Studio, correo de prueba, analítica, pooler | 55320, 55321, 55322, 55323, 55324, 55327, 55329 |
| n8n | 55678 |

### 5. Hooks de Git propios
Los hooks del proyecto viven en `.githooks/` (`core.hooksPath`). No se usa Husky: su instalación cambia `core.hooksPath` y desactivaría en silencio los hooks de privacidad y autoría. commitlint se ejecuta desde `.githooks/commit-msg`.

### 6. Lo privado no se versiona
`.gitignore` es la única lista de lo que nunca se sube: secretos, configuración local de herramientas de desarrollo y de asistencia, material de terceros (`docs/referencia/`), diseño fuente (`design/`) y datos de servicios locales. La hacen cumplir el hook `.githooks/pre-commit` y el paso «Rutas privadas» del CI (`CONTRIBUTING.md`, sección 8).

## Alternativas consideradas
| Opción | A favor | En contra |
|---|---|---|
| Instalar todo de forma global con pacman y npm | Simple al principio | Mezcla versiones entre proyectos; no se reproduce en el CI ni en la VM |
| Todo en Docker, incluida la web (devcontainer) | Aislamiento total | Recarga en caliente más lenta, integración con el editor más frágil, Vercel no lo usa |
| Nix o devbox | Reproducibilidad máxima | Curva de aprendizaje alta para un proyecto de una sola persona |
| asdf o nvm + pyenv | Conocidos | Varias herramientas para lo que mise hace sola; sin carga de variables por carpeta |
| **mise + Docker para los servicios + web nativa** | Aislamiento por carpeta, misma versión en todos los entornos, servicios descartables | Hay que mantener la matriz de versiones al día |

## Consecuencias
- Positivas: un clon limpio se prepara con `mise install` y un comando; borrar el proyecto es borrar la carpeta y sus contenedores; local, CI, Vercel y VM usan las mismas versiones.
- Negativas o costos: cada actualización de versión toca `mise.toml`, `package.json`, el CI y la guía 0 a la vez. La matriz se revisa al iniciar cada sprint.
- Cambios: nuevo SPRINT-00 «Organización y entorno» (T-11 a T-14, más T-01 y T-02), con los sprints siguientes renumerados en uno; guías en `docs/guias/entorno/`; sección 6 de `docs/arquitectura.md` actualizada; el CI usa Node 24, pnpm 12 y Python 3.14.
