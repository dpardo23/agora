# Vista de comportamiento · Ágora

Versión 1.0 · creado el 2026-11-01 · editado el 2026-11-01 · autor: Juan Diego Pardo Pozo

Cómo se comporta Ágora en el tiempo: los flujos principales, en diagramas de secuencia, y el ciclo de vida de sus entidades, en máquinas de estados. Es la vista de comportamiento de la descripción de arquitectura (`docs/arquitectura/README.md`, sección 2).

**Fuentes:** `docs/arquitectura/api.md` (rutas), `docs/arquitectura/datos.md` (tablas y enums), ADR-002 (comunicación por la base de datos), ADR-005 (dioses y roles) y las reglas de negocio de las HU citadas en cada diagrama. Si una HU cambia un flujo o un estado, actualiza este documento en el mismo PR.

## 1. Flujos principales (diagramas de secuencia)

### 1.1. Inicio de sesión con verificación del dispositivo (HU-03.01, HU-03.02)

El navegador nunca conoce el correo: el servidor resuelve el usuario con la service role. En un dispositivo nuevo, la sesión queda pendiente hasta verificar el código enviado por Gmail.

```mermaid
sequenceDiagram
  autonumber
  actor T as Titular
  participant N as Navegador (PWA)
  participant P as Proxy de Next.js
  participant A as API /api/v1/auth
  participant DB as Supabase (Auth y Postgres)
  participant G as Gmail

  T->>N: Escribe usuario y contraseña
  N->>A: POST /auth/sesion
  A->>A: Límite de frecuencia por IP (5 intentos en 15 min)
  A->>DB: correo_de_usuario(usuario) con service role
  DB-->>A: correo, o nada si no existe
  A->>DB: signInWithPassword(correo, contraseña)
  alt Credenciales inválidas
    A-->>N: 401 con un mensaje que no revela qué falló
  else Dispositivo confiable (cookie agora_device registrada)
    A-->>N: 200 y cookie de sesión
    N->>P: Pide la ruta solicitada
    P-->>N: Página de la aplicación
  else Dispositivo nuevo
    A->>DB: Guarda el hash del código de 6 dígitos (10 min, 5 intentos)
    A->>G: Envía el código al correo del titular
    A-->>N: 200 con la sesión marcada como pendiente de verificación
    T->>N: Escribe el código
    N->>A: POST /auth/codigos/verificacion (recordar: true)
    A->>DB: Compara el hash y descuenta un intento
    alt Código correcto
      A->>DB: Registra el dispositivo en dispositivos_confiables
      A-->>N: 200 y cookie firmada agora_device (30 días)
    else Código incorrecto o vencido
      A-->>N: 422 con los intentos restantes
    end
  end
```

### 1.2. Encargo de un documento de punta a punta (EP-06, EP-07)

La web y el motor de agentes nunca se llaman entre sí (ADR-002): se coordinan por la cola de trabajos en Postgres y por Realtime. Si la VM está apagada, el encargo espera en la cola.

```mermaid
sequenceDiagram
  autonumber
  actor T as Titular
  participant W as Web (Next.js)
  participant A as API /api/v1
  participant DB as Postgres (cola, eventos)
  participant RT as Supabase Realtime
  participant M as Motor de agentes (VM)
  participant LLM as Claude y Gemini
  participant S as Storage y Drive

  T->>W: Llena el encargo (tema, páginas, materia)
  W->>A: POST /encargos con Idempotency-Key
  A->>A: Valida con Zod y verifica la sesión
  A->>DB: INSERT trabajos (estado en_cola)
  A-->>W: 201 con el número del trabajo
  W->>RT: Se suscribe a trabajos, trabajo_pasos y eventos_agente
  M->>DB: tomar_trabajo('vm-oracle-1'), FOR UPDATE SKIP LOCKED
  DB-->>M: Trabajo, ahora en_proceso
  loop Cada paso de pipeline_pasos
    M->>DB: Resuelve rol y dios titular en asignaciones_rol
    M->>DB: trabajo_pasos en_proceso y evento paso_iniciado
    DB-->>RT: Cambios
    RT-->>W: El dios camina a su estación y trabaja
    M->>LLM: Ejecuta el rol (investigar, redactar, verificar)
    LLM-->>M: Resultado
    M->>DB: trabajo_pasos hecho, uso_modelo y evento paso_terminado o traspaso
    opt Después del esquema, si aprobar_esquema está activo
      M->>DB: INSERT esquemas (pendiente) y trabajo en esperando_aprobacion
      RT-->>W: Muestra el esquema para revisar
      T->>W: Aprueba o pide cambios
      W->>A: POST /esquemas/{id}/decision
      A->>DB: esquemas aprobado o cambios_pedidos
      DB-->>M: El motor retoma (con cambios, regenera el esquema)
    end
  end
  M->>M: Barrera de entrega: citas literales, DOI, sin huecos
  M->>S: Sube el PDF al bucket documentos y lo copia a Drive
  M->>DB: INSERT documentos y trabajo entregado
  RT-->>W: El documento aparece en Documentos
```

### 1.3. Llegada de un aviso desde n8n (EP-13)

n8n solo hace de pegamento: lee las fuentes y entrega los avisos a la API por un webhook firmado. La API valida la firma, evita duplicados y guarda el aviso.

```mermaid
sequenceDiagram
  autonumber
  participant F as Gmail y webs de la UMSS y la FCyT
  participant N as n8n (VM)
  participant A as API /api/v1/webhooks/n8n/avisos
  participant DB as Postgres
  participant RT as Supabase Realtime
  participant W as Web (Next.js)

  N->>F: Consulta periódica de correo y noticias
  F-->>N: Mensajes nuevos
  N->>N: Aplica reglas_avisos y extrae fecha, aula y materia
  N->>A: POST con firma HMAC-SHA-256 en X-Firma e Idempotency-Key
  A->>A: Verifica la firma y valida con Zod
  alt Firma inválida
    A-->>N: 401
  else Firma válida
    A->>DB: INSERT avisos, sin duplicar por (user_id, fuente, externo_id)
    A-->>N: 202
    DB-->>RT: Aviso nuevo
    RT-->>W: Aumenta el contador de la campana
  end
```

### 1.4. Lectura de datos desde una pantalla (ADR-002)

Las lecturas no pasan por la API: van directo a Supabase con la sesión del titular, y RLS filtra las filas. Solo las escrituras con reglas de negocio pasan por `/api/v1`.

```mermaid
sequenceDiagram
  autonumber
  participant N as Navegador
  participant SC as Server Component
  participant DB as Postgres con RLS
  participant TQ as TanStack Query
  participant RT as Supabase Realtime

  N->>SC: Pide la página
  SC->>DB: SELECT con la sesión del titular (@supabase/ssr)
  DB-->>SC: Solo las filas con user_id = auth.uid()
  SC-->>N: HTML inicial
  N->>TQ: Hidrata la caché con los datos iniciales
  TQ->>RT: Se suscribe a los cambios de la tabla
  RT-->>TQ: Cambio en una fila
  TQ-->>N: Actualiza la vista sin recargar
```

## 2. Ciclos de vida (máquinas de estados)

### 2.1. Trabajo (`trabajos.estado`, HU-06.01, HU-06.06, HU-07.01)

```mermaid
stateDiagram-v2
  [*] --> en_cola: POST /encargos
  en_cola --> cancelado: el titular deshace el encargo
  en_cola --> en_proceso: tomar_trabajo()
  en_proceso --> esperando_aprobacion: esquema listo y aprobar_esquema activo
  esperando_aprobacion --> en_proceso: aprobado, o cambios pedidos (regenera)
  en_proceso --> pausado: pausar (termina el paso actual)
  pausado --> en_proceso: reanudar
  en_proceso --> error: un paso falla 3 veces
  en_proceso --> entregado: pasa la barrera de entrega
  error --> [*]
  cancelado --> [*]
  entregado --> [*]
```

- Si el motor se reinicia en mitad de un trabajo, lo retoma desde el último paso `hecho` sin cambiar de estado (HU-07.01, RN-5).
- La cola es FIFO: un trabajo pausado no deja pasar al siguiente, salvo que el titular elija «Atender el siguiente» (HU-06.06, RN-3).
- Regla «entrega completa a la primera»: no hay transición a `entregado` con huecos o cajas «Pendiente».

### 2.2. Paso de un trabajo (`trabajo_pasos.estado`)

```mermaid
stateDiagram-v2
  [*] --> pendiente
  pendiente --> en_proceso: el motor inicia el paso
  pendiente --> omitido: el rol no aplica a este encargo
  en_proceso --> hecho: resultado verificado
  en_proceso --> en_proceso: reintento (hasta 3)
  en_proceso --> error: tercer fallo
  hecho --> [*]
  omitido --> [*]
  error --> [*]
```

### 2.3. Esquema (`esquemas.estado`, HU-06.04)

```mermaid
stateDiagram-v2
  [*] --> pendiente: el motor propone el esquema
  pendiente --> aprobado: el titular aprueba
  pendiente --> cambios_pedidos: el titular comenta
  cambios_pedidos --> pendiente: el motor regenera con los comentarios
  aprobado --> [*]
```

### 2.4. Dios en la Oficina del Olimpo (`dioses.estado`, HU-05.02, HU-05.05)

Los dioses nunca están inmóviles: cada estado tiene una animación continua (`docs/diseno/sistema-de-diseno.md`, sección 8.4). Los eventos de `eventos_agente` provocan las transiciones y se procesan en orden por dios.

```mermaid
stateDiagram-v2
  [*] --> libre
  libre --> trabajando: paso_iniciado
  trabajando --> entregando: traspaso (lleva el papiro al destino)
  entregando --> trabajando: vuelve con más pasos
  entregando --> libre: vuelve sin más pasos
  trabajando --> libre: paso_terminado sin más pasos
  libre --> reunion: planificacion (Sala del Consejo)
  reunion --> trabajando: paso_iniciado
  trabajando --> esperando: espera la aprobación del esquema
  esperando --> trabajando: esquema resuelto
  trabajando --> error: paso_fallido (Taller de Ares)
  error --> trabajando: reintento
  error --> libre: el trabajo termina en error
  libre --> pausado: pausar dios (estado_control)
  trabajando --> pausado: pausar dios (termina el paso)
  pausado --> libre: reanudar
```

### 2.5. Sesión y dispositivo (HU-03.01 a HU-03.05)

```mermaid
stateDiagram-v2
  [*] --> sin_sesion
  sin_sesion --> con_sesion: contraseña válida en dispositivo confiable
  sin_sesion --> pendiente_2fa: contraseña válida en dispositivo nuevo
  sin_sesion --> bloqueado: 5 intentos fallidos en 15 min
  bloqueado --> sin_sesion: pasan 15 min
  pendiente_2fa --> con_sesion: código correcto (registra el dispositivo si se pide)
  pendiente_2fa --> pendiente_2fa: código incorrecto o reenvío
  pendiente_2fa --> sin_sesion: Volver, 5 intentos o código vencido
  con_sesion --> sin_sesion: cerrar sesión (local o global)
  con_sesion --> sin_sesion: dispositivo revocado o sesión vencida
```

### 2.6. Tarjeta de repaso (`tarjetas.state`, FSRS, EP-14)

Los estados son los del algoritmo FSRS; las transiciones dependen de la calificación del repaso (1 otra vez, 2 difícil, 3 bien, 4 fácil).

```mermaid
stateDiagram-v2
  [*] --> nueva
  nueva --> aprendiendo: primer repaso
  aprendiendo --> aprendiendo: otra vez o difícil
  aprendiendo --> repaso: bien o fácil
  repaso --> repaso: difícil, bien o fácil
  repaso --> reaprendiendo: otra vez (cuenta un lapso)
  reaprendiendo --> repaso: bien o fácil
  reaprendiendo --> reaprendiendo: otra vez o difícil
```
