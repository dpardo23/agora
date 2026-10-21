# Configuración de GitHub · Ágora

Versión 1.0 · creado el 2026-10-20 · editado el 2026-10-20 · autor: Juan Diego Pardo Pozo

Guía paso a paso para dejar el repositorio `dpardo23/agora` configurado de forma profesional. Cada sección dice **dónde** está la opción, **qué** elegir y, en una línea, **para qué** sirve. Los nombres de los menús son los de la interfaz de GitHub en inglés.

Orden recomendado: primero se sube el código (sección 0), después se protege (secciones 2 a 4) y por último se conectan los servicios (secciones 5 a 9).

---

## 0. Subir el código

```bash
cd ~/Documentos/agora
git push -u origin main develop chore/bases-del-proyecto
```

Después, en GitHub, abre un PR de `chore/bases-del-proyecto` hacia `develop` con el título `chore(repo): siembra las bases del proyecto`. Ese será el primer PR que revise el CI.

> No uses `git branch -M main`: renombra la rama en la que estás parado. Las ramas `main` y `develop` ya existen.

---

## 1. Cuenta personal (Settings de tu perfil, no del repo)

| Dónde | Qué hacer | Para qué |
|---|---|---|
| Password and authentication | Activar la autenticación en dos pasos (app o llave de seguridad) | Que nadie entre a tu cuenta con solo la contraseña |
| Emails | Verificar `jdiegopardo23@gmail.com`; activar «Keep my email addresses private» y «Block command line pushes that expose my email» solo si en git usas el correo `noreply` de GitHub | Que tus commits se asocien a tu perfil; la segunda opción oculta tu correo |
| SSH and GPG keys | Agregar tu llave SSH dos veces: una como **Authentication key** y otra como **Signing key** | Una para hacer push; la otra para **firmar** los commits (aparecen como «Verified») |
| SSH and GPG keys → Vigilant mode | Activar | Marca como «Unverified» cualquier commit con tu nombre que no esté firmado por ti |

Firmar los commits con la misma llave SSH (una sola vez por equipo):

```bash
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true
git config --global tag.gpgsign true
```

---

## 2. Settings → General

### Datos básicos
| Opción | Valor | Para qué |
|---|---|---|
| Repository name | `agora` | Identificador sin tilde (las URLs no admiten tildes) |
| Description (en la página principal, botón ⚙ de **About**) | «Ágora · plataforma universitaria personal con un Olimpo de agentes» | Lo que se ve en tu perfil y en las búsquedas |
| Website | La URL de Vercel cuando exista | Enlace directo a la app |
| Topics | `nextjs`, `react`, `typescript`, `supabase`, `pwa`, `tailwindcss`, `scrum`, `umss` | Hacen que el repo se encuentre por tema |
| Social preview | Una imagen de 1280×640 con el logo ÁGORA | La tarjeta que aparece al compartir el enlace |
| Default branch | `develop` | Los PR se abren hacia `develop` por defecto, como pide el modelo de ramas. Más adelante, si prefieres que la portada muestre la versión estable, vuelve a `main` |

### Features
| Opción | Valor | Para qué |
|---|---|---|
| Wikis | Desactivado | La documentación vive en `docs/`, versionada con el código |
| Issues | Activado | Seguimiento de PBI y bugs (sección 7) |
| Sponsorships | Desactivado | Solo sirve para recibir donaciones |
| Preserve this repository | Opcional | Lo incluye en el archivo a largo plazo de GitHub |
| Discussions | Desactivado | Foro de preguntas; no hace falta en un proyecto personal |
| Projects | Activado | Tablero Scrum (sección 8) |

### Pull Requests
| Opción | Valor | Para qué |
|---|---|---|
| Allow merge commits | Activado; mensaje por defecto «Pull request title and description» | Para fusionar `release/*` y `hotfix/*` en `main` sin aplastar el historial |
| Allow squash merging | Activado; mensaje por defecto «Pull request title» | Para entrar a `develop` con un solo commit por PR, cuyo mensaje es el título del PR (ya validado por el CI) |
| Allow rebase merging | Desactivado | Evita una tercera forma de fusionar |
| Always suggest updating pull request branches | Activado | Muestra el botón para traer los últimos cambios de la base |
| Allow auto-merge | Activado | El PR se fusiona solo cuando el CI termina en verde |
| Automatically delete head branches | Activado | Borra la rama después del merge (CONTRIBUTING.md, sección 1) |

Qué método se permite en cada rama lo fijan los rulesets de la sección 3.

### Danger Zone
No tocar. Ahí se cambia la visibilidad, se transfiere o se borra el repo.

---

## 3. Settings → Rules → Rulesets

Los rulesets reemplazan a la «branch protection» clásica: son más flexibles y se ven en un solo lugar. Crea cuatro, todos con **Enforcement status: Active** y **Bypass list vacía**. Así, ni siquiera tú puedes saltarte las reglas sin cambiarlas a propósito.

### Ruleset «main»
- **Target branches:** `main`.
- **Restrict deletions** y **Block force pushes:** activados. Nadie puede borrar `main` ni reescribir su historial.
- **Require a pull request before merging:** activado.
  - **Required approvals: 0.** GitHub no permite aprobar tus propios PR; si pones 1, nunca podrías fusionar.
  - **Require conversation resolution before merging:** activado. Los comentarios abiertos bloquean el merge.
  - **Allowed merge methods:** solo **Merge**.
- **Require status checks to pass:**
  - agrega el check **`ci-ok`**;
  - marca **Require branches to be up to date before merging**. Así no entra nada que no haya pasado el CI completo sobre la versión actual.
- **Require signed commits:** activado. Solo entran commits firmados (sección 1).

### Ruleset «develop»
Igual que «main», con dos diferencias:
- **Target branches:** `develop`.
- **Allowed merge methods:** solo **Squash**.

### Ruleset «etiquetas de versión»
- **Target:** etiquetas (*tags*) con el patrón `v*`.
- **Restrict creations**, **Restrict updates** y **Restrict deletions:** activados. Una versión publicada no se puede mover ni borrar.
- **Bypass list:** solo tú (*Repository admin*). Las etiquetas las creas al cerrar un sprint.

### Ruleset «ramas de trabajo» (opcional)
- **Target:** todas las ramas, excepto `main` y `develop`.
- **Block force pushes:** desactivado. En tus propias ramas sí puedes hacer `rebase` y `push --force-with-lease`.
- El nombre de la rama ya lo valida el CI (job «Convenciones»).

---

## 4. Settings → Actions

### General
| Opción | Valor | Para qué |
|---|---|---|
| Actions permissions | «Allow dpardo23, and select non-dpardo23, actions and reusable workflows» | Solo corren acciones de confianza |
| ↳ Allow actions created by GitHub | Activado | `actions/checkout`, `setup-node`, etc. |
| ↳ Allow actions by Marketplace verified creators | Activado | Proveedores verificados |
| ↳ Allow specified actions | `dorny/paths-filter@*, amannn/action-semantic-pull-request@*, wagoid/commitlint-github-action@*, gitleaks/gitleaks-action@*, pnpm/action-setup@*, supabase/setup-cli@*, astral-sh/setup-uv@*, treosh/lighthouse-ci-action@*` | Las que usan `ci.yml` y `cd.yml` |
| Artifact and log retention | 14 días | Suficiente para revisar fallos sin acumular espacio |
| Fork pull request workflows from outside collaborators | «Require approval for all outside collaborators» | **Importante en un repo público:** un PR de un desconocido no ejecuta código en tu CI sin tu aprobación |
| Workflow permissions | «Read repository contents and packages permissions» | Mínimo privilegio; `cd.yml` pide `contents: write` solo donde lo necesita |
| Allow GitHub Actions to create and approve pull requests | Desactivado | Ningún bot aprueba ni abre PR por su cuenta |

### Runners
GitHub-hosted (`ubuntu-latest`). No hace falta configurar nada.

---

## 5. Settings → Environments

Los environments agrupan secretos por entorno y permiten exigir una aprobación antes de desplegar.

| Environment | Deployment branches and tags | Protección | Secretos |
|---|---|---|---|
| `staging` | Solo la rama `develop` | Ninguna | `SUPABASE_PROJECT_REF`, `SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_PASSWORD` del proyecto de desarrollo |
| `produccion` | Solo etiquetas `v*` | **Required reviewers: tú.** Desactiva «Prevent self-review»: eres el único revisor | Los mismos tres, del proyecto de producción |

Con esto, `cd.yml` aplica migraciones en staging en cada merge a `develop`. Las de producción se pausan hasta que apruebes el despliegue.

---

## 6. Settings → Secrets and variables

| Pestaña | Qué poner | Para qué |
|---|---|---|
| Actions → Repository secrets | Nada por ahora | Los secretos van por environment (sección 5) |
| Actions → Variables | Nada por ahora | Valores no secretos compartidos por los workflows |
| Dependabot | Nada | Solo si Dependabot necesitara un registro privado |
| Codespaces | Nada | No se usa |

Regla: ningún secreto en el código ni en `docs/`. El CI lo verifica con gitleaks.

---

## 7. Settings → Advanced Security (o «Code security»)

| Opción | Valor | Para qué |
|---|---|---|
| Private vulnerability reporting | Activado | Quien encuentre una falla te la reporta en privado (`SECURITY.md`) |
| Dependency graph | Activado | Inventario de dependencias |
| Dependabot alerts | Activado | Avisos de dependencias con vulnerabilidades conocidas |
| Dependabot security updates | Activado | PR automáticos que corrigen esas vulnerabilidades |
| Grouped security updates | Activado | Un PR por grupo en lugar de muchos |
| Dependabot version updates | Ya configurado en `.github/dependabot.yml` | Actualizaciones semanales hacia `develop` |
| Code scanning → CodeQL analysis | **Default setup**, lenguajes JavaScript/TypeScript, Python y Actions | Análisis estático de seguridad en cada PR |
| Copilot Autofix | Desactivado | Evita commits sugeridos por terceros en tus PR |
| Secret Protection → Secret scanning | Activado | Detecta claves subidas por error |
| ↳ Push protection | Activado | Bloquea el push si contiene una clave |

---

## 8. Integraciones, apps y agentes

| Dónde | Qué hacer | Para qué |
|---|---|---|
| Settings → GitHub Apps (o «Integrations») | Instalar **Vercel**, con acceso **solo** a `agora` | Previews por PR, staging desde `develop` y producción desde `main` |
| Vercel → Project → Settings → Git | Production Branch: `main`; activar previews en todas las ramas | Coincide con `docs/arquitectura.md`, sección 6 |
| Settings → GitHub Apps | **No** instalar apps de asistentes de código ni bots que hagan commits | Así el único contributor sigue siendo `dpardo23` |
| Settings → Copilot / Agents | Desactivar el agente de código y la revisión automática para este repo | Ningún agente abre PR ni hace commits con otro autor |
| Settings → Webhooks | Nada | Vercel se conecta por su app |
| Settings → Deploy keys | Nada | No hay servidores que clonen el repo por SSH. Si la VM lo necesita (T-07), se agrega una llave **de solo lectura** |
| Settings → Pages | Desactivado | La app vive en Vercel |
| Settings → Collaborators | Nadie | Proyecto personal; los aportes externos requieren un acuerdo (CONTRIBUTING.md, sección 6) |
| Settings → Email notifications | Opcional: tu correo | Recibir un resumen de cada push |

---

## 9. Issues

Los documentos en `docs/` son la fuente de verdad. Los issues son el **tablero de seguimiento**: uno por PBI (HU o T) y uno por bug, cada uno enlazado a su archivo.

### Plantillas (ya incluidas en `.github/ISSUE_TEMPLATE/`)
| Plantilla | Uso |
|---|---|
| `historia.yml` | Una HU del backlog: ID, enlace al archivo, épica, sprint, MoSCoW y puntos |
| `tecnico.yml` | Un ítem técnico (T-NN): historia técnica, spike o chore |
| `bug.yml` | Un bug: ID, HU, CA violado, TC de origen, severidad y prioridad |
| `config.yml` | Desactiva los issues en blanco y enlaza a `SECURITY.md` para reportes de seguridad |

### Etiquetas (Issues → Labels)
Borra las etiquetas por defecto y crea estas. Con la CLI de GitHub:

```bash
gh label create "tipo:historia"   --color 0E8A16 --description "Historia de usuario"
gh label create "tipo:tecnico"    --color 5319E7 --description "Historia técnica, spike o chore"
gh label create "tipo:bug"        --color B23C0C --description "Defecto"
gh label create "moscow:must"     --color 0B0B0B
gh label create "moscow:should"   --color 5A5A53
gh label create "moscow:could"    --color A3A39B
gh label create "severidad:critica" --color B23C0C
gh label create "severidad:alta"  --color F4A27F
gh label create "severidad:media" --color F1DF97
gh label create "severidad:baja"  --color B9E3CA
gh label create "dependencias"    --color B7D5F0 --description "PR de Dependabot"
for ep in 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16; do gh label create "EP-$ep" --color D2C5F3; done
```

### Milestones (Issues → Milestones)
Crea un milestone por sprint, de `SPRINT-00` a `SPRINT-13`, **sin fecha** (Scrum sin fechas). Cada issue va al milestone de su sprint; el porcentaje de issues cerrados muestra el avance.

---

## 10. Projects (tablero Scrum)

Se crea desde tu perfil → **Projects → New project → Table**, con el nombre «Ágora · Product backlog», y se vincula al repo (repo → Projects → Link a project).

### Campos
| Campo | Tipo | Valores |
|---|---|---|
| Status | Single select | Borrador · Lista (DoR) · En curso · En QA · Hecha |
| Sprint | Single select | SPRINT-00 … SPRINT-13. No uses el tipo *Iteration*: exige fechas |
| Épica | Single select | EP-01 … EP-16 |
| MoSCoW | Single select | Must · Should · Could · Won't |
| Puntos | Number | 1, 2, 3, 5, 8, 13 |
| Tipo | Single select | Historia · Técnico · Bug |

### Vistas
| Vista | Diseño | Configuración | Para qué |
|---|---|---|---|
| Backlog | Table | Agrupar por Sprint y ordenar por MoSCoW | El product backlog completo |
| Sprint actual | Board | Columnas por Status, filtro `sprint:SPRINT-00` | El tablero del día a día |
| Por épica | Table | Agrupar por Épica y sumar Puntos | Avance por épica |
| Bugs | Table | Filtro `tipo:Bug` y ordenar por severidad | Triaje de defectos |

### Workflows del proyecto (menú ⋯ → Workflows)
| Workflow | Valor | Para qué |
|---|---|---|
| Auto-add to project | Activado para issues del repo `agora` | Todo issue nuevo entra al tablero |
| Item closed | Status = Hecha | Al cerrar el issue se mueve solo |
| Pull request merged | Status = Hecha | Al fusionar el PR que lo cierra (`Closes #N` en el PR) |
| Item reopened | Status = En curso | Si se reabre, vuelve al trabajo |

---

## 11. Releases

- `cd.yml` crea la release automáticamente al subir una etiqueta `vX.Y.Z`.
- `.github/release.yml` ordena las notas por categoría: funcionalidades, correcciones, documentación, mantenimiento y dependencias.
- Cierre de un sprint:
  1. Fusionar `release/sprint-NN` en `main` con merge commit.
  2. Crear la etiqueta firmada: `git tag -s v0.N.0 -m "SPRINT-NN"`.
  3. Subir la etiqueta: `git push origin v0.N.0`.
  4. Aprobar el despliegue en el environment `produccion`.

---

## 12. Archivos del repositorio que usa GitHub

| Archivo | Qué hace |
|---|---|
| `README.md` | Portada del repo |
| `LICENSE` | Licencia propietaria; GitHub la muestra como «View license» |
| `CONTRIBUTING.md` | Aparece como enlace al abrir un issue o un PR |
| `SECURITY.md` | Política de seguridad; GitHub la enlaza en la pestaña Security |
| `.github/CODEOWNERS` | Te asigna como revisor de todo PR automáticamente |
| `.github/pull_request_template.md` | Plantilla que se carga al abrir un PR |
| `.github/ISSUE_TEMPLATE/` | Formularios de issues |
| `.github/release.yml` | Categorías de las notas de release |
| `.github/dependabot.yml` | Actualizaciones semanales de dependencias |
| `.github/workflows/ci.yml` y `cd.yml` | Integración y entrega continuas |

---

## 13. Checklist final

- [ ] Código subido y primer PR abierto (sección 0).
- [ ] 2FA, llave de firma y Vigilant mode activados (sección 1).
- [ ] General configurado: features, métodos de merge y borrado automático de ramas (sección 2).
- [ ] Rulesets «main», «develop» y «etiquetas de versión» activos, con `ci-ok` obligatorio (sección 3).
- [ ] Actions restringidas y aprobación obligatoria para PR de forks (sección 4).
- [ ] Environments `staging` y `produccion` con sus secretos (sección 5).
- [ ] Seguridad: Dependabot, CodeQL, secret scanning y push protection (sección 7).
- [ ] Vercel conectado; ningún bot ni agente con permisos de escritura (sección 8).
- [ ] Etiquetas y milestones creados (sección 9).
- [ ] Proyecto «Ágora · Product backlog» con sus campos, vistas y workflows (sección 10).
