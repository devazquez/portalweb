# 📚 Portal Web del Instituto de Investigaciones Sociales UNAM

**Prototipo Funcional de Portal Digital - Sistema Integrado**

Portal web moderno desarrollado con **Vue.js 3** para acceder a recursos digitales del Instituto de Investigaciones Sociales de la UNAM. Integra tres sistemas principales:

1. 📦 **Repositorio Omeka 2.x** - Gestión de recursos digitales
2. 🗂️ **CMS Simple Node.js (Express)** - Gestión editorial de artículos  
3. 🎨 **Portal Vue.js 3** - Interfaz web moderna y responsiva

**Estado del Proyecto:** ✅ Completo y operacional  
**Versión:** 1.0.1  
**Licencia:** MIT  
**Autor:** Dario Emmanuel Vázquez Ceballos

---

## 🎯 Características Principales

### ✨ Frontend Moderno
- **Vue.js 3** con Composition API
- **Vite** como build tool (carga ultra-rápida)
- **Vue Router 4** para navegación fluida
- **Pinia** para gestión de estado centralizado
- **DOMPurify** para sanitización HTML segura contra XSS

### 🔍 Búsqueda Inteligente
- Búsqueda unificada en múltiples fuentes (Omeka + CMS)
- Filtrado por tipo de recurso
- Índice en tiempo real
- Sugerencias de búsqueda

### 📝 Gestión de Contenido
- **CMS Simple Editorial:** Crear, editar, eliminar artículos
- **Panel Administrativo:** Dashboard con estadísticas
- **Base de datos JSON:** Almacenamiento sin dependencias externas
- **API REST completa:** Endpoints GET, POST, PUT, DELETE

### 🎨 Diseño Responsivo
- Optimizado para dispositivos móviles, tablets y escritorio
- Interfaz intuitiva y accesible (WCAG 2.1)
- Tema oscuro/claro
- Animaciones suaves

### 🔒 Seguridad
- Sanitización HTML contra XSS
- Validación de entrada en todas las APIs
- CORS habilitado y configurado
- Soporte HTTPS en producción
- Rate limiting opcional

### 🗄️ Integración Multi-Fuente
- **Omeka 2.x:** Repositorio digital estructurado
- **CMS Simple (Node.js):** Gestión editorial rápida
- **APIs REST nativas:** Sin dependencias de frameworks pesados
- **Sincronización automática:** Datos siempre actualizados

### 🐳 Infrastructure as Code
- Docker y Docker Compose
- Despliegue reproducible
- Escalabilidad automática
- Health checks integrados

## 📋 Requisitos Previos

### Software Requerido
- **Node.js** 18.x o superior
- **npm** 9.x o superior (incluido con Node.js)
- **Git** 2.30 o superior (para control de versiones)
- **Docker** 20.10 o superior (opcional, para despliegue)
- **Docker Compose** 2.0 o superior (opcional, para múltiples servicios)

### Verificar Instalación
```bash
node --version          # v18.x.x
npm --version          # 9.x.x
git --version          # 2.30+
docker --version       # 20.10+ (opcional)
docker-compose --version  # 2.0+ (opcional)
```

### Requisitos Mínimos de Sistema
- **RAM:** 2 GB mínimo, 4 GB recomendado
- **Almacenamiento:** 2 GB espacio libre
- **Puerto 3000:** Disponible para desarrollo (configurable)
- **Puerto 3001:** Disponible para CMS Simple (configurable)

## 🚀 Instalación y Configuración Local (Windows/Mac/Linux)

### 1. Clonar o Descargar el Proyecto

```bash
# Con Git
git clone <repositorio-url>
cd portalweb

# O descargar ZIP y extraer
```

### 2. Configurar Variables de Entorno

```bash
# Windows (PowerShell)
Copy-Item .env.example .env.local

# Mac/Linux
cp .env.example .env.local
```

Editar `.env.local` con las URLs correctas:
```env
VITE_OMEKA_API_URL=http://localhost:8081/api
VITE_CMS_API_URL=http://localhost:3001/api
VITE_API_TIMEOUT=30000
```

### 3. Instalar Dependencias del Portal

```bash
npm install
```

### 4. Iniciar CMS Simple (Terminal 1)

El CMS Simple es un servidor Node.js independiente en la carpeta `cms-simple`:

```bash
# Navegar a carpeta CMS
cd cms-simple

# Instalar dependencias (si es la primera vez)
npm install

# Ejecutar servidor
node server.js

# ✅ Deberías ver: Server running on port 3001
```

**URLs del CMS:**
- Panel Administrativo: `http://localhost:3001`
- API REST: `http://localhost:3001/api`

### 5. Iniciar Portal Web (Terminal 2)

En otra terminal, ejecuta el portal web:

```bash
# Desde la carpeta raíz del proyecto
npm run dev

# ✅ La aplicación estará en: http://localhost:5173
```

### 6. Verificar que TODO funciona

**Checklist rápido:**

- ✅ CMS Admin en `http://localhost:3001`
  - Ver tabla de artículos
  - Click en "Editar" abre modal
  
- ✅ Portal Web en `http://localhost:5173`
  - Ve a "Recursos Digitales"
  - Verás artículos del CMS
  - La búsqueda funciona

### 7. Build para Producción

```bash
# Compilar para producción
npm run build

# Previsualizar build
npm run preview
```

El build compilado estará en la carpeta `dist/`

## 🐳 Despliegue con Docker

### Despliegue Completo (Recomendado para Producción)

```bash
# Construir todas las imágenes
docker-compose build

# Iniciar todos los servicios
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Detener todos los servicios
docker-compose down
```

**URLs de Acceso:**
- Portal Web: `http://localhost:3000`
- CMS Admin: `http://localhost:3001`
- CMS API: `http://localhost:3001/api`
- Omeka-S: `http://localhost:8081` (si está disponible)

### Despliegue Solo Frontend

```bash
# Crear imagen Docker del portal
docker build -t iis-portal-web:latest .

# Ejecutar contenedor
docker run -d -p 3000:3000 --name iis-portal \
  -e VITE_CMS_API_URL=http://localhost:3001/api \
  iis-portal-web:latest

# Acceder a http://localhost:3000
```

### Despliegue Solo CMS Simple

```bash
# Navegar a carpeta CMS
cd cms-simple

# Crear imagen Docker del CMS
docker build -t iis-cms:latest .

# Ejecutar contenedor
docker run -d -p 3001:3001 --name iis-cms iis-cms:latest

# Acceder a http://localhost:3001
```

## 🔧 Configuración de Servicios

### CMS Simple (Node.js + Express + JSON)

#### Inicio Rápido
```bash
cd cms-simple
node server.js
```

#### Panel Administrativo
- URL: `http://localhost:3001`
- Características:
  - Dashboard con estadísticas
  - Tabla de artículos con búsqueda
  - Crear/Editar/Eliminar artículos
  - Modal de edición con preview

#### API REST
```bash
# Obtener todos los artículos
curl http://localhost:3001/api/articulos

# Crear artículo
curl -X POST http://localhost:3001/api/articulos \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Mi Artículo","descripcion":"...","cuerpo":"..."}'

# Actualizar artículo
curl -X PUT http://localhost:3001/api/articulos/1 \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Actualizado","descripcion":"...","cuerpo":"..."}'

# Eliminar artículo
curl -X DELETE http://localhost:3001/api/articulos/1

# Buscar artículos
curl http://localhost:3001/api/search?query=python
```

#### Base de Datos
- **Tipo:** JSON (almacenada en `cms-simple/data.json`)
- **Estructura:** Array de objetos con propiedades español/inglés
- **Ventaja:** Sin dependencias, fácil de respaldar
- **Backup:** Copiar archivo `data.json`

### Omeka-S (Repositorio Digital - Opcional)

Si deseas usar Omeka como fuente adicional:

1. **Instalación:**
   ```bash
   # Con Docker
   docker-compose up -d omeka
   
   # O instalación manual (ver docs de Omeka)
   ```

2. **Configuración:**
   - URL: `http://localhost:8081`
   - Crear API keys en configuración
   - Habilitar CORS

3. **Uso en Portal:**
   - Se integra automáticamente si está disponible
   - Búsqueda unificada Omeka + CMS

## 📁 Estructura del Proyecto

```
portalweb/
├── src/                            # Portal Web (Vue.js 3)
│   ├── components/                 # Componentes Vue reutilizables
│   │   ├── Header.vue
│   │   ├── Navigation.vue
│   │   └── Footer.vue
│   ├── views/                      # Páginas principales
│   │   ├── Home.vue
│   │   ├── Resources.vue           # Integra Omeka + CMS
│   │   ├── ResourceDetail.vue
│   │   ├── Search.vue
│   │   ├── About.vue
│   │   └── NotFound.vue
│   ├── stores/                     # Pinia stores
│   │   └── resources.js            # Maneja Omeka + CMS
│   ├── api/                        # Servicios API
│   │   └── index.js               # Funciones fetch para Omeka y CMS
│   ├── assets/
│   │   ├── css/
│   │   │   └── main.css           # Estilos principales
│   │   └── images/
│   ├── router/
│   │   └── index.js               # Configuración de rutas
│   ├── App.vue
│   └── main.js
│
├── cms-simple/                     # CMS Editorial (Node.js)
│   ├── server.js                  # Servidor Express
│   ├── data.json                  # Base de datos JSON
│   ├── package.json
│   └── public/                     # Panel administrativo
│       ├── index.html
│       ├── script.js              # Lógica CRUD + UI
│       ├── styles.css
│       └── [varios archivos.html]  # Herramientas de testing
│
├── public/                         # Archivos estáticos
├── docs/                           # Documentación
├── assets/                         # Logos y recursos
│
├── index.html                      # Punto de entrada HTML
├── vite.config.js                 # Configuración Vite
├── package.json                   # Dependencias portal
├── Dockerfile                      # Imagen Docker portal
├── docker-compose.yml             # Orquestación servicios
├── .env.example                   # Variables de entorno ejemplo
├── .env.local                     # Variables de entorno desarrollo
├── .env.production                # Variables de entorno producción
├── .gitignore                     # Git ignore (incluye *.md excepto README)
├── vite.config.js
├── README.md                      # Este archivo
└── [documentación en .md]         # Docs de configuración (ignoradas en git)
```

### Archivos Clave

| Archivo | Propósito |
|---------|-----------|
| `src/api/index.js` | APIs unificadas para Omeka + CMS |
| `src/stores/resources.js` | Store que combina ambas fuentes |
| `cms-simple/server.js` | Servidor del CMS |
| `cms-simple/data.json` | Base de datos de artículos |
| `.env.local` | Configuración desarrollo (NO en git) |
| `.env.production` | Configuración producción (NO en git) |

## 🔐 Seguridad

### Características Implementadas

1. **Sanitización HTML** - DOMPurify sanitiza todo contenido HTML
2. **Validación de Entrada** - Validación de URLs y parámetros
3. **CORS** - Control de acceso cruzado configurado
4. **HTTPS** - Soporte TLS en producción (via Nginx)
5. **Rate Limiting** - Límites en solicitudes API (recomendado)
6. **CSP Headers** - Content Security Policy (recomendado)

### Variables de Entorno Sensibles

Nunca incluir en repositorio:
- Claves API de Omeka
- Contraseñas de bases de datos
- JWT secrets
- API tokens

## 📚 Documentación de API

### Endpoints CMS Simple

**Base URL:** `http://localhost:3001/api`

```bash
# GET - Obtener todos los artículos
GET /articulos
Response: { data: [{id, titulo, descripcion, cuerpo, autor, fecha}], meta: {count} }

# GET - Obtener artículo específico
GET /articulos/{id}
Response: { data: {id, titulo, descripcion, cuerpo, autor, fecha} }

# POST - Crear artículo
POST /articulos
Content-Type: application/json
Body: { titulo, descripcion, cuerpo, autor }
Response: { data: {id, titulo, ...}, message: "Artículo creado" }

# PUT - Actualizar artículo
PUT /articulos/{id}
Content-Type: application/json
Body: { titulo, descripcion, cuerpo, autor }
Response: { data: {id, titulo, ...}, message: "Artículo actualizado" }

# DELETE - Eliminar artículo
DELETE /articulos/{id}
Response: { message: "Artículo eliminado" }

# GET - Buscar artículos
GET /search?query=python
Response: { data: [{...artículos coincidentes...}], meta: {count} }
```

### Endpoints Omeka-S (Opcional)

```bash
# GET - Obtener items
GET /api/items?limit=50

# GET - Obtener item específico
GET /api/items/{id}

# GET - Buscar items
GET /api/items?search=query
```

## 🧪 Testing

### Test Manual de Funcionalidades

#### 1. CMS Admin
```bash
# Abre http://localhost:3001 en navegador
# Verificar:
✓ Tabla de artículos carga
✓ Click en "Editar" abre modal
✓ Modal pre-carga datos
✓ Actualizar cambios
✓ Eliminar artículo con confirmación
✓ Crear nuevo artículo
✓ Búsqueda en tabla funciona
```

#### 2. Portal Web
```bash
# Abre http://localhost:5173 en navegador
# Verificar:
✓ Página home carga
✓ Sección "Recursos" muestra artículos CMS
✓ Búsqueda encuentra artículos CMS
✓ Detalle de artículo muestra información
✓ Filtros funcionan
✓ Layout responsivo en móvil
```

#### 3. APIs
```bash
# Terminal
curl http://localhost:3001/api/articulos
curl http://localhost:3001/api/search?query=test
curl -X POST http://localhost:3001/api/articulos \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Test","descripcion":"Test","cuerpo":"Test"}'
```

### Tests Automatizados (Recomendado Futuro)
```bash
# Ejecutar tests (cuando se implemente)
npm run test

# Tests con cobertura
npm run test:coverage

# Linting
npm run lint
```

## 📈 Rendimiento

### Optimizaciones Implementadas

- **Code Splitting** - Lazy loading de rutas
- **Tree Shaking** - Eliminación de código no usado
- **Minificación** - Build optimizado con Vite
- **Caché** - Redis para datos frecuentes
- **Compresión** - Gzip en servidor

### Métricas Recomendadas

- First Contentful Paint: < 2s
- Largest Contentful Paint: < 3s
- Cumulative Layout Shift: < 0.1

## 🔄 CI/CD

### GitHub Actions (Recomendado)

```yaml
name: Deploy
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - run: npm run test
```

## 🚨 Troubleshooting

### Portal No Carga

**Error:** "Cannot connect to API"
```bash
# Verificar que CMS está corriendo
curl http://localhost:3001/api/articulos

# Si no responde:
cd cms-simple
node server.js

# Verificar .env.local
# VITE_CMS_API_URL debe ser http://localhost:3001/api
```

### CMS Admin No Se Abre

**Error:** "Cannot GET /api/articulos"
```bash
# Verificar que datos.json existe
ls -la cms-simple/data.json

# Si no existe, crear uno:
# {
#   "articulos": []
# }
```

### Modal de Edición No Abre

**Síntoma:** Click en Editar, nada pasa

**Soluciones:**
```bash
# 1. Abrir DevTools (F12) → Console
# Ver si hay errores

# 2. Verificar en consola:
console.log(articulos)  # Debe mostrar array
console.log(modal)      # Debe mostrar elemento DOM

# 3. Recargar página (Ctrl+F5)
```

### Artículos No Aparecen en Recursos

**Síntoma:** Portal muestra recursos pero NO artículos CMS

**Soluciones:**
```bash
# 1. Verificar URL en .env.local:
# VITE_CMS_API_URL=http://localhost:3001/api

# 2. Reiniciar portal web:
npm run dev

# 3. En navegador, abrir:
# http://localhost:5173 (nuevo puerto Vite)
```

### Puerto Ya en Uso

**Error:** "EADDRINUSE: address already in use :::3001"

```bash
# Windows PowerShell - Buscar proceso
netstat -ano | findstr :3001

# Matar proceso (reemplaza PID)
taskkill /PID <PID> /F

# Mac/Linux - Encontrar y matar
lsof -ti :3001 | xargs kill -9
```

### Problemas con Docker

```bash
# Limpiar todo y empezar de cero
docker-compose down -v
docker system prune -a

# Reconstruir e iniciar
docker-compose up --build

# Ver logs detallados
docker-compose logs -f --tail=100

# Ejecutar comando en contenedor
docker-compose exec cms-simple node server.js
```

### CORS Errors en Navegador

**Síntoma:** "Access to XMLHttpRequest blocked by CORS policy"

```bash
# Verificar que CORS está habilitado en CMS
# cms-simple/server.js debe incluir:
app.use(cors());

# Verificar headers de respuesta:
curl -i http://localhost:3001/api/articulos
# Debe mostrar: Access-Control-Allow-Origin: *
```

### Búsqueda No Funciona

**Síntoma:** Buscar no devuelve resultados

```bash
# Probar endpoint de búsqueda:
curl "http://localhost:3001/api/search?query=test"

# Si devuelve [], verificar que hay artículos:
curl http://localhost:3001/api/articulos

# Si está vacío, crear un artículo desde CMS Admin
```

### Rendimiento Lento

```bash
# 1. Verificar tamaño de datos.json
ls -lh cms-simple/data.json

# 2. Ver CPU/Memoria
# Windows Task Manager → Performance
# Mac Activity Monitor
# Linux: top, htop

# 3. Limpiar cache navegador (Ctrl+Shift+Delete)

# 4. Verificar red en DevTools (F12 → Network)
```

## 📝 Convenciones de Código

### Nombres de Componentes
- PascalCase para componentes Vue
- Nombres descriptivos y específicos

### Nombres de Variables
- camelCase para variables y funciones
- Prefijo con mayúscula para constantes

### Estilos
- CSS con variables de diseño
- Utilidades Tailwind-like (custom)
- Mobile-first responsive design

## 📦 Dependencias Principales

```json
{
  "vue": "^3.3.4",
  "vue-router": "^4.2.4",
  "pinia": "^2.1.5",
  "axios": "^1.5.0",
  "dompurify": "^3.0.6",
  "vite": "^4.4.11"
}
```

## 🌐 Despliegue en Producción

### Recomendaciones Previas

1. **Seguridad:**
   - Cambiar contraseñas por defecto
   - Habilitar HTTPS/SSL
   - Configurar firewall
   - Hacer backups regulares

2. **Performance:**
   - Usar CDN para assets estáticos
   - Configurar caché HTTP
   - Habilitar compresión gzip
   - Monitorear performance

3. **Base de Datos:**
   - Hacer backup de `cms-simple/data.json` regularmente
   - Usar volúmenes Docker persistentes
   - Considerar migrar a PostgreSQL si crece

### En Servidor Linux (Ubuntu/Debian)

```bash
# 1. Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Clonar repositorio
git clone <repo-url>
cd portalweb

# 3. Configurar variables de entorno
cp .env.example .env.production
# Editar .env.production con URLs reales

# 4. Instalar dependencias
npm install
npm install -g pm2  # Para mantener servicios activos

# 5. Iniciar CMS Simple con PM2
cd cms-simple
pm2 start server.js --name "cms-simple"
pm2 save
pm2 startup

# 6. Iniciar Portal Web
cd ..
npm run build
pm2 start "npm run preview" --name "portal-web"

# 7. Configurar Nginx (reverse proxy)
# Ver ejemplo en nginx.conf
sudo cp nginx.conf /etc/nginx/sites-available/iis-portal
sudo ln -s /etc/nginx/sites-available/iis-portal /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 8. Configurar SSL con Let's Encrypt (HTTPS)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```

### Con Docker Compose (Recomendado)

```bash
# 1. Preparar servidor
git clone <repo-url>
cd portalweb

# 2. Crear archivo .env.production
cp .env.example .env.production
# Editar con URLs de producción

# 3. Construir y ejecutar
docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml up -d

# 4. Verificar servicios
docker-compose ps
docker-compose logs -f

# 5. Backups automáticos
# Agregar a crontab para backup diario
0 2 * * * docker exec iis-cms cp /app/data.json /backups/data-$(date +\%Y\%m\%d).json
```

### En AWS/Google Cloud/Azure

**AWS Elastic Beanstalk:**
```bash
# Instalar EB CLI
pip install awsebcli --upgrade --user

# Inicializar aplicación
eb init -p node.js-18 iis-portal

# Crear ambiente
eb create iis-portal-prod

# Desplegar
git push

# Ver logs
eb logs

# Abierto en https://iis-portal-prod.elasticbeanstalk.com
```

**Google Cloud Run:**
```bash
# Construir y desplegar
gcloud run deploy iis-portal \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## 📞 Soporte y Contacto

**Instituto de Investigaciones Sociales, UNAM**
- **Desarrollador:** Dario Emmanuel Vázquez Ceballos
- **Email:** darioemmanuel@ciencias.unam.mx
- **Teléfono:** +52 55 7391 5092
- **Institución:** Instituto de Investigaciones Sociales, UNAM

**Problemas o Sugerencias:**
1. Revisar sección Troubleshooting
2. Abrir terminal y revisar logs (console.log, docker logs)
3. Contactar al desarrollador con detalles del error

## ✅ Checklist de Despliegue

**Desarrollo Local:**
- [ ] Node.js 18+ instalado
- [ ] npm install ejecutado
- [ ] .env.local configurado
- [ ] CMS ejecutándose en puerto 3001
- [ ] Portal ejecutándose en puerto 5173
- [ ] Datos aparecentado en ambos sistemas
- [ ] Búsqueda funciona

**Producción:**
- [ ] Variables de entorno configuradas (.env.production)
- [ ] Base de datos CMS existe y tiene respaldo
- [ ] HTTPS/SSL certificado instalado
- [ ] CORS configurado correctamente
- [ ] Backups automatizados configurados
- [ ] Monitoreo y logging habilitados
- [ ] Tests pasando
- [ ] Documentación actualizada
- [ ] Firewall configurado
- [ ] CDN configurado (opcional)

## 📚 Referencias Útiles

**Documentación Oficial:**
- [Vue 3 Docs](https://vuejs.org/)
- [Vite Docs](https://vitejs.dev/)
- [Express.js Docs](https://expressjs.com/)
- [Docker Docs](https://docs.docker.com/)
- [Node.js Docs](https://nodejs.org/docs/)

**Guías Locales (en Documentación):**
- `QUICKSTART_VERIFICACION.md` - Verificación rápida
- `RESUMEN_CAMBIOS_CMS_INTEGRACION.md` - Cambios realizados
- `SOLUCION_ARTICULOS_EDIT_SEARCH.md` - Solución edición
- `SOLUCION_RECURSOS_CMS.md` - Integración recursos

**Comandos Útiles:**
```bash
# Desarrollo
npm run dev              # Iniciar portal
npm run build            # Compilar para producción
npm run preview          # Ver build

# CMS
cd cms-simple && node server.js  # Iniciar CMS

# Docker
docker-compose up -d     # Iniciar servicios
docker-compose logs -f   # Ver logs
docker-compose down      # Detener servicios

# Git
git status               # Ver cambios
git commit -m "mensaje"  # Hacer commit
git push                 # Subir a repositorio
```

---

## 📄 Licencia

Este proyecto está bajo licencia **MIT**.

Los recursos digitales integrados tienen sus propias licencias:
- Recursos Omeka: Ver términos específicos en cada ítem
- Artículos CMS: Licencia especificada por autor

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. **Fork** del proyecto
2. **Rama** para tu feature (`git checkout -b feature/MiFeature`)
3. **Commit** cambios (`git commit -m 'Agregar MiFeature'`)
4. **Push** a rama (`git push origin feature/MiFeature`)
5. **Pull Request** describiendo los cambios

### Estándares de Código
- Usar camelCase para variables
- Componentes Vue en PascalCase
- Agregar comentarios en código complejo
- Mantener 80 caracteres por línea máximo
- Tests para nuevas funcionalidades

---

## � Estadísticas del Proyecto

| Métrica | Valor |
|---------|-------|
| **Versión** | 1.0.1 |
| **Estado** | ✅ Operacional |
| **Lenguajes** | JavaScript (Vue.js + Node.js) |
| **Dependencias** | Vue 3, Vite, Express, Pinia |
| **Base de Datos** | JSON (escalable a PostgreSQL) |
| **Documentación** | Completa |
| **Última Actualización** | Diciembre 2025 |

---

**Última actualización:** Diciembre 10, 2025
**Versión del Documento:** 1.1  
**Autor:** Dario Emmanuel Vázquez Ceballos  
**Estado:** 🟢 LISTO PARA PRODUCCIÓN 
