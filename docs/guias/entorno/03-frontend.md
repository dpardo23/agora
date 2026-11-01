# Guía 3 · Frontend (`apps/web`)

Versión 1.5 · creado el 2026-10-21 · editado el 2026-11-01 · autor: Juan Diego Pardo Pozo

Qué se instala en la aplicación web, para qué sirve cada librería y cómo se arranca y se prueba. La creación del proyecto es el ítem T-01 del SPRINT-00; esta guía documenta lo que T-01 deja instalado para que no haya que agregar herramientas sueltas después. Todas las versiones salen de la matriz de la guía 0 y se fijan exactas en `package.json` (sin `^`).

## 1. Requisitos previos

- Guía 1 terminada (mise activo).
- `mise.toml` autorizado (`mise trust`) y `mise install` ejecutado. Dentro de la carpeta: `node --version` es v24.22.2 y `pnpm --version` es 12.17.0.

## 2. Estructura

El repositorio es un *workspace* de pnpm. La raíz tiene `package.json` (scripts que delegan en la web y commitlint), `pnpm-workspace.yaml` y `pnpm-lock.yaml`; la aplicación vive en `apps/web/`:

```
apps/web/
  src/
    app/                rutas (App Router) y la API /api/v1
      api/v1/salud/     GET /api/v1/salud
      api/v1/openapi.json/  GET /api/v1/openapi.json (contrato generado)
      api/v1/[...ruta]/ 404 en problem+json para rutas que no existen
      globals.css       tokens de docs/diseno/sistema-de-diseno.md
    features/           un módulo por dominio (ADR-002); se crea con la primera HU
    components/ui/      componentes de shadcn/ui; se crea con HU-02.01
    shared/             utilidades sin dominio (lib/utils.ts, config/version.ts)
    server/             solo servidor: errores HTTP, OpenAPI, comprobaciones
  tests/unit/           preparación de Vitest
  tests/e2e/            pruebas de Playwright
  scripts/openapi.ts    genera y comprueba openapi.json
  openapi.json          contrato versionado de /api/v1
  components.json       configuración de shadcn
  lighthouserc.json     umbrales de Lighthouse (HU-16.04)
  .env.local            secretos locales (no se sube)
```

La configuración de pnpm va en `pnpm-workspace.yaml`, no en `.npmrc` (que está en `.gitignore` porque suele guardar tokens). Allí está también la lista `allowBuilds`: pnpm 12 no ejecuta scripts de instalación de ningún paquete salvo que se autoricen. Los que trae el proyecto (`@swc/core`, `esbuild`, `sharp`, `unrs-resolver`) se rechazan a propósito, porque usan binarios precompilados. Si `pnpm install` o `pnpm add` termina con `ERR_PNPM_IGNORED_BUILDS`, el paquete nuevo se agrega a esa lista con `true` o `false` según necesite o no su script.

### 2.1. Reglas de arquitectura que vigila el lint

`eslint-plugin-boundaries` (regla `boundaries/dependencies`) falla el lint si:

1. Un dominio importa el interior de otro: desde `src/features/tareas/` solo se puede importar `@/features/materias` (su `index.ts`), nunca `@/features/materias/infra/…`.
2. `src/shared/` o `src/components/` importan un dominio, `src/server/` o `src/app/`.
3. Un dominio o `src/server/` importan algo de `src/app/`.

Además, los módulos de `src/server/` que no deben llegar al navegador empiezan con `import "server-only";`: si un componente de cliente los importa, el build falla.

## 3. Qué se instala y para qué

### 3.1. Dependencias de la aplicación

| Paquete | Para qué |
|---|---|
| `next`, `react`, `react-dom` | Framework, servidor y renderizado |
| `tailwindcss`, `@tailwindcss/turbopack` | Estilos con los tokens de `docs/diseno/sistema-de-diseno.md`. Next 16 compila el CSS con Turbopack, sin PostCSS |
| `shadcn`, `radix-ui`, `cn`, `class-variance-authority`, `tw-animate-css` | Base del kit de componentes (estilo `radix-nova`). Los componentes se agregan con la CLI cuando una HU los necesita |
| `lucide-react` | Iconos (la interfaz no usa emoji) |
| `@tanstack/react-query` | Datos del servidor en el cliente, caché y reintentos |
| `react-hook-form`, `@hookform/resolvers`, `zod` | Formularios con validación compartida entre cliente y API |
| `@asteasolutions/zod-to-openapi` | Contrato OpenAPI de `/api/v1` generado desde Zod |
| `@supabase/supabase-js`, `@supabase/ssr` | Cliente de Supabase con sesión en cookies |
| `@serwist/turbopack`, `serwist` | Service worker de la PWA (variante para Turbopack) |
| `date-fns`, `@date-fns/tz` | Fechas en `America/La_Paz` |
| `ts-fsrs` | Algoritmo de repaso espaciado |
| `server-only` | Impide que el código de `src/server/` llegue al navegador |

### 3.2. Herramientas de desarrollo

| Paquete | Para qué |
|---|---|
| `typescript` 6.0 | Tipado estricto, con `noUncheckedIndexedAccess` (TypeScript 7 todavía no es compatible con el lint de Next) |
| `eslint` 9, `eslint-config-next`, `eslint-plugin-boundaries` | Lint; `boundaries` hace cumplir la sección 2.1 |
| `prettier`, `prettier-plugin-tailwindcss` | Formato y orden de clases |
| `vitest`, `@vitest/coverage-v8`, `@vitejs/plugin-react`, `jsdom` | Pruebas unitarias y de componentes, con cobertura |
| `@testing-library/react`, `@testing-library/dom`, `@testing-library/user-event`, `@testing-library/jest-dom` | Probar componentes como los usa una persona |
| `@playwright/test`, `@axe-core/playwright` | Pruebas E2E y de accesibilidad |
| `@lhci/cli` | Lighthouse en el CI |
| `tsx` | Ejecuta `apps/web/scripts/openapi.ts` |
| `@commitlint/cli`, `@commitlint/config-conventional` (en la raíz) | Revisar los mensajes de commit; los llama el hook `.githooks/commit-msg`. No se instala Husky, porque reemplazaría los hooks del proyecto |

## 4. Cómo se creó (registro de T-01)

Estos son los pasos que siguió T-01, para que quede registro de cómo nació el proyecto. No hace falta repetirlos: en un clon nuevo basta con `pnpm install` (sección 6).

**Paso 1.** Generar la plantilla oficial en una carpeta temporal, para revisar qué crea antes de traerla al repositorio:

```sh
pnpm dlx create-next-app@16.4.3 /tmp/web --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm --skip-install --disable-git --no-react-compiler --no-agents-md --yes
```

**Paso 2.** Copiar a `apps/web/` solo `next.config.ts`, `tsconfig.json`, `eslint.config.mjs` y `src/app/`. No se traen el `.gitignore` de la plantilla (ignora `.env*` y ocultaría `apps/web/.env.example`), su `pnpm-workspace.yaml`, su README ni las imágenes de ejemplo.

**Paso 3.** Crear `package.json` y `pnpm-workspace.yaml` en la raíz e instalar las dependencias de la sección 3 con `pnpm add -C apps/web --save-exact <paquete>@<versión de la guía 0>`. TypeScript y ESLint siempre con versión: la última publicada (7.x y 10.x) no es compatible.

**Paso 4.** Iniciar shadcn sin componentes:

```sh
pnpm -C apps/web dlx shadcn@4.23.0 init -b radix -t next -p nova --no-monorepo --no-rtl --no-pointer -y
```

Después se borra el `button.tsx` de ejemplo (el kit empieza en HU-02.01), se mueve `src/lib/utils.ts` a `src/shared/lib/utils.ts` y se ajustan los alias de `components.json`. Las variables de shadcn (`--background`, `--primary`, …) se reescriben para que apunten a los tokens de Ágora: hay una sola paleta.

**Paso 5.** Escribir los tokens, las fuentes, la API mínima, la configuración de pruebas y el hook de commits (secciones 5 a 8).

## 5. Diseño: tokens, tema y fuentes

- `src/app/globals.css` declara los tokens de `docs/diseno/sistema-de-diseno.md` (sección 2) para el tema claro y el oscuro, y los expone a Tailwind: `bg-bg2`, `text-tx2`, `bg-rosa`, `font-display`, `shadow-popover`, etc. No se escriben colores hexadecimales en los componentes.
- El tema sigue al sistema operativo. El atributo `data-tema="claro"` o `data-tema="oscuro"` en `<html>` lo fuerza; lo usarán HU-01.02 y HU-04.01. La variante `dark:` de Tailwind respeta ambos casos.
- Las cuatro fuentes se cargan con `next/font` en `src/app/layout.tsx`: Geist (texto), Geist Mono (cifras y códigos), Bricolage Grotesque (títulos, como fuente variable con el eje `opsz`) y Pixelify Sans (solo la oficina, sin precarga).
- El `<html>` lleva `lang="es-BO"`. Las clases `.d`, `.lbl`, `.cap` y `.m` son las de la sección 3 de `sistema-de-diseno.md`.
- `prefers-reduced-motion: reduce` apaga animaciones y transiciones.

`next.config.ts` mantiene `cacheComponents` y `partialPrefetching`, que la plantilla de Next 16 trae activos: las páginas se generan en cada petición salvo lo que se marque con `"use cache"`. Por eso `/api/v1/salud` llama a `connection()` antes de comprobar Supabase.

## 6. Variables de entorno

`apps/web/.env.local` (no se sube; los nombres están en `apps/web/.env.example`):

```sh
NEXT_PUBLIC_SUPABASE_URL=http://localhost:55321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<la que muestra «supabase status»>
SUPABASE_SECRET_KEY=<la que muestra «supabase status»>
```

En local se usan las claves de Supabase local; las de la nube solo van en Vercel. Sin este archivo la web arranca igual y `/api/v1/salud` responde `"supabase": "sin_configurar"`: así compila el CI.

## 7. API mínima

| Ruta | Respuesta |
|---|---|
| `GET /api/v1/salud` | 200 con `{ "estado": "ok", "version": "0.1.0", "supabase": "ok" \| "sin_configurar" \| "error" }`. Se calcula en cada petición y no muestra detalles del error |
| `GET /api/v1/openapi.json` | El contrato OpenAPI 3.1 generado desde los esquemas Zod |
| Cualquier otra ruta de `/api/v1` | 404 en `application/problem+json` con `codigo: "RUTA_NO_ENCONTRADA"` |

Los errores siguen RFC 9457 (`docs/arquitectura/api.md`, sección 1) con el ayudante `src/server/http/problema.ts`. Cada ruta nueva registra su contrato en `src/server/openapi/documento.ts`. Los esquemas del contrato importan `z` desde `@/server/openapi/zod`, no desde `zod`: en Zod 4, `.openapi()` solo existe en los esquemas creados después de extender Zod.

Cuando cambia el contrato:

```sh
pnpm -C apps/web openapi:generar
```

Y se sube el `apps/web/openapi.json` actualizado junto con el cambio. `pnpm openapi:check` (también en el CI) falla si alguien cambió la API sin regenerarlo.

## 8. Pruebas

| Tipo | Dónde | Cómo se corre |
|---|---|---|
| Unitarias y de componentes | `src/**/*.test.ts(x)` | `pnpm test:unit` (con `--coverage` en el CI) |
| E2E y accesibilidad | `tests/e2e/*.spec.ts` | `pnpm test:e2e`: levanta la web sola en el puerto 3100 y prueba en Chromium, Firefox y WebKit |
| Lighthouse | `apps/web/lighthouserc.json` | En el CI, en los PR hacia `main`. Umbral de 0,9 en Rendimiento, Accesibilidad y Buenas prácticas en móvil, LCP ≤ 2,5 s y CLS ≤ 0,1 |

Lighthouse 12 ya no tiene la categoría PWA. La instalabilidad y el service worker se comprueban con las pruebas de HU-16.01 y HU-16.04.

### 8.1. Navegadores de Playwright en CachyOS

Playwright solo publica navegadores para Debian y Ubuntu, y su opción `--with-deps` usa `apt`. En CachyOS se descargan sin dependencias:

```sh
pnpm -C apps/web exec playwright install chromium firefox webkit
```

Chromium y Firefox funcionan así. Si WebKit no arranca por librerías del sistema que faltan, las pruebas se corren dentro de la imagen oficial de Playwright, con la web en tu equipo:

```sh
pnpm -C apps/web dev
docker run --rm --network host --ipc host --user "$(id -u):$(id -g)" -e HOME=/tmp \
  -v "$PWD":/repo -w /repo/apps/web mcr.microsoft.com/playwright:v1.64.1-noble \
  npx playwright test --project=webkit
```

- `--user` y `HOME=/tmp` hacen que el contenedor escriba `test-results/` con tu usuario y no como root. Sin ellos, la siguiente ejecución local de Playwright no puede borrar esa carpeta.
- La imagen pesa unos 2 GB: la primera descarga tarda varios minutos.
- Resultado esperado: 3 pruebas pasan y 6 se omiten. Las de accesibilidad y contrato solo corren en Chromium, a propósito (guía 6, sección 4.2).
- Comprobado el 2026-11-01 con la imagen `v1.64.1-noble`.

El CI usa Ubuntu, así que allí corren los tres navegadores sin pasos extra.

## 9. Uso diario

| Comando (desde la raíz) | Qué hace |
|---|---|
| `pnpm install` | Instala exactamente lo de `pnpm-lock.yaml` |
| `pnpm dev` | Servidor de desarrollo en http://localhost:3100 |
| `pnpm lint` | ESLint, sin advertencias permitidas |
| `pnpm typecheck` | Genera los tipos de las rutas y comprueba los tipos |
| `pnpm test:unit` | Vitest |
| `pnpm test:e2e` | Playwright (levanta la web sola) |
| `pnpm build` | Compilación de producción, como en Vercel |
| `pnpm openapi:check` | Falla si el contrato de la API cambió sin regenerarse |
| `pnpm format` | Aplica Prettier en `apps/web` |
| `pnpm outdated -r` | Lista lo que tiene versión nueva (no actualiza nada) |

Los mismos scripts existen dentro de `apps/web/`; el CI los corre desde esa carpeta.

Para agregar una librería: `pnpm -C apps/web add --save-exact <paquete>@<versión>`. Antes, comprueba su licencia (.github/CONTRIBUTING.md, sección 6), su compatibilidad con la matriz de la guía 0 y agrégala a esa matriz.

## 10. Comprobación

- [ ] `pnpm install` termina sin errores ni advertencias de *peer dependencies*.
- [ ] `pnpm dev` abre http://localhost:3100.
- [ ] `curl -s http://localhost:3100/api/v1/salud` responde con estado 200.
- [ ] `pnpm lint && pnpm typecheck && pnpm test:unit && pnpm build && pnpm openapi:check` pasan.
- [ ] `pnpm test:e2e` pasa en Chromium, Firefox y WebKit (WebKit con Docker si hace falta, sección 8.1).
- [ ] Un commit con un mensaje que no sigue Conventional Commits es rechazado por `.githooks/commit-msg`.
