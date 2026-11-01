import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Prueba de humo de T-01: la web arranca, la API responde y la página no tiene fallos graves de
// accesibilidad (docs/accesibilidad.md: sin violaciones serious ni critical).

test("GET /api/v1/salud responde 200 con el estado de la API", async ({ request }) => {
  const respuesta = await request.get("/api/v1/salud");
  expect(respuesta.status()).toBe(200);
  const cuerpo = await respuesta.json();
  expect(cuerpo).toMatchObject({ estado: "ok" });
  expect(["ok", "sin_configurar", "error"]).toContain(cuerpo.supabase);
});

test("una ruta inexistente de la API responde 404 en problem+json", async ({ request }) => {
  const respuesta = await request.get("/api/v1/no-existe");
  expect(respuesta.status()).toBe(404);
  expect(respuesta.headers()["content-type"]).toContain("application/problem+json");
  expect(await respuesta.json()).toMatchObject({ codigo: "RUTA_NO_ENCONTRADA", status: 404 });
});

test("la página de inicio está en español y sin violaciones graves de accesibilidad", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "es-BO");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const resultado = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  const graves = resultado.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  expect(graves).toEqual([]);
});
