# Configuración del CMS (Strapi)

## Estado actual
El CMS Strapi está corriendo en `http://localhost:1337` pero **no tiene ningún content type (tipo de contenido) configurado**. 

Por eso actualmente el portal solo muestra recursos de Omeka. Los errores 404 del CMS son normales y ahora se manejan gracefully.

## Pasos para configurar el CMS y agregar contenido

### 1. Acceder al panel de administración de Strapi
1. Abre `http://localhost:1337/admin` en tu navegador
2. Deberías ver la pantalla de login/setup inicial

### 2. Crear un Content Type "Artículos"
1. En el panel admin, ve a **Content-Type Builder**
2. Haz clic en **Create new collection type**
3. Nombre: `Articulo` (singular)
4. Desactiva **Draft & publish** si no lo necesitas
5. Haz clic en **Create**

### 3. Agregar campos al Content Type
Dentro del editor de campos, agrega:
- **title** (Text) - Campo obligatorio
- **body** (Rich Text) - Contenido del artículo
- **slug** (Text) - URL-friendly identifier
- **description** (Text) - Descripción breve
- **tags** (Text o JSON) - Etiquetas/palabras clave
- **publishedAt** (Date) - Fecha de publicación

### 4. Guardar y recargar
1. Haz clic en **Save**
2. El servidor se reiniciará (puedes ver en los logs)
3. Una vez listo, verás la colección en el menú izquierdo

### 5. Agregar contenido
1. Ve a **Artículos** en el menú izquierdo
2. Haz clic en **Create new entry**
3. Completa los campos
4. Haz clic en **Save** y luego **Publish**

### 6. Verificar que la API está disponible
```bash
# Debería devolver tus artículos (reemplaza con tu slug real)
curl http://localhost:1337/api/articulos
```

## Cómo funciona la búsqueda del portal

Una vez que configures Strapi, el portal automáticamente:
1. Buscará en ambas fuentes: Omeka y CMS
2. Las búsquedas que coincidan con **title** o **body** aparecerán
3. Se mostrarán junto con los resultados de Omeka

## Notas importantes

- **Base de datos**: Los datos se guardan en PostgreSQL (`iis-cms-db`)
- **Volúmenes**: Los datos persisten en `cms_data`
- **URL interna (Docker)**: `http://cms:1337/api` 
- **URL externa**: `http://localhost:1337/api`
- **El portal ya está configurado** para buscar en CMS automáticamente cuando esté disponible

## Problema conocido: Errores en la consola
Si ves errores como `CMS API error: ... 404`, es porque Strapi aún no tiene content types.
Estos errores se manejan gracefully y no afectan el funcionamiento del portal.

## Próximos pasos opcionales
1. Configurar autenticación en Strapi (JWT)
2. Crear plugins de búsqueda más avanzados
3. Configurar permisos de acceso público para la API
4. Agregar webhooks para sincronizar con Omeka

---

**¿Necesitas ayuda?** Ejecuta desde la terminal:
```bash
docker logs iis-cms --tail 50
```
Para ver los logs de Strapi en tiempo real.
