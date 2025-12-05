# Inicio Rápido - 5 Minutos

## 🚀 Opción 1: Ejecución Local (Más Rápido)

```powershell
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Abrir navegador
# http://localhost:3000
```

## 🐳 Opción 2: Con Docker (Completo)

```powershell
# 1. Construir imágenes
docker-compose build

# 2. Iniciar servicios
docker-compose up -d

# 3. Esperar 1 minuto
# 4. Acceder a http://localhost:3000
```

## 📋 URLs de Acceso

| Servicio | URL | Función |
|----------|-----|---------|
| **Portal Web** | http://localhost:3000 | Aplicación principal |
| **Omeka API** | http://localhost:8081 | Repositorio de recursos |
| **CMS** | http://localhost:1337 | Gestor de contenidos |

## ⚙️ Configuración Inicial (Opcional)

Si quieres usar tus propios servicios, edita `.env.local`:

```env
VITE_OMEKA_API_URL=http://tu-omeka:8080/api
VITE_CMS_API_URL=http://tu-cms:3000/api
```

## 🛑 Detener Servicios

**Local:**
```powershell
Ctrl + C
```

**Docker:**
```powershell
docker-compose stop
```

## 📚 Documentación Completa

- **Instalación Detallada:** `docs/INSTALL.md`
- **README Principal:** `README.md`
- **Información Técnica:** `docs/TECHNICAL.md` (próximamente)

## 🆘 Problemas Comunes

**"Port already in use"**
```powershell
# Cambiar puerto en vite.config.js o:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**"Module not found"**
```powershell
npm install
```

**"API connection failed"**
- Verificar que Omeka y CMS estén corriendo
- Revisar URLs en `.env.local`

## ✅ Verificación

Después de iniciar:

1. ✓ Portal carga sin errores
2. ✓ Puede navegar entre páginas
3. ✓ Búsqueda funciona
4. ✓ Imágenes se muestran

Si todo está verde, ¡estás listo! 🎉

---

**Más detalles:** Consulta `docs/INSTALL.md` o `README.md`
