# Landing Page — Mi Nómina

Landing page con configuración centralizada en `.env` y envío de correos vía SMTP Gmail.

## Configuración

1. Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

2. Edita `.env` con tus datos personales y credenciales SMTP de Gmail.

### SMTP Gmail

Necesitas una **Contraseña de aplicación** de Google (no uses tu contraseña normal):

1. Activa verificación en 2 pasos en tu cuenta Google
2. Ve a [Contraseñas de aplicación](https://myaccount.google.com/apppasswords)
3. Genera una contraseña para "Correo"
4. Pégala en `SMTP_PASS` en tu `.env`

## Desarrollo local

Tienes dos formas de probar en local:

### Opción A — Express (rápida, sin Vercel CLI)

```bash
npm install
npm start
```

Abre **http://localhost:3000**

### Opción B — Entorno idéntico a Vercel

```bash
npm install
npm run vercel:dev
```

Abre la URL que muestre la CLI (normalmente **http://localhost:3000**).

- `GET /api/config` — datos del sitio desde `.env`
- `POST /api/contact` — envía el formulario por SMTP

Para recarga automática con Express:

```bash
npm run dev
```

> **Importante:** No uses `browser-sync` ni `serve` solos. El sitio necesita las rutas `/api/*` para cargar la config y enviar emails.

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `SITE_NAME` | Tu nombre / marca |
| `CONTACT_EMAIL` | Email público de contacto |
| `CONTACT_PHONE` | WhatsApp sin + (ej. `527352516928`) |
| `CONTACT_PHONE_DISPLAY` | Formato visible (ej. `+52 735 251 6928`) |
| `WHATSAPP_MESSAGE` | Mensaje predefinido al abrir WhatsApp |
| `LINKEDIN_URL` | URL de tu perfil LinkedIn |
| `SMTP_USER` | Cuenta Gmail para enviar |
| `SMTP_PASS` | Contraseña de aplicación Gmail |
| `SMTP_TO` | Destinatario (por defecto `CONTACT_EMAIL`) |
| `SPAM_MIN_SUBMIT_SECONDS` | Segundos mínimos antes de poder enviar (default: 3) |
| `RATE_LIMIT_MAX` | Máximo de envíos por IP en la ventana (default: 5) |
| `RATE_LIMIT_WINDOW_MS` | Ventana del rate limit en ms (default: 15 min) |

## Estructura

```
landing_page/
├── .env                 # Tus datos (no subir a git)
├── .env.example         # Plantilla
├── api/                 # Serverless Functions (Vercel)
│   ├── config.js        # GET /api/config
│   └── contact.js       # POST /api/contact
├── server/
│   ├── index.js         # Express (solo desarrollo local)
│   ├── site-config.js   # Lee variables de entorno
│   ├── mail.js          # Nodemailer SMTP
│   ├── spam-guard.js    # Anti-spam del formulario
│   ├── rate-limit.js    # Límite de envíos por IP
│   └── defaults.js      # Textos de marketing
├── js/
│   ├── app.js
│   └── data/projects.js
├── vercel.json          # Configuración de Vercel
└── index.html
```

## Despliegue en Vercel

El proyecto está listo para Vercel: archivos estáticos en la raíz y API en `api/`.

### 1. Subir el repositorio a GitHub

Vercel se conecta a un repo de Git. Asegúrate de que `.env` **no** esté en el repo.

### 2. Importar en Vercel

1. Entra en [vercel.com](https://vercel.com) e importa el repositorio
2. Framework preset: **Other** (no hace falta build command)
3. Output directory: dejar vacío (raíz del proyecto)

### 3. Variables de entorno

En **Project → Settings → Environment Variables**, añade las mismas variables de `.env.example`:

- `SITE_NAME`, `CONTACT_EMAIL`, `CONTACT_PHONE`, `CONTACT_PHONE_DISPLAY`
- `WHATSAPP_MESSAGE`, `LINKEDIN_URL`
- `SEO_TITLE`, `SEO_DESCRIPTION`, `SEO_URL`, `SEO_IMAGE`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM_NAME`, `SMTP_TO`
- `SPAM_MIN_SUBMIT_SECONDS`, `SPAM_MAX_FORM_AGE_MS`, `RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW_MS`

Actualiza `SEO_URL` y `SEO_IMAGE` con tu dominio real de Vercel (ej. `https://mi-nomina.vercel.app`).

### 4. Desplegar

Cada push a la rama principal desplegará automáticamente. También puedes hacerlo manual:

```bash
npx vercel          # preview
npx vercel --prod   # producción
```

### Notas

- `server/index.js` solo se usa en local con `npm start`; en Vercel corren las funciones de `api/`.
- El rate limit es por instancia serverless; para una landing de contacto suele ser suficiente.
- Dominio personalizado: **Project → Settings → Domains**.
