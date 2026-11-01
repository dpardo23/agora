---
id: EP-01
titulo: Base y navegación
sprints: [SPRINT-00, SPRINT-01]
puntos_hu: 11
fecha_creacion: 2026-10-20
fecha_edicion: 2026-11-01
version: "1.2"
estado: Abierta
---

# EP-01 · Base y navegación

## Objetivo
Tener el entorno de desarrollo y el esqueleto de la PWA (proyecto, tokens, temas, layout y las 17 rutas), para que cada pantalla posterior solo agregue contenido.

## PBI de la épica

| PBI | Tipo | Título | Sprint | MoSCoW | Pts |
|---|---|---|---|---|---|
| T-14 | Chore | Redactar las guías de configuración del entorno y generarlas en PDF | SPRINT-00 | Must | 2 |
| T-13 | Chore | Crear las cuentas y los secretos de los servicios externos | SPRINT-00 | Must | 3 |
| T-11 | Historia técnica | Preparar el entorno local aislado con mise y el script de verificación | SPRINT-00 | Must | 3 |
| T-01 | Historia técnica | Crear el proyecto Next.js 16 con TypeScript estricto, Tailwind v4, tokens y fuentes | SPRINT-00 | Must | 5 |
| T-12 | Historia técnica | Levantar los servicios locales en Docker: Supabase, n8n y la imagen del worker | SPRINT-00 | Must | 5 |
| T-02 | Chore | Configurar CI en GitHub Actions y previews en Vercel | SPRINT-00 | Must | 3 |
| [HU-01.01](../historias/EP-01-base-y-navegacion/HU-01.01-navegar-entre-secciones.md) | Historia | Navegar entre las secciones de la plataforma | SPRINT-01 | Must | 5 |
| [HU-01.02](../historias/EP-01-base-y-navegacion/HU-01.02-alternar-tema-claro-oscuro.md) | Historia | Alternar entre el tema claro y el oscuro sin parpadeo | SPRINT-01 | Must | 3 |
| [HU-01.03](../historias/EP-01-base-y-navegacion/HU-01.03-adaptar-interfaz-al-dispositivo.md) | Historia | Usar la plataforma en móvil, tablet y escritorio | SPRINT-01 | Must | 3 |

## Criterio de cierre
Las 17 rutas navegan en ambos temas a 390, 834 y 1440 px, sin parpadeo de tema y con el ítem activo correcto.

## Referencias
- Diseño: `docs/diseno/sistema-de-diseno.md`
- Especificación: `docs/referencia/handoff/CONTEXTO.md`
- Backlog: `docs/producto/backlog.md`
