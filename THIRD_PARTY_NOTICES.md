# Avisos de terceros

Autor y titular del proyecto: Juan Diego Pardo Pozo. Fecha: 2026-10-20 · editado el 2026-10-31.

La licencia propietaria de `LICENSE` cubre solo la obra original de Ágora. Los componentes de terceros que siguen se incluyen en el repositorio con sus propias licencias, que se respetan y prevalecen sobre `LICENSE` en lo que a ellos se refiere. No son obra del titular del proyecto.

## Dependencias de la aplicación

Cuando exista `apps/web/package.json` (SPRINT-00) y `worker/pyproject.toml` (SPRINT-07), sus dependencias se regirán por sus propias licencias. Este archivo se actualizará con un resumen generado por herramienta (por ejemplo, `pnpm licenses list`) antes de cada release.

## Dependencias con licencia distinta de las permisivas

| Paquete | Licencia | Cómo se usa | Decisión |
|---|---|---|---|
| `@img/sharp-libvips-<plataforma>` (libvips, https://github.com/libvips/libvips) | LGPL-3.0-or-later | Dependencia opcional de `next` a través de `sharp`; se carga sin modificar como biblioteca compartida para optimizar imágenes en el servidor | ADR-007 |

## Tipografías

Bricolage Grotesque, Geist, Geist Mono y Pixelify Sans se distribuyen bajo la SIL Open Font License 1.1 y se cargan con `next/font`.
