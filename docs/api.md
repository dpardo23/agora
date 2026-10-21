# Rutas y API · Olympus

Versión 1.0 · creado el 2026-10-20 · editado el 2026-10-20 · autor: Juan Diego Pardo Pozo

Este documento es el contrato de las rutas de la interfaz y de la API REST. El inventario crece con cada HU: **toda HU que agrega o cambia un endpoint actualiza este archivo en el mismo PR**. La especificación ejecutable se genera desde los esquemas Zod y se publica en `GET /api/v1/openapi.json`.

## 1. Convenciones de la API

| Tema | Regla |
|---|---|
| Base | `/api/v1`. Un cambio incompatible crea `/api/v2`; `/v1` se mantiene hasta migrar a todos los clientes |
| Recursos | Sustantivos en plural, en español y en kebab-case: `/encargos`, `/reglas-avisos`. Sin verbos en la ruta, salvo **subrecursos de acción** cuando no hay sustantivo natural (`/esquemas/{id}/decision`) |
| Métodos | `GET` lee · `POST` crea · `PATCH` modifica parcialmente · `PUT` reemplaza · `DELETE` elimina |
| Identificadores | UUID, salvo materias, que se identifican por su código SIS (`/materias/2010016`) |
| JSON | Campos en `snake_case`, igual que la base de datos y los tipos generados. Fechas en ISO 8601 UTC (`2026-10-15T13:45:00Z`) |
| Validación | Todo cuerpo, parámetro y *query* se valida con Zod en el servidor. El mismo esquema se usa en el cliente |
| Errores | `application/problem+json` (RFC 9457): `{ type, title, status, detail, codigo, errores[] }`. `codigo` es estable y en mayúsculas (`MATERIA_DUPLICADA`) |
| Códigos HTTP | 200 OK · 201 creado (con `Location`) · 204 sin contenido · 400 forma inválida · 401 sin sesión · 403 sin permiso o dispositivo sin verificar · 404 · 409 conflicto de estado · 422 regla de negocio · 429 límite de frecuencia · 500 |
| Autenticación | Cookie de sesión de Supabase (`@supabase/ssr`) + dispositivo verificado. Los webhooks de n8n usan una firma HMAC-SHA-256 en `X-Firma` |
| CSRF | Cookies `SameSite=Lax` + verificación de `Origin` en todo método que no sea `GET` |
| Idempotencia | `POST /encargos` y los webhooks aceptan `Idempotency-Key`; repetir la misma clave devuelve la misma respuesta |
| Paginación | Por cursor: `?limite=20&cursor=<opaco>`; la respuesta trae `siguiente_cursor` |
| Límites | Autenticación: 5 intentos cada 15 min por IP. Resto: 120 peticiones por minuto por sesión |
| Lecturas | Las listas y los datos en vivo se leen directo de Supabase con RLS (Server Components, TanStack Query, Realtime). La API se reserva para escrituras con reglas y para lecturas que necesitan secretos (URLs firmadas, `.ics`) |
| Estructura del handler | `route.ts` delgado: `validar → autorizar → caso de uso (features/*/application) → responder`. Nada de lógica de negocio en `route.ts` |

## 2. Rutas de la interfaz

| Ruta | Pantalla | Sección activa | HU |
|---|---|---|---|
| `/login` | Iniciar sesión (+ paso de código y recuperar acceso como diálogos) | | HU-03.01 a HU-03.04 |
| `/` | Inicio | Inicio | HU-15.01 |
| `/olimpo` | Olimpo · Oficina | Olimpo | HU-05.01 a HU-05.05, HU-06.02 a HU-06.06 |
| `/olimpo/encargar` | Nuevo encargo (en escritorio es el panel del dios que orquesta) | Olimpo | HU-06.01 |
| `/olimpo/consumo` | Olimpo · Consumo | Olimpo | HU-08.01 a HU-08.04 |
| `/olimpo/panteon` | Gestión de dioses y roles | Olimpo | HU-05.06, HU-05.08 |
| `/tareas` | Tareas | Tareas | HU-12.01 a HU-12.05 |
| `/agenda` | Agenda · Calendario | Agenda | HU-11.01, HU-11.02 |
| `/agenda/horario` | Agenda · Horario semanal | Agenda | HU-11.03, HU-11.04 |
| `/materias` | Mis materias | Materias | HU-09.02 |
| `/materias/nueva` | Agregar materia | Materias | HU-09.01 |
| `/materias/[codigo]` | Detalle de materia | Materias | HU-09.02 a HU-09.05 |
| `/materias/malla` | Malla | Materias | HU-10.01 a HU-10.03 |
| `/estudiar` | Estudiar · Repaso | Estudiar | HU-14.01, HU-14.02 |
| `/estudiar/pomodoro` | Estudiar · Pomodoro | Estudiar | HU-14.03, HU-14.04 |
| `/avisos` | Avisos | (campana) | HU-13.01 a HU-13.03 |
| `/configuracion` | Configuración | (avatar) | HU-04.01 a HU-04.04, HU-16.01, HU-16.03 |
| `/dev/kit` | Muestrario del kit (solo en desarrollo) | | HU-02.01 a HU-02.07 |

Las pestañas internas son rutas, no estado local. Los diálogos que se pueden enlazar usan *query params* (`/olimpo?dios=apolo`, `/olimpo?esquema=<id>`).

## 3. Inventario de endpoints `/api/v1`

| Método y ruta | Uso | Respuesta | HU |
|---|---|---|---|
| **Sistema** | | | |
| `GET /salud` | Estado de la API y de la conexión con Supabase | 200 | T-02 |
| `GET /openapi.json` | Contrato OpenAPI generado | 200 | T-01 |
| **Autenticación** | | | |
| `POST /auth/sesion` | Iniciar sesión con usuario y contraseña | 200 · 401 · 429 | HU-03.01 |
| `DELETE /auth/sesion?alcance=local\|global` | Cerrar sesión | 204 | HU-03.05 |
| `POST /auth/codigos` | Enviar o reenviar el código de 2FA | 202 · 429 | HU-03.02 |
| `POST /auth/codigos/verificacion` | Verificar el código; con `recordar: true` registra el dispositivo | 200 · 422 | HU-03.02, HU-03.03 |
| `POST /auth/recuperacion` | Solicitar un código de recuperación (siempre responde igual) | 202 | HU-03.04 |
| `POST /auth/recuperacion/verificacion` | Verificar el código de recuperación | 200 · 422 | HU-03.04 |
| `PUT /auth/recuperacion/contrasena` | Fijar la nueva contraseña y cerrar todas las sesiones | 204 · 422 | HU-03.04 |
| **Cuenta** | | | |
| `PATCH /perfil` | Tema, meta semanal, carpeta de Drive | 200 | HU-04.01, HU-04.04, HU-14.04 |
| `POST /perfil/contrasena/codigo` | Validar la contraseña actual y enviar el código | 202 · 422 | HU-04.02 |
| `PUT /perfil/contrasena` | Cambiar la contraseña con el código | 204 · 422 | HU-04.02 |
| `PUT /perfil/dos-pasos` | Activar o desactivar el código por Gmail (pide contraseña) | 200 · 422 | HU-04.03 |
| `GET /dispositivos` | Sesiones y dispositivos confiables | 200 | HU-04.03 |
| `DELETE /dispositivos?excepto=actual` | Cerrar las demás sesiones | 204 | HU-04.03 |
| `PATCH /integraciones/{google-calendar\|google-tasks}` | Activar o desactivar la sincronización | 200 | HU-04.04 |
| **Olimpo** | | | |
| `POST /encargos` | Crear un encargo (acepta `Idempotency-Key`) | 201 · 422 | HU-06.01 |
| `DELETE /encargos/{id}` | Deshacer un encargo que sigue en cola | 204 · 409 | HU-06.01 |
| `PATCH /encargos/{id}` | Pausar o reanudar (`estado_control`) | 200 · 409 | HU-06.06 |
| `POST /esquemas/{id}/decision` | Aprobar o pedir cambios | 200 · 409 · 422 | HU-06.04 |
| `GET /documentos/{id}/url` | URL firmada del PDF (300 s) | 200 · 404 | HU-06.05 |
| `DELETE /documentos/{id}` | Eliminar un documento | 204 | HU-06.05 |
| `POST /documentos/{id}/tarjetas` | Pedir más tarjetas de repaso | 202 | HU-14.02 |
| `PATCH /dioses/{id}` | Pausar o reanudar a un dios; datos visibles | 200 · 409 | HU-05.05, HU-05.08 |
| `POST /dioses` | Crear un dios (sprite, sala, escritorio) | 201 · 422 | HU-05.08 |
| `DELETE /dioses/{id}` | Retirar un dios sin roles asignados | 204 · 409 | HU-05.08 |
| `PUT /roles/{id}/asignacion` | Asignar un rol a un dios | 200 · 422 | HU-05.08 |
| `PATCH /roles/{id}/configuracion` | Motor, turnos, prioridad e instrucciones de un rol | 200 · 422 | HU-05.06 |
| `POST /ordenes-vm` | Orden para la VM (`limpiar_cache_fuentes`, `extraer_plan`) | 202 · 422 | HU-08.04, HU-10.03 |
| **Materias y malla** | | | |
| `POST /materias` | Crear una materia con horarios, evaluaciones y carpetas | 201 · 409 · 422 | HU-09.01 |
| `PATCH /materias/{codigo}` | Editar una materia | 200 · 422 | HU-09.04 |
| `DELETE /materias/{codigo}` | Eliminar una materia | 204 | HU-09.05 |
| `PATCH /materias/{codigo}/evaluaciones/{id}` | Registrar una nota | 200 · 422 | HU-09.03 |
| `POST /plan/importaciones` | Iniciar la importación del plan oficial | 202 | HU-10.03 |
| `POST /plan/importaciones/{id}/confirmacion` | Confirmar la importación revisada | 200 · 422 | HU-10.03 |
| **Agenda** | | | |
| `POST /eventos` · `PATCH /eventos/{id}` · `DELETE /eventos/{id}` | Eventos con recordatorios | 201 · 200 · 204 | HU-11.02 |
| `GET /agenda/calendario.ics?rango=…&incluir=…` | Descargar el `.ics` | 200 `text/calendar` | HU-11.04 |
| `POST /agenda/exportaciones` | Exportar a Google Calendar | 202 | HU-11.04 |
| **Tareas** | | | |
| `POST /tareas` · `PATCH /tareas/{id}` · `DELETE /tareas/{id}` | Tareas, subtareas, completar y repetir | 201 · 200 · 204 | HU-12.01 a HU-12.03 |
| `POST /listas` · `PATCH /listas/{id}` · `DELETE /listas/{id}` | Listas propias | 201 · 200 · 204 | HU-12.02 |
| `POST /tareas/{id}/encargo` | Encargar o programar el documento de apoyo | 201 · 202 | HU-12.04 |
| **Avisos** | | | |
| `PATCH /avisos/{id}` | Leído, destacado, archivado | 200 | HU-13.01 |
| `PATCH /avisos` | Marcar todo como leído | 204 | HU-13.01 |
| `POST /avisos/{id}/aplicacion` | Aplicar el dato detectado (aula, fecha) | 200 · 422 | HU-13.02 |
| `PUT /reglas-avisos` · `POST /reglas-avisos/prueba` | Guardar y probar reglas | 200 | HU-13.03 |
| **Estudio** | | | |
| `POST /revisiones` | Registrar la calificación de una tarjeta (FSRS) | 201 | HU-14.01 |
| `POST /sesiones-estudio` · `PATCH /sesiones-estudio/{id}` | Bloques de pomodoro | 201 · 200 | HU-14.03 |
| **Notificaciones** | | | |
| `POST /push/suscripciones` · `DELETE /push/suscripciones/{id}` | Web Push | 201 · 204 | HU-16.03 |
| **Webhooks (firmados)** | | | |
| `POST /webhooks/n8n/{flujo}` | Entrada de n8n (avisos, Google Tasks, Calendar) | 202 · 401 | HU-12.05, HU-13.01 |

## 4. Cómo agregar un endpoint

1. Defínelo en la HU (sección 5, notas técnicas) y en la tabla de la sección 3 de este archivo.
2. Crea el esquema Zod en `src/features/<dominio>/domain/` y el caso de uso en `application/`.
3. Crea `src/app/api/v1/<recurso>/route.ts` con el patrón de la sección 1.
4. Agrega pruebas: unitarias del caso de uso y de integración del handler (incluidos 401, 422 y 429).
5. El CI regenera `openapi.json` y falla si el contrato cambió sin actualizar este documento.
