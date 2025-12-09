# 📱 Guía del Panel Administrativo - CMS Simple

## Índice
1. [Introducción](#introducción)
2. [Acceso al Panel](#acceso-al-panel)
3. [Características Principales](#características-principales)
4. [Secciones del Panel](#secciones-del-panel)
5. [Operaciones CRUD](#operaciones-crud)
6. [Búsqueda y Filtrado](#búsqueda-y-filtrado)
7. [Exportación de Datos](#exportación-de-datos)
8. [Solución de Problemas](#solución-de-problemas)

---

## Introducción

El **Panel Administrativo del CMS Simple** es una interfaz gráfica moderna que permite gestionar fácilmente todos los artículos de contenido sin necesidad de utilizar herramientas de línea de comandos o APIs directas.

### ✨ Características Principales
- ✅ Interfaz intuitiva y moderna
- ✅ Operaciones CRUD completas (Crear, Leer, Actualizar, Eliminar)
- ✅ Búsqueda y filtrado en tiempo real
- ✅ Estadísticas del sistema en el dashboard
- ✅ Paginación de artículos
- ✅ Validación de formularios
- ✅ Exportación de datos a JSON
- ✅ Diseño responsive (funciona en móvil, tablet y desktop)
- ✅ Sistema de notificaciones en tiempo real

---

## Acceso al Panel

### Prerrequisitos
- El servidor CMS debe estar corriendo
- Conexión a internet (local)

### Pasos para Acceder

**1. Inicia el servidor CMS:**
```bash
# Con Node.js (en la carpeta cms-simple)
npm start
# o
node server.js
```

**2. Abre tu navegador web y ve a:**
```
http://localhost:3001
```

**3. El panel administrativo cargará automáticamente:**
- Verás el Dashboard con estadísticas
- El sidebar izquierdo con opciones de navegación
- El contenido principal en el área derecha

> **Nota:** Si usas Docker, reemplaza `localhost:3001` con la URL de tu contenedor (ej: `http://localhost:1337`)

---

## Características Principales

### 📊 Dashboard
El dashboard es la primera pantalla que ves. Muestra:

| Estadística | Descripción |
|-------------|------------|
| **Total de Artículos** | Número total de artículos en la base de datos |
| **Artículos Hoy** | Cuántos artículos se crearon en las últimas 24 horas |
| **Palabras Totales** | Suma de todas las palabras en todos los artículos |
| **Última Actualización** | Fecha y hora del artículo más reciente |
| **Artículos Recientes** | Lista de los 5 últimos artículos creados |

### 🔄 Navegación
El **Sidebar izquierdo** contiene 4 secciones principales:

```
📊 Dashboard      → Vista general del sistema
📄 Artículos     → Gestionar artículos existentes
➕ Crear         → Crear nuevo artículo
⚙️ Configuración → Opciones del sistema
```

Haz clic en cualquier opción para cambiar de sección.

---

## Secciones del Panel

### 1️⃣ Dashboard 📊

**Ubicación:** Primera opción del sidebar

**Funcionalidad:**
- Visualiza estadísticas en tiempo real
- Ve los 5 artículos más recientes
- Monitorea el estado del sistema

**Acciones disponibles:**
- Ninguna acción directa (solo lectura)
- Haz clic en "Artículos" para editar

---

### 2️⃣ Gestionar Artículos 📄

**Ubicación:** Segunda opción del sidebar

**Funcionalidad:**
- Visualiza una tabla con todos los artículos
- Búsqueda en tiempo real
- Paginación de resultados
- Edición y eliminación rápida

#### Tabla de Artículos

La tabla muestra:
| Columna | Contenido |
|---------|----------|
| **Título** | Nombre del artículo (primeros 50 caracteres) |
| **Autor** | Quien creó/editó el artículo |
| **Fecha** | Cuándo se creó el artículo |
| **Tamaño** | Cantidad de caracteres en el contenido |
| **Acciones** | Botones para Editar (✏️) o Eliminar (🗑️) |

#### Búsqueda

1. Ingresa un término en el campo de búsqueda
2. La tabla se actualiza automáticamente
3. Busca por:
   - Título del artículo
   - Descripción
   - Contenido
   - Nombre del autor

> **Tip:** La búsqueda es **case-insensitive** (no distingue mayúsculas)

#### Paginación

- Los artículos se muestran de 10 en 10
- Usa los botones "Anterior" y "Siguiente"
- O haz clic en un número de página específico

#### Edición Rápida

**Para editar un artículo:**

1. Localiza el artículo en la tabla
2. Haz clic en el botón **✏️ Editar**
3. Se abre una ventana modal (emergente)
4. Modifica los campos necesarios
5. Haz clic en **Actualizar Artículo**
6. Verás una notificación de éxito

#### Eliminación

**Para eliminar un artículo:**

1. Localiza el artículo en la tabla
2. Haz clic en el botón **🗑️ Eliminar**
3. Confirma la eliminación en el diálogo
4. El artículo se elimina inmediatamente

> ⚠️ **Advertencia:** La eliminación es irreversible

---

### 3️⃣ Crear Nuevo Artículo ➕

**Ubicación:** Tercera opción del sidebar

**Funcionalidad:**
- Formulario para crear nuevos artículos
- Validación automática
- Contador de caracteres

#### Campos del Formulario

| Campo | Tipo | Validación | Ejemplo |
|-------|------|-----------|---------|
| **Título** | Texto | Requerido | "Mi Primer Artículo" |
| **Descripción** | Texto | Requerido | "Una breve descripción del tema" |
| **Cuerpo** | Texto largo | Requerido, máx 5000 caracteres | "Contenido principal del artículo..." |
| **Autor** | Texto | Opcional | "Juan García" |

#### Cómo Crear un Artículo

1. Ve a la sección **"Crear Nuevo Artículo"**
2. Completa el formulario:
   - **Título:** Asunto principal
   - **Descripción:** Resumen breve (máx 200 caracteres)
   - **Cuerpo:** Contenido completo del artículo
   - **Autor:** Tu nombre (opcional)
3. Verás un **contador de caracteres** en el cuerpo
4. Haz clic en **"Crear Artículo"**
5. Si hay errores, se resaltan en rojo
6. Si es exitoso, verás una notificación y se redirige a "Artículos"

#### Validación de Campos

- Campos marcados con `*` son obligatorios
- Si dejas un campo requerido vacío, verás un error
- El cuerpo tiene un límite de 5000 caracteres
- El contador actualiza en tiempo real

---

### 4️⃣ Configuración ⚙️

**Ubicación:** Cuarta opción del sidebar

**Funcionalidad:**
- Información del sistema
- Estadísticas avanzadas
- Acciones de administración

#### Panel de Información

Muestra:
- Total de artículos
- Espacio utilizado (en KB)
- Última sincronización
- Versión del sistema

#### Acciones Disponibles

**Exportar Artículos**
- Descarga todos los artículos en formato JSON
- Útil para backups o migración
- Archivo se descarga automáticamente

**Limpiar Datos**
- Elimina TODOS los artículos
- Requiere 2 confirmaciones de seguridad
- ⚠️ **No se puede deshacer**

---

## Operaciones CRUD

### CREATE (Crear)

**Opción:** Sección "Crear Nuevo Artículo"

```bash
POST /api/articulos
Content-Type: application/json

{
  "titulo": "Mi Nuevo Artículo",
  "descripcion": "Una descripción breve",
  "cuerpo": "Contenido completo del artículo...",
  "autor": "Nombre del Autor",
  "fecha": "2024-01-15T10:30:00Z"
}
```

---

### READ (Leer)

**Opción:** Sección "Gestionar Artículos"

```bash
GET /api/articulos
```

Muestra todos los artículos en una tabla.

---

### UPDATE (Actualizar)

**Opción:** Botón "✏️ Editar" en la tabla

```bash
PUT /api/articulos/{id}
Content-Type: application/json

{
  "titulo": "Título Actualizado",
  "descripcion": "Descripción actualizada",
  "cuerpo": "Contenido actualizado...",
  "autor": "Nuevo Autor",
  "fecha": "2024-01-15T10:30:00Z"
}
```

---

### DELETE (Eliminar)

**Opción:** Botón "🗑️ Eliminar" en la tabla

```bash
DELETE /api/articulos/{id}
```

---

## Búsqueda y Filtrado

### Búsqueda por Texto

**En la sección "Gestionar Artículos":**

1. Localiza el campo de búsqueda en la parte superior
2. Comienza a escribir tu término
3. La tabla se filtra automáticamente
4. Busca coincidencias en:
   - Título
   - Descripción
   - Contenido del cuerpo
   - Nombre del autor

### Ejemplos de Búsqueda

```
"tecnología"     → Encuentra artículos sobre tecnología
"Juan"           → Encuentra artículos del autor Juan
"2024"           → Encuentra artículos del año 2024
"tutorial"       → Encuentra tutoriales
```

### Filtrado por Paginación

- **10 artículos por página**
- Navega con los botones "Anterior" y "Siguiente"
- O selecciona una página específica

---

## Exportación de Datos

### Exportar a JSON

**Ubicación:** Sección "Configuración" → Botón "Exportar Artículos"

**Proceso:**

1. Ve a **Configuración**
2. Haz clic en **"Exportar Artículos"**
3. Se descargará un archivo JSON con nombre:
   ```
   articulos_2024-01-15.json
   ```

**Estructura del archivo:**

```json
[
  {
    "id": "1",
    "titulo": "Mi Artículo",
    "descripcion": "Descripción",
    "cuerpo": "Contenido...",
    "autor": "Autor",
    "fecha": "2024-01-15T10:30:00Z"
  },
  {
    "id": "2",
    "titulo": "Otro Artículo",
    ...
  }
]
```

### Casos de Uso

- **Backup:** Realiza copias de seguridad regulares
- **Migración:** Transfiere datos a otro sistema
- **Análisis:** Procesa los datos en herramientas externas
- **Respaldo:** Guarda versiones históricas

---

## Solución de Problemas

### ❌ "No puedo acceder al panel"

**Causas posibles:**
1. El servidor no está corriendo
2. Puerto incorrecto
3. Firewall bloqueando la conexión

**Solución:**

```bash
# Verifica que el servidor esté corriendo
cd cms-simple
npm start

# Intenta acceder a:
http://localhost:3001

# Si usas Docker:
http://localhost:1337
```

---

### ❌ "Los cambios no se guardan"

**Causas posibles:**
1. Error de validación (campos vacíos)
2. Servidor desconectado
3. Error de red

**Solución:**

- Verifica el navegador por mensajes de error (rojo)
- Abre la consola (F12) y busca errores
- Recarga la página (Ctrl + F5)
- Reinicia el servidor

---

### ❌ "No veo los artículos en la tabla"

**Causas posibles:**
1. No hay artículos creados
2. La búsqueda está filtrando todos
3. Error al cargar datos

**Solución:**

```bash
# Limpia el término de búsqueda
# Haz clic en el campo de búsqueda y bórralo

# Recarga la página
Ctrl + F5

# Crea un nuevo artículo de prueba
```

---

### ❌ "El modal de edición no cierra"

**Solución:**

1. Haz clic en el botón **X** de cierre (esquina superior derecha)
2. Haz clic fuera del modal
3. Recarga la página si persiste

---

### ❌ "Los estilos no se ven correctamente"

**Causas posibles:**
1. Caché del navegador
2. Archivos CSS no cargados
3. Ruta incorrecta

**Solución:**

```bash
# Limpia caché del navegador
Ctrl + Shift + Delete

# Realiza una recarga forzada
Ctrl + Shift + R (o Cmd + Shift + R en Mac)

# Verifica que los archivos existan
- /public/styles.css
- /public/script.js
- /public/index.html
```

---

### ✅ Información de Contacto y Soporte

Si encuentras problemas que no están listados aquí:

1. **Abre la consola del navegador:** F12
2. **Copia los errores que aparecen**
3. **Incluye información del sistema:**
   - Navegador y versión
   - Sistema operativo
   - Pasos exactos para reproducir el error

---

## 🎯 Consejos y Mejores Prácticas

### ✨ Consejos de Uso

1. **Realiza copias de seguridad:**
   - Exporta tus datos regularmente
   - Mantén backups en un lugar seguro

2. **Titula bien tus artículos:**
   - Usa títulos descriptivos y claros
   - Facilita la búsqueda posterior

3. **Usa la descripción efectivamente:**
   - Resumen de 1-2 líneas
   - Ayuda a los lectores a entender el contenido

4. **Especifica el autor:**
   - Importante para atribución
   - Facilita identificar quién escribió qué

5. **Revisa antes de publicar:**
   - Verifica ortografía
   - Comprueba la formatting
   - Prueba los enlaces

### 🔒 Seguridad

1. No compartas tu URL de admin públicamente
2. Usa contraseñas fuertes si añades autenticación
3. Mantén backups regulares
4. No elimines datos sin confirmar primero

### ⚡ Rendimiento

1. La tabla soporta hasta 1000+ artículos
2. La búsqueda es instantánea
3. Para bases de datos muy grandes, considera optimizaciones

---

## 📚 Referencias Relacionadas

- [Documentación Técnica del CMS](./DOCUMENTACION_TECNICA.md)
- [Guía Rápida de Instalación](./GUIA_RAPIDA.md)
- [API REST Completa](./ESPECIFICACION_TECNICA.md)
- [Especificación Técnica](./ESPECIFICACION_TECNICA.md)

---

**Versión:** 1.0  
**Última actualización:** Enero 2024  
**Estado:** ✅ Documentado

