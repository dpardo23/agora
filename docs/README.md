# Documentación · Ágora

Versión 1.0 · creado el 2026-11-01 · editado el 2026-11-01 · autor: Juan Diego Pardo Pozo

Índice de la documentación del proyecto. Cada carpeta agrupa una disciplina; la tabla de la sección 2 indica qué carpeta sirve a cada materia de la carrera.

## 1. Carpetas

| Carpeta | Qué contiene | Empieza por |
|---|---|---|
| [`producto/`](producto/vision.md) | Gestión del producto con Scrum: visión, backlog, épicas, historias de usuario y sprints | [`backlog.md`](producto/backlog.md) |
| [`qa/`](qa/plan-pruebas.md) | Aseguramiento de la calidad: plan de pruebas, matriz de trazabilidad, test cases y bug reports | [`plan-pruebas.md`](qa/plan-pruebas.md) |
| [`arquitectura/`](arquitectura/README.md) | Vista general con diagramas C4, contrato de la API REST y decisiones de arquitectura (ADR) | [`README.md`](arquitectura/README.md) |
| [`diseno/`](diseno/sistema-de-diseno.md) | Sistema de diseño (tokens, componentes, Oficina del Olimpo) y criterios de accesibilidad WCAG 2.2 AA | [`sistema-de-diseno.md`](diseno/sistema-de-diseno.md) |
| [`guias/`](guias/entorno/README.md) | Guías prácticas: preparación del entorno de desarrollo y configuración del repositorio en GitHub | [`entorno/README.md`](guias/entorno/README.md) |
| [`plantillas/`](plantillas/HU.md) | Plantillas de épica, historia de usuario, test case, bug report y ADR | — |
| `referencia/` | Material privado de consulta: guías de redacción de la materia y especificación original. No se versiona | — |

Fuera de `docs/` están el flujo de trabajo con Git ([`CONTRIBUTING.md`](../CONTRIBUTING.md)) y la política de seguridad ([`SECURITY.md`](../SECURITY.md)).

## 2. Materias y carpetas

| Materia | Carpetas | Artefactos |
|---|---|---|
| Sistemas de Información | `producto/` | Visión, épicas, historias de usuario con criterios de aceptación, backlog, planificación, revisión y retrospectiva de cada sprint |
| Gestión de Calidad de Software | `qa/`, `producto/historias/` | Test cases, bug reports, matriz de trazabilidad y plan de pruebas; las historias siguen el formato de la materia |
| Ingeniería de Software | `arquitectura/`, `guias/` | Arquitectura, ADR, contrato de la API, entorno, integración y despliegue continuos |

## 3. Convenciones

- Todo se redacta en español. Cada documento lleva en su segunda línea la versión, las fechas de creación y edición y el autor.
- Los nombres de archivos y carpetas propios van en español, en minúsculas, separados por guiones y sin tildes ni «ñ» (`sistema-de-diseno.md`). Las carpetas cuyo nombre fija una herramienta o una convención de la industria se mantienen como las espera esa herramienta (`adr/`, `qa/`).
- Los identificadores de los artefactos siguen el esquema del producto: `EP-XX`, `HU-XX.YY`, `TC-HU-XX.YY-NN`, `BUG-NNN` y `ADR-NNN`.
- Antes de un push se comprueban los enlaces, las rutas citadas, la autoría y el formato con `python scripts/verificar-docs.py`; el CI repite la misma revisión.
