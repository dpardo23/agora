import { defineConfig, devices } from "@playwright/test";

// Pruebas E2E y de accesibilidad en Chromium, Firefox y WebKit (docs/qa/plan-pruebas.md).
// En el CI se prueba el build de producción; en local, el servidor de desarrollo si ya está abierto.
const enCI = Boolean(process.env.CI);
const URL_BASE = "http://localhost:3100";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: enCI,
  retries: enCI ? 2 : 0,
  ...(enCI ? { workers: 1 } : {}),
  reporter: enCI ? [["html", { open: "never" }], ["github"]] : [["list"]],
  use: {
    baseURL: URL_BASE,
    locale: "es-BO",
    timezoneId: "America/La_Paz",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: {
    command: enCI ? "pnpm start" : "pnpm dev",
    url: `${URL_BASE}/api/v1/salud`,
    reuseExistingServer: !enCI,
    timeout: 120_000,
  },
});
