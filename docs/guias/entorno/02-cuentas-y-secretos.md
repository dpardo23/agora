# Guía 2 · Cuentas y secretos

Versión 1.11 · creado el 2026-10-21 · editado el 2026-11-01 · autor: Juan Diego Pardo Pozo

Qué cuentas crear, en qué orden, qué opción elegir en cada pantalla y dónde guardar cada clave. Corresponde al ítem T-13 del SPRINT-00 y lo hace el titular a mano.

## 1. Reglas para los secretos

1. Cada clave se guarda **primero en el gestor de contraseñas** (guía 1, sección 8). Solo pasa a un `.env.local` si un programa local la necesita (sección 10); las credenciales de la nube de Supabase nunca van a un `.env.local`.
2. Ninguna clave se escribe en el código, en un documento, en un issue ni en el chat. El hook `pre-commit`, el CI y gitleaks lo vigilan, pero la primera barrera eres tú.
3. Las claves de **servidor** (secret key de Supabase, Gemini, token de Claude, OAuth de Google) nunca llevan el prefijo `NEXT_PUBLIC_`: ese prefijo las publica en el navegador.
4. Si una clave se filtra: se **revoca y se genera otra** en el servicio. Borrarla del repositorio no basta.

### 1.1. CLI de Bitwarden

Si el gestor es Bitwarden, su CLI (`bw`) permite guardar secretos desde la terminal sin copiarlos a mano. La CLI es independiente de la aplicación de escritorio: tiene su propio inicio de sesión y su propio bloqueo. Todo funciona con la cuenta gratuita.

#### Entradas del gestor

Todas van en la carpeta «Ágora», con el formato `Servicio · qué es` (el `·` es un punto medio) y sin espacios al inicio del nombre, para que los comandos las encuentren. Los secretos van en campos **ocultos**.

| Entrada | Tipo | Contenido |
|---|---|---|
| `Oracle Cloud` | Inicio de sesión | Acceso a la consola; campo `Codigo de Bypass` (código de respaldo del 2FA) |
| `Oracle · llave SSH agora-vm` | Nota segura | Llave privada en la nota; campos `publica` y `passphrase` (sección 3.3) |
| `Supabase · agora-dev` | Inicio de sesión | Contraseña de la base en el campo **Contraseña**; campos `project_url`, `project_id`, `publishable_key`, `secret_key` y `agora-cli` (token personal) (sección 4) |
| `Google · cuenta y proyecto agora` | Inicio de sesión | Acceso a la consola de Google Cloud (sección 5) |
| `Google · cliente OAuth agora-worker` | Nota segura | JSON del cliente de escritorio (sección 5) |
| `Google · Gemini API key` | Inicio de sesión | Campos `Clave API` y `Nombre del Proyecto` (sección 6) |
| `Claude · token worker` | Inicio de sesión | Campo `CLAUDE_CODE_OAUTH_TOKEN` (sección 7) |

Si una entrada creada en la aplicación no aparece en la CLI, falta `bw sync`.

#### Antes de copiar comandos

- Copia **un bloque por vez** y ejecútalo antes de pasar al siguiente. Cada línea de un bloque es un comando completo.
- Si al pegar una línea se parte en dos (pasa al copiar desde el PDF), la terminal la ejecuta por pedazos y falla. Únela antes de pulsar Enter.
- Nunca pegues en un chat, issue o documento la salida de un comando que muestre una llave, una passphrase o la clave de sesión.

#### Configuración inicial (una sola vez)

**Paso 1.** Instalar la CLI y `jq`:

```sh
sudo pacman -S --needed bitwarden-cli jq
```

**Paso 2.** Comprobar la versión:

```sh
bw --version
```

**Paso 3.** Elegir el servidor. Por omisión es `bitwarden.com`; si tu cuenta está en la región europea, usa `https://vault.bitwarden.eu`:

```sh
bw config server https://vault.bitwarden.com
```

**Paso 4.** Iniciar sesión. Pide el correo, la contraseña maestra y el código de dos pasos si lo tienes activado:

```sh
bw login
```

Al terminar muestra una clave de sesión y sugiere usarla con `--session`. Ignórala: la sesión se abre como indica la rutina de uso. `bw login` no se repite mientras no hagas `bw logout`.

**Paso 5.** Desbloquear la bóveda (igual que el paso 1 de la rutina de uso):

```sh
export BW_SESSION=$(bw unlock --raw)
```

**Paso 6.** Buscar la carpeta «Ágora»:

```sh
bw list folders --search "Ágora" | jq -r '.[].name'
```

Si muestra `Ágora`, salta al paso 8.

**Paso 7.** Crear la carpeta, solo si el paso 6 no mostró nada:

```sh
bw get template folder | jq '.name="Ágora"' | bw encode | bw create folder
```

**Paso 8.** Bloquear la bóveda:

```sh
bw lock
```

#### Rutina de uso (cada vez)

`BW_SESSION` y `FOLDER_ID` solo existen en la terminal donde se definen. En una terminal nueva se repite desde el paso 1.

**Paso 1.** Desbloquear. Pide la contraseña maestra:

```sh
export BW_SESSION=$(bw unlock --raw)
```

**Paso 2.** Traer los cambios hechos desde otros dispositivos:

```sh
bw sync
```

**Paso 3.** Comprobar el estado. Debe mostrar `unlocked`:

```sh
bw status | jq -r .status
```

**Paso 4.** Guardar el identificador de la carpeta «Ágora»:

```sh
FOLDER_ID=$(bw list folders --search "Ágora" | jq -r '.[0].id')
```

**Paso 5.** Comprobar el identificador. Debe ser un texto largo con guiones, no `null` ni un JSON:

```sh
echo "$FOLDER_ID"
```

**Paso 6.** Usar `bw` para lo que haga falta. Por ejemplo, listar lo que hay en la carpeta:

```sh
bw list items --folderid "$FOLDER_ID" | jq -r '.[].name'
```

**Paso 7.** Al terminar todo, y no antes, bloquear la bóveda. Después de `bw lock` hay que volver al paso 1:

```sh
bw lock
```

Opcional: dos alias en `~/.zshrc` acortan los pasos 1, 2 y 7.

```sh
alias bwu='export BW_SESSION=$(bw unlock --raw) && bw sync'
alias bwl='bw lock && unset BW_SESSION'
```

## 2. Orden recomendado

| Orden | Servicio | Hace falta para | Tiempo aproximado |
|---|---|---|---|
| 1 | Oracle Cloud (cuenta y VM) | La VM del worker (SPRINT-07) | 30 min, o días si no hay capacidad ARM: por eso va primero |
| 2 | Supabase | Datos en la nube y CD | 10 min |
| 3 | Google Cloud | Drive, y más adelante Gmail, Calendar y Tasks | 20 min |
| 4 | Google AI Studio | Gemini | 5 min |
| 5 | Claude | El worker | 5 min |
| 6 | GitHub (secretos y environments) | CD de migraciones | 10 min |
| 7 | Vercel | Previews y producción de la web | 10 min, **después de T-01** |

## 3. Oracle Cloud y la VM

### 3.1. Cuenta

1. Entra en https://signup.cloud.oracle.com y crea la cuenta con tu correo. Pide una tarjeta para verificar identidad: débito o crédito con logo (Visa, Mastercard, American Express, Discover) que no pida PIN. **No acepta** tarjetas virtuales, de prepago ni de un solo uso. Hace una retención temporal de bajo importe que se anula sola; tu banco puede cobrar una comisión por la operación internacional.
2. **La cuenta se queda en Free Tier.** Nunca se sube de nivel a *Pay As You Go*: en Free Tier Oracle no puede cobrar nada, y al terminar los 30 días de prueba solo se detiene lo que no es *Always Free*. Crea solo recursos marcados como *Always Free-eligible*.
3. **Home region:** elige `Brazil East (Sao Paulo)` o `Chile Central (Santiago)`, las más cercanas a Bolivia. **No se puede cambiar después**, y los recursos gratuitos solo existen en la región de origen.

### 3.2. Cupo gratuito vigente

Según la documentación de Oracle consultada el 2026-10-21, las cuentas *Always Free* tienen para la forma Ampere A1 el equivalente a **2 OCPU y 12 GB de memoria** en total (antes eran 4 y 24), y 200 GB de almacenamiento en bloque entre todos los discos. Una instancia cuenta como **inactiva** y puede ser reclamada si, durante 7 días, la CPU (percentil 95), la red y la memoria están por debajo del 20 %. Ágora ya lo contempla: HU-08.02 vigila ese riesgo.

### 3.3. Llave SSH para la VM

La VM no tiene contraseña: se entra solo con una pareja de llaves. La **pública** (`~/.ssh/agora-vm.pub`) se pega en Oracle al crear la instancia. La **privada** (`~/.ssh/agora-vm`) queda en tu PC, protegida con una passphrase, y su único respaldo es una nota segura en Bitwarden. Es una llave distinta de `id_ed25519` (GitHub y firma, guía 1, sección 5.3) para poder revocar una sin tocar la otra.

Se guarda como nota segura y no como adjunto porque los adjuntos de Bitwarden son de pago: la llave privada va en el texto de la nota, y la pública y la passphrase como campos.

#### Preparar la terminal

**Paso 1.** Abrir la sesión de Bitwarden con la rutina de uso de la sección 1.1, pasos 1 a 5. Al final, `echo "$FOLDER_ID"` debe mostrar el identificador de la carpeta «Ágora».

#### Crear la llave

**Paso 2.** Generar la passphrase. Queda en la variable `PASS` y no se muestra:

```sh
PASS=$(bw generate --passphrase --words 5 --separator -)
```

**Paso 3.** Crear la pareja de llaves protegida con esa passphrase:

```sh
ssh-keygen -t ed25519 -f ~/.ssh/agora-vm -C "agora-vm" -N "$PASS"
```

#### Armar la nota

La nota se arma por partes en la variable `J`. Ninguno de estos pasos muestra nada en pantalla.

**Paso 4.** Partir de la plantilla de Bitwarden:

```sh
J=$(bw get template item)
```

**Paso 5.** Convertirla en nota segura, sin datos de inicio de sesión ni campos:

```sh
J=$(jq '.type=2 | .secureNote={type:0} | .login=null | .fields=[]' <<< "$J")
```

**Paso 6.** Ponerle nombre:

```sh
J=$(jq --arg v "Oracle · llave SSH agora-vm" '.name=$v' <<< "$J")
```

**Paso 7.** Asignarla a la carpeta «Ágora»:

```sh
J=$(jq --arg v "$FOLDER_ID" '.folderId=$v' <<< "$J")
```

**Paso 8.** Copiar la llave privada al texto de la nota:

```sh
J=$(jq --rawfile v ~/.ssh/agora-vm '.notes=$v' <<< "$J")
```

**Paso 9.** Leer la llave pública:

```sh
PUB=$(cat ~/.ssh/agora-vm.pub)
```

**Paso 10.** Agregar la llave pública como campo de texto:

```sh
J=$(jq --arg v "$PUB" '.fields+=[{name:"publica",value:$v,type:0}]' <<< "$J")
```

**Paso 11.** Agregar la passphrase como campo oculto:

```sh
J=$(jq --arg v "$PASS" '.fields+=[{name:"passphrase",value:$v,type:1}]' <<< "$J")
```

#### Guardar y limpiar

**Paso 12.** Crear la nota en Bitwarden. Solo debe mostrar `guardada`:

```sh
bw encode <<< "$J" | bw create item > /dev/null && echo "guardada"
```

**Paso 13.** Borrar de la terminal las variables con secretos:

```sh
unset J PUB PASS
```

#### Comprobar

**Paso 14.** La nota está en la carpeta. Debe aparecer `Oracle · llave SSH agora-vm`:

```sh
bw list items --folderid "$FOLDER_ID" | jq -r '.[].name'
```

**Paso 15.** Los dos archivos existen. La privada debe tener permisos `-rw-------`:

```sh
ls -l ~/.ssh/agora-vm ~/.ssh/agora-vm.pub
```

**Paso 16.** Mostrar la llave pública. Esta línea, completa, es la que se pega en Oracle (sección 3.4); es la única que se puede mostrar sin riesgo:

```sh
cat ~/.ssh/agora-vm.pub
```

**Paso 17.** Opcional: cargar la llave en el agente SSH para no escribir la passphrase en cada conexión durante la sesión. Pide la passphrase, que está en el campo oculto de la nota:

```sh
ssh-add ~/.ssh/agora-vm
```

**Paso 18.** Bloquear la bóveda:

```sh
bw lock
```

#### Si algo falla

- **Un paso de «Armar la nota» falla:** no se guardó nada. Vuelve al paso 4; la llave del paso 3 sigue sirviendo.
- **La llave privada o la passphrase se mostraron en pantalla y terminaron en un chat o archivo:** si la llave aún no está registrada en Oracle, borra los dos archivos de la llave y la nota (si ya existe) y repite desde el paso 2. Si ya está registrada, además reemplázala en la VM.
- **Perdiste `~/.ssh/agora-vm`:** copia el texto de la nota a ese archivo y aplica `chmod 600 ~/.ssh/agora-vm`.

### 3.4. Crear la red y la instancia

La consola en español no usa los nombres de la documentación en inglés: *Compute* es «Recursos informáticos», *Shape* es «Unidad», *Networking* es «Red» y *Boot volume* es «Volumen de inicio». La región São Paulo tiene **un solo dominio de disponibilidad** (AD-1).

La red se crea **antes** que la instancia. Si se elige «Crear nueva red virtual en la nube» dentro del formulario de la instancia, la consola bloquea el prefijo de la subred y la IP pública, y no se puede continuar.

#### Crear la red (una sola vez)

**Paso 1.** Comprobar que arriba a la derecha diga **Brazil East (Sao Paulo)** y entrar en **☰ → Redes → Redes virtuales en la nube**. A la izquierda, **Compartimento:** `jdiegopardo23 (raíz)`.

**Paso 2.** Pulsar **Acciones → Iniciar asistente de VCN**, elegir **Crear VCN con conexión a Internet** y pulsar **Iniciar asistente de VCN**.

**Paso 3.** Llenar la configuración y pulsar **Siguiente**:

| Campo | Valor |
|---|---|
| Nombre de VCN | `agora-vcn` |
| Compartimento | `jdiegopardo23 (raíz)` |
| Bloque de CIDR de la VCN | `10.0.0.0/16` (por defecto) |
| Subred pública | `10.0.0.0/24` (por defecto) |
| Subred privada | `10.0.1.0/24` (por defecto; no se usa, pero el asistente la crea) |
| IPv6 | Apagado |

**Paso 4.** En **Revisar y crear**, comprobar que la subred pública use el **Gateway de Internet** y que su lista de seguridad permita «Tráfico TCP para puertos: 22» desde `0.0.0.0/0`. Pulsar **Crear** y esperar a que todos los pasos salgan en verde. La VCN, las subredes y los gateways no tienen costo.

#### Crear la instancia: información básica

**Paso 5.** Entrar en **☰ → Recursos informáticos → Instancias → Crear instancia**. Si el formulario ya estaba abierto antes de crear la red, cancélalo y ábrelo de nuevo: no recarga la lista de redes.

**Paso 6.** **Nombre:** `agora-vm`. **Crear en compartimento:** `jdiegopardo23 (raíz)`.

**Paso 7.** **Ubicación:** `AD 1`. En sus **Opciones avanzadas**:

- **Tipo de capacidad:** «Capacidad bajo demanda». Nunca «Capacidad preferente»: Oracle puede reclamar esa instancia en cualquier momento.
- **Grupo de colocación de cluster:** apagado.
- **Dominio de errores:** vacío, para que Oracle elija.

**Paso 8.** Elegir la **unidad** antes que la imagen. Pulsar **Cambiar unidad**, elegir **Máquina virtual**, la serie **Ampere** y marcar `VM.Standard.A1.Flex`. Ajustar **Número de OCPU** a `2` y **Cantidad de memoria (GB)** a `12`, dejar **Activar rendimiento ampliable** apagado y pulsar **Seleccionar unidad**. Debe aparecer la etiqueta **«Siempre gratis elegible»**; si no aparece, no sigas.

**Paso 9.** Pulsar **Cambiar imagen**, elegir **Ubuntu**, marcar **Canonical Ubuntu 24.04** (no la variante «Minimal» ni otra versión) y pulsar **Seleccionar imagen**. Como la unidad ya es Ampere, Oracle toma la compilación aarch64. En el resumen, **Sistema operativo** debe decir Canonical Ubuntu 24.04.

**Paso 10.** En las **Opciones avanzadas** de gestión:

- **Es necesaria una cabecera de autorización** (IMDSv2): encendido.
- **Script cloud-init:** vacío. La configuración de la VM es de SPRINT-07 (T-07).
- **Etiquetas:** ninguna.
- **Migración en directo:** «Permitir a Oracle Cloud Infrastructure elegir la mejor opción de migración».
- **Restaurar el estado del ciclo de vida de la instancia tras el mantenimiento:** encendido.
- **Oracle Cloud Agent:** lo predeterminado, con **Supervisión de instancias informáticas** activado (sus métricas las usa HU-08.02).

Pulsar **Siguiente**.

#### Crear la instancia: seguridad

**Paso 11.** **Instancia blindada:** apagado. **Atributos de seguridad:** ninguno. Pulsar **Siguiente**.

#### Crear la instancia: red

**Paso 12.** **Nombre de VNIC:** `agora-vm-vnic`, sin espacios ni puntos al final.

**Paso 13.** **Red principal:** «Seleccionar red virtual existente en la nube». **Compartimento:** `jdiegopardo23 (raíz)`. **Red virtual en la nube:** `agora-vcn`.

**Paso 14.** **Subred:** «Seleccionar subred existente». **Compartimento:** `jdiegopardo23 (raíz)`. **Subred:** `subred pública-agora-vcn (regional)`. Nunca la privada: desde ella no se puede entrar por SSH.

**Paso 15.** Revisar las direcciones:

- **Prefijos IPv4 de subred:** `10.0.0.0/24` (se llena solo).
- **Dirección IPv4 privada:** «Asignar automáticamente dirección IPv4 privada».
- **Asignar automáticamente dirección IPv4 pública:** encendido. Sin esto no hay acceso por SSH.
- **Asignar dirección IPv6 de prefijo de subred:** apagado.

**Paso 16.** **Agregar claves SSH:** elegir **Pegar clave pública** y pegar la línea completa que muestra `cat ~/.ssh/agora-vm.pub` (sección 3.3, paso 16), desde `ssh-ed25519` hasta `agora-vm`. No elijas «Generar un par de claves para mí» ni pulses los botones **Descargar**. Pulsar **Siguiente**.

#### Crear la instancia: almacenamiento

**Paso 17.** En **Volumen de inicio**:

- Encender **Especificar un valor de rendimiento y un tamaño de volumen de inicio personalizado**.
- **Tamaño de volumen de inicio (GB):** `100`.
- **Rendimiento de volumen de inicio (VPU):** `10` (equilibrado). Un valor mayor sale del cupo gratuito.
- **Usar cifrado en tránsito:** encendido.
- **Cifre este volumen con una clave que gestione:** apagado. Oracle ya cifra el disco en reposo con sus claves; una clave propia exige un Vault y, si se borra, se pierde el disco.
- **Volúmenes en bloque:** ninguno.

Se usan 100 GB y no 200 porque el volumen de inicio puede crecer después sin apagar la VM, pero nunca reducirse, y los 200 GB gratuitos se reparten entre todos los volúmenes. Ubuntu, TeX Live, Chromium, Docker y n8n ocupan unos 30 GB.

Pulsar **Siguiente**.

#### Revisar y crear

**Paso 18.** Repasar el resumen contra los pasos 6 a 17. **Ver costo estimado** muestra unos 4,25 USD al mes por el volumen de inicio: la calculadora usa el precio de lista y no descuenta Always Free. No se cobra (sección 3.1).

**Paso 19.** Pulsar **Crear** (no **Guardar como pila**, salvo en el caso de la subsección siguiente). El estado pasa de «Aprovisionando» a «En ejecución» en uno a tres minutos.

#### Si no hay capacidad

El error es «Capacidad insuficiente en la unidad VM.Standard.A1.Flex en el dominio de disponibilidad AD-1». No se crea ni se cobra nada. Como São Paulo tiene un solo dominio de disponibilidad, la única salida es reintentar; puede tardar días y mientras tanto se puede seguir con el resto de las cuentas.

**Paso A.** Cerrar el error y pulsar **Crear** de nuevo dos o tres veces, con uno o dos minutos entre intentos.

**Paso B.** Si sigue fallando, pulsar **Guardar como pila**, con el nombre `agora-vm-pila` en `jdiegopardo23 (raíz)`. Así no hay que volver a llenar el formulario.

**Paso C.** Para cada reintento: **☰ → Servicios para desarrolladores → Gestor de recursos → Pilas → `agora-vm-pila` → Aplicar**. Si el trabajo falla por capacidad, no deja recursos creados; se vuelve a pulsar **Aplicar** más tarde. Suele haber más capacidad de madrugada y temprano en la mañana.

**Paso D.** Si después de varios días no hay capacidad, se puede probar con 1 OCPU y 6 GB y ampliar después (hay que apagar la VM y también depende de la capacidad). Es una decisión del titular. **Nunca** se sube la cuenta a Pay As You Go para conseguir capacidad (sección 3.1).

#### Comprobar

**Paso 20.** En la página de la instancia, copiar la **Dirección IPv4 pública** y guardarla en la nota «Oracle · llave SSH agora-vm» de Bitwarden, como un campo `ip`.

**Paso 21.** Entrar por SSH, reemplazando `IP-PUBLICA` por la dirección. La primera vez pregunta si confías en el servidor: responde `yes`. Después pide la passphrase de la llave.

```sh
ssh -i ~/.ssh/agora-vm ubuntu@IP-PUBLICA
```

**Paso 22.** Dentro de la VM, comprobar la arquitectura. Debe mostrar `aarch64`:

```sh
uname -m
```

**Paso 23.** Salir de la VM:

```sh
exit
```

La configuración de la VM (usuario de servicio, Docker, TeX Live, respaldos) se hace en SPRINT-07 (T-07), y n8n en SPRINT-11 (T-08). Hasta entonces la VM puede contar como inactiva (sección 3.2): revisa el correo por avisos de Oracle sobre instancias inactivas.

## 4. Supabase

Se crea el proyecto en la nube `agora-dev`, que hace de *staging*. El de producción se crea más adelante, al acercarse el primer release.

Límites del plan Free que conviene recordar:

- Cada usuario puede tener **2 proyectos gratuitos activos en total**, sumando todas las organizaciones donde sea propietario o administrador. Crear otra organización no da más cupo; los proyectos pausados no cuentan.
- Un proyecto se pausa solo tras 7 días sin actividad y se reactiva desde el panel sin perder datos. Uno pausado más de 90 días ya no se reactiva desde el panel.
- El cupo para el proyecto de producción está pendiente de decisión (backlog, sección 4).

#### Antes de empezar

- El navegador puede tomar el formulario de nuevo proyecto por una pantalla de inicio de sesión y rellenar el nombre con tu correo y la contraseña de la base con una contraseña guardada. Rechaza el autocompletado en `supabase.com` y copia cada valor desde Bitwarden.
- En Bitwarden, carpeta «Ágora», crea una entrada de tipo **Inicio de sesión** llamada `Supabase · agora-dev` (sección 1.1, «Entradas del gestor»). Se llena en los pasos siguientes: la contraseña de la base en el campo **Contraseña**, y los campos personalizados `project_id`, `project_url`, `publishable_key`, `secret_key` (oculto) y `agora-cli` (oculto).

#### Organización

**Paso 1.** Entrar en https://supabase.com/dashboard con **Continue with GitHub**.

**Paso 2.** No usar una organización creada desde Vercel. Se reconoce porque su dirección contiene `vercel_icfg_`: la administra Vercel (la facturación pasa por Vercel y quitar la integración puede borrar sus proyectos). No desinstales esa integración en Vercel si otros proyectos tuyos la usan; una organización vacía no cuesta nada.

**Paso 3.** En el selector de organizaciones (arriba a la izquierda), elegir **New organization**: nombre `agora`, tipo **Personal**, plan **Free**. Comprobar que la dirección ya no contenga `vercel_icfg_`.

#### Contraseña de la base

**Paso 4.** En el generador de Bitwarden, crear una contraseña de 32 caracteres o más, solo con letras y números (los símbolos complican las cadenas de conexión). Guardarla en el campo **Contraseña** de la entrada y guardar la entrada **antes** de seguir: Supabase no la vuelve a mostrar.

#### Proyecto

**Paso 5.** Pulsar **New project** y llenar el formulario:

| Campo | Valor |
|---|---|
| Organization | `agora` (FREE) |
| GitHub (optional) | Vacío. Las migraciones las aplica el CD de GitHub Actions (sección 8); conectar también la integración de Supabase daría dos caminos de despliegue |
| Project name | `agora-dev` |
| Database password | La de Bitwarden (paso 4), no «Generate a password» |
| Region | **South America (São Paulo)**. Si solo aparece «Americas», pulsar «¿Necesitas una región específica?» |
| Enable Data API | Activado: la web la usa con supabase-js |
| Automatically expose new tables | **Desactivado**, como recomienda Supabase. Ninguna tabla queda expuesta sin decidirlo: cada migración lleva sus `GRANT` explícitos |
| Enable automatic RLS | Activado |
| Advanced configuration | **Postgres** (no OrioleDB, que está en beta) |

**Paso 6.** Pulsar **Create new project** y esperar unos dos minutos.

**Paso 7.** En **Project Settings → General → Service versions**, comprobar que **Postgres version** sea **17.x**, la misma que usa Supabase local.

#### Identificadores y llaves

**Paso 8.** En **Project Settings → General**, el **Project ID** es el *project ref*. Copiarlo al campo `project_id`. **Project region** debe decir `sa-east-1`.

**Paso 9.** La URL del proyecto es `https://<project_ref>.supabase.co`; también aparece en **Integrations → Data API**. Copiarla al campo `project_url`.

**Paso 10.** En **Project Settings → API Keys**, abrir la pestaña **Publishable and secret API keys**, no la de **Legacy anon, service_role API keys** (Supabase retira esas llaves a fines de 2026):

- **Publishable key** (`sb_publishable_…`): pública, para el navegador. Campo `publishable_key`.
- **Secret key** (`sb_secret_…`): de servidor; ignora RLS. Campo oculto `secret_key`.

No pulses **Disable JWT-based API keys** todavía: se hace cuando el código ya use solo las llaves nuevas.

#### Token personal

El token es para la CLI local y para el CD (sección 8). El MCP de Supabase no lo reutiliza: se autoriza con OAuth y se limita al proyecto con su `project_ref`; si alguna vez necesitara un token, se crea otro aparte (`agora-mcp`) para poder revocar cada uno por separado.

**Paso 11.** Entrar en **avatar → Account → Access Tokens → Generate token** y llenar:

| Campo | Valor |
|---|---|
| Name | `agora-cli` |
| Expires in | 90 days |
| Resource access | **Project** → organización `agora` → proyecto `agora-dev` |
| Permissions | Preset **Full access** y, después, desplegar **Account and organization** y bajar cada permiso a **Read** (o **None** si lo ofrece). El preset pasa a «Custom»; Project, Database, Application services e Infrastructure and delivery quedan con lectura y escritura |

**Paso 12.** Pulsar **Review access**, comprobar el resumen y pulsar **Generate token**. El token se muestra **una sola vez**: guardarlo en el campo oculto `agora-cli` de la entrada `Supabase · agora-dev`, y anotar la fecha de vencimiento (90 días) en las notas de la entrada. Al vencer, se genera otro y se actualiza también el secreto de GitHub (sección 8).

#### Seguridad de la cuenta y del proyecto

**Paso 13.** Activar el **2FA** de la cuenta de Supabase en **avatar → Account preferences → Security → Multi-factor authentication**, con una app TOTP. Si muestra códigos de respaldo, guardarlos en Bitwarden.

**Paso 14.** En **Authentication → Sign In / Providers**, desactivar **Allow new users to sign up**: Ágora no tiene registro público (HU-03.01, RN-7). Dejar **Email** activo y no activar ningún proveedor social. Google tampoco: Ágora lo usa para Drive y otros servicios (sección 5), no para iniciar sesión.

**Paso 15.** En **Database → Settings → SSL Configuration**, activar **Enforce SSL on incoming connections**.

**Paso 16.** En **Advisors → Security Advisor**, pulsar **Rerun linter**. Debe mostrar **0 errores**. Los dos avisos esperados («Public Can Execute SECURITY DEFINER Function» y «Signed-In Users Can Execute SECURITY DEFINER Function» sobre `public.rls_auto_enable()`) vienen de la opción «Enable automatic RLS»: esa función de *event trigger* no se puede invocar directamente, y su permiso de ejecución se quita en la primera migración (T-03), no a mano en el SQL Editor.

#### MCP de Supabase para Claude Code

El servidor MCP de Supabase permite que Claude Code consulte el proyecto (esquema, logs, avisos y documentación) con permiso del titular en cada llamada. En la carpeta de Ágora se configura **solo para `agora-dev` y en modo de solo lectura**, con ámbito local: la configuración queda en `~/.claude.json`, no en el repositorio, y reemplaza dentro de esta carpeta a cualquier servidor `supabase` de ámbito de usuario (que seguiría teniendo acceso a todos los proyectos de la cuenta).

**Paso 17.** Desde la carpeta del repositorio, guardar la URL del servidor, reemplazando `<project_ref>` por el del paso 8:

```sh
URL="https://mcp.supabase.com/mcp?project_ref=<project_ref>&read_only=true"
```

**Paso 18.** Agregar el servidor con ámbito local:

```sh
claude mcp add --transport http -s local supabase "$URL"
```

**Paso 19.** Cerrar Claude Code y abrirlo de nuevo en la carpeta del repositorio. Escribir `/mcp`, elegir **supabase → Authenticate** y autorizar en el navegador. Si pide una organización, elegir `agora`.

**Paso 20.** Comprobar que el servidor activo es el local. Debe decir «Local config», la URL con `read_only=true` y «Connected»:

```sh
claude mcp get supabase
```

Para escribir en la base (por ejemplo, probar una migración), se quita `read_only=true` solo durante esa tarea y se vuelve a poner al terminar. Los cambios definitivos en la nube entran siempre por el CD.

#### Lo que no se configura en el panel

La URL del sitio y las de redirección, la política de contraseñas, el SMTP, los límites de Auth, las extensiones (`pgvector`), los esquemas y los permisos de las tablas van en el repositorio: `supabase/config.toml` (T-12) y las migraciones (T-03 en adelante). Se suben con `supabase config push` y con el CD. Si se cambian en el panel, la nube y el código dejan de coincidir.

#### Comprobar

Cuando exista `mise.toml` (T-11). El primer comando pide el token personal:

```sh
supabase login
```

Debe listar `agora-dev`:

```sh
supabase projects list
```

## 5. Google Cloud (Drive y OAuth)

Ágora usa Google para guardar las entregas en Drive (y, más adelante, para Gmail, Calendar y Tasks), **no para iniciar sesión** (HU-03.01). La pantalla de consentimiento de Google solo la ve el titular al autorizar a Ágora.

**No hace falta facturación.** Drive API es gratuita. Si la consola ofrece «Iniciar prueba gratuita» o «Activar facturación», no se acepta: proyecto, API y cliente OAuth funcionan sin tarjeta.

#### Proyecto

**Paso 1.** Entrar en https://console.cloud.google.com con jdiegopardo23@gmail.com y aceptar los términos si los pide.

**Paso 2.** En el selector de proyectos, **Proyecto nuevo**:

| Campo | Valor |
|---|---|
| Nombre del proyecto | `agora` |
| ID del proyecto | El que propone Google (`agora-` más un número) u otro libre. No se puede cambiar después |
| Organización | La organización de la cuenta, si existe (`jdiegopardo23-org`); si no, «Sin organización». No se puede cambiar después |

Las organizaciones nuevas traen políticas de seguridad activas (por ejemplo, prohíben crear llaves JSON de cuentas de servicio). Ágora no las necesita: el worker usa un cliente OAuth de escritorio.

**Paso 3.** Seleccionar el proyecto `agora` en el selector de arriba.

**Paso 4.** En **APIs y servicios → Biblioteca**, buscar **Google Drive API** y pulsar **Habilitar**. Solo Drive: Gmail, Calendar y Tasks se habilitan en su HU. En la página de la API no se llena **Integración en la IU de Drive** (es para apps que aparecen dentro de Drive).

#### Google Auth Platform

**Paso 5.** En **Pantalla de consentimiento de OAuth** (Google Auth Platform), pulsar **Comenzar** y completar el asistente: nombre de la app `Ágora`, correo de asistencia jdiegopardo23@gmail.com, público **Externo** («Interno» solo existe para cuentas de Workspace), correo de contacto el mismo, y aceptar la política de datos de usuario.

**Paso 6.** En **Información de la marca**, dejar **vacíos** el logotipo, el dominio de la app (página principal, política de privacidad y condiciones) y los dominios autorizados. Subir un logo obliga a verificar la marca, lo que exige un dominio propio verificado en Search Console con página de inicio y políticas publicadas; `*.vercel.app` no se puede verificar. Los dominios autorizados se agregan con el cliente web (HU-04.04).

**Paso 7.** En **Público**, comprobar el tipo **Externo** y el estado **Prueba**, y en **Usuarios de prueba → Add users** agregar jdiegopardo23@gmail.com.

**Paso 8.** En **Acceso a los datos → Agregar o quitar permisos**, filtrar por `drive.file`, marcar **solo** `https://www.googleapis.com/auth/drive.file`, pulsar **Actualizar** y después **Save**. Debe quedar en «Tus permisos no sensibles», sin permisos sensibles ni restringidos: da acceso solo a los archivos que crea Ágora, no a todo Drive (HU-04.04, CA-NF-01).

En estado **Prueba**, la autorización del worker caduca a los 7 días. Cuando la integración con Drive funcione (SPRINT-07), la app se pasa a **producción** en **Público → Publicar app**. Con solo `drive.file` no requiere verificación; Google mostrará el aviso de «app no verificada» al titular, y basta con aceptarlo.

#### Cliente OAuth del worker

**Paso 9.** En **Clientes → Crear cliente**, tipo **App de escritorio**, nombre `agora-worker`, y **Crear**.

**Paso 10.** En la ventana que aparece, pulsar **Descargar JSON** antes de cerrarla: Google muestra el *client secret* una sola vez. El cliente web (`agora-web`) se crea en HU-04.04, con los *redirect URIs* que defina esa HU.

**Paso 11.** Crear la carpeta privada, fuera del repositorio:

```sh
mkdir -p ~/.local/share/agora-privado/google
```

**Paso 12.** Mover el JSON con un nombre fijo. Si alguna vez cae dentro del repositorio, `.gitignore` lo ignora (`client_secret*.json`), pero no hay que depender de eso:

```sh
mv ~/Descargas/client_secret_*.json ~/.local/share/agora-privado/google/client_secret_agora-worker.json
```

**Paso 13.** Dejarlo legible solo para el titular:

```sh
chmod 600 ~/.local/share/agora-privado/google/client_secret_agora-worker.json
```

#### Respaldo en Bitwarden

**Paso 14.** Abrir la sesión de Bitwarden con la rutina de uso de la sección 1.1, pasos 1 a 5. Ningún comando siguiente debe volver a pedir la contraseña maestra; si la pide, la sesión no quedó abierta.

**Paso 15.** Partir de la plantilla y convertirla en nota segura:

```sh
J=$(bw get template item)
```

```sh
J=$(jq '.type=2 | .secureNote={type:0} | .login=null | .fields=[]' <<< "$J")
```

**Paso 16.** Ponerle nombre y carpeta:

```sh
J=$(jq --arg v "Google · cliente OAuth agora-worker" '.name=$v' <<< "$J")
```

```sh
J=$(jq --arg v "$FOLDER_ID" '.folderId=$v' <<< "$J")
```

**Paso 17.** Copiar el JSON al texto de la nota:

```sh
J=$(jq --rawfile v ~/.local/share/agora-privado/google/client_secret_agora-worker.json '.notes=$v' <<< "$J")
```

**Paso 18.** Guardar la nota. Solo debe mostrar `guardada`:

```sh
bw encode <<< "$J" | bw create item > /dev/null && echo "guardada"
```

**Paso 19.** Comprobar que aparece «Google · cliente OAuth agora-worker»:

```sh
bw list items --folderid "$FOLDER_ID" | jq -r '.[].name'
```

**Paso 20.** Limpiar y bloquear:

```sh
unset J
```

```sh
bw lock
```

Si `bw` responde «The decryption operation failed», la contraseña maestra no coincidió: se vuelve al paso 14 y se escribe con calma.

#### Servicios de Google que se agregan después

Cada API se habilita en el sprint de la HU que la usa, por mínimo privilegio: un permiso que el código no usa solo agrega riesgo. Calendar, Tasks y el envío por Gmail son permisos **sensibles**: al agregarlos, Google muestra al titular el aviso de «app no verificada», que basta con aceptar.

| Servicio | Uso en Ágora | Dónde se decide o se usa | Permiso |
|---|---|---|---|
| Gmail | Código de verificación de dispositivo nuevo, recuperación y cambio de contraseña | Spike T-10 (Gmail API o proveedor SMTP); HU-03.02, HU-03.04 y HU-04.02 | Lo fija el ADR de T-10 (probablemente `gmail.send`) |
| Google Calendar | Exportar el horario y los eventos | HU-11.04 y HU-04.04 | `calendar.events` |
| Google Tasks | Sincronizar las tareas | HU-12.05 y HU-04.04, con flujos de n8n (T-08) | `tasks` |

Para agregar uno se usan el mismo proyecto y la misma pantalla de consentimiento: habilitar la API en **Biblioteca**, agregar el permiso en **Acceso a los datos** y volver a autorizar. No hace falta otro proyecto ni otro cliente de escritorio.

## 6. Google AI Studio (Gemini)

La clave usa el proyecto de Google Cloud `agora`, que no tiene facturación: queda en el **nivel gratuito** y no puede generar cobros (al superar el límite, la API responde con error). En el nivel gratuito Google puede usar los prompts para mejorar sus productos, así que por Gemini no se envían datos sensibles ni datos personales de terceros; apuntes y documentos de estudio no son un problema.

**Paso 1.** Entrar en https://aistudio.google.com con jdiegopardo23@gmail.com y abrir **Get API key → Create API key**.

**Paso 2.** Cuando pida un proyecto, elegir el proyecto de Google Cloud `agora` (el del paso 2 de la sección 5), no uno nuevo.

**Paso 3.** Si AI Studio no muestra el proyecto, pulsar **Importar proyectos** y elegir `agora`. Después, **Crear clave de API** con el nombre `agora-worker`. En la tabla, el nivel de facturación debe decir «Nivel gratuito»: no se pulsa **Configurar la facturación**. Copiar la clave a la entrada `Google · Gemini API key`, campo oculto `Clave API`.

**Paso 4.** Restringir la clave para que, si se filtra, no sirva para otras APIs: en Google Cloud, **APIs y servicios → Credenciales**, abrir la clave nueva, elegir **Restringir clave** en **Restricciones de API**, marcar solo **Gemini API** (el nombre actual de Generative Language API) y pulsar **Guardar**. En **Restricciones de aplicaciones** se deja «Ninguno». El aviso que sugiere vincular la clave a una cuenta de servicio no aplica a una clave creada en AI Studio. La restricción puede tardar hasta 5 minutos.

**Paso 5.** Probar la clave con la sesión de Bitwarden abierta (sección 1.1). Cargarla sin mostrarla:

```sh
K=$(bw get item "Google · Gemini API key" | jq -r '.fields[] | select(.name=="Clave API") | .value')
```

Comprobar que no quedó vacía (debe mostrar un número mayor que 0):

```sh
echo ${#K}
```

Guardar la dirección de la API:

```sh
U=https://generativelanguage.googleapis.com/v1beta/models
```

Llamarla. Debe mostrar `200`; un `403` con `K` vacía significa que la entrada no se encontró:

```sh
curl -s -o /dev/null -w "%{http_code}\n" -H "x-goog-api-key: $K" "$U"
```

Limpiar:

```sh
unset K U
```

**Paso 6.** Revisar en **Usage** de AI Studio los límites del nivel gratuito: el panel de consumo de Ágora (EP-08) los compara contra el gasto real.

## 7. Claude (token para el worker)

El worker usa Claude Code en modo no interactivo con un token de larga duración de la suscripción del titular.

**Paso 1.** En una terminal **fuera** de Claude Code, generar el token. Abre el navegador para iniciar sesión y autorizar:

```sh
claude setup-token
```

**Paso 2.** Copiar el token que imprime (empieza con `sk-ant-oat`) a la entrada `Claude · token worker`, campo oculto `CLAUDE_CODE_OAUTH_TOKEN`. No se pega en ningún chat ni archivo.

**Paso 3.** Limpiar la pantalla de la terminal:

```sh
clear
```

En la VM irá como variable de entorno del servicio del worker (T-07), nunca en un archivo del repositorio.

## 8. GitHub: environments y secretos

El CD (`.github/workflows/cd.yml`) aplica migraciones con tres secretos del environment `staging`. Los valores pasan de Bitwarden a GitHub por una tubería (`|`): no se muestran en pantalla ni quedan en el historial.

**Paso 1.** Entrar a la carpeta del repositorio:

```sh
cd ~/Documentos/agora
```

**Paso 2.** Crear el environment `staging`. Debe mostrar `creado`:

```sh
gh api -X PUT repos/dpardo23/agora/environments/staging --silent && echo "creado"
```

**Paso 3.** Abrir la sesión de Bitwarden con la rutina de uso de la sección 1.1, pasos 1 y 2.

**Paso 4.** Cargar la entrada de Supabase en una variable:

```sh
S=$(bw get item "Supabase · agora-dev")
```

**Paso 5.** Subir el ref del proyecto (campo `project_id`):

```sh
jq -r '.fields[] | select(.name=="project_id") | .value' <<< "$S" | gh secret set SUPABASE_PROJECT_REF --env staging
```

**Paso 6.** Subir el token personal (campo `agora-cli`):

```sh
jq -r '.fields[] | select(.name=="agora-cli") | .value' <<< "$S" | gh secret set SUPABASE_ACCESS_TOKEN --env staging
```

**Paso 7.** Subir la contraseña de la base (campo **Contraseña**):

```sh
jq -r '.login.password' <<< "$S" | gh secret set SUPABASE_DB_PASSWORD --env staging
```

**Paso 8.** Limpiar y bloquear:

```sh
unset S
```

```sh
bw lock
```

**Paso 9.** Comprobar que aparecen `SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_PASSWORD` y `SUPABASE_PROJECT_REF` (solo muestra nombres y fechas):

```sh
gh secret list --env staging
```

El environment `produccion` ya existe, con tu aprobación obligatoria y limitado a las etiquetas `v*` (`docs/guias/repositorio/configuracion-github.md`, sección 5). Sus tres secretos se suben igual, con `--env produccion` y los valores del proyecto de producción, cuando ese proyecto exista. Al vencer el token `agora-cli` (90 días), se genera otro (sección 4, paso 11) y se repiten los pasos 3, 4, 6 y 8. El resto de la configuración del repositorio está en `docs/guias/repositorio/configuracion-github.md`.

## 9. Vercel (después de T-01)

Hace falta que exista `apps/web` en `develop` (T-01, ya fusionado).

1. Entra en https://vercel.com con **Continue with GitHub** (plan **Hobby**, de uso personal).
2. Si pide instalar la GitHub App de Vercel, elige **Only select repositories** y marca solo `agora`.
3. **Add New → Project → Import** `dpardo23/agora` y llena la pantalla de importación así:

| Campo | Valor |
|---|---|
| Project Name | `agora` |
| Framework Preset | Next.js |
| Root Directory | `apps/web` (botón **Edit**) |
| Build and Output Settings | Sin cambios: Vercel usa `pnpm install` y `next build` |
| Environment Variables | Solo `ENABLE_EXPERIMENTAL_COREPACK` = `1`. Las de Supabase se agregan después, en el paso 5, para no ponerlas en producción |

4. Pulsa **Deploy**. Como la rama por defecto del repositorio es `develop`, este primer despliegue sale como *Production* desde `develop`; se corrige en el paso 6.
5. **Settings → Environment Variables**, solo en el entorno **Preview** (desmarca *Production* y *Development*):
   - `NEXT_PUBLIC_SUPABASE_URL` = la URL de agora-dev (`https://<ref>.supabase.co`).
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` = la clave publicable de agora-dev (`sb_publishable_…`).

   Las dos son públicas por diseño, pero se copian desde la entrada «Supabase · agora-dev» del gestor, no desde el chat. *Production* queda vacío hasta que exista el proyecto de producción: mientras tanto, `/api/v1/salud` responde `"supabase": "sin_configurar"`. `SUPABASE_SECRET_KEY` **no** se agrega hasta que algún código de `src/server/` la use.
6. **Settings → Git → Production Branch:** `main`. Así `develop` y cada PR generan previews, y solo `main` despliega a producción. Mientras `main` no tenga `apps/web` (llega con la primera release), sus despliegues fallan; es esperado.
7. **Settings → Build and Deployment:**
   - **Node.js Version → Project Settings:** 24.x. Vercel propone 26.x por defecto; hay que cambiarlo.
   - **Include files outside the Root Directory in the Build Step:** activado (el `pnpm-lock.yaml` y `pnpm-workspace.yaml` están en la raíz).
8. **Settings → Functions → Function Region:** São Paulo (`gru1`), la región de agora-dev. Por defecto es Washington (`iad1`) y cada consulta a la base cruzaría el continente. El cambio se aplica en el siguiente despliegue.
9. **Settings → Deployment Protection:** deja **Vercel Authentication** activado en las previews. Las URL de preview solo se abren con tu sesión de Vercel; no lo desactives para probar.
10. **No** conectes la integración de Supabase en Vercel (*Integrations*, ni el botón «Add» que aparece al crear el proyecto): copiaría la `service_role` a todos los entornos. Las variables se ponen a mano (paso 5).

`ENABLE_EXPERIMENTAL_COREPACK=1` hace que Vercel use la versión exacta del campo `packageManager` del `package.json` raíz (pnpm 12.17.0). Sin ella usa otra versión de pnpm, que puede ignorar `allowBuilds` y `overrides` de `pnpm-workspace.yaml` (entre ellos, el parche de seguridad de zod). Si un día Corepack falla, la alternativa es el Install Command `npx pnpm@12.17.0 install --frozen-lockfile`.

**Comprobar:**
- En el registro del build (Deployments → el despliegue → **Build Logs**) aparecen `Detected ENABLE_EXPERIMENTAL_COREPACK=1 and "pnpm@12.17.0"` y `Done in … using pnpm v12.17.0`, y `next build` termina sin errores.
- Al abrir un PR aparece el check de Vercel con una URL de preview.
- Con la sesión de Vercel abierta en el navegador, `<URL de preview>/api/v1/salud` responde 200 con `"supabase": "ok"`.
- El check de Vercel es informativo: el único check obligatorio de los rulesets sigue siendo `ci-ok`.

## 10. Mapa de secretos

| Variable | De dónde sale | `.env.local` raíz | `apps/web/.env.local` | `apps/worker/.env.local` | Vercel | GitHub | VM |
|---|---|---|---|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase, Project URL (en local: `http://localhost:55321`) | | Sí | | Sí | | |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase, Publishable key (en local: `supabase status`) | | Sí | | Sí | | |
| `SUPABASE_URL` | Supabase, Project URL (en local: `http://localhost:55321`) | | | Sí | | | Sí |
| `SUPABASE_SECRET_KEY` | Supabase, Secret key | | Sí | Sí | Sí (servidor) | | Sí |
| `SUPABASE_PROJECT_REF`, `SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_PASSWORD` | Supabase (entrada `Supabase · agora-dev`) | No | | | | Sí (environment `staging`) | |
| `SUPABASE_JWKS_URL` | `https://<project_ref>.supabase.co/auth/v1/.well-known/jwks.json`; no es secreto. Se agrega cuando el código verifique sesiones con llaves asimétricas (EP-03) | | Sí | | Sí (servidor) | | |
| `GEMINI_API_KEY` | AI Studio | | | Sí | | | Sí |
| `CLAUDE_CODE_OAUTH_TOKEN` | `claude setup-token` | | | Sí | | | Sí |
| `GOOGLE_OAUTH_CLIENT_FILE` | Ruta al JSON del cliente de Google (`~/.local/share/agora-privado/google/client_secret_agora-worker.json` en tu PC) | | | Sí | | | Sí |
| `N8N_ENCRYPTION_KEY` | Generada: `openssl rand -hex 32` | Sí | | | | | Sí |

Las tres credenciales de la nube de Supabase quedan solo en el gestor y en GitHub. En tu PC, la CLI no las lee de un archivo: `supabase login` guarda el token en el llavero del sistema (sección 4) y, cuando un comando pide la contraseña de la base, se pasa solo a ese comando desde el gestor (guía 4, sección 2.3). Así, un `.env.local` filtrado no da acceso a la base de la nube.

Los nombres exactos están en los `.env.example` de la raíz, de `apps/web/` y de `apps/worker/` (T-11). Cada `.env.local` se crea copiando su plantilla (`cp .env.example .env.local`) y llenando los valores desde el gestor; `scripts/verificar-entorno.sh` comprueba que no falte ninguno, sin mostrar valores. Si un nombre cambia, se actualizan a la vez la plantilla y esta tabla.

## 11. Lista de comprobación

- [ ] CLI de Bitwarden con sesión iniciada y carpeta «Ágora» (si el gestor es Bitwarden).
- [ ] Cuenta de Oracle en Free Tier, creada en São Paulo o Santiago; llave `~/.ssh/agora-vm` respaldada en el gestor; VCN `agora-vcn` creada con el asistente; VM `agora-vm` (A1 Flex, 2 OCPU, 12 GB) accesible por SSH.
- [ ] Organización `agora` creada en Supabase (no desde Vercel); proyecto `agora-dev` en São Paulo, Postgres 17, sin exposición automática de tablas; URL, ref, publishable key, secret key, contraseña de la base y token personal en el gestor.
- [ ] 2FA en la cuenta de Supabase, registro público desactivado, SSL obligatorio y Security Advisor sin errores.
- [ ] MCP de Supabase con ámbito local, limitado a `agora-dev` y en solo lectura.
- [ ] Proyecto de Google Cloud `agora` sin facturación, con Drive API, pantalla de consentimiento externa en prueba (sin logo, solo `drive.file`, usuario de prueba agregado) y cliente OAuth de escritorio `agora-worker`; JSON en `~/.local/share/agora-privado/google/` con permisos 600 y respaldado en el gestor.
- [ ] Clave de Gemini creada en el proyecto `agora` en nivel gratuito, restringida a Gemini API, guardada en el gestor y probada con respuesta 200.
- [ ] Token de Claude Code en el gestor (`Claude · token worker`).
- [ ] Environment `staging` en GitHub con `SUPABASE_PROJECT_REF`, `SUPABASE_ACCESS_TOKEN` y `SUPABASE_DB_PASSWORD`, cargados desde el gestor.
- [ ] Vercel conectado con `apps/web`, Node 24.x, Corepack, producción en `main` y las variables de Supabase solo en *Preview* (después de T-01).
- [ ] Ninguna clave escrita fuera del gestor, de GitHub, de Vercel y de los `.env.local`; las credenciales de la nube de Supabase, solo en el gestor y en GitHub.
