import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Pruebas unitarias y de componentes (docs/qa/plan-pruebas.md). Las E2E viven en tests/e2e y las
// corre Playwright.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // «server-only» lanza un error fuera de React Server Components; en las pruebas no aplica.
      "server-only": fileURLToPath(new URL("./tests/unit/server-only.ts", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/unit/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}", "tests/unit/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.test.{ts,tsx}", "src/app/**/layout.tsx"],
      reporter: ["text", "html", "lcov"],
      // Umbral mínimo en la lógica: servidor y dominios (docs/qa/plan-pruebas.md). Las rutas de
      // src/app son handlers delgados y se cubren con las pruebas E2E y de contrato.
      thresholds: {
        "src/server/**": { lines: 80, functions: 80, branches: 80, statements: 80 },
        "src/features/**": { lines: 80, functions: 80, branches: 80, statements: 80 },
      },
    },
  },
});
