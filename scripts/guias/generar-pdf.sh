#!/bin/sh
# Genera los PDF de las guías de docs/guias/entorno/ (uno por guía y uno combinado).
# Requisitos: uv y Chromium. No instala nada global: markdown se usa en un entorno temporal de uv.
# Los PDF quedan junto a las guías y están en .gitignore.
set -eu

raiz=$(cd "$(dirname "$0")/../.." && pwd)
guias="$raiz/docs/guias/entorno"
temporal=$(mktemp -d)
trap 'rm -rf "$temporal"' EXIT

navegador=""
for candidato in chromium chromium-browser google-chrome-stable google-chrome; do
  if command -v "$candidato" >/dev/null 2>&1; then navegador=$candidato; break; fi
done
if [ -z "$navegador" ]; then
  echo "generar-pdf: no se encontró Chromium ni Chrome." >&2
  exit 1
fi

uv run --quiet --no-project --with 'markdown==3.*' python -I "$raiz/scripts/guias/md_a_html.py" "$guias" "$temporal"

for html in "$temporal"/*.html; do
  nombre=$(basename "$html" .html)
  "$navegador" --headless=new --disable-gpu --no-pdf-header-footer \
    --print-to-pdf="$guias/$nombre.pdf" "file://$html" >/dev/null 2>&1
  echo "  $guias/$nombre.pdf"
done
