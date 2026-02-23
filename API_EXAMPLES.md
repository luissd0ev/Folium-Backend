# Ejemplos de Peticiones a la API

## Usando cURL

### Health Check
```bash
curl http://localhost:3001/health
```

### Notas

#### Obtener todas las notas
```bash
curl http://localhost:3001/api/notes
```

#### Crear una nota
```bash
curl -X POST http://localhost:3001/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mi primera nota",
    "body": "<p>Este es el contenido de mi nota</p>",
    "notebook": "general"
  }'
```

#### Obtener una nota específica
```bash
curl http://localhost:3001/api/notes/NOTE_ID
```

#### Actualizar una nota
```bash
curl -X PUT http://localhost:3001/api/notes/NOTE_ID \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Título actualizado",
    "body": "<p>Contenido actualizado</p>"
  }'
```

#### Eliminar una nota
```bash
curl -X DELETE http://localhost:3001/api/notes/NOTE_ID
```

#### Obtener notas de una libreta
```bash
curl http://localhost:3001/api/notes/notebook/NOTEBOOK_ID
```

### Libretas

#### Obtener todas las libretas
```bash
curl http://localhost:3001/api/notebooks
```

#### Crear una libreta
```bash
curl -X POST http://localhost:3001/api/notebooks \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Trabajo"
  }'
```

#### Obtener una libreta específica
```bash
curl http://localhost:3001/api/notebooks/NOTEBOOK_ID
```

#### Actualizar una libreta
```bash
curl -X PUT http://localhost:3001/api/notebooks/NOTEBOOK_ID \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nuevo nombre"
  }'
```

#### Eliminar una libreta
```bash
curl -X DELETE http://localhost:3001/api/notebooks/NOTEBOOK_ID
```

## Usando JavaScript (fetch)

### Crear una nota
```javascript
fetch('http://localhost:3001/api/notes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Mi nota',
    body: '<p>Contenido</p>',
    notebook: 'general'
  })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

### Obtener todas las notas
```javascript
fetch('http://localhost:3001/api/notes')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Actualizar una nota
```javascript
fetch('http://localhost:3001/api/notes/NOTE_ID', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Título actualizado'
  })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

## Respuestas Esperadas

### Éxito
```json
{
  "success": true,
  "note": {
    "id": "abc123",
    "title": "Mi nota",
    "body": "<p>Contenido</p>",
    "notebook": "general",
    "createdAt": "2024-02-22T10:30:00.000Z",
    "updatedAt": "2024-02-22T10:30:00.000Z",
    "userId": "test-user-123"
  }
}
```

### Error
```json
{
  "success": false,
  "error": "Note not found"
}
```
