# Vista de despliegue y proceso · Ágora

Versión 1.0 · creado el 2026-11-01 · editado el 2026-11-01 · autor: Juan Diego Pardo Pozo

Dónde corre cada pieza de Ágora y cómo llega un cambio desde una rama hasta producción. Son las vistas de despliegue y de proceso de desarrollo de la descripción de arquitectura (`docs/arquitectura/README.md`, sección 2).

**Fuentes:** ADR-006 (entorno aislado), `.github/CONTRIBUTING.md` (ramas y versiones), `.github/workflows/ci.yml` y `cd.yml`, y las guías de `docs/guias/`. Si cambia la infraestructura o el pipeline, actualiza este documento en el mismo PR.

## 1. Despliegue en la nube (C4, diagrama de despliegue)

Todo corre en la región de São Paulo, la más cercana a Cochabamba, y dentro de los niveles gratuitos de cada proveedor.

```mermaid
C4Deployment
  title Ágora · despliegue
  Deployment_Node(dispositivo, "Dispositivo del titular", "Escritorio o Android") {
    Deployment_Node(navegador, "Navegador", "Chromium, Firefox o Safari") {
      Container(pwa, "PWA de Ágora", "Next.js, Serwist", "Interfaz instalable con caché sin conexión")
    }
  }
  Deployment_Node(vercel, "Vercel", "Región gru1, São Paulo") {
    Container(web, "Web y API", "Next.js 16, Node 24", "Funciones serverless y recursos estáticos")
  }
  Deployment_Node(supabase, "Supabase Cloud", "Región sa-east-1, São Paulo") {
    ContainerDb(db, "Postgres 17", "pgvector, RLS", "Datos, cola de trabajos y eventos")
    Container(servicios, "Auth, Storage y Realtime", "Supabase", "Sesiones, PDF y cambios en vivo")
  }
  Deployment_Node(oracle, "Oracle Cloud Free Tier", "VM ARM Ampere A1, Ubuntu, São Paulo") {
    Container(worker, "Motor de agentes", "Python 3.14, uv, systemd", "Toma trabajos y compila LaTeX")
    Container(n8n, "n8n", "Docker", "Automatizaciones con Google y la UMSS")
  }
  Deployment_Node(github, "GitHub", "dpardo23/agora") {
    Container(actions, "GitHub Actions", "CI y CD", "Pruebas, migraciones y releases")
  }
  Rel(pwa, web, "HTTPS")
  Rel(pwa, servicios, "Realtime", "WebSocket")
  Rel(web, db, "Consultas con RLS", "HTTPS")
  Rel(worker, db, "Cola y eventos", "service role")
  Rel(n8n, web, "Webhooks firmados", "HTTPS")
  Rel(actions, db, "Aplica migraciones", "Supabase CLI")
  Rel(actions, web, "Vercel despliega cada push")
  UpdateLayoutConfig($c4ShapeInRow="2", $c4BoundaryInRow="2")
```

| Nodo | Límite gratuito que importa | Cómo se vigila |
|---|---|---|
| Vercel (Hobby) | Uso personal y no comercial | Panel de Vercel |
| Supabase (Free) | 2 proyectos por cuenta; pausa tras 7 días sin actividad | `servicios_estado` y panel de consumo (EP-08) |
| Oracle Cloud (Always Free) | 4 OCPU y 24 GB en ARM; reclama VM con poco uso durante 7 días | `metricas_vm.cpu_p95_7d` y panel de consumo (EP-08) |
| GitHub Actions | Minutos ilimitados en un repositorio público | Pestaña Actions |

## 2. Entornos

| Entorno | Rama o evento | Web | Datos | Motor y n8n |
|---|---|---|---|---|
| Local | Cualquier rama | `pnpm dev`, puerto 3100 | Supabase CLI en Docker, puertos 55320 a 55329 | Docker (`mise run arriba --worker`) |
| Preview | Cada PR | Vercel, una URL por PR | Proyecto `agora-dev` | — |
| Staging | `develop` | Vercel, alias de `develop` | Proyecto `agora-dev` | — |
| Producción | Etiqueta `vX.Y.Z` en `main` | Vercel producción | Proyecto de producción, con aprobación manual | Oracle VM |

## 3. Entorno local

El entorno local está aislado del resto del equipo (ADR-006): mise fija las versiones solo dentro de la carpeta del proyecto y los servicios corren en contenedores descartables, publicados solo en `127.0.0.1`.

```mermaid
flowchart LR
  subgraph equipo["Equipo del titular (CachyOS)"]
    mise["mise: Node 24, pnpm 12, Python 3.14, uv, Supabase CLI"]
    dev["pnpm dev, puerto 3100"]
    subgraph docker["Docker, solo en 127.0.0.1"]
      sb["Supabase local, puertos 55320 a 55329"]
      n8["n8n, puerto 55678"]
      wk["Motor de agentes (perfil worker)"]
    end
  end
  bw["Bitwarden"]
  mise --> dev
  dev --> sb
  wk --> sb
  n8 --> dev
  bw -- "mise run entorno:env" --> dev
  bw -- "mise run entorno:env" --> wk
```

## 4. Proceso de desarrollo: de la rama a producción

Cada cambio entra por un PR hacia `develop`. El CI corre las mismas revisiones que el hook `pre-push` y algunas más; solo con el check `ci-ok` en verde se puede fusionar. Producción se publica al cierre de cada sprint con una etiqueta de versión.

```mermaid
flowchart TB
  rama["Rama desde develop: feature/HU-XX.YY, tech/T-NN, fix/BUG-NNN, docs, ci o chore"]
  commit["Commit: hooks pre-commit y commit-msg (privado, secretos, Conventional Commits)"]
  push["Push: hook pre-push (formato, lint, tipos, pruebas de lo que cambió)"]
  pr["PR hacia develop"]
  ci{"CI: ci-ok"}
  revision["Revisión y aprobación del titular"]
  develop["Merge en develop"]
  cd_staging["CD: migraciones en agora-dev y despliegue de staging"]
  release["Rama release/sprint-NN"]
  main["Merge en main"]
  tag["Etiqueta firmada vX.Y.Z"]
  aprobacion{"Aprobación manual: environment produccion"}
  prod["CD: migraciones en producción y release en GitHub"]
  arreglo["Corregir en la misma rama"]

  rama --> commit --> push --> pr --> ci
  ci -- falla --> arreglo --> commit
  ci -- pasa --> revision --> develop --> cd_staging
  develop -- cierre del sprint --> release --> main --> tag --> aprobacion
  aprobacion -- aprobada --> prod
```

### 4.1. Qué revisa el CI en cada PR

```mermaid
flowchart LR
  cambios["Detectar cambios"] --> conv["Convenciones: rama, título y commits"]
  cambios --> seg["Seguridad: privado, gitleaks, audit, licencias"]
  cambios --> flujos["Workflows: actionlint y zizmor"]
  cambios --> docs["Documentación"]
  cambios --> web["Web: formato, lint, tipos, Knip, Vitest, build, contrato"]
  web --> e2e["E2E y axe en Chromium, Firefox y WebKit; Bruno"]
  web --> lh["Lighthouse"]
  cambios --> db["Base de datos: reset, pgTAP y lint"]
  cambios --> mot["Motor: ruff, mypy y pytest"]
  cambios --> img["Imagen del motor en amd64 y arm64"]
  conv & seg & flujos & docs & e2e & lh & db & mot & img --> ok{"ci-ok"}
```

Antes de todo, el job «Versiones» lee `mise.toml` para que cada job use las mismas versiones que el equipo local. Los jobs que no aplican a un PR (por ejemplo, el motor en un PR solo de documentación) se omiten y `ci-ok` los cuenta como superados. El detalle de cada barrera está en la guía 6 (`docs/guias/entorno/06-calidad-y-pruebas.md`).
