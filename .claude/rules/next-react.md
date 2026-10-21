---
paths:
  - "apps/web/src/**"
  - "apps/web/next.config.*"
  - "apps/web/components.json"
---

# Reglas al tocar la web (Next.js 16 + React 19)

- Antes de escribir páginas o componentes, carga `nextjs-app-router-patterns` y `vercel-react-best-practices`. Para el kit, carga `shadcn`. Para datos del servidor en el cliente, carga `tanstack-query`.
- Por defecto se usan Server Components. `"use client"` solo donde haga falta interactividad, y lo más abajo posible en el árbol.
- Estructura: `src/features/<dominio>/{ui,application,domain,infra}` con API pública en `index.ts`. Un dominio no importa el interior de otro.
- Componentes del kit en `src/components/ui/` (shadcn adaptado a `docs/design.md`). Si falta un componente, se agrega al kit, no a la pantalla.
- Colores, radios y tipografía salen de los tokens de `src/app/globals.css`. No escribas hexadecimales sueltos.
- La interfaz va en español de Bolivia, sin emoji, con iconos `lucide-react`. Cumple `docs/accesibilidad.md`.
- Antes de cerrar una pantalla, revísala con la skill `web-design-guidelines`.
