---
id: SPRINT-02
nombre: "Datos y acceso (H2 + H3)"
hito: H2 + H3
estado: Por iniciar
puntos_comprometidos: 29
fecha_creacion: 2026-10-20
fecha_edicion: 2026-10-20
---

# SPRINT-02 · Datos y acceso (H2 + H3)

## Objetivo del sprint
La base está aplicada con RLS y el usuario entra con usuario, contraseña y código de Gmail en un dispositivo nuevo.

## Sprint backlog

| PBI | Tipo | Título | Épica | MoSCoW | Pts | Estado |
|---|---|---|---|---|---|---|
| T-03 | Historia técnica | Corregir y aplicar la migración 0001 con RLS, Realtime y tipos generados | EP-03 | Must | 8 | Borrador |
| T-04 | Chore | Crear la semilla de datos de ejemplo para desarrollo y QA | EP-03 | Must | 3 | Borrador |
| T-10 | Spike | Elegir el canal de envío de correo transaccional (Gmail API o proveedor SMTP) | EP-03 | Must | 2 | Borrador |
| [HU-03.01](../historias/EP-03-acceso-y-seguridad/HU-03.01-iniciar-sesion-con-usuario.md) | Historia | Iniciar sesión con usuario y contraseña | EP-03 | Must | 5 | Borrador |
| [HU-03.02](../historias/EP-03-acceso-y-seguridad/HU-03.02-verificar-dispositivo-nuevo.md) | Historia | Verificar un dispositivo nuevo con un código enviado a Gmail | EP-03 | Must | 8 | Borrador |
| [HU-03.03](../historias/EP-03-acceso-y-seguridad/HU-03.03-recordar-dispositivo-confiable.md) | Historia | Recordar un dispositivo de confianza durante 30 días | EP-03 | Must | 3 | Borrador |

**Total comprometido:** 29 puntos.

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
| HU-03.01 | `docs/qa/test-cases/TC-HU-03.01.md` (por redactar) | | | | |
| HU-03.02 | `docs/qa/test-cases/TC-HU-03.02.md` (por redactar) | | | | |
| HU-03.03 | `docs/qa/test-cases/TC-HU-03.03.md` (por redactar) | | | | |

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
