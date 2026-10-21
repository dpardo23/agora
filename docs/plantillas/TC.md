---
hu: HU-XX.YY
sprint: SPRINT-NN
fecha_creacion: AAAA-MM-DD
fecha_edicion: AAAA-MM-DD
version: "1.0"
---

# Test cases de HU-XX.YY · Título de la HU

Reglas (guía de redacción de test cases, v1.0):

1. Cada caso es atómico: verifica un solo comportamiento.
2. Se redacta a alto nivel: lo que el usuario hace y observa.
3. El título empieza con «Verificar» y tiene 80 caracteres como máximo.
4. Los pasos llevan verbos en infinitivo.
5. El último paso no tiene resultado parcial.
6. El título y el resultado esperado dicen lo mismo.
7. Cada caso tiene entre 10 y 20 pasos.
8. No se agregan ni eliminan campos.
9. Una celda sin dato queda vacía (nunca «N/A»).
10. No se usa la palabra «correctamente».

**Suites de esta HU:** Suite A · Suite B · …

---

## TC-HU-XX.YY-01 · Verificar [comportamiento] [objeto] [contexto]

| Campo | Valor |
|---|---|
| **Suite** | |
| **Epic Asignada** | EP-XX Nombre |
| **Historia de Usuario** | HU-XX.YY Título |
| **C.A. Vinculados** | CA-FE-01 |
| **Tipo** | Positivo · Negativo · Límite · Estado de UI · Seguridad · Persistencia · Rendimiento |
| **Prioridad** | Alta · Media · Baja |
| **Automatizado** | Sí (`tests/e2e/…spec.ts`) · No |

**Descripción.** Qué se verifica y bajo qué condición. Qué regla o técnica lo respalda y qué riesgo mitiga (de 2 a 4 oraciones).

**Precondiciones**

- **Escenario:** …
- **Ambiente de prueba:** local (`pnpm dev` + Supabase local) · preview de Vercel · navegador y versión · ancho (390 / 834 / 1440 px) · tema.
- **Datos requeridos:**
  - …

| Nro. | Paso | Input Data | Resultado esperado parcial |
|---|---|---|---|
| 1 | Abrir … | | Se muestra … |
| 2 | Ingresar … | `valor` | … |
| … | | | |
| 10 | Hacer clic en … | | |

**Resultado esperado.** Coincide en significado con el título.

**Postcondiciones.** Cómo se revierte el estado (si hace falta).

### Ejecuciones

| Run | Fecha | Build / commit | Resultado | Bug |
|---|---|---|---|---|
