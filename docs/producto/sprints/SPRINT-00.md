---
id: SPRINT-00
nombre: "Organización y entorno (H0, parte 1)"
hito: H0
estado: Cerrado
puntos_comprometidos: 21
puntos_completados: 18
fecha_creacion: 2026-10-21
fecha_edicion: 2026-11-01
---

# SPRINT-00 · Organización y entorno (H0, parte 1)

## Objetivo del sprint
Dejar listo todo lo que el desarrollo necesita antes de la primera HU: desde un clon limpio, un solo comando levanta la web, Supabase, n8n y el worker en local, aislados del resto del equipo; el CI pasa en verde, existe una preview en Vercel y todas las cuentas y secretos de los servicios externos están creados.

Es un sprint de infraestructura: no tiene HU ni test cases. Su verificación es el script `scripts/verificar-entorno.sh` y las listas de comprobación de las guías de `docs/guias/entorno/`.

## Sprint backlog

| PBI | Tipo | Título | Épica | MoSCoW | Pts | Estado |
|---|---|---|---|---|---|---|
| T-14 | Chore | Redactar las guías de configuración del entorno y generarlas en PDF | EP-01 | Must | 2 | Hecha |
| T-13 | Chore | Crear las cuentas y los secretos de los servicios externos | EP-01 | Must | 3 | En curso (pasa a SPRINT-01) |
| T-11 | Historia técnica | Preparar el entorno local aislado con mise y el script de verificación | EP-01 | Must | 3 | Hecha |
| T-01 | Historia técnica | Crear el proyecto Next.js 16 con TypeScript estricto, Tailwind v4, tokens y fuentes | EP-01 | Must | 5 | Hecha |
| T-12 | Historia técnica | Levantar los servicios locales en Docker: Supabase, n8n y la imagen del worker | EP-01 | Must | 5 | Hecha |
| T-02 | Chore | Configurar CI en GitHub Actions y previews en Vercel | EP-01 | Must | 3 | Hecha |

**Total comprometido:** 21 puntos. **Completado:** 18 puntos; T-13 pasa a SPRINT-01 (ver la review). El orden de la tabla es el orden de trabajo: primero las guías, después lo manual (cuentas y secretos), luego el entorno, el proyecto web, los servicios y por último el CI.

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
| — | Sin bugs registrados: los defectos del entorno se corrigieron dentro del mismo PBI antes de cerrarlo (ver la review) | | | | |

## Definition of Done del sprint
- [ ] Todos los ítems técnicos comprometidos están en estado «Hecha». **No:** T-13 queda en curso y pasa a SPRINT-01.
- [x] `scripts/verificar-entorno.sh` pasa desde un clon limpio (los avisos que quedan son los `.env.local`, que se crean por equipo).
- [ ] Las listas de comprobación de las guías 1 y 2 están completas. **Parcial:** en la guía 2 faltan la VM de Oracle y el token de Claude.
- [x] Ningún archivo privado está versionado (paso «Rutas privadas» del CI en verde).
- [x] CI en verde en `develop`; preview desplegada.
- [x] Backlog y este archivo actualizados.

## Review

Cerrado el 2026-11-01 con 18 de 21 puntos. Se trabajó en ocho PR hacia `develop`, cada uno con el CI en verde y fusionado por el titular: #7 (orden del repositorio), #8 (ajustes del CI), #9 (T-11), #10 (T-01), #11 (T-12), #12 (Supabase solo en 127.0.0.1), #13 (barreras de calidad) y #14 (T-02).

**Qué se demostró**
1. **Clon limpio:** `mise install` deja Node 24.22.2, pnpm 12.17.0, Python 3.14, uv 0.13.6 y la CLI de Supabase 2.122.0 solo en la carpeta del proyecto. `pnpm install` y `scripts/verificar-entorno.sh` terminan sin fallas con Docker en marcha. Sin `pnpm install`, el hook `pre-push` avisa y deja pasar.
2. **Servicios locales:** `mise run arriba` levanta Supabase (puertos 55320 a 55329, publicados solo en 127.0.0.1) y n8n 2.45.7. La imagen del worker compila el `.tex` de prueba en amd64 (local) y en arm64 (runner nativo del CI).
3. **Web:** Next.js 16.4.3 con los tokens de `sistema-de-diseno.md`, `/api/v1/salud` y el contrato OpenAPI generado desde Zod.
4. **Vercel:** el proyecto `agora` despliega `main` a producción y cada rama a una preview protegida. La preview de `develop` responde `GET /api/v1/salud` con `{"estado":"ok","supabase":"ok"}` contra agora-dev. Producción responde 200 con `"supabase":"sin_configurar"`, porque el proyecto de producción todavía no existe. El build usa pnpm 12.17.0 por Corepack y las funciones corren en São Paulo (`gru1`).
5. **CI y calidad:** 12 jobs resumidos en `ci-ok`: convenciones, seguridad (gitleaks, `pnpm audit`, revisión de dependencias y licencias), workflows (actionlint y zizmor), documentación, web con cobertura mínima de 80 %, E2E en tres navegadores con axe en todas las rutas, contrato, Bruno, Lighthouse, base de datos con pgTAP, worker e imagen del worker. CodeQL está activo y sin alertas.
6. **GitHub:** rulesets de `main`, `develop` y de las etiquetas `v*`; acciones restringidas a una lista y fijadas por hash; environment `staging` limitado a `develop` y `produccion` con aprobación obligatoria. El CD aplica las migraciones en agora-dev en cada merge a `develop`.

**Qué no se terminó**
- **T-13:** faltan la VM ARM de Oracle (sin cupo en la región; se reintenta dentro del Free Tier) y el token de Claude para el worker. Ninguno bloquea a SPRINT-01: el worker se incorpora en SPRINT-07. T-13 pasa a SPRINT-01 solo con esos dos pendientes.

**Defectos encontrados y corregidos dentro del sprint**
- Supabase local publicaba sus puertos en `0.0.0.0`, y Docker se salta el firewall. Se corrigió en #12 con una red propia ligada a 127.0.0.1 (`mise run arriba`).
- `pnpm audit` detectó GHSA-mrhx-c7xc-m3w5 en zod 4.6.5, que trae una dependencia transitiva. Se fijó zod 4.6.7 con un `override`.
- Licencias: se aceptó la LGPL de `sharp-libvips` (ADR-007) y se documentó un falso GPL de GitHub en `typing-extensions`.

**Pendientes conocidos para próximos sprints**
- Vulnerabilidades moderadas y bajas sin parche compatible (minimatch, glob y deepmerge, que traen shadcn y serwist). Dependabot avisará cuando haya parche.
- Node 26 es LTS desde el 2026-10-28. Se evalúa la migración en la planning de SPRINT-01 (guía 0).
- Secretos del environment `produccion` y proyecto de Supabase de producción, antes de la primera release.

## Retrospectiva

| Qué funcionó | Qué mejorar | Acción para el próximo sprint |
|---|---|---|
| Un PR por paso, con el CI en verde antes de cada merge, permitió revisar cada cambio por separado | Algunos pasos manuales se descubrieron sobre la marcha (carpeta `/etc/docker`, ejecutar mise desde la carpeta del proyecto, entrada faltante en Bitwarden) | Antes de pedir un paso manual, probarlo en limpio y dejar el comando exacto en la guía |
| Las versiones salen de una sola fuente (`mise.toml`) para el equipo y el CI | La exposición de Supabase en `0.0.0.0` se detectó tarde, después de fusionar T-12 | Agregar al verificador cualquier puerto nuevo que publique un servicio, y revisar con `ss -tlnp` al levantar algo nuevo |
| Las barreras locales (`pre-push`) atrapan los errores antes de llegar a GitHub | La configuración de Vercel no se puede versionar y depende de pasos en el panel | Repasar la guía 2, sección 9, si se recrea el proyecto, y comprobar la preview en el primer PR de cada sprint |
