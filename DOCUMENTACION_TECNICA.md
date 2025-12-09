# Portal Web del Instituto de Investigaciones Sociales - UNAM

## Documentación Técnica Completa

**Documento de Especificación y Guía de Instalación**

**Fecha:** Diciembre 2025  
**Versión:** 1.0  
**Autor:** Equipo de Desarrollo IIS  
**Institución:** Instituto de Investigaciones Sociales, UNAM

---

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Descripción General del Proyecto](#descripción-general-del-proyecto)
3. [Arquitectura del Sistema](#arquitectura-del-sistema)
4. [Tecnologías Utilizadas](#tecnologías-utilizadas)
5. [Componentes del Sistema](#componentes-del-sistema)
6. [Requisitos de Instalación](#requisitos-de-instalación)
7. [Guía de Instalación](#guía-de-instalación)
8. [Configuración y Despliegue](#configuración-y-despliegue)
9. [API Reference](#api-reference)
10. [Estructura del Código](#estructura-del-código)
11. [Mantenimiento y Troubleshooting](#mantenimiento-y-troubleshooting)

---

## 1. Introducción

El **Portal Web del Instituto de Investigaciones Sociales** es una plataforma web integrada diseñada para facilitar el acceso, búsqueda y visualización de recursos digitales y contenido editorial. 

El portal combina dos fuentes principales de contenido:
- **Omeka 2.x**: Repositorio digital para recursos académicos y culturales
- **CMS Simple (Node.js)**: Sistema de gestión de contenidos para artículos y documentación editorial

Este documento proporciona la documentación técnica completa del prototipo, incluyendo arquitectura, componentes, requisitos de instalación y guías de despliegue.

---

## 2. Descripción General del Proyecto

### 2.1 Objetivo

Crear una plataforma web moderna que permita:
- Catalogar y organizar recursos digitales del IIS
- Proporcionar una búsqueda unificada en múltiples fuentes
- Ofrecer acceso fácil a contenido académico y editorial
- Mantener una interfaz intuitiva y responsive

### 2.2 Características Principales

✅ **Búsqueda Unificada**: Busca simultáneamente en Omeka (repositorio) y CMS (artículos)  
✅ **Interfaz Moderna**: Diseño responsive con Vue.js 3  
✅ **API REST**: Endpoints para integración con sistemas externos  
✅ **CORS Habilitado**: Permite acceso desde diferentes dominios  
✅ **Almacenamiento Flexible**: Combina bases de datos SQL y JSON  
✅ **Docker Ready**: Despliegue simple con Docker Compose  

### 2.3 Usuarios Objetivo

- Investigadores y académicos del IIS
- Público general interesado en recursos del Instituto
- Administradores del portal (para gestión de contenido)

---

## 3. Arquitectura del Sistema

### 3.1 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    Navegador Web                            │
│              (Cliente - Vue.js 3 + Vite)                    │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
    ┌────────┐      ┌────────┐      ┌────────┐
    │ Portal │      │ Omeka  │      │ CMS    │
    │ Web    │      │ API    │      │ API    │
    │ 3000   │      │ 8081   │      │ 1337   │
    └────┬───┘      └───┬────┘      └───┬────┘
         │              │               │
         │              ▼               ▼
         │         ┌─────────┐      ┌─────────┐
         │         │ Omeka   │      │ Node.js │
         │         │ Apache  │      │ Server  │
         │         │ PHP     │      └────┬────┘
         │         └────┬────┘           │
         │              │                ▼
         │              ▼            ┌─────────┐
         │         ┌─────────┐       │ data    │
         │         │ MySQL   │       │.json    │
         │         │ Omeka   │       │(JSON)   │
         │         └─────────┘       └─────────┘
         │
         ▼
    ┌──────────┐
    │  Nginx   │
    │ Reverse  │
    │  Proxy   │
    │ 80/443   │
    └──────────┘
```

### 3.2 Stack Tecnológico

**Frontend:**
- Vue.js 3 (Framework UI)
- Vite (Build tool)
- Vue Router (Routing)
- Pinia (State management)
- Axios (HTTP client)
- DOMPurify (Sanitización HTML)

**Backend - Portal:**
- Node.js 22
- Express.js (No usado directamente, servido por Nginx)

**Backend - Omeka:**
- PHP 7.x
- Apache 2.4
- MySQL 8.0

**Backend - CMS:**
- Node.js 22
- Express.js
- Almacenamiento JSON

**Infraestructura:**
- Docker & Docker Compose
- Nginx (Reverse proxy)
- Redis (Caché opcional)
- PostgreSQL (No usado actualmente)

---

## 4. Tecnologías Utilizadas

### 4.1 Frontend

| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| Vue.js | 3.x | Framework reactivo |
| Vite | 4.x | Build tool moderno |
| Axios | 1.x | Cliente HTTP |
| Vue Router | 4.x | Enrutamiento de páginas |
| Pinia | 2.x | Gestión de estado |
| DOMPurify | 3.x | Sanitización HTML |

### 4.2 Backend

| Componente | Tecnología | Versión |
|-----------|-----------|---------|
| Omeka (Repositorio) | PHP / Apache | 7.4 / 2.4 |
| Base Datos Omeka | MySQL | 8.0 |
| CMS Simple | Node.js / Express | 22 / 4.18 |
| Almacenamiento CMS | JSON (archivo) | - |
| Reverse Proxy | Nginx | Alpine |
| Orquestación | Docker Compose | 2.x |

### 4.3 Herramientas de Desarrollo

| Herramienta | Propósito |
|-----------|----------|
| Git | Control de versiones |
| Docker | Containerización |
| npm | Package management |
| PowerShell | Scripting (Windows) |
| VS Code | Editor de código |

---

## 5. Componentes del Sistema

### 5.1 Portal Web (Frontend)

**Ubicación:** `/src/`

**Componentes principales:**
- `App.vue`: Componente raíz
- `Header.vue`: Encabezado y navegación
- `Footer.vue`: Pie de página
- `Navigation.vue`: Menú de navegación

**Vistas:**
- `Home.vue`: Página de inicio
- `Search.vue`: Búsqueda avanzada
- `Resources.vue`: Catálogo de recursos
- `ResourceDetail.vue`: Detalle de recurso
- `NotFound.vue`: Página 404

**Stores (Pinia):**
- `resources.js`: Gestión de recursos y búsqueda

**API:**
- `api/index.js`: Integración con APIs externas

### 5.2 Omeka 2.x (Repositorio Digital)

**Ubicación:** Puerto 8081 (HTTP) / 80 (interno)

**Funciones:**
- Almacenamiento de recursos digitales
- Gestión de metadatos
- Catálogo estructurado
- API REST en `/api/items`

**Base de datos:** MySQL 8.0

**Características:**
- CORS habilitado (headers en .htaccess)
- API pública accesible
- Soporte para múltiples tipos de recursos

### 5.3 CMS Simple (Node.js)

**Ubicación:** `cms-simple/`  
**Puerto:** 1337 (HTTP) / 3001 (interno)

**Archivos principales:**
```
cms-simple/
├── server.js           # Servidor Express
├── data.json           # Base de datos JSON
├── package.json        # Dependencias
├── Dockerfile          # Containerización
├── init-data.sh        # Script inicialización
└── .gitignore          # Exclusiones git
```

**Endpoints API:**
- `GET /api/articulos` - Listar artículos
- `GET /api/articulos/:id` - Obtener artículo
- `GET /api/search?query=...` - Buscar
- `POST /api/articulos` - Crear
- `PUT /api/articulos/:id` - Actualizar
- `DELETE /api/articulos/:id` - Eliminar

---

## 6. Requisitos de Instalación

### 6.1 Requisitos de Hardware

- **CPU:** 2+ cores (recomendado 4)
- **RAM:** 4GB mínimo (8GB recomendado)
- **Almacenamiento:** 20GB libre (SSD recomendado)
- **Conexión:** Acceso a internet para descargas

### 6.2 Requisitos de Software

#### Windows
- **Docker Desktop for Windows** (versión 4.0+)
- **Git for Windows** (versión 2.30+)
- **PowerShell 5.1** (incluido en Windows 10/11)
- **Node.js 22** (solo si desarrollo local sin Docker)

#### macOS
- **Docker Desktop for Mac** (versión 4.0+)
- **Git** (incluido o `brew install git`)
- **Xcode Command Line Tools** (opcional)

#### Linux
- **Docker CE** (versión 20.10+)
- **Docker Compose** (versión 2.0+)
- **Git** (`apt-get install git`)
- **bash/zsh**

### 6.3 Puertos Requeridos

| Servicio | Puerto | Protocolo | Notas |
|---------|--------|-----------|-------|
| Portal Web | 3000 | HTTP | Frontend Vue.js |
| Omeka | 8081 | HTTP | Repositorio |
| CMS Simple | 1337 | HTTP | API CMS |
| Nginx | 80, 443 | HTTP/HTTPS | Reverse proxy |
| MySQL | 3306 | TCP | Interno (no expuesto) |
| Redis | 6379 | TCP | Caché (opcional) |

---

## 7. Guía de Instalación

### 7.1 Instalación en Windows

#### Paso 1: Clonar el repositorio

```powershell
cd C:\Users\TuUsuario\Documents
git clone https://github.com/tu-usuario/portalweb.git
cd portalweb
```

#### Paso 2: Instalar Docker Desktop

1. Descargar desde: https://www.docker.com/products/docker-desktop
2. Ejecutar instalador
3. Reiniciar Windows
4. Verificar instalación:
```powershell
docker --version
docker-compose --version
```

#### Paso 3: Iniciar los servicios

```powershell
# Navegar al directorio del proyecto
cd C:\Usuarios\DEVazquezC\Documents\ICAT\IIS\portalweb

# Construir las imágenes
docker-compose build

# Iniciar todos los servicios
docker-compose up -d

# Verificar que todo esté corriendo
docker-compose ps
```

#### Paso 4: Verificar instalación

Espera 30 segundos para que todos los servicios inicien:

```powershell
# Verificar Portal
Invoke-WebRequest -Uri "http://localhost:3000" | Select-Object StatusCode

# Verificar Omeka
Invoke-WebRequest -Uri "http://localhost:8081/api" | Select-Object StatusCode

# Verificar CMS
Invoke-WebRequest -Uri "http://localhost:1337/api/articulos" | Select-Object StatusCode
```

#### Paso 5: Acceder a la aplicación

- **Portal:** http://localhost:3000
- **Omeka Admin:** http://localhost:8081/admin
- **CMS API:** http://localhost:1337/api

### 7.2 Instalación en macOS

#### Paso 1: Clonar el repositorio

```bash
mkdir -p ~/Projects
cd ~/Projects
git clone https://github.com/tu-usuario/portalweb.git
cd portalweb
```

#### Paso 2: Instalar Docker Desktop

```bash
# Usar Homebrew (recomendado)
brew install --cask docker

# O descargar desde https://www.docker.com/products/docker-desktop
# Luego abrir la aplicación desde Applications
```

#### Paso 3: Iniciar servicios

```bash
# Dar permisos si es necesario
sudo chown -R $(whoami) .

# Construir
docker-compose build

# Iniciar
docker-compose up -d

# Verificar
docker-compose ps
```

#### Paso 4: Acceder

- Portal: http://localhost:3000
- Omeka: http://localhost:8081
- CMS: http://localhost:1337

### 7.3 Instalación en Linux (Ubuntu/Debian)

#### Paso 1: Instalar Docker y Docker Compose

```bash
# Actualizar paquetes
sudo apt update && sudo apt upgrade -y

# Instalar Docker
sudo apt install docker.io docker-compose git -y

# Agregar usuario al grupo docker
sudo usermod -aG docker $USER
newgrp docker

# Verificar
docker --version
docker-compose --version
```

#### Paso 2: Clonar el repositorio

```bash
cd ~
git clone https://github.com/tu-usuario/portalweb.git
cd portalweb
```

#### Paso 3: Iniciar servicios

```bash
# Construir
docker-compose build

# Iniciar
docker-compose up -d

# Verificar
docker-compose ps
```

#### Paso 4: Acceder

Los servicios estarán disponibles en:
- Portal: http://localhost:3000
- Omeka: http://localhost:8081
- CMS: http://localhost:1337

---

## 8. Configuración y Despliegue

### 8.1 Archivos de Configuración

#### `.env.local` - Variables de entorno del Portal

```bash
VITE_OMEKA_API_URL=http://localhost:8081/api
VITE_CMS_API_URL=http://localhost:1337/api
VITE_API_TIMEOUT=30000
```

#### `docker-compose.yml` - Orquestación de servicios

Define todos los servicios:
- Portal (Node.js + Vite)
- Omeka (Apache + PHP + MySQL)
- CMS (Node.js + Express)
- Nginx (Reverse proxy)
- Redis (Caché)

### 8.2 Volúmenes Docker

Los datos persisten en volúmenes Docker:

```
portalweb_omeka_db      → MySQL data (Omeka)
portalweb_omeka_files   → Archivos Omeka
portalweb_omeka_config  → Configuración Omeka
portalweb_cms_data      → data.json (CMS)
portalweb_redis_data    → Redis cache
portalweb_cms_db        → PostgreSQL (si se usa)
```

### 8.3 Comandos Útiles

```powershell
# Ver estado de servicios
docker-compose ps

# Ver logs de un servicio
docker-compose logs portal
docker-compose logs omeka
docker-compose logs cms

# Ejecutar comando en contenedor
docker-compose exec cms sh
docker-compose exec portal sh

# Reconstruir un servicio
docker-compose build --no-cache portal

# Detener servicios
docker-compose down

# Detener y limpiar volúmenes
docker-compose down -v

# Reiniciar un servicio
docker-compose restart cms
```

### 8.4 Despliegue en Producción

Para despliegue en producción:

1. **Cambiar variables de entorno:**
```bash
VITE_OMEKA_API_URL=https://tudominio.com/api
VITE_CMS_API_URL=https://tudominio.com:1337/api
```

2. **Configurar SSL/TLS:**
   - Obtener certificados (Let's Encrypt)
   - Configurar Nginx con certificados
   - Redirigir HTTP → HTTPS

3. **Backups:**
   - Automatizar backups de MySQL
   - Exportar data.json regularmente

4. **Monitoreo:**
   - Configurar logs
   - Health checks
   - Alertas

---

## 9. API Reference

### 9.1 Portal Web API

#### Búsqueda Global

```
GET /api/search?query=inteligencia&source=all

Parámetros:
- query (string): Término a buscar
- source (string): 'omeka', 'cms', o 'all' (default)

Respuesta:
{
  "results": [
    {
      "id": 1,
      "title": "Título",
      "description": "Descripción",
      "source": "omeka"
    }
  ]
}
```

### 9.2 Omeka API

#### Listar recursos

```
GET http://localhost:8081/api/items

Respuesta:
{
  "@context": "...",
  "@id": "...",
  "o:id": 1,
  "dcterms:title": [{"@value": "Título"}],
  "dcterms:description": [{"@value": "Descripción"}]
}
```

#### Buscar recursos

```
GET http://localhost:8081/api/items?search=término
```

### 9.3 CMS Simple API

#### Listar artículos

```
GET /api/articulos

Respuesta:
{
  "data": [
    {
      "id": 1,
      "title": "Título",
      "description": "Descripción",
      "body": "Contenido",
      "createdAt": "2025-12-09T19:47:39.715Z"
    }
  ],
  "meta": {"count": 1}
}
```

#### Obtener artículo

```
GET /api/articulos/1
```

#### Crear artículo

```
POST /api/articulos
Content-Type: application/json

{
  "title": "Nuevo artículo",
  "description": "Descripción",
  "body": "Contenido del artículo"
}
```

#### Actualizar artículo

```
PUT /api/articulos/1
Content-Type: application/json

{
  "title": "Título actualizado",
  "body": "Contenido actualizado"
}
```

#### Eliminar artículo

```
DELETE /api/articulos/1
```

#### Buscar artículos

```
GET /api/search?query=inteligencia

Busca en: title, description, body
```

---

## 10. Estructura del Código

### 10.1 Estructura de directorios

```
portalweb/
├── src/
│   ├── api/
│   │   └── index.js              # Integración de APIs
│   ├── components/
│   │   ├── Header.vue
│   │   ├── Footer.vue
│   │   └── Navigation.vue
│   ├── stores/
│   │   └── resources.js           # Pinia store
│   ├── views/
│   │   ├── Home.vue
│   │   ├── Search.vue
│   │   ├── Resources.vue
│   │   ├── ResourceDetail.vue
│   │   └── NotFound.vue
│   ├── App.vue
│   ├── main.js
│   └── router.js
├── public/
│   ├── logo.png
│   └── placeholder.jpg
├── cms-simple/
│   ├── server.js                 # Servidor CMS
│   ├── data.json                 # Base de datos
│   ├── package.json
│   ├── Dockerfile
│   └── init-data.sh
├── docs/
│   ├── README.md
│   ├── CMS_SIMPLE.md
│   ├── INSTALLATION.md
│   └── API.md
├── .htaccess-cors                # CORS para Omeka
├── .env.local                    # Variables de entorno
├── docker-compose.yml            # Orquestación
├── Dockerfile                    # Portal
├── Dockerfile.omeka              # Omeka personalizado
├── package.json                  # Dependencias
├── vite.config.js                # Configuración Vite
└── README.md                     # Este archivo
```

### 10.2 Flujo de Datos

1. **Usuario accede** → http://localhost:3000
2. **Vite sirve** → index.html + assets
3. **Vue.js carga** → App.vue + components
4. **Usuario busca** → Search.vue → stores/resources.js
5. **Store llama** → api/index.js
6. **API hace request** → 
   - Omeka: http://localhost:8081/api/items
   - CMS: http://localhost:1337/api/search
7. **Datos se combinan** → Pinia store
8. **Vue reactively actualiza** → Resultados en pantalla

---

## 11. Mantenimiento y Troubleshooting

### 11.1 Problemas Comunes

#### Problema: Servicios no inician

```powershell
# Solución:
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

#### Problema: Puerto ya está en uso

```powershell
# Encontrar qué está usando el puerto
netstat -ano | findstr :3000

# Matar proceso
taskkill /PID <PID> /F

# O cambiar puerto en docker-compose.yml
```

#### Problema: Sin conexión a Omeka

```powershell
# Verificar Omeka
docker-compose logs omeka
docker-compose exec omeka curl http://localhost/api

# Reiniciar Omeka
docker-compose restart omeka
```

#### Problema: Acentos se ven mal

Esto es normal en PowerShell. Los datos se envían correctamente a través de la web. Verificar en navegador.

### 11.2 Logs y Debugging

```powershell
# Ver todos los logs
docker-compose logs -f

# Logs de un servicio específico
docker-compose logs -f cms

# Últimas 50 líneas
docker-compose logs --tail 50

# Buscar errores
docker-compose logs | findstr ERROR
```

### 11.3 Backups

#### Backup de Omeka

```powershell
# Exportar MySQL
docker-compose exec omeka-db mysqldump -u root -p omeka > backup.sql

# Backup de archivos
docker cp iis-omeka:/var/www/html/files ./omeka-files-backup
```

#### Backup de CMS

```powershell
# Copiar data.json
docker cp iis-cms:/app/data.json ./data-backup.json
```

### 11.4 Actualizaciones

Para actualizar el código:

```powershell
# Obtener últimos cambios
git pull origin main

# Reconstruir servicios
docker-compose build --no-cache

# Reiniciar
docker-compose down
docker-compose up -d
```

---

## Conclusión

El Portal Web del Instituto de Investigaciones Sociales proporciona una plataforma integrada y moderna para la gestión y consulta de recursos digitales. Con Docker y Docker Compose, el despliegue es simple y reproducible en cualquier entorno.

Para más información, consulta:
- README.md - Introducción
- CMS_SIMPLE.md - Guía del CMS
- INSTALLATION.md - Instalación detallada
- API.md - Referencia de API

---

**Versión:** 1.0  
**Última actualización:** Diciembre 2025  
**Licencia:** MIT
