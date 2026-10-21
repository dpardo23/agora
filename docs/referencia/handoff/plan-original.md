# Plan: plataforma universitaria con el bot UMSS en la nube

Borrador del 9 de octubre de 2026. Recoge lo conversado: qué se decidió, la arquitectura, las fases y lo que falta decidir. Es la base para detallar cada fase más adelante.

## 1. Objetivo

Sacar el bot UMSS de la laptop y convertirlo en el centro de una web personal para la vida universitaria:

- el bot genera los documentos de estudio (PDF) como hoy, pero se encarga y se sigue desde la web;
- todo corre en la nube, sin depender de que la laptop esté encendida;
- se gasta menos cupo de Claude, porque los pasos mecánicos pasan a modelos gratuitos;
- alrededor del bot hay herramientas de organización: tareas, materias, malla, calendario y repaso.

Es para uso personal: un solo usuario.

## 2. Decisiones tomadas

| Tema | Decisión |
|---|---|
| Usuarios | Solo yo. La suscripción de Claude es personal y se usa solo para mí. |
| Telegram | Se elimina. Todo se encarga y se gestiona en la web. |
| Servidor del bot | Oracle Cloud (plan Always Free, VM ARM). La laptop deja de trabajar para el bot. |
| Base de datos y archivos | Supabase. |
| Web | Next.js desplegado en Vercel (plan gratuito). |
| Modelos | Claude (suscripción) para los pasos críticos y Gemini (nivel gratuito) para los mecánicos. Grok queda en duda (ver 7.1). |
| Automatizaciones | n8n en la misma VM de Oracle, solo como pegamento entre servicios, no para el generador. |
| NotebookLM | Fuera del sistema: no tiene API para cuentas personales. Sirve para estudiar a mano los PDF. |

## 3. Diagnóstico de partida

- **Lo que más cupo gasta no es el bot, sino depurarlo en sesiones interactivas.** Medido: el bot gastó 17,8 USD (2-oct) y 8,7 USD (3-oct) a precio de lista; las sesiones interactivas que lo arreglaban, unos 293 y 176 USD. Un documento cuesta entre 3 y 15 USD.
- La calidad del bot se apoya en verificaciones hechas con Python, no en la confianza en el modelo:
  - citas literales comprobadas contra la fuente;
  - bibliografía tomada por DOI;
  - barrera de entrega sin cajas «Pendiente»;
  - recetas de errores de LaTeX.
  
  Estas verificaciones son lo que permite usar modelos más baratos sin bajar la calidad, y no se tocan.
- Lecciones previas que siguen valiendo:
  - Haiku inventa datos.
  - Sonnet sin fichas mete afirmaciones sin respaldo.
  - El costo es turnos × contexto releído.
- La regla «entrega completa a la primera» sigue vigente: ningún cambio de modelo puede entregar con huecos.

## 4. Arquitectura

```
Web (Next.js en Vercel) ──► Supabase: base de datos, archivos, login, tiempo real, vectores
                                   ▲
                                   │ toma trabajos de la cola y publica el avance
Oracle VM (ARM, Ubuntu) ───────────┘
  ├─ trabajador: el paquete `umss` actual, sin reescribir
  ├─ TeX Live, chromium, Claude Code con la sesión de la suscripción
  ├─ router de modelos: Claude / Gemini
  └─ n8n
```

### 4.1 Oracle VM

- Corre el generador actual. Cambia solo de dónde lee la cola: Supabase en lugar de SQLite.
- Lleva TeX Live completo, chromium (descarga de páginas con JavaScript), fuentes y Claude Code iniciado con la suscripción, usando un token de larga duración.
- El trabajador corre como servicio permanente. La regla de «arranque limpio» es para la laptop, no para el servidor.
- Respaldos periódicos de lo que solo exista en la VM.
- Riesgos del plan gratuito, reportados en 2026 y por verificar en la consola:
  - **El plan se habría recortado** de 4 núcleos y 24 GB a 2 núcleos y 12 GB. Sigue alcanzando para el trabajador, TeX y n8n.
  - **Oracle reclama las VM gratuitas con poco uso de CPU**, y el bot pasa horas inactivo. Lo habitual es pasar la cuenta a «Pay As You Go», que sigue sin cobrar mientras no se excedan los límites gratuitos. Hay que confirmarlo.
  - **Pedir más recursos de los gratuitos desactiva las instancias.**
  - **A veces no hay capacidad ARM** en la región elegida.

### 4.2 Supabase

- **Postgres:** cola y estado de cada trabajo (hoy en `cola.sqlite3` y `estado.json`), materias, tareas, malla, calendario, fichas y fuentes.
- **Storage:** PDF entregados y fuentes descargadas.
- **Auth:** un solo usuario (yo).
- **Realtime:** el avance del trabajo en vivo en la web.
- **pgvector:** búsqueda de pasajes en las fuentes en español e inglés a la vez. Ataca de raíz el error de «consultas solo en inglés».
- **Límites del plan gratuito:**
  - 500 MB de base de datos y 1 GB de archivos;
  - el proyecto se pausa tras 1 semana sin actividad. Un ping diario desde la VM lo evita.

### 4.3 Vercel

- La web en Next.js: interfaz y llamadas a Supabase.
- No compila LaTeX ni corre el generador: TeX Live pesa varios GB y las funciones tienen límites de tiempo.

### 4.4 Modelos

- **Claude**, con la suscripción: esquema, redacción de secciones y revisión.
- **Gemini Flash / Flash-Lite**, nivel gratuito:
  - extraer pasajes para fichas;
  - pistas y consultas de búsqueda;
  - glosario;
  - limpieza de bibliografía;
  - errores de LaTeX que las recetas no cubren;
  - quizzes y tarjetas de repaso.
- **Embeddings**: Gemini (gratis) o un modelo local multilingüe (`bge-m3`).
- **Regla para mover un paso a un modelo gratuito:** solo si pasa las mismas verificaciones en una prueba A/B contra un documento de referencia (el trabajo 13).
- **Nivel gratuito de Gemini:**
  - cubre Flash y Flash-Lite, no Pro;
  - tiene límites por minuto y por día que cambian; lo que manda es la cuota que muestra Google AI Studio;
  - Google puede usar los datos para mejorar sus productos.

### 4.5 n8n

Solo para conectar servicios:

- recordatorios de entregas y parciales;
- sincronización con Google Tasks y Google Calendar (opcional);
- resumen semanal por correo;
- vigilar la página de la UMSS por notas y avisos.

## 5. La web

El bot es el centro; lo demás lo rodea.

1. **Bot**
   - encargar un documento (materia, tema, páginas e indicaciones; con o sin aprobación del esquema);
   - ver la cola y el avance paso a paso en vivo;
   - aprobar el esquema cuando se pida;
   - descargar los PDF y la ficha de repaso;
   - ver los errores del bot (lo que hoy da `umss errores`) y el consumo por documento y por paso.
2. **Tareas**, al estilo Google Tasks: listas, fechas, subtareas y recordatorios. Sincronización opcional con Google Tasks vía n8n.
3. **Materias:** horario, docente, unidades, parciales, notas y los documentos del bot de cada materia.
4. **Malla:** árbol de prerrequisitos de la carrera, por estado:
   - aprobadas;
   - cursando;
   - disponibles para tomar;
   - bloqueadas, con lo que falta para cada una.
5. **Calendario:** parciales, entregas y clases.
6. **Repaso:** tarjetas y quizzes generados de cada documento, con repetición espaciada.
7. **Consumo:** cupo de 5 horas y semanal, gasto por documento (como el tablero de Claude Code).

## 6. Fases

| Fase | Contenido | Dónde |
|---|---|---|
| 0. Medir | Costo por paso desde `datos/uso.jsonl`; inventario de lo que el generador necesita para correr en la VM (paquetes TeX, fuentes, chromium, binarios). | Local, sin costo |
| 1. Router de modelos | Capa Claude/Gemini por paso; pruebas A/B contra el trabajo 13; mover solo lo que pase las verificaciones. | Local |
| 2. Supabase | Esquema de base de datos; migrar la cola y el estado; el trabajador lee y escribe en Supabase (aún en la laptop, para probar). | Local + Supabase |
| 3. Oracle VM | Crear la VM; instalar TeX, chromium y Claude Code; trabajador como servicio; respaldos; ping a Supabase. | Oracle |
| 4. Web mínima | Login, encargar, cola en vivo, PDF. Aquí se apaga Telegram. | Vercel |
| 5. Vida universitaria | Tareas, materias, malla y calendario. | Vercel + Supabase |
| 6. n8n y repaso | Automatizaciones, tarjetas y quizzes. | Oracle |

Cada fase se cierra con sus pruebas (la plantilla ya tiene 92) antes de pasar a la siguiente.

## 7. Pendiente de decidir o hacer

### 7.1 Grok

La API de xAI no tiene hoy un nivel gratuito publicado en sus páginas: cobra por token. El crédito de 25 USD fue una promoción de 2024, y el programa de 150 USD al mes por compartir datos parece terminado. Opciones:

- quedarse con Claude + Gemini;
- usar Grok con un saldo pequeño;
- usar Groq (empresa distinta, con nivel gratuito para modelos abiertos).

Revisar la consola de xAI antes de decidir.

### 7.2 Preguntas abiertas

- **Malla:** ¿de qué carrera es y de dónde sale el plan de estudios (PDF propio o la página de la UMSS)?
- **Correo:** hoy los PDF también llegan por correo. ¿Se quita junto con Telegram o queda como respaldo?
- **Obsidian:** las fichas se escriben hoy en el vault de la laptop. ¿Pasan a vivir en Supabase, con sincronización hacia el vault, o se deja de usar Obsidian para esto?

### 7.3 Cuentas (las crea el usuario)

- Oracle Cloud: pide tarjeta para verificar. Elegir una región con capacidad ARM.
- Google AI Studio: API key de Gemini.
- Vercel: entrar con GitHub.
- GitHub: un repositorio privado para el código.
- Supabase: ya está conectado. Revisar cuántos proyectos gratuitos quedan libres (katinails usa uno).

## 8. Fuentes

- [xAI — API Public Beta](https://x.ai/news/api)
- [benchlm — xAI Grok API Free Tier](https://benchlm.ai/free-tier/xai)
- [aitoolsrecap — Free Grok API credits 2026](https://aitoolsrecap.com/Blog/how-to-get-free-grok-api-credits-2026)
- [tinkerllm — Gemini API Free Tier Limits 2026](https://tinkerllm.com/blog/gemini-api-free-tier-limits-rate-quotas/)
- [aifreeapi — Gemini API Free Tier Guide 2026](https://www.aifreeapi.com/en/posts/gemini-api-free-tier-complete-guide)
- [Oracle — Always Free Resources](https://docs.oracle.com/en-us/iaas/Content/FreeTier/resourceref.htm)
- [braindetox — Oracle Always Free Tier Cut 2026](https://braindetox.kr/en/posts/oracle_always_free_tier_reduced_2026.html)
- [space-node — Oracle Cloud Free VPS 2026](https://space-node.net/blog/oracle-cloud-free-vps-guide-2026)
