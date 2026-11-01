# Guías del entorno de desarrollo · Ágora

Versión 1.2 · creado el 2026-10-21 · editado el 2026-11-01 · autor: Juan Diego Pardo Pozo

Guías del SPRINT-00 «Organización y entorno» (ítem T-14). Se leen en orden. La decisión que las sustenta es el ADR-006 (`docs/arquitectura/adr/ADR-006-entorno-de-desarrollo-aislado.md`).

| Guía | Contenido |
|---|---|
| [0 · Mapa y orden de pasos](00-mapa-y-orden.md) | Piezas, aislamiento, orden de trabajo, matriz de versiones, puertos |
| [1 · Sistema base y aislamiento](01-sistema-base-y-aislamiento.md) | pacman, Docker, mise, Git, gh, editor, respaldo de lo privado |
| [2 · Cuentas y secretos](02-cuentas-y-secretos.md) | Oracle y la VM, Supabase, Google Cloud, AI Studio, Claude, GitHub, Vercel |
| [3 · Frontend](03-frontend.md) | `apps/web`: librerías, variables, comandos |
| [4 · Backend y datos](04-backend-y-datos.md) | Supabase local, n8n y el worker en Docker |
| [5 · Comprobación y problemas](05-solucion-de-problemas.md) | Verificación del entorno y errores comunes |
| [6 · Calidad y pruebas](06-calidad-y-pruebas.md) | Barreras de commit, push y PR; Vitest, Playwright, axe, Bruno, Lighthouse, Knip, CodeQL |

## PDF

```sh
scripts/guias/generar-pdf.sh
```

Genera un PDF por guía y `agora-guias-entorno.pdf` con todas, en la carpeta `pdf/` de esta guía. Los PDF no se suben al repositorio: se regeneran cuando cambia una guía.
