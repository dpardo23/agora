import { responderProblema } from "@/server/http/problema";

// Cualquier ruta de /api/v1 que no exista responde 404 en application/problem+json.
function noEncontrado(): Response {
  return responderProblema({
    status: 404,
    title: "Recurso no encontrado",
    codigo: "RUTA_NO_ENCONTRADA",
    detail: "La ruta pedida no existe en la API v1.",
  });
}

export const GET = noEncontrado;
export const POST = noEncontrado;
export const PUT = noEncontrado;
export const PATCH = noEncontrado;
export const DELETE = noEncontrado;
