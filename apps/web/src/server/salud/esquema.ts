// Zod extendido con .openapi(): los esquemas de la API forman parte del contrato.
import { z } from "@/server/openapi/zod";

export const esquemaSalud = z.object({
  /** «ok» mientras la API responda; el estado de Supabase va aparte para no ocultar la causa. */
  estado: z.literal("ok"),
  version: z.string(),
  supabase: z.enum(["ok", "sin_configurar", "error"]),
});
