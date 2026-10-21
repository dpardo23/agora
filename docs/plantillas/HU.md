---
id: HU-XX.YY
titulo: "[Verbo en infinitivo] [objeto] [calificador]"   # nombra la capacidad, no la pantalla; no repite la plantilla
epica: EP-XX Nombre de la épica
funcionalidad: Nombre de la funcionalidad
sprint: SPRINT-NN
tipo: historia            # historia | historia técnica (enabler) | spike | historia no funcional
prioridad: Must           # MoSCoW: Must | Should | Could | Won't (esta vez)
est_esf: 0                # puntos de historia (Fibonacci: 1, 2, 3, 5, 8, 13)
dependiente_de: []        # IDs de HU o PBI que deben estar hechos antes
elaborado_por: Juan Diego Pardo Pozo
responsable: Juan Diego Pardo Pozo
fecha_creacion: AAAA-MM-DD
fecha_edicion: AAAA-MM-DD
version: "1.0"
estado: Borrador          # Borrador → Lista (cumple DoR) → En curso → En QA → Hecha (cumple DoD)
mockups:
  - design/mockups/<pantalla>-escritorio.png
  - design/mockups/<pantalla>-movil.png
fuente_diseno:
  - design/pantallas/<Pantalla>.dc.html
---

# HU-XX.YY · Título

## 1. Descripción

| Parte | Contenido |
|---|---|
| **Plantilla** | Como **[rol]**, quiero **[capacidad]**, para **[beneficio]**. |
| **Contexto** | Situación en la que ocurre la historia. |
| **Reglas de negocio** | RN-1 … · RN-2 … |
| **Datos** | Campos, formatos, origen (tabla de Supabase). |
| **Supuestos** | Lo que se da por cierto. |
| **Fuera de alcance** | Lo que no se hace aquí (y en qué HU se hace). |

## 2. Criterios de aceptación funcionales (CA-FE)

Comportamiento con evento, orientado al mockup. Están en Gherkin en español: Dado / Cuando / Entonces. Cada CA se ancla a marcas del mockup (sección 4).

```gherkin
# language: es
Característica: [Título de la HU]

  Antecedentes:
    Dado que inicié sesión en la plataforma

  Escenario: CA-FE-01 [camino feliz]
    Dado [estado inicial visible]
    Cuando [acción única del usuario]
    Entonces [resultado observable, con el texto literal entre comillas]

  Esquema del escenario: CA-FE-02 [variación de datos o límites]
    Cuando ingreso <valor>
    Entonces veo <resultado>

    Ejemplos:
      | valor | resultado |
      |       |           |

  Escenario: CA-FE-03 [estado de carga]
  Escenario: CA-FE-04 [estado vacío]
  Escenario: CA-FE-05 [estado de error]
```

## 3. Criterios de aceptación no funcionales (CA-NF)

Requisitos sin evento discreto: se expresan como un umbral medible (ISO/IEC 25010).

| ID | Atributo (ISO/IEC 25010) | Verificar | Condición | Resultado esperado |
|---|---|---|---|---|
| CA-NF-01 | Eficiencia de desempeño | Tiempo de … | Red 4G simulada, … | ≤ X s (p95) |
| CA-NF-02 | Usabilidad · accesibilidad | Contraste de … | Ambos temas | ≥ 4,5:1 (WCAG 2.2 AA) |
| CA-NF-03 | Seguridad | … | … | … |

## 4. Mockup anotado

Captura: `design/mockups/…png` (escritorio) · `design/mockups/…png` (móvil). Fuente: `design/pantallas/….dc.html`.

| Marca | Elemento (texto literal) | Tipo / estado | Validación o regla | Criterio |
|---|---|---|---|---|
| 1 | «…» | Botón primario · normal / cargando / deshabilitado | … | CA-FE-01 |
| 2 | … | Estado vacío | … | CA-FE-04 |
| 3 | … | Estado de error | … | CA-FE-05 |

Estados obligatorios en el mockup: **normal, carga, vacío y error**. Si alguno no está dibujado, se marca como «pendiente de diseño».

## 5. Notas técnicas (para implementación)

- Ruta Next.js, componentes del kit, tablas, eventos de Realtime y endpoints de `server/api` implicados.

## 6. Definition of Ready (DoR)

- [ ] Cumple INVEST (independiente, negociable, valiosa, estimable, pequeña, verificable).
- [ ] Tiene descripción completa en sus 6 partes.
- [ ] Cada regla de negocio tiene al menos un CA.
- [ ] Mockup anotado, con estados de carga, vacío y error.
- [ ] Dependencias resueltas o planificadas en un sprint anterior.
- [ ] Estimada en puntos.

## 7. Definition of Done (DoD)

- [ ] Todos los CA-FE y CA-NF pasan.
- [ ] Test cases redactados en `docs/qa/test-cases/TC-HU-XX.YY.md` y ejecutados.
- [ ] Pruebas automatizadas (Vitest y Playwright) en verde en CI.
- [ ] Revisada en ambos temas, a 390, 834 y 1440 px.
- [ ] Sin errores de axe; foco visible y uso completo con teclado.
- [ ] Bugs de severidad Crítica o Alta cerrados.
- [ ] Backlog y matriz de trazabilidad actualizados.

## 8. Trazabilidad

| CA | Test cases | Bugs |
|---|---|---|
| CA-FE-01 | (se completa en el sprint) | |

## 9. Historial de cambios

| Versión | Fecha | Autor | Cambio |
|---|---|---|---|
| 1.0 | AAAA-MM-DD | Juan Diego Pardo Pozo | Creación |
