// Extiende Zod con .openapi() una sola vez. En Zod 4 los métodos se copian al crear cada esquema,
// así que todo esquema del contrato debe importar «z» desde este archivo y no desde «zod».
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export { z };
