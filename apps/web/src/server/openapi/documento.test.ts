import { generarDocumentoOpenApi } from "./documento";

describe("contrato OpenAPI", () => {
  it("es OpenAPI 3.1 con la ruta /salud y el esquema de errores", () => {
    const documento = generarDocumentoOpenApi();
    expect(documento.openapi).toBe("3.1.0");
    expect(documento.paths?.["/salud"]?.get?.operationId).toBe("obtenerSalud");
    expect(documento.components?.schemas).toHaveProperty("Problema");
  });
});
