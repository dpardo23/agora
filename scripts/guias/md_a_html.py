"""Convierte las guías Markdown de docs/guias/entorno/ en HTML listo para imprimir a PDF.

Uso: uv run --with markdown python scripts/guias/md_a_html.py <carpeta-guías> <carpeta-salida>
Escribe un HTML por guía (NN-*.html) y uno combinado (agora-guias-entorno.html) con portada.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

import markdown

ESTILO = """
@page { size: A4; margin: 18mm 16mm 18mm 16mm; }
:root { --tx: #0B0B0B; --tx2: #55554F; --bg2: #F3F3F0; --line: #E4E4DE; --lila: #D2C5F3; --menta: #B9E3CA; }
* { box-sizing: border-box; }
body { font-family: "Noto Sans", "DejaVu Sans", sans-serif; color: var(--tx); font-size: 10.5pt; line-height: 1.5; margin: 0; }
h1 { font-size: 20pt; margin: 0 0 4pt; padding: 10pt 12pt; background: var(--lila); border-radius: 8pt; }
h2 { font-size: 14pt; margin: 18pt 0 6pt; padding-bottom: 3pt; border-bottom: 1.5pt solid var(--tx); break-after: avoid; }
h3 { font-size: 11.5pt; margin: 12pt 0 4pt; break-after: avoid; }
p.meta { color: var(--tx2); font-size: 9pt; margin: 4pt 0 12pt; }
code { font-family: "Noto Sans Mono", "DejaVu Sans Mono", monospace; font-size: 9pt; background: var(--bg2); padding: 0 3pt; border-radius: 3pt; }
pre { background: var(--bg2); border: 1pt solid var(--line); border-radius: 6pt; padding: 7pt 9pt; white-space: pre-wrap; word-break: break-word; break-inside: avoid; }
pre code { background: none; padding: 0; font-size: 8.6pt; }
table { border-collapse: collapse; width: 100%; margin: 6pt 0 10pt; font-size: 9pt; break-inside: auto; }
th, td { border: 0.75pt solid var(--line); padding: 3.5pt 5pt; vertical-align: top; text-align: left; }
th { background: var(--bg2); }
tr { break-inside: avoid; }
td code, th code { overflow-wrap: anywhere; }
a { color: var(--tx); }
ul, ol { padding-left: 16pt; }
li.tarea { list-style: none; margin-left: -14pt; }
.casilla { display: inline-block; width: 9pt; height: 9pt; border: 1pt solid var(--tx); border-radius: 2pt; margin-right: 5pt; vertical-align: -1pt; }
strong { font-weight: 700; }
.guia + .guia { break-before: page; }
.portada { height: 250mm; display: flex; flex-direction: column; justify-content: center; break-after: page; }
.portada .marca { font-size: 34pt; font-weight: 800; letter-spacing: 1pt; }
.portada .titulo { font-size: 18pt; margin-top: 6pt; }
.portada .franja { height: 10pt; background: linear-gradient(90deg, #F6C4B8, #F1DF97, #D2C5F3, #B9E3CA, #B7D5F0); border-radius: 5pt; margin: 18pt 0; }
.portada ul { font-size: 11pt; list-style: none; padding-left: 0; }
.portada li { margin: 3pt 0; }
.portada .pie { color: var(--tx2); font-size: 10pt; margin-top: 24pt; }
"""


def convertir(texto: str) -> str:
    # La línea «Versión … · autor: …» se muestra como metadato.
    texto = re.sub(r"^(Versión [^\n]+)$", r'<p class="meta">\1</p>', texto, count=1, flags=re.M)
    html = markdown.markdown(texto, extensions=["tables", "fenced_code", "sane_lists"])
    # Listas de comprobación: «[ ]» se dibuja como una casilla vacía.
    html = re.sub(r"<li>\[ \]\s*", '<li class="tarea"><span class="casilla"></span>', html)
    # Los enlaces entre guías no sirven en papel: se deja el texto.
    html = re.sub(r'<a href="(?!https?://)[^"]*">(.*?)</a>', r"\1", html)
    return html


def pagina(titulo: str, cuerpo: str) -> str:
    return (
        '<!doctype html><html lang="es"><head><meta charset="utf-8">'
        f"<title>{titulo}</title><style>{ESTILO}</style></head><body>{cuerpo}</body></html>"
    )


def main() -> int:
    origen, destino = Path(sys.argv[1]), Path(sys.argv[2])
    destino.mkdir(parents=True, exist_ok=True)
    guias = sorted(origen.glob("[0-9][0-9]-*.md"))
    secciones, indice = [], []
    for guia in guias:
        texto = guia.read_text(encoding="utf-8")
        titulo = texto.splitlines()[0].lstrip("# ").strip()
        cuerpo = f'<section class="guia">{convertir(texto)}</section>'
        (destino / f"{guia.stem}.html").write_text(pagina(titulo, cuerpo), encoding="utf-8")
        secciones.append(cuerpo)
        indice.append(f"<li>{titulo.replace('`', '')}</li>")
    fecha = re.search(r"editado el (\d{4}-\d{2}-\d{2})", (origen / "README.md").read_text(encoding="utf-8"))
    portada = (
        '<div class="portada"><div class="marca">ÁGORA</div>'
        '<div class="titulo">Guías del entorno de desarrollo · SPRINT-00</div><div class="franja"></div>'
        f'<ul>{"".join(indice)}</ul>'
        f'<div class="pie">Juan Diego Pardo Pozo · {fecha.group(1) if fecha else ""}</div></div>'
    )
    (destino / "agora-guias-entorno.html").write_text(
        pagina("Ágora · Guías del entorno", portada + "".join(secciones)), encoding="utf-8"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
