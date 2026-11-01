-- Prueba de humo de la base local (T-12): confirma la versión de Postgres y las extensiones
-- disponibles que usará el esquema. Las pruebas de RLS de cada tabla llegan con T-03.
begin;
create extension if not exists pgtap with schema extensions;

select plan(4);

select ok(
  current_setting('server_version_num')::int >= 170000,
  'Postgres es la versión 17 o superior, igual que agora-dev'
);
select has_schema('public', 'existe el esquema public');
select ok(
  exists (select 1 from pg_available_extensions where name = 'vector'),
  'pgvector está disponible para el esquema de T-03'
);
select ok(
  exists (select 1 from pg_available_extensions where name = 'pgcrypto'),
  'pgcrypto está disponible para los hash de los códigos 2FA'
);

select * from finish();
rollback;
