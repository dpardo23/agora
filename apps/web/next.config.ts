import type { NextConfig } from "next";

// Configuración de Next.js 16 para Ágora (docs/guias/entorno/03-frontend.md).
// cacheComponents y partialPrefetching son los valores por defecto de la plantilla oficial de Next 16:
// las páginas son dinámicas salvo lo que se marque con «use cache».
const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  reactStrictMode: true,
  turbopack: {
    // Tailwind v4 se compila con su cargador para Turbopack (sin PostCSS).
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
