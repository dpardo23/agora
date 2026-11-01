# Guía 5 · Comprobación y solución de problemas

Versión 1.5 · creado el 2026-10-21 · editado el 2026-10-31 · autor: Juan Diego Pardo Pozo

Cómo comprobar que el entorno está completo y qué hacer ante los errores más comunes.

## 1. Comprobación completa

Desde cualquier carpeta del repositorio (T-11):

```sh
cd ~/Documentos/agora
scripts/verificar-entorno.sh
```

Cada comprobación imprime **OK**, **AVISO** o **FALLA** y el script termina con un resumen. Una FALLA bloquea (código de salida 1); un AVISO no, porque señala algo que todavía puede faltar a propósito, como un `.env.local` que aún no se creó en un clon limpio. Nunca muestra el valor de un secreto. Revisa, en este orden:

1. Herramientas del sistema: Git, Docker (socket activo), Compose, Buildx, mise y gh.
2. Versiones de mise (según `mise ls --current`): `mise.toml` autorizado con `mise trust`, cada herramienta instalada con `mise install` y el shell activado. Node 24.22.2, pnpm 12.17.0, Python 3.14, uv 0.13.6 y CLI de Supabase 2.122.0.
3. Hooks de Git: `core.hooksPath` apunta a `.githooks`.
4. Archivos privados: ninguno versionado (`git ls-files -ci --exclude-standard` vacío).
5. Secretos: cada `.env.local` tiene todas las variables de su `.env.example`. Si el archivo no existe o una variable está vacía, es AVISO (se crean con `mise run n8n:clave` y `mise run entorno:env`, guía 4); si falta una variable, es FALLA.
6. Puertos: 3100, 55320 a 55329 y 55678 libres o usados por contenedores de Ágora. Si alguno escucha en todas las interfaces (`0.0.0.0`), es AVISO: queda visible desde la red (guía 1, sección 3.4).

La comprobación manual equivalente es:

```sh
mise ls
git config core.hooksPath
git ls-files -ci --exclude-standard
ss -ltnp | grep -E ':(3100|5532[0-9]|55678)\b'
docker ps --format '{{.Names}}\t{{.Status}}'
```

## 2. Problemas frecuentes

### Docker

| Síntoma | Causa | Solución |
|---|---|---|
| `Cannot connect to the Docker daemon` | El socket no está activo | `sudo systemctl start docker.socket` |
| `permission denied ... docker.sock` | Tu usuario no está en el grupo `docker` (o no reiniciaste la sesión) | Usa `sudo docker …`, o sigue la guía 1, sección 3.2, y vuelve a entrar en la sesión |
| `exec format error` al correr la imagen arm64 | Falta la emulación | `sudo pacman -S --needed qemu-user-static qemu-user-static-binfmt` y reinicia `systemd-binfmt` |
| Disco lleno | Imágenes viejas | `docker image ls` y borra solo las que reconozcas con `docker image rm <id>`; no uses `prune` a ciegas |

### Puertos

| Síntoma | Solución |
|---|---|
| `port is already allocated` o `address already in use` | `ss -ltnp \| grep <puerto>` muestra qué proceso lo usa. Si es de otro proyecto, detenlo; si es un contenedor viejo de Ágora, `mise run abajo` |
| Supabase arranca en 54321 en vez de 55321 | Falta la configuración de `supabase/config.toml` (guía 4, sección 2.1) |

### mise

| Síntoma | Solución |
|---|---|
| `node --version` muestra la versión del sistema dentro del proyecto | Falta `eval "$(mise activate zsh)"` en `~/.zshrc`, o no ejecutaste `mise trust` y `mise install` |
| `mise ERROR ... not trusted` | `mise trust` dentro de la carpeta |
| Una herramienta no se descarga | `mise doctor` muestra el problema; reintenta con `mise install --verbose` |

### Supabase

| Síntoma | Solución |
|---|---|
| La dirección de la organización contiene `vercel_icfg_` | La organización la administra Vercel: crea otra directamente en Supabase (guía 2, sección 4, pasos 2 y 3) |
| El nombre del proyecto aparece con tu correo | El navegador autocompletó el formulario: corrige el nombre y pega la contraseña desde el gestor (guía 2, sección 4) |
| Security Advisor avisa de `rls_auto_enable()` | Esperado en la nube; se corrige en la primera migración (T-03) |
| `supabase start` se queda esperando | Primera descarga lenta: espera. Si falla, `supabase stop --no-backup` y vuelve a `supabase start` (borra los datos locales, que se recrean con `db reset`) |
| Una migración falla en `db reset` | Corrige el SQL en una **migración nueva**; nunca edites una ya aplicada |
| La web dice «Invalid API key» | Las claves de `apps/web/.env.local` no son las de `supabase status`: bórralo y ejecuta `mise run entorno:env` |
| `required variable N8N_ENCRYPTION_KEY is missing` o `mise run arriba` no levanta n8n | Falta la clave: `mise run n8n:clave` (guía 4, sección 3.1). Nunca la cambies si n8n ya guardó credenciales |
| `mise run entorno:env` dice que el archivo ya existe | No reemplaza nada a propósito: borra a mano el `.env.local` que quieras regenerar |
| El worker en Docker no llega a Supabase | Dentro del contenedor se usa `http://host.docker.internal:55321`; `compose.yaml` ya lo fija (guía 4, sección 3.1) |
| `supabase db reset` no carga la semilla | Es esperado hasta T-03: la semilla está en `supabase/borradores/` (guía 4, sección 2.4) |
| El proyecto de la nube está pausado | Plan Free: se pausa tras 7 días sin uso. Reactívalo desde el panel |

### Node y pnpm

| Síntoma | Solución |
|---|---|
| `ERR_PNPM_UNSUPPORTED_ENGINE` | Estás fuera de mise o con otra versión de Node: entra a la carpeta y revisa `mise ls` |
| Advertencias de *peer dependencies* | Una versión se salió de la matriz (guía 0). No las ignores: vuelve a la versión fijada |
| `pnpm install` cambia `pnpm-lock.yaml` en el CI | Usa `pnpm install --frozen-lockfile` y sube el lockfile actualizado en tu rama |

### Git y GitHub

| Síntoma | Solución |
|---|---|
| `pre-commit: estos archivos coinciden con .gitignore` | Estás intentando subir algo privado: `git restore --staged <ruta>` |
| `commit-msg: ... coautoría` | Quita la línea `Co-authored-by` del mensaje |
| Después de un `git pull` faltan `.claude/` o `design/` | Es esperado una vez: restaura desde el respaldo (guía 1, sección 9) |
| `gh: authentication required` | `gh auth login` |
| El commit no sale como «Verified» | Revisa que la llave esté registrada en GitHub como **Signing Key** (guía 1, sección 5.3) |

### Bitwarden

| Síntoma | Solución |
|---|---|
| Cada comando `bw` pide la contraseña maestra | La sesión no está abierta en esta terminal: `export BW_SESSION=$(bw unlock --raw)` (guía 2, sección 1.1) |
| «The decryption operation failed» | La contraseña maestra no coincidió: desbloquea de nuevo y escríbela con calma |
| `FOLDER_ID` vacío, `null` o con un JSON | Repite el paso 4 de la rutina de uso; si al pegar se partió la línea, únela |
| `zsh: command not found` o `jq: Unknown option` al pegar un comando | La línea se partió o quedaron `\` sueltas al copiar: pega un bloque por vez y une la línea antes de Enter |

### Oracle Cloud

| Síntoma | Solución |
|---|---|
| «Capacidad insuficiente en la unidad VM.Standard.A1.Flex» (*Out of host capacity*) | São Paulo tiene un solo dominio de disponibilidad: reintentar, o guardar como pila y pulsar **Aplicar** en el Gestor de recursos a otra hora u otro día; nunca subir la cuenta a Pay As You Go (guía 2, secciones 3.1 y 3.4) |
| «Crear nueva red virtual en la nube» bloquea la subred y la IP pública | Crear antes la VCN con el asistente y elegirla como red existente (guía 2, sección 3.4) |
| «Ver costo estimado» muestra un monto mensual | La calculadora no descuenta Always Free; en Free Tier no se cobra (guía 2, secciones 3.1 y 3.4) |
| No entra por SSH | Revisa la IP pública, que uses `-i ~/.ssh/agora-vm` y el usuario `ubuntu`, y que la *Security List* permita el puerto 22 |
| Aviso de instancia inactiva | Oracle reclama instancias con CPU, red y memoria bajo el 20 % por 7 días; el worker y las métricas (HU-08.02) lo evitan |

### Google

| Síntoma | Solución |
|---|---|
| El worker deja de subir a Drive cada 7 días | La app OAuth está en modo *Testing*: publícala (guía 2, sección 5) |
| Pide verificar la marca o la app queda pendiente | Se subió un logo o un dominio en «Información de la marca»: quítalos (guía 2, sección 5, paso 6) |
| La consola ofrece prueba gratuita o activar facturación | No hace falta para Drive ni para Gemini: ciérralo (guía 2, sección 5) |
| «Access blocked: app not verified» | Entra con la cuenta registrada como usuario de prueba, o acepta el aviso tras publicar la app |

## 3. Cuándo reportar un defecto

Si un paso de las guías falla aunque se siga al pie de la letra, es un defecto del entorno: se registra con la skill `reportar-bug` en `docs/qa/bugs/` y se anota en la tabla de bugs del SPRINT-00, indicando la guía y la sección.
