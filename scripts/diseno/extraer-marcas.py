#!/usr/bin/env python3
"""Lee la sección 4 (mockup anotado) de cada HU y escribe design/mockups/anotados/marcas.json.

Cada marca guarda su número y los textos literales entre «» que sirven para ubicarla en el diseño.
Uso: python scripts/diseno/extraer-marcas.py
"""
import json
import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
salida = []
for archivo in sorted(RAIZ.glob('docs/producto/historias/*/HU-*.md')):
    texto = archivo.read_text(encoding='utf-8')
    hu = re.search(r'^id: (\S+)', texto, re.M).group(1)
    pantallas = [Path(p).stem for p in re.findall(r'^\s+- (design/mockups/[^\s/]+\.png)', texto, re.M)]
    seccion = texto.split('## 4. Mockup anotado')[1].split('\n## ')[0]
    marcas = []
    for linea in seccion.splitlines():
        m = re.match(r'\|\s*([\d, ]+)\s*\|\s*(.+?)\s*\|', linea)
        if not m:
            continue
        literales = [l for l in re.findall(r'«([^«»]+)»', m.group(2)) if '{' not in l and len(l) >= 2]
        # El diseño todavía dice «bot» donde la interfaz dice «Olimpo» (docs/design.md, sección 13).
        variantes = [l.replace('Olimpo', 'bot') for l in literales if 'Olimpo' in l]
        variantes += [l.replace('Olimpo', 'Bot') for l in literales if 'Olimpo' in l]
        marcas.append({'n': m.group(1).split(',')[0].strip(), 'lits': literales + variantes})
    salida.append({'hu': hu, 'pngs': pantallas, 'marks': marcas})
destino = RAIZ / 'design/mockups/anotados/marcas.json'
destino.write_text(json.dumps(salida, ensure_ascii=False, indent=1), encoding='utf-8')
print(f'{len(salida)} HU → {destino.relative_to(RAIZ)}')
