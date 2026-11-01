import { connection } from "next/server";
import { comprobarSupabase } from "@/server/salud/supabase";
import { esquemaSalud } from "@/server/salud/esquema";
import { VERSION_APP } from "@/shared/config/version";

// GET /api/v1/salud: estado de la API y de la conexión con Supabase (docs/api.md, sección 3).
export async function GET() {
  // Se resuelve en cada petición: el estado no se guarda en caché ni se calcula en el build.
  await connection();
  const cuerpo = esquemaSalud.parse({
    estado: "ok",
    version: VERSION_APP,
    supabase: await comprobarSupabase(),
  });
  return Response.json(cuerpo, { headers: { "cache-control": "no-store" } });
}
