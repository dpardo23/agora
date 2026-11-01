import { expect, test } from "@playwright/test";
import Ajv2020 from "ajv/dist/2020";
import addFormats from "ajv-formats";
import contrato from "../../openapi.json" with { type: "json" };

// Prueba de contrato: cada GET sin parámetros de openapi.json se llama contra la web real y su
// respuesta 200 debe cumplir el esquema declarado. Si la API cambia sin regenerar el contrato
// (pnpm openapi:generar), esta prueba lo detecta. Es independiente del navegador: solo en Chromium.

interface Operacion {
  responses?: Record<string, { content?: Record<string, { schema?: object }> }>;
}

const ajv = new Ajv2020({ strict: false, allErrors: true });
addFormats(ajv);
ajv.addSchema({ $id: "contrato", components: contrato.components });

const rutas = Object.entries(contrato.paths as Record<string, { get?: Operacion }>)
  .filter(([ruta, metodos]) => metodos.get && !ruta.includes("{"))
  .map(([ruta, metodos]) => ({
    ruta,
    esquema: metodos.get?.responses?.["200"]?.content?.["application/json"]?.schema,
  }));

test.describe("contrato OpenAPI", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "pruebas de API, una sola vez");

  for (const { ruta, esquema } of rutas) {
    test(`GET /api/v1${ruta} cumple su esquema`, async ({ request }) => {
      const respuesta = await request.get(`/api/v1${ruta}`);
      expect(respuesta.status()).toBe(200);
      if (!esquema || Object.keys(esquema).length === 0) return;
      // Las referencias #/components/... se resuelven contra el documento registrado como «contrato».
      const validar = ajv.compile(
        JSON.parse(JSON.stringify(esquema).replaceAll('"#/components', '"contrato#/components')),
      );
      const cuerpo: unknown = await respuesta.json();
      expect(validar(cuerpo), JSON.stringify(validar.errors)).toBe(true);
    });
  }
});
