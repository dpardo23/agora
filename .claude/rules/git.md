# Reglas de Git (siempre)

- Sigue `CONTRIBUTING.md`: ramas `feature/HU-XX.YY-slug`, `tech/T-NN-slug`, `fix/BUG-NNN-slug`, `docs/…`, `ci/…`, `chore/…`, `release/sprint-NN` y `hotfix/…`.
- Nunca hagas commit directo en `main` ni en `develop`, ni `push --force` a ramas protegidas.
- Mensajes con Conventional Commits en español, en imperativo y en minúscula: `tipo(ámbito): descripción` de 72 caracteres como máximo, con `Refs: HU-XX.YY` en el pie. Los ámbitos válidos están en `commitlint.config.mjs`.
- **Autoría:** commits, PR, documentos y comentarios nombran solo a Juan Diego Pardo Pozo. No agregues líneas `Co-Authored-By`, enlaces de sesión ni menciones a herramientas de IA o asistentes.
- Haz commit o push solo cuando el titular lo pida.
