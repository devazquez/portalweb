# Panel Administrativo - CMS Simple

> **Versión 1.1** - Incluye fix para error "articulos is not iterable"

## 📁 Estructura de Archivos

```
public/
├── index.html          # Estructura HTML del panel
├── styles.css          # Estilos CSS (700+ líneas)
├── script.js           # Funcionalidad JavaScript (600+ líneas)
└── README.md           # Este archivo
```

## 🚀 Inicio Rápido

### Requisitos
- Servidor Node.js ejecutándose en `http://localhost:3001`
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- **Nota:** Si ves error "articulos is not iterable", ver [FIX v1.1](#fix-v11)

### Acceso
1. Inicia el servidor CMS:
   ```bash
   npm start
   ```

2. Abre tu navegador en:
   ```
   http://localhost:3001
   ```

## 🔧 Fix v1.1 - "articulos is not iterable"

**Estado:** ✅ CORREGIDO

Si ves este error:
```
Error: TypeError: articulos is not iterable
```

**Solución rápida (2 minutos):**
1. `npm start`
2. `Ctrl+Shift+R` en navegador
3. Intenta crear artículo
4. ✅ Debería funcionar

**Documentación:**
- [SOLUCION_RAPIDA_ERROR.md](../../SOLUCION_RAPIDA_ERROR.md)
- [FIX_ARTICULOS_ITERABLE.md](../../FIX_ARTICULOS_ITERABLE.md)
- [TROUBLESHOOTING.md](../../TROUBLESHOOTING.md)

## 📋 Archivos Incluidos

### index.html
- **Propósito:** Estructura HTML semántica del panel
- **Tamaño:** ~250 líneas
- **Componentes:**
  - Sidebar con navegación
  - Header con título
  - 4 secciones principales (Dashboard, Artículos, Crear, Configuración)
  - Modal para editar artículos
  - Sistema de notificaciones
  - Formularios con validación

### styles.css
- **Propósito:** Estilos profesionales y responsivos
- **Tamaño:** ~700 líneas
- **Características:**
  - Variables CSS para colores y espaciado
  - Diseño responsive (mobile, tablet, desktop)
  - Animaciones suaves
  - Hover effects
  - Dark/Light compatible
  - Grid y Flexbox
  - Media queries para todos los tamaños

### script.js
- **Propósito:** Lógica y funcionalidad del panel
- **Tamaño:** ~600 líneas
- **Funcionalidades:**
  - Navegación entre secciones
  - Llamadas CRUD a la API
  - Búsqueda y filtrado en tiempo real
  - Paginación
  - Validación de formularios
  - Contador de caracteres
  - Modal de edición
  - Sistema de notificaciones
  - Exportación de datos

## 🎯 Funcionalidades Principales

### Dashboard
- Estadísticas del sistema (total, hoy, palabras, última actualización)
- Lista de artículos recientes
- Información general

### Gestionar Artículos
- Tabla con todos los artículos
- Búsqueda en tiempo real
- Paginación (10 artículos por página)
- Botones para Editar y Eliminar

### Crear Artículo
- Formulario con validación
- Campos: Título, Descripción, Cuerpo, Autor
- Contador de caracteres
- Validación de campos requeridos

### Configuración
- Información del sistema
- Estadísticas de uso
- Botones para Exportar y Limpiar datos

## 🔧 Configuración

### Cambiar el puerto de API
En `script.js`, línea ~12:
```javascript
const API_BASE = 'http://localhost:1337/api'; // Cambiar puerto según sea necesario
```

### Cambiar máximo de caracteres
En `script.js`, sección de validación:
```javascript
const maxCaracteres = 5000; // Cambiar límite aquí
```

### Cambiar artículos por página
En `script.js`, línea ~20:
```javascript
const articulosPorPagina = 10; // Cambiar cantidad aquí
```

## 🎨 Personalización de Estilos

### Cambiar colores
En `styles.css`, sección `:root`:
```css
:root {
    --primary-color: #4F46E5;      /* Color principal */
    --secondary-color: #06B6D4;    /* Color secundario */
    --success-color: #10B981;      /* Color éxito */
    --danger-color: #EF4444;       /* Color peligro */
    /* ... más colores */
}
```

### Cambiar tipografía
Busca `font-family` en `styles.css`:
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, ...
```

### Ajustar anchos
- Sidebar: Cambiar `width: 280px`
- Main content: Cambiar `margin-left: 280px`

## 🔗 Integración con API

El panel se conecta a los siguientes endpoints:

```
GET    /api/articulos           # Listar todos
POST   /api/articulos           # Crear nuevo
GET    /api/articulos/:id       # Obtener uno
PUT    /api/articulos/:id       # Actualizar
DELETE /api/articulos/:id       # Eliminar
```

Todos los datos se envían/reciben en JSON con charset UTF-8.

## 📱 Responsive Design

### Breakpoints
- **Desktop:** 1024px+ (ancho completo)
- **Tablet:** 768px - 1023px (sidebar horizontal)
- **Mobile:** Menos de 768px (interfaz simplificada)

### Características responsive
- Sidebar se convierte en navegación horizontal en móvil
- Tabla se ajusta a pantalla pequeña
- Formularios ocupan ancho completo
- Botones adaptados para touch

## ⚙️ Requisitos Técnicos

### Navegadores Soportados
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Características JavaScript Utilizadas
- Fetch API (XMLHttpRequest moderno)
- ES6+ (const, let, arrow functions)
- Async/await para manejo de promesas
- Template literals
- DOM manipulation
- Event listeners

### Características CSS Utilizadas
- CSS Grid
- Flexbox
- CSS Variables
- Media Queries
- Animations/Transitions
- Box shadows
- Rounded corners

## 🐛 Debugging

### Abre la Consola del Navegador
```
F12 o Ctrl+Shift+I (Windows/Linux)
Cmd+Option+I (Mac)
```

### Mensajes de log útiles
El script registra:
- Carga de artículos: "Artículos cargados correctamente"
- Errores de API: "Error al cargar los artículos"
- Acciones completadas: "Artículo creado exitosamente"

## 📊 Información de Estado

### Dashboard Stats
- **Total**: Suma de todos los artículos
- **Hoy**: Artículos creados en las últimas 24 horas
- **Palabras**: Conteo total de palabras de todos los cuerpos
- **Última Actualización**: Timestamp del artículo más reciente

## 💾 Almacenamiento de Datos

Los datos se almacenan en:
- **Ubicación:** `/cms-simple/data.json`
- **Formato:** JSON con UTF-8
- **Estructura:** Array de objetos con campos: id, titulo, descripcion, cuerpo, autor, fecha

## 🔄 Flujo de Actualización

1. **Usuario interactúa** con el panel
2. **JavaScript captura el evento**
3. **Validación local** de datos
4. **Llamada CORS** al servidor API
5. **Servidor actualiza** data.json
6. **Respuesta JSON** al navegador
7. **Actualización del DOM** con nueva información
8. **Notificación** al usuario

## 🎓 Aprendizaje y Modificación

Este código es educativo y está diseñado para ser fácil de modificar:

### Para agregar campos nuevos:
1. Agregá el campo al HTML en index.html
2. Actualiza la validación en script.js
3. Incluye el campo en las llamadas CRUD

### Para cambiar la apariencia:
1. Modifica colors en styles.css
2. Ajusta espaciado y tamaños
3. Prueba en diferentes dispositivos

### Para agregar funcionalidades:
1. Escribe la función en script.js
2. Agrega event listener en inicializarEventos()
3. Integra con la API necesaria

## 📝 Licencia y Atribución

- **Desarrollador:** Portal Web ICAT
- **Versión:** 1.0
- **Última actualización:** Enero 2024
- **Estado:** ✅ Producción

## 🆘 Soporte

Para problemas o preguntas:

1. Consulta la [Guía del Admin](../GUIA_ADMIN_CMS.md)
2. Revisa la [Documentación Técnica](../DOCUMENTACION_TECNICA.md)
3. Abre la consola (F12) para ver errores
4. Verifica la [Especificación Técnica](../ESPECIFICACION_TECNICA.md)

---

**Panel Administrativo CMS Simple v1.0**
