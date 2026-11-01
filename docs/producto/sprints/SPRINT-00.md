---
id: SPRINT-00
nombre: "Organización y entorno (H0, parte 1)"
hito: H0
estado: En curso
puntos_comprometidos: 21
fecha_creacion: 2026-10-21
fecha_edicion: 2026-10-21
---

# SPRINT-00 · Organización y entorno (H0, parte 1)

## Objetivo del sprint
Dejar listo todo lo que el desarrollo necesita antes de la primera HU: desde un clon limpio, un solo comando levanta la web, Supabase, n8n y el worker en local, aislados del resto del equipo; el CI pasa en verde, existe una preview en Vercel y todas las cuentas y secretos de los servicios externos están creados.

Es un sprint de infraestructura: no tiene HU ni test cases. Su verificación es el script `scripts/verificar-entorno.sh` y las listas de comprobación de las guías de `docs/guias/entorno/`.

## Sprint backlog

| PBI | Tipo | Título | Épica | MoSCoW | Pts | Estado |
|---|---|---|---|---|---|---|
| T-14 | Chore | Redactar las guías de configuración del entorno y generarlas en PDF | EP-01 | Must | 2 | En curso |
| T-13 | Chore | Crear las cuentas y los secretos de los servicios externos | EP-01 | Must | 3 | Borrador |
| T-11 | Historia técnica | Preparar el entorno local aislado con mise y el script de verificación | EP-01 | Must | 3 | Borrador |
| T-01 | Historia técnica | Crear el proyecto Next.js 16 con TypeScript estricto, Tailwind v4, tokens y fuentes | EP-01 | Must | 5 | Borrador |
| T-12 | Historia técnica | Levantar los servicios locales en Docker: Supabase, n8n y la imagen del worker | EP-01 | Must | 5 | Borrador |
| T-02 | Chore | Configurar CI en GitHub Actions y previews en Vercel | EP-01 | Must | 3 | Borrador |

**Total comprometido:** 21 puntos. El orden de la tabla es el orden de trabajo: primero las guías, después lo manual (cuentas y secretos), luego el entorno, el proyecto web, los servicios y por último el CI.

## Incremento esperado
Al cerrar el sprint se demuestra, en local y en la preview de Vercel:

1. `mise install` instala las versiones fijadas de Node, pnpm, Python, uv y la CLI de Supabase solo dentro de la carpeta del proyecto.
2. `scripts/verificar-entorno.sh` termina sin errores: versiones correctas, Docker activo, puertos del bloque de Ágora libres o en uso por Ágora, secretos presentes.
3. Un comando levanta todo: la web en `http://localhost:3100`, Supabase (API en el puerto 55321 y Studio en el 55323), n8n en el 55678 y la imagen del worker construida.
4. `GET /api/v1/salud` responde 200 en local y en la preview.
5. Un PR de prueba muestra todos los checks del CI en verde, incluido «Rutas privadas».

## Flujo de trabajo del sprint
1. **Planning:** confirmar el alcance de cada ítem técnico (sección 3 del backlog) y la matriz de versiones de la guía 0.
2. **Guías (T-14):** redactar `docs/guias/entorno/` y generar los PDF.
3. **Trabajo manual del titular (T-13):** seguir las guías 1 y 2; marcar cada paso en sus listas de comprobación.
4. **Desarrollo (T-11, T-01, T-12, T-02):** una rama `tech/T-NN-slug` por ítem, con commits en Conventional Commits.
5. **Verificación:** ejecutar `scripts/verificar-entorno.sh` desde un clon limpio y registrar el resultado en la review.
6. **Defectos:** un `docs/qa/bugs/BUG-NNN-*.md` por defecto del entorno (skill `reportar-bug`).
7. **Review y retrospectiva** en este archivo.

## Test cases del sprint
No aplica: el sprint no tiene HU. Cada ítem técnico se cierra con su criterio de la sección 3 del backlog.

## Bugs del sprint

| Bug | Título | Severidad | Prioridad | PBI | Estado |
|---|---|---|---|---|---|
| | | | | | |

## Definition of Done del sprint
- [ ] Todos los ítems técnicos comprometidos están en estado «Hecha».
- [ ] `scripts/verificar-entorno.sh` pasa desde un clon limpio.
- [ ] Las listas de comprobación de las guías 1 y 2 están completas.
- [ ] Ningún archivo privado está versionado (paso «Rutas privadas» del CI en verde).
- [ ] CI en verde en `develop`; preview desplegada.
- [ ] Backlog y este archivo actualizados.

## Review
_(se completa al cerrar el sprint: qué se demostró y qué feedback hubo)_

## Retrospectiva
| Qué funcionó | Qué mejorar | Acción para el próximo sprint |
|---|---|---|
| | | |
