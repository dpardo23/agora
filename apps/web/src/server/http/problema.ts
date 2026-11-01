// Errores de la API en formato application/problem+json (RFC 9457), según docs/arquitectura/api.md, sección 1.
// Zod extendido con .openapi(): los esquemas de la API forman parte del contrato.
import { z } from "@/server/openapi/zod";

export const TIPO_CONTENIDO_PROBLEMA = "application/problem+json";

const esquemaErrorCampo = z.object({
  campo: z.string(),
  mensaje: z.string(),
});

export const esquemaProblema = z.object({
  type: z.string(),
  title: z.string(),
  status: z.number().int(),
  detail: z.string().optional(),
  /** Código estable en mayúsculas, por ejemplo MATERIA_DUPLICADA. */
  codigo: z.string().regex(/^[A-Z][A-Z0-9_]*$/),
  errores: z.array(esquemaErrorCampo).default([]),
});

export type Problema = z.infer<typeof esquemaProblema>;

export interface DatosProblema {
  status: number;
  title: string;
  codigo: string;
  detail?: string;
  errores?: Problema["errores"];
}

/** Arma el cuerpo de un problema. El campo «type» apunta a la documentación del código. */
export function crearProblema({ status, title, codigo, detail, errores = [] }: DatosProblema): Problema {
  return esquemaProblema.parse({
    type: `https://agora.local/errores/${codigo.toLowerCase().replaceAll("_", "-")}`,
    title,
    status,
    ...(detail === undefined ? {} : { detail }),
    codigo,
    errores,
  });
}

/** Respuesta HTTP con el problema y su tipo de contenido. */
export function responderProblema(datos: DatosProblema, init?: ResponseInit): Response {
  const cuerpo = crearProblema(datos);
  const cabeceras = new Headers(init?.headers);
  cabeceras.set("content-type", TIPO_CONTENIDO_PROBLEMA);
  return new Response(JSON.stringify(cuerpo), { ...init, status: cuerpo.status, headers: cabeceras });
}
