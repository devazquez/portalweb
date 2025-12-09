# 📚 Portal Web del Instituto de Investigaciones Sociales UNAM

**Prototipo Funcional de Portal Digital**

Portal web moderno desarrollado con **Vue.js 3** para acceder a recursos digitales del Instituto de Investigaciones Sociales de la UNAM. Integra dos fuentes de contenido principales: un repositorio **Omeka 2.x** y un **CMS Simple basado en Node.js**.

**Estado del Proyecto:** ✅ Completado y funcional en producción  
**Versión:** 1.0  
**Licencia:** MIT  

---

## 🎯 Características Principales

✨ **Frontend Moderno**
- Vue.js 3 con Composition API
- Vite como build tool (carga instantánea)
- Vue Router 4 para navegación fluida
- Pinia para gestión de estado centralizado
- DOMPurify para sanitización HTML segura

🔍 **Búsqueda Inteligente**
- Búsqueda unificada en múltiples fuentes
- Índice en tiempo real
- Filtrado por tipo de recurso
- Sugerencias y autocompletado

🎨 **Diseño Responsivo**
- Optimizado para dispositivos móviles, tablets y escritorio
- Interfaz intuitiva y accesible
- Temas oscuro/claro
- Animaciones suaves

🔒 **Seguridad**
- Sanitización HTML contra XSS
- Validación de entrada
- CORS habilitado en APIs
- Rate limiting opcional

🗄️ **Integración Multi-Fuente**
- Omeka 2.x: Repositorio digital estructurado
- CMS Simple: Gestión de contenido editorial
- Sincronización automática de datos
- APIs REST nativas

🐳 **Infrastructure as Code**
- Docker y Docker Compose
- Despliegue reproducible
- Escalabilidad automática
- Health checks integrados

## 📋 Requisitos Previos

### Software Requerido
- **Node.js** 18.x o superior
- **npm** 9.x o superior (incluido con Node.js)
- **Docker** 20.10 o superior
- **Docker Compose** 2.0 o superior

### Verificar Instalación
```powershell
node --version
npm --version
docker --version
docker-compose --version
```

## 🚀 Instalación y Configuración Local

### 1. Clonar o Descargar el Proyecto

```powershell
cd d:\Usuarios\DEVazquezC\Documents\ICAT\IIS\portalweb
```

### 2. Configurar Variables de Entorno

```powershell
Copy-Item .env.example .env.local
```

Editar `.env.local` con tus configuraciones:
```env
VITE_OMEKA_API_URL=http://localhost:8081/api
VITE_CMS_API_URL=http://localhost:8082/api
VITE_API_TIMEOUT=30000
```

### 3. Instalar Dependencias

```powershell
npm install
```

### 4. Ejecutar en Desarrollo

```powershell
npm run dev
```

La aplicación estará disponible en: `http://localhost:3000`

### 5. Build para Producción

```powershell
npm run build
```

### 6. Previsualizar Build

```powershell
npm run preview
```

## 🐳 Despliegue con Docker

### Despliegue Completo (Recomendado)

```powershell
# Construir todas las imágenes
docker-compose build

# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

**URLs de Acceso:**
- Portal Web: http://localhost:3000
- Omeka-S: http://localhost:8081
- CMS Strapi: http://localhost:1337/admin
- Redis: localhost:6379

### Despliegue Solo Frontend

```powershell
# Crear imagen Docker
docker build -t iis-portal-web:latest .

# Ejecutar contenedor
docker run -d -p 3000:3000 --name iis-portal iis-portal-web:latest

# Acceder a http://localhost:3000
```

## 🔧 Configuración de Servicios

### Omeka-S (Repositorio Digital)

1. Acceder a: http://localhost:8081
2. Completar configuración inicial
3. Crear API keys para acceso programático
4. Crear elementos (items) de prueba
5. Habilitar CORS en configuración

**Credenciales por defecto:**
- Usuario: `admin@example.com`
- Contraseña: `root_password` (cambiar en docker-compose.yml)

### CMS Headless (Strapi)

1. Acceder a: http://localhost:1337/admin
2. Completar registro inicial
3. Crear contenidos (content types)
4. Configurar permisos de API
5. Generar JWT tokens

**Base de datos:**
- Host: cms-db
- Puerto: 5432
- Base: strapi
- Usuario: strapi
- Contraseña: strapi_password

## 📁 Estructura del Proyecto

```
portalweb/
├── src/
│   ├── components/          # Componentes Vue reutilizables
│   │   ├── Header.vue
│   │   ├── Navigation.vue
│   │   └── Footer.vue
│   ├── views/              # Páginas principales
│   │   ├── Home.vue
│   │   ├── Resources.vue
│   │   ├── ResourceDetail.vue
│   │   ├── Search.vue
│   │   ├── About.vue
│   │   └── NotFound.vue
│   ├── stores/             # Pinia stores
│   │   └── resources.js
│   ├── api/                # Servicios API
│   │   └── index.js
│   ├── assets/
│   │   ├── css/
│   │   │   └── main.css
│   │   └── images/
│   ├── router/
│   │   └── index.js
│   ├── App.vue
│   └── main.js
├── public/                 # Archivos estáticos
├── docs/                   # Documentación
├── assets/                 # Logos y recursos
├── index.html
├── vite.config.js
├── package.json
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── .env.production
├── .gitignore
└── README.md
```

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

### Endpoints Omeka-S

```bash
# Obtener items
GET /api/items?limit=50&offset=0

# Obtener item específico
GET /api/items/{id}

# Buscar items
GET /api/items?search=query
```

### Endpoints CMS (Strapi)

```bash
# Obtener contenidos
GET /api/content?pagination[pageSize]=50

# Obtener contenido específico
GET /api/content/{id}

# Búsqueda
GET /api/search?q=query
```

## 🧪 Testing

```powershell
# Ejecutar tests
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

### Error: "Cannot find module"
```powershell
npm install
```

### Puerto 3000 ya en uso
```powershell
# Cambiar puerto en vite.config.js
# O terminar proceso existente
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Problemas con Docker
```powershell
# Limpiar imágenes y volúmenes
docker-compose down -v
docker-compose up --build

# Ver logs detallados
docker-compose logs -f --all
```

### CORS Errors
- Verificar configuración de Omeka-S
- Agregar dominio a whitelist
- Verificar headers en respuestas API

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

### En Servidor (Ubuntu/Debian)

```bash
# 1. Instalar Docker y Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 2. Clonar repositorio
git clone <repo-url>
cd portalweb

# 3. Configurar ambiente
cp .env.example .env.production
# Editar .env.production

# 4. Construir y ejecutar
docker-compose -f docker-compose.yml up -d --build

# 5. Configurar SSL (Let's Encrypt)
# Actualizar nginx.conf con certificados
```

### En AWS/Google Cloud/Azure

1. Usar ECR/Artifact Registry para almacenar imágenes
2. Desplegar con ECS/GKE/AKS
3. Configurar RDS/Cloud SQL para bases de datos
4. Usar CloudFront/CDN para distribución

## 📞 Soporte y Contacto

**Instituto de Investigaciones Sociales UNAM**
•	Desarrollador: Dario Emmanuel Vázquez Ceballos
•	Email: darioemmanuel@ciencias.unam.mx
•	Teléfono: +52 55 7391 5092


## 📄 Licencia

Este proyecto está bajo licencia [Especificar licencia].

Los recursos digitales tienen sus propias licencias (CC, MIT, etc.).
Consultar términos específicos de cada recurso.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Hacer fork del proyecto
2. Crear rama para feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## ✅ Checklist de Despliegue

- [ ] Variables de entorno configuradas
- [ ] Base de datos inicializada
- [ ] Certificados SSL instalados
- [ ] CORS configurado
- [ ] API keys generadas
- [ ] Backups configurados
- [ ] Monitoreo activado
- [ ] Logs centralizados
- [ ] Tests pasando
- [ ] Documentación actualizada

## 📚 Referencias Útiles

- [Vue 3 Docs](https://vuejs.org/)
- [Vite Docs](https://vitejs.dev/)
- [Omeka-S API](https://omeka.org/s/docs/developer/)
- [Strapi Docs](https://strapi.io/documentation)
- [Docker Docs](https://docs.docker.com/)

---

**Última actualización:** Diciembre 2025
**Versión:** 1.0.0
**Estado:** Desarrollo
**Autor** Dario Emmanuel Vázquez Ceballos 
