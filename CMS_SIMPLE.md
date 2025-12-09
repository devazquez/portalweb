# CMS Simple - Guía de Uso

## ¿Qué cambió?

Reemplazamos Strapi por un **CMS simple basado en JSON**. Es mucho más ligero, fácil de usar y funciona perfectamente con el portal.

## API Endpoints

El CMS está disponible en `http://localhost:1337` (puerto 3001 internamente)

### Listar todos los artículos
```bash
GET /api/articulos
```

**Respuesta:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Título del artículo",
      "description": "Descripción breve",
      "body": "Contenido completo del artículo",
      "createdAt": "2025-12-09T19:47:39.715Z",
      "updatedAt": "2025-12-09T19:47:39.716Z"
    }
  ],
  "meta": { "count": 1 }
}
```

### Obtener un artículo por ID
```bash
GET /api/articulos/1
```

### Buscar artículos
```bash
GET /api/search?query=inteligencia
```

Busca en `title`, `description` y `body`

### Crear un nuevo artículo
```bash
POST /api/articulos
Content-Type: application/json

{
  "title": "Mi primer artículo",
  "description": "Una breve descripción",
  "body": "Contenido completo del artículo aquí"
}
```

**Respuesta:** El artículo creado con ID generado automáticamente

### Actualizar un artículo
```bash
PUT /api/articulos/1
Content-Type: application/json

{
  "title": "Título actualizado",
  "body": "Contenido actualizado"
}
```

### Eliminar un artículo
```bash
DELETE /api/articulos/1
```

## Almacenamiento de datos

- Los artículos se guardan en `/cms-simple/data.json`
- Los datos persisten en un volumen Docker: `cms_data`
- Puedes editar el archivo JSON directamente si lo necesitas

## Ejemplo: Agregar artículos desde PowerShell

```powershell
# Crear un artículo
$body = @{
    title = "Inteligencia Artificial Explicada"
    description = "Una guía introductoria a la IA"
    body = "La IA es... contenido largo aquí"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:1337/api/articulos" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body

# Buscar artículos
Invoke-WebRequest -Uri "http://localhost:1337/api/articulos?search=inteligencia" `
  | ConvertFrom-Json | ConvertTo-Json
```

## Integración con el Portal

El portal automáticamente:
1. Busca en **Omeka** para recursos digitales
2. Busca en **CMS Simple** para artículos/contenido editorial
3. Muestra ambos en resultados de búsqueda
4. Combina todo en una búsqueda unificada

## Ventajas del nuevo CMS

✅ Sin base de datos compleja
✅ Almacenamiento simple en JSON
✅ API REST lista para usar
✅ Rápido de iniciar
✅ Fácil de entender
✅ Bajo consumo de recursos
✅ Persiste en volúmenes Docker

## Próximos pasos

1. **Crear artículos** usando la API REST o editando `data.json`
2. **Buscar desde el portal** - Automáticamente buscará en CMS + Omeka
3. **Expandir** - Agregar más campos o funcionalidades según necesites

## ¿Necesitas ayuda?

Para ver los datos actuales:
```bash
docker exec iis-cms cat /app/data.json
```

Para ver los logs:
```bash
docker logs iis-cms --tail 50
```

---

**¡Tu CMS está listo!** 🚀
