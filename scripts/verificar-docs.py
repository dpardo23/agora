#!/usr/bin/env python3
"""Verifica la documentación de Ágora. Lo ejecuta el CI (job «documentación»).

Comprueba:
1. Enlaces Markdown relativos rotos: [texto](ruta).
2. Rutas del repositorio citadas entre comillas invertidas o en el frontmatter (mockups, fuente_diseno)
   que no existen. Se ignoran las rutas de código que aún no existe (apps/, worker/, supabase/, src/)
   y los marcadores de plantilla (XX, NNN, <, {, *).
3. Autoría: ningún documento atribuye su autoría a herramientas de IA o asistentes.
4. Formato: no se usa el signo «§» (se escribe «sección»).

Uso: python scripts/verificar-docs.py   (sale con código 1 si encuentra problemas)
"""
from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
EXCLUIR = ("node_modules", ".git", "docs/referencia", ".claude/skills/")
SKILLS_PROPIAS = ("escribir-hu", "escribir-tc", "reportar-bug", "portar-pantalla")
PREFIJOS_VERIFICABLES = ("docs/", "design/", "scripts/", ".github/", ".claude/rules/", ".claude/agents/")
MARCADORES = ("XX", "NN", "<", "{", "*", "…", "AAAA")
PENDIENTES = ("docs/qa/test-cases/TC-", "docs/qa/bugs/BUG-", "docs/qa/bugs/evidencias/")
AUTORIA_PROHIBIDA = [
    re.compile(r"(elaborado_por|responsable|autor)\s*:.*\b(claude|ia|asistente|chatgpt|copilot|gpt)\b", re.I),
    re.compile(r"\b(con|por|usando)\s+(claude code|un asistente|asistente de ia|inteligencia artificial)\b", re.I),
    re.compile(r"co-authored-by:\s*claude", re.I),
    re.compile(r"\b(generado|escrito|redactado)\s+(con|por)\s+(ia|claude|chatgpt|un asistente)\b", re.I),
]


def archivos_md() -> list[Path]:
    salida = []
    for ruta in RAIZ.rglob("*.md"):
        rel = ruta.relative_to(RAIZ).as_posix()
        if any(x in rel for x in EXCLUIR) and not any(f"/{s}/" in f"/{rel}" for s in SKILLS_PROPIAS):
            continue
        salida.append(ruta)
    return salida


def ignorada_por_git(ruta: str) -> bool:
    """Las rutas en .gitignore (p. ej. design/fuente/) existen solo en local: no se exigen."""
    return subprocess.run(["git", "check-ignore", "-q", ruta], cwd=RAIZ).returncode == 0


def es_verificable(ruta: str) -> bool:
    if not ruta.startswith(PREFIJOS_VERIFICABLES):
        return False
    if any(m in ruta for m in MARCADORES) or ruta.startswith(PENDIENTES):
        return False
    return "." in Path(ruta).name or ruta.endswith("/")


def main() -> int:
    problemas: list[str] = []
    for archivo in archivos_md():
        rel = archivo.relative_to(RAIZ).as_posix()
        texto = archivo.read_text(encoding="utf-8")
        for n, linea in enumerate(texto.splitlines(), 1):
            # 1. Enlaces Markdown relativos
            for destino in re.findall(r"\]\(([^)\s]+)\)", linea):
                if destino.startswith(("http://", "https://", "mailto:", "#")):
                    continue
                objetivo = (archivo.parent / destino.split("#")[0]).resolve()
                if not objetivo.exists():
                    problemas.append(f"{rel}:{n}: enlace roto → {destino}")
            # 2. Rutas citadas
            candidatas = re.findall(r"`([^`\s]+)`", linea)
            item = re.match(r"^\s+-\s+([\w./-]+\.\w+)(#.*)?\s*$", linea)
            if item:
                candidatas.append(item.group(1))
            for ruta in candidatas:
                ruta = ruta.split("#")[0].rstrip(".,;:)")
                if es_verificable(ruta) and not (RAIZ / ruta).exists() and not ignorada_por_git(ruta):
                    problemas.append(f"{rel}:{n}: ruta inexistente → {ruta}")
            # 3. Autoría
            for patron in AUTORIA_PROHIBIDA:
                if patron.search(linea):
                    problemas.append(f"{rel}:{n}: atribución de autoría no permitida → {linea.strip()[:90]}")
            # 4. Signo de sección
            if "§" in linea:
                problemas.append(f"{rel}:{n}: usa «§»; escribe «sección»")
    for p in problemas:
        print(p)
    print(f"\n{len(problemas)} problema(s) en {len(archivos_md())} documentos.")
    return 1 if problemas else 0


if __name__ == "__main__":
    sys.exit(main())
