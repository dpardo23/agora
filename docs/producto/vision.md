# Visión de producto · Ágora

Versión 1.1 · creado el 2026-10-20 · editado el 2026-10-20 · autor: Juan Diego Pardo Pozo

## Declaración de visión

**Para** Juan Diego, estudiante de Ingeniería de Sistemas en la UMSS (FCyT),
**que** necesita encargar y seguir documentos de estudio generados por su sistema de agentes y organizar su vida universitaria en un solo lugar,
**Ágora** es una PWA personal
**que** saca el Olimpo de la laptop, lo muestra como una oficina de dioses griegos trabajando en tiempo real y lo rodea de tareas, materias, malla, agenda, repaso, pomodoro y avisos.
**A diferencia de** usar el sistema de agentes por consola desde la laptop y tener tareas, horarios y notas repartidos en varias apps,
**nuestro producto** une el encargo, el seguimiento y la entrega del documento con la planificación del semestre, desde el PC o el teléfono.

## Usuario y roles

Hay un solo usuario. En las historias aparecen tres sombreros distintos del mismo usuario, porque el beneficio cambia según el caso:

| Rol en las HU | Cuándo |
|---|---|
| **estudiante** | Organiza materias, tareas, agenda y estudio |
| **dueño del Olimpo** | Encarga documentos, supervisa a los agentes, cuida el cupo y la VM |
| **titular de la cuenta** | Acceso, seguridad y preferencias |

## Objetivos medibles

1. Encargar un documento desde el teléfono en menos de 1 minuto.
2. Ver el avance de un trabajo en vivo, con una latencia de evento menor a 2 s.
3. Recibir el PDF en Drive con las mismas verificaciones que hoy (regla «entrega completa a la primera»).
4. Tener el semestre (materias, horario, parciales, tareas) visible en una sola pantalla de inicio.

## Fuera de alcance (por ahora)

- Varios usuarios, registro público y app nativa.
- Reescribir el worker `umss` (solo cambia su cola).
- Los pendientes de CONTEXTO sección 13: Obsidian, Grok frente a Groq, motor del Ilustrador y correo como canal de entrega.

## Forma de trabajo (Scrum sin fechas)

- Artefactos: **épicas → HU → product backlog (PBI) → sprint backlog → incremento**.
- Los sprints no tienen fechas: se cierran cuando su objetivo y su DoD se cumplen. Cada sprint entrega **algo funcional**.
- Ciclo dentro de cada sprint:
  1. Planning: confirmar las HU del sprint y su DoR.
  2. Redactar los **test cases** de cada HU (`docs/qa/test-cases/`).
  3. Implementar.
  4. Ejecutar los TC y redactar los **bug reports** de lo que falle (`docs/qa/bugs/`).
  5. Corregir.
  6. Review: demostrar el incremento.
  7. Retrospectiva en `docs/producto/sprints/SPRINT-NN.md`.
