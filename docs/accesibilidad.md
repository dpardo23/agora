# Accesibilidad · Olympus

Versión 1.0 · creado el 2026-10-20 · editado el 2026-10-20 · autor: Juan Diego Pardo Pozo

## 1. Norma de referencia

- **Norma:** WCAG 2.2, la Recomendación vigente del W3C (publicada el 5 de octubre de 2023 y actualizada el 12 de diciembre de 2024). Es la última versión con validez normativa.
- **Nivel objetivo:** **AA** en todas las pantallas, además de un grupo de criterios AAA adoptados (sección 4).
- **WCAG 3.0** sigue siendo un borrador de trabajo (*Working Draft*) en 2026. No se usa como criterio de aceptación, pero se revisa al cerrar cada épica por si conviene adelantar algo.
- **Verificación:** axe (`@axe-core/playwright`) en CI, Lighthouse, pruebas con teclado y con lectores de pantalla (NVDA en Windows, TalkBack en Android, VoiceOver en iOS).

## 2. Principios y criterios aplicables (A y AA)

| Criterio | Nivel | Cómo se cumple en Olympus | Dónde se verifica |
|---|---|---|---|
| 1.1.1 Contenido no textual | A | Iconos con `aria-label` o `aria-hidden`; canvas de la oficina con `role="img"` + lista equivalente de dioses | HU-05.04, HU-02.01 |
| 1.2.x Multimedia | A/AA | No hay audio ni video; el sonido del pomodoro va acompañado de una notificación visual | HU-14.03 |
| 1.3.1 Información y relaciones | A | Landmarks (`nav`, `main`), encabezados en orden, tablas con `th`, etiquetas asociadas | Todas |
| 1.3.2 Secuencia significativa · 1.3.3 Características sensoriales | A | El orden del DOM sigue el visual; las instrucciones no dependen de forma ni color | Todas |
| 1.3.4 Orientación · 1.3.5 Propósito de la entrada | AA | Vertical y horizontal; `autocomplete` en usuario, contraseña y código | HU-01.03, HU-03.01 |
| 1.4.1 Uso del color | A | Estados con texto, patrón o icono (malla, horario, pipeline, vencidas) | HU-10.01, HU-11.03, HU-06.02 |
| 1.4.3 Contraste (mínimo) | AA | Texto ≥ 4,5:1 (≥ 3:1 si es grande); texto sobre pastel siempre `#0B0B0B` | HU-01.02 |
| 1.4.4 Cambio de tamaño del texto · 1.4.10 Reflujo | AA | Sin pérdida al 200 %; sin scroll horizontal a 320 px | HU-01.03 |
| 1.4.11 Contraste de componentes | AA | Bordes de campos, foco e iconos ≥ 3:1 | HU-02.02 |
| 1.4.12 Espaciado del texto · 1.4.13 Contenido al pasar el puntero o enfocar | AA | Tooltips descartables con Esc, persistentes al pasar el puntero | HU-02.05 |
| 2.1.1 Teclado · 2.1.2 Sin trampas · 2.1.4 Atajos de una tecla | A | Todo operable con teclado; los atajos de una tecla (Espacio y 1 a 4 en Repaso) solo actúan con el foco en la sesión | Todas, HU-14.01 |
| 2.2.1 Tiempo ajustable · 2.2.2 Pausar, detener, ocultar | A | Toasts pausables; la animación de la oficina se puede pausar (botón «Pausar animación») | HU-02.05, HU-05.02 |
| 2.3.1 Tres destellos | A | Fuego y rayo de la escena ≤ 3 destellos por segundo | HU-05.02 |
| 2.4.1 Saltar bloques · 2.4.2 Título de página · 2.4.3 Orden del foco | A | Enlace «Saltar al contenido»; `<title>` por ruta | HU-01.01 |
| 2.4.6 Encabezados y etiquetas · 2.4.7 Foco visible | AA | Anillo de foco de 2 px separado del control | HU-02.01 |
| **2.4.11 Foco no oculto (mínimo)** · nuevo en 2.2 | AA | Barra inferior y toasts nunca tapan el elemento con foco (`scroll-padding`) | HU-01.03, HU-02.05 |
| 2.5.1 Gestos con el puntero · 2.5.2 Cancelación del puntero · 2.5.3 Etiqueta en el nombre · 2.5.4 Activación por movimiento | A | Sin gestos multipunto obligatorios; el nombre accesible contiene el texto visible | Todas |
| **2.5.7 Movimientos de arrastre** · nuevo en 2.2 | AA | Todo arrastre tiene alternativa: reordenar esquema con teclado o botones, Dropzone con «Elegir archivos», hoja inferior con «×» | HU-06.04, HU-02.07, HU-02.06 |
| **2.5.8 Tamaño del objetivo (mínimo)** · nuevo en 2.2 | AA | ≥ 24×24 px siempre; ≥ 44×44 px en móvil (criterio propio, más exigente) | HU-02.01, HU-01.01 |
| 3.1.1 Idioma de la página | A | `lang="es-BO"` | HU-01.01 |
| 3.2.1 Al recibir el foco · 3.2.2 Al introducir datos · 3.2.3 Navegación coherente · 3.2.4 Identificación coherente | A/AA | Sin cambios de contexto inesperados; la misma navegación en todas las rutas | Todas |
| **3.2.6 Ayuda coherente** · nuevo en 2.2 | A | «¿Olvidaste la contraseña?» y la ayuda de cada formulario siempre en el mismo lugar | HU-03.01 |
| 3.3.1 Identificación de errores · 3.3.2 Etiquetas · 3.3.3 Sugerencias · 3.3.4 Prevención de errores | A/AA | Errores en texto, asociados al campo, con la regla concreta; confirmación en acciones destructivas | HU-02.02, HU-09.05 |
| **3.3.7 Entrada redundante** · nuevo en 2.2 | A | No se piden dos veces datos ya ingresados en el mismo proceso (recuperar contraseña, alta de materia) | HU-03.04, HU-09.01 |
| **3.3.8 Autenticación accesible (mínimo)** · nuevo en 2.2 | AA | Se puede pegar en todos los campos; compatible con gestores de contraseñas (`autocomplete`); el código 2FA admite pegado y `one-time-code` | HU-03.01, HU-03.02 |
| 4.1.2 Nombre, función y valor · 4.1.3 Mensajes de estado | A/AA | Componentes Radix con ARIA; toasts y registro en vivo con `role="status"`/`log` | HU-02.03, HU-06.03 |

El criterio 4.1.1 (Procesamiento) fue retirado en WCAG 2.2 y no se evalúa.

## 3. Movimiento en la Oficina del Olimpo

Los dioses siempre están en movimiento (ADR-003). Con `prefers-reduced-motion: reduce` se aplica la **opción C**:

- Siguen caminando entre estaciones, a la **mitad de la velocidad**.
- Se eliminan los gestos periódicos, los destellos de fuego y rayo, los brillos y el rebote de la flecha de selección.
- Además, la oficina tiene siempre un botón **«Pausar animación»** (criterio 2.2.2), independiente de la preferencia del sistema.

## 4. Criterios AAA adoptados

| Criterio | Motivo |
|---|---|
| 2.3.3 Animación por interacción (parcial, opción C) | La oficina es una animación continua |
| 2.4.13 Apariencia del foco | Anillo de foco de 2 px con contraste ≥ 3:1 en ambos temas |
| 2.5.5 Tamaño del objetivo (mejorado) en móvil | Objetivos de 44×44 px en pantallas táctiles |

## 5. Definition of Done de accesibilidad (toda HU con interfaz)

- [ ] axe sin violaciones *serious* ni *critical* en ambos temas y a 390, 834 y 1440 px.
- [ ] Recorrido completo con teclado, con foco visible y no oculto.
- [ ] Nombres accesibles revisados con un lector de pantalla en los flujos de la HU.
- [ ] Ningún arrastre sin alternativa y ningún objetivo menor de 24×24 px.
- [ ] Movimiento revisado con `prefers-reduced-motion`.
