# Notes App Backend - Directrices del Proyecto

## Información del Proyecto

- **Nombre**: Notes App Backend API
- **Tecnologías**: Node.js, Express, Firebase Firestore
- **Puerto**: 3001
- **Firebase Project**: fb-crud-react-e2a5f

## Arquitectura

### Stack Tecnológico
- **Runtime**: Node.js
- **Framework**: Express.js
- **Base de datos**: Firebase Firestore
- **Autenticación**: Firebase Admin SDK (próximamente Firebase Auth)

### Estructura de Carpetas
```
notes-app-backend/
├── config/          # Configuración de Firebase y otros servicios
├── controllers/     # Lógica de negocio
├── routes/          # Definición de endpoints
├── middleware/      # Middleware (auth, validación, etc.)
├── scripts/         # Scripts de utilidad (init-db, migrations, etc.)
└── server.js        # Punto de entrada del servidor
```

## Modelo de Datos

### Firestore Collections Structure
```
users/
  {userId}/
    notes/
      {noteId}
        - title: string
        - body: string (HTML)
        - notebook: string (ID de la libreta)
        - createdAt: ISO timestamp
        - updatedAt: ISO timestamp
        - userId: string

    notebooks/
      {notebookId}
        - name: string
        - createdAt: ISO timestamp
        - userId: string
```

### Usuario de Prueba (Temporal)
- **ID**: test-user-123
- Todos los endpoints actualmente usan este usuario
- Se reemplazará con autenticación real próximamente

## API Endpoints

### Notas
- `GET /api/notes` - Listar todas las notas del usuario
- `GET /api/notes/:noteId` - Obtener una nota específica
- `GET /api/notes/notebook/:notebookId` - Notas de una libreta
- `POST /api/notes` - Crear nota
- `PUT /api/notes/:noteId` - Actualizar nota
- `DELETE /api/notes/:noteId` - Eliminar nota

### Libretas
- `GET /api/notebooks` - Listar todas las libretas
- `GET /api/notebooks/:notebookId` - Obtener una libreta
- `POST /api/notebooks` - Crear libreta
- `PUT /api/notebooks/:notebookId` - Actualizar libreta
- `DELETE /api/notebooks/:notebookId` - Eliminar libreta

## Convenciones de Código

### Respuestas API
Todas las respuestas siguen el formato:
```javascript
// Éxito
{
  success: true,
  note/notebook/notes/notebooks: {...}
}

// Error
{
  success: false,
  error: "mensaje de error"
}
```

### Manejo de Errores
- Usar try-catch en todos los controladores
- Log de errores con console.error
- Respuestas HTTP apropiadas (404, 400, 500)
- Mensajes de error descriptivos

### Timestamps
- Usar formato ISO 8601: `new Date().toISOString()`
- Campos: `createdAt`, `updatedAt`

### Validaciones
- Validar datos de entrada en controladores
- No permitir campos vacíos requeridos
- Verificar existencia de documentos antes de operaciones

## Reglas de Negocio

### Notas
- Título por defecto: "Sin título"
- Notebook por defecto: "general"
- Al actualizar, siempre actualizar `updatedAt`
- El `body` es HTML (del editor contentEditable)

### Libretas
- No se puede eliminar la libreta "general"
- Al eliminar una libreta, sus notas se mueven a "general"
- Nombres de libreta únicos por usuario (implementar en futuro)

## Configuración

### Variables de Entorno (.env)
```
# Firebase Admin SDK
FIREBASE_PROJECT_ID=fb-crud-react-e2a5f
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=

# Server
PORT=3001
NODE_ENV=development

# Test User (temporal)
TEST_USER_ID=test-user-123

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:5173
```

### Firebase Admin SDK
- Usar Service Account credentials
- Inicializar en `config/firebase.js`
- No compartir credenciales en Git

## Scripts Disponibles

- `npm start` - Iniciar servidor en modo producción
- `npm run dev` - Iniciar con nodemon (auto-reload)
- `npm run init-db` - Inicializar base de datos (crear libreta general)

## Próximas Funcionalidades

### Autenticación (Prioridad Alta)
- [ ] Integrar Firebase Authentication
- [ ] Middleware de autenticación
- [ ] Obtener userId del token JWT
- [ ] Rutas protegidas

### Búsqueda
- [ ] Endpoint de búsqueda de notas
- [ ] Búsqueda por título y contenido
- [ ] Filtros avanzados

### Etiquetas
- [ ] CRUD de etiquetas
- [ ] Asignar etiquetas a notas
- [ ] Filtrar por etiquetas

### Compartir
- [ ] Compartir notas con otros usuarios
- [ ] Permisos (lectura/escritura)
- [ ] Notificaciones

### Mejoras
- [ ] Paginación de resultados
- [ ] Rate limiting
- [ ] Validación con middleware
- [ ] Tests unitarios e integración
- [ ] Logs estructurados
- [ ] Monitoreo y métricas

## Seguridad

### Firestore Rules (Producción)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### CORS
- Permitir solo el frontend (`http://localhost:5173`)
- En producción, usar dominio real

### Validación
- Sanitizar inputs
- Prevenir NoSQL injection
- Validar tipos de datos

## Integración con Frontend

### Headers Requeridos
```javascript
{
  'Content-Type': 'application/json'
}
```

### Próximamente (con Auth)
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <token>'
}
```

## Troubleshooting

### Firebase no se inicializa
- Verificar credenciales en `.env`
- Revisar formato de `FIREBASE_PRIVATE_KEY` (debe tener `\n`)
- Confirmar que el Service Account tiene permisos

### CORS errors
- Verificar `FRONTEND_URL` en `.env`
- Asegurar que el frontend está en el puerto correcto

### Notas no se guardan
- Verificar reglas de Firestore
- Revisar que el userId es correcto
- Comprobar logs del servidor

## Notas Importantes

- Este backend usa Firebase Admin SDK, NO el SDK web
- Las credenciales del frontend (apiKey, etc.) son diferentes a las del backend
- El backend necesita Service Account credentials (private key)
- Por ahora usamos un usuario de prueba hardcodeado
- La estructura está preparada para múltiples usuarios
