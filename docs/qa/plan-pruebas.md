# Plan de pruebas · Olympus

Versión 1.0 · creado el 2026-10-20 · editado el 2026-10-20

## 1. Objetivo
Verificar en cada sprint que el incremento cumple los criterios de aceptación de sus HU (CA-FE y CA-NF), con evidencia reproducible y trazable.

## 2. Alcance por nivel

| Nivel | Qué se prueba | Herramienta | Quién / cuándo |
|---|---|---|---|
| Unitario | Lógica pura: cálculo de notas, parser de tareas, zona horaria, máquina de estados de los dioses, FSRS | Vitest | Desarrollo, en cada commit |
| Componente | Kit `components/ui` y componentes de cada feature | Vitest + Testing Library | Desarrollo |
| Integración de datos | RLS, funciones SQL (`tomar_trabajo`, `riesgo_reclamo`), triggers | pgTAP o pruebas SQL con Supabase local | Al cambiar migraciones |
| E2E | Flujos de usuario de cada HU | Playwright (Chromium, WebKit, Firefox; 390, 834 y 1440 px) | CI en cada PR |
| Worker | Pipeline, adaptadores y contrato de eventos | pytest (`uv run pytest`) | CI en cambios de `worker/` |
| Accesibilidad | axe por ruta, teclado, lector de pantalla | `@axe-core/playwright` + revisión manual | CI y cierre de sprint |
| Rendimiento | Lighthouse, Core Web Vitals, fps de la oficina | `@lhci/cli`, traza de DevTools | Cierre de sprint |
| Seguridad | Auth, 2FA, RLS, XSS, secretos | Skill `security-and-hardening`, `/security-review` | HU de EP-03, EP-04 y EP-13 |
| Manual (TC) | Ejecución de los TC redactados | Este repositorio (`docs/qa/test-cases/`) | Fin de cada sprint |

## 3. Proceso por sprint

1. **Al iniciar el sprint**, redactar `TC-HU-XX.YY.md` para cada HU comprometida, con la plantilla `docs/plantillas/TC.md` y la skill `escribir-tc`.
2. Derivar los casos de cada CA: al menos uno positivo, y casos negativos o de límite cuando el CA tiene reglas (técnicas: partición de equivalencia, valores límite, tabla de decisión y transición de estados).
3. Marcar qué TC se automatizan (todos los de la ruta crítica y los de regresión).
4. **Ejecutar** al terminar cada HU y registrar el run en el propio TC.
5. Por cada falla, un **bug report** `docs/qa/bugs/BUG-NNN-slug.md` (skill `reportar-bug`), enlazado desde el TC y desde la matriz.
6. **Verificar** las correcciones y cerrar los bugs.
7. Actualizar `matriz-trazabilidad.md` y la sección de QA del archivo del sprint.

## 4. Criterios de entrada y salida

| | Criterio |
|---|---|
| Entrada a pruebas | La HU está en «En QA», la preview está desplegada, la semilla está aplicada y los TC están redactados |
| Salida del sprint | 100 % de los CA con al menos un TC ejecutado; 0 TC de prioridad Alta en «Falla»; 0 bugs Críticos o Altos abiertos |

## 5. Ambientes y datos

- **Local:** `pnpm dev` + Supabase CLI (buzón de correo Inbucket para los códigos de 2FA).
- **Preview:** Vercel por PR + proyecto Supabase de desarrollo.
- **Datos:** `supabase/seed.sql` (T-04). Usuario de QA `dpardo`. Los datos de ejemplo se identifican como tales y nunca se muestran en producción.

## 6. Severidad y prioridad de bugs

| Severidad | Significado |
|---|---|
| Crítica | Pérdida de datos, brecha de seguridad, la app no carga o no se puede iniciar sesión |
| Alta | Una funcionalidad Must no se puede usar y no hay alternativa |
| Media | Funciona con un rodeo, o el defecto está en una funcionalidad Should |
| Baja | Cosmético o de texto |

La prioridad (Urgente, Alta, Media, Baja) la asigna el Product Owner (el usuario) según el objetivo del sprint.

## 7. Riesgos de prueba

| Riesgo | Mitigación |
|---|---|
| Animaciones de la oficina difíciles de verificar | Máquina de estados probada con un reloj falso y capturas visuales de estados fijos |
| Correo real de 2FA | Inbucket en local; buzón de prueba en preview |
| Dependencia de servicios de Google | Contratos simulados en CI; pruebas reales solo al cerrar el sprint |
| Zona horaria | Pruebas en CI con `TZ=UTC` y aserciones en hora de La Paz |
