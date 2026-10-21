---
name: portar-pantalla
description: Convierte una pantalla del diseño (design/pantallas/*.dc.html) en páginas y componentes Next.js 16 / React 19 de Ágora, respetando docs/design.md, docs/accesibilidad.md y los CA de su HU. Úsala cuando se implemente la interfaz de una HU a partir de su mockup.
---

# Portar una pantalla del diseño a Next.js

## Leer primero
1. La HU y su TC: los CA mandan sobre el dibujo.
2. El `.dc.html` de escritorio y el de móvil:
   - el marcado está dentro de `<x-dc>`;
   - `{{x}}` son valores calculados en `renderVals()`;
   - `sc-for list="{{l}}" as="i"` equivale a un `.map()` en JSX;
   - `sc-if value="{{v}}"` equivale a un renderizado condicional;
   - el `<style>` de `<helmet>` trae las clases;
   - la clase `Component extends DCLogic` trae el estado y los **datos de ejemplo**, que definen la forma de los tipos TypeScript, pero nunca se copian como datos reales.
3. La captura en `design/mockups/`, la imagen anotada de la HU en `design/mockups/anotados/` y `docs/design.md` (tokens, componentes y la sección 13 de diferencias; por ejemplo, «Bot» se lee como «Olimpo»).

## Reglas
- Carga `nextjs-app-router-patterns`, `vercel-react-best-practices` y `shadcn`. Si la pantalla consume datos en vivo, carga también `tanstack-query`.
- Server Components por defecto; `"use client"` solo en las hojas interactivas.
- La página vive en `src/app/(app)/<ruta>/page.tsx` y compone componentes de `src/features/<dominio>/ui/`.
- Reproduce estructura, espaciado, tipografía y estados. Convierte los estilos en línea a clases de Tailwind con los tokens; no dejes hexadecimales sueltos.
- Usa el kit de `src/components/ui`. Si falta un componente, se agrega al kit, no a la pantalla.
- Agrega los estados de carga (`loading.tsx` o Suspense), vacío y error (`error.tsx`) aunque el diseño no los dibuje (`docs/design.md`, sección 12).
- Accesibilidad según `docs/accesibilidad.md`: roles ARIA, foco visible y no oculto, teclado, nombres accesibles y objetivos de 24 px como mínimo (44 px en móvil).
- Al terminar, compara con la captura a 390, 834 y 1440 px y en ambos temas, y revisa con `web-design-guidelines`.
