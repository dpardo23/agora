import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { RUTAS } from "./rutas";

// Accesibilidad de todas las rutas de tests/e2e/rutas.ts (docs/accesibilidad.md: WCAG 2.2 AA, sin
// violaciones serious ni critical), en tema claro y oscuro y en escritorio y móvil. axe evalúa el DOM y
// los estilos calculados, que no cambian entre motores: se corre solo en Chromium.

const TEMAS = ["light", "dark"] as const;
const PANTALLAS = [
  { nombre: "escritorio", ancho: 1280, alto: 800 },
  { nombre: "móvil", ancho: 390, alto: 844 },
] as const;
const ETIQUETAS_WCAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

test.describe("accesibilidad por ruta", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "axe se corre una sola vez, en Chromium");

  for (const { ruta, nombre } of RUTAS) {
    for (const tema of TEMAS) {
      for (const pantalla of PANTALLAS) {
        test(`${nombre} (${ruta}) · ${tema === "light" ? "claro" : "oscuro"} · ${pantalla.nombre}`, async ({
          page,
        }) => {
          await page.emulateMedia({ colorScheme: tema, reducedMotion: "reduce" });
          await page.setViewportSize({ width: pantalla.ancho, height: pantalla.alto });
          await page.goto(ruta);
          await expect(page.locator("html")).toHaveAttribute("lang", "es-BO");
          await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);

          const resultado = await new AxeBuilder({ page }).withTags(ETIQUETAS_WCAG).analyze();
          const graves = resultado.violations
            .filter((v) => v.impact === "serious" || v.impact === "critical")
            .map((v) => ({ regla: v.id, impacto: v.impact, nodos: v.nodes.map((n) => n.target.join(" ")) }));
          expect(graves).toEqual([]);
        });
      }
    }
  }
});
