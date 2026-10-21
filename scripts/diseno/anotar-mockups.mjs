// Dibuja las marcas numeradas de cada HU sobre su pantalla y guarda design/mockups/anotados/HU-XX.YY__<pantalla>.png.
// Paso previo: python scripts/diseno/extraer-marcas.py
// Uso: node scripts/diseno/anotar-mockups.mjs   (requiere playwright-core y design/fuente/olympus.html)
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import { abrirLienzo, MOCKUPS } from './comun.mjs';

const OUT = path.join(MOCKUPS, 'anotados');
const data = JSON.parse(fs.readFileSync(path.join(OUT, 'marcas.json'), 'utf8'));
const { navegador: b, artboards: frames } = await abrirLienzo(chromium);
for (const k of Object.keys(frames)) frames[k] = { el: frames[k].iframe, fr: frames[k].marco };
const report = {};
for (const hu of data) {
  report[hu.hu] = { total: hu.marks.length, ubicadas: new Set(), imagenes: [] };
  for (const png of hu.pngs) {
    const F = frames[png]; if (!F) continue;
    const found = await F.fr.evaluate((marks) => {
      const norm = t => t.replace(/\s+/g,' ').replace(/[…]/g,'').trim().toLowerCase();
      const els = [...document.querySelectorAll('body *')].filter(e => e.offsetParent !== null || e.tagName==='BODY');
      const placed = []; const res = [];
      for (const m of marks) {
        let hit = null;
        for (const lit of m.lits) {
          const L = norm(lit).slice(0, 60); if (L.length < 2) continue;
          let best = null;
          for (const e of els) {
            const t = norm(e.textContent || '');
            const ph = norm(e.getAttribute('placeholder')||''), al = norm(e.getAttribute('aria-label')||'');
            let rank = 9;
            if (t === L || ph === L || al === L) rank = 0;
            else if (t.startsWith(L) || ph.startsWith(L) || al.startsWith(L)) rank = 1;
            else if (L.length >= 8 && (t.includes(L) || ph.includes(L) || al.includes(L))) rank = 2;
            if (rank === 9) continue;
            const r = e.getBoundingClientRect(); if (r.width < 4 || r.height < 4) continue;
            const a = r.width*r.height;
            if (!best || rank < best.rank || (rank === best.rank && a < best.a)) best = { e, a, r, rank };
          }
          if (best) { hit = best.r; break; }
        }
        if (hit) {
          let x = hit.left + window.scrollX - 10, y = hit.top + window.scrollY - 10;
          while (placed.some(q => Math.abs(q[0]-x) < 22 && Math.abs(q[1]-y) < 22)) x += 24;
          placed.push([x,y]);
          const d = document.createElement('div');
          d.className = '__marca'; d.textContent = m.n;
          d.style.cssText = `position:absolute;left:${Math.max(0,x)}px;top:${Math.max(0,y)}px;z-index:99999;min-width:22px;height:22px;padding:0 5px;box-sizing:border-box;border-radius:11px;background:#E8340C;color:#fff;font:700 12px/22px system-ui,sans-serif;text-align:center;box-shadow:0 0 0 2px #fff,0 2px 6px rgba(0,0,0,.35)`;
          document.body.appendChild(d);
          const o = document.createElement('div'); o.className='__marca';
          o.style.cssText = `position:absolute;left:${hit.left+window.scrollX-2}px;top:${hit.top+window.scrollY-2}px;width:${hit.width+4}px;height:${hit.height+4}px;border:2px solid #E8340C;border-radius:6px;z-index:99998;pointer-events:none`;
          document.body.appendChild(o);
          res.push(m.n);
        }
      }
      return res;
    }, hu.marks);
    if (found.length) {
      await F.el.scrollIntoViewIfNeeded();
      const file = `${hu.hu}__${png}.png`;
      await F.el.screenshot({ path: `${OUT}/${file}` });
      report[hu.hu].imagenes.push(file);
      found.forEach(n => report[hu.hu].ubicadas.add(n));
    }
    await F.fr.evaluate(() => document.querySelectorAll('.__marca').forEach(e => e.remove()));
  }
}
const outRep = Object.fromEntries(Object.entries(report).map(([k,v]) => [k, { total: v.total, ubicadas: [...v.ubicadas].sort((a,b)=>a-b), imagenes: v.imagenes }]));
fs.writeFileSync(path.join(OUT, 'reporte.json'), JSON.stringify(outRep, null, 1));
let tot=0, ub=0; for (const v of Object.values(outRep)) { tot+=v.total; ub+=v.ubicadas.length; }
console.log('marcas', tot, 'ubicadas', ub, 'imagenes', Object.values(outRep).reduce((a,v)=>a+v.imagenes.length,0));
await b.close();
