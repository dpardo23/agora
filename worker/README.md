# worker

Paquete Python `umss`: el motor de agentes que genera los documentos de estudio. Usa `uv`, Python 3.14 y arquitectura hexagonal (`dominio/`, `puertos/`, `adaptadores/`, `roles/`).

Estado: esqueleto de T-12 (SPRINT-00), con las herramientas de desarrollo (pytest, pytest-cov, ruff y mypy), una prueba de humo y la imagen Docker con TeX Live y Chromium. El código del motor se incorpora en SPRINT-07 (EP-07).

- Uso diario, imagen y comandos: `docs/guias/entorno/04-backend-y-datos.md`, sección 4.
- Variables de entorno: `worker/.env.example` (guía 2, sección 10).
