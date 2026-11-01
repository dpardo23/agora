import { expect, test } from "@playwright/test";

// Prueba de humo: la web arranca y la API responde en los tres navegadores. La accesibilidad se
// revisa en accesibilidad.spec.ts y el contrato de la API en contrato.spec.ts.

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

test("la página de inicio carga en español con un único título", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "es-BO");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("En construcción");
});
