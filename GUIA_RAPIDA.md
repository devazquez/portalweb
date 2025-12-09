# GUÍA RÁPIDA DE INSTALACIÓN Y DESPLIEGUE

## 1. DESCRIPCIÓN GENERAL

El **Portal Web del Instituto de Investigaciones Sociales** es una plataforma web moderna que integra:
- **Frontend:** Vue.js 3 + Vite (Interfaz web)
- **Omeka 2.x:** Repositorio digital (Port 8081)
- **CMS Simple:** Node.js/Express (Port 1337)
- **Base de Datos:** MySQL + JSON
- **Infraestructura:** Docker Compose

**Ubicación del Proyecto:** `d:\Usuarios\DEVazquezC\Documents\ICAT\IIS\portalweb`

---

## 2. REQUISITOS DEL SISTEMA

### Hardware
- CPU: 2+ cores
- RAM: 4GB mínimo (8GB recomendado)
- Almacenamiento: 20GB libre
- Conexión a internet

### Software

**Windows:**
- Docker Desktop 4.0+
- Git 2.30+
- PowerShell 5.1 (incluido en Windows)

**macOS:**
- Docker Desktop 4.0+
- Git (o Homebrew)

**Linux:**
- Docker CE 20.10+
- Docker Compose 2.0+
- Git

### Puertos Requeridos
| Servicio | Puerto | Uso |
|----------|--------|-----|
| Portal Web | 3000 | Frontend Vue.js |
| Omeka | 8081 | Repositorio Digital |
| CMS Simple | 1337 | API REST |
| Nginx | 80, 443 | Reverse Proxy |
| MySQL | 3306 | Base de Datos (interno) |

---

## 3. INSTALACIÓN RÁPIDA

### Paso 1: Verificar Instalación de Docker

```powershell
docker --version
docker-compose --version
```

### Paso 2: Clonar el Repositorio

```powershell
cd C:\Usuarios\TuUsuario\Documents
git clone https://github.com/tu-usuario/portalweb.git
cd portalweb
```

### Paso 3: Construir y Iniciar

```powershell
# Construir imágenes Docker
docker-compose build

# Iniciar todos los servicios en background
docker-compose up -d

# Verificar estado
docker-compose ps
```

### Paso 4: Esperar Inicialización

Espera **30-60 segundos** mientras los servicios inician.

```powershell
# Ver logs en tiempo real
docker-compose logs -f

# Presionar Ctrl+C para detener
```

### Paso 5: Verificar Conectividad

```powershell
# Probar Portal
Invoke-WebRequest http://localhost:3000

# Probar Omeka
Invoke-WebRequest http://localhost:8081/api

# Probar CMS
Invoke-WebRequest http://localhost:1337/api/articulos
```

---

## 4. ACCESO A LAS APLICACIONES

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Portal Web** | http://localhost:3000 | Interfaz principal |
| **Omeka Admin** | http://localhost:8081/admin | Panel de administración |
| **CMS API** | http://localhost:1337/api | Documentación de API |
| **Nginx** | http://localhost:80 | Reverse proxy |

---

## 5. ESTRUCTURA DEL PROYECTO

```
portalweb/
├── src/                      # Código fuente del portal
│   ├── api/                  # Integración de APIs
│   ├── components/           # Componentes Vue
│   ├── stores/              # Pinia stores
│   ├── views/               # Vistas principales
│   ├── App.vue              # Componente raíz
│   └── main.js              # Punto de entrada
├── cms-simple/              # Sistema de CMS lightweight
│   ├── server.js            # Servidor Express
│   ├── data.json            # Base de datos JSON
│   ├── package.json         # Dependencias
│   ├── Dockerfile           # Containerización
│   └── init-data.sh         # Script de inicialización
├── public/                  # Archivos estáticos
├── docs/                    # Documentación
├── docker-compose.yml       # Orquestación de servicios
├── Dockerfile               # Imagen del portal
├── .env.local               # Variables de entorno
└── README.md                # Este archivo
```

---

## 6. CONFIGURACIÓN

### Variables de Entorno (`.env.local`)

```bash
# APIs externas
VITE_OMEKA_API_URL=http://localhost:8081/api
VITE_CMS_API_URL=http://localhost:1337/api

# Timeout de conexión (ms)
VITE_API_TIMEOUT=30000

# Modo de desarrollo
VITE_DEBUG=false
```

### Docker Compose

El archivo `docker-compose.yml` define:
- **portal:** Frontend Vue.js (Puerto 3000)
- **omeka:** Repositorio digital (Puerto 8081)
- **omeka-db:** MySQL database
- **cms:** CMS Simple Node.js (Puerto 1337)
- **redis:** Caché (Puerto 6379)
- **nginx:** Reverse proxy (Puerto 80/443)

---

## 7. OPERACIONES COMUNES

### Ver Estado de Servicios
```powershell
docker-compose ps
```

### Ver Logs
```powershell
# Todos los servicios
docker-compose logs -f

# Servicio específico
docker-compose logs -f cms
docker-compose logs -f omeka
```

### Reiniciar un Servicio
```powershell
docker-compose restart cms
docker-compose restart omeka
```

### Reconstruir sin Caché
```powershell
docker-compose build --no-cache portal
docker-compose build --no-cache cms
```

### Detener Todo
```powershell
# Detener servicios
docker-compose down

# Detener y limpiar volúmenes
docker-compose down -v
```

### Ejecutar Comando en Contenedor
```powershell
# Shell bash/sh
docker-compose exec cms sh

# Comando directo
docker-compose exec omeka curl http://localhost/api
```

---

## 8. API ENDPOINTS

### Portal Web
```
GET /api/search?query=término&source=all
```

### Omeka
```
GET http://localhost:8081/api/items
GET http://localhost:8081/api/items/:id
GET http://localhost:8081/api/items?search=término
```

### CMS Simple
```
GET /api/articulos                    # Listar todos
GET /api/articulos/:id               # Obtener uno
POST /api/articulos                  # Crear
PUT /api/articulos/:id               # Actualizar
DELETE /api/articulos/:id            # Eliminar
GET /api/search?query=término        # Buscar
```

---

## 9. TROUBLESHOOTING

### Problema: Servicios No Inician

**Solución:**
```powershell
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Problema: Puerto en Uso

**Solución (Windows):**
```powershell
# Encontrar proceso
netstat -ano | findstr :3000

# Matar proceso
taskkill /PID <PID> /F
```

### Problema: Omeka No Responde

**Solución:**
```powershell
docker-compose logs omeka
docker-compose restart omeka
# Esperar 30 segundos
```

### Problema: CMS Datos Vacíos

**Solución:**
```powershell
docker-compose down
docker-compose build --no-cache cms
docker-compose up -d cms
```

### Problema: Acentos se Ven Mal en Terminal

**Es Normal.** PowerShell tiene limitaciones de codificación. Los datos en el navegador se mostrarán correctamente (UTF-8).

Para verificar:
```powershell
Invoke-WebRequest http://localhost:1337/api/articulos/1 | ConvertFrom-Json | ConvertTo-Json -Depth 2
```

Abrir el navegador para ver acentos correctamente renderizados.

---

## 10. BACKUP Y RESTAURACIÓN

### Backup de Omeka
```powershell
# Exportar base de datos
docker-compose exec omeka-db mysqldump -u root -p omeka > omeka-backup.sql

# Exportar archivos
docker cp iis-omeka:/var/www/html/files ./omeka-files-backup
```

### Backup de CMS
```powershell
# Copiar data.json
docker cp iis-cms:/app/data.json ./cms-data-backup.json
```

### Restaurar
```powershell
# MySQL
docker-compose exec omeka-db mysql -u root -p omeka < omeka-backup.sql

# CMS JSON
docker cp ./cms-data-backup.json iis-cms:/app/data.json
```

---

## 11. DESPLIEGUE EN PRODUCCIÓN

### Cambiar URLs de APIs
```bash
VITE_OMEKA_API_URL=https://tudominio.com/api
VITE_CMS_API_URL=https://tudominio.com:1337/api
```

### Configurar SSL/TLS
1. Obtener certificados (Let's Encrypt recomendado)
2. Configurar Nginx con los certificados
3. Redirigir HTTP → HTTPS

### Configurar Dominio
```bash
# En Omeka settings
Site Title: Portal IIS
Admin Email: admin@iis.unam.mx
```

### Monitoreo
- Configurar logs centralizados
- Health checks de servicios
- Alertas en caso de fallos
- Backups automáticos diarios

---

## 12. COMANDOS ÚTILES (REFERENCIA RÁPIDA)

```powershell
# Iniciar
docker-compose up -d

# Parar
docker-compose down

# Ver estado
docker-compose ps

# Ver logs
docker-compose logs -f

# Construir
docker-compose build

# Reconstruir sin caché
docker-compose build --no-cache

# Ejecutar en contenedor
docker-compose exec [servicio] [comando]

# Copiar archivos
docker cp [contenedor]:[ruta] [ruta-local]

# Remover volúmenes
docker-compose down -v

# Restart de servicio
docker-compose restart [servicio]

# Limpiar todo (peligroso)
docker system prune -a
```

---

## 13. TECNOLOGÍAS UTILIZADAS

### Frontend
- Vue.js 3
- Vite 4
- Vue Router 4
- Pinia 2
- Axios 1
- DOMPurify 3

### Backend Omeka
- PHP 7.4
- Apache 2.4
- MySQL 8.0
- Omeka 2.x

### Backend CMS
- Node.js 22
- Express 4.18
- JSON (almacenamiento)

### Infraestructura
- Docker & Docker Compose
- Nginx (Reverse Proxy)
- Redis (Caché)

---

## 14. ESTRUCTURA DE VOLÚMENES DOCKER

Los datos persisten en volúmenes Docker:

```
portalweb_omeka_db         → MySQL data (Omeka)
portalweb_omeka_files      → Archivos y uploads
portalweb_omeka_config     → Configuración
portalweb_cms_data         → data.json (CMS)
portalweb_redis_data       → Redis cache
```

Para ver volúmenes:
```powershell
docker volume ls | findstr portalweb
```

---

## 15. INFORMACIÓN DE SOPORTE

**Documentación Completa:**
- `DOCUMENTACION_TECNICA.md` - Especificación técnica (40+ páginas)
- `DOCUMENTACION_TECNICA.docx` - Versión Word del documento
- `CMS_SIMPLE.md` - Guía específica del CMS
- `README.md` - Este archivo

**Repositorio Git:**
```
https://github.com/tu-usuario/portalweb
```

**Autor:** Equipo de Desarrollo IIS  
**Institución:** Instituto de Investigaciones Sociales, UNAM  
**Versión:** 1.0  
**Licencia:** MIT  
**Fecha:** Diciembre 2025  

---

## CONTACTO Y SOPORTE

Para reportar problemas o sugerencias:
1. Crear un issue en el repositorio Git
2. Contactar al equipo de desarrollo
3. Revisar los logs: `docker-compose logs`

---

**¡Gracias por usar el Portal Web del IIS!** 🎓📚
