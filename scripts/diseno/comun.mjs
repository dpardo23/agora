// Utilidades compartidas por los scripts de mockups.
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const FUENTE = path.join(RAIZ, 'design/fuente/olympus.html');
export const MOCKUPS = path.join(RAIZ, 'design/mockups');
export const CHROMIUM = process.env.CHROMIUM_PATH || '/usr/bin/chromium';

// Nombre de archivo a partir del rótulo del artboard. La sección «Bot» se llama «Olimpo» (ADR-003).
export const slug = (s) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    .replace(/^bot-/, 'olimpo-');

// Abre el export del lienzo y ajusta cada iframe al alto de su contenido.
export async function abrirLienzo(chromium) {
  const navegador = await chromium.launch({ executablePath: CHROMIUM });
  const pagina = await navegador.newPage({ viewport: { width: 1600, height: 3200 } });
  await pagina.goto('file://' + FUENTE);
  await pagina.waitForTimeout(8000);
  const artboards = {};
  for (const iframe of await pagina.$$('iframe')) {
    const rotulo = await iframe.evaluate((el) => (el.previousElementSibling?.textContent || '').trim());
    const marco = await iframe.contentFrame();
    const alto = await marco.evaluate(() => Math.max(document.documentElement.scrollHeight, document.body.scrollHeight));
    await iframe.evaluate((el, h) => { el.style.height = h + 'px'; }, alto);
    artboards[slug(rotulo)] = { iframe, marco };
  }
  await pagina.waitForTimeout(1500);
  return { navegador, artboards };
}
