# ✦ Luma — Render AI para Arquitectos

Asistente conversacional para generar prompts de mejora de renders arquitectónicos con Gemini Imagen 3.

Usa **Gemini 1.5 Flash** como motor de IA — **gratis hasta 1500 requests por día**.

---

## 🔑 Obtener tu API key de Gemini (gratis)

1. Entrá a **https://aistudio.google.com/apikey**
2. Iniciá sesión con tu cuenta de Google
3. Clic en **Create API Key**
4. Copiá la key generada

---

## 🚀 Instalación local

### 1. Requisitos
- Node.js 18 o superior
- Una API key de Google AI Studio (gratis)

### 2. Configurar la API key

Creá un archivo `.env` en la raíz del proyecto:

```
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxx
```

> ⚠️ Nunca subas el archivo `.env` a GitHub. Ya está en el `.gitignore`.

### 3. Instalar dependencias y correr

```bash
npm install
npm start
```

La app queda disponible en **http://localhost:3000**

---

## ☁️ Deploy en Vercel (gratis, recomendado)

### Opción A — Desde GitHub

1. Subí esta carpeta a un repositorio GitHub
2. Entrá a https://vercel.com y conectá el repo
3. En **Settings → Environment Variables**, agregá:
   - Key: `GEMINI_API_KEY`
   - Value: tu API key
4. ¡Listo! Vercel genera una URL pública automáticamente

### Opción B — Con Vercel CLI

```bash
npm install -g vercel
vercel
```

---

## ☁️ Deploy en Railway

1. Creá cuenta en https://railway.app
2. "New Project" → "Deploy from GitHub repo"
3. Agregá la variable de entorno `GEMINI_API_KEY`

---

## 📁 Estructura del proyecto

```
luma-app/
├── server.js          ← Backend Node.js (proxy seguro a Gemini)
├── package.json
├── .env               ← Tu API key (NO subir a Git)
├── .gitignore
└── public/
    └── index.html     ← La app completa
```

---

## 🔒 Seguridad

La API key **nunca** se expone al navegador. Todas las llamadas a Gemini pasan por `/api/chat` en el servidor.

---

## 💡 Desarrollo local con hot reload

```bash
npm run dev
```
