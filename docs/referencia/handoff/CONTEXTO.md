# dpardo · especificación para desarrollo

Versión 1 · 15 de octubre de 2026. Fuente visual: `design/pantallas/` (34 archivos) y el lienzo https://claude.ai/artifact/E4n8ff1vWSyPJuH3ykeAyn

## 1. Producto

- PWA personal, responsive (PC, tablet, móvil). Un solo usuario.
- Objetivo: sacar el bot UMSS de la laptop, encargarlo y seguirlo desde la web, y rodearlo de herramientas de organización universitaria.
- Principios de diseño: moderno, minimalista, compacto, con un elemento de impacto (la oficina de agentes en pixel art). No todo va dentro de tarjetas: se usan filas, divisores y espacio en blanco.
- Lo más importante: **el bot**, representado como una oficina de agentes que trabajan, se mueven y se pasan documentos.

## 2. Arquitectura

```
Navegador (PWA Next.js)
   │  lectura/escritura con RLS, suscripciones Realtime
   ▼
Supabase ── Postgres (+pgvector) · Auth · Storage · Realtime
   ▲                         ▲
   │ service role            │ service role
Oracle VM (ARM, Ubuntu)      n8n (en la misma VM)
 ├─ trabajador `umss` (systemd)      ├─ Gmail y webs UMSS/FCyT → avisos
 ├─ router de modelos Claude/Gemini  ├─ recordatorios, resumen semanal
 ├─ TeX Live, Chromium, Claude Code  └─ Google Calendar / Tasks (opcional)
 └─ agente de métricas → metricas_vm
        │
        └─► Google Drive (entregas por materia)
```

Flujo de un encargo:
1. La web inserta en `trabajos` (estado `en_cola`).
2. El trabajador toma el trabajo con `tomar_trabajo()` (`FOR UPDATE SKIP LOCKED`).
3. Por cada paso del pipeline escribe en `trabajo_pasos` y emite filas en `eventos_agente`.
4. Si el encargo pide aprobar el esquema, el trabajo queda en `esperando_aprobacion` hasta que la web cambie `esquemas.estado`.
5. Al terminar, sube el PDF a Storage (`documentos/`) y a Drive (`Mi unidad / UMSS / {materia} / Bot`), y registra `documentos`.
6. La web recibe todo por Realtime; la oficina anima a los agentes según `eventos_agente`.

## 3. Navegación y rutas

Seis secciones más la campana de Avisos. En escritorio: sidebar fija con las 6 secciones, la campana y el acceso a Configuración. En móvil: barra inferior `Inicio · Tareas · Bot (central, destacado) · Agenda · Estudiar`; Materias, Avisos y Configuración se abren desde la cabecera (campana y avatar).

| Ruta | Sección / pestaña | Escritorio | Móvil |
|---|---|---|---|
| `/login` | Iniciar sesión (siempre primero) | `Login` | `LoginMovil` |
| `/` | Inicio · dashboard | `Inicio` | `InicioMovil` |
| `/bot` | Bot · Oficina | `Main` | `BotMovil` |
| `/bot/encargar` | Nuevo encargo (en escritorio es panel del Control maestro) | `Main` (panel) | `EncargarMovil` |
| `/bot/consumo` | Bot · Consumo | `Consumo` | `ConsumoMovil` |
| `/tareas` | Tareas | `Tareas` | `TareasMovil` |
| `/agenda` | Agenda · Calendario | `Calendario` | `CalendarioMovil` |
| `/agenda/horario` | Agenda · Horario semanal | `Horario` | `HorarioMovil` |
| `/materias` | Materias · Mis materias | `Materias` | `MateriasMovil` |
| `/materias/nueva` | Agregar materia | `AgregarMateria` | `AgregarMateriaMovil` |
| `/materias/[codigo]` | Detalle de materia | `Materias` (panel derecho) | `MateriasMovil` |
| `/materias/malla` | Materias · Malla | `Malla` | `MallaMovil` |
| `/estudiar` | Estudiar · Repaso | `Repaso` | `RepasoMovil` |
| `/estudiar/pomodoro` | Estudiar · Pomodoro | `Estudio` | `EstudioMovil` |
| `/avisos` | Bandeja de avisos | `Avisos` | `AvisosMovil` |
| `/configuracion` | Configuración | `Configuracion` | `ConfigMovil` |

Referencias de componentes y diálogos (no son rutas): `Controles` (kit de UI y estados), `ControlesMovil` (hojas inferiores), `Dialogos` (revisar esquema, paleta Ctrl K, nueva tarea, nuevo evento), `Dialogos2` (configurar agente, reglas de bandeja, importar plan, exportar a Google Calendar, cerrar sesión, eliminar materia, recuperar contraseña).

Reglas:
- El ítem activo del sidebar se resuelve con un mapa de alias: `/bot/consumo` resalta Bot, `/materias/malla` resalta Materias, etc.
- Las pestañas internas (Oficina | Consumo, Calendario | Horario semanal, Mis materias | Malla, Repaso | Pomodoro) son rutas, no estado local, para que funcionen el botón atrás y los enlaces.
- Pendiente de diseño: pestañas internas en las pantallas móviles de Agenda, Materias y Estudiar. Usar el mismo control segmentado de `ControlesMovil` bajo la cabecera.
- Diálogos en escritorio = modal centrado; en móvil = hoja inferior que se cierra deslizando.

## 4. Sistema de diseño

### 4.1 Temas

Dos temas, elegibles en Configuración y persistidos en `perfil.tema` (con respaldo en `localStorage` para evitar parpadeo). Valor por defecto: el del sistema operativo.

```css
.t-claro  { --bg:#FFFFFF; --bg2:#F3F3F0; --bg3:#FAFAF8; --line:#E5E5E1; --tx:#0B0B0B; --tx2:#5A5A53;
            --ink:#0B0B0B; --on:#FFFFFF; --warn:#B23C0C; --ok:#1F7A4A; --veil:rgba(11,11,11,.35); }
.t-oscuro { --bg:#000000; --bg2:#121212; --bg3:#0A0A0A; --line:#242424; --tx:#F4F4EF; --tx2:#A3A39B;
            --ink:#F4F4EF; --on:#000000; --warn:#F4A27F; --ok:#8FD9AE; --veil:rgba(80,80,80,.45); }
:root     { --rosa:#F6C4B8; --mant:#F1DF97; --lila:#D2C5F3; --menta:#B9E3CA; --cielo:#B7D5F0; }
```

- Claro: blanco puro. Oscuro: negro OLED puro (apaga píxeles en AMOLED).
- `--ink` / `--on`: botón primario (fondo / texto). Se invierten por tema.
- `--warn`: vencido, error, acción destructiva. `--ok`: verificado, en línea.
- Pasteles: identidad de materia y de agente, acentos, gráficos. Texto encima siempre `#0B0B0B`.
- `accent-color` de checkbox y radio: `var(--tx)`.

Asignación de color por materia (editable en Agregar materia): Estadística II `mant`, Base de Datos II `cielo`, Ecuaciones Diferenciales `lila`, Seguridad de Sistemas `menta`, siguiente `rosa`.

### 4.2 Tipografía

| Uso | Fuente | Pesos |
|---|---|---|
| Títulos, cifras grandes | Bricolage Grotesque (opsz 12..96) | 600, 700; `letter-spacing: -0.025em` |
| Texto | Geist | 400, 500, 600 |
| Códigos, horas, cifras tabulares | Geist Mono | 400, 500 |
| Oficina (rótulos, burbujas) | Pixelify Sans | 400 a 700 |

Cargar con `next/font/google`. Tamaño base 14 px escritorio, 15 px en filas táctiles de móvil.

### 4.3 Medidas

- Radios: 8 (chips internos), 10 a 12 (campos, botones), 14 (botones móviles grandes), 24 (hojas inferiores, arriba).
- Alto mínimo táctil: 44 px; filas de lista móvil 52 px.
- Sidebar escritorio ≈ 232 px. Contenido con columnas flex que envuelven (`flex-wrap` + `flex-basis`), no `grid-column: span` dentro de grids `auto-fit`.
- Breakpoints: móvil < 768, tablet 768 a 1199 (sidebar colapsada a iconos), escritorio ≥ 1200.

### 4.4 Movimiento

- Transiciones de 150 a 300 ms, `ease`. Hojas inferiores: `translateY(40px) → 0` en 300 ms.
- Barra de fuerza de contraseña: crece por cada regla cumplida, con un brillo que la recorre al completar 4/4.
- Error de login: sacudida horizontal del formulario.
- Respetar `prefers-reduced-motion`: sin caminatas en la oficina (los agentes aparecen en su destino) y sin brillos.

## 5. Kit de componentes

Todo está dibujado con sus estados en `Controles.dc.html` y `ControlesMovil.dc.html`. Construir primero en `components/ui`:

| Componente | Estados / variantes |
|---|---|
| Button | primario, secundario, fantasma, destructivo, icono; cargando (spinner), deshabilitado |
| TextField | normal, foco, error con mensaje, válido, deshabilitado; búsqueda; textarea con contador; numérico con stepper |
| Select | lista abierta con selección marcada |
| Combobox | filtra al escribir, opción «+ Crear «…»» |
| MultiSelect | chips con ×, usado en prerrequisitos |
| ContextMenu | acciones por fila, destructiva al final |
| DatePicker / TimeList | días seleccionables, hoy con anillo |
| Switch, Checkbox, Radio, SegmentedControl, Slider, FilterChips | |
| Tabs, Breadcrumbs, Pagination | |
| CommandBar (Ctrl K) | paleta que filtra acciones y navegación |
| Toast | con «Deshacer» |
| Tooltip, Badge, Progress, Spinner, Skeleton, EmptyState | |
| Dropzone | reposo, arrastrando, subiendo |
| Modal / BottomSheet | un único componente `Dialog` que cambia de forma según el breakpoint |

Accesibilidad: roles ARIA como en el diseño (`tablist`, `listbox`, `option`, `dialog` con `aria-modal`), foco visible, navegación con teclado en combobox y paleta.

## 6. Pantallas

### 6.1 Login
- Icono de usuario, campos **usuario** y **contraseña** (mostrar/ocultar), «Recordar este dispositivo», «¿Olvidaste la contraseña?».
- Si el dispositivo es nuevo: paso 2 con código de 6 dígitos enviado a Gmail, reenviar con cuenta atrás, volver.
- Error: sacudida y mensaje sin revelar si falló el usuario o la contraseña.
- Recuperar contraseña: flujo de 3 pasos de `Dialogos2`.

### 6.2 Inicio (dashboard)
- Saludo por hora, fecha y semana de la gestión; barra de búsqueda Ctrl K; acciones rápidas (+ Tarea, Iniciar pomodoro, Encargar al bot).
- Seis indicadores: bot (avance del trabajo actual y agentes trabajando o en descanso), cupo de Claude (5 h y semanal), próximo parcial, tareas de hoy (vencidas en `--warn`), repaso (pendientes, racha, retención), avance de carrera.
- Horas de estudio de 14 días (barras, meta semanal), estado de la oficina, agenda, tareas próximas, avisos, materias en curso, gasto del bot (sparkline), disco de la VM y uso de Supabase.

### 6.3 Bot · Oficina (pantalla principal del bot)
Ver §7. Debajo de la escena: anillo de avance y pipeline de 9 pasos (cada paso muestra la cara del agente responsable; clic = seleccionar ese agente), registro en vivo y tabla de documentos con pestañas Todos / En cola / Entregados / Errores, acciones «Revisar esquema», «PDF», «Ver error».

Panel del agente seleccionado: sala, nombre, estado, motor, rol, tarea actual con progreso, pasos del pipeline que le pertenecen, cola, registro propio, uso de hoy, Pausar/Reanudar, «Configurar agente». Si el seleccionado es el Control maestro, el panel muestra el formulario **Nuevo encargo**: materia (listbox), tema, páginas, indicaciones, interruptor «aprobar esquema antes de redactar», ruta de Drive calculada y «Encargar al bot».

### 6.4 Bot · Consumo
- Cupo de 5 horas y semanal con hora de reinicio; equivalente en USD a precio de lista (bot aparte de sesiones interactivas); solicitudes diarias de Gemini frente a la cuota de AI Studio.
- Servidor: VM Ampere ARM, uptime, disco con desglose (TeX Live, fuentes, caché, documentos, sistema), RAM, CPU, **riesgo de reclamo** (CPU p95 de 7 días frente al umbral de inactividad), tabla de servicios (trabajador, n8n, Claude Code, ping a Supabase, respaldos), cuotas de Supabase y Drive, «Limpiar caché de fuentes».
- Gasto diario (barras, con «Ver como tabla»), gasto por paso (los pasos de Gemini y Python no consumen cupo de Claude), gasto por documento (páginas, turnos, USD por página).

### 6.5 Tareas
Al estilo Google Tasks: listas (Todas, Hoy, Programadas, Completadas, por materia, listas propias), alta rápida con Enter, detalle con vencimiento, recordatorio, repetición, subtareas, notas, sincronización con Google Tasks y «Pedir al bot un documento de apoyo».

### 6.6 Materias, Agregar materia y Malla
- Agregar materia: nombre*, código SIS*, grupo, semestre del plan, gestión, estado; docente, correo, auxiliar, consultas; horarios (día, inicio, fin, aula, tipo) que se crean en el calendario; descripción y unidades (contexto para el bot); pesos de evaluación; prerrequisitos (multiselect); color; Drive con creación automática de `Mi unidad / UMSS / {materia} / {Bot, Apuntes, Prácticas}`.
- Mis materias: lista de la gestión y detalle con unidades, notas (peso, nota, aporte, acumulado y nota necesaria para aprobar con 51), documentos del bot, carpeta de Drive, descripción, «Prerrequisito de».
- Malla: semestres en columnas, estados aprobada / cursando / disponible / bloqueada; al seleccionar una materia se resaltan prerrequisitos y lo que desbloquea, y se indica qué falta. «Importar plan oficial» (`Dialogos2`).
- Eliminar materia: confirmación que solo se habilita escribiendo el nombre exacto.

### 6.7 Agenda
- Calendario: Mes, Semana, Agenda; tipos Parcial, Entrega, Clase, Bot; detalle del evento con temas, preparación sugerida (mazo de repaso, documento del bot) y recordatorios (3 días y 1 día antes, correo y PWA). Sincronización con Google Calendar.
- Horario semanal: rejilla de L a S; teoría = bloque sólido, laboratorio = rayado, auxiliatura = borde discontinuo; siguiente clase, horas por semana; los cambios de aula detectados en Avisos se aplican con un clic. «Exportar a Google Calendar».

### 6.8 Estudiar
- Repaso: mazos por materia generados de cada documento, tarjeta con «Mostrar respuesta» (Espacio), calificación Otra vez / Difícil / Bien / Fácil con intervalos de FSRS, racha y retención.
- Pomodoro: ciclos de 4, materia y tarea vinculadas, horas de hoy y de la semana frente a meta, horas por materia, historial de bloques. El temporizador debe sobrevivir a cambios de pestaña (calcular con marcas de tiempo, no contando ticks) y notificar al terminar.

### 6.9 Avisos
Filtros por fuente (Gmail, UMSS, FCyT, Bot, Recordatorio) y estado (no leídos, destacados, archivados). Reglas: remitentes `@umss.edu`, `@fcyt.umss.edu.bo` y docentes de las materias; noticias de umss.edu.bo y fcyt.umss.edu.bo revisadas cada 30 min por n8n. Detalle con «Detectado automáticamente» (fecha, aula, materia), «Crear tarea», «Abrir original».

### 6.10 Configuración
- Apariencia (claro / oscuro).
- Cuenta: usuario, correo de verificación enmascarado.
- Cambiar contraseña en 3 pasos: nueva contraseña con barra animada (4 reglas), código de Gmail, listo (cierra las demás sesiones).
- Verificación en dos pasos por Gmail para dispositivos nuevos, recordar 30 días, sesiones activas con «Cerrar las demás».
- Google: carpeta raíz de Drive, sincronizar Calendar y Tasks. Cerrar sesión.

## 7. Oficina de agentes

### 7.1 Agentes actuales

| id | Nombre | Sala | Motor | Rol |
|---|---|---|---|---|
| `ctl` | Control maestro | Despacho | Claude | Recibe encargos, planifica, genera el esquema, reparte pasos, vigila el cupo |
| `inv` | Investigador | Sala de trabajo | Gemini + Chromium | Busca y descarga fuentes, consultas ES/EN, bibliografía por DOI |
| `fic` | Fichador | Sala de trabajo | Gemini | Extrae pasajes literales y guarda embeddings en pgvector |
| `red` | Redactor | Sala de trabajo | Claude | Redacta cada sección solo con fichas; toda afirmación con cita verificable |
| `ver` | Verificador | Sala de trabajo | Python | Citas literales contra la fuente y barrera de entrega |
| `maq` | Maquetador | Sala de trabajo | TeX Live | Compila con recetas de errores; si no hay receta, consulta a Gemini |
| `ilu` | Ilustrador | Sala de trabajo | Imágenes [por definir] | Diagramas, figuras, portadas |
| `tut` | Tutor | Biblioteca | Gemini | Tarjetas de repaso y quizzes de cada documento |
| `arc` | Archivista | Biblioteca | Drive API | Entrega PDF en las carpetas de Drive |
| `car` | Cartero | Recepción | n8n | Avisos, correo, recordatorios |

Pipeline de un documento (9 pasos):

| # | Paso | Agente | Motor |
|---|---|---|---|
| 1 | Descargar fuentes | inv | Python + Chromium |
| 2 | Fichas de pasajes | fic | Gemini |
| 3 | Esquema | ctl | Claude |
| 4 | Redacción por secciones | red | Claude |
| 5 | Citas literales | ver | Python |
| 6 | Bibliografía por DOI | inv | Gemini |
| 7 | Compilar LaTeX | maq | TeX Live |
| 8 | Barrera de entrega | ver | Python |
| 9 | Entrega en Drive | arc | Drive API |

### 7.2 Salas: diseño actual y diseño objetivo

Diseño actual en `Main.dc.html` (escena 960×720): Despacho, Sala de trabajo, Biblioteca, Descanso, Reuniones, hall con Recepción.

Diseño objetivo para 5 a 15 agentes: 12 salas en **2 plantas** con pestañas dentro de la vista Oficina y un ascensor en el hall.

| Planta | Sala | Capacidad | Tipo |
|---|---|---|---|
| 1 Producción | Despacho | 1 | trabajo (solo `ctl`) |
| 1 | Investigación | 2 a 4 | trabajo |
| 1 | Redacción | 2 a 4 | trabajo |
| 1 | Control de calidad | 1 a 3 | trabajo |
| 1 | Taller de producción | 2 a 3 | trabajo |
| 1 | Reuniones | 8 sillas | estado: traspaso o planificación |
| 2 Soporte | Aula | 1 a 3 | trabajo |
| 2 | Recepción y correo | 1 a 2 | trabajo |
| 2 | Archivo | 1 a 2 | trabajo |
| 2 | Sala de servidores | 1 | trabajo (futuro Vigía) y estado de la VM |
| 2 | Taller de errores | sin límite | estado: paso fallido o reintento |
| 2 | Descanso | sin límite | estado: libre o esperando insumo |

Opcional: Laboratorio de pruebas para las pruebas A/B. Escritorios en módulos de 2; un agente nuevo elige sala y recibe el primer escritorio libre. Agentes futuros previstos: Solucionador de ejercicios (Redacción), Verificador matemático con SymPy (Control de calidad), Examinador (Aula), Vigía (Servidores), Lector OCR, Traductor, Resumidor, Diapositivas, Indexador de memoria.

Implementación: el mapa de la oficina es **datos**, no marcado fijo. `oficina_salas` (planta, rect, tipo, puntos de puerta) y `agentes` (sala, escritorio, colores de sprite) en la base; el render se genera de ahí.

### 7.3 Máquina de estados de cada agente

| Estado | Origen | Posición en la escena | Pose |
|---|---|---|---|
| `trabajando` | `paso_iniciado` | su escritorio | sentado, animación de tecleo |
| `libre` | sin pasos en cola | Descanso (mesa, sofá o cafetera) | de pie o sentado |
| `esperando` | dependencia sin cumplir | Descanso | de pie |
| `entregando` | `traspaso` (de A a B con documento) | camina hasta el escritorio de B con el papel, vuelve | caminando |
| `reunion` | `planificacion` del Control maestro | Reuniones | sentado |
| `error` | `paso_fallido` | Taller de errores | de pie, burbuja con el error |
| `pausado` | acción del usuario | su escritorio | inmóvil, atenuado |

Hoy el diseño anima un bucle de demostración (guiones por agente cada 1600 ms). En producción el movimiento lo dirige `eventos_agente` vía Realtime: cada evento produce un destino; la ruta se calcula sobre un grafo de puntos (escritorios, puertas, hall) para que el agente cruce por las puertas y no por las paredes.

### 7.4 Render
- Sprites de 12×18 píxeles a escala 3, descritos como mapas de caracteres más paleta (`HEADF`, `HEADB`, `BODY`, piernas `LST/LA/LB`, pelo, piel y camisa por agente). Están en el script de `Main.dc.html`.
- En el diseño se dibujan con `box-shadow` en un solo elemento. En la app: **generar una hoja de sprites en un canvas una vez** (`OffscreenCanvas` → `ImageBitmap`) y dibujar la escena en Canvas 2D a escala entera con `imageSmoothingEnabled = false`. Los paneles, burbujas y nombres quedan en DOM encima del canvas para accesibilidad y texto nítido.
- Profundidad: ordenar por la y inferior del sprite. Volteo horizontal al caminar a la izquierda; vista de espaldas al subir o en escritorios orientados hacia atrás.
- Burbuja de diálogo bajo el agente si está cerca del borde superior.
- Móvil: la misma escena escalada (en el diseño `scale(.3729)` en 358×268), sin burbujas ni rótulos; chips de agentes debajo y tarjeta del seleccionado.
- La lista de agentes accesible (chips) es equivalente a la escena: todo lo que se ve en la escena se puede consultar sin ella.

## 8. Modelo de datos

Borrador completo en `supabase/migrations/0001_init.sql`. Tablas:

| Grupo | Tablas |
|---|---|
| Cuenta | `perfil`, `dispositivos_confiables`, `codigos_verificacion` |
| Académico | `materias`, `materia_horarios`, `materia_unidades`, `evaluaciones`, `plan_materias`, `plan_prerrequisitos` |
| Bot | `agentes`, `oficina_salas`, `trabajos`, `trabajo_pasos`, `esquemas`, `eventos_agente`, `documentos`, `fuentes`, `pasajes` (vector) |
| Consumo | `uso_modelo`, `metricas_vm`, `servicios_estado` |
| Organización | `listas_tareas`, `tareas`, `eventos`, `avisos`, `reglas_avisos` |
| Estudio | `mazos`, `tarjetas`, `revisiones`, `sesiones_estudio` |

Realtime habilitado en: `trabajos`, `trabajo_pasos`, `eventos_agente`, `esquemas`, `avisos`, `metricas_vm`.

## 9. Contrato con el trabajador

- Cola: `select * from tomar_trabajo('vm-oracle-1')` devuelve un trabajo y lo marca `en_proceso` atómicamente.
- Por paso: `insert into trabajo_pasos` (estado `en_proceso`), luego `update` a `hecho` o `error` con `detalle`, `tokens_in`, `tokens_out`, `usd_lista`, `motor`.
- Por movimiento visible: `insert into eventos_agente (agente_id, tipo, trabajo_id, destino_agente_id, mensaje)` con `tipo ∈ {paso_iniciado, paso_terminado, traspaso, planificacion, paso_fallido, libre}`.
- Esquema: si `trabajos.aprobar_esquema`, insertar `esquemas` (estado `pendiente`), poner el trabajo en `esperando_aprobacion` y esperar el cambio a `aprobado` o `cambios_pedidos` (con `comentarios`).
- Uso: cada llamada a modelo agrega una fila a `uso_modelo` (sustituye `datos/uso.jsonl`).
- Métricas: un timer systemd cada 5 min inserta `metricas_vm` (disco por categoría, RAM, CPU, CPU p95 7 d) y actualiza `servicios_estado`. También sirve de ping que evita la pausa de Supabase.
- Credenciales de la VM: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, credenciales OAuth de Drive; token de larga duración de Claude Code.

## 10. Autenticación y seguridad

- Supabase Auth con correo y contraseña por debajo; en la interfaz se entra con **usuario**. Un route handler resuelve `usuario → correo` en el servidor (`perfil.usuario`) y llama a `signInWithPassword`. No exponer el correo en errores.
- Política de contraseña (cliente y servidor): mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 carácter especial. Configurar la misma política en Supabase Auth.
- Cambio de contraseña: activar «Secure password change» en Supabase; `auth.reauthenticate()` envía el código al correo y `updateUser({ password, nonce })` lo aplica. Después, `signOut({ scope: 'others' })`.
- 2FA por Gmail en dispositivo nuevo: Supabase no trae segundo factor por correo, se implementa aparte. Tras la contraseña, si la cookie firmada `dpardo_device` no está en `dispositivos_confiables`, se genera un código de 6 dígitos (hash en `codigos_verificacion`, 10 min, 5 intentos) y se envía por correo desde el servidor. El middleware bloquea `(app)` hasta verificar. «Recordar 30 días» guarda el dispositivo.
- Registro público desactivado en Supabase (un solo usuario).
- RLS en todas las tablas. Storage: bucket privado `documentos`, URLs firmadas de corta duración.

## 11. PWA

- Manifest con nombre «dpardo», `display: standalone`, `theme_color` según tema, iconos 192 / 512 / maskable.
- Serwist: precache del shell, `NetworkFirst` para datos, `CacheFirst` para fuentes e imágenes; PDF entregados disponibles sin conexión una vez abiertos.
- Web Push para recordatorios, fin de pomodoro, esquema pendiente de aprobación y trabajo entregado.

## 12. Orden de construcción

| Hito | Contenido | Criterio de cierre |
|---|---|---|
| H0 | Proyecto Next.js, Tailwind con tokens, fuentes, temas, layout (sidebar y barra inferior), rutas vacías | Las 16 rutas navegan en ambos temas y tres anchos |
| H1 | Kit `components/ui` a partir de `Controles` | Todos los estados de `Controles` reproducidos |
| H2 | Supabase: migración 0001, tipos generados, RLS, semilla con datos de ejemplo | `supabase db reset` limpio; advisors sin errores |
| H3 | Login, 2FA por correo, middleware, Configuración (tema, contraseña) | Flujo completo probado con Playwright |
| H4 | Bot: oficina en canvas con datos de `agentes` y `oficina_salas`, panel, encargo, pipeline, documentos, aprobar esquema, Realtime | Un trabajo simulado (script que inserta eventos) anima la oficina de punta a punta |
| H5 | Trabajador: `tomar_trabajo`, pasos, eventos, uso; probado en la laptop contra Supabase | Trabajo 13 regenerado desde la web con las mismas verificaciones |
| H6 | Consumo y métricas de la VM | Datos reales de la VM |
| H7 | Materias, Agregar materia, Malla, Horario, Calendario | Materia creada aparece en horario, calendario, malla y Drive |
| H8 | Tareas, Avisos (n8n), Repaso (FSRS), Pomodoro, Inicio | Dashboard con datos reales |
| H9 | PWA, push, rendimiento, accesibilidad | Lighthouse PWA aprobado; sin errores de axe |

## 13. Pendiente

- Malla: plan oficial de Ingeniería de Sistemas de la UMSS (PDF propio o página de la UMSS). El diseño usa un plan de ejemplo.
- Correo como canal de entrega: ¿se quita o queda como respaldo?
- Obsidian: ¿las fichas viven en Supabase con sincronización al vault o se abandona?
- Motor del Ilustrador.
- Grok frente a Groq frente a solo Claude + Gemini.
- Verificar en la consola de Oracle los límites actuales del plan Always Free y la política de reclamo por inactividad (el diseño asume umbral de 20% de CPU p95 en 7 días).
- Proyectos gratuitos libres en Supabase (KatiNails ya usa uno).

## 14. Glosario

- **PWA** (Progressive Web App): web instalable con manifest y service worker, con funcionamiento sin conexión y notificaciones.
- **App Router**: sistema de rutas de Next.js basado en carpetas dentro de `app/`, con componentes de servidor por defecto.
- **Server action**: función de servidor de Next.js invocable desde un formulario o componente cliente.
- **RLS** (Row Level Security): políticas de Postgres que filtran filas según el usuario autenticado.
- **Service role**: clave de Supabase que ignora RLS; solo para servidor y VM.
- **Realtime**: servicio de Supabase que emite cambios de tablas a clientes suscritos por WebSocket.
- **pgvector**: extensión de Postgres para almacenar vectores y buscar por similitud (distancia coseno).
- **Embedding**: vector que representa el significado de un texto.
- **`FOR UPDATE SKIP LOCKED`**: cláusula de Postgres que bloquea la fila tomada y salta las ya bloqueadas; permite una cola segura con varios trabajadores.
- **systemd**: gestor de servicios de Linux; mantiene el trabajador activo y ejecuta timers.
- **OCPU** (Oracle CPU): unidad de cómputo de Oracle Cloud; en ARM Ampere equivale a un núcleo.
- **p95**: percentil 95; valor bajo el cual queda el 95% de las mediciones.
- **FSRS** (Free Spaced Repetition Scheduler): algoritmo de repetición espaciada que modela estabilidad y dificultad de cada tarjeta. `ts-fsrs` es su implementación en TypeScript.
- **Pomodoro**: bloques de 25 min de enfoque con pausas cortas y una larga cada 4 ciclos.
- **Nonce**: código de un solo uso; aquí, el que Supabase envía por correo para autorizar el cambio de contraseña.
- **2FA** (Two-Factor Authentication): segundo factor además de la contraseña; aquí, un código enviado al Gmail.
- **OTP** (One-Time Password): código de un solo uso con vencimiento.
- **Serwist**: biblioteca de service workers para Next.js, sucesora de next-pwa.
- **Sprite**: imagen pequeña de un personaje; una hoja de sprites agrupa todos sus cuadros.
- **OffscreenCanvas / ImageBitmap**: APIs del navegador para dibujar fuera de pantalla y reutilizar el resultado como imagen.
- **ARIA** (Accessible Rich Internet Applications): atributos que describen roles y estados para lectores de pantalla.
- **SIS** (Sistema de Información Estudiantil): código de materia o de estudiante en la UMSS.
- **DOI** (Digital Object Identifier): identificador permanente de un artículo; con él se obtienen metadatos bibliográficos exactos.
- **A/B**: ejecutar la misma tarea con dos configuraciones y comparar con las mismas verificaciones.
- **Lighthouse / axe**: herramientas de auditoría de rendimiento, PWA y accesibilidad.
