# ESPECIFICACIÓN TÉCNICA RESUMIDA

## PROYECTO: Portal Web del Instituto de Investigaciones Sociales

**Versión:** 1.0  
**Fecha:** Diciembre 2025  
**Estado:** ✅ Completado y Funcional  

---

## I. RESUMEN EJECUTIVO

El Portal Web es una plataforma digital moderna que integra contenido de dos fuentes principales:
1. **Omeka 2.x** - Repositorio digital de recursos académicos
2. **CMS Simple** - Sistema de gestión de contenidos editorial

La arquitectura utiliza **Docker Compose** para despliegue reproducible y escalable. El frontend está desarrollado con **Vue.js 3**, proporcionando una interfaz reactiva y moderna.

**Objetivos Alcanzados:**
✅ Búsqueda unificada en múltiples fuentes  
✅ Interfaz moderna y responsive  
✅ APIs REST completamente funcionales  
✅ Despliegue simplificado con Docker  
✅ Soporte para caracteres Unicode (acentos)  
✅ Seguridad CORS habilitada  

---

## II. ARQUITECTURA DEL SISTEMA

### 2.1 Capas de la Arquitectura

```
┌─────────────────────────────────────────┐
│   CAPA DE PRESENTACIÓN (Frontend)       │
│   Vue.js 3 + Vite (Puerto 3000)        │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────┼─────────┐
        │         │         │
        ▼         ▼         ▼
┌───────────┐ ┌─────────┐ ┌────────┐
│ Omeka API │ │ CMS API │ │ Nginx  │
│(8081)     │ │(1337)   │ │(80/443)│
└─────┬─────┘ └────┬────┘ └────────┘
      │            │
      ▼            ▼
┌───────────┐  ┌──────────┐
│ MySQL DB  │  │ JSON File│
│ (Omeka)   │  │ (CMS)    │
└───────────┘  └──────────┘
```

### 2.2 Componentes Principales

| Componente | Tecnología | Puerto | Función |
|-----------|-----------|--------|---------|
| **Portal** | Vue.js 3 + Vite | 3000 | Interfaz web |
| **Omeka** | PHP 7.4 + Apache | 8081 | Repositorio digital |
| **CMS** | Node.js + Express | 1337 | Gestión de contenido |
| **Nginx** | Reverse proxy | 80/443 | Enrutamiento HTTP(S) |
| **MySQL** | Base de datos | 3306 | Persistencia Omeka |
| **Redis** | Caché | 6379 | Optimización (opcional) |

---

## III. PILA TECNOLÓGICA

### Frontend
- **Vue.js 3** - Framework reactivo
- **Vite 4** - Build tool ultrarrápido
- **Vue Router 4** - Enrutamiento
- **Pinia 2** - State management
- **Axios 1** - HTTP client
- **DOMPurify 3** - Sanitización HTML

### Backend Omeka
- **PHP 7.4** - Lenguaje servidor
- **Apache 2.4** - Web server
- **MySQL 8.0** - Base de datos
- **Omeka 2.x** - Framework CMS

### Backend CMS
- **Node.js 22** - Runtime JavaScript
- **Express 4.18** - Framework web
- **fs.promises** - I/O asincrónico
- **JSON** - Almacenamiento de datos

### DevOps & Infraestructura
- **Docker** - Containerización
- **Docker Compose** - Orquestación
- **Nginx Alpine** - Reverse proxy
- **Git** - Control de versiones

---

## IV. FLUJO DE DATOS

```
USUARIO
   │
   ▼
NAVEGADOR (http://localhost:3000)
   │
   ├─ Cargar App.vue
   ├─ Montar componentes
   └─ Inicializar Vue Router
   
   │ Usuario busca: "inteligencia"
   ▼
SEARCH.VUE (componente)
   │
   ├─ Captura término de búsqueda
   └─ Llama a stores/resources.js
   
   │
   ▼
API/INDEX.JS (capa de integración)
   │
   ├─ fetch('http://localhost:8081/api/items?search=...')
   ├─ fetch('http://localhost:1337/api/search?query=...')
   └─ Combina resultados
   
   │
   ├─────────────────┬──────────────────┐
   │                 │                  │
   ▼                 ▼                  ▼
OMEKA API       CMS API            Nginx
   │                │                  │
   ▼                ▼                  ▼
MySQL DB       data.json          Static Files
   
   ▲                 ▲                  ▲
   └─────────────────┼──────────────────┘
                     │
                     ▼
                  JSON Response
                     │
                     ▼
            Pinia Store (datos combinados)
                     │
                     ▼
              VUE REACTIVITY
                     │
                     ▼
         UI Actualizada (resultados)
```

---

## V. ESPECIFICACIÓN DE APIs

### 5.1 Portal Search API

**Endpoint:** `GET /api/search`

**Parámetros:**
```
query=término          (requerido)
source=omeka|cms|all   (opcional, default: all)
limit=10               (opcional)
offset=0               (opcional)
```

**Respuesta:**
```json
{
  "results": [
    {
      "id": "1",
      "title": "Título del recurso",
      "description": "Descripción",
      "source": "omeka",
      "type": "Artículo"
    }
  ],
  "total": 15,
  "timestamp": "2025-12-09T19:47:39Z"
}
```

### 5.2 Omeka API

**URL Base:** `http://localhost:8081/api`

**Endpoints Principales:**
```
GET /items              - Listar recursos
GET /items/:id         - Obtener recurso
GET /items?search=q    - Buscar
GET /resource_classes  - Tipos de recursos
GET /properties        - Propiedades disponibles
```

**Respuesta Ejemplo:**
```json
{
  "@context": "...",
  "o:id": 1,
  "dcterms:title": [
    {"@value": "Título"}
  ],
  "dcterms:description": [
    {"@value": "Descripción"}
  ]
}
```

### 5.3 CMS Simple API

**URL Base:** `http://localhost:1337/api`

**Endpoints CRUD:**
```
GET /articulos                 - Listar (con paginación)
GET /articulos/:id            - Obtener por ID
POST /articulos               - Crear nuevo
PUT /articulos/:id            - Actualizar
DELETE /articulos/:id         - Eliminar
GET /search?query=término     - Buscar
```

**Crear Artículo (POST):**
```json
{
  "title": "Nuevo Artículo",
  "description": "Descripción breve",
  "body": "Contenido completo",
  "author": "Nombre del autor"
}
```

**Respuesta:**
```json
{
  "id": 5,
  "title": "Nuevo Artículo",
  "description": "Descripción breve",
  "body": "Contenido completo",
  "author": "Nombre del autor",
  "createdAt": "2025-12-09T19:47:39.715Z",
  "updatedAt": "2025-12-09T19:47:39.715Z"
}
```

---

## VI. ESTRUCTURA DE DIRECTORIOS

```
portalweb/
├── src/
│   ├── api/
│   │   └── index.js                # Integración APIs
│   ├── components/
│   │   ├── Header.vue
│   │   ├── Footer.vue
│   │   └── Navigation.vue
│   ├── stores/
│   │   └── resources.js            # Pinia store
│   ├── views/
│   │   ├── Home.vue
│   │   ├── Search.vue
│   │   ├── Resources.vue
│   │   ├── ResourceDetail.vue
│   │   └── NotFound.vue
│   ├── App.vue                     # Componente raíz
│   ├── main.js                     # Punto entrada
│   └── router.js                   # Configuración Router
│
├── cms-simple/
│   ├── server.js                   # Servidor Express
│   ├── data.json                   # DB JSON
│   ├── package.json
│   ├── Dockerfile
│   └── init-data.sh
│
├── public/
│   ├── logo.png
│   └── favicon.ico
│
├── docs/
│   ├── API.md
│   ├── CMS_SIMPLE.md
│   └── INSTALLATION.md
│
├── docker-compose.yml              # Orquestación
├── Dockerfile                      # Portal image
├── Dockerfile.omeka                # Omeka personalizado
├── .env.local                      # Variables entorno
├── vite.config.js                  # Config Vite
├── package.json                    # Dependencias
└── README.md
```

---

## VII. CONFIGURACIÓN DE VOLÚMENES DOCKER

**Volúmenes Persistentes:**

```
portalweb_omeka_db (MySQL)
├── Base de datos de Omeka
├── Tablas: items, elements, files, etc.
└── Datos persistentes entre reinicios

portalweb_omeka_files
├── Archivos subidos a Omeka
└── Permanecen tras reinicios

portalweb_cms_data
├── data.json (base de datos CMS)
└── Artículos y contenido

portalweb_redis_data
├── Caché Redis
└── Optimización de búsquedas
```

---

## VIII. CICLO DE VIDA DE LA APLICACIÓN

### Inicialización

```
1. docker-compose up -d
   │
   ├─ Omeka (30-45 seg.)
   │  ├─ Apache inicia
   │  ├─ MySQL conecta
   │  └─ Plugins cargan
   │
   ├─ CMS (5-10 seg.)
   │  ├─ Node.js inicia
   │  ├─ Express arranca
   │  └─ data.json carga
   │
   ├─ Redis (2-3 seg.)
   │  └─ Cache lista
   │
   └─ Nginx (3-5 seg.)
      └─ Reverse proxy activo

2. Usuario accede: http://localhost:3000

3. Vite DevServer
   ├─ index.html sirve
   ├─ Vue.js carga
   ├─ Vue Router inicializa
   └─ Pinia store crea

4. Componentes montan
   ├─ API calls se ejecutan
   ├─ Datos cargan
   └─ UI reactiva actualiza
```

### Búsqueda

```
Usuario digita → onChange event
   │
   ▼
API call: /api/search?query=término
   │
   ├─ Omeka: Query a MySQL
   ├─ CMS: Search en data.json
   └─ Resultados combinan
   │
   ▼
Pinia Store actualiza
   │
   ▼
Vue reactively actualiza UI
   │
   ▼
Resultados se muestran
```

---

## IX. REQUERIMIENTOS DE RECURSOS

### Memoria (RAM)
- **Desarrollo:** 2GB mínimo
- **Producción:** 4-8GB recomendado

### CPU
- **Desarrollo:** 1-2 cores
- **Producción:** 2-4 cores

### Almacenamiento
- **Sistema base:** 5GB
- **Omeka (con datos):** 10-50GB
- **CMS:** <1GB (depende de artículos)

### Ancho de Banda
- **Peak:** 10-50 Mbps
- **Promedio:** 1-5 Mbps

---

## X. ESTÁNDARES Y MEJORES PRÁCTICAS

### Seguridad
- ✅ CORS habilitado (controlado por origen)
- ✅ Sanitización HTML con DOMPurify
- ✅ Validación de entrada
- ✅ SQL Injection prevención (Omeka)
- ✅ CSRF tokens (si requiere)

### Performance
- ✅ Vite para carga rápida
- ✅ Code splitting automático
- ✅ Lazy loading de componentes
- ✅ Redis caché (opcional)
- ✅ Compresión gzip en Nginx

### Code Quality
- ✅ Vue 3 Composition API
- ✅ Modularidad clara
- ✅ Separación de responsabilidades
- ✅ Documentación inline
- ✅ Git commit convencionales

### DevOps
- ✅ Docker containerización
- ✅ Health checks
- ✅ Logs centralizados
- ✅ Volúmenes persistentes
- ✅ Escalabilidad horizontal

---

## XI. MONITOREO Y LOGGING

### Health Checks

**Omeka:**
```
GET http://localhost:8081/api/items
```

**CMS:**
```
GET http://localhost:1337/api/articulos
```

**Portal:**
```
GET http://localhost:3000
```

### Logs

**Ver todos:**
```
docker-compose logs -f
```

**Servicio específico:**
```
docker-compose logs -f cms
docker-compose logs -f omeka
```

**Buscar errores:**
```
docker-compose logs | grep ERROR
```

---

## XII. PLAN DE MANTENIMIENTO

### Diario
- Monitorear logs
- Verificar health checks
- Backup automático

### Semanal
- Revisar métricas de uso
- Actualizar dependencias
- Limpiar caché

### Mensual
- Backup completo
- Análisis de rendimiento
- Pruebas de recuperación

### Trimestral
- Actualizar librerías
- Pruebas de seguridad
- Revisión de arquitectura

---

## XIII. MATRIZ DE DECISIONES TÉCNICAS

| Decisión | Alternativa | Razón |
|----------|-----------|-------|
| Vue.js 3 | React, Angular | Curva aprendizaje, reactividad |
| Vite | Webpack, Rollup | Velocidad de desarrollo |
| Pinia | Vuex | Composables, TypeScript |
| CMS Simple | Strapi | Simplicidad, sin dependencias |
| JSON vs SQL | PostgreSQL | Para CMS lightweight |
| Docker | VMs | Portabilidad, escalabilidad |
| Nginx | Apache | Performance, reverse proxy |

---

## XIV. CONCLUSIONES

El Portal Web es una solución **moderna, escalable y mantenible** para integrar múltiples fuentes de contenido digital.

### Fortalezas
✅ Arquitectura desacoplada  
✅ Fácil de desplegar (Docker)  
✅ Escalable horizontalmente  
✅ Mantenimiento simplificado  
✅ Performance optimizado  

### Áreas de Mejora Futuras
- Implementar autenticación de usuarios
- Agregar comentarios y ratings
- Estadísticas de uso
- Full-text search mejorado
- API GraphQL (opcional)
- Versionado de contenido

---

**Documento Técnico v1.0**  
Diciembre 2025  
Instituto de Investigaciones Sociales, UNAM
