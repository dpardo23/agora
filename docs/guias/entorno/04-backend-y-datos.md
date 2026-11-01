# Guía 4 · Backend y datos

Versión 1.2 · creado el 2026-10-21 · editado el 2026-10-31 · autor: Juan Diego Pardo Pozo

Cómo se levantan en local Supabase, n8n y el worker, y cómo se trabaja con la base de datos. Corresponde al ítem T-12 del SPRINT-00. La API `/api/v1` no es un servicio aparte: vive dentro de Next.js (guía 3).

## 1. Requisitos previos

- Guía 1 terminada: Docker activo (`sudo systemctl start docker.socket`) y mise instalado.
- `mise install` ejecutado en el proyecto: `supabase --version` es 2.122.0 y `uv --version` es 0.13.6.
- Unos 15 GB libres en disco: las imágenes de Supabase ocupan unos 5 GB y la del worker (con TeX Live) unos 4 GB.

## 2. Supabase local

### 2.1. Configuración (`supabase/config.toml`)

T-12 crea el archivo con `supabase init` y deja estos valores:

```toml
project_id = "agora"

[api]
port = 55321

[db]
port = 55322
shadow_port = 55320
major_version = 17

[db.pooler]
port = 55329

[studio]
port = 55323

[local_smtp]
port = 55324

[analytics]
port = 55327
```

`project_id = "agora"` hace que los contenedores se llamen `supabase_*_agora` y no se mezclen con los de otro proyecto. `major_version` debe ser igual a la del proyecto en la nube (guía 2, sección 4).

### 2.2. Comandos

| Comando | Qué hace |
|---|---|
| `supabase start` | Descarga las imágenes la primera vez y levanta todo |
| `supabase status` | URL, claves locales y puertos |
| `supabase stop` | Baja los contenedores y **conserva** los datos |
| `supabase db reset` | Borra la base local, aplica todas las migraciones y la semilla |
| `supabase migration new <nombre>` | Crea una migración vacía en `supabase/migrations/` |
| `supabase db diff -f <nombre>` | Genera una migración a partir de cambios hechos en Studio |
| `supabase test db` | Ejecuta las pruebas pgTAP |
| `supabase db lint` | Revisa el esquema |
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

## 3. n8n en Docker

### 3.1. Archivo `infra/local/compose.yaml`

T-12 lo crea con esta forma:

```yaml
name: agora

services:
  n8n:
    image: docker.n8n.io/n8nio/n8n:2.44.5
    ports:
      - "127.0.0.1:55678:5678"
    environment:
      GENERIC_TIMEZONE: America/La_Paz
      TZ: America/La_Paz
      N8N_ENCRYPTION_KEY: ${N8N_ENCRYPTION_KEY}
      N8N_DIAGNOSTICS_ENABLED: "false"
    volumes:
      - n8n_datos:/home/node/.n8n

  worker:
    build:
      context: ../../worker
    image: agora/worker:local
    env_file: ../../worker/.env.local
    profiles: ["worker"]

volumes:
  n8n_datos:
```

- La versión de n8n es fija: nunca `latest`.
- El puerto solo escucha en `127.0.0.1`: n8n no queda expuesto a la red local.
- No hay política `restart`: el contenedor no arranca con el equipo.
- `N8N_ENCRYPTION_KEY` cifra las credenciales que guardes en n8n. Se genera una vez (`openssl rand -hex 32`), se guarda en el gestor y en el `.env.local` de la raíz, y debe ser la misma en la VM para poder mover flujos.

### 3.2. Comandos

```sh
docker compose -f infra/local/compose.yaml up -d n8n     # levantar
docker compose -f infra/local/compose.yaml logs -f n8n   # ver registros
docker compose -f infra/local/compose.yaml stop          # detener (conserva datos)
docker compose -f infra/local/compose.yaml down          # quitar contenedores (conserva volúmenes)
```

Abre http://localhost:55678 y crea el usuario propietario. Los flujos se exportan a `n8n/` en JSON, **sin credenciales** (T-08).

## 4. Worker en Docker

### 4.1. Proyecto Python

El paquete `umss` vive en `worker/` con `uv`:

```sh
cd worker
uv sync                 # crea worker/.venv con lo de uv.lock
uv run pytest           # pruebas
uv run ruff check .     # lint
uv add <paquete>        # agrega una dependencia (actualiza pyproject.toml y uv.lock)
```

`pyproject.toml` declara `requires-python = ">=3.14"`. Dependencias base: `supabase`, `google-genai`, `google-api-python-client`, `google-auth-oauthlib`, `pydantic`, `httpx`; de desarrollo: `pytest`, `ruff`. La lista definitiva sale del código existente de `umss` cuando se incorpore.

### 4.2. Imagen (`worker/Dockerfile`)

Una sola imagen para tu PC (amd64) y la VM (arm64):

```dockerfile
FROM python:3.14-slim-trixie
COPY --from=ghcr.io/astral-sh/uv:0.13.6 /uv /uvx /bin/
RUN apt-get update && apt-get install -y --no-install-recommends \
      texlive-latex-extra texlive-xetex texlive-lang-spanish texlive-fonts-extra \
      latexmk chromium fonts-noto \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --no-install-project
COPY . .
RUN uv sync --frozen --no-dev
USER nobody
CMD ["uv", "run", "--no-sync", "python", "-m", "umss"]
```

Los paquetes exactos de TeX Live se ajustan a las recetas de LaTeX del motor, que no se tocan.

### 4.3. Construir

```sh
docker compose -f infra/local/compose.yaml --profile worker build worker          # para tu PC
docker buildx build --platform linux/arm64 -t agora/worker:arm64 worker            # para la VM (emulado, lento)
```

## 5. Un solo comando

Las tareas de mise (T-11 y T-12) agrupan todo:

| Comando | Qué hace |
|---|---|
| `mise run arriba` | `supabase start` y n8n; el worker con `mise run arriba -- --worker` |
| `mise run abajo` | `supabase stop` y `docker compose down` |
| `mise run estado` | `supabase status` y `docker compose ps` |
| `scripts/verificar-entorno.sh` | Versiones, Docker, puertos y secretos (guía 5) |

## 6. Comprobación

- [ ] `supabase start` termina y `supabase status` muestra los puertos 55321 a 55329.
- [ ] `supabase db reset` aplica las migraciones sin errores.
- [ ] Studio abre en http://localhost:55323 y Mailpit en http://localhost:55324.
- [ ] n8n abre en http://localhost:55678.
- [ ] La imagen del worker se construye y compila un `.tex` de prueba.
- [ ] `mise run abajo` deja `docker ps` sin contenedores de Ágora.
