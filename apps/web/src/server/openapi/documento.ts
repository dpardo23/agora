// Contrato OpenAPI de /api/v1, generado desde los esquemas Zod (docs/arquitectura/api.md).
// Cada ruta nueva registra aquí su método, parámetros y respuestas; «pnpm openapi:check» falla si el
// contrato cambia y apps/web/openapi.json no se actualizó con «pnpm openapi:generar».
import { OpenAPIRegistry, OpenApiGeneratorV31 } from "@asteasolutions/zod-to-openapi";
import { esquemaProblema, TIPO_CONTENIDO_PROBLEMA } from "@/server/http/problema";
import { esquemaSalud } from "@/server/salud/esquema";
import { VERSION_APP } from "@/shared/config/version";

function crearRegistro(): OpenAPIRegistry {
  const registro = new OpenAPIRegistry();
  registro.register("Problema", esquemaProblema);
  const Salud = registro.register("Salud", esquemaSalud);

  registro.registerPath({
    method: "get",
    path: "/salud",
    operationId: "obtenerSalud",
    summary: "Estado de la API y de la conexión con Supabase",
    tags: ["Sistema"],
    responses: {
      200: { description: "La API responde", content: { "application/json": { schema: Salud } } },
    },
  });

  registro.registerPath({
    method: "get",
    path: "/openapi.json",
    operationId: "obtenerContrato",
    summary: "Contrato OpenAPI de la API",
    tags: ["Sistema"],
    responses: {
      200: { description: "Documento OpenAPI 3.1", content: { "application/json": { schema: {} } } },
    },
  });

  registro.registerComponent("responses", "NoEncontrado", {
    description: "La ruta no existe",
    // Los componentes se guardan tal cual: el esquema se referencia, no se pasa el objeto Zod.
    content: { [TIPO_CONTENIDO_PROBLEMA]: { schema: { $ref: "#/components/schemas/Problema" } } },
  });

  return registro;
}

export function generarDocumentoOpenApi() {
  const generador = new OpenApiGeneratorV31(crearRegistro().definitions);
  return generador.generateDocument({
    openapi: "3.1.0",
    info: {
      title: "API de Ágora",
      version: VERSION_APP,
      description: "API REST versionada de Ágora. Errores en application/problem+json (RFC 9457).",
    },
    servers: [{ url: "/api/v1" }],
  });
}
