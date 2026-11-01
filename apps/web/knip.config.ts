import type { KnipConfig } from "knip";

// Knip detecta archivos, exportaciones y dependencias sin usar (docs/guias/entorno/06-calidad-y-pruebas.md).
// Las dependencias de abajo se instalaron en T-01 para que el stack (ADR-001) esté completo desde el
// inicio, aunque todavía ninguna pantalla las importe. Cuando una HU empiece a usar una, Knip avisa que
// sobra en esta lista y se quita de aquí.
const config: KnipConfig = {
  ignore: [
    // Ayudante de shadcn: lo importan los componentes del kit desde HU-02.01.
    "src/shared/lib/utils.ts",
  ],
  ignoreDependencies: [
    // Kit de interfaz (HU-02.01 en adelante).
    "radix-ui",
    "class-variance-authority",
    "cn",
    "lucide-react",
    // Datos y sesión (HU-01.01 y EP-03).
    "@supabase/ssr",
    "@supabase/supabase-js",
    "@tanstack/react-query",
    // Formularios (HU-02.02).
    "react-hook-form",
    "@hookform/resolvers",
    // Fechas en America/La_Paz (EP-11).
    "date-fns",
    "@date-fns/tz",
    // Repaso espaciado (EP-14).
    "ts-fsrs",
    // PWA (EP-16).
    "serwist",
    "@serwist/turbopack",
    // Pruebas de componentes con interacción (HU-02.01 en adelante).
    "@testing-library/user-event",
  ],
};

export default config;
