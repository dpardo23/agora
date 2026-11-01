# Guía 1 · Sistema base y aislamiento

Versión 1.3 · creado el 2026-10-21 · editado el 2026-11-01 · autor: Juan Diego Pardo Pozo

Qué instalar en CachyOS, cómo activarlo y cómo dejar el proyecto aislado del resto del equipo. Todo lo de esta guía lo hace el titular a mano, una sola vez. Los comandos se escriben en la terminal (zsh); los que empiezan con `sudo` piden tu contraseña.

## 1. Actualizar el sistema

En Arch y CachyOS nunca se instala un paquete con `pacman -Sy paquete` (actualización parcial): primero se actualiza todo el sistema y después se instala.

```sh
sudo pacman -Syu
```

Si se actualizó el kernel, reinicia antes de seguir.

## 2. Instalar las herramientas del sistema

```sh
sudo pacman -S --needed git docker docker-compose docker-buildx mise github-cli
```

| Paquete | Para qué |
|---|---|
| `git` | Control de versiones (ya lo tienes; `--needed` lo salta) |
| `docker` | Motor de contenedores |
| `docker-compose` | Levantar varios contenedores con un archivo (`docker compose`) |
| `docker-buildx` | Construir imágenes para varias arquitecturas (la VM es ARM) |
| `mise` | Versiones de Node, pnpm, Python, uv y la CLI de Supabase por carpeta |
| `github-cli` | El comando `gh` para PR, revisiones y secretos de GitHub |

Para construir en tu PC (x86) la imagen ARM del worker hace falta emulación:

```sh
sudo pacman -S --needed qemu-user-static qemu-user-static-binfmt
```

**Comprobar:**

```sh
git --version && docker --version && docker compose version && docker buildx version && mise --version && gh --version
```

Cada comando debe imprimir una versión.

## 3. Docker

### 3.1. Activación por socket

Docker se activa por socket: el demonio arranca solo la primera vez que usas `docker` y no queda corriendo desde el arranque del equipo.

```sh
sudo systemctl start docker.socket
```

Ese comando hay que repetirlo después de cada reinicio. Si prefieres no repetirlo, puedes habilitar **solo el socket** (no el servicio). Es liviano: el demonio sigue sin arrancar hasta el primer uso.

```sh
sudo systemctl enable docker.socket
```

No habilites `docker.service`.

### 3.2. Usar Docker sin sudo (decisión tuya)

Agregar tu usuario al grupo `docker` evita escribir `sudo` en cada comando, pero **equivale a darle permisos de root**: cualquier programa que corra con tu usuario puede controlar el equipo entero a través de Docker. Si aceptas ese riesgo:

```sh
sudo usermod -aG docker "$USER"
```

Cierra la sesión del escritorio y vuelve a entrar (o reinicia) para que el grupo se aplique. Si no lo aceptas, antepón `sudo` a los comandos de Docker de las guías.

**Comprobar:**

```sh
docker run --rm hello-world
docker buildx ls
```

El primero imprime «Hello from Docker!» y borra el contenedor. El segundo debe listar plataformas con `linux/amd64` y `linux/arm64`.

### 3.3. Reglas de uso en este proyecto

- Ningún contenedor de Ágora usa `restart: always` ni `unless-stopped`: se levantan y se bajan a pedido.
- No uses `docker system prune` ni `docker volume prune` sin mirar qué borran: los volúmenes guardan los datos locales de Supabase y n8n.
- Para ver lo que está encendido: `docker ps` y `supabase status`.

### 3.4. Puertos solo en tu equipo (`127.0.0.1`)

La CLI de Supabase publica sus puertos en todas las interfaces (`0.0.0.0`), y Docker escribe sus propias reglas de red, que **pasan por encima de ufw**. Sin un ajuste, Studio (55323) y Postgres (55322, con la contraseña `postgres` de fábrica) quedan al alcance de cualquier equipo de la misma red Wi-Fi.

**Ágora ya lo resuelve sin tocar el sistema.** `mise run arriba` crea una vez la red de Docker `agora_supabase` con la opción `com.docker.network.bridge.host_binding_ipv4=127.0.0.1` y levanta Supabase dentro de ella (`supabase start --network-id agora_supabase`). Todo puerto que se publique en esa red escucha solo en `127.0.0.1`. n8n declara `127.0.0.1` en su `compose.yaml`.

Por eso Supabase se levanta siempre con `mise run arriba`. Un `supabase start` a secas crea su red propia y vuelve a publicar en `0.0.0.0`; `scripts/verificar-entorno.sh` lo avisa.

**Comprobar:** con Supabase en marcha, `ss -ltn 'sport = :55323'` muestra `127.0.0.1:55323` y no `0.0.0.0:55323`.

**Opcional, para contenedores de otros proyectos.** `/etc/docker/daemon.json` con `{ "ip": "127.0.0.1" }` hace lo mismo, pero **solo para la red por defecto de Docker** (`docker run -p` sin red propia). No afecta a Supabase ni a los proyectos de Compose, que crean sus propias redes. Si quieres aplicarlo:

```sh
sudo mkdir -p /etc/docker
echo '{ "ip": "127.0.0.1" }' | sudo tee /etc/docker/daemon.json
sudo systemctl restart docker
```

Si el archivo ya existía, agrega la clave `"ip"` a lo que tiene en lugar de reemplazarlo. En Arch y CachyOS la carpeta `/etc/docker` no viene creada, y `tee` no crea carpetas.

## 4. mise

### 4.1. Activarlo en zsh

```sh
echo 'eval "$(mise activate zsh)"' >> ~/.zshrc
exec zsh
```

Desde ahora, al entrar en una carpeta con `mise.toml`, mise pone en el `PATH` las versiones que esa carpeta pide.

### 4.2. Cómo se usará en Ágora

El archivo `mise.toml` de la raíz del repositorio (T-11) fija las versiones y carga `.env.local` solo dentro de la carpeta:

```toml
[tools]
node = "24.22.2"
pnpm = "12.17.0"
python = "3.14"
uv = "0.13.6"
supabase = "2.122.0"

[env]
_.file = ".env.local"
```

Las tareas del proyecto son scripts de la carpeta `mise-tasks/` (T-12). `mise tasks` las lista:

| Tarea | Qué hace |
|---|---|
| `mise run arriba` | Levanta Supabase local y n8n; `mise run arriba --worker` también construye y levanta el worker |
| `mise run abajo` | Detiene todo y conserva los datos |
| `mise run estado` | Direcciones de Supabase local y contenedores de Ágora, sin mostrar claves |
| `mise run entorno:env` | Crea `apps/web/.env.local` y `worker/.env.local` (guía 4, sección 6) |
| `mise run n8n:clave` | Crea la clave de cifrado de n8n una sola vez (guía 4, sección 3.1) |

Dentro de la carpeta del proyecto:

```sh
cd ~/Documentos/agora
mise trust        # una vez: autoriza el mise.toml del proyecto
mise install      # descarga las versiones fijadas
mise ls           # muestra qué versión está activa y de dónde sale
```

**Comprobar el aislamiento:**

```sh
cd ~/Documentos/agora && node --version   # v24.22.2
cd ~ && node --version                    # tu versión del sistema (v26.x)
```

Si quieres cambiar algo solo para ti (por ejemplo, otra versión para probar), usa `mise.local.toml`: está en `.gitignore` y no se sube.

## 5. Git

### 5.1. Identidad

```sh
git config --global user.name "Juan Diego Pardo Pozo"
git config --global user.email "jdiegopardo23@gmail.com"
git config --global init.defaultBranch main
git config --global pull.rebase false
```

### 5.2. Hooks del proyecto

Una vez por clon, dentro del repositorio:

```sh
git config core.hooksPath .githooks
```

Activa los tres hooks del proyecto: `pre-commit` (rechaza archivos privados aunque se fuercen con `git add -f`), `commit-msg` (commitlint y rechazo de coautorías automáticas) y `pre-push` (las revisiones rápidas del CI antes de subir; guía 6, sección 2).

### 5.3. Firma de commits con SSH

GitHub marca como «Verified» los commits firmados. Se usa la misma llave SSH con la que te autenticas.

```sh
ls ~/.ssh/id_ed25519.pub || ssh-keygen -t ed25519 -C "jdiegopardo23@gmail.com"
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true
git config --global tag.gpgsign true
```

En GitHub: **Settings → SSH and GPG keys → New SSH key**, tipo **Signing Key**, y pega el contenido de `~/.ssh/id_ed25519.pub`. Si esa llave no está registrada también como **Authentication Key**, agrégala otra vez con ese tipo.

**Comprobar:** después del próximo commit, `git log --show-signature -1` debe decir «Good "git" signature».

### 5.4. Ignorados globales

Una red de seguridad para todos tus proyectos, no solo Ágora. Git lee este archivo solo:

```sh
mkdir -p ~/.config/git
cat >> ~/.config/git/ignore <<'EOF'
.claude/
CLAUDE.local.md
.mcp.json
.env
.env.*
!.env.example
*.pem
*.key
.DS_Store
EOF
```

**Comprobar:** `git check-ignore -v .claude/algo` dentro de cualquier repositorio debe citar `~/.config/git/ignore` (o el `.gitignore` del proyecto).

## 6. GitHub CLI

```sh
gh auth login
```

Responde: **GitHub.com** → **SSH** → elige `~/.ssh/id_ed25519.pub` → **Login with a web browser**. Copia el código que muestra y pégalo en el navegador.

**Comprobar:**

```sh
gh auth status
gh repo view dpardo23/agora --json name,visibility
```

## 7. Editor (VS Code)

El repositorio recomendará estas extensiones en `.vscode/extensions.json` (T-11). VS Code las ofrece al abrir la carpeta.

| Extensión | Para qué |
|---|---|
| `hverlin.mise-vscode` | Usa las versiones de mise dentro del editor |
| `dbaeumer.vscode-eslint` | Errores de lint al escribir |
| `esbenp.prettier-vscode` | Formato al guardar |
| `bradlc.vscode-tailwindcss` | Autocompletado de clases de Tailwind |
| `vitest.explorer` | Ejecutar pruebas unitarias desde el editor |
| `ms-playwright.playwright` | Ejecutar y grabar pruebas E2E |
| `charliermarsh.ruff` y `ms-python.python` | Lint y entorno de Python del worker |
| `docker.docker` | Ver contenedores e imágenes |
| `editorconfig.editorconfig` | Respetar sangrías y finales de línea |

## 8. Gestor de contraseñas

Antes de crear cuentas (guía 2), elige dónde guardar los secretos: **KeePassXC** (local, `sudo pacman -S --needed keepassxc`) o **Bitwarden**. Crea una carpeta «Ágora» con una entrada por servicio. Los `.env.local` son copias de trabajo; el gestor es la fuente de verdad.

## 9. Respaldo y restauración de lo privado

El repositorio dejó de versionar `.claude/`, `CLAUDE.md`, `skills-lock.json`, `docs/referencia/` y `design/`. Siguen en tu disco, pero Git puede **reemplazarlos o borrarlos** al cambiar de rama: al pasar a una rama donde todavía están versionados (`develop` o `main` antes de la fusión) los sobrescribe con la versión vieja, y al volver a una rama donde ya no lo están, los borra. También los borra el primer `git pull` de `develop` que incluya el cambio.

Por eso, **justo antes** de cualquier `git switch develop`, `git switch main` o del primer `git pull`, toma una copia nueva:

```sh
rsync -a ~/Documentos/agora/.claude ~/Documentos/agora/CLAUDE.md ~/Documentos/agora/skills-lock.json \
  ~/.local/share/agora-privado/respaldo-2026-10-21/
rsync -a ~/Documentos/agora/docs/referencia ~/.local/share/agora-privado/respaldo-2026-10-21/docs/
rsync -a ~/Documentos/agora/design ~/.local/share/agora-privado/respaldo-2026-10-21/
```

Después del cambio de rama o del pull, restaura:

```sh
rsync -a ~/.local/share/agora-privado/respaldo-2026-10-21/ ~/Documentos/agora/
```

Sin `--delete`: solo copia lo que falta y no borra nada. **Comprobar:** `ls ~/Documentos/agora/.claude ~/Documentos/agora/design` muestra las carpetas y `git status` no las lista (están ignoradas).

Para tus respaldos generales, incluye `~/.local/share/agora-privado/` y los `.env.local` del proyecto.

## 10. Lista de comprobación

- [ ] Sistema actualizado con `pacman -Syu`.
- [ ] Git, Docker, Compose, Buildx, mise y gh instalados; QEMU para arm64.
- [ ] `docker run --rm hello-world` funciona; `docker buildx ls` muestra `linux/arm64`.
- [ ] Con Supabase levantado por `mise run arriba`, sus puertos escuchan solo en `127.0.0.1` (sección 3.4).
- [ ] mise activado en zsh.
- [ ] Identidad de Git, `core.hooksPath` y firma SSH configuradas; llave de firma registrada en GitHub.
- [ ] `~/.config/git/ignore` creado.
- [ ] `gh auth status` correcto.
- [ ] Extensiones del editor instaladas.
- [ ] Gestor de contraseñas listo.
- [ ] Lo privado restaurado tras el primer `git pull` (cuando corresponda).
