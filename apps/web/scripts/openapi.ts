// Genera o comprueba apps/web/openapi.json desde los esquemas Zod de la API.
//   tsx scripts/openapi.ts --escribir   actualiza el archivo (pnpm openapi:generar)
//   tsx scripts/openapi.ts --comprobar  falla si el archivo no coincide (pnpm openapi:check, en el CI)
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { generarDocumentoOpenApi } from "../src/server/openapi/documento";

const ruta = fileURLToPath(new URL("../openapi.json", import.meta.url));
const generado = `${JSON.stringify(generarDocumentoOpenApi(), null, 2)}\n`;

if (process.argv.includes("--escribir")) {
  writeFileSync(ruta, generado);
  console.log("openapi.json actualizado.");
} else {
  let guardado = "";
  try {
    guardado = readFileSync(ruta, "utf8");
  } catch {
    // Sin archivo, la comparación falla abajo con el mismo mensaje.
  }
  if (guardado !== generado) {
    console.error(
      "openapi.json no coincide con los esquemas de la API. Ejecuta «pnpm -C apps/web openapi:generar» y revisa el cambio.",
    );
    process.exit(1);
  }
  console.log("openapi.json coincide con los esquemas de la API.");
}
