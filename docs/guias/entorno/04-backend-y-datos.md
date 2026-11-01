# Guía 4 · Backend y datos

Versión 1.3 · creado el 2026-10-21 · editado el 2026-10-31 · autor: Juan Diego Pardo Pozo

Cómo se levantan en local Supabase, n8n y el worker, y cómo se trabaja con la base de datos. Corresponde al ítem T-12 del SPRINT-00. La API `/api/v1` no es un servicio aparte: vive dentro de Next.js (guía 3).

## 1. Requisitos previos

- Guía 1 terminada: Docker activo (`sudo systemctl start docker.socket`) y mise instalado.
- `mise install` ejecutado en el proyecto: `supabase --version` es 2.122.0 y `uv --version` es 0.13.6.
- Unos 15 GB libres en disco: las imágenes de Supabase ocupan unos 5 GB y la del worker (con TeX Live) unos 4 GB.
- Para `mise run entorno:env` y `mise run n8n:clave`: la CLI de Bitwarden con la sesión abierta (guía 2, sección 1.1).

## 2. Supabase local

### 2.1. Configuración (`supabase/config.toml`)

T-12 generó el archivo con `supabase init` de la CLI 2.122.0 en una carpeta temporal (para que no tocara `.vscode/` ni nada de la raíz) y lo ajustó así:

| Sección | Valor | Por qué |
|---|---|---|
| `project_id` | `"agora"` | Los contenedores se llaman `supabase_*_agora` y no se mezclan con los de otro proyecto |
| Puertos | 55320 a 55329 (tabla de abajo) | Otro Supabase local usa los de fábrica (54320 a 54329) |
| `[db] major_version` | `17` | Igual que `agora-dev` (guía 2, sección 4) |
| `[db.seed] enabled` | `false` | La semilla espera en `supabase/borradores/` hasta T-03 (sección 2.4) |
| `[auth] site_url` | `http://localhost:3100` | La web de Ágora en local |
| `[auth] enable_signup` y `[auth.email] enable_signup` | `false` | Ágora tiene un solo usuario; nadie puede registrarse |
| `[auth] minimum_password_length` | `8` | HU-03.04 y HU-04.02. Supabase no tiene una regla que exija mayúscula, minúscula y símbolo sin exigir también un dígito: esas reglas las valida la API |
| `[auth.email] secure_password_change` | `true` | Cambiar la contraseña pide reautenticación (HU-04.02) |

Los diez puertos de la CLI caben justos en el bloque de Ágora:

| Puerto | Servicio | Clave en `config.toml` |
|---|---|---|
| 55320 | Base sombra de `db diff` | `[db] shadow_port` |
| 55321 | API (Kong) | `[api] port` |
| 55322 | Postgres | `[db] port` |
| 55323 | Studio | `[studio] port` |
| 55324 | Mailpit (web) | `[local_smtp] port` |
| 55325 | Mailpit (SMTP) | `[local_smtp] smtp_port` |
| 55326 | Mailpit (POP3) | `[local_smtp] pop3_port` |
| 55327 | Analítica | `[analytics] port` |
| 55328 | Inspector de Edge Functions | `[edge_runtime] inspector_port` |
| 55329 | Pooler | `[db.pooler] port` |

Estos valores son **solo de desarrollo**. La nube (`agora-dev`) ya tiene el registro cerrado desde su panel (guía 2, sección 4). No se ejecuta `supabase config push` con este archivo sin revisar antes las diferencias: subiría `site_url = http://localhost:3100` a la nube. Cuando Auth necesite valores propios de la nube (EP-03), se agregan como sección `[remotes.agora-dev]` y se decide entonces.

### 2.2. Comandos

| Comando | Qué hace |
|---|---|
| `supabase start` | Descarga las imágenes la primera vez y levanta todo (`mise run arriba` lo incluye) |
| `supabase status` | URL, claves locales y puertos. `mise run estado` muestra solo las direcciones |
| `supabase stop` | Baja los contenedores y **conserva** los datos |
| `supabase db reset` | Borra la base local y aplica todas las migraciones |
| `supabase migration new <nombre>` | Crea una migración vacía en `supabase/migrations/` |
| `supabase db diff -f <nombre>` | Genera una migración a partir de cambios hechos en Studio |
| `supabase test db` | Ejecuta las pruebas pgTAP de `supabase/tests/` |
| `supabase db lint --level warning` | Revisa el esquema |
| `supabase gen types typescript --local` | Tipos de TypeScript del esquema |

Direcciones locales: Studio en http://localhost:55323 y el buzón de correo de prueba (Mailpit) en http://localhost:55324, donde llegan los códigos 2FA sin enviarse de verdad.

### 2.3. Enlazar con la nube

Solo cuando haga falta comparar o desplegar a mano (el CD lo hace solo):

```sh
supabase login
```

`supabase link` pide la contraseña de la base. Se toma del gestor solo para ese comando, sin mostrarla ni guardarla en un archivo (con la sesión de Bitwarden abierta, guía 2, sección 1.1):

```sh
SUPABASE_DB_PASSWORD="$(bw get password 'Supabase · agora-dev')" supabase link --project-ref <ref de agora-dev>
```

El ref está en el campo `project_id` de la misma entrada. Estas credenciales no van al `.env.local` de la raíz (guía 2, sección 10).

La configuración local del proyecto no aplica `supabase db push` ni `db reset --linked`: los cambios a la nube pasan siempre por el CD. Nunca se edita una migración ya aplicada; se crea otra.

### 2.4. Migraciones, borradores y CD

- `supabase/migrations/` está vacía (solo `.gitkeep`). El esquema inicial y la semilla de la oficina esperan en `supabase/borradores/` (su README explica cuándo pasan a ser migraciones, en T-03).
- En cada push a `develop`, el CD (`.github/workflows/cd.yml`, job «Migraciones en staging») enlaza `agora-dev` y ejecuta `supabase db push`. Con la carpeta vacía no aplica nada, pero sí prueba la conexión con los secretos del environment `staging`.
- `supabase/tests/database/00_entorno.test.sql` es la prueba de humo: Postgres 17 y extensiones `vector` y `pgcrypto` disponibles. Las pruebas de RLS de cada tabla llegan con sus migraciones.

## 3. n8n en Docker

### 3.1. Archivo `infra/local/compose.yaml`

```yaml
name: agora

services:
  n8n:
    image: docker.n8n.io/n8nio/n8n:2.45.7
    ports:
      - "127.0.0.1:55678:5678"
    environment:
      N8N_ENCRYPTION_KEY: ${N8N_ENCRYPTION_KEY:?Falta N8N_ENCRYPTION_KEY …}
      # zona horaria de La Paz y telemetría apagada
    volumes:
      - n8n_datos:/home/node/.n8n

  worker:
    profiles: ["worker"]
    build:
      context: ../../worker
    env_file:
      - path: ../../worker/.env.local
        required: false
    environment:
      SUPABASE_URL: http://host.docker.internal:55321
```

- La versión de n8n es fija (2.45.7, la estable al 2026-10-31): nunca `latest`. Dependabot propone las nuevas.
- El puerto solo escucha en `127.0.0.1`: n8n no queda expuesto a la red local.
- No hay política `restart`: nada arranca solo con el equipo.
- Si falta `N8N_ENCRYPTION_KEY`, n8n **no arranca**. Es a propósito: sin clave, n8n crearía una propia dentro del volumen y la del gestor dejaría de servir.
- Dentro del contenedor del worker, `localhost` es el propio contenedor: por eso la URL de Supabase se reemplaza por la del anfitrión.

**Crear la clave (una sola vez, lo hace el titular).** Las tareas de mise solo existen dentro de la carpeta del proyecto; desde otra carpeta, mise responde «no tasks defined»:

```sh
cd ~/Documentos/agora
export BW_SESSION="$(bw unlock --raw)"
mise run n8n:clave
```

La tarea genera la clave con `openssl rand -hex 32`, la guarda en Bitwarden como «n8n · clave de cifrado» (carpeta Ágora) y la escribe en el `.env.local` de la raíz con permisos 600. Si la clave ya existe en el gestor, solo la copia; si ya está en `.env.local`, no hace nada. Nunca la reemplaza: cambiarla deja inservibles las credenciales guardadas en n8n. Debe ser la misma en la VM.

### 3.2. Primer arranque

```sh
mise run arriba
```

Abre http://localhost:55678 y crea el usuario propietario (lo hace el titular, una vez). Los flujos se exportan a `n8n/` en JSON, **sin credenciales** (T-08).

## 4. Worker en Docker

### 4.1. Proyecto Python

El paquete `umss` vive en `worker/` con `uv`. Hoy es un esqueleto: `python -m umss` informa su versión y termina. El motor llega en SPRINT-07.

```sh
cd worker
uv sync                 # crea worker/.venv con lo de uv.lock
uv run pytest --cov     # pruebas con cobertura
uv run ruff check .     # lint
uv run ruff format .    # formato
uv run mypy umss        # tipos en modo estricto
uv add <paquete>        # agrega una dependencia (actualiza pyproject.toml y uv.lock)
```

`pyproject.toml` declara `requires-python = ">=3.14,<3.15"` y fija exactas las herramientas de desarrollo (pytest, pytest-cov, ruff y mypy). Las dependencias del motor (`supabase`, `google-genai`, Drive, `pydantic`, `httpx`) se agregan con su código. El CI corre lo mismo: `ruff check`, `ruff format --check`, `mypy umss` y `pytest --cov=umss`.

### 4.2. Imagen (`worker/Dockerfile`)

Una sola imagen para tu PC (amd64) y la VM (arm64):

- Base `python:3.14.10-slim-trixie` y uv 0.13.6 copiado de su imagen oficial.
- TeX Live (`texlive-latex-extra`, `texlive-xetex`, `texlive-lang-spanish`, `texlive-fonts-extra`, `latexmk`), Chromium y `fonts-noto-core` de Debian. Los paquetes exactos se ajustarán a las recetas de LaTeX del motor, que no se tocan.
- Usuario propio `agora` (uid 10001) con carpeta personal: el usuario `nobody` no tiene `HOME` y uv no puede escribir su caché.
- Se ejecuta con `.venv/bin/python -m umss`, sin uv en tiempo de ejecución.
- `worker/.dockerignore` deja fuera `.env*`, `.venv/`, las cachés, `salidas/` y las pruebas: ningún secreto entra en la imagen.

### 4.3. Construir y probar

```sh
docker compose -f infra/local/compose.yaml --profile worker build worker           # para tu PC
docker run --rm agora/worker:local                                                  # imprime la versión
docker run --rm -v "$PWD/worker/tests/fixtures:/tex:ro" -w /tmp agora/worker:local \
  latexmk -xelatex -interaction=nonstopmode -output-directory=/tmp /tex/prueba.tex   # compila el .tex de prueba
docker buildx build --platform linux/arm64 -t agora/worker:arm64 worker             # para la VM (emulado, lento)
```

La construcción para arm64 usa QEMU (guía 1, sección 2) y tarda bastante más que la de tu PC.

## 5. Un solo comando

| Comando | Qué hace |
|---|---|
| `mise run arriba` | `supabase start` y n8n. Con `--worker`, también construye y levanta el worker |
| `mise run abajo` | Detiene n8n y el worker y ejecuta `supabase stop`. Conserva los datos |
| `mise run estado` | Direcciones de Supabase local y contenedores de Ágora, sin claves |
| `scripts/verificar-entorno.sh` | Versiones, Docker, puertos y secretos (guía 5) |

## 6. Variables de entorno locales

Con Supabase en marcha y la sesión de Bitwarden abierta, desde la carpeta del proyecto:

```sh
cd ~/Documentos/agora
mise run entorno:env
```

Crea, con permisos 600:

- `apps/web/.env.local`: URL y claves de Supabase **local** (salen de `supabase status`).
- `worker/.env.local`: lo mismo para el worker, más `GEMINI_API_KEY` y `CLAUDE_CODE_OAUTH_TOKEN` tomadas del gestor y la ruta del JSON de Google.

Nunca muestra valores ni reemplaza un archivo que ya existe: para regenerarlo, bórralo a mano. Si una clave todavía no está en el gestor (por ejemplo, el token de Claude de la guía 2, sección 7), la deja vacía y lo avisa; el worker no la necesita hasta SPRINT-07 y `verificar-entorno.sh` la muestra como AVISO hasta que se complete. El `.env.local` de la raíz solo lleva `N8N_ENCRYPTION_KEY` y lo crea `mise run n8n:clave` (sección 3.1).

## 7. Comprobación

- [ ] `mise run arriba` termina y `mise run estado` muestra las direcciones de Supabase local.
- [ ] `supabase db reset`, `supabase test db` y `supabase db lint --level warning` pasan.
- [ ] Studio abre en http://localhost:55323 y Mailpit en http://localhost:55324.
- [ ] `mise run n8n:clave` creó la clave y n8n abre en http://localhost:55678.
- [ ] `mise run entorno:env` creó los dos `.env.local` y `scripts/verificar-entorno.sh` no muestra avisos.
- [ ] La imagen del worker se construye y compila el `.tex` de prueba (también para arm64).
- [ ] `mise run abajo` deja `docker ps --filter name=agora` vacío.
