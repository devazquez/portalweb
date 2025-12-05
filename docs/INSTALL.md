# Guía Detallada de Instalación y Despliegue

## Tabla de Contenidos
1. [Requisitos del Sistema](#requisitos-del-sistema)
2. [Instalación Local](#instalación-local)
3. [Despliegue con Docker](#despliegue-con-docker)
4. [Configuración de Servicios](#configuración-de-servicios)
5. [Troubleshooting](#troubleshooting)

## Requisitos del Sistema

### Software Obligatorio
- **Node.js 18.x LTS** (o superior)
- **npm 9.x** (incluido con Node.js)
- **Git** (para control de versiones)

### Software Opcional (Recomendado)
- **Docker Desktop 4.0+** (para containerización)
- **Visual Studio Code** (editor de código)
- **Postman** (pruebas de API)

### Requisitos de Hardware
- **RAM Mínima**: 4GB (8GB recomendado)
- **Espacio en Disco**: 5GB
- **Procesador**: Dual-core 2GHz o superior
- **Conexión**: 10 Mbps (para descargas iniciales)

## Instalación Local

### Paso 1: Descargar Node.js

1. Visita https://nodejs.org/
2. Descarga la versión LTS (18.x o superior)
3. Ejecuta el instalador
4. Sigue las instrucciones del asistente
5. Reinicia la computadora

### Paso 2: Verificar Instalación

Abre PowerShell y ejecuta:

```powershell
node --version
# Debe mostrar v18.x.x o superior

npm --version
# Debe mostrar 9.x.x o superior
```

### Paso 3: Descargar el Proyecto

```powershell
# Opción 1: Si tienes Git
git clone <URL-del-repositorio>
cd portalweb

# Opción 2: Descargar como ZIP
# 1. Descarga el ZIP desde GitHub
# 2. Extrae en una carpeta
# 3. Abre PowerShell en esa carpeta
```

### Paso 4: Instalar Dependencias

```powershell
# Instalar todas las dependencias
npm install

# Esperar a que termine (puede tomar 2-3 minutos)
```

### Paso 5: Configurar Variables de Entorno

```powershell
# Crear archivo de configuración
Copy-Item .env.example .env.local

# Editar con Notepad (o tu editor preferido)
notepad .env.local
```

**Contenido de .env.local:**
```
VITE_OMEKA_API_URL=http://localhost:8081/api
VITE_CMS_API_URL=http://localhost:8082/api
VITE_API_TIMEOUT=30000
```

### Paso 6: Ejecutar en Desarrollo

```powershell
# Iniciar servidor de desarrollo
npm run dev

# Verás algo como:
# VITE v4.4.11 ready in 123 ms
# 
# ➜  Local:   http://localhost:3000/
# ➜  press h to show help
```

### Paso 7: Acceder a la Aplicación

1. Abre tu navegador (Chrome, Firefox, Edge)
2. Ve a `http://localhost:3000`
3. ¡Deberías ver el portal funcionando!

### Paso 8: Detener el Servidor

```powershell
# En la ventana de PowerShell donde corre el servidor
Ctrl + C
```

## Despliegue con Docker

### Requisitos Previos

1. **Descargar Docker Desktop**
   - Visita https://www.docker.com/products/docker-desktop
   - Descarga la versión para Windows
   - Ejecuta el instalador
   - Reinicia la computadora

2. **Verificar Instalación**
   ```powershell
   docker --version
   # Debe mostrar: Docker version 20.10.x o superior
   
   docker-compose --version
   # Debe mostrar: Docker Compose version 2.x.x o superior
   ```

### Opción A: Despliegue Completo (Todos los servicios)

```powershell
# 1. Navega al directorio del proyecto
cd d:\Usuarios\DEVazquezC\Documents\ICAT\IIS\portalweb

# 2. Construir todas las imágenes
docker-compose build

# 3. Iniciar todos los servicios
docker-compose up -d

# 4. Esperar 30-60 segundos para que se inicialicen

# 5. Verificar estado
docker-compose ps

# Deberías ver algo como:
# NAME              STATUS
# iis-portal-web    Up 2 seconds (healthy)
# iis-omeka         Up 3 seconds (health: starting)
# iis-cms           Up 2 seconds (health: starting)
# ...
```

**URLs de Acceso:**
| Servicio | URL | Usuario | Contraseña |
|----------|-----|---------|-----------|
| Portal Web | http://localhost:3000 | - | - |
| Omeka-S | http://localhost:8081 | admin@example.com | root_password |
| CMS Strapi | http://localhost:1337/admin | crear en setup | - |
| Redis | localhost:6379 | - | - |

### Opción B: Solo Frontend

Si solo quieres probar el frontend:

```powershell
# 1. Construir imagen
docker build -t iis-portal-web:latest .

# 2. Ejecutar contenedor
docker run -d `
  -p 3000:3000 `
  --name iis-portal `
  iis-portal-web:latest

# 3. Acceder a http://localhost:3000

# 4. Ver logs
docker logs -f iis-portal

# 5. Detener
docker stop iis-portal
docker rm iis-portal
```

### Comandos Útiles de Docker

```powershell
# Ver estado de servicios
docker-compose ps

# Ver logs
docker-compose logs -f
docker-compose logs -f portal  # Solo servicio específico

# Detener servicios
docker-compose stop

# Reiniciar servicios
docker-compose restart

# Limpiar todo (advertencia: borra datos)
docker-compose down
docker-compose down -v  # También elimina volúmenes

# Reconstruir específico
docker-compose build portal
docker-compose up -d portal

# Ejecutar comando en contenedor
docker-compose exec portal npm run build

# Inspeccionar contenedor
docker ps
docker inspect <container-id>
```

## Configuración de Servicios

### Omeka-S (Repositorio Digital)

1. **Acceso Inicial**
   - URL: http://localhost:8081
   - Se abrirá asistente de instalación
   - Usuario: admin@example.com
   - Contraseña: root_password

2. **Crear Elementos de Prueba**
   - Ir a: Administration → Items → Add Item
   - Llenar datos del recurso
   - Agregar archivos si es necesario
   - Guardar

3. **Habilitar API**
   - Ir a: Administration → Settings
   - Buscar "API"
   - Habilitar "API"
   - Crear API Key para acceso programático

4. **Configurar CORS** (importante para comunicación cross-origin)
   - Editar: `config/local.config.php`
   - Agregar:
   ```php
   'http_client' => [
       'sslverifypeer' => false,
   ],
   'cors_allow_origin' => ['*'],
   ```

### CMS Strapi (Headless CMS)

1. **Setup Inicial**
   - URL: http://localhost:1337/admin
   - Crear usuario administrador
   - Completar wizard de inicio

2. **Crear Content Types**
   - Ir a: Content-Type Builder
   - Crear nuevos tipos:
     - Artículos
     - Noticias
     - Páginas
     - Categorías

3. **Crear Contenido**
   - Ir al panel de contenido
   - Crear entradas en cada tipo

4. **Configurar API Permissions**
   - Ir a: Settings → Users & Permissions → Roles
   - Editar "Public"
   - Habilitar acceso a endpoints necesarios
   - Guardar

5. **Generar JWT Token**
   - Ir a: Settings → API Tokens
   - Crear nuevo token
   - Configurar permisos
   - Copiar token para uso en frontend

### Base de Datos

**Omeka-S (MySQL)**
```
Host: omeka-db (en Docker) o localhost (local)
Puerto: 3306
Base de datos: omeka
Usuario: omeka
Contraseña: omeka_password
```

**CMS Strapi (PostgreSQL)**
```
Host: cms-db (en Docker) o localhost (local)
Puerto: 5432
Base de datos: strapi
Usuario: strapi
Contraseña: strapi_password
```

### Redis (Caché)

```powershell
# Verificar conexión
redis-cli -h localhost -p 6379 ping
# Debe responder: PONG

# Ver keys almacenadas
redis-cli -h localhost keys "*"

# Limpiar caché
redis-cli -h localhost flushdb
```

## Troubleshooting

### Problema: "Command not found: npm"

**Solución:**
```powershell
# Node.js no está instalado o no está en PATH
# 1. Descargar Node.js desde nodejs.org
# 2. Ejecutar instalador
# 3. Reiniciar PowerShell
# 4. Verificar: npm --version
```

### Problema: "Port 3000 already in use"

**Solución:**
```powershell
# Opción 1: Cambiar puerto en vite.config.js
# Editar línea: port: 3001

# Opción 2: Matar proceso existente
netstat -ano | findstr :3000
# Encontrar PID
taskkill /PID <PID> /F

# Opción 3: En Docker
docker ps
docker stop <container-id>
```

### Problema: "CORS Error"

**Solución:**
```
1. Verificar que APIs estén corriendo
2. Checar URLs en .env.local
3. Habilitar CORS en Omeka y Strapi
4. En navegador, ver Console (F12) para detalles
```

### Problema: "Cannot GET /" después de desplegar

**Solución:**
```powershell
# Asegurar que build se completó
npm run build
# Verificar que exista carpeta 'dist/'

# Probar con serve
npx serve -s dist -l 3000

# O en Docker
docker-compose build --no-cache
docker-compose up -d --force-recreate
```

### Problema: "Docker: command not found"

**Solución:**
```powershell
# Docker no está instalado
# 1. Descargar Docker Desktop
# 2. Ejecutar instalador
# 3. Reiniciar computadora
# 4. Verificar: docker --version
```

### Problema: "Conexión rechazada a APIs"

**Solución:**
```powershell
# Verificar que contenedores estén corriendo
docker-compose ps

# Verificar logs
docker-compose logs omeka
docker-compose logs cms

# Asegurarse de que los servicios están saludables
docker-compose up -d
# Esperar 1-2 minutos

# Probar conectividad
curl http://localhost:8081/api/items
```

### Problema: Base de datos no inicializa

**Solución:**
```powershell
# Limpiar y reiniciar
docker-compose down -v
docker-compose up --build

# Ver logs de base de datos
docker-compose logs omeka-db
docker-compose logs cms-db

# Verificar permisos de volúmenes
docker volume ls
docker volume inspect <volume-name>
```

## Próximos Pasos

1. **Explorar la Aplicación**
   - Navegar por el portal
   - Probar búsqueda
   - Ver detalles de recursos

2. **Integrar Datos Reales**
   - Pobllar Omeka con recursos reales
   - Agregar contenidos a Strapi
   - Probar sincronización

3. **Personalizar Diseño**
   - Reemplazar logos
   - Ajustar colores en `main.css`
   - Adaptar contenido

4. **Configurar Producción**
   - Obtener certificado SSL
   - Configurar dominio
   - Configurar backups
   - Configurar monitoreo

## Contacto y Soporte

Si tienes problemas:

1. Revisar este documento
2. Consultar README.md
3. Ver logs: `docker-compose logs`
4. Contactar: info@iis.unam.mx

---

**Última actualización:** Diciembre 2024
