# Guía de Diagnóstico y Reinicio del Proyecto

## 🔴 PROBLEMA: Omeka-S No Conecta a la Base de Datos

Este documento proporciona pasos detallados para detener, diagnosticar y reiniciar correctamente el proyecto.

---

## ⚠️ PASOS PARA DETENER TODO CORRECTAMENTE

### Opción 1: Detener sin Eliminar Datos (Recomendado para Diagnóstico)

```powershell
# 1. Detener todos los servicios (mantiene volúmenes y datos)
docker-compose stop

# Esperar 5 segundos
Start-Sleep -Seconds 5

# 2. Verificar que todos están detenidos
docker-compose ps

# Deberías ver "Exited (0)" en STATUS para todos los servicios
```

**Resultado esperado:**
```
NAME              STATUS
iis-portal-web    Exited (0)
iis-omeka         Exited (0)
iis-omeka-db      Exited (0)
iis-cms           Exited (0)
iis-cms-db        Exited (0)
iis-redis         Exited (0)
iis-nginx         Exited (0)
```

### Opción 2: Detener y Limpiar COMPLETAMENTE (Para Reseteo Total)

⚠️ **ADVERTENCIA: Esto elimina todos los datos en bases de datos**

```powershell
# 1. Detener y eliminar contenedores + volúmenes
docker-compose down -v

# 2. Verificar que todo fue eliminado
docker-compose ps
# Deberías ver: "no container to start"
```

---

## 🔍 DIAGNOSTICAR EL PROBLEMA

### Paso 1: Revisar Logs de Omeka-S

```powershell
# Ver logs de Omeka
docker-compose logs omeka

# O en tiempo real
docker-compose logs -f omeka

# Búscar errores específicos
docker-compose logs omeka | Select-String "error" -Context 5
```

**Errores comunes a buscar:**
- `Connection refused`
- `Access denied for user`
- `Can't connect to MySQL server`
- `Timeout connecting to database`

### Paso 2: Revisar Logs de MySQL

```powershell
# Ver logs de la base de datos
docker-compose logs omeka-db

# Ver en tiempo real
docker-compose logs -f omeka-db

# Buscar errores
docker-compose logs omeka-db | Select-String "error" -Context 5
```

**Errores comunes:**
- `[ERROR]` 
- `Aborted connection`
- `Lost connection`

### Paso 3: Verificar Salud de Contenedores

```powershell
# Ver estado detallado
docker-compose ps --no-trunc

# Inspeccionar contenedor específico
docker inspect iis-omeka-db | Select-String "Health" -Context 5

# Estado del healthcheck
docker ps --format "table {{.Names}}\t{{.Status}}"
```

### Paso 4: Probar Conectividad Entre Contenedores

```powershell
# Ejecutar comando dentro de Omeka para probar conexión a MySQL
docker-compose exec omeka sh -c "mysql -h omeka-db -u omeka -pomeka_password omeka -e 'SELECT 1;'"

# Si funciona, deberías ver:
# +---+
# | 1 |
# +---+
# | 1 |
# +---+
```

---

## ✅ PASOS PARA LEVANTAR CORRECTAMENTE EL PROYECTO

### Método 1: Levantamiento Limpio (Desde Cero)

**Paso 1: Limpieza Inicial**
```powershell
# 1.1 Detener todo
docker-compose down -v

# 1.2 Esperar un poco
Start-Sleep -Seconds 3

# 1.3 Verificar que todo esté eliminado
docker ps -a
docker volume ls
```

**Paso 2: Reconstruir Imágenes**
```powershell
# 2.1 Reconstruir SIN caché
docker-compose build --no-cache

# 2.2 Esperar a que termine (puede tomar 10-15 minutos)
# Verás mensajes como "Step 1/X FROM ...", "Successfully built ..."
```

**Paso 3: Levantar Servicios en Orden**
```powershell
# 3.1 Levantar solo base de datos primero
docker-compose up -d omeka-db

# 3.2 Esperar a que MySQL esté listo (30-60 segundos)
Start-Sleep -Seconds 30

# 3.3 Verificar que MySQL está saludable
docker-compose ps omeka-db

# Deberías ver: "Up 30 seconds (healthy)" o similar
```

**Paso 4: Levantar Omeka**
```powershell
# 4.1 Levantar Omeka (que depende de omeka-db)
docker-compose up -d omeka

# 4.2 Esperar a que Omeka inicie (60-90 segundos)
Start-Sleep -Seconds 60

# 4.3 Verificar estado
docker-compose ps omeka

# Deberías ver: "Up 60 seconds (health: starting)"
```

**Paso 5: Levantar Resto de Servicios**
```powershell
# 5.1 Levantar todos los servicios restantes
docker-compose up -d

# 5.2 Esperar a que inicien (2-3 minutos)
Start-Sleep -Seconds 120

# 5.3 Verificar estado final
docker-compose ps

# Todos deberían mostrar "Up X seconds (healthy)"
```

### Método 2: Reinicio Rápido (Si Servicios Están Configurados)

```powershell
# 1. Iniciar servicios (asume que existen)
docker-compose start

# 2. Esperar a que se inicien
Start-Sleep -Seconds 60

# 3. Verificar
docker-compose ps
```

---

## 🐛 SOLUCIONES ESPECÍFICAS PARA OMEKA-DB

### Problema: "Can't connect to MySQL server"

**Causa más común:** MySQL no está completamente listo cuando Omeka intenta conectar

**Solución:**

```powershell
# 1. Detener todo
docker-compose down -v

# 2. Levantar SOLO omeka-db
docker-compose up -d omeka-db

# 3. Esperar MÁS tiempo para que MySQL esté listo
Write-Host "Esperando a que MySQL esté completamente listo..."
for ($i = 0; $i -lt 60; $i++) {
    $status = docker-compose exec -T omeka-db mysqladmin ping -u root -proot_password 2>&1
    if ($status -like "*mysqld is alive*") {
        Write-Host "✓ MySQL está listo!"
        break
    }
    Write-Host "...esperando ($($i+1)/60)"
    Start-Sleep -Seconds 1
}

# 4. Ahora levantar Omeka
docker-compose up -d omeka

# 5. Monitorear logs
docker-compose logs -f omeka
```

### Problema: "Access denied for user 'omeka'@'172.x.x.x'"

**Causa:** Variables de entorno no coinciden entre omeka-db y omeka

**Solución - Verificar docker-compose.yml:**

```yaml
omeka-db:
  environment:
    - MYSQL_ROOT_PASSWORD=root_password      # ← Debe coincidir
    - MYSQL_DATABASE=omeka                   # ← Debe coincidir
    - MYSQL_USER=omeka                       # ← Debe coincidir
    - MYSQL_PASSWORD=omeka_password          # ← Debe coincidir

omeka:
  environment:
    - MYSQL_HOST=omeka-db                    # ← Nombre del contenedor
    - MYSQL_DATABASE=omeka                   # ← Debe coincidir
    - MYSQL_USER=omeka                       # ← Debe coincidir
    - MYSQL_PASSWORD=omeka_password          # ← Debe coincidir
```

Si hay diferencias:
```powershell
# 1. Detener
docker-compose down -v

# 2. Editar docker-compose.yml y corregir

# 3. Reconstruir
docker-compose build --no-cache

# 4. Levantar
docker-compose up -d
```

### Problema: "Connection timeout"

**Causa:** Los contenedores no pueden comunicarse (problema de red)

**Solución:**

```powershell
# 1. Eliminar volúmenes y redes
docker-compose down -v
docker network prune -f

# 2. Verificar que la red iis-network no existe
docker network ls | Select-String "iis-network"

# 3. Levantar nuevamente (Docker creará la red automáticamente)
docker-compose up -d

# 4. Verificar que la red se creó
docker network ls
docker network inspect iis-network
```

---

## 📋 SCRIPT AUTOMATIZADO PARA DIAGNÓSTICO COMPLETO

```powershell
# ==========================================
# Script: Diagnosticar_Proyecto.ps1
# ==========================================

Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     DIAGNÓSTICO COMPLETO DEL PROYECTO                ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

# 1. Estado de Contenedores
Write-Host "`n1. ESTADO DE CONTENEDORES" -ForegroundColor Green
Write-Host "=" * 50
docker-compose ps
Write-Host ""

# 2. Salud de Servicios
Write-Host "2. SALUD DE SERVICIOS" -ForegroundColor Green
Write-Host "=" * 50
docker ps --format "table {{.Names}}\t{{.Status}}"
Write-Host ""

# 3. Redes
Write-Host "3. REDES DOCKER" -ForegroundColor Green
Write-Host "=" * 50
docker network ls | Select-String "iis-network"
Write-Host ""

# 4. Volúmenes
Write-Host "4. VOLÚMENES DE DATOS" -ForegroundColor Green
Write-Host "=" * 50
docker volume ls | Select-String "iis"
Write-Host ""

# 5. Logs de Omeka-DB
Write-Host "5. ÚLTIMOS LOGS DE MYSQL" -ForegroundColor Green
Write-Host "=" * 50
docker-compose logs --tail=20 omeka-db
Write-Host ""

# 6. Logs de Omeka
Write-Host "6. ÚLTIMOS LOGS DE OMEKA" -ForegroundColor Green
Write-Host "=" * 50
docker-compose logs --tail=20 omeka
Write-Host ""

# 7. Intentar conectar a MySQL
Write-Host "7. TEST DE CONECTIVIDAD A MYSQL" -ForegroundColor Green
Write-Host "=" * 50
try {
    $result = docker-compose exec -T omeka-db mysqladmin ping -u root -proot_password 2>&1
    if ($result -like "*mysqld is alive*") {
        Write-Host "✓ MySQL responde correctamente" -ForegroundColor Green
    } else {
        Write-Host "✗ MySQL no responde: $result" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Error al conectar: $_" -ForegroundColor Red
}

Write-Host "`n" + "=" * 50
Write-Host "FIN DEL DIAGNÓSTICO" -ForegroundColor Cyan
```

Guarda este script como `Diagnosticar_Proyecto.ps1` en la raíz del proyecto y ejecuta:

```powershell
.\Diagnosticar_Proyecto.ps1
```

---

## 🚀 SECUENCIA COMPLETA RECOMENDADA

### Para un Reinicio Total y Limpio:

```powershell
Write-Host "PASO 1: Detener todo..." -ForegroundColor Yellow
docker-compose down -v
Start-Sleep -Seconds 3

Write-Host "PASO 2: Reconstruir imágenes..." -ForegroundColor Yellow
docker-compose build --no-cache

Write-Host "PASO 3: Levantar MySQL..." -ForegroundColor Yellow
docker-compose up -d omeka-db
Start-Sleep -Seconds 45

Write-Host "PASO 4: Verificar MySQL..." -ForegroundColor Yellow
docker-compose logs omeka-db | Select-String "ready for connections" -Context 2

Write-Host "PASO 5: Levantar Omeka..." -ForegroundColor Yellow
docker-compose up -d omeka
Start-Sleep -Seconds 60

Write-Host "PASO 6: Levantar resto de servicios..." -ForegroundColor Yellow
docker-compose up -d

Write-Host "PASO 7: Verificar todo..." -ForegroundColor Yellow
docker-compose ps

Write-Host "✓ Proyecto levantado!" -ForegroundColor Green
Write-Host "Portal: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Omeka: http://localhost:8081" -ForegroundColor Cyan
```

---

## 📊 TABLA DE ESTADOS ESPERADOS

```
CONTENEDOR          PUERTO    STATUS ESPERADO           TIEMPO ESPERA
────────────────────────────────────────────────────────────────
omeka-db            3306      Up (healthy)              30-60 seg
omeka               8081      Up (health: starting)     60-90 seg
cms-db              5432      Up (healthy)              30-60 seg
cms                 1337      Up (healthy)              90-120 seg
redis               6379      Up (healthy)              15-30 seg
portal              3000      Up (healthy)              30-60 seg
nginx               80/443    Up                        15-30 seg
```

---

## 🔗 CHECKLIST DE VERIFICACIÓN

Después de levantar, verifica:

- [ ] Todos los contenedores están `Up` con `docker-compose ps`
- [ ] MySQL responde: `docker-compose exec -T omeka-db mysqladmin ping -u root -proot_password`
- [ ] Base de datos existe: `docker-compose exec -T omeka-db mysql -u omeka -pomeka_password omeka -e "SELECT 1;"`
- [ ] Omeka conecta a MySQL en los logs: `docker-compose logs omeka | Select-String "successfully" -Context 2`
- [ ] Portal web abre en http://localhost:3000
- [ ] Omeka abre en http://localhost:8081
- [ ] CMS abre en http://localhost:1337

---

## 📞 CONTACTO PARA PROBLEMAS PERSISTENTES

Si después de estos pasos sigue habiendo problema:

1. Ejecuta: `.\Diagnosticar_Proyecto.ps1`
2. Copia la salida completa
3. Revisa:
   - `/docs/INSTALL.md` - Instalación
   - `/docs/ARCHITECTURE.md` - Arquitectura
   - `docker-compose.yml` - Configuración

---

**Última actualización:** Diciembre 2024
**Versión:** 1.0.0
