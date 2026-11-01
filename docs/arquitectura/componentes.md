# Vista de componentes · Ágora

Versión 1.1 · creado el 2026-11-01 · editado el 2026-11-01 · autor: Juan Diego Pardo Pozo

Estructura interna de los dos contenedores con código propio: la web (con su API) y el motor de agentes. Es el nivel 3 del modelo C4 y la vista de módulos de la descripción de arquitectura (`docs/arquitectura/README.md`, sección 2).

**Fuentes:** ADR-002 (monolito modular y motor hexagonal) y ADR-005 (dioses y roles). Las reglas de dependencia de la web las hace cumplir ESLint (`eslint-plugin-boundaries`) en el CI; las del motor, la revisión de cada PR. Si un ADR cambia la estructura, actualiza este documento en el mismo PR.

## 1. Web y API (Next.js)

La web es un **monolito modular por dominio**: cada dominio vive en `src/features/<dominio>/` y solo expone su `index.ts`. Las páginas y los handlers de la API son delgados: delegan en los casos de uso del dominio.

```mermaid
flowchart TB
  titular(["<b>Titular</b><br/>[Persona]"]):::persona
  subgraph web["Web y API · contenedor Next.js 16 en Vercel"]
    proxy["<b>Proxy</b><br/>[Componente: src/proxy.ts]<br/>Refresca la sesión y bloquea (app) hasta verificar el dispositivo"]:::componente
    paginas["<b>Páginas</b><br/>[Componente: src/app/(app) y (auth)]<br/>Server y Client Components; leen con RLS"]:::componente
    api["<b>API REST</b><br/>[Componente: src/app/api/v1]<br/>Handlers delgados: validar, autorizar, caso de uso, respuesta"]:::componente
    features["<b>Módulos de dominio</b><br/>[Componente: src/features/dominio]<br/>ui, application, domain e infra; API pública en index.ts"]:::componente
    ui["<b>Kit de interfaz</b><br/>[Componente: src/components/ui]<br/>shadcn/ui adaptado al sistema de diseño"]:::componente
    server["<b>Servidor</b><br/>[Componente: src/server]<br/>Service role, correo, firmas HMAC, errores problem+json y OpenAPI"]:::componente
    shared["<b>Compartido</b><br/>[Componente: src/shared]<br/>Navegación, utilidades y tipos generados de la base"]:::componente
  end
  db[("<b>Supabase</b><br/>[Contenedor]<br/>Postgres, Auth, Storage y Realtime")]:::contenedor
  titular -- "Usa<br/>[HTTPS]" --> proxy
  proxy -- "Deja pasar" --> paginas
  paginas -- "Usa la API pública" --> features
  paginas -- "Compone" --> ui
  api -- "Llama a casos de uso" --> features
  api -- "Usa" --> server
  features -- "Escrituras privilegiadas" --> server
  features -- "Usa" --> shared
  features -- "Lee con RLS y escucha<br/>[supabase-js, Realtime]" --> db
  server -- "Escribe<br/>[service role]" --> db
  classDef persona fill:#08427b,stroke:#052e56,color:#ffffff
  classDef sistema fill:#1168bd,stroke:#0b4884,color:#ffffff
  classDef contenedor fill:#438dd5,stroke:#2e6295,color:#ffffff
  classDef componente fill:#85bbf0,stroke:#5d82a8,color:#0b0b0b
  classDef externo fill:#8a8a8a,stroke:#6b6b6b,color:#ffffff
```

### 1.1. Dependencias permitidas

Dentro de un módulo de dominio, las capas solo dependen hacia adentro: la interfaz usa los casos de uso, los casos de uso usan el dominio y la infraestructura, y el dominio no depende de nadie.

```mermaid
flowchart LR
  subgraph app["src/app"]
    pag["Páginas"]
    rh["Handlers /api/v1"]
  end
  subgraph modulo["src/features/tareas (un módulo)"]
    idx["index.ts (API pública)"]
    fui["ui/"]
    fap["application/ (casos de uso)"]
    fdo["domain/ (reglas puras y esquemas Zod)"]
    fin["infra/ (Supabase y servicios)"]
  end
  otro["src/features/materias/index.ts"]
  srv["src/server"]
  sh["src/shared"]
  kit["src/components/ui"]

  pag --> idx
  rh --> idx
  idx --> fui
  idx --> fap
  fui --> fap
  fui --> kit
  fap --> fdo
  fap --> fin
  fin --> fdo
  fin --> srv
  fap --> otro
  fui --> sh
  fap --> sh
```

| Regla | Qué impide |
|---|---|
| Un módulo solo importa el `index.ts` de otro módulo | Que un cambio interno de `materias` rompa `tareas` |
| `domain/` no importa React, Next ni Supabase | Reglas de negocio atadas a un framework; así se prueban con Vitest sin nada más |
| La lógica de negocio vive en `domain/` y `application/` | Reglas escondidas en componentes o en `route.ts` |
| La service role solo existe en `src/server/` | Que una clave con acceso total llegue al navegador |
| Toda escritura con reglas de negocio pasa por `/api/v1` | Escrituras sin validación ni contrato |

### 1.2. Módulos de dominio previstos

| Módulo | Épicas | Recurso de la API |
|---|---|---|
| `cuenta` | EP-03, EP-04 | `/auth`, `/perfil`, `/dispositivos`, `/integraciones` |
| `olimpo` | EP-05 | `/dioses`, `/roles` |
| `encargos` | EP-06 | `/encargos`, `/esquemas`, `/documentos` |
| `consumo` | EP-08 | `/consumo` |
| `materias` | EP-09 | `/materias` |
| `malla` | EP-10 | `/malla` |
| `agenda` | EP-11 | `/eventos` |
| `tareas` | EP-12 | `/tareas`, `/listas` |
| `avisos` | EP-13 | `/avisos`, `/reglas-avisos`, `/webhooks/n8n` |
| `estudio` | EP-14 | `/mazos`, `/tarjetas`, `/sesiones` |
| `inicio` | EP-15 | Solo lectura |

El inventario exacto de rutas está en `docs/arquitectura/api.md`.

## 2. Motor de agentes (`umss`, Python)

El motor sigue la **arquitectura hexagonal**: el núcleo (dominio y orquestador) define puertos, y los adaptadores los implementan con la tecnología del momento. Cambiar de modelo, de cola o de almacenamiento es cambiar un adaptador, no el núcleo. Los **roles** son *plugins*: cada uno es un *handler* registrado por nombre con `@registrar_rol("nombre")` (ADR-005).

```mermaid
flowchart TB
  subgraph adaptadores_entrada["Adaptadores de entrada"]
    svc["Servicio systemd: bucle de la cola"]
    cli["CLI: python -m umss"]
  end
  subgraph nucleo["Núcleo (umss/dominio)"]
    orq["Orquestador del pipeline"]
    reg["Registro de roles"]
    bar["Barrera de entrega: citas, DOI, sin huecos"]
  end
  subgraph roles["Roles (umss/roles), uno por handler"]
    r1["investigar_fuentes"]
    r2["redactar"]
    r3["verificar_citas"]
    r4["compilar_latex"]
    r5["entregar_drive"]
    rn["... roles nuevos"]
  end
  subgraph puertos["Puertos (umss/puertos)"]
    pc["Cola"]
    pm["ModeloLLM"]
    pa["Almacen"]
    pco["Compilador"]
    pn["Notificador"]
    pe["RegistroEventos"]
  end
  subgraph adaptadores_salida["Adaptadores de salida (umss/adaptadores)"]
    ac["Cola en Supabase: tomar_trabajo"]
    am["Claude Code y Gemini"]
    aa["Storage de Supabase y Google Drive"]
    aco["latexmk con XeLaTeX"]
    an["Correo"]
    ae["eventos_agente en Supabase"]
  end

  svc --> orq
  cli --> orq
  orq --> reg
  reg --> roles
  orq --> bar
  orq --> pc
  orq --> pe
  roles --> pm
  roles --> pa
  roles --> pco
  roles --> pn
  pc -. implementa .- ac
  pm -. implementa .- am
  pa -. implementa .- aa
  pco -. implementa .- aco
  pn -. implementa .- an
  pe -. implementa .- ae
```

| Regla | Qué impide |
|---|---|
| El núcleo y los roles solo conocen puertos | Que cambiar de modelo o de cola obligue a reescribir el pipeline |
| Un rol nuevo es un *handler* más y una fila en `roles` | Tocar el orquestador para crecer |
| El pipeline resuelve qué dios ejecuta cada rol en tiempo de ejecución | Atar un rol a un dios concreto |
| Las verificaciones de la barrera de entrega no se desactivan | Entregar un PDF con citas inventadas o secciones vacías |
| El motor solo se comunica con la web por la base de datos | Que una caída de la VM rompa la web |
