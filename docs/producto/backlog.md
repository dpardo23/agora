# Product backlog · Olympus

Versión 1.0 · creado el 2026-10-20 · editado el 2026-10-20

Fuente de verdad del orden de trabajo. Cada fila es un **PBI** (product backlog item): una historia de usuario (HU) o un ítem técnico (T: historia técnica, spike o chore). Los sprints no tienen fechas: un sprint se cierra cuando cumple su objetivo y la DoD.

- Prioridad: MoSCoW (Must, Should, Could, Won't).
- Estimación: puntos de historia (Fibonacci).
- Estado: Borrador → Lista → En curso → En QA → Hecha.

## 1. Épicas

| Épica | Nombre | Hito | Sprints | HU | Pts |
|---|---|---|---|---|---|
| [EP-01](epicas/EP-01-base-y-navegacion.md) | Base y navegación | H0 | S0 | 3 | 11 |
| [EP-02](epicas/EP-02-kit-de-interfaz.md) | Kit de interfaz | H1 | S1 | 7 | 34 |
| [EP-03](epicas/EP-03-acceso-y-seguridad.md) | Acceso y seguridad | H3 | S2, S3 | 5 | 24 |
| [EP-04](epicas/EP-04-configuracion.md) | Configuración de la cuenta | H3, H8 | S3, S10 | 4 | 13 |
| [EP-05](epicas/EP-05-oficina-del-olimpo.md) | Oficina del Olimpo | H4, H6 | S4, S5, S7 | 8 | 50 |
| [EP-06](epicas/EP-06-encargos-al-olimpo.md) | Encargos al Olimpo | H4 | S5 | 6 | 25 |
| [EP-07](epicas/EP-07-motor-de-agentes.md) | Motor de agentes | H5 | S6 | 4 | 21 |
| [EP-08](epicas/EP-08-consumo-e-infraestructura.md) | Consumo e infraestructura | H6 | S7 | 4 | 15 |
| [EP-09](epicas/EP-09-materias.md) | Materias | H7 | S8 | 5 | 21 |
| [EP-10](epicas/EP-10-malla-curricular.md) | Malla curricular | H7 | S9 | 3 | 16 |
| [EP-11](epicas/EP-11-agenda.md) | Agenda | H7 | S9 | 4 | 23 |
| [EP-12](epicas/EP-12-tareas.md) | Tareas | H8 | S10 | 5 | 21 |
| [EP-13](epicas/EP-13-avisos.md) | Avisos | H8 | S11 | 3 | 11 |
| [EP-14](epicas/EP-14-estudiar.md) | Estudiar | H8 | S11 | 4 | 21 |
| [EP-15](epicas/EP-15-inicio.md) | Inicio | H8 | S12 | 2 | 13 |
| [EP-16](epicas/EP-16-pwa-y-notificaciones.md) | PWA y notificaciones | H9 | S12, S13 | 4 | 18 |
| | **Total** | | | **71** | **337** |

## 2. Backlog ordenado por sprint

### SPRINT-00 · Cimientos navegables (H0)
Objetivo: abrir la web, navegar por las 17 rutas vacías en ambos temas y en tres anchos.

| PBI | Tipo | Título | Épica | MoSCoW | Pts | Estado |
|---|---|---|---|---|---|---|
| T-01 | Historia técnica | Crear el proyecto Next.js 16 con TypeScript estricto, Tailwind v4, tokens y fuentes | EP-01 | Must | 5 | Borrador |
| T-02 | Chore | Configurar CI en GitHub Actions y previews en Vercel | EP-01 | Must | 3 | Borrador |
| [HU-01.01](historias/EP-01-base-y-navegacion/HU-01.01-navegar-entre-secciones.md) | Historia | Navegar entre las secciones de la plataforma | EP-01 | Must | 5 | Borrador |
| [HU-01.02](historias/EP-01-base-y-navegacion/HU-01.02-alternar-tema-claro-oscuro.md) | Historia | Alternar entre el tema claro y el oscuro sin parpadeo | EP-01 | Must | 3 | Borrador |
| [HU-01.03](historias/EP-01-base-y-navegacion/HU-01.03-adaptar-interfaz-al-dispositivo.md) | Historia | Usar la plataforma en móvil, tablet y escritorio | EP-01 | Must | 3 | Borrador |

### SPRINT-01 · Kit de interfaz (H1)
Objetivo: todos los estados de `Controles` y `ControlesMovil` reproducidos y documentados en una página de muestras (`/dev/kit`, solo en desarrollo).

| PBI | Tipo | Título | Épica | MoSCoW | Pts | Estado |
|---|---|---|---|---|---|---|
| [HU-02.01](historias/EP-02-kit-de-interfaz/HU-02.01-accionar-botones-con-estados.md) | Historia | Accionar botones con estados consistentes | EP-02 | Must | 3 | Borrador |
| [HU-02.02](historias/EP-02-kit-de-interfaz/HU-02.02-ingresar-datos-con-validacion.md) | Historia | Ingresar datos en campos con validación visible | EP-02 | Must | 5 | Borrador |
| [HU-02.03](historias/EP-02-kit-de-interfaz/HU-02.03-elegir-opciones-en-desplegables.md) | Historia | Elegir opciones en select, combobox, multiselección y menú contextual | EP-02 | Must | 8 | Borrador |
| [HU-02.04](historias/EP-02-kit-de-interfaz/HU-02.04-elegir-fecha-y-hora.md) | Historia | Elegir fecha y hora con el selector | EP-02 | Must | 5 | Borrador |
| [HU-02.05](historias/EP-02-kit-de-interfaz/HU-02.05-recibir-retroalimentacion.md) | Historia | Recibir retroalimentación con toasts, progreso, esqueletos y estados vacíos | EP-02 | Must | 5 | Borrador |
| [HU-02.06](historias/EP-02-kit-de-interfaz/HU-02.06-abrir-dialogos-adaptables.md) | Historia | Abrir diálogos como modal o como hoja inferior según el dispositivo | EP-02 | Must | 5 | Borrador |
| [HU-02.07](historias/EP-02-kit-de-interfaz/HU-02.07-adjuntar-archivos-arrastrando.md) | Historia | Adjuntar archivos arrastrándolos o pegando un enlace o DOI | EP-02 | Should | 3 | Borrador |

### SPRINT-02 · Datos y acceso (H2 + H3)
Objetivo: la base está aplicada con RLS y el usuario entra con usuario, contraseña y código de Gmail en un dispositivo nuevo.

| PBI | Tipo | Título | Épica | MoSCoW | Pts | Estado |
|---|---|---|---|---|---|---|
| T-03 | Historia técnica | Corregir y aplicar la migración 0001 con RLS, Realtime y tipos generados | EP-03 | Must | 8 | Borrador |
| T-04 | Chore | Crear la semilla de datos de ejemplo para desarrollo y QA | EP-03 | Must | 3 | Borrador |
| T-10 | Spike | Elegir el canal de envío de correo transaccional (Gmail API o proveedor SMTP) | EP-03 | Must | 2 | Borrador |
| [HU-03.01](historias/EP-03-acceso-y-seguridad/HU-03.01-iniciar-sesion-con-usuario.md) | Historia | Iniciar sesión con usuario y contraseña | EP-03 | Must | 5 | Borrador |
| [HU-03.02](historias/EP-03-acceso-y-seguridad/HU-03.02-verificar-dispositivo-nuevo.md) | Historia | Verificar un dispositivo nuevo con un código enviado a Gmail | EP-03 | Must | 8 | Borrador |
| [HU-03.03](historias/EP-03-acceso-y-seguridad/HU-03.03-recordar-dispositivo-confiable.md) | Historia | Recordar un dispositivo de confianza durante 30 días | EP-03 | Must | 3 | Borrador |

### SPRINT-03 · Cuenta segura (H3)
Objetivo: el titular gestiona su cuenta (tema persistido, contraseña, sesiones, recuperación y cierre de sesión), con el flujo probado en Playwright.

| PBI | Tipo | Título | Épica | MoSCoW | Pts | Estado |
|---|---|---|---|---|---|---|
| [HU-03.04](historias/EP-03-acceso-y-seguridad/HU-03.04-recuperar-acceso.md) | Historia | Recuperar el acceso con un código enviado a Gmail | EP-03 | Must | 5 | Borrador |
| [HU-03.05](historias/EP-03-acceso-y-seguridad/HU-03.05-cerrar-sesion.md) | Historia | Cerrar sesión en este dispositivo o en todos | EP-03 | Must | 3 | Borrador |
| [HU-04.01](historias/EP-04-configuracion/HU-04.01-guardar-preferencia-de-tema.md) | Historia | Guardar la preferencia de tema en mi perfil | EP-04 | Must | 2 | Borrador |
| [HU-04.02](historias/EP-04-configuracion/HU-04.02-cambiar-contrasena.md) | Historia | Cambiar la contraseña con verificación por Gmail | EP-04 | Must | 5 | Borrador |
| [HU-04.03](historias/EP-04-configuracion/HU-04.03-gestionar-sesiones-activas.md) | Historia | Gestionar las sesiones activas y la verificación en dos pasos | EP-04 | Must | 3 | Borrador |

### SPRINT-04 · El Olimpo cobra vida (H4, parte 1)
Objetivo: la oficina muestra a los 10 dioses en sus salas, siempre en movimiento y dirigidos por eventos simulados en Realtime.

| PBI | Tipo | Título | Épica | MoSCoW | Pts | Estado |
|---|---|---|---|---|---|---|
| T-05 | Spike | Diseñar la hoja de sprites de los dioses y la escena del Olimpo | EP-05 | Must | 5 | Borrador |
| T-06 | Historia técnica | Crear un simulador de eventos de agentes para desarrollo y demos | EP-05 | Must | 3 | Borrador |
| [HU-05.01](historias/EP-05-oficina-del-olimpo/HU-05.01-ver-oficina-del-olimpo.md) | Historia | Ver la Oficina del Olimpo con cada dios en su sala | EP-05 | Must | 8 | Borrador |
| [HU-05.02](historias/EP-05-oficina-del-olimpo/HU-05.02-ver-dioses-en-movimiento.md) | Historia | Ver a los dioses moverse según su estado en tiempo real | EP-05 | Must | 13 | Borrador |
| [HU-05.03](historias/EP-05-oficina-del-olimpo/HU-05.03-consultar-detalle-de-un-dios.md) | Historia | Consultar el detalle de un dios seleccionado | EP-05 | Must | 5 | Borrador |
| [HU-05.04](historias/EP-05-oficina-del-olimpo/HU-05.04-consultar-oficina-sin-escena.md) | Historia | Consultar la oficina sin la escena desde la lista accesible y el móvil | EP-05 | Must | 3 | Borrador |

### SPRINT-05 · Encargar y seguir (H4, parte 2)
Objetivo: un trabajo simulado se encarga desde la web, pide aprobación del esquema, recorre los 9 pasos en vivo y aparece en Documentos.

| PBI | Tipo | Título | Épica | MoSCoW | Pts | Estado |
|---|---|---|---|---|---|---|
| [HU-06.01](historias/EP-06-encargos-al-olimpo/HU-06.01-encargar-documento.md) | Historia | Encargar un documento al Olimpo | EP-06 | Must | 5 | Borrador |
| [HU-06.02](historias/EP-06-encargos-al-olimpo/HU-06.02-seguir-avance-del-pipeline.md) | Historia | Seguir el avance de un trabajo por los 9 pasos del pipeline | EP-06 | Must | 5 | Borrador |
| [HU-06.03](historias/EP-06-encargos-al-olimpo/HU-06.03-consultar-registro-en-vivo.md) | Historia | Consultar el registro en vivo del Olimpo | EP-06 | Must | 3 | Borrador |
| [HU-06.04](historias/EP-06-encargos-al-olimpo/HU-06.04-aprobar-esquema.md) | Historia | Aprobar el esquema de un documento o pedir cambios | EP-06 | Must | 5 | Borrador |
| [HU-06.05](historias/EP-06-encargos-al-olimpo/HU-06.05-consultar-documentos-generados.md) | Historia | Consultar y abrir los documentos generados | EP-06 | Must | 5 | Borrador |
| [HU-06.06](historias/EP-06-encargos-al-olimpo/HU-06.06-pausar-trabajo.md) | Historia | Pausar y reanudar un trabajo en curso | EP-06 | Should | 2 | Borrador |
| [HU-05.05](historias/EP-05-oficina-del-olimpo/HU-05.05-pausar-agente.md) | Historia | Pausar y reanudar a un dios | EP-05 | Should | 3 | Borrador |

### SPRINT-06 · El Olimpo trabaja de verdad (H5)
Objetivo: el trabajo 13 se regenera desde la web con el worker real, con las mismas verificaciones.

| PBI | Tipo | Título | Épica | MoSCoW | Pts | Estado |
|---|---|---|---|---|---|---|
| T-07 | Chore | Preparar la VM de Oracle (systemd, TeX Live, credenciales, respaldos) | EP-07 | Must | 5 | Borrador |
| [HU-07.01](historias/EP-07-motor-de-agentes/HU-07.01-procesar-encargos-desde-la-cola.md) | Historia | Procesar encargos desde la cola de Supabase | EP-07 | Must | 8 | Borrador |
| [HU-07.02](historias/EP-07-motor-de-agentes/HU-07.02-publicar-eventos-de-agentes.md) | Historia | Publicar el avance del pipeline como eventos de los agentes | EP-07 | Must | 5 | Borrador |
| [HU-07.03](historias/EP-07-motor-de-agentes/HU-07.03-entregar-pdf.md) | Historia | Entregar el PDF en Storage y en Google Drive | EP-07 | Must | 5 | Borrador |
| [HU-07.04](historias/EP-07-motor-de-agentes/HU-07.04-registrar-uso-de-modelos.md) | Historia | Registrar el uso de modelos en cada llamada | EP-07 | Must | 3 | Borrador |

### SPRINT-07 · Consumo bajo control (H6)
Objetivo: la pestaña Consumo muestra datos reales de cupo, gasto y VM; los dioses se pueden configurar.

| PBI | Tipo | Título | Épica | MoSCoW | Pts | Estado |
|---|---|---|---|---|---|---|
| [HU-08.01](historias/EP-08-consumo-e-infraestructura/HU-08.01-consultar-cupo-y-gasto.md) | Historia | Consultar el cupo de Claude y el gasto del Olimpo | EP-08 | Must | 5 | Borrador |
| [HU-08.02](historias/EP-08-consumo-e-infraestructura/HU-08.02-vigilar-la-vm.md) | Historia | Vigilar el estado de la VM y el riesgo de reclamo | EP-08 | Must | 5 | Borrador |
| [HU-08.03](historias/EP-08-consumo-e-infraestructura/HU-08.03-consultar-gasto-por-paso-y-documento.md) | Historia | Consultar el gasto por paso y por documento | EP-08 | Should | 3 | Borrador |
| [HU-08.04](historias/EP-08-consumo-e-infraestructura/HU-08.04-limpiar-cache-de-fuentes.md) | Historia | Limpiar la caché de fuentes de la VM | EP-08 | Should | 2 | Borrador |
| [HU-05.06](historias/EP-05-oficina-del-olimpo/HU-05.06-configurar-un-dios.md) | Historia | Configurar el motor, los límites y las instrucciones de un rol | EP-05 | Should | 5 | Borrador |
| [HU-05.07](historias/EP-05-oficina-del-olimpo/HU-05.07-recorrer-dos-plantas.md) | Historia | Recorrer las dos plantas del Olimpo cuando hay más agentes | EP-05 | Could | 8 | Borrador |
| [HU-05.08](historias/EP-05-oficina-del-olimpo/HU-05.08-gestionar-dioses-y-roles.md) | Historia | Gestionar los dioses del Olimpo y asignarles roles | EP-05 | Should | 5 | Borrador |
| T-09 | Spike | Elegir el motor de imágenes del Ilustrador (Iris) | EP-05 | Could | 3 | Borrador |

### SPRINT-08 · Mis materias (H7, parte 1)
Objetivo: una materia creada guarda horario, docente y Drive, y muestra su detalle con la nota necesaria para aprobar.

| PBI | Tipo | Título | Épica | MoSCoW | Pts | Estado |
|---|---|---|---|---|---|---|
| [HU-09.01](historias/EP-09-materias/HU-09.01-agregar-materia.md) | Historia | Agregar una materia con horario, docente y carpeta de Drive | EP-09 | Must | 8 | Borrador |
| [HU-09.02](historias/EP-09-materias/HU-09.02-consultar-mis-materias.md) | Historia | Consultar mis materias de la gestión y su detalle | EP-09 | Must | 5 | Borrador |
| [HU-09.03](historias/EP-09-materias/HU-09.03-calcular-nota-necesaria.md) | Historia | Calcular la nota necesaria para aprobar una materia | EP-09 | Must | 3 | Borrador |
| [HU-09.04](historias/EP-09-materias/HU-09.04-editar-materia.md) | Historia | Editar los datos de una materia | EP-09 | Must | 3 | Borrador |
| [HU-09.05](historias/EP-09-materias/HU-09.05-eliminar-materia.md) | Historia | Eliminar una materia confirmando su nombre | EP-09 | Should | 2 | Borrador |

### SPRINT-09 · Malla y agenda (H7, parte 2)
Objetivo: la materia creada aparece en el horario, el calendario y la malla.

| PBI | Tipo | Título | Épica | MoSCoW | Pts | Estado |
|---|---|---|---|---|---|---|
| [HU-10.01](historias/EP-10-malla-curricular/HU-10.01-consultar-malla.md) | Historia | Consultar la malla curricular con el estado de cada materia | EP-10 | Must | 5 | Borrador |
| [HU-10.02](historias/EP-10-malla-curricular/HU-10.02-ver-prerrequisitos-y-desbloqueos.md) | Historia | Ver los prerrequisitos y lo que desbloquea una materia | EP-10 | Must | 3 | Borrador |
| [HU-10.03](historias/EP-10-malla-curricular/HU-10.03-importar-plan-oficial.md) | Historia | Importar el plan de estudios oficial | EP-10 | Should | 8 | Borrador |
| [HU-11.01](historias/EP-11-agenda/HU-11.01-consultar-calendario.md) | Historia | Consultar el calendario por mes, semana y agenda | EP-11 | Must | 8 | Borrador |
| [HU-11.02](historias/EP-11-agenda/HU-11.02-crear-evento.md) | Historia | Crear un evento con recordatorios | EP-11 | Must | 5 | Borrador |
| [HU-11.03](historias/EP-11-agenda/HU-11.03-consultar-horario-semanal.md) | Historia | Consultar el horario semanal de clases | EP-11 | Must | 5 | Borrador |
| [HU-11.04](historias/EP-11-agenda/HU-11.04-exportar-a-google-calendar.md) | Historia | Exportar el horario y los eventos a Google Calendar | EP-11 | Should | 5 | Borrador |

### SPRINT-10 · Tareas (H8, parte 1)
Objetivo: tareas al estilo Google Tasks, sincronizadas, con la opción de pedir apoyo al Olimpo.

| PBI | Tipo | Título | Épica | MoSCoW | Pts | Estado |
|---|---|---|---|---|---|---|
| T-08 | Chore | Instalar n8n en la VM y versionar sus flujos | EP-12 | Must | 3 | Borrador |
| [HU-12.01](historias/EP-12-tareas/HU-12.01-crear-tarea-rapida.md) | Historia | Crear una tarea rápida con Enter | EP-12 | Must | 3 | Borrador |
| [HU-12.02](historias/EP-12-tareas/HU-12.02-organizar-tareas-en-listas.md) | Historia | Organizar las tareas en listas y filtros | EP-12 | Must | 5 | Borrador |
| [HU-12.03](historias/EP-12-tareas/HU-12.03-detallar-tarea.md) | Historia | Detallar una tarea con vencimiento, recordatorio, repetición y subtareas | EP-12 | Must | 5 | Borrador |
| [HU-12.04](historias/EP-12-tareas/HU-12.04-pedir-documento-de-apoyo.md) | Historia | Pedir al Olimpo un documento de apoyo desde una tarea | EP-12 | Should | 3 | Borrador |
| [HU-12.05](historias/EP-12-tareas/HU-12.05-sincronizar-google-tasks.md) | Historia | Sincronizar las tareas con Google Tasks | EP-12 | Should | 5 | Borrador |
| [HU-04.04](historias/EP-04-configuracion/HU-04.04-configurar-integraciones-google.md) | Historia | Configurar la carpeta de Drive y la sincronización con Google | EP-04 | Should | 3 | Borrador |

### SPRINT-11 · Avisos y estudio (H8, parte 2)
Objetivo: la bandeja recibe avisos filtrados y el estudiante repasa con FSRS y estudia con pomodoro.

| PBI | Tipo | Título | Épica | MoSCoW | Pts | Estado |
|---|---|---|---|---|---|---|
| [HU-13.01](historias/EP-13-avisos/HU-13.01-consultar-bandeja-de-avisos.md) | Historia | Consultar la bandeja de avisos con filtros | EP-13 | Must | 5 | Borrador |
| [HU-13.02](historias/EP-13-avisos/HU-13.02-convertir-aviso-en-accion.md) | Historia | Convertir un aviso en tarea o aplicar el dato detectado | EP-13 | Must | 3 | Borrador |
| [HU-13.03](historias/EP-13-avisos/HU-13.03-editar-reglas-de-bandeja.md) | Historia | Editar las reglas de la bandeja | EP-13 | Should | 3 | Borrador |
| [HU-14.01](historias/EP-14-estudiar/HU-14.01-repasar-tarjetas.md) | Historia | Repasar tarjetas con repetición espaciada | EP-14 | Must | 8 | Borrador |
| [HU-14.02](historias/EP-14-estudiar/HU-14.02-generar-tarjetas-de-documento.md) | Historia | Generar tarjetas de repaso a partir de un documento | EP-14 | Must | 5 | Borrador |
| [HU-14.03](historias/EP-14-estudiar/HU-14.03-estudiar-con-pomodoro.md) | Historia | Estudiar con el temporizador pomodoro | EP-14 | Must | 5 | Borrador |
| [HU-14.04](historias/EP-14-estudiar/HU-14.04-consultar-estadisticas-de-estudio.md) | Historia | Consultar mis estadísticas de estudio | EP-14 | Should | 3 | Borrador |

### SPRINT-12 · Inicio e instalación (H8 + H9)
Objetivo: el dashboard muestra datos reales y la plataforma se instala como app.

| PBI | Tipo | Título | Épica | MoSCoW | Pts | Estado |
|---|---|---|---|---|---|---|
| [HU-15.01](historias/EP-15-inicio/HU-15.01-consultar-resumen-del-dia.md) | Historia | Consultar el resumen del día en el inicio | EP-15 | Must | 8 | Borrador |
| [HU-15.02](historias/EP-15-inicio/HU-15.02-buscar-y-ejecutar-con-ctrl-k.md) | Historia | Buscar y ejecutar acciones con Ctrl K | EP-15 | Should | 5 | Borrador |
| [HU-16.01](historias/EP-16-pwa-y-notificaciones/HU-16.01-instalar-como-aplicacion.md) | Historia | Instalar la plataforma como aplicación | EP-16 | Must | 3 | Borrador |
| [HU-16.02](historias/EP-16-pwa-y-notificaciones/HU-16.02-usar-sin-conexion.md) | Historia | Abrir pantallas y documentos sin conexión | EP-16 | Should | 5 | Borrador |

### SPRINT-13 · Notificaciones y calidad final (H9)
Objetivo: Lighthouse PWA aprobado, sin errores de axe y con notificaciones push.

| PBI | Tipo | Título | Épica | MoSCoW | Pts | Estado |
|---|---|---|---|---|---|---|
| [HU-16.03](historias/EP-16-pwa-y-notificaciones/HU-16.03-recibir-notificaciones-push.md) | Historia | Recibir notificaciones push | EP-16 | Should | 5 | Borrador |
| [HU-16.04](historias/EP-16-pwa-y-notificaciones/HU-16.04-cumplir-accesibilidad-y-rendimiento.md) | Historia no funcional | Cumplir los umbrales de accesibilidad y rendimiento en toda la plataforma | EP-16 | Must | 5 | Borrador |

## 3. Ítems técnicos (detalle)

| PBI | Qué incluye | Criterio de cierre |
|---|---|---|
| T-01 | `create-next-app` en `apps/web` (App Router, `src/`, TypeScript `strict`); Tailwind v4 con tokens en `globals.css` según `design.md`, sección 2; `next/font`; `shadcn init`; ESLint con `eslint-plugin-boundaries`; Prettier; Vitest + Testing Library; Playwright; Husky + commitlint; pnpm workspace; `GET /api/v1/salud` | Existen y pasan los scripts que usa el CI: `lint`, `typecheck`, `test:unit`, `test:e2e`, `build` y `openapi:check`, además de `apps/web/lighthouserc.json`; `GET /api/v1/salud` responde 200 |
| T-02 | Workflow `ci.yml` (lint, typecheck, unit, e2e, migraciones); proyecto en Vercel con previews; protección de `main` | Un PR de prueba muestra todos los checks y una URL de preview |
| T-03 | Revisar `supabase/migrations/0001_init.sql` (defaults `auth.uid()` en `perfil` y `avisos`, Realtime; reemplazar `agentes` por `dioses`, `roles`, `asignaciones_rol` y `pipeline_pasos` según ADR-005; `eventos_agente` con `dios_id` y `rol_id`); aplicar; generar tipos; pruebas pgTAP de RLS | `supabase db reset` limpio y advisors sin errores |
| T-04 | `seed.sql` con las 4 materias de ejemplo, agentes, salas del Olimpo, trabajos #13 a #16 y avisos, siempre con datos marcados como de ejemplo | QA puede ejecutar los TC sin preparar datos a mano |
| T-05 | Sprites de los 10 dioses (24 cuadros cada uno), mapa de la planta 1, paleta final; validación a 36×54 px | La hoja se genera en menos de 100 ms y se lee la silueta de cada dios |
| T-06 | Script `apps/web/scripts/simular-trabajo.ts` que inserta `trabajos`, `trabajo_pasos` y `eventos_agente` como lo haría el worker | Un trabajo simulado anima la oficina de punta a punta |
| T-07 | Usuario de servicio, unidad systemd del worker, timer de métricas cada 5 min, TeX Live, Chromium, variables de entorno, respaldo diario | El worker se reinicia solo y las métricas llegan a Supabase |
| T-08 | n8n en Docker en la VM, flujos exportados a `n8n/` sin credenciales | Los flujos se restauran desde el repo |
| T-09 | Comparar motores de imagen para el Ilustrador (costo, calidad de diagramas, licencias) | ADR con la decisión |
| T-10 | Probar Gmail API (OAuth de la cuenta propia) frente a SMTP o un proveedor transaccional para el código 2FA | ADR con la decisión y entrega del correo en menos de 30 s |

## 4. Fuera del backlog (pendientes de decisión, CONTEXTO sección 13)

Plan oficial de la malla (fuente) · correo como canal de entrega · Obsidian · Grok frente a Groq · límites de Oracle Always Free · proyecto Supabase libre.
