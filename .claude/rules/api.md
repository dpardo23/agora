---
paths:
  - "apps/web/src/app/api/**"
  - "apps/web/src/server/**"
  - "apps/web/src/features/*/application/**"
  - "docs/api.md"
---

# Reglas de la API (/api/v1)

- Sigue `docs/api.md`: recursos en plural, en español y en kebab-case; JSON en `snake_case`; errores `application/problem+json` con `codigo`; los códigos HTTP de la tabla.
- `route.ts` es delgado: validar (Zod) → autorizar (sesión y dispositivo verificado) → caso de uso en `features/<dominio>/application` → responder.
- Todo endpoint nuevo o modificado se agrega al inventario de `docs/api.md` en el mismo PR. Un cambio incompatible va a `/api/v2`.
- Toda escritura verifica el `Origin`. La autenticación y los webhooks tienen límite de frecuencia; los webhooks verifican la firma HMAC.
- Carga `security-and-hardening` y prueba los casos 401, 403, 422 y 429 de cada endpoint.
