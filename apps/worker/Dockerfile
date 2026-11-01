# Imagen del worker de Ágora (T-12; guía 4, sección 4.2). Una sola imagen para el PC (amd64) y la
# Oracle VM (arm64). Versiones fijas según la matriz de la guía 0.
FROM python:3.14.10-slim-trixie

# uv en la misma versión que mise.toml.
COPY --from=ghcr.io/astral-sh/uv:0.13.6 /uv /uvx /bin/

# TeX Live y Chromium de Debian «trixie» (también publicados para arm64). Los paquetes exactos se
# ajustarán a las recetas de LaTeX del motor cuando se incorpore (SPRINT-07).
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       texlive-latex-extra texlive-xetex texlive-lang-spanish texlive-fonts-extra \
       latexmk chromium fonts-noto-core \
    && rm -rf /var/lib/apt/lists/*

# Usuario propio con carpeta personal real: «nobody» no tiene HOME y uv no puede escribir su caché.
RUN useradd --create-home --uid 10001 --shell /usr/sbin/nologin agora

ENV UV_LINK_MODE=copy \
    UV_COMPILE_BYTECODE=1 \
    UV_PYTHON_DOWNLOADS=never \
    PYTHONUNBUFFERED=1

WORKDIR /app
RUN chown agora:agora /app
USER agora

# Primero las dependencias (capa que cambia poco) y después el código.
COPY --chown=agora:agora pyproject.toml uv.lock README.md ./
RUN uv sync --frozen --no-dev --no-install-project
COPY --chown=agora:agora umss ./umss
RUN uv sync --frozen --no-dev

# Se ejecuta con el Python del entorno virtual: no hace falta uv en tiempo de ejecución.
CMD [".venv/bin/python", "-m", "umss"]
