// Lista central de rutas que recorren las pruebas de accesibilidad (tests/e2e/accesibilidad.spec.ts).
// Cada HU que crea una pantalla agrega aquí su ruta; así queda auditada sin escribir otra prueba.
// La lista completa de rutas del producto está en docs/arquitectura/api.md, sección 2.

export interface RutaAuditada {
  /** Ruta de la interfaz, por ejemplo «/tareas». */
  ruta: string;
  /** Nombre legible para el reporte. */
  nombre: string;
  /** HU o ítem que la creó. */
  origen: string;
}

export const RUTAS: readonly RutaAuditada[] = [{ ruta: "/", nombre: "Inicio provisional", origen: "T-01" }];
