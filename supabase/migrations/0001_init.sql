-- dpardo · esquema inicial (borrador para revisar antes de aplicar)
-- Un solo usuario, pero todo con user_id y RLS.

create extension if not exists vector with schema extensions;
create extension if not exists pgcrypto with schema extensions;

-- ───────────── Tipos ─────────────
create type tema_ui          as enum ('claro', 'oscuro', 'sistema');
create type estado_materia   as enum ('cursando', 'aprobada', 'reprobada', 'pendiente');
create type tipo_clase       as enum ('teoria', 'laboratorio', 'auxiliatura');
create type estado_trabajo   as enum ('en_cola', 'en_proceso', 'esperando_aprobacion', 'entregado', 'error', 'pausado', 'cancelado');
create type estado_paso      as enum ('pendiente', 'en_proceso', 'hecho', 'error', 'omitido');
create type estado_esquema   as enum ('pendiente', 'aprobado', 'cambios_pedidos');
create type estado_agente    as enum ('trabajando', 'libre', 'esperando', 'entregando', 'reunion', 'error', 'pausado');
create type tipo_evento_ag   as enum ('paso_iniciado', 'paso_terminado', 'traspaso', 'planificacion', 'paso_fallido', 'libre', 'pausa', 'reanuda');
create type tipo_sala        as enum ('trabajo', 'estado');
create type tipo_evento_cal  as enum ('parcial', 'entrega', 'clase', 'bot', 'otro');
create type fuente_aviso     as enum ('gmail', 'umss', 'fcyt', 'bot', 'recordatorio');
create type motor_modelo     as enum ('claude', 'gemini_flash', 'gemini_flash_lite', 'python', 'texlive', 'drive_api', 'n8n', 'imagenes');

-- ───────────── Utilidad ─────────────
create or replace function set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- ───────────── Cuenta ─────────────
create table perfil (
  user_id      uuid primary key references auth.users on delete cascade,
  usuario      text not null unique check (usuario ~ '^[a-z0-9._]{3,32}$'),
  nombre       text not null,
  tema         tema_ui not null default 'sistema',
  drive_raiz   text not null default 'Mi unidad/UMSS',
  zona_horaria text not null default 'America/La_Paz',
  meta_horas_semana numeric(4,1) not null default 12,
  sync_calendar boolean not null default false,
  sync_tasks    boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table dispositivos_confiables (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  token_hash  text not null unique,           -- sha256 del token de la cookie dpardo_device
  nombre      text not null,                  -- "Este PC", "Android (PWA)"
  user_agent  text,
  ultimo_uso  timestamptz not null default now(),
  expira      timestamptz not null default now() + interval '30 days',
  created_at  timestamptz not null default now()
);

create table codigos_verificacion (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  codigo_hash text not null,
  proposito   text not null check (proposito in ('login', 'recuperar')),
  intentos    smallint not null default 0 check (intentos <= 5),
  expira      timestamptz not null default now() + interval '10 minutes',
  usado       boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ───────────── Académico ─────────────
create table materias (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null default auth.uid() references auth.users on delete cascade,
  codigo_sis    text not null,
  nombre        text not null,
  grupo         text,
  semestre_plan smallint check (semestre_plan between 1 and 12),
  gestion       text not null,                 -- "II/2026"
  estado        estado_materia not null default 'cursando',
  docente       text,
  docente_correo text,
  auxiliar      text,
  consultas     text,
  descripcion   text,                          -- contexto para el bot
  color         text not null default 'cielo' check (color in ('rosa','mant','lila','menta','cielo')),
  drive_carpeta_id text,
  drive_ruta    text,
  nota_final    numeric(5,2),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (user_id, codigo_sis, gestion)
);

create table materia_horarios (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users on delete cascade,
  materia_id  uuid not null references materias on delete cascade,
  dia         smallint not null check (dia between 1 and 7),   -- ISO: 1 = lunes
  inicio      time not null,
  fin         time not null check (fin > inicio),
  aula        text,
  tipo        tipo_clase not null default 'teoria'
);

create table materia_unidades (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users on delete cascade,
  materia_id  uuid not null references materias on delete cascade,
  orden       smallint not null,
  titulo      text not null,
  completada  boolean not null default false,
  unique (materia_id, orden)
);

create table evaluaciones (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users on delete cascade,
  materia_id  uuid not null references materias on delete cascade,
  nombre      text not null,                   -- "Primer parcial"
  peso        numeric(5,2) not null check (peso between 0 and 100),
  nota        numeric(5,2) check (nota between 0 and 100),
  fecha       date
);

-- Plan de estudios (malla), independiente de lo cursado
create table plan_materias (
  codigo_sis  text primary key,
  nombre      text not null,
  semestre    smallint not null,
  creditos    smallint
);

create table plan_prerrequisitos (
  codigo_sis      text references plan_materias on delete cascade,
  requiere_codigo text references plan_materias on delete cascade,
  primary key (codigo_sis, requiere_codigo)
);

-- ───────────── Oficina y bot ─────────────
create table oficina_salas (
  id        text primary key,                  -- 'despacho', 'redaccion', 'descanso'...
  nombre    text not null,
  planta    smallint not null default 1,
  tipo      tipo_sala not null,
  x int not null, y int not null, w int not null, h int not null,
  puertas   jsonb not null default '[]',       -- [{x,y}] puntos de paso del grafo de rutas
  escritorios jsonb not null default '[]',     -- [{x,y,orientacion}]
  capacidad smallint
);

create table agentes (
  id          text primary key,                -- 'ctl', 'inv', 'red'...
  nombre      text not null,
  rol         text not null,
  sala_id     text not null references oficina_salas,
  escritorio  smallint,
  motor       motor_modelo not null,
  activo      boolean not null default true,
  pausado     boolean not null default false,
  estado      estado_agente not null default 'libre',
  sprite      jsonb not null default '{}',     -- {pelo, piel, camisa, color}
  permisos    jsonb not null default '{}',     -- switches de "Configurar agente"
  orden       smallint not null default 0
);

create table trabajos (
  id            bigint generated always as identity primary key,   -- se muestra como #14
  user_id       uuid not null default auth.uid() references auth.users on delete cascade,
  materia_id    uuid references materias on delete set null,
  tema          text not null,
  paginas       smallint check (paginas between 1 and 200),
  indicaciones  text,
  aprobar_esquema boolean not null default true,
  estado        estado_trabajo not null default 'en_cola',
  progreso      numeric(5,2) not null default 0,
  trabajador    text,                          -- 'vm-oracle-1'
  error         text,
  drive_ruta    text,
  created_at    timestamptz not null default now(),
  iniciado_at   timestamptz,
  entregado_at  timestamptz,
  updated_at    timestamptz not null default now()
);
create index trabajos_cola_idx on trabajos (estado, created_at) where estado = 'en_cola';

create table trabajo_pasos (
  id          bigint generated always as identity primary key,
  trabajo_id  bigint not null references trabajos on delete cascade,
  orden       smallint not null,               -- 1..9
  nombre      text not null,
  agente_id   text not null references agentes,
  motor       motor_modelo not null,
  estado      estado_paso not null default 'pendiente',
  detalle     text,                            -- "Redacción 3 de 6", mensaje de error
  tokens_in   int, tokens_out int, turnos int,
  usd_lista   numeric(10,4),
  inicio      timestamptz, fin timestamptz,
  unique (trabajo_id, orden)
);

create table esquemas (
  id          bigint generated always as identity primary key,
  trabajo_id  bigint not null unique references trabajos on delete cascade,
  secciones   jsonb not null,                  -- [{n:"3.1", titulo, puntos:[...]}]
  estado      estado_esquema not null default 'pendiente',
  comentarios text,
  created_at  timestamptz not null default now(),
  resuelto_at timestamptz
);

create table eventos_agente (
  id            bigint generated always as identity primary key,
  agente_id     text not null references agentes,
  tipo          tipo_evento_ag not null,
  trabajo_id    bigint references trabajos on delete cascade,
  destino_agente_id text references agentes,  -- para 'traspaso'
  mensaje       text,                          -- texto de la burbuja y del registro
  created_at    timestamptz not null default now()
);
create index eventos_agente_reciente_idx on eventos_agente (created_at desc);

create table documentos (
  id           bigint generated always as identity primary key,
  user_id      uuid not null default auth.uid() references auth.users on delete cascade,
  trabajo_id   bigint unique references trabajos on delete set null,
  materia_id   uuid references materias on delete set null,
  titulo       text not null,
  paginas      smallint,
  storage_path text,                           -- bucket 'documentos'
  drive_file_id text,
  usd_total    numeric(10,4),
  turnos       int,
  created_at   timestamptz not null default now()
);

create table fuentes (
  id          bigint generated always as identity primary key,
  trabajo_id  bigint references trabajos on delete cascade,
  titulo      text not null,
  url         text,
  doi         text,
  idioma      text check (idioma in ('es','en','otro')),
  storage_path text,
  bibtex      text,
  created_at  timestamptz not null default now()
);

create table pasajes (
  id          bigint generated always as identity primary key,
  fuente_id   bigint not null references fuentes on delete cascade,
  texto       text not null,
  pagina      int,
  embedding   extensions.vector(1024),         -- bge-m3 = 1024; ajustar si se usa Gemini
  created_at  timestamptz not null default now()
);
create index pasajes_embedding_idx on pasajes using hnsw (embedding extensions.vector_cosine_ops);

-- ───────────── Consumo ─────────────
create table uso_modelo (
  id          bigint generated always as identity primary key,
  trabajo_id  bigint references trabajos on delete set null,
  paso_orden  smallint,
  agente_id   text references agentes,
  motor       motor_modelo not null,
  modelo      text,                            -- id exacto del modelo
  tokens_in   int not null default 0,
  tokens_out  int not null default 0,
  tokens_cache int not null default 0,
  usd_lista   numeric(10,4) not null default 0,
  interactivo boolean not null default false,  -- sesiones de depuración aparte del bot
  created_at  timestamptz not null default now()
);
create index uso_modelo_fecha_idx on uso_modelo (created_at);

create table metricas_vm (
  id          bigint generated always as identity primary key,
  disco_total_gb numeric(6,1), disco_usado_gb numeric(6,1),
  disco_desglose jsonb,                        -- {texlive, fuentes, cache, documentos, sistema}
  ram_total_gb numeric(5,1), ram_usada_gb numeric(5,1),
  cpu_pct     numeric(5,2),
  cpu_p95_7d  numeric(5,2),
  uptime_s    bigint,
  created_at  timestamptz not null default now()
);

create table servicios_estado (
  servicio    text primary key,                -- 'trabajador', 'n8n', 'claude_code', 'respaldo'...
  ok          boolean not null,
  detalle     text,
  actualizado timestamptz not null default now()
);

-- ───────────── Organización ─────────────
create table listas_tareas (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users on delete cascade,
  nombre     text not null,
  materia_id uuid references materias on delete cascade,
  google_tasklist_id text,
  orden      smallint not null default 0
);

create table tareas (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users on delete cascade,
  lista_id    uuid references listas_tareas on delete cascade,
  padre_id    uuid references tareas on delete cascade,   -- subtareas
  materia_id  uuid references materias on delete set null,
  titulo      text not null,
  notas       text,
  vence       timestamptz,
  recordatorio timestamptz,
  repetir     text,                            -- RRULE (RFC 5545) o null
  completada_at timestamptz,
  google_task_id text,
  aviso_id    uuid,                            -- tarea creada desde un aviso
  orden       int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table eventos (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users on delete cascade,
  materia_id  uuid references materias on delete set null,
  tipo        tipo_evento_cal not null,
  titulo      text not null,
  descripcion text,                            -- temas del parcial
  inicio      timestamptz not null,
  fin         timestamptz,
  aula        text,
  recordatorios interval[] not null default array[interval '3 days', interval '1 day'],
  google_event_id text,
  trabajo_id  bigint references trabajos on delete set null
);

create table reglas_avisos (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users on delete cascade,
  fuente     fuente_aviso not null,
  patron     text not null,                    -- remitente, dominio o URL
  activa     boolean not null default true
);

create table avisos (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  fuente      fuente_aviso not null,
  remitente   text,
  asunto      text not null,
  cuerpo      text,
  url_original text,
  materia_id  uuid references materias on delete set null,
  detectado   jsonb,                           -- {fecha, aula, materia} extraído automáticamente
  leido       boolean not null default false,
  destacado   boolean not null default false,
  archivado   boolean not null default false,
  externo_id  text,                            -- id de Gmail o hash de la noticia, para no duplicar
  recibido_at timestamptz not null default now(),
  unique (user_id, fuente, externo_id)
);
alter table tareas add constraint tareas_aviso_fk foreign key (aviso_id) references avisos on delete set null;

-- ───────────── Estudio ─────────────
create table mazos (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users on delete cascade,
  materia_id  uuid references materias on delete cascade,
  documento_id bigint references documentos on delete set null,
  nombre      text not null
);

create table tarjetas (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users on delete cascade,
  mazo_id     uuid not null references mazos on delete cascade,
  frente      text not null,
  reverso     text not null,
  -- estado FSRS (ts-fsrs Card)
  due         timestamptz not null default now(),
  stability   double precision not null default 0,
  difficulty  double precision not null default 0,
  elapsed_days int not null default 0,
  scheduled_days int not null default 0,
  reps        int not null default 0,
  lapses      int not null default 0,
  state       smallint not null default 0,     -- 0 New, 1 Learning, 2 Review, 3 Relearning
  last_review timestamptz
);
create index tarjetas_due_idx on tarjetas (user_id, due);

create table revisiones (
  id          bigint generated always as identity primary key,
  user_id     uuid not null default auth.uid() references auth.users on delete cascade,
  tarjeta_id  uuid not null references tarjetas on delete cascade,
  rating      smallint not null check (rating between 1 and 4),   -- Otra vez, Difícil, Bien, Fácil
  duracion_ms int,
  created_at  timestamptz not null default now()
);

create table sesiones_estudio (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users on delete cascade,
  materia_id  uuid references materias on delete set null,
  tarea_id    uuid references tareas on delete set null,
  inicio      timestamptz not null,
  fin         timestamptz,
  minutos_plan smallint not null default 25,
  completada  boolean not null default false
);

-- ───────────── Triggers updated_at ─────────────
create trigger perfil_upd   before update on perfil   for each row execute function set_updated_at();
create trigger materias_upd before update on materias for each row execute function set_updated_at();
create trigger trabajos_upd before update on trabajos for each row execute function set_updated_at();
create trigger tareas_upd   before update on tareas   for each row execute function set_updated_at();

-- ───────────── Cola del trabajador ─────────────
create or replace function tomar_trabajo(p_trabajador text)
returns setof trabajos language plpgsql security definer set search_path = public as $$
begin
  return query
  update trabajos t set estado = 'en_proceso', trabajador = p_trabajador, iniciado_at = now()
  where t.id = (
    select id from trabajos where estado = 'en_cola'
    order by created_at for update skip locked limit 1
  )
  returning t.*;
end $$;
revoke all on function tomar_trabajo(text) from public, anon, authenticated;

-- Login por usuario: resuelve el correo solo en servidor (service role)
create or replace function correo_de_usuario(p_usuario text)
returns text language sql security definer set search_path = public, auth as $$
  select u.email from perfil p join auth.users u on u.id = p.user_id where p.usuario = lower(p_usuario)
$$;
revoke all on function correo_de_usuario(text) from public, anon, authenticated;

-- ───────────── RLS ─────────────
do $$
declare t text;
begin
  foreach t in array array[
    'perfil','dispositivos_confiables','codigos_verificacion','materias','materia_horarios',
    'materia_unidades','evaluaciones','trabajos','documentos','listas_tareas','tareas','eventos',
    'reglas_avisos','avisos','mazos','tarjetas','revisiones','sesiones_estudio']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy propio on %I for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()))', t);
  end loop;
end $$;

-- Tablas sin user_id: lectura para el usuario autenticado, escritura solo service role
do $$
declare t text;
begin
  foreach t in array array[
    'plan_materias','plan_prerrequisitos','oficina_salas','agentes','trabajo_pasos','esquemas',
    'eventos_agente','fuentes','pasajes','uso_modelo','metricas_vm','servicios_estado']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy lectura on %I for select to authenticated using (true)', t);
  end loop;
end $$;

-- La web puede aprobar o pedir cambios del esquema y pausar agentes
create policy resolver_esquema on esquemas for update to authenticated using (true) with check (true);
create policy pausar_agente on agentes for update to authenticated using (true) with check (true);

-- Códigos de verificación: solo servidor
drop policy propio on codigos_verificacion;

-- ───────────── Realtime ─────────────
alter publication supabase_realtime add table trabajos, trabajo_pasos, eventos_agente, esquemas, avisos, metricas_vm, agentes;

-- ───────────── Storage ─────────────
insert into storage.buckets (id, name, public) values ('documentos', 'documentos', false)
on conflict (id) do nothing;
create policy documentos_lectura on storage.objects for select to authenticated
  using (bucket_id = 'documentos');
