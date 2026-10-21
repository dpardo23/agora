// Captura cada pantalla del lienzo de diseño en design/mockups/<pantalla>.png.
// Uso: node scripts/diseno/capturar-mockups.mjs   (requiere playwright-core y design/fuente/olympus.html)
import { chromium } from 'playwright-core';
import path from 'node:path';
import { abrirLienzo, MOCKUPS } from './comun.mjs';

const { navegador, artboards } = await abrirLienzo(chromium);
for (const [nombre, { iframe }] of Object.entries(artboards)) {
  await iframe.scrollIntoViewIfNeeded();
  await iframe.screenshot({ path: path.join(MOCKUPS, `${nombre}.png`) });
  console.log(nombre);
}
await navegador.close();
