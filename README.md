# Folium - Backend API

API backend para la aplicación de notas Folium, construida con Node.js, Express y Firebase Firestore.

## Tecnologías

- Node.js
- Express.js
- Firebase Admin SDK
- Firebase Firestore
- Firebase Authentication

## Requisitos Previos

- Node.js 14 o superior
- Cuenta de Firebase
- Credenciales de Service Account de Firebase

## Instalación Local

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:

Crear un archivo `.env` en la raíz del proyecto con:

```env
# Firebase Admin SDK
FIREBASE_PROJECT_ID=fb-crud-react-e2a5f
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@xxxxx.iam.gserviceaccount.com

# Server
PORT=3001
NODE_ENV=development

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:5173
```

3. Iniciar el servidor:
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3001`

## Scripts Disponibles

- `npm start` - Iniciar servidor en modo producción
- `npm run dev` - Iniciar con nodemon (auto-reload)
- `npm run init-db` - Inicializar base de datos con datos de prueba

## Endpoints API

### Notas
- `GET /api/notes` - Obtener todas las notas del usuario
- `GET /api/notes/:noteId` - Obtener una nota específica
- `GET /api/notes/notebook/:notebookId` - Obtener notas de una libreta
- `POST /api/notes` - Crear una nueva nota
- `PUT /api/notes/:noteId` - Actualizar una nota
- `DELETE /api/notes/:noteId` - Eliminar una nota

### Libretas
- `GET /api/notebooks` - Obtener todas las libretas
- `GET /api/notebooks/:notebookId` - Obtener una libreta
- `POST /api/notebooks` - Crear una nueva libreta
- `PUT /api/notebooks/:notebookId` - Actualizar una libreta
- `DELETE /api/notebooks/:notebookId` - Eliminar una libreta

## Autenticación

Todas las rutas bajo `/api` requieren autenticación mediante Firebase Auth token.

El token debe enviarse en el header:
```
Authorization: Bearer <token>
```

## Despliegue en Vercel

1. Instalar Vercel CLI:
```bash
npm install -g vercel
```

2. Login en Vercel:
```bash
vercel login
```

3. Configurar variables de entorno en Vercel:
```bash
vercel env add FIREBASE_PROJECT_ID
vercel env add FIREBASE_PRIVATE_KEY
vercel env add FIREBASE_CLIENT_EMAIL
vercel env add FRONTEND_URL
```

4. Desplegar:
```bash
vercel --prod
```

**Importante**: Asegúrate de agregar todas las variables de entorno en el dashboard de Vercel antes del despliegue.

## Estructura del Proyecto

```
notes-app-backend/
├── config/
│   └── firebase.js          # Configuración de Firebase Admin
├── controllers/
│   ├── notesController.js   # Lógica de notas
│   └── notebooksController.js # Lógica de libretas
├── middleware/
│   └── auth.js              # Middleware de autenticación
├── routes/
│   ├── notes.js             # Rutas de notas
│   └── notebooks.js         # Rutas de libretas
├── scripts/
│   └── initDatabase.js      # Script de inicialización
├── .env                     # Variables de entorno (no commitear)
├── .gitignore
├── server.js                # Punto de entrada
├── package.json
└── vercel.json              # Configuración de Vercel
```

## Licencia

MIT
