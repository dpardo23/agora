---
name: escribir-tc
description: Deriva y redacta los test cases de una HU de Ágora con la guía de redacción de la materia (estilo Qase, atómicos, título con «Verificar» ≤ 80 caracteres, 10 a 20 pasos en infinitivo). Úsala al iniciar un sprint para crear docs/qa/test-cases/TC-HU-XX.YY.md, o para revisar o ampliar test cases existentes.
---

# Escribir test cases

## Entrada
La HU (`docs/producto/historias/HU-XX.YY-*.md`), la plantilla `docs/plantillas/TC.md` y la semilla de datos (`supabase/seed.sql`).

## Procedimiento
1. **Suites:** define entre 4 y 8 suites por área funcional de la HU (nunca «Casos negativos» ni «Varios»).
2. **Condiciones de prueba:** de cada CA saca sus condiciones. Aplica partición de equivalencia, valores límite, tabla de decisión o transición de estados según el CA. Cada `Esquema del escenario` con N ejemplos da al menos N condiciones.
3. **Un caso por comportamiento** (atomicidad): si el título necesita «y» entre dos resultados, son dos casos.
4. **Redacción de cada TC:**
   - Título: «Verificar [comportamiento] [objeto] [contexto]», ≤ 80 caracteres (cuéntalos).
   - Descripción de 2 a 4 oraciones: qué verifica, qué lo respalda (CA o técnica) y qué riesgo mitiga.
   - Precondiciones en 3 partes: Escenario, Ambiente de prueba (local o preview, navegador, ancho, tema) y Datos requeridos **literales** (usuario `dpardo`, materia «Base de Datos II» 2010016…).
   - Entre 10 y 20 pasos, uno por acción, con verbo en infinitivo; Input Data literal o celda vacía (nunca «N/A»); resultado parcial verificable en cada paso **excepto el último**.
   - El resultado esperado final dice lo mismo que el título.
   - Vincula en «C.A. Vinculados» solo los CA cuyo «Entonces» comprueba el caso.
   - Prohibido: «correctamente», «adecuadamente», «funciona bien».
5. **Independencia:** ningún TC depende de otro; todo sale de las precondiciones y se revierte con la postcondición.
6. Marca **Automatizado: Sí** en los casos de la ruta crítica y escribe la ruta del spec de Playwright o Vitest.

## Salida
- `docs/qa/test-cases/TC-HU-XX.YY.md`.
- Columna «Test cases» de la HU (sección 8 Trazabilidad), de la matriz y del archivo del sprint, actualizada.
- Comprueba que **cada CA** tenga al menos un TC.
