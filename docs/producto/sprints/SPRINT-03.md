---
id: SPRINT-03
nombre: "Cuenta segura (H3)"
hito: H3
estado: Por iniciar
puntos_comprometidos: 18
fecha_creacion: 2026-10-20
fecha_edicion: 2026-10-20
---

# SPRINT-03 · Cuenta segura (H3)

## Objetivo del sprint
El titular gestiona su cuenta (tema persistido, contraseña, sesiones, recuperación y cierre de sesión), con el flujo probado en Playwright.

## Sprint backlog

| PBI | Tipo | Título | Épica | MoSCoW | Pts | Estado |
|---|---|---|---|---|---|---|
| [HU-03.04](../historias/EP-03-acceso-y-seguridad/HU-03.04-recuperar-acceso.md) | Historia | Recuperar el acceso con un código enviado a Gmail | EP-03 | Must | 5 | Borrador |
| [HU-03.05](../historias/EP-03-acceso-y-seguridad/HU-03.05-cerrar-sesion.md) | Historia | Cerrar sesión en este dispositivo o en todos | EP-03 | Must | 3 | Borrador |
| [HU-04.01](../historias/EP-04-configuracion/HU-04.01-guardar-preferencia-de-tema.md) | Historia | Guardar la preferencia de tema en mi perfil | EP-04 | Must | 2 | Borrador |
| [HU-04.02](../historias/EP-04-configuracion/HU-04.02-cambiar-contrasena.md) | Historia | Cambiar la contraseña con verificación por Gmail | EP-04 | Must | 5 | Borrador |
| [HU-04.03](../historias/EP-04-configuracion/HU-04.03-gestionar-sesiones-activas.md) | Historia | Gestionar las sesiones activas y la verificación en dos pasos | EP-04 | Must | 3 | Borrador |

**Total comprometido:** 18 puntos.

## Incremento esperado
Al cerrar el sprint, el objetivo de arriba se puede demostrar en la preview de Vercel (o en local, si el sprint es de infraestructura), en ambos temas y a 390, 834 y 1440 px.

## Flujo de trabajo del sprint
1. **Planning:** confirmar que cada HU cumple la DoR (descripción, CA y mockup anotado) y desglosar las tareas.
2. **Test cases:** redactar `docs/qa/test-cases/TC-HU-XX.YY.md` para cada HU, antes de programar (skill `escribir-tc`).
3. **Desarrollo:** una rama `feat/` por HU, con commits en Conventional Commits.
4. **Ejecución de TC:** registrar cada run en el TC.
5. **Bug reports:** un `docs/qa/bugs/BUG-NNN-*.md` por defecto (skill `reportar-bug`).
6. **Corrección y verificación** de los bugs.
7. **Review y retrospectiva** en este archivo.

## Test cases del sprint

| HU | Archivo de TC | Casos | Pasan | Fallan | Bloqueados |
|---|---|---|---|---|---|
| HU-03.04 | `docs/qa/test-cases/TC-HU-03.04.md` (por redactar) | | | | |
| HU-03.05 | `docs/qa/test-cases/TC-HU-03.05.md` (por redactar) | | | | |
| HU-04.01 | `docs/qa/test-cases/TC-HU-04.01.md` (por redactar) | | | | |
| HU-04.02 | `docs/qa/test-cases/TC-HU-04.02.md` (por redactar) | | | | |
| HU-04.03 | `docs/qa/test-cases/TC-HU-04.03.md` (por redactar) | | | | |

## Bugs del sprint

| Bug | Título | Severidad | Prioridad | HU | Estado |
|---|---|---|---|---|---|
| | | | | | |

## Definition of Done del sprint
- [ ] Todas las HU comprometidas están en estado «Hecha».
- [ ] TC redactados y ejecutados; ningún TC de prioridad Alta en «Falla».
- [ ] Sin bugs abiertos de severidad Crítica o Alta.
- [ ] CI en verde en `main`; preview desplegada.
- [ ] Backlog, matriz de trazabilidad y este archivo actualizados.

## Review
_(se completa al cerrar el sprint: qué se demostró y qué feedback hubo)_

## Retrospectiva
| Qué funcionó | Qué mejorar | Acción para el próximo sprint |
|---|---|---|
| | | |
