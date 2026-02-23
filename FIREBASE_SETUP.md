# Configuración de Firebase

## Paso 1: Crear o seleccionar un proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en **"Agregar proyecto"** o selecciona un proyecto existente
3. Sigue los pasos para crear el proyecto (nombre, analytics, etc.)

## Paso 2: Habilitar Firestore

1. En la consola de Firebase, ve a **"Firestore Database"**
2. Haz clic en **"Crear base de datos"**
3. Selecciona el modo:
   - **Modo de prueba**: Para desarrollo (permite lectura/escritura sin autenticación)
   - **Modo de producción**: Para producción (requiere reglas de seguridad)
4. Selecciona la ubicación (elige la más cercana a tus usuarios)
5. Haz clic en **"Habilitar"**

## Paso 3: Obtener las credenciales del Service Account

1. En la consola de Firebase, haz clic en el ícono de engranaje ⚙️ y selecciona **"Configuración del proyecto"**
2. Ve a la pestaña **"Cuentas de servicio"**
3. Selecciona **"Node.js"** como lenguaje
4. Haz clic en **"Generar nueva clave privada"**
5. Se descargará un archivo JSON con tus credenciales

## Paso 4: Configurar el archivo .env

El archivo JSON descargado tendrá este formato:
```json
{
  "type": "service_account",
  "project_id": "tu-proyecto-123",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@tu-proyecto-123.iam.gserviceaccount.com",
  ...
}
```

Copia los valores al archivo `.env`:

```env
FIREBASE_PROJECT_ID=tu-proyecto-123
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_CLAVE_AQUI\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-proyecto-123.iam.gserviceaccount.com
```

**IMPORTANTE**:
- La `FIREBASE_PRIVATE_KEY` debe estar entre comillas dobles
- Los saltos de línea deben ser `\n`
- NO compartas este archivo ni lo subas a Git

## Paso 5: Configurar reglas de Firestore (Opcional)

Si usaste **modo de producción**, configura las reglas de seguridad:

1. Ve a **Firestore Database** > **Reglas**
2. Para desarrollo temporal, puedes usar:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir todo (SOLO PARA DESARROLLO)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Para producción (con autenticación), usarás:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo los usuarios autenticados pueden acceder a sus propios datos
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Paso 6: Verificar la configuración

1. Asegúrate de que el archivo `.env` está configurado correctamente
2. Inicia el servidor:
```bash
npm run dev
```

3. Verifica que Firebase se inicializó correctamente:
```
✅ Firebase initialized successfully
🚀 Server running on port 3001
```

4. Prueba el health check:
```bash
curl http://localhost:3001/health
```

## Estructura de datos que se creará en Firestore

```
firestore/
└── users/
    └── {userId}/
        ├── notes/
        │   └── {noteId}/
        │       ├── title
        │       ├── body
        │       ├── notebook
        │       ├── createdAt
        │       └── updatedAt
        └── notebooks/
            └── {notebookId}/
                ├── name
                └── createdAt
```

## Solución de problemas

### Error: "Firebase initialized failed"
- Verifica que las credenciales en `.env` sean correctas
- Asegúrate de que la PRIVATE_KEY tenga los saltos de línea correctos (`\n`)
- Verifica que las comillas estén correctamente cerradas

### Error: "Missing or insufficient permissions"
- Revisa las reglas de Firestore
- Asegúrate de estar en modo de prueba o que las reglas permitan el acceso

### Error: "Project not found"
- Verifica que el `FIREBASE_PROJECT_ID` sea correcto
- Asegúrate de que el proyecto existe en Firebase Console

## Recursos adicionales

- [Documentación de Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Documentación de Firestore](https://firebase.google.com/docs/firestore)
- [Reglas de seguridad de Firestore](https://firebase.google.com/docs/firestore/security/get-started)
