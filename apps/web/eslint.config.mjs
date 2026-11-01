// ESLint 9 (configuración plana) de la web de Ágora.
// Además de las reglas de Next, eslint-plugin-boundaries hace cumplir la arquitectura de ADR-002:
// un módulo de src/features solo importa la API pública (index.ts) de otro módulo, y las capas
// compartidas no dependen de las de dominio ni de las rutas.
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";

const capas = [
  { type: "app", pattern: "src/app" },
  { type: "feature", pattern: "src/features/*", capture: ["dominio"] },
  { type: "ui", pattern: "src/components" },
  { type: "shared", pattern: "src/shared" },
  { type: "server", pattern: "src/server" },
];

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { boundaries },
    settings: {
      "boundaries/elements": capas,
      "boundaries/include": ["src/**/*"],
      "import/resolver": { typescript: { alwaysTryTypes: true } },
    },
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "allow",
          policies: [
            // Entre dominios, solo la API pública: src/features/<otro>/index.ts.
            {
              from: { element: { type: "feature" } },
              disallow: {
                to: {
                  element: {
                    type: "feature",
                    captured: { dominio: "!{{ from.element.captured.dominio }}" },
                    internalPath: "!index.ts",
                  },
                },
              },
              message: "Un dominio solo importa la API pública (index.ts) de otro dominio (ADR-002).",
            },
            // Lo compartido no conoce los dominios, el servidor ni las rutas.
            {
              from: { element: { types: { anyOf: ["shared", "ui"] } } },
              disallow: { to: { element: { types: { anyOf: ["feature", "server", "app"] } } } },
              message: "src/shared y src/components no dependen de dominios, del servidor ni de las rutas.",
            },
            // Nadie importa las rutas de src/app.
            {
              from: { element: { types: { anyOf: ["feature", "server"] } } },
              disallow: { to: { element: { type: "app" } } },
              message: "Las rutas de src/app no se importan desde otras capas.",
            },
          ],
        },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "next-env.d.ts",
  ]),
]);
