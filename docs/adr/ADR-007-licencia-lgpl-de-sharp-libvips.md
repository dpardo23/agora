---
id: ADR-007
titulo: Se acepta la licencia LGPL-3.0 de sharp-libvips como dependencia opcional de Next.js, sin modificarla
estado: Aceptada
fecha: 2026-10-31
autor: Juan Diego Pardo Pozo
---

# ADR-007 · Licencia LGPL de sharp-libvips

## Contexto
Ágora es software propietario (`LICENSE`) y `CONTRIBUTING.md` (sección 6) solo admite dependencias con licencias permisivas. Cualquier licencia copyleft requiere una revisión y un ADR antes de incorporarse.

Al crear la web (T-01), la revisión con `pnpm licenses list` encontró una dependencia fuera de esa lista: `@img/sharp-libvips-<plataforma>` (versión 1.3.4), con licencia **LGPL-3.0-or-later**. No la pide Ágora directamente: llega como dependencia **opcional** de `next` a través de `sharp` (Apache-2.0), que Next.js usa para optimizar las imágenes de `next/image`. El paquete solo contiene la biblioteca compilada libvips, que `sharp` carga como biblioteca compartida.

La revisión de dependencias del CI (`actions/dependency-review-action`) solo evalúa las dependencias directas declaradas en `package.json`, así que esta dependencia transitiva no la detectaba.

## Decisión
Se acepta `@img/sharp-libvips-*` con su licencia LGPL-3.0-or-later bajo estas condiciones:

1. Se usa **sin modificar**, tal como la publica su autor, y la carga `sharp` de forma dinámica como biblioteca compartida. Ágora no copia su código ni lo enlaza de forma estática.
2. Solo se usa para optimizar imágenes en el servidor. No se distribuye dentro de la aplicación que recibe el navegador.
3. Se mantiene como dependencia opcional de Next.js. Si en algún momento hubiera que modificarla o enlazarla de otra forma, esta decisión se revisa.
4. Queda registrada en `THIRD_PARTY_NOTICES.md` y como excepción explícita (`allow-dependencies-licenses`) en la revisión de dependencias del CI, junto a las variantes por plataforma del paquete.

Además, se agrega `MIT-0` a las licencias permitidas del CI: es una variante de MIT sin la obligación de conservar el aviso, tan permisiva como las que ya están en la lista.

## Alternativas consideradas
| Opción | A favor | En contra |
|---|---|---|
| **Aceptarla sin modificarla y documentarla** | La optimización de imágenes funciona igual en local, en el CI y en Vercel; la LGPL permite usar la biblioteca sin modificarla en software propietario | Exige mantener el aviso de terceros y revisar la decisión si cambia el uso |
| Excluir `sharp` con `ignoredOptionalDependencies` de pnpm | Ninguna dependencia LGPL en el árbol | `next start` en local no podría optimizar imágenes de `next/image`; el entorno local y Vercel se comportarían distinto |
| Dejar la decisión para más adelante | Sin trabajo ahora | La dependencia ya está instalada sin revisar, lo que contradice `CONTRIBUTING.md` |

## Consecuencias
- Positivas: la política de licencias se cumple de forma explícita y el CI documenta la única excepción.
- Negativas o costos: cada actualización mayor de `next` o de `sharp` exige comprobar que la licencia y la forma de uso no cambiaron (`pnpm licenses list -r`).
- Cambios: `THIRD_PARTY_NOTICES.md` (nueva sección de dependencias con licencia distinta de las permisivas), `.github/workflows/ci.yml` (`MIT-0` y `allow-dependencies-licenses`), `docs/arquitectura.md` (lista de ADR).
