# Pruebas de API (Bruno)

Colección de [Bruno](https://www.usebruno.com) para `/api/v1`. Son archivos de texto que se versionan con el código; no hace falta cuenta ni nube.

- Correrlas, con la web en marcha en el puerto 3100: `pnpm -C apps/web test:api`.
- Abrirlas en la aplicación de escritorio de Bruno: «Open Collection» y elegir esta carpeta.
- Cada ruta nueva de la API agrega aquí su `.bru`, agrupado por recurso, y su registro en el contrato OpenAPI.
- Las variables de cada entorno están en `environments/`. Nunca se guardan secretos en ellas.

Guía completa: `docs/guias/entorno/06-calidad-y-pruebas.md`.
