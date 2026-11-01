import { crearProblema, responderProblema, TIPO_CONTENIDO_PROBLEMA } from "./problema";

describe("problema (RFC 9457)", () => {
  it("arma el cuerpo con código estable y lista de errores vacía por defecto", () => {
    const problema = crearProblema({ status: 409, title: "Conflicto", codigo: "MATERIA_DUPLICADA" });
    expect(problema).toEqual({
      type: "https://agora.local/errores/materia-duplicada",
      title: "Conflicto",
      status: 409,
      codigo: "MATERIA_DUPLICADA",
      errores: [],
    });
  });

  it("rechaza un código que no está en mayúsculas", () => {
    expect(() => crearProblema({ status: 400, title: "Error", codigo: "minusculas" })).toThrow();
  });

  it("responde con el estado y el tipo de contenido application/problem+json", async () => {
    const respuesta = responderProblema({
      status: 422,
      title: "Datos inválidos",
      codigo: "DATOS_INVALIDOS",
      errores: [{ campo: "nombre", mensaje: "Obligatorio" }],
    });
    expect(respuesta.status).toBe(422);
    expect(respuesta.headers.get("content-type")).toBe(TIPO_CONTENIDO_PROBLEMA);
    expect(await respuesta.json()).toMatchObject({ errores: [{ campo: "nombre", mensaje: "Obligatorio" }] });
  });
});
