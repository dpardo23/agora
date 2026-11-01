import "server-only";

// Comprueba si la web llega a Supabase, sin exponer claves ni detalles del error.

export type EstadoSupabase = "ok" | "sin_configurar" | "error";

const ESPERA_MAXIMA_MS = 2000;

interface ConfiguracionSupabase {
  url: string | undefined;
  clavePublica: string | undefined;
}

export function leerConfiguracionSupabase(): ConfiguracionSupabase {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    clavePublica: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  };
}

/**
 * «sin_configurar» si faltan las variables (un clon sin .env.local o el build del CI),
 * «ok» si el servicio de Auth responde y «error» en cualquier otro caso.
 */
export async function comprobarSupabase(
  { url, clavePublica }: ConfiguracionSupabase = leerConfiguracionSupabase(),
  pedir: typeof fetch = fetch,
): Promise<EstadoSupabase> {
  if (!url || !clavePublica) return "sin_configurar";
  try {
    const respuesta = await pedir(new URL("/auth/v1/health", url), {
      headers: { apikey: clavePublica },
      cache: "no-store",
      signal: AbortSignal.timeout(ESPERA_MAXIMA_MS),
    });
    return respuesta.ok ? "ok" : "error";
  } catch {
    return "error";
  }
}
