---
paths:
  - "worker/**"
  - "infra/**"
---

# Reglas del worker (Python)

- Carga la skill `uv` para dependencias, entornos y ejecución.
- Arquitectura hexagonal: `dominio/` (pipeline, verificaciones), `puertos/` (Cola, ModeloLLM, Almacen, Compilador, Notificador, RegistroEventos) y `adaptadores/`.
- Cada rol es un handler registrado por nombre en `umss/roles/` (`@registrar_rol("clave")`). Agregar un rol no toca el núcleo (ADR-005). El dios que ejecuta un rol se resuelve con `asignaciones_rol` en tiempo de ejecución.
- Las verificaciones del Olimpo (citas literales, bibliografía por DOI, barrera de entrega, recetas de LaTeX) no se modifican.
- Regla «entrega completa a la primera»: ningún cambio puede producir un PDF con huecos o cajas «Pendiente».
- Los secretos se leen de variables de entorno; nunca se escriben en el código ni en los logs.
