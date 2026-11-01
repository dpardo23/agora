#!/bin/sh
# Comprueba que el entorno local de Ágora esté completo (guía 5, sección 1).
# Revisa herramientas del sistema, versiones de mise, hooks de Git, archivos privados, secretos y puertos.
# Nunca muestra el valor de un secreto. Termina con código 1 si hay alguna FALLA; los AVISO no la provocan.
# Uso, desde cualquier carpeta del repositorio: scripts/verificar-entorno.sh
set -u

raiz=$(git -C "$(dirname "$0")" rev-parse --show-toplevel 2>/dev/null) || {
  echo "verificar-entorno: ejecútalo dentro del repositorio de Ágora." >&2
  exit 1
}
cd "$raiz" || exit 1

fallas=0
avisos=0
if [ -t 1 ]; then
  verde=$(printf '\033[32m'); amarillo=$(printf '\033[33m'); rojo=$(printf '\033[31m'); normal=$(printf '\033[0m')
else
  verde=''; amarillo=''; rojo=''; normal=''
fi

ok() { printf '  %sOK%s     %s\n' "$verde" "$normal" "$1"; }
aviso() { printf '  %sAVISO%s  %s\n' "$amarillo" "$normal" "$1"; avisos=$((avisos + 1)); }
falla() { printf '  %sFALLA%s  %s\n' "$rojo" "$normal" "$1"; fallas=$((fallas + 1)); }
titulo() { printf '\n%s\n' "$1"; }
existe() { command -v "$1" >/dev/null 2>&1; }

# --- 1. Herramientas del sistema (ADR-006: solo estas se instalan fuera del proyecto) ---
titulo "1. Herramientas del sistema"
for herramienta in git mise gh docker; do
  if existe "$herramienta"; then ok "$herramienta instalado"; else falla "$herramienta no está instalado (guía 1, sección 2)"; fi
done
if existe docker; then
  docker_activo=no
  if docker info >/dev/null 2>&1; then
    docker_activo=si
    ok "Docker activo"
  else
    falla "Docker no responde: sudo systemctl start docker.socket; sin el grupo docker, usa sudo (guía 1, sección 3)"
  fi
  if docker compose version >/dev/null 2>&1; then ok "Docker Compose disponible"; else falla "falta Docker Compose (docker-compose)"; fi
  if docker buildx version >/dev/null 2>&1; then
    # «buildx ls» necesita el demonio: sin Docker activo no se puede saber si hay arm64.
    if [ "$docker_activo" = no ]; then aviso "no se revisó linux/arm64 porque Docker no responde"
    elif docker buildx ls 2>/dev/null | grep -q 'linux/arm64'; then ok "Buildx compila para linux/arm64"
    else falla "Buildx no ofrece linux/arm64: sudo pacman -S --needed qemu-user-static qemu-user-static-binfmt (guía 1, sección 2)"; fi
  else
    falla "falta Docker Buildx (docker-buildx)"
  fi
fi

# --- 2. Versiones fijadas en mise.toml ---
titulo "2. Versiones de mise.toml"
if ! existe mise; then
  falla "sin mise no se pueden comprobar las versiones"
elif [ ! -f mise.toml ]; then
  falla "no existe mise.toml en la raíz"
else
  # Versión esperada: el valor de la herramienta en la sección [tools] de mise.toml.
  esperada() {
    sed -n '/^\[tools\]/,/^\[/p' mise.toml | sed -n "s/^$1[[:space:]]*=[[:space:]]*\"\([^\"]*\)\".*/\1/p" | head -n 1
  }
  if mise trust --show </dev/null 2>/dev/null | grep -q 'untrusted'; then
    falla "mise.toml no está autorizado: ejecuta mise trust (y después mise install)"
  else
    # «mise ls --current» lista, por herramienta, la versión que pide esta carpeta y si está instalada.
    actuales=$(mise ls --current </dev/null 2>/dev/null)
    for herramienta in node pnpm python uv supabase; do
      quiere=$(esperada "$herramienta")
      linea=$(printf '%s\n' "$actuales" | awk -v h="$herramienta" '$1 == h')
      tiene=$(printf '%s\n' "$linea" | awk '{print $2}')
      if [ -z "$quiere" ]; then
        falla "$herramienta no está fijado en mise.toml"
      elif [ -z "$linea" ] || printf '%s' "$linea" | grep -q '(missing)'; then
        falla "$herramienta $quiere no está instalado: ejecuta mise install"
      else
        # «3.14» en mise.toml acepta cualquier 3.14.x; las demás versiones van completas.
        case "$tiene" in
          "$quiere" | "$quiere".*) ok "$herramienta $tiene" ;;
          *) falla "$herramienta $tiene, se esperaba $quiere: ejecuta mise install" ;;
        esac
      fi
    done
    # El shell usa las versiones de mise solo si mise está activado (guía 1, sección 4).
    node_mise=$(printf '%s\n' "$actuales" | awk '$1 == "node" {print $2}')
    if [ -n "$node_mise" ] && [ "$(node --version 2>/dev/null | sed 's/^v//')" != "$node_mise" ]; then
      aviso "este shell no usa las versiones de mise: agrega eval \"\$(mise activate zsh)\" a ~/.zshrc y abre otra terminal"
    fi
  fi
fi

# --- 3. Hooks de Git ---
titulo "3. Hooks de Git"
if [ "$(git config core.hooksPath 2>/dev/null)" = ".githooks" ]; then
  ok "core.hooksPath apunta a .githooks"
else
  falla "core.hooksPath no apunta a .githooks: git config core.hooksPath .githooks"
fi

# --- 4. Archivos privados (nada que coincida con .gitignore puede estar versionado) ---
titulo "4. Archivos privados"
versionados=$(git ls-files -ci --exclude-standard)
if [ -z "$versionados" ]; then
  ok "ningún archivo privado versionado"
else
  falla "hay archivos privados versionados (git ls-files -ci --exclude-standard):"
  printf '%s\n' "$versionados" | sed 's/^/           - /'
fi

# --- 5. Secretos: cada .env.local tiene las variables de su .env.example (sin mostrar valores) ---
titulo "5. Secretos"
for plantilla in .env.example apps/web/.env.example worker/.env.example; do
  [ -f "$plantilla" ] || { falla "falta la plantilla $plantilla"; continue; }
  local_=$(dirname "$plantilla")/.env.local
  local_=${local_#./}
  if [ ! -f "$local_" ]; then
    if [ "$local_" = .env.local ]; then tarea="mise run n8n:clave"; else tarea="mise run entorno:env"; fi
    aviso "$local_ no existe: créalo con «$tarea» (guía 4) o cópialo desde $plantilla y llénalo desde el gestor"
    continue
  fi
  vacias=''
  faltan=''
  for variable in $(sed -n 's/^\([A-Z_][A-Z0-9_]*\)=.*/\1/p' "$plantilla"); do
    if ! grep -q "^$variable=" "$local_"; then
      faltan="$faltan $variable"
    elif grep -q "^$variable=[[:space:]]*$" "$local_"; then
      vacias="$vacias $variable"
    fi
  done
  if [ -n "$faltan" ]; then falla "$local_ no tiene:$faltan"; fi
  if [ -n "$vacias" ]; then aviso "$local_ tiene vacías:$vacias"; fi
  if [ -z "$faltan" ] && [ -z "$vacias" ]; then ok "$local_ completo"; fi
done

# --- 6. Puertos del bloque de Ágora: libres o usados por Ágora ---
titulo "6. Puertos"
if ! existe ss; then
  aviso "sin el comando ss no se pueden revisar los puertos (paquete iproute2)"
else
  contenedores=''
  if existe docker && docker info >/dev/null 2>&1; then
    contenedores=$(docker ps --format '{{.Names}} {{.Ports}}' 2>/dev/null | grep -i 'agora')
  fi
  libres=''
  for puerto in 3100 55320 55321 55322 55323 55324 55325 55326 55327 55328 55329 55678; do
    if ss -ltnH "sport = :$puerto" 2>/dev/null | grep -q .; then
      if printf '%s\n' "$contenedores" | grep -q ":$puerto->"; then
        ok "puerto $puerto en uso por un contenedor de Ágora"
      else
        proceso=$(ss -ltnpH "sport = :$puerto" 2>/dev/null | sed -n 's/.*users:(("\([^"]*\)".*/\1/p' | head -n 1)
        if [ "$puerto" = 3100 ] && [ "$proceso" = "node" ]; then
          ok "puerto 3100 en uso por node (la web de Ágora en desarrollo)"
        else
          falla "puerto $puerto ocupado por ${proceso:-otro proceso}: libéralo o detén ese servicio"
        fi
      fi
    else
      libres="$libres $puerto"
    fi
  done
  [ -n "$libres" ] && ok "libres:$libres"
  # Docker se salta ufw: un puerto de Ágora abierto en todas las interfaces queda visible en la red.
  expuestos=''
  for puerto in 55320 55321 55322 55323 55324 55325 55326 55327 55328 55329 55678; do
    if ss -ltnH "sport = :$puerto" 2>/dev/null | awk '{print $4}' | grep -Eq '^(0\.0\.0\.0|\[::\]|\*):'; then
      expuestos="$expuestos $puerto"
    fi
  done
  if [ -n "$expuestos" ]; then
    aviso "puertos visibles desde la red:$expuestos. Limita Docker a 127.0.0.1 (guía 1, sección 3.4)"
  fi
fi

# --- Resumen ---
printf '\n'
if [ "$fallas" -gt 0 ]; then
  printf '%sEntorno incompleto:%s %d falla(s) y %d aviso(s). Soluciones en la guía 5, sección 2.\n' "$rojo" "$normal" "$fallas" "$avisos"
  exit 1
fi
if [ "$avisos" -gt 0 ]; then
  printf '%sEntorno listo con %d aviso(s).%s Los avisos no bloquean, pero conviene resolverlos.\n' "$amarillo" "$avisos" "$normal"
else
  printf '%sEntorno listo.%s\n' "$verde" "$normal"
fi
