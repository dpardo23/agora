# Vista de datos · Ágora

Versión 1.1 · creado el 2026-11-01 · editado el 2026-11-01 · autor: Juan Diego Pardo Pozo

Modelo de datos de Ágora en diagramas entidad-relación, agrupados por dominio. Es la vista de información de la descripción de arquitectura (`docs/arquitectura/README.md`, sección 2).

## 1. Fuente y estado

- **Fuente:** el esquema borrador `supabase/borradores/0001_init.sql`, corregido con las decisiones de los ADR (ante una diferencia, manda el ADR). El cambio más grande es el de ADR-005: la tabla `agentes` del borrador se reemplaza por `dioses`, `roles`, `asignaciones_rol` y `pipeline_pasos`.
- **Estado:** diseño. El esquema real nace en T-03, al dividir el borrador en migraciones de `supabase/migrations/`. **T-03 actualiza este documento en el mismo PR que crea las migraciones**, y desde entonces la fuente de verdad son las migraciones.
- **Convenciones:** tablas en plural y en español, en `snake_case`. Las claves primarias son `uuid` (datos del usuario) o `bigint` de identidad (registros de alto volumen, como trabajos y eventos). Las fechas son `timestamptz` y se muestran en `America/La_Paz`.
- **Notación de los diagramas:** Mermaid `erDiagram` con la notación pata de gallo. `PK` es clave primaria, `FK` es clave foránea y `UK` es una columna única. Se muestran las columnas que definen el modelo; las de auditoría (`created_at`, `updated_at`) se omiten salvo cuando tienen un significado propio.

## 2. Seguridad del modelo

| Grupo | Tablas | Política RLS |
|---|---|---|
| Datos del titular | Todas las que tienen `user_id` | `propio`: lectura y escritura solo si `user_id = auth.uid()` |
| Catálogos y datos del motor | `plan_materias`, `plan_prerrequisitos`, `oficina_salas`, `dioses`, `roles`, `asignaciones_rol`, `pipeline_pasos`, `trabajo_pasos`, `esquemas`, `eventos_agente`, `fuentes`, `pasajes`, `uso_modelo`, `metricas_vm`, `servicios_estado` | `lectura`: solo lectura para usuarios autenticados. Escribe el worker con la service role |
| Códigos de verificación | `codigos_verificacion` | Sin políticas: solo el servidor la usa, con la service role |

Las funciones `tomar_trabajo` (toma atómica de la cola con `FOR UPDATE SKIP LOCKED`) y `correo_de_usuario` (resuelve usuario a correo sin exponerlo) son `security definer` y solo las ejecuta la service role.

## 3. Mapa general

Los siete dominios del modelo, con sus tablas, y las claves foráneas que los conectan. Las secciones 4 a 10 detallan cada dominio con su diagrama entidad-relación, sus columnas y sus cardinalidades. `auth.users` es la tabla de usuarios de Supabase Auth.

```mermaid
flowchart TB
  cuenta["<b>Cuenta y acceso</b><br/>auth.users · perfil<br/>dispositivos_confiables · codigos_verificacion"]
  academico["<b>Vida académica</b><br/>materias · materia_horarios<br/>materia_unidades · evaluaciones<br/>plan_materias · plan_prerrequisitos"]
  olimpo["<b>Olimpo</b><br/>oficina_salas · dioses · roles<br/>asignaciones_rol · pipeline_pasos"]
  encargos["<b>Encargos y documentos</b><br/>trabajos · trabajo_pasos · esquemas<br/>eventos_agente · documentos<br/>fuentes · pasajes"]
  consumo["<b>Consumo e infraestructura</b><br/>uso_modelo · metricas_vm<br/>servicios_estado"]
  organizacion["<b>Organización</b><br/>listas_tareas · tareas · eventos<br/>reglas_avisos · avisos"]
  estudio["<b>Estudio y repaso</b><br/>mazos · tarjetas · revisiones<br/>sesiones_estudio"]
  cuenta -- "user_id en las tablas del titular" --> academico
  cuenta -- "user_id" --> encargos
  cuenta -- "user_id" --> organizacion
  cuenta -- "user_id" --> estudio
  academico -- "materia_id" --> encargos
  academico -- "materia_id" --> organizacion
  academico -- "materia_id" --> estudio
  olimpo -- "rol_id y dios_id" --> encargos
  olimpo -- "rol_id" --> consumo
  encargos -- "trabajo_id" --> consumo
  encargos -- "trabajo_id" --> organizacion
  encargos -- "documento_id" --> estudio
  organizacion -- "tarea_id" --> estudio
```

## 4. Cuenta y acceso (EP-03, EP-04)

El usuario entra con su **usuario** (`perfil.usuario`); el correo de Supabase Auth nunca llega al navegador. Un dispositivo nuevo exige un código de 6 dígitos que se guarda como hash, vence a los 10 minutos y admite 5 intentos (HU-03.02).

```mermaid
erDiagram
  auth_users ||--|| perfil : "tiene"
  auth_users ||--o{ dispositivos_confiables : "registra"
  auth_users ||--o{ codigos_verificacion : "recibe"
  auth_users {
    uuid id PK "Supabase Auth"
    text email "nunca se expone"
  }
  perfil {
    uuid user_id PK, FK
    text usuario UK "a-z, 0-9, punto y guion bajo; 3 a 32"
    text nombre
    tema_ui tema "claro, oscuro o sistema"
    text drive_raiz "Mi unidad/UMSS"
    text zona_horaria "America/La_Paz"
    numeric meta_horas_semana
    boolean sync_calendar
    boolean sync_tasks
  }
  dispositivos_confiables {
    uuid id PK
    uuid user_id FK
    text token_hash UK "sha256 de la cookie agora_device"
    text nombre
    text user_agent
    timestamptz ultimo_uso
    timestamptz expira "30 días"
  }
  codigos_verificacion {
    uuid id PK
    uuid user_id FK
    text codigo_hash
    text proposito "login o recuperar"
    smallint intentos "5 como máximo"
    timestamptz expira "10 minutos"
    boolean usado
  }
```

## 5. Vida académica (EP-09, EP-10)

`materias` son las del titular en cada gestión; `plan_materias` y `plan_prerrequisitos` son el catálogo de la malla curricular, igual para todos, y se relacionan con las materias del titular por `codigo_sis`.

```mermaid
erDiagram
  materias ||--o{ materia_horarios : "se dicta en"
  materias ||--o{ materia_unidades : "se divide en"
  materias ||--o{ evaluaciones : "se califica con"
  plan_materias ||--o{ plan_prerrequisitos : "exige"
  plan_materias ||--o{ plan_prerrequisitos : "es requisito de"
  plan_materias |o..o{ materias : "codigo_sis"
  materias {
    uuid id PK
    uuid user_id FK
    text codigo_sis "único por user_id y gestion"
    text nombre
    text grupo
    smallint semestre_plan "1 a 12"
    text gestion "II/2026"
    estado_materia estado "cursando, aprobada, reprobada o pendiente"
    text docente
    text color "rosa, mant, lila, menta o cielo"
    text drive_carpeta_id
    numeric nota_final
  }
  materia_horarios {
    uuid id PK
    uuid materia_id FK
    smallint dia "ISO: 1 es lunes"
    time inicio
    time fin "posterior a inicio"
    text aula
    tipo_clase tipo "teoria, laboratorio o auxiliatura"
  }
  materia_unidades {
    uuid id PK
    uuid materia_id FK
    smallint orden "único por materia"
    text titulo
    boolean completada
  }
  evaluaciones {
    uuid id PK
    uuid materia_id FK
    text nombre "Primer parcial"
    numeric peso "0 a 100"
    numeric nota "0 a 100"
    date fecha
  }
  plan_materias {
    text codigo_sis PK
    text nombre
    smallint semestre
    smallint creditos
  }
  plan_prerrequisitos {
    text codigo_sis PK, FK
    text requiere_codigo PK, FK
  }
```

## 6. El Olimpo: dioses y roles (EP-05, ADR-005)

Un **rol** es una capacidad del sistema y un **dios** es la persona visible que lo ejerce. Un rol tiene un solo dios titular y un dios puede tener varios roles. El pipeline de un trabajo apunta a roles, nunca a dioses. La escena (salas, escritorios y sprites) es un dato, así que un dios nuevo aparece sin cambiar código.

```mermaid
erDiagram
  oficina_salas ||--o{ dioses : "aloja"
  dioses ||--o{ asignaciones_rol : "ejerce"
  roles ||--|| asignaciones_rol : "tiene titular"
  roles ||--o{ pipeline_pasos : "ejecuta"
  oficina_salas {
    text id PK "despacho, redaccion, descanso"
    text nombre
    smallint planta "1 o 2"
    tipo_sala tipo "trabajo o estado"
    int x
    int y
    int w
    int h
    jsonb puertas "puntos del grafo de rutas"
    jsonb escritorios "posición y orientación"
    smallint capacidad
  }
  dioses {
    text id PK "zeus, atenea, apolo"
    text nombre
    text sala_id FK
    smallint escritorio
    jsonb sprite "mapa de caracteres, paleta y atributos"
    estado_agente estado "estado de la escena"
    text estado_control "activo o pausado"
    boolean activo
    smallint orden
  }
  roles {
    text id PK "redactar, verificar_citas"
    text nombre "Control maestro"
    motor_modelo motor "claude, gemini_flash, python, texlive"
    jsonb config "permisos y ajustes del rol"
    text estacion_sala_id "estación secundaria, si la tiene"
  }
  asignaciones_rol {
    text rol_id PK, FK "un único titular por rol"
    text dios_id FK
    smallint prioridad
  }
  pipeline_pasos {
    text tipo_trabajo PK "documento de estudio"
    smallint orden PK "1 a 9"
    text rol_id FK
    text nombre "Redactar"
  }
```

La base impide retirar un dios que todavía es titular de algún rol (ADR-005, regla 8): `asignaciones_rol.dios_id` no admite borrar en cascada.

## 7. Encargos, documentos y fuentes (EP-06, EP-07)

Un **trabajo** es un encargo de documento. El worker lo toma de la cola, recorre los pasos de `pipeline_pasos` y registra cada paso en `trabajo_pasos` con el rol y el dios que lo ejecutaron. Si `aprobar_esquema` está activo, el trabajo espera a que el titular apruebe el esquema. Cada acción de un dios queda en `eventos_agente`, que la escena del Olimpo recibe por Realtime.

```mermaid
erDiagram
  trabajos ||--o{ trabajo_pasos : "avanza por"
  trabajos ||--o| esquemas : "propone"
  trabajos ||--o{ eventos_agente : "genera"
  trabajos |o--o| documentos : "entrega"
  trabajos ||--o{ fuentes : "consulta"
  fuentes ||--o{ pasajes : "contiene"
  roles ||--o{ trabajo_pasos : "se ejecuta en"
  dioses ||--o{ trabajo_pasos : "ejecuta"
  dioses ||--o{ eventos_agente : "protagoniza"
  trabajos {
    bigint id PK "se muestra como #14"
    uuid user_id FK
    uuid materia_id FK
    text tema
    smallint paginas "1 a 200"
    text indicaciones
    boolean aprobar_esquema
    estado_trabajo estado "ver vista de comportamiento"
    text estado_control "activo o pausado"
    numeric progreso
    text trabajador "vm-oracle-1"
    text error
    timestamptz iniciado_at
    timestamptz entregado_at
  }
  trabajo_pasos {
    bigint id PK
    bigint trabajo_id FK
    smallint orden "único por trabajo"
    text rol_id FK
    text dios_id FK
    estado_paso estado "pendiente, en_proceso, hecho, error u omitido"
    text detalle "Redacción 3 de 6"
    int tokens_in
    int tokens_out
    numeric usd_lista
    timestamptz inicio
    timestamptz fin
  }
  esquemas {
    bigint id PK
    bigint trabajo_id FK, UK
    jsonb secciones
    estado_esquema estado "pendiente, aprobado o cambios_pedidos"
    text comentarios
    timestamptz resuelto_at
  }
  eventos_agente {
    bigint id PK
    text dios_id FK
    text rol_id FK
    tipo_evento_ag tipo "paso_iniciado, traspaso, paso_fallido"
    bigint trabajo_id FK
    text destino_dios_id FK "solo en traspaso"
    text mensaje "texto de la burbuja"
    timestamptz created_at
  }
  documentos {
    bigint id PK
    uuid user_id FK
    bigint trabajo_id FK, UK
    uuid materia_id FK
    text titulo
    smallint paginas
    text storage_path "bucket privado documentos"
    text drive_file_id
    numeric usd_total
  }
  fuentes {
    bigint id PK
    bigint trabajo_id FK
    text titulo
    text url
    text doi
    text idioma "es, en u otro"
    text bibtex
  }
  pasajes {
    bigint id PK
    bigint fuente_id FK
    text texto "cita literal"
    int pagina
    vector embedding "1024 dimensiones, índice HNSW"
  }
```

## 8. Consumo e infraestructura (EP-08)

El panel de consumo compara el uso de los modelos con los límites gratuitos, y el estado de la VM con las reglas de inactividad de Oracle.

```mermaid
erDiagram
  trabajos |o--o{ uso_modelo : "consume"
  roles |o--o{ uso_modelo : "se atribuye a"
  uso_modelo {
    bigint id PK
    bigint trabajo_id FK
    smallint paso_orden
    text rol_id FK
    motor_modelo motor
    text modelo "identificador exacto del modelo"
    int tokens_in
    int tokens_out
    int tokens_cache
    numeric usd_lista
    boolean interactivo "sesiones de depuración"
    timestamptz created_at
  }
  metricas_vm {
    bigint id PK
    numeric disco_total_gb
    numeric disco_usado_gb
    jsonb disco_desglose
    numeric ram_total_gb
    numeric ram_usada_gb
    numeric cpu_pct
    numeric cpu_p95_7d "uso de 7 días frente a la regla de inactividad"
    bigint uptime_s
    timestamptz created_at
  }
  servicios_estado {
    text servicio PK "trabajador, n8n, claude_code, respaldo"
    boolean ok
    text detalle
    timestamptz actualizado
  }
```

## 9. Organización: tareas, agenda y avisos (EP-11, EP-12, EP-13)

Las tareas admiten subtareas y repetición (RRULE, RFC 5545) y pueden nacer de un aviso. Los avisos llegan desde n8n (Gmail y las webs de la UMSS y la FCyT) y no se duplican gracias a `externo_id`.

```mermaid
erDiagram
  listas_tareas ||--o{ tareas : "agrupa"
  tareas |o--o{ tareas : "tiene subtareas"
  avisos |o--o{ tareas : "origina"
  materias |o--o{ listas_tareas : "tiene"
  materias |o--o{ tareas : "se relaciona con"
  materias |o--o{ eventos : "agenda"
  materias |o--o{ avisos : "recibe"
  trabajos |o--o{ eventos : "se agenda como"
  listas_tareas {
    uuid id PK
    uuid user_id FK
    text nombre
    uuid materia_id FK
    text google_tasklist_id
    smallint orden
  }
  tareas {
    uuid id PK
    uuid user_id FK
    uuid lista_id FK
    uuid padre_id FK "subtarea de"
    uuid materia_id FK
    uuid aviso_id FK
    text titulo
    text notas
    timestamptz vence
    timestamptz recordatorio
    text repetir "RRULE"
    timestamptz completada_at
    text google_task_id
  }
  eventos {
    uuid id PK
    uuid user_id FK
    uuid materia_id FK
    bigint trabajo_id FK
    tipo_evento_cal tipo "parcial, entrega, clase, bot u otro"
    text titulo
    timestamptz inicio
    timestamptz fin
    text aula
    interval recordatorios "lista; 3 días y 1 día por defecto"
    text google_event_id
  }
  reglas_avisos {
    uuid id PK
    uuid user_id FK
    fuente_aviso fuente
    text patron "remitente, dominio o URL"
    boolean activa
  }
  avisos {
    uuid id PK
    uuid user_id FK
    fuente_aviso fuente "gmail, umss, fcyt, bot o recordatorio"
    text remitente
    text asunto
    text cuerpo "se muestra saneado"
    uuid materia_id FK
    jsonb detectado "fecha, aula y materia extraídas"
    boolean leido
    boolean destacado
    boolean archivado
    text externo_id "único por user_id y fuente"
    timestamptz recibido_at
  }
```

## 10. Estudio y repaso (EP-14)

Las tarjetas usan el algoritmo FSRS (`ts-fsrs`); sus columnas son las que ese algoritmo necesita para calcular el próximo repaso. Un mazo puede nacer de un documento generado por el Olimpo.

```mermaid
erDiagram
  documentos |o--o{ mazos : "alimenta"
  materias |o--o{ mazos : "agrupa"
  mazos ||--o{ tarjetas : "contiene"
  tarjetas ||--o{ revisiones : "registra"
  materias |o--o{ sesiones_estudio : "se estudia en"
  tareas |o--o{ sesiones_estudio : "se trabaja en"
  mazos {
    uuid id PK
    uuid user_id FK
    uuid materia_id FK
    bigint documento_id FK
    text nombre
  }
  tarjetas {
    uuid id PK
    uuid user_id FK
    uuid mazo_id FK
    text frente
    text reverso
    timestamptz due "próximo repaso"
    float stability
    float difficulty
    int reps
    int lapses
    smallint state "0 nueva, 1 aprendiendo, 2 repaso, 3 reaprendiendo"
    timestamptz last_review
  }
  revisiones {
    bigint id PK
    uuid user_id FK
    uuid tarjeta_id FK
    smallint rating "1 otra vez, 2 difícil, 3 bien, 4 fácil"
    int duracion_ms
    timestamptz created_at
  }
  sesiones_estudio {
    uuid id PK
    uuid user_id FK
    uuid materia_id FK
    uuid tarea_id FK
    timestamptz inicio
    timestamptz fin
    smallint minutos_plan "25 por defecto"
    boolean completada
  }
```

## 11. Diferencias que resuelve T-03

Al comparar el borrador con los ADR y las HU aparecen diferencias. Este documento ya muestra la versión corregida; T-03 debe confirmarlas en las migraciones y en las HU.

| Tema | Borrador `0001_init.sql` | Decisión que manda | Qué se muestra aquí |
|---|---|---|---|
| Agentes | Una tabla `agentes` con `rol` en texto | ADR-005 | `dioses`, `roles`, `asignaciones_rol` y `pipeline_pasos` |
| Pasos y eventos | `trabajo_pasos.agente_id`, `eventos_agente.agente_id` y `uso_modelo.agente_id` | ADR-005, regla 3 | `rol_id` y `dios_id` |
| Pausa de trabajos y dioses | `trabajos.estado = 'pausado'` y `agentes.pausado` | HU-06.06 y HU-05.05 (`estado_control`) | `estado_control` en `trabajos` y `dioses`; T-03 decide si `pausado` sigue en el enum |
| Configuración del rol | `agentes.permisos` | HU-07.01 lee `agentes.config` | `roles.config` |
| Nombre de la fecha de creación | `created_at` | HU-07.01 menciona `creado_en` | `created_at`; T-03 corrige la HU |
| Ruta del inicio de sesión | — | `docs/arquitectura/api.md`: `POST /api/v1/auth/sesion`; HU-03.01 (RN-1) dice `POST /api/auth/login` | La ruta de `api.md`; T-03 o HU-03.01 corrige la HU |
