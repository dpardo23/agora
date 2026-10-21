# Cómo contribuir a Ágora

Autor y responsable: Juan Diego Pardo Pozo (`dpardo23`, jdiegopardo23@gmail.com).

Este documento define el flujo de ramas, el formato de los commits, los pull requests y las versiones. El CI hace cumplir estas reglas: un PR que no las respeta no se puede fusionar.

## 1. Modelo de ramas (Git Flow adaptado a sprints)

```
main ─────●──────────────────────────●───────────── producción (etiquetas vX.Y.Z)
           \                        / \
develop ────●───●───●───●───●──────●───●─────────── integración (staging)
             \     / \     /        ↑
 feature/HU-…  ●──●   ●──●    release/sprint-NN ─┘
                       fix/BUG-…
```

| Rama | Sale de | Entra en | Uso | Protección |
|---|---|---|---|---|
| `main` | | | Código en producción. Cada merge lleva una etiqueta `vX.Y.Z` | Solo por PR desde `release/*` o `hotfix/*`; CI en verde; historial lineal de merges; sin `push --force` ni borrado |
| `develop` | `main` | | Integración del sprint en curso; se despliega en staging | Solo por PR; CI en verde; ramas actualizadas antes de fusionar |
| `feature/HU-XX.YY-slug` | `develop` | `develop` | Una HU (p. ej. `feature/HU-03.01-iniciar-sesion`) | |
| `tech/T-NN-slug` | `develop` | `develop` | Ítem técnico (p. ej. `tech/T-01-proyecto-nextjs`) | |
| `fix/BUG-NNN-slug` | `develop` | `develop` | Corrección de un bug del sprint | |
| `docs/slug` | `develop` | `develop` | Solo documentación | |
| `ci/slug`, `chore/slug` | `develop` | `develop` | Pipeline, configuración, dependencias | |
| `spike/T-NN-slug` | `develop` | (no se fusiona) | Investigación; el resultado va a un ADR o a la HU | |
| `release/sprint-NN` | `develop` | `main` y `develop` | Cierre de sprint: solo versión, changelog y correcciones de último momento | |
| `hotfix/vX.Y.Z-slug` | `main` | `main` y `develop` | Falla urgente en producción | |

Reglas:

- Nombres en minúsculas, en kebab-case, sin tildes ni ñ (`feature/HU-09.01-agregar-materia`).
- Una rama, un propósito: una HU, un bug o un ítem técnico. Nada de ramas «varios».
- Nunca se hace commit directo en `main` ni en `develop`. La única excepción es el commit inicial del repositorio.
- Las ramas se borran después de fusionarse.
- Antes de abrir un PR, la rama se actualiza con su base (`git rebase develop` en ramas propias, nunca en ramas compartidas).

## 2. Commits: Conventional Commits 1.0

### Formato

```
<tipo>(<ámbito>): <descripción>

<cuerpo opcional: qué cambia y por qué, en líneas de 100 caracteres como máximo>

<pie opcional: Refs: HU-03.01 · Closes: BUG-004 · BREAKING CHANGE: …>
```

### Tipos permitidos

| Tipo | Cuándo | Versión |
|---|---|---|
| `feat` | Funcionalidad nueva para el usuario | MINOR |
| `fix` | Corrección de un defecto | PATCH |
| `docs` | Solo documentación (HU, TC, bugs, ADR, README) | |
| `style` | Formato sin cambio de lógica (espacios, punto y coma) | |
| `refactor` | Cambio interno que no agrega funcionalidad ni corrige un defecto | |
| `perf` | Mejora de rendimiento | PATCH |
| `test` | Agrega o corrige pruebas | |
| `build` | Sistema de build o dependencias | |
| `ci` | Pipeline de CI/CD | |
| `chore` | Mantenimiento que no toca código de producción | |
| `revert` | Revierte un commit anterior | |

### Ámbitos permitidos

`web`, `api`, `ui`, `olimpo`, `encargos`, `consumo`, `auth`, `cuenta`, `materias`, `malla`, `agenda`, `tareas`, `avisos`, `estudio`, `inicio`, `pwa`, `db`, `worker`, `n8n`, `infra`, `design`, `producto`, `qa`, `adr`, `ci`, `deps`, `repo`.

### Reglas de redacción

1. Descripción en español, en **modo imperativo** y en minúscula: «agrega», «corrige», «elimina». Nunca «agregado», «cambios» ni «arreglos».
2. Como máximo 72 caracteres en la primera línea y sin punto final.
3. Un commit = un cambio lógico que compila y pasa las pruebas.
4. El pie cita la HU, el bug o el ítem técnico (`Refs: HU-03.01`).
5. Un cambio incompatible lleva `!` después del ámbito y `BREAKING CHANGE:` en el pie.
6. Los commits no mencionan herramientas de generación de código ni coautores automáticos. La autoría es siempre de Juan Diego Pardo Pozo. Lo garantizan tres capas:
   - el entorno de desarrollo no agrega atribución (`attribution` vacío en `.claude/settings.json`);
   - el hook local `.githooks/commit-msg` rechaza líneas `Co-authored-by` y similares (se activa una vez por clon con `git config core.hooksPath .githooks`);
   - el CI rechaza cualquier PR con commits de ese tipo.
   GitHub muestra como *contributor* solo a quien figura como autor o coautor de un commit; con estas capas, ese es únicamente `dpardo23`.

### Ejemplos

| Correcto | Incorrecto |
|---|---|
| `feat(auth): agrega verificación por código de Gmail en dispositivos nuevos` | `cambio 1` |
| `fix(olimpo): evita que los dioses atraviesen paredes al cambiar de sala` | `arreglos varios` |
| `docs(producto): agrega HU-05.08 de gestión de dioses y roles` | `Docs: Updated HU.` |
| `test(materias): cubre el cálculo de la nota necesaria en los límites` | `tests` |
| `ci(repo): ejecuta Lighthouse en los PR hacia main` | `ci` |
| `feat(api)!: renombra el recurso trabajos a encargos` + `BREAKING CHANGE: …` | `feat: big refactor` |

## 3. Pull requests

- **Título:** con el mismo formato de un commit. En `develop` se fusiona con **squash**, y el título del PR pasa a ser el commit final.
- **Descripción:** plantilla `.github/pull_request_template.md` (qué, por qué, HU o bug, cómo probar, capturas y checklist de DoD).
- **Requisitos para fusionar:**
  - todos los checks del CI en verde;
  - checklist de DoD completo;
  - TC de la HU ejecutados y enlazados;
  - `docs/api.md` actualizado si cambia la API.
- `release/*` y `hotfix/*` se fusionan en `main` con **merge commit** (sin squash) y una etiqueta.

## 4. Versiones y releases

- **SemVer:** `MAJOR.MINOR.PATCH`. Hasta la primera versión estable se usa `0.y.z`. Cada sprint cerrado sube MINOR (SPRINT-00 da `v0.1.0`, SPRINT-01 da `v0.2.0`…).
- Cierre de sprint:
  1. `release/sprint-NN` desde `develop`;
  2. actualizar `CHANGELOG.md` (generado desde los commits);
  3. PR a `main`;
  4. etiqueta `vX.Y.Z`;
  5. merge de vuelta a `develop`.
- **Hotfix:** `hotfix/vX.Y.Z-slug` desde `main`, sube PATCH, PR a `main` y luego a `develop`.

## 5. Configuración del repositorio en GitHub

La guía completa, paso a paso, está en [`docs/configuracion-github.md`](docs/configuracion-github.md): cuenta, General, rulesets de `main` y `develop` con `ci-ok` obligatorio, Actions, environments `staging` y `produccion`, seguridad, integraciones, issues, milestones, Projects y releases.

## 6. Licencia y contribuciones externas

- El proyecto es propietario, con código visible: «Todos los derechos reservados» (`LICENSE`).
- No se aceptan contribuciones externas sin un acuerdo escrito previo con el titular que ceda los derechos de lo aportado. Los PR de terceros sin ese acuerdo se cierran sin fusionar.
- Toda dependencia nueva debe tener una licencia compatible con el uso propietario (MIT, Apache-2.0, BSD, ISC, OFL o similares). Las licencias copyleft fuertes (GPL, AGPL) requieren una revisión y un ADR antes de incorporarse.
- `THIRD_PARTY_NOTICES.md` se actualiza en cada release.

## 7. Documentación y autoría

- Todo documento del repositorio indica como autor o responsable solo a **Juan Diego Pardo Pozo** (`dpardo23`, jdiegopardo23@gmail.com).
- Ningún documento, commit, PR ni comentario menciona herramientas de IA, asistentes ni generadores de código como autores o colaboradores. El CI lo verifica (`scripts/verificar-docs.py`).
- Esta regla no afecta los nombres de los **modelos que usa el producto** (por ejemplo, el motor Claude o Gemini de un rol del Olimpo): son datos del sistema, no autoría.
- Las rutas a archivos dentro de la documentación deben existir; el CI rechaza enlaces rotos.
