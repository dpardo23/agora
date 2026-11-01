import { comprobarSupabase } from "./supabase";

const configurado = { url: "http://localhost:55321", clavePublica: "clave-de-prueba" };

describe("comprobarSupabase", () => {
  it("devuelve «sin_configurar» si faltan las variables, sin hacer peticiones", async () => {
    const pedir = vi.fn<typeof fetch>();
    expect(await comprobarSupabase({ url: undefined, clavePublica: undefined }, pedir)).toBe(
      "sin_configurar",
    );
    expect(pedir).not.toHaveBeenCalled();
  });

  it("devuelve «ok» si Auth responde y envía la clave pública en la cabecera apikey", async () => {
    const pedir = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 200 }));
    expect(await comprobarSupabase(configurado, pedir)).toBe("ok");
    const [destino, opciones] = pedir.mock.calls[0] ?? [];
    expect(String(destino)).toBe("http://localhost:55321/auth/v1/health");
    expect(opciones?.headers).toEqual({ apikey: "clave-de-prueba" });
  });

  it("devuelve «error» si Auth responde con un fallo", async () => {
    const pedir = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 503 }));
    expect(await comprobarSupabase(configurado, pedir)).toBe("error");
  });

  it("devuelve «error» si la petición falla o vence el tiempo", async () => {
    const pedir = vi.fn<typeof fetch>().mockRejectedValue(new Error("sin conexión"));
    expect(await comprobarSupabase(configurado, pedir)).toBe("error");
  });
});

describe("leerConfiguracionSupabase", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("lee la URL y la clave pública de las variables de entorno", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://localhost:55321");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "clave-de-prueba");
    const { leerConfiguracionSupabase } = await import("./supabase");
    expect(leerConfiguracionSupabase()).toEqual(configurado);
  });
});
