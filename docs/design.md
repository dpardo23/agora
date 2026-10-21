# Sistema de diseño · dpardo / Olympus

Versión 2.0 · creado el 2026-10-20 · editado el 2026-10-20 · autor: Juan Diego Pardo Pozo

Este documento es la fuente de verdad visual para implementar la web. Se construyó a partir de:

| Fuente | Qué aporta |
|---|---|
| `design/pantallas/Controles.dc.html` y `ControlesMovil.dc.html` | Valores reales (CSS) de botones, campos, desplegables, avisos, hojas inferiores |
| `design/pantallas/*.dc.html` | Pantallas, textos literales, datos de ejemplo |
| `design/mockups/*.png` | Capturas de cada pantalla (escritorio 1440 px y móvil 390 px), renderizadas el 2026-10-20 desde el lienzo |
| `docs/referencia/handoff/CONTEXTO.md` sección 3 a sección 7 | Navegación, temas, tipografía, medidas, movimiento, oficina |
| `design/referencias/oficina-olimpo.png` | Ambientación de la Oficina del Olimpo (ADR-003) |

Si una pantalla y este documento se contradicen, manda este documento. Las diferencias detectadas están en sección 13.

---

## 1. Principios

1. **Moderno, minimalista y compacto.** No todo va dentro de tarjetas: se usan filas, divisores (`1px solid var(--line)`) y espacio en blanco.
2. **Un solo elemento de impacto:** la Oficina del Olimpo en pixel art. El resto de la interfaz es sobria para no competir con ella.
3. **Una acción primaria por vista.** El botón primario (`--ink`) aparece una sola vez por pantalla o por panel.
4. **Los datos nunca se inventan.** Los textos entre corchetes del diseño (`[docente]`, `[aula]`, `[nota]`, `[N]`) son datos que vienen de la base. Si un dato falta, se muestra «—» o el estado vacío; jamás se escribe un valor de ejemplo.
5. **Accesible por defecto.** Contraste AA, foco visible, uso completo con teclado y equivalente textual de todo lo que muestra la escena.

---

## 2. Color

### 2.1 Tokens por tema

Los tokens se declaran como variables CSS en `src/app/globals.css` y se exponen a Tailwind v4 con `@theme`. Tema por defecto: el del sistema operativo. Se persiste en `perfil.tema`, con respaldo en `localStorage` para evitar el parpadeo.

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `--bg` | `#FFFFFF` | `#000000` | Fondo principal (blanco puro / negro OLED) |
| `--bg2` | `#F3F3F0` | `#121212` | Superficies secundarias: campos deshabilitados, registro, chips neutros, hover de opciones |
| `--bg3` | `#FAFAF8` | `#0A0A0A` | Paneles laterales y fondos sutiles |
| `--line` | `#E5E5E1` | `#242424` | Bordes, divisores, contorno de campos |
| `--tx` | `#0B0B0B` | `#F4F4EF` | Texto principal; también `accent-color` de checkbox y radio |
| `--tx2` | `#5A5A53` | `#A3A39B` | Texto secundario, etiquetas, ayudas |
| `--ink` | `#0B0B0B` | `#F4F4EF` | Fondo del botón primario (se invierte por tema) |
| `--on` | `#FFFFFF` | `#000000` | Texto sobre `--ink` |
| `--hov` | `#2A2A2A` | `#D6D6D0` | Hover del botón primario |
| `--warn` | `#B23C0C` | `#F4A27F` | Vencido, error, acción destructiva |
| `--ok` | `#1F7A4A` | `#8FD9AE` | Verificado, en línea, campo válido |
| `--veil` | `rgba(11,11,11,.35)` | `rgba(80,80,80,.45)` | Velo detrás de modales y hojas |

El botón de peligro usa `#B23C0C` con texto `#FFFFFF` **en ambos temas** (valor fijo de `Controles`).

### 2.2 Pasteles de identidad

Son iguales en ambos temas. **El texto encima siempre es `#0B0B0B`**, también en el tema oscuro.

| Token | Valor | Uso |
|---|---|---|
| `--rosa` | `#F6C4B8` | Materia (5.ª), motor **Claude**, agentes Apolo y Hefesto |
| `--mant` | `#F1DF97` | Estadística II, agentes Iris y Mnemósine |
| `--lila` | `#D2C5F3` | Ecuaciones Diferenciales, marca (logo), agente Hermes |
| `--menta` | `#B9E3CA` | Seguridad de Sistemas, estado «Redactando/en curso», agentes Temis y Clío |
| `--cielo` | `#B7D5F0` | Base de Datos II, motor **Gemini**, agentes Atenea y Metis |

Asignación inicial de color por materia (editable en Agregar materia): Estadística II `mant`, Base de Datos II `cielo`, Ecuaciones Diferenciales `lila`, Seguridad de Sistemas `menta`, la siguiente `rosa`. Después se repite el ciclo.

### 2.3 Insignias de motor

| Motor | Fondo | Texto |
|---|---|---|
| Claude | `--rosa` | `#0B0B0B` |
| Gemini | `--cielo` | `#0B0B0B` |
| Python, TeX Live, Drive API, n8n | `--bg2` | `--tx` |

---

## 3. Tipografía

| Rol | Fuente | Tamaño / peso | Notas |
|---|---|---|---|
| Título de página (`h1`: «Olimpo», «Tareas») | Bricolage Grotesque | 30 px / 700 | `letter-spacing: -0.025em`; clase `.d` |
| Título de documento destacado | Bricolage Grotesque | 24 px / 700 | p. ej. el trabajo activo en la oficina |
| Cifra grande (indicadores, anillo) | Bricolage Grotesque | 28 a 40 px / 700 | Unidad (`%`, «día») a 14 px |
| Título de sección | Geist | 16 px / 600 | |
| Texto | Geist | 14 px / 400, `line-height: 1.45` | Base de escritorio |
| Texto de fila táctil (móvil) | Geist | 15 px / 400 | Filas de 52 px |
| Etiqueta de campo (`.lbl`) | Geist | 12 px / 500, `--tx2` | Siempre visible arriba del campo |
| Rótulo (`.cap`) | Geist Mono | 10 px, mayúsculas, `letter-spacing: .06em`, `--tx2` | Encabezados de grupo |
| Códigos, horas, cifras tabulares (`.m`) | Geist Mono | 12 a 14 px / 400 a 500 | `font-variant-numeric: tabular-nums` |
| Oficina: rótulos, burbujas, placas | Pixelify Sans | 10 a 12 px / 400 a 700 | Solo dentro de la escena |

Se cargan con `next/font`: Bricolage Grotesque (eje `opsz` 12..96, pesos 600 y 700), Geist (400, 500, 600), Geist Mono (400, 500) y Pixelify Sans (400 a 700), con `font-display: swap`.

---

## 4. Espaciado, radios y elevación

| Medida | Valor |
|---|---|
| Unidad base | 4 px. Separaciones habituales: 8, 12, 16, 20, 24, 28 |
| Separación entre secciones | 28 px arriba y abajo, con un divisor arriba |
| Separación entre grupos en fila | 20 px vertical y 24 px horizontal (`flex-wrap`) |
| Radio de chips internos y etiquetas | 6 a 8 px |
| Radio de campos y botones | 10 px (12 px en popovers) |
| Radio de botones móviles grandes | 14 px |
| Radio de hojas inferiores | 24 px, solo en las esquinas superiores |
| Alto mínimo táctil | 44 px; filas de lista en móvil de 52 px |
| Sombra de popover y menú | `0 16px 40px rgba(0,0,0,.18)` |
| Sombra de tarjeta flotante | `0 16px 40px rgba(0,0,0,.14)` |

Regla de maquetación: el contenido usa columnas flex que envuelven (`flex-wrap` + `flex-basis`). **No** se usa `grid-column: span` dentro de grids `auto-fit`.

---

## 5. Layout y navegación

### 5.1 Breakpoints

| Rango | Nombre | Navegación |
|---|---|---|
| < 768 px | Móvil | Barra inferior: `Inicio · Tareas · Olimpo (central, destacado) · Agenda · Estudiar`. Materias, Avisos y Configuración se abren desde la cabecera (campana y avatar «JD») |
| 768 a 1199 px | Tablet | Sidebar colapsada a iconos, con tooltip |
| ≥ 1200 px | Escritorio | Sidebar fija de unos 232 px con logo «dpardo», campana con contador, 6 secciones con contador, y Configuración abajo |

### 5.2 Sidebar (escritorio)

- Ítems: Inicio, Olimpo, Tareas (contador), Agenda, Materias, Estudiar (contador). Cada uno lleva un icono Lucide de 18 px y texto de 14 px.
- Ítem activo: fondo `--bg2`, radio de 10 px y peso 600. El activo se resuelve con un mapa de alias: `/olimpo/consumo` → Olimpo, `/materias/malla` → Materias, `/agenda/horario` → Agenda, `/estudiar/pomodoro` → Estudiar.
- Contador: Geist Mono de 12 px, `--tx2`. El contador de la campana es una insignia circular `--rosa` con texto `#0B0B0B`.

### 5.3 Cabecera de sección

Título `h1` y, a su derecha, las **pestañas de sección** (control segmentado: fondo `--bg2`, pestaña activa con fondo `--bg` y sombra sutil). Después va el estado contextual (p. ej. «● En línea · Oracle VM · 6 en su puesto · 2 en descanso») y, a la derecha, las acciones secundarias. Las pestañas son **rutas**, no estado local.

### 5.4 Rutas

La lista única de rutas, con su sección activa y sus HU, está en `docs/api.md` (sección 2). Son 17 rutas de producto, más `/dev/kit`, que solo existe en desarrollo.

---

## 6. Componentes (`src/components/ui`)

Todos los estados de esta sección están dibujados en `design/mockups/controles-y-estados-escritorio.png` y `hojas-inferiores-movil.png`.

### 6.1 Button

| Variante | Estilo | Uso |
|---|---|---|
| Primario | `min-height: 40px; padding: 0 16px; radius: 10px; bg: --ink; color: --on; border: 1px --ink; weight: 600` | Acción principal (una por vista) |
| Secundario | `padding: 0 14px; bg: transparent; border: 1px --line; color: --tx; weight: 500` | «Ver esquema», «Pausar trabajo» |
| Fantasma | `padding: 0 12px; sin borde ni fondo; weight: 500` | «Cancelar» |
| Peligro | `bg: #B23C0C; color: #FFFFFF; weight: 600` | «Eliminar materia» |
| Solo icono | 40 × 40 px, variante secundaria o primaria | «+», «⋯», «→». Lleva `aria-label` obligatorio |
| Grupo dividido | Primario + flecha «▾» separada por un divisor | «Exportar PDF ▾» |

| Estado | Regla |
|---|---|
| Hover | Primario `--hov`; secundario fondo `--bg2` |
| Presionado | `transform: translateY(1px)` |
| Foco de teclado | Anillo doble: `outline: 2px solid --bg` + `box-shadow: 0 0 0 4px --tx` |
| Deshabilitado | Opacidad 0,4, `cursor: not-allowed`, `aria-disabled` |
| Cargando | Spinner de 16 px a la izquierda, texto conservado, ancho fijo, `aria-busy="true"` |

Tamaños: **Chico** 32 px (texto de 13 px), **Medio** 40 px (por defecto), **Grande** 48 px (texto de 16 px; es el botón de móvil, con radio de 14 px).

### 6.2 TextField

- Estructura: etiqueta `.lbl` arriba (siempre visible) · campo `min-height: 42px; padding: 0 12px; radius: 10px; border: 1px --line; bg: --bg` · ayuda en 12 px `--tx2` debajo.
- Estados: **vacío** (placeholder en `--tx2`), **foco** (`border-color: --tx`), **error** (borde y mensaje en `--warn`; el error **reemplaza** a la ayuda; `aria-invalid` y `aria-describedby`), **válido** (borde `--ok` y «✓» a la derecha), **deshabilitado** (fondo `--bg2`).
- Variantes: búsqueda (icono de lupa a la izquierda); área de texto con contador `n / 280` en Geist Mono, alineado a la derecha; numérico con stepper `− 12 +`; contraseña con botón «Mostrar» / «Ocultar» dentro del campo.
- Mensajes de validación: en una frase y con la regla concreta, por ejemplo «El código SIS debe tener 7 dígitos.».

### 6.3 Select, Combobox, MultiSelect, ContextMenu

- **Popover:** `padding: 6px; radius: 12px; border: 1px --line; sombra de popover`. Opción: `min-height: 36px; padding: 0 10px; radius: 8px; 13px`; hover y activa con fondo `--bg2`; la seleccionada lleva «✓» a la derecha y peso 600.
- **Select de materia:** cada opción lleva un punto de 8 px con el pastel de la materia.
- **Combobox:** filtra al escribir. Sin coincidencias muestra «Sin coincidencias» y la opción «+ Crear «…»». Teclado: ↑ ↓ Enter Esc. Roles `combobox` y `listbox`.
- **MultiSelect (prerrequisitos):** chips con el nombre y «×» (`aria-label="Quitar …"`), campo «Agregar…» y sugerencias como chips «+ Nombre».
- **ContextMenu (⋯):** acciones por fila; la acción destructiva va al final, separada por un divisor y en `--warn`.

### 6.4 DatePicker, TimeList y rango rápido

- Botón con icono de calendario y fecha larga, por ejemplo «jueves 15 de octubre de 2026».
- Calendario: cabecera «‹ Octubre 2026 ›» y semana de L a D. **Hoy** con anillo de 1 px `--tx`; **día elegido** con fondo `--ink` y texto `--on`.
- Lista de horas cada 15 minutos; la elegida con «✓».
- Rango rápido: «Hoy», «Mañana», «Antes del parcial · jue 15», «Sin fecha».

### 6.5 Selección

Interruptor (para efectos inmediatos), casilla (para listas y formularios; `accent-color: --tx`, 18 px), radio, control segmentado, deslizador («Meta semanal: 12 h») y chips de filtro («Todas», nombres de materia).

### 6.6 Navegación

Pestañas de sección (segmentado), pestañas subrayadas («Todos · En cola 2 · Entregados 18 · Errores 1»: la activa subrayada con 2 px `--tx` y peso 600), migas («Materias / Base de Datos II / Notas»), paginación y atajo de búsqueda («Buscar o ejecutar… Ctrl K»).

### 6.7 Avisos y progreso

- **Toast:** abajo a la derecha (en móvil, abajo y centrado, sobre la barra inferior). Dura 5 s y lleva «Deshacer» cuando la acción es reversible. Variantes: éxito o neutro («Encargo #17 enviado al Control maestro»), error con borde `--warn` y acción «Ver», info. Se anuncia con `role="status"` (o `alert` si es error).
- **Tooltip:** 12 px, fondo `--ink`, texto `--on`, con un retardo de 400 ms.
- **Insignias:** contador circular y etiquetas `.tag` (`padding: 2px 8px; radius: 6px; 12px / 500`).
- **Progreso:** lineal determinado (pista `--bg2`, barra `--tx`, radio de 6 px) o indeterminado; anillo de avance (el de la oficina, segmentos en `--tx` y `--ok`).
- **Spinner:** 24 px, borde de 3 px `--line` con el tramo superior `--tx`, rotación de 0,8 s.
- **Esqueleto:** gradiente `--bg2 → --line → --bg2` animado en 1,4 s.
- **Estado vacío:** recuadro con borde discontinuo `--line`, radio de 14 px, título («Sin documentos todavía»), una línea de ayuda («El primer encargo aparece aquí.») y una acción («Nuevo encargo»).

### 6.8 Dropzone (fuentes del encargo)

Tres estados: **reposo** («Arrastra PDF aquí · o pega un enlace o DOI · Elegir archivos»), **arrastrando** (borde `--tx`, «Suelta para adjuntar 2 archivos») y **subiendo** (fila con tipo «PDF», nombre, progreso y porcentaje). Un DOI verificado muestra «✓» en `--ok`.

### 6.9 Dialog (modal / hoja inferior)

- Es un solo componente que cambia de forma según el breakpoint: **modal centrado** en escritorio y tablet, **hoja inferior** en móvil.
- Modal: radio de 14 px, ancho de 480 a 640 px, cabecera con título y «×», pie con acciones a la derecha (fantasma «Cancelar» y primario).
- Hoja inferior: radio de 24 px arriba, asa de arrastre y entrada `translateY(40px) → 0` en 300 ms. Se cierra deslizando hacia abajo, con Esc o tocando el velo.
- Accesibilidad: `role="dialog"`, `aria-modal="true"`, foco atrapado, devolución del foco al disparador y Esc para cerrar.
- Diálogo destructivo (eliminar materia): el botón de peligro solo se habilita al escribir el nombre exacto.

### 6.10 CommandBar (Ctrl K)

Paleta que filtra acciones y navegación por grupos. Atajos al pie: «↑ ↓ moverse · Enter abrir · Ctrl K desde cualquier pantalla». Si no hay resultados: «Sin resultados. Enter para encargar «…» al Olimpo.».

---

## 7. Movimiento (interfaz)

| Elemento | Duración y curva |
|---|---|
| Transiciones generales (hover, foco, pestañas) | De 150 a 300 ms, `ease` |
| Hoja inferior | 300 ms, `translateY(40px) → 0` + opacidad |
| Barra de fuerza de contraseña | Crece una regla a la vez; brillo que la recorre al completar 4/4 |
| Error de login | Sacudida horizontal del formulario (unos 400 ms) |
| Esqueleto | Barrido de 1,4 s lineal infinito |

`prefers-reduced-motion: reduce` desactiva las sacudidas, los brillos y el barrido de esqueleto. En la oficina se aplica la opción C (sección 8.4): los dioses caminan más lento y sin gestos ni destellos.

---

## 8. Oficina del Olimpo (sección Olimpo)

Referencias: `design/referencias/oficina-olimpo.png` (ambientación), `design/mockups/olimpo-oficina-escritorio.png` y `olimpo-oficina-movil.png` (interfaz), y ADR-003 y ADR-004.

### 8.1 Panteón: dioses y roles (aprobado el 2026-10-20)

El Olimpo es **escalable** (ADR-005): un **dios** es la persona visible y un **rol** es una capacidad del sistema. Un dios puede tener **varios roles** (reciclaje) y se pueden agregar dioses o roles sin tocar el código del render. En la interfaz cada dios se muestra como **«Dios · rol principal»**, por ejemplo «Zeus · Control maestro», y su panel lista todos sus roles.

**Asignación inicial**

| Dios | Roles iniciales (`roles`) | Sala | Motor del rol | Pastel (chip) | Atributos del sprite |
|---|---|---|---|---|---|
| **Zeus** | `orquestar` (Control maestro), `generar_esquema` | Despacho de Zeus | Claude | navy (borde `--tx`) | Barba y pelo blancos, corona de laurel dorada, túnica azul, rayo en la mano |
| **Atenea** | `investigar_fuentes`, `bibliografia_doi` | Templo de Atenea | Gemini + Chromium | `--cielo` | Casco dorado con cresta roja, lanza, túnica blanca |
| **Metis** | `fichar_pasajes` | Templo de Atenea | Gemini | `--cielo` | Túnica turquesa, rollos de papiro bajo el brazo |
| **Apolo** | `redactar` | Salón de Apolo | Claude | `--rosa` | Pelo dorado, halo de sol, túnica blanca, pluma |
| **Temis** | `verificar_citas`, `barrera_entrega` | Tribunal de Temis | Python | `--menta` | Venda en los ojos, balanza, túnica verde menta |
| **Hefesto** | `compilar_latex` | Forja de Hefesto | TeX Live | `--rosa` | Barba oscura, delantal de cuero, martillo |
| **Iris** | `ilustrar` | Forja de Hefesto (mesa de arte) | Imágenes [por definir, T-09] | `--mant` | Pañuelo de arcoíris, pincel |
| **Mnemósine** | `generar_tarjetas` | Aula de Mnemósine | Gemini | `--mant` | Túnica lila, pizarra portátil |
| **Clío** | `entregar_drive` | Biblioteca del Olimpo | Drive API | `--menta` | Libro y rollo, túnica verde |
| **Hermes** | `recibir_avisos` | Recepción | n8n | `--lila` | Casco y sandalias alados, bolsa de cartas |

**Reglas de escalabilidad (siempre)**

1. El pipeline apunta a **roles**; el dios que ejecuta un rol se resuelve con `asignaciones_rol`.
2. Un rol tiene un único dios titular; un dios puede acumular roles. Reasignar un rol no cambia el pipeline ni el código.
3. Un dios nuevo se define con datos: nombre, sala, escritorio, paleta y atributos del sprite (sección 8.5). Si su sala no tiene escritorios libres, recibe el siguiente módulo de 2 escritorios, o la sala pasa a la planta 2 (HU-05.07).
4. La interfaz nunca ramifica por nombre de dios; ramifica por rol (por ejemplo, quien tiene `orquestar` muestra el formulario de encargo).
5. Un dios con varios roles camina a la estación del rol que ejecuta en ese momento (escritorio principal o estación secundaria en otra sala).

**Dioses futuros previstos** (se confirman al crear cada rol): Pitágoras (resolver ejercicios), Urania (verificación matemática con SymPy), Quirón (examinador), Argos (vigía de la VM, en el Nexo de servidores), Hécate (OCR), Calíope (resúmenes), Talía (diapositivas), Ares (resolver errores, en su taller) y Dioniso (anfitrión del descanso, sin rol productivo).

### 8.2 Salas (planta 1, según la imagen de referencia)

| Sala | Tipo | Capacidad | Ambientación |
|---|---|---|---|
| Despacho de Zeus | trabajo (dios con rol `orquestar`) | 1 | Trono de rayo cian, escritorio de madera, alfombra azul con laurel dorado, columnas |
| Templo de Atenea · Investigación y estrategia | trabajo | 2 a 4 | Mapa sobre la mesa, estanterías, alfombra azul |
| Salón de Apolo · Redacción | trabajo | 2 a 6 | Pupitres en filas, liras doradas, sol en la pared |
| Forja de Hefesto · Producción | trabajo | 2 a 3 | Hornos con fuego, yunque, mesas de herramientas, suelo de ladrillo |
| Tribunal de Temis · Control de calidad | trabajo | 1 a 3 | Balanza, pupitre elevado (sala nueva respecto de la imagen) |
| Aula de Mnemósine · Tutoría | trabajo | 1 a 3 | Pizarra verde, pupitres |
| Biblioteca del Olimpo · Archivo | trabajo | 1 a 2 | Estanterías altas, mesa de lectura |
| Recepción | trabajo (Hermes) | 1 a 2 | Fuente de agua en el hall, macetas de laurel |
| Ágora · Reuniones | estado: `reunion` | 8 asientos | Mesa redonda de mármol (sala nueva respecto de la imagen) |
| Taller de errores de Ares | estado: `error` | sin límite | Banco de trabajo, papeles rotos, burbuja roja |
| Salón de Dioniso · Descanso | estado: `libre` / `esperando` | sin límite | Sofás púrpura, ánforas, dispensadores de agua, parras |
| Nexo de servidores | estado de la VM (futuro Argos) | 1 | Racks con cables cian brillantes |

La planta 2 (diseño objetivo para 5 a 15 agentes, con ascensor en el hall) se aborda en HU-05.07. El mapa es **dato** (`oficina_salas`: planta, rectángulo, tipo y puntos de puerta), no marcado fijo.

### 8.3 Paleta de la escena

La escena tiene paleta propia y **no cambia con el tema** de la interfaz; solo el marco usa `--line`. Valores muestreados de la imagen de referencia; se ajustan en el spike de sprites (T-05).

| Nombre | Valor | Uso |
|---|---|---|
| Mármol | `#E9F0F7` | Suelo de salas y del hall |
| Mármol sombra | `#C3DEEC` | Vetas y juntas del suelo |
| Oro | `#DDB865` | Molduras, laureles, liras, marcos |
| Contorno | `#23212B` | Contorno de muros, objetos y sprites |
| Cielo | `#80BFEA` | Fondo exterior |
| Nube | `#F0F9FD` | Nubes en los bordes de la escena |
| Madera | `#8E6545` / `#A67B61` | Escritorios, estanterías |
| Alfombra real | `#30456B` | Alfombras del Despacho y del Templo |
| Púrpura Dioniso | `#693A83` | Sofás y uvas del Salón de Dioniso |
| Fuego | `#EB5B1D` | Hornos de la Forja |
| Rayo | `#61C6E2` | Trono de Zeus, cables del Nexo de servidores |
| Rojo Ares | `#A82C23` | Taller de errores, burbujas de error |
| Laurel | `#57804D` | Plantas y coronas |
| Rótulo | fondo `#1B1A1F`, texto `#EEEBE3`, borde de 2 px | Placa de cada sala, en Pixelify Sans de 11 px |
| Burbuja | fondo `#FFFFFF`, texto y borde `#1B1A1F`, sombra `3px 3px 0 #1B1A1F` | Diálogo de cada dios |

### 8.4 Movimiento de los dioses (regla: siempre en movimiento)

**Ningún dios queda inmóvil.** Cada estado tiene un ciclo propio y los cambios de estado se recorren caminando por el grafo de puertas, nunca atravesando paredes.

| Estado (`eventos_agente`) | Destino | Animación continua |
|---|---|---|
| `trabajando` (`paso_iniciado`) | Su escritorio | Sentado tecleando (2 cuadros, 0,5 s). Cada 8 a 15 s (al azar) hace un **gesto de trabajo**: se levanta, va a un punto de su sala (estantería, mapa, horno, pizarra), interactúa de 2 a 4 s y vuelve |
| `libre` | Salón de Dioniso | **Deambula** entre los puntos de descanso (sofá, dispensador, ánfora, ventana) con pausas de 3 a 8 s; respira en pausa (2 cuadros, 1,6 s) |
| `esperando` | Salón de Dioniso | Igual que `libre`, con la burbuja «Espero …» |
| `entregando` (`traspaso`) | Escritorio del dios destino | Camina con un papiro, se lo entrega (0,6 s), el destino muestra el papiro sobre su escritorio, y el emisor vuelve |
| `reunion` (`planificacion`) | Ágora | Se sienta. Cada 4 a 6 s gesticula (brazo arriba) |
| `error` (`paso_fallido`) | Taller de errores de Ares | Camina hasta el banco, de pie, con una burbuja roja que dice el error resumido; golpea el banco (2 cuadros) |
| `pausado` | Su escritorio | Atenuado al 50 %; solo respira, sin teclear ni gestos |

Parámetros:

- Velocidad de caminata: 64 px lógicos por segundo, con un ciclo de piernas de 4 cuadros a 0,36 s.
- Volteo horizontal al caminar hacia la izquierda; vista de espaldas al subir o en escritorios orientados hacia atrás.
- Profundidad: se ordena por la y inferior del sprite.
- Burbuja: aparece debajo del dios si está a menos de 72 px del borde superior. Dura 4 s, salvo en `error` y `esperando`, donde es persistente.
- Placa con el nombre del dios debajo del sprite, en Pixelify Sans de 10 px, con fondo `rgba(27,26,31,.82)`.
- Flecha de selección: triángulo `#F2D14B` que salta sobre el dios elegido.
- El bucle de render se pausa con `document.hidden`; al volver, cada dios **se coloca en su destino actual** sin repetir las caminatas pendientes.
- **Con `prefers-reduced-motion` (opción C, aprobada el 2026-10-20):** los dioses siguen caminando entre estaciones, pero a 32 px por segundo (la mitad), sin gestos periódicos, sin destellos de fuego ni rayo, sin brillos y sin el rebote de la flecha. Respirar y teclear se mantienen.
- Botón **«Pausar animación»** siempre visible junto a la escena (WCAG 2.2.2). Detiene el bucle sin perder los eventos, que se aplican al reanudar.

### 8.5 Sprites

- Grilla de 12×18 px a escala 3 (36×54 px en pantalla), descrita como mapa de caracteres + paleta, como en `Main.dc.html` (`HEADF`, `HEADB`, `BODY`, piernas `LST/LA/LB`).
- Cada dios define: pelo, piel, túnica, accesorio de cabeza (laurel, casco, halo, casco alado) y objeto en la mano. El atributo debe leerse a 36×54: la **silueta** manda sobre el detalle.
- Cuadros por dios: frente y espalda × (quieto, respirar ×2, teclear ×2, caminar ×4, gesto ×2, entregar ×1) = unos 24 cuadros.
- La hoja de sprites se genera una sola vez en un `OffscreenCanvas` y se guarda como `ImageBitmap`.

### 8.6 Interfaz alrededor de la escena (sin cambios respecto de `Main`)

Encima de la escena: cabecera «Olimpo» con pestañas **Oficina | Consumo**, el estado de la VM y «+ Nuevo encargo». Debajo: anillo de avance, pipeline de 9 pasos (cada paso con la cara del dios responsable; clic para seleccionarlo), registro en vivo y tabla de documentos. A la derecha, el panel del dios seleccionado con todos sus roles; si el dios tiene el rol `orquestar` (hoy Zeus), el panel muestra «Nuevo encargo · Buzón del Control maestro».

### 8.7 Móvil

La misma escena se escala en entero al ancho disponible (358 px de ancho; en el diseño, `scale(.3729)`), sin burbujas ni placas. Debajo van los chips de los dioses (pastel + nombre + estado), la tarjeta del seleccionado y el trabajo activo («#14 Normalización · 4 de 9 · ≈ 18 min»).

### 8.8 Accesibilidad de la escena

- El `<canvas>` tiene `role="img"` y la etiqueta «Oficina del Olimpo. Toca a un dios para ver su detalle.».
- La **lista de chips** es equivalente a la escena: cada chip dice «Apolo · Redactor: trabajando. Ver detalle». Todo lo que se ve en la escena se puede consultar sin ella.
- Los cambios de estado se anuncian en el registro en vivo (`aria-live="polite"`), con un máximo de un anuncio cada 5 s.

---

## 9. Iconografía

Lucide (`lucide-react`) a 16 y 18 px, con trazo de 1,75. **Sin emoji** en la interfaz. Los iconos decorativos llevan `aria-hidden="true"`; los iconos que son la única etiqueta de un botón llevan `aria-label`.

## 10. Contenido y formato

- Idioma: español de Bolivia. Fechas `es-BO` en zona `America/La_Paz` («miércoles 14 de octubre»), decimales con coma («41,8 GB»), horas de 24 h («09:45»).
- El correo siempre va enmascarado: `jdiego•••@gmail.com`.
- Saludo según la hora: «Buenos días» (5 a 11:59), «Buenas tardes» (12 a 18:59), «Buenas noches» (19 a 4:59).
- Botones en infinitivo o sustantivo de acción («Encargar al Olimpo», «Guardar materia»). Los mensajes de error dicen qué pasó y cómo seguir.
- El login nunca revela si falló el usuario o la contraseña.

## 11. Accesibilidad

La norma, el nivel y los criterios aplicables están en `docs/accesibilidad.md` (WCAG 2.2, nivel AA, más criterios AAA adoptados). Este documento solo fija los valores visuales que la cumplen: contraste de los tokens (sección 2), foco (sección 6.1), objetivos de 44×44 px en móvil (sección 4) y movimiento (secciones 7 y 8.4).

## 12. Estados obligatorios por pantalla

Toda pantalla con datos define estos cuatro estados: **carga** (esqueleto con la forma del contenido), **vacío** (estado vacío con acción), **error** (mensaje + «Reintentar») y **normal**. Donde el diseño no los dibuja, se aplican los patrones de sección 6.7.

## 13. Diferencias detectadas entre el diseño y la especificación

| # | Hallazgo | Decisión |
|---|---|---|
| 1 | `--hov` existe en `Controles` pero no en CONTEXTO sección 4.1 | Se adopta (sección 2.1) |
| 2 | `Main.dc.html` no declara `--bg3` ni `--ok` | Se usan los tokens completos de sección 2.1 en todas las pantallas |
| 3 | En `Controles`, el área de texto interactiva muestra «[object Object]» | Es un defecto del lienzo, no del diseño: el valor inicial es un texto vacío con contador «0 / 280» |
| 4 | La escena del diseño es una oficina genérica | Se reemplaza por la Oficina del Olimpo (ADR-003). La interfaz alrededor se mantiene |
| 5 | Las pestañas internas de las pantallas móviles de Agenda, Materias y Estudiar no están dibujadas | Se usa el control segmentado de `ControlesMovil`, bajo la cabecera |
| 6 | La mayoría de las pantallas no dibuja estados vacío y de error | Se aplica sección 12 |
| 7 | Las salas Ágora y Tribunal de Temis no están en la imagen de referencia | Se agregan con la misma ambientación (mármol y oro); aprobado el 2026-10-20 |
| 8 | Los diseños y sus capturas llaman «Bot» a la sección, y usan textos como «Encargar al bot» o «Documentos del bot» | La sección se llama **Olimpo** (ADR-003). Todo texto «bot» de la interfaz se lee como «Olimpo». La carpeta de Drive `UMSS / {materia} / Olimpo` **conserva su nombre**, porque ya existe y el motor de agentes entrega ahí. Los nombres de archivo de origen (`Main.dc.html`, `BotMovil.dc.html`) no cambian |
| 9 | El lema del login dice «Bot de estudio, tareas, horario y malla en un solo lugar.» | Pasa a «Agentes de estudio, tareas, horario y malla en un solo lugar.» |
