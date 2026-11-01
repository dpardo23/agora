# Guía 6 · Calidad y pruebas

Versión 1.0 · creado el 2026-11-01 · editado el 2026-11-01 · autor: Juan Diego Pardo Pozo

Qué revisa cada barrera de calidad, en qué momento y cómo correr cada revisión a mano. El objetivo es que los errores aparezcan en tu equipo, antes de llegar a GitHub, y que nada llegue a `develop` o a `main` sin pasar por las mismas pruebas. Complementa el plan de pruebas (`docs/qa/plan-pruebas.md`), que define qué se prueba en cada nivel.

## 1. Las cuatro barreras

| Momento | Dónde | Qué revisa | Si falla |
|---|---|---|---|
| Al hacer commit | `.githooks/pre-commit` y `.githooks/commit-msg` | Nada privado ni secretos en el commit; mensaje en Conventional Commits (commitlint); sin coautoría de IA | El commit no se crea |
| Al hacer push | `.githooks/pre-push` | Lo rápido del CI, solo en las partes que cambiaron (sección 2) | No se sube nada |
| En cada PR | `.github/workflows/ci.yml` (check `ci-ok`) | Todo: convenciones, seguridad, workflows, documentación, web, E2E, accesibilidad, contrato, API, Lighthouse, base de datos y worker (sección 3) | El PR no se puede fusionar |
| Siempre, en GitHub | CodeQL, Dependabot y secret scanning | Análisis estático de seguridad, dependencias vulnerables y secretos filtrados (sección 5) | Alerta en la pestaña *Security* |

Los hooks se activan una vez por clon con `git config core.hooksPath .githooks` (guía 1, sección 5.2).

## 2. Antes de subir: `pre-push`

Al ejecutar `git push`, el hook compara lo que vas a subir con lo que ya está en GitHub (o con `develop`, si la rama es nueva) y corre solo lo que corresponde:

| Si cambió | Revisa |
|---|---|
| `apps/web/`, `package.json`, `pnpm-lock.yaml` o `pnpm-workspace.yaml` | Prettier, ESLint, TypeScript, Knip, pruebas unitarias con cobertura y contrato OpenAPI |
| `worker/` | ruff (lint y formato), mypy y pytest |
| `supabase/` | pgTAP y lint de la base, si Supabase local está en marcha |
| `.github/` | actionlint y zizmor |
| Cualquier `.md` | `scripts/verificar-docs.py` |

Las pruebas E2E, Lighthouse y Bruno no corren aquí porque necesitan levantar la web y tardan minutos: quedan para el CI. Si te falta `pnpm install` o Supabase está detenido, el hook avisa y deja pasar esa parte.

En una emergencia se puede saltar con `git push --no-verify`. El CI revisa lo mismo, así que saltarlo solo retrasa el error.

## 3. En cada PR: el CI

| Job | Qué hace | Cuándo corre |
|---|---|---|
| Versiones | Lee `mise.toml`: todos los jobs usan las mismas versiones que tu equipo | Siempre |
| Convenciones | Nombre de la rama, título del PR, mensajes de commit y autoría | En los PR |
| Seguridad | Archivos privados, gitleaks, `pnpm audit --prod` (vulnerabilidades altas) y revisión de licencias y vulnerabilidades de las dependencias nuevas | Siempre |
| Workflows | actionlint (sintaxis) y zizmor (seguridad de los workflows) | Siempre |
| Documentación | Enlaces, autoría y formato de `docs/` | Siempre |
| Web | Prettier, ESLint, TypeScript, Knip, Vitest con umbral de cobertura, build y contrato OpenAPI | Si cambia la web |
| E2E | Playwright en Chromium, Firefox y WebKit: humo, accesibilidad por ruta y contrato; después, Bruno contra la web compilada | Si cambia la web o la base |
| Lighthouse | Rendimiento, accesibilidad y buenas prácticas en móvil | En los PR que cambian la web |
| Base de datos | `supabase db reset`, pgTAP y lint | Si cambia `supabase/` |
| Worker | ruff, mypy y pytest con cobertura | Si cambia `worker/` |
| `ci-ok` | Resume todos los anteriores; es el único check obligatorio de los rulesets | Siempre |

Si un job falla, en la pestaña *Checks* del PR está el registro. Los reportes de Playwright (con trazas) y de Lighthouse se descargan como artefactos del run.

## 4. Las pruebas, una por una

### 4.1. Unitarias y de componentes (Vitest)

- Dónde: `apps/web/src/**/*.test.ts(x)`, junto al código que prueban.
- Correr: `pnpm test:unit` (con `--coverage` para ver la cobertura).
- **Umbral de cobertura:** 80 % de líneas, funciones, ramas y sentencias en `src/server/` y en `src/features/`. Las rutas de `src/app/` son handlers delgados y se prueban con E2E y contrato.

### 4.2. E2E y accesibilidad (Playwright y axe)

- Dónde: `apps/web/tests/e2e/`.
- Correr: `pnpm test:e2e` (levanta la web sola). Un solo navegador: `pnpm -C apps/web test:e2e --project=chromium`.
- `humo.spec.ts`: la web arranca y la API responde, en los tres navegadores.
- `accesibilidad.spec.ts`: recorre **todas las rutas** de `tests/e2e/rutas.ts` en tema claro y oscuro, en escritorio (1280 px) y móvil (390 px), y falla con cualquier violación *serious* o *critical* de WCAG 2.2 AA. **Cada HU que crea una pantalla agrega su ruta a `rutas.ts`**; no hace falta escribir otra prueba de accesibilidad.
- `contrato.spec.ts`: llama a cada GET sin parámetros de `openapi.json` y valida la respuesta contra su esquema. Si alguien cambia una respuesta sin regenerar el contrato, falla.
- En CachyOS, WebKit necesita la imagen de Playwright en Docker (guía 3, sección 8.1).

### 4.3. API (Bruno)

- Dónde: `apps/web/tests/api/`, una colección de [Bruno](https://www.usebruno.com) en archivos de texto `.bru`, agrupados por recurso.
- Correr, con la web en marcha (`pnpm dev`): `pnpm test:api`.
- Para explorarla con interfaz gráfica: instala la aplicación de escritorio de Bruno, «Open Collection» y elige esa carpeta. No necesita cuenta.
- Cada ruta nueva de `/api/v1` agrega su `.bru` con sus aserciones (estado, cuerpo y cabeceras) y su caso de error en `problem+json`.
- Se eligió Bruno y no Postman porque sus colecciones son texto versionado junto al código, no requieren cuenta ni nube y su licencia es MIT.

### 4.4. Lighthouse

- Configuración: `apps/web/lighthouserc.json` (umbrales de HU-16.04: 0,9 en rendimiento, accesibilidad y buenas prácticas en móvil; LCP ≤ 2,5 s; CLS ≤ 0,1).
- Correr en local: `pnpm build` y después `pnpm -C apps/web lighthouse` (necesita Chromium o Chrome).
- Hoy audita `/`. Cuando existan las pantallas de producto, se agregan sus rutas a `collect.url`.

### 4.5. Base de datos (pgTAP) y worker (pytest)

- pgTAP: `supabase test db` con Supabase en marcha; las pruebas viven en `supabase/tests/database/`. Las de RLS llegan con cada migración (T-03 en adelante).
- Worker: `cd worker && uv run pytest --cov`; además `uv run ruff check .`, `uv run ruff format --check .` y `uv run mypy umss` (modo estricto).

### 4.6. Calidad estática

| Herramienta | Qué detecta | Correr |
|---|---|---|
| Prettier | Formato y orden de clases de Tailwind | `pnpm format:check` (revisa) o `pnpm format` (corrige) |
| ESLint + boundaries | Errores, reglas de React y Next, y la arquitectura de ADR-002 | `pnpm lint` |
| TypeScript | Tipos, en modo estricto | `pnpm typecheck` |
| Knip | Archivos, exportaciones y dependencias sin usar | `pnpm knip` |
| actionlint y zizmor | Errores y riesgos de seguridad en `.github/workflows/` | Los corre el hook `pre-push` (sección 2) |

Las dependencias que se instalaron con el stack y todavía no usa ninguna pantalla están declaradas en `apps/web/knip.config.ts`, con la HU que las usará. Cuando una se empiece a usar, Knip avisa que sobra en esa lista.

## 5. Seguridad continua en GitHub

- **CodeQL** (configuración por defecto, activada en SPRINT-00): analiza JavaScript/TypeScript, Python y los workflows en cada PR y cada semana. Sus alertas están en *Security → Code scanning*.
- **Dependabot:** alertas de vulnerabilidades y PR semanales de actualización hacia `develop` (`.github/dependabot.yml`).
- **Secret scanning y push protection:** GitHub rechaza un push con un secreto reconocible.
- **Acciones fijadas por hash:** cada `uses:` de los workflows apunta al commit exacto de la acción, con la versión en un comentario. Dependabot actualiza el hash y el comentario a la vez. zizmor rechaza cualquier acción sin fijar.

## 6. Qué agregar con cada HU

1. Pruebas unitarias de la lógica nueva (cobertura de 80 % o más en `src/features/<dominio>/`).
2. La ruta de la pantalla en `apps/web/tests/e2e/rutas.ts`.
3. Si agrega una ruta de API: su contrato en `src/server/openapi/documento.ts`, `pnpm -C apps/web openapi:generar` y su `.bru` en `tests/api/`.
4. Las pruebas E2E de sus TC automatizables (`docs/qa/plan-pruebas.md`, sección 3).
5. Si agrega una migración: sus pruebas pgTAP de RLS.

## 7. Comprobación

- [ ] `git config core.hooksPath` muestra `.githooks` y existe `.githooks/pre-push`.
- [ ] Un `git push` con un error de formato en `apps/web/` es rechazado por el hook.
- [ ] `pnpm test:unit --coverage`, `pnpm test:e2e` y, con la web en marcha, `pnpm test:api` pasan.
- [ ] En un PR, el check `ci-ok` está en verde y aparece el job de workflows.
- [ ] *Security → Code scanning* muestra CodeQL configurado.
