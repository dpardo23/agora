# Guía 0 · Mapa del entorno y orden de pasos

Versión 1.6 · creado el 2026-10-21 · editado el 2026-11-01 · autor: Juan Diego Pardo Pozo

Esta guía es la puerta de entrada al SPRINT-00 «Organización y entorno». Explica qué piezas tiene el entorno de Ágora, en qué orden se preparan, qué versiones se usan y qué puertos ocupa cada servicio. Las decisiones de fondo están en el ADR-006.

## 1. Las piezas y dónde corren

| Pieza | En tu PC (desarrollo) | En producción |
|---|---|---|
| Web (Next.js + API `/api/v1`) | Nativa, con `pnpm dev`, en el puerto 3100 | Vercel |
| Datos (Postgres, Auth, Storage, Realtime) | Supabase local en Docker, administrado por la CLI | Supabase Cloud |
| Automatización | n8n en Docker | n8n en Docker dentro de la VM de Oracle |
| Motor de agentes (worker `umss`) | Imagen Docker con Python, TeX Live y Chromium | Misma imagen (arm64) en la VM de Oracle |
| Modelos | Claude (token de Claude Code) y Gemini (clave de AI Studio) | Los mismos, desde la VM |
| Entregas | Google Drive (OAuth de tu cuenta) | Igual |

## 2. Cómo se aísla el proyecto

En el sistema se instalan solo **Git, Docker, mise y gh**. Todo lo demás vive dentro de `~/Documentos/agora`:

- **mise** activa Node, pnpm, Python, uv y la CLI de Supabase con las versiones de la sección 4, solo al entrar en la carpeta. Al salir, tu sistema vuelve a sus versiones (por ejemplo, tu Node 26 del sistema sigue intacto).
- **Las librerías** del frontend van en `node_modules/` y las del worker en `worker/.venv/`. Nada se instala con `sudo npm` ni `sudo pip`.
- **Los servicios** corren en contenedores con el nombre `agora` y un bloque de puertos propio (sección 5). No arrancan con el equipo ni se reinician solos.
- **Los secretos** van en archivos `.env.local` que nunca se suben a GitHub; mise los carga solo dentro de la carpeta.

Para borrar el proyecto por completo: `mise run abajo` (o `supabase stop` y `docker compose -p agora down -v`), y después borrar la carpeta.

## 3. Orden de trabajo

Marca cada casilla al terminar. Los ítems T-NN son los del SPRINT-00.

| Paso | Qué | Quién | Guía | Ítem |
|---|---|---|---|---|
| 1 | Leer esta guía y el ADR-006 | Titular | 0 | T-14 |
| 2 | Actualizar el sistema e instalar Git, Docker, mise y gh | Titular | 1 | T-13 |
| 3 | Activar Docker, mise en zsh, identidad y firma de Git, `gh auth login` | Titular | 1 | T-13 |
| 4 | Gestor de contraseñas y respaldo de lo privado | Titular | 1 y 2 | T-13 |
| 5 | Crear las cuentas: Supabase, Google Cloud, AI Studio, Claude, Oracle (y la VM) | Titular | 2 | T-13 |
| 6 | `mise.toml`, `.env.example`, `scripts/verificar-entorno.sh` | Desarrollo | 1 | T-11 |
| 7 | Crear `apps/web` con Next.js 16 y sus librerías | Desarrollo | 3 | T-01 |
| 8 | Supabase local, n8n y la imagen del worker en Docker | Desarrollo | 4 | T-12 |
| 9 | Conectar Vercel y completar el CI | Titular + desarrollo | 2 y 3 | T-02 |
| 10 | `scripts/verificar-entorno.sh` desde un clon limpio | Titular | 5 | Cierre |

Lista de comprobación general:

- [ ] Pasos 1 a 5 terminados (todo lo manual).
- [ ] Pasos 6 a 9 fusionados en `develop`.
- [ ] Paso 10 sin errores.

## 4. Matriz de versiones

Verificadas el 2026-10-21 en su fuente oficial y actualizadas a sus últimos parches el 2026-10-31 (registro de npm, PyPI, Docker Hub, nodejs.org y la documentación de Vercel y Supabase). Se copian sin cambios a `mise.toml`, `package.json`, el CI y Vercel. La matriz se revisa al iniciar cada sprint.

### Herramientas

| Herramienta | Versión | Dónde se fija | Nota |
|---|---|---|---|
| Git | la del sistema (2.5x) | pacman | |
| Docker Engine + Compose + Buildx | la del sistema (29.x, Compose 5.x) | pacman | |
| mise | la del sistema (2026.10.x) | pacman | |
| gh | la del sistema (2.10x) | pacman | |
| Node.js | **24.22.2 (LTS «Krypton»)** | `mise.toml`, `engines` y Vercel (24.x) | Vercel solo ofrece 24.x (por defecto) y 22.x. Node 26 aún no es LTS |
| pnpm | **12.17.0** | `mise.toml` y `packageManager` | Vercel admite pnpm 6 a 12. En el equipo se instala con mise y no con Corepack, que Node deja de distribuir desde la versión 25. En Vercel (Node 24) se fija con Corepack (guía 2, sección 9) |
| Python | **3.14** | `mise.toml` y `requires-python` | Se confirma al incorporar el código de `umss` |
| uv | **0.13.6** | `mise.toml` | |
| CLI de Supabase | **2.122.0** | `mise.toml` | |
| PostgreSQL | **17** | `supabase/config.toml` | Debe ser la misma en el proyecto de la nube |
| actionlint, zizmor | 1.7.12, 1.31.1 | Imagen Docker `rhysd/actionlint` y `uvx zizmor`: revisan los workflows en el hook `pre-push` y en el CI (guía 6) |

### Frontend (`apps/web`)

| Paquete | Versión | Compatibilidad comprobada |
|---|---|---|
| next, eslint-config-next | 16.4.3 | Requiere Node ≥ 20.9 y React 19 |
| react, react-dom | 19.3.1 | |
| typescript | **6.0.3** | No 7.x: `typescript-eslint` (que usa `eslint-config-next`) admite TypeScript < 6.1 |
| eslint | **9.39.5** | No 10.x: `eslint-plugin-react`, `-import` y `-jsx-a11y` admiten hasta ESLint 9. pnpm avisa que la línea 9 está marcada como obsoleta; se mantiene hasta que `eslint-config-next` admita ESLint 10 |
| eslint-plugin-boundaries | 7.4.0 | Regla `boundaries/dependencies` (sintaxis de la versión 7) |
| prettier, prettier-plugin-tailwindcss | 3.9.10, 0.8.1 | |
| tailwindcss, @tailwindcss/turbopack | 4.3.3 | Next 16 compila el CSS con el cargador de Turbopack, sin PostCSS |
| shadcn (CLI), radix-ui, cn, class-variance-authority, tw-animate-css | 4.23.0, 1.8.1, 0.5.1, 0.7.1, 1.4.0 | Estilo `radix-nova`; `shadcn` también es dependencia porque `globals.css` importa su CSS |
| lucide-react | 1.61.0 | |
| @tanstack/react-query | 5.104.5 | |
| react-hook-form, @hookform/resolvers | 7.90.0, 6.0.0 | Los resolvers admiten Zod 3.25 o 4 |
| zod | 4.6.7 | |
| @asteasolutions/zod-to-openapi | 9.1.0 | Requiere Zod 4 |
| @serwist/turbopack, serwist | 9.5.13 | Next 16 compila con Turbopack por defecto: se usa la variante para Turbopack, no `@serwist/next` |
| date-fns, @date-fns/tz | 4.4.0, 1.5.0 | Con date-fns 4 la zona horaria va en `@date-fns/tz`, no en `date-fns-tz` |
| ts-fsrs | 5.4.2 | |
| @supabase/supabase-js, @supabase/ssr | 2.118.0, 0.12.7 | `@supabase/ssr` requiere supabase-js ≥ 2.114 |
| vitest, @vitest/coverage-v8, @vitejs/plugin-react, vite | 5.0.5, 5.0.5, 6.1.2, 8.x | Vitest 5 admite Node 22, 24 y ≥ 26. La cobertura debe tener la misma versión que Vitest |
| @testing-library/react, user-event, jest-dom, jsdom | 16.3.3, 14.6.8, 7.0.1, 30.1.3 | |
| @playwright/test, @axe-core/playwright | 1.64.1, 4.14.0 | |
| @lhci/cli | 0.15.1 | Lighthouse 12 ya no tiene la categoría PWA: la instalabilidad se prueba en HU-16.01 y HU-16.04 |
| server-only, tsx | 0.0.1, 4.23.15 | `server-only` impide importar `src/server/` desde el cliente; `tsx` ejecuta `apps/web/scripts/openapi.ts` |
| @usebruno/cli, knip | 4.3.0, 6.44.1 | Pruebas de API y código sin usar (guía 6) |
| ajv, ajv-formats | 8.20.0, 2.1.1 | Validan las respuestas contra `openapi.json`. `ajv-formats` en 2.x porque `@hookform/resolvers` la pide así |
| zod (forzada en todo el árbol) | 4.6.7 | `overrides` de `pnpm-workspace.yaml`: Serwist fija 4.6.5, con una vulnerabilidad alta |
| @commitlint/cli, @commitlint/config-conventional | 21.2.4 | Se ejecutan desde `.githooks/commit-msg`. **Sin Husky**: cambiaría `core.hooksPath` y apagaría los hooks de privacidad |

### Worker (`worker/`)

| Paquete o imagen | Versión | Nota |
|---|---|---|
| Imagen base | `python:3.14.10-slim-trixie` | Publicada para amd64 y arm64; Dependabot propone las nuevas |
| uv en la imagen | `ghcr.io/astral-sh/uv:0.13.6` | La misma versión que `mise.toml` |
| TeX Live y Chromium | Paquetes de Debian «trixie» | Disponibles para arm64 |
| pytest, pytest-cov, ruff, mypy | 9.2.0, 7.1.0, 0.17.3, 2.4.1 | Herramientas de desarrollo, fijas en `pyproject.toml` |
| supabase (Python) | 2.33.0 | Las dependencias del motor se agregan con su código (SPRINT-07) |
| google-genai | 2.32.0 | SDK de Gemini |
| google-api-python-client, google-auth-oauthlib | 2.201.0, 1.5.0 | Drive |
| pydantic, httpx | 2.14.1, 0.28.1 | |

### Servicios en Docker

| Imagen | Versión | Nota |
|---|---|---|
| n8n (`docker.n8n.io/n8nio/n8n`) | 2.45.7 | La etiqueta `latest` cambia sola: siempre versión fija. Publicada para amd64 y arm64 |
| Supabase | La que elige la CLI 2.122.0 | No se fija a mano |

## 5. Puertos de Ágora

Elegidos fuera de los valores por defecto para no chocar con otros proyectos.

| Servicio | Puerto | Dirección |
|---|---|---|
| Web (Next.js) | 3100 | http://localhost:3100 |
| Supabase · base de datos sombra | 55320 | (interna de `db diff`) |
| Supabase · API | 55321 | http://localhost:55321 |
| Supabase · Postgres | 55322 | `postgresql://postgres:postgres@localhost:55322/postgres` |
| Supabase · Studio | 55323 | http://localhost:55323 |
| Supabase · correo de prueba (Mailpit, web) | 55324 | http://localhost:55324 |
| Supabase · correo de prueba (SMTP) | 55325 | |
| Supabase · correo de prueba (POP3) | 55326 | |
| Supabase · analítica | 55327 | |
| Supabase · inspector de Edge Functions | 55328 | |
| Supabase · pooler | 55329 | |
| n8n | 55678 | http://localhost:55678 |

## 6. Dónde vive cada cosa

| Carpeta o archivo | Contenido | ¿Se sube a GitHub? |
|---|---|---|
| `mise.toml` | Versiones y tareas del proyecto | Sí |
| `.env.example` | Nombres de las variables, sin valores | Sí |
| `.env.local` (raíz, `apps/web/`, `worker/`) | Valores reales de los secretos | **No** |
| `.editorconfig`, `.vscode/` | Formato común del editor y extensiones recomendadas | Sí |
| `scripts/verificar-entorno.sh` | Comprueba que el entorno esté completo (guía 5) | Sí |
| `supabase/` | Configuración, migraciones, pruebas pgTAP y borradores (`borradores/`, hasta T-03) | Sí (salvo `.temp/`, `.branches/`) |
| `mise-tasks/` | Tareas `arriba`, `abajo`, `estado`, `entorno:env` y `n8n:clave` | Sí |
| `infra/local/compose.yaml` | n8n y worker en local | Sí |
| `infra/local/datos/` | Volúmenes locales | **No** |
| `docs/referencia/`, `design/` | Material privado y diseño fuente | **No** |
| `docs/guias/entorno/*.md` | Estas guías | Sí |
| `docs/guias/entorno/*.pdf` | Las guías en PDF | **No** (se generan) |

## 7. Generar los PDF de las guías

```sh
scripts/guias/generar-pdf.sh
```

Crea un PDF por guía y uno combinado (`agora-guias-entorno.pdf`) en `docs/guias/entorno/`. Usa Python con `uv` y el Chromium del sistema; no instala nada global.
