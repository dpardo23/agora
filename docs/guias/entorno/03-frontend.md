# Guía 3 · Frontend (`apps/web`)

Versión 1.1 · creado el 2026-10-21 · editado el 2026-10-31 · autor: Juan Diego Pardo Pozo

Qué se instala en la aplicación web, para qué sirve cada librería y cómo se arranca y se prueba. La creación del proyecto es el ítem T-01 del SPRINT-00; esta guía documenta lo que T-01 deja instalado para que no haya que agregar herramientas sueltas después. Todas las versiones salen de la matriz de la guía 0.

## 1. Requisitos previos

- Guía 1 terminada (mise activo).
- `mise.toml` creado (T-11) y `mise install` ejecutado. Dentro de la carpeta: `node --version` es v24.22.2 y `pnpm --version` es 12.17.0.

## 2. Estructura

El repositorio es un *workspace* de pnpm. La raíz tiene `package.json` (scripts que usa el CI), `pnpm-workspace.yaml` y `pnpm-lock.yaml`; la aplicación vive en `apps/web/`:

```
apps/web/
  src/
    app/            rutas (App Router) y la API /api/v1
    features/       un módulo por dominio (ADR-002)
    components/ui/  componentes de shadcn/ui
    shared/         utilidades sin dominio
    server/         clientes de servidor (secret key), correo, firmas
  public/
  .env.local        secretos locales (no se sube)
```

La configuración de pnpm va en `pnpm-workspace.yaml`, no en `.npmrc` (que está en `.gitignore` porque suele guardar tokens).

## 3. Qué se instala y para qué

### 3.1. Dependencias de la aplicación

| Paquete | Para qué |
|---|---|
| `next`, `react`, `react-dom` | Framework, servidor y renderizado |
| `tailwindcss`, `@tailwindcss/postcss` | Estilos con los tokens de `docs/design.md` |
| `shadcn` (CLI) y los componentes que copia | Botones, campos, diálogos, menús (Radix) |
| `lucide-react` | Iconos (la interfaz no usa emoji) |
| `@tanstack/react-query` | Datos del servidor en el cliente, caché y reintentos |
| `react-hook-form`, `@hookform/resolvers`, `zod` | Formularios con validación compartida entre cliente y API |
| `@asteasolutions/zod-to-openapi` | Contrato OpenAPI de `/api/v1` generado desde Zod |
| `@supabase/supabase-js`, `@supabase/ssr` | Cliente de Supabase con sesión en cookies |
| `@serwist/turbopack`, `serwist` | Service worker de la PWA (variante para Turbopack) |
| `date-fns`, `@date-fns/tz` | Fechas en `America/La_Paz` |
| `ts-fsrs` | Algoritmo de repaso espaciado |

### 3.2. Herramientas de desarrollo

| Paquete | Para qué |
|---|---|
| `typescript` 6.0 | Tipado estricto (TypeScript 7 todavía no es compatible con el lint de Next) |
| `eslint` 9, `eslint-config-next`, `eslint-plugin-boundaries` | Lint; `boundaries` impide que un módulo importe el interior de otro |
| `prettier`, `prettier-plugin-tailwindcss` | Formato y orden de clases |
| `vitest`, `@vitejs/plugin-react`, `jsdom` | Pruebas unitarias y de componentes |
| `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom` | Probar componentes como los usa una persona |
| `@playwright/test`, `@axe-core/playwright` | Pruebas E2E y de accesibilidad |
| `@lhci/cli` | Lighthouse en el CI |
| `@commitlint/cli`, `@commitlint/config-conventional` | Revisar los mensajes de commit; los llama el hook `.githooks/commit-msg`. No se instala Husky, porque reemplazaría los hooks del proyecto |

## 4. Cómo se crea (referencia de T-01)

Estos son los comandos que ejecuta T-01, para que quede registro de cómo nació el proyecto:

```sh
cd ~/Documentos/agora
pnpm create next-app@16.4.2 apps/web --ts --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --use-pnpm --skip-install
pnpm -C apps/web add react@19.3.1 react-dom@19.3.1 @tanstack/react-query zod \
  react-hook-form @hookform/resolvers @asteasolutions/zod-to-openapi \
  @supabase/supabase-js @supabase/ssr serwist @serwist/turbopack \
  date-fns @date-fns/tz ts-fsrs lucide-react
pnpm -C apps/web add -D typescript@6.0.3 eslint@9.39.5 eslint-plugin-boundaries \
  prettier prettier-plugin-tailwindcss vitest @vitejs/plugin-react jsdom \
  @testing-library/react @testing-library/user-event @testing-library/jest-dom \
  @playwright/test @axe-core/playwright @lhci/cli
pnpm add -Dw @commitlint/cli @commitlint/config-conventional
pnpm -C apps/web dlx shadcn@4.22.1 init
pnpm -C apps/web exec playwright install chromium firefox webkit
```

Después se fijan en `package.json`: `"engines": { "node": "24.x" }` y `"packageManager": "pnpm@12.17.0"`, y el script de desarrollo usa el puerto de Ágora: `next dev --port 3100`.

## 5. Variables de entorno

`apps/web/.env.local` (no se sube; los nombres están en `apps/web/.env.example`):

```sh
NEXT_PUBLIC_SUPABASE_URL=http://localhost:55321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<la que muestra «supabase status»>
SUPABASE_SECRET_KEY=<la que muestra «supabase status»>
```

En local se usan las claves de Supabase local; las de la nube solo van en Vercel.

## 6. Uso diario

| Comando (desde la raíz) | Qué hace |
|---|---|
| `pnpm install` | Instala exactamente lo de `pnpm-lock.yaml` |
| `pnpm -C apps/web dev` | Servidor de desarrollo en http://localhost:3100 |
| `pnpm lint` | ESLint en todo el proyecto |
| `pnpm typecheck` | Comprobación de tipos |
| `pnpm test:unit` | Vitest |
| `pnpm test:e2e` | Playwright (levanta la web sola) |
| `pnpm build` | Compilación de producción, como en Vercel |
| `pnpm openapi:check` | Falla si el contrato de la API cambió sin documentarse |
| `pnpm outdated` | Lista lo que tiene versión nueva (no actualiza nada) |

Para agregar una librería: `pnpm -C apps/web add <paquete>`. Antes, comprueba su licencia (CONTRIBUTING.md, sección 6) y su compatibilidad con la matriz de la guía 0.

## 7. Comprobación

- [ ] `pnpm install` termina sin advertencias de *peer dependencies*.
- [ ] `pnpm -C apps/web dev` abre http://localhost:3100.
- [ ] `curl -s http://localhost:3100/api/v1/salud` responde con estado 200.
- [ ] `pnpm lint && pnpm typecheck && pnpm test:unit && pnpm build` pasan.
- [ ] `pnpm test:e2e` pasa en Chromium, Firefox y WebKit.
