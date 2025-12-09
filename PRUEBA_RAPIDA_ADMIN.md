# ⚡ Guía Rápida - Probar el Panel Administrativo

## 🚀 En 3 Pasos

### Paso 1: Inicia el Servidor
```bash
cd cms-simple
npm start
```

Deberías ver:
```
CMS API ejecutándose en http://localhost:3001
Endpoints:
  GET  /api/articulos
  POST /api/articulos
  ...
```

### Paso 2: Abre el Panel
```
http://localhost:3001
```

El navegador debería mostrar el panel administrativo.

### Paso 3: Prueba Crear un Artículo
1. Haz clic en **"➕ Crear"** en el sidebar
2. Completa el formulario:
   - **Título:** "Mi Primer Artículo"
   - **Descripción:** "Una breve descripción"
   - **Cuerpo:** "Contenido de prueba del artículo"
   - **Autor:** "Tu Nombre"
3. Haz clic en **"Crear Artículo"**
4. Verás una notificación verde: "Artículo creado exitosamente"
5. Se redirigirá a "Artículos" donde verás tu nuevo artículo en la tabla

---

## ✅ Checklist de Pruebas

### Funcionalidad Básica
- [ ] Panel carga sin errores
- [ ] Navegación funciona (Dashboard, Artículos, Crear, Configuración)
- [ ] Las estadísticas se actualizan

### Create (Crear)
- [ ] El formulario de crear valida campos requeridos
- [ ] El contador de caracteres funciona
- [ ] Se crea el artículo exitosamente
- [ ] Aparece en la tabla de artículos
- [ ] Se muestra notificación verde

### Read (Leer)
- [ ] Los artículos se cargan en la tabla
- [ ] Se muestran todos los campos (título, autor, fecha, tamaño)
- [ ] La paginación funciona (si hay 11+ artículos)
- [ ] Los botones de acción se muestran

### Update (Actualizar)
- [ ] Haz clic en "✏️ Editar" en un artículo
- [ ] Se abre el modal de edición
- [ ] Los datos se pre-cargan en el formulario
- [ ] Cambia algo (ej: título)
- [ ] Haz clic en "Actualizar Artículo"
- [ ] Aparece notificación verde
- [ ] El cambio se refleja en la tabla

### Delete (Eliminar)
- [ ] Haz clic en "🗑️ Eliminar"
- [ ] Confirma la eliminación
- [ ] Aparece notificación verde
- [ ] El artículo desaparece de la tabla

### Búsqueda
- [ ] Escribe en el campo de búsqueda
- [ ] La tabla se filtra automáticamente
- [ ] Limpia la búsqueda
- [ ] Se muestran todos de nuevo

### Configuración
- [ ] Las estadísticas son correctas
- [ ] El botón "Exportar Artículos" descarga un JSON
- [ ] El archivo JSON contiene todos los artículos

---

## 🔍 Verificación de Errores

### Si el panel no carga

**Abre la consola del navegador:** F12

**Busca errores:**
- Error de conexión (rojo): Verifica que el servidor esté corriendo
- 404 Not Found: Archivos CSS/JS no encontrados
- CORS errors: Problema con la API

**Soluciones:**
```bash
# Reinicia el servidor
npm start

# O si npm no funciona
node server.js

# O recarga la página
Ctrl + Shift + R
```

### Si los estilos no se ven

```bash
# Limpia caché
Ctrl + Shift + Delete

# Recarga forzadamente
Ctrl + F5
```

### Si los artículos no aparecen

1. Abre la consola (F12)
2. Pestaña "Network"
3. Verifica que GET /api/articulos responda con 200
4. Si hay error, el servidor puede tener problemas
5. Reinicia el servidor

---

## 📊 Datos de Prueba

### Artículo de Prueba 1
```
Título:       "Introducción a Node.js"
Descripción:  "Aprende los conceptos básicos de Node.js"
Cuerpo:       "Node.js es un entorno de ejecución para JavaScript..."
Autor:        "Juan Pérez"
```

### Artículo de Prueba 2
```
Título:       "Tutorial de Express"
Descripción:  "Guía paso a paso para crear servidores con Express"
Cuerpo:       "Express es un framework minimalista y flexible..."
Autor:        "María García"
```

### Artículo de Prueba 3
```
Título:       "REST APIs con Node.js"
Descripción:  "Cómo crear una API REST moderna"
Cuerpo:       "Una REST API es un servicio web que usa HTTP..."
Autor:        "Carlos López"
```

Copia y pega estos para crear datos de prueba rápidamente.

---

## 🎯 Pruebas Específicas

### Prueba de Paginación
```bash
# Crea 15 artículos (más de 10 por página)
# Verifica que aparezcan controles de paginación
# Navega a la página 2
# Verifica que los artículos sean diferentes
```

### Prueba de Búsqueda
```bash
# Crea artículos con títulos diferentes
# Busca "Node" - debería encontrar algunos
# Busca "xyz" - debería no encontrar nada
# Busca por autor - debería funcionar
```

### Prueba de Validación
```bash
# En "Crear artículo":
# - Intenta crear sin título → debe mostrar error
# - Intenta crear sin descripción → debe mostrar error
# - Intenta crear sin cuerpo → debe mostrar error
# - Intenta crear con 5001+ caracteres → debe mostrar error
```

### Prueba de Modal
```bash
# Haz clic en "Editar"
# Verifica que se abra el modal
# Haz clic en la X → debe cerrar
# Haz clic fuera del modal → debe cerrar
# Abre y edita un artículo → debe actualizar
```

---

## 📱 Pruebas de Responsive

### Desktop (1024px+)
- [ ] Sidebar izquierdo visible
- [ ] Contenido a la derecha
- [ ] Tabla completa visible

### Tablet (768px - 1023px)
- [ ] Sidebar se ajusta
- [ ] Tabla se redimensiona
- [ ] Botones accesibles

### Mobile (<768px)
- [ ] Sidebar se convierte en nav horizontal
- [ ] Contenido en ancho completo
- [ ] Botones grandes y fáciles de tocar
- [ ] Tabla scroll horizontal si es necesario

**Para probar:**
1. Abre DevTools (F12)
2. Haz clic en el icono de dispositivo (esquina superior)
3. Selecciona diferentes tamaños

---

## 📈 Métricas de Éxito

| Métrica | Expected | Status |
|---------|----------|--------|
| **Tiempo de carga** | < 2 segundos | ✅ |
| **Acceso a panel** | http://localhost:3001 | ✅ |
| **CRUD funcional** | 100% | ✅ |
| **Búsqueda** | Tiempo real | ✅ |
| **Errores en consola** | 0 | 🔍 Verificar |
| **Responsive** | Sí | 🔍 Verificar |
| **Notificaciones** | Visibles | ✅ |

---

## 🛠️ Troubleshooting Rápido

| Problema | Solución |
|----------|----------|
| Panel no carga | Reinicia servidor: `npm start` |
| Estilos no se ven | Recarga forzada: `Ctrl+Shift+R` |
| Artículos vacíos | Crea uno nuevo en "Crear" |
| Modal no cierra | Recarga página o F5 |
| API error 404 | Verifica que /api/articulos sea accesible |
| Búsqueda no funciona | Verifica que haya artículos primero |
| Botones no funcionan | Abre F12 y revisa errores en consola |

---

## 🎓 Próximos Pasos

1. **Leer la documentación completa:**
   - [Guía del Administrador](./GUIA_ADMIN_CMS.md)
   - [Documentación Técnica](./DOCUMENTACION_TECNICA.md)

2. **Personalizar el panel:**
   - Cambiar colores en `styles.css`
   - Cambiar límites en `script.js`
   - Agregar nuevos campos

3. **Desplegar en producción:**
   - Configura un servidor en la nube
   - Usa variables de entorno para URLs de API
   - Agrega autenticación

---

## 📞 Soporte

Si encuentras problemas:

1. **Abre la consola:** F12
2. **Copia los errores**
3. **Consulta:** [Solución de Problemas](./GUIA_ADMIN_CMS.md#solución-de-problemas)
4. **Revisa el código** en los archivos documentados

---

**¡Listo! Ahora puedes probar el panel administrativo completamente funcional! 🎉**

Para pruebas avanzadas, consulta la documentación técnica.
