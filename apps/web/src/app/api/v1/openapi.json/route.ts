import { generarDocumentoOpenApi } from "@/server/openapi/documento";

// GET /api/v1/openapi.json: contrato generado desde Zod. No depende de la petición, así que se
// genera en el build.
export function GET() {
  return Response.json(generarDocumentoOpenApi());
}
