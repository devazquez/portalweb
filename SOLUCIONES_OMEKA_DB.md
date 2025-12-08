# 🔍 DIAGNÓSTICO Y SOLUCIONES ESPECÍFICAS PARA OMEKA-DB

Este documento contiene soluciones específicas para el error:
**"No se está conectando a la base de datos en la sección de omeka db"**

---

## 🎯 COMIENZO RÁPIDO (3 MINUTOS)

Si necesitas resolver esto YA, sigue estos 4 pasos:

### Paso 1: Ejecuta el diagnóstico
```powershell
cd d:\Usuarios\DEVazquezC\Documents\ICAT\IIS\portalweb
.\Reiniciar_Proyecto_Completo.ps1 -Modo diagnostico
```

### Paso 2: Busca el mensaje de error
En la salida, mira la sección **"LOGS RECIENTES DE OMEKA"**. ¿Qué dice?

- **"Can't connect to MySQL server"** → Ve a la sección **SOLUCIÓN A** abajo
- **"Access denied for user 'omeka'"** → Ve a la sección **SOLUCIÓN B** abajo  
- **"Connection timeout"** → Ve a la sección **SOLUCIÓN C** abajo
- **"Unknown database 'omeka'"** → Ve a la sección **SOLUCIÓN D** abajo
- Otro error → Ve a la sección **SOLUCIÓN E** abajo

### Paso 3: Aplica la solución correspondiente
Sigue los pasos en la sección que corresponda

### Paso 4: Verifica que funcione
```powershell
.\Reiniciar_Proyecto_Completo.ps1 -Modo diagnostico
```

Si ves `✓ MySQL responde correctamente`, ¡está arreglado!

---

## 🔧 SOLUCIONES ESPECÍFICAS

---

## 🔧 SOLUCIÓN A: "Can't connect to MySQL server"

**Error exacto:**
```
Error: SQLSTATE[HY000]: General error: 2002 Can't connect to MySQL server
Error: Connection refused (errno 111)
```

**Causa:** Omeka intenta conectar a MySQL antes de que MySQL esté completamente listo.

**Solución (Opción 1 - Aumentar tiempo de espera):**

1. Detén todo:
   ```powershell
   docker-compose down -v
   ```

2. Edita `docker-compose.yml` y busca la sección de `omeka`:

3. Añade esto bajo `depends_on`:
   ```yaml
   depends_on:
     omeka-db:
       condition: service_healthy
       restart: true
   healthcheck:
     test: ["CMD", "curl", "-f", "http://localhost:80/admin/"]
     interval: 30s
     timeout: 10s
     retries: 5
     start_period: 60s
   ```

4. Levanta todo con modo completo:
   ```powershell
   .\Reiniciar_Proyecto_Completo.ps1 -Modo completo
   ```

**Solución (Opción 2 - Recrear desde cero):**

```powershell
# Elimina TODO
docker-compose down -v
docker volume prune -f
docker system prune -a -f

# Reconstruye y levanta
docker-compose build --no-cache
docker-compose up -d omeka-db
Start-Sleep -Seconds 60  # ESPERA 60 SEGUNDOS COMPLETOS
docker-compose up -d omeka
Start-Sleep -Seconds 120  # ESPERA 120 SEGUNDOS COMPLETOS
docker-compose up -d

# Verifica
docker-compose logs -f omeka-db
```

---

## 🔧 SOLUCIÓN B: "Access denied for user 'omeka'"

**Error exacto:**
```
Error: SQLSTATE[HY000]: General error: 1045 Access denied for user 'omeka'@'omeka-db' (using password: YES)
```

**Causa:** Las variables de entorno en `docker-compose.yml` no coinciden exactamente.

**Diagnóstico:**

```powershell
# Lee las variables en docker-compose.yml
docker-compose config | Select-String "MYSQL_" | Select-String -NotMatch "^#"
```

**Verificación:**

Revisa que en `docker-compose.yml`:
- Sección `omeka-db` tenga:
  ```yaml
  environment:
    MYSQL_ROOT_PASSWORD: root_password
    MYSQL_DATABASE: omeka
    MYSQL_USER: omeka
    MYSQL_PASSWORD: omeka_password
  ```

- Sección `omeka` tenga exactamente:
  ```yaml
  environment:
    MYSQL_HOST: omeka-db
    MYSQL_DATABASE: omeka
    MYSQL_USER: omeka
    MYSQL_PASSWORD: omeka_password
  ```

**Solución:**

Si encontraste diferencias:

1. Edita `docker-compose.yml` para que coincida
2. Ejecuta:
   ```powershell
   docker-compose down -v
   docker-compose build --no-cache
   .\Reiniciar_Proyecto_Completo.ps1 -Modo completo
   ```

---

## 🔧 SOLUCIÓN C: "Connection timeout"

**Error exacto:**
```
Error: SQLSTATE[HY000]: General error: 2003 Can't connect to MySQL server on 'omeka-db' (111)
Connection refused
Network is unreachable
```

**Causa:** Problema de red entre contenedores Docker.

**Diagnóstico:**

```powershell
# Verifica que la red existe
docker network ls | Select-String "iis-network"

# Verifica que los contenedores estén en esa red
docker network inspect iis-network
```

**Solución (Paso 1 - Limpiar red):**

```powershell
docker-compose down
docker network rm iis-network 2>/dev/null
docker-compose up -d
```

**Solución (Paso 2 - Si persiste, recrear desde cero):**

```powershell
# Detén y limpia completamente
docker-compose down -v
docker volume prune -f
docker network prune -f
docker system prune -a -f

# Reconstruye
docker-compose build --no-cache
docker-compose up -d omeka-db
Start-Sleep -Seconds 60
docker-compose up -d omeka
Start-Sleep -Seconds 120
docker-compose up -d
```

**Solución (Paso 3 - Si aún no funciona, prueba DNS):**

Edita `docker-compose.yml` y en la sección `omeka`, añade:

```yaml
omeka:
  # ... resto de configuración ...
  networks:
    - iis-network
  dns:
    - 8.8.8.8
    - 8.8.4.4
```

Luego:
```powershell
docker-compose restart omeka
docker-compose logs -f omeka
```

---

## 🔧 SOLUCIÓN D: "Unknown database 'omeka'"

**Error exacto:**
```
Error: SQLSTATE[HY000]: General error: 1049 Unknown database 'omeka'
```

**Causa:** La base de datos no fue creada en MySQL.

**Diagnóstico:**

```powershell
# Conecta a MySQL y lista bases de datos
docker-compose exec -T omeka-db mysql -u root -proot_password -e "SHOW DATABASES;"
```

**Salida esperada:**
```
Database
information_schema
mysql
omeka
performance_schema
sys
```

Si no ves `omeka`, la base de datos no existe.

**Solución:**

1. Crea la base de datos manualmente:
   ```powershell
   docker-compose exec -T omeka-db mysql -u root -proot_password -e "CREATE DATABASE omeka;"
   ```

2. Verifica que se creó:
   ```powershell
   docker-compose exec -T omeka-db mysql -u root -proot_password -e "SHOW DATABASES;"
   ```

3. Si aún no funciona, elimina todo y reinicia:
   ```powershell
   docker-compose down -v
   docker-compose build --no-cache
   .\Reiniciar_Proyecto_Completo.ps1 -Modo completo
   ```

---

## 🔧 SOLUCIÓN E: Otro Error / No Identificado

**Paso 1: Recopila información**

```powershell
# Guarda toda la información en un archivo
$Timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$LogFile = "diagnostico_$Timestamp.log"

Add-Content -Path $LogFile -Value "=== DIAGNÓSTICO DE OMEKA-DB ===" 
Add-Content -Path $LogFile -Value "Hora: $(Get-Date)"
Add-Content -Path $LogFile -Value ""

Add-Content -Path $LogFile -Value "1. ESTADO DE CONTENEDORES"
docker-compose ps | Add-Content -Path $LogFile

Add-Content -Path $LogFile -Value "`n2. LOGS DE MYSQL (últimas 50 líneas)"
docker-compose logs --tail=50 omeka-db | Add-Content -Path $LogFile

Add-Content -Path $LogFile -Value "`n3. LOGS DE OMEKA (últimas 50 líneas)"
docker-compose logs --tail=50 omeka | Add-Content -Path $LogFile

Add-Content -Path $LogFile -Value "`n4. CONFIGURACIÓN"
docker-compose config | Add-Content -Path $LogFile

Write-Host "Diagnóstico guardado en: $LogFile"
```

**Paso 2: Revisa el archivo generado**

```powershell
Notepad $LogFile
```

Busca palabras clave:
- `ERROR`
- `failed`
- `denied`
- `Connection`
- `Exception`

**Paso 3: Intenta las 3 soluciones genéricas**

**Intento 1 - Reinicio rápido:**
```powershell
.\Reiniciar_Proyecto_Completo.ps1 -Modo rapido
.\Reiniciar_Proyecto_Completo.ps1 -Modo diagnostico
```

**Intento 2 - Limpieza de Docker:**
```powershell
docker system prune -a --volumes -f
docker-compose build --no-cache
.\Reiniciar_Proyecto_Completo.ps1 -Modo completo
```

**Intento 3 - Verificación manual:**

```powershell
# Verifica MySQL está activo
docker-compose exec -T omeka-db mysqladmin ping -u root -proot_password

# Verifica usuario omeka existe
docker-compose exec -T omeka-db mysql -u root -proot_password -e "SELECT user FROM mysql.user WHERE user='omeka';"

# Verifica permisos
docker-compose exec -T omeka-db mysql -u root -proot_password -e "SHOW GRANTS FOR 'omeka'@'%';"

# Prueba conectar como omeka
docker-compose exec -T omeka-db mysql -u omeka -pomeka_password omeka -e "SELECT 1;"
```

---

## 📊 TABLA DE ERRORES Y SOLUCIONES RÁPIDA

| Mensaje de Error | Causa Principal | Solución Rápida |
|------------------|-----------------|-----------------|
| `Can't connect to MySQL server` | MySQL no está listo | Aumentar espera en docker-compose |
| `Access denied for user` | Variables de env incorrectas | Verificar MYSQL_PASSWORD y MYSQL_USER |
| `Connection timeout` | Problema de red Docker | `docker network prune -f` y reiniciar |
| `Unknown database` | BD no creada | `mysql -e "CREATE DATABASE omeka;"` |
| `Connection refused` | Servicio no escuchando | Esperar 60+ segundos antes de conectar |
| `Packet too large` | Límite de tamaño SQL | Aumentar `max_allowed_packet` en MySQL |

---

## 🧪 SCRIPT AUTOMÁTICO DE TEST

Guarda este código como `Test_Omeka_DB.ps1`:

```powershell
#!/usr/bin/env powershell

Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║ TEST AUTOMÁTICO DE OMEKA-DB            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$tests_passed = 0
$tests_failed = 0

function Test-Condition {
    param([string]$Name, [scriptblock]$Condition)
    
    try {
        $result = & $Condition
        if ($result) {
            Write-Host "✓ $Name" -ForegroundColor Green
            $script:tests_passed++
        } else {
            Write-Host "✗ $Name" -ForegroundColor Red
            $script:tests_failed++
        }
    } catch {
        Write-Host "✗ $Name - Error: $_" -ForegroundColor Red
        $script:tests_failed++
    }
}

# TEST 1: Docker está corriendo
Test-Condition "Docker daemon está corriendo" {
    (docker ps 2>&1) -match "CONTAINER"
}

# TEST 2: docker-compose funciona
Test-Condition "docker-compose está disponible" {
    (docker-compose --version 2>&1) -match "docker-compose version"
}

# TEST 3: Contenedor omeka-db existe
Test-Condition "Contenedor omeka-db existe" {
    (docker-compose ps omeka-db 2>&1) -match "omeka-db"
}

# TEST 4: MySQL está activo
Test-Condition "MySQL responde a ping" {
    (docker-compose exec -T omeka-db mysqladmin ping -u root -proot_password 2>&1) -match "mysqld is alive"
}

# TEST 5: Base de datos omeka existe
Test-Condition "Base de datos 'omeka' existe" {
    $dbs = docker-compose exec -T omeka-db mysql -u root -proot_password -e "SHOW DATABASES;" 2>&1
    $dbs -match "omeka"
}

# TEST 6: Usuario omeka existe
Test-Condition "Usuario 'omeka' existe en MySQL" {
    $users = docker-compose exec -T omeka-db mysql -u root -proot_password -e "SELECT user FROM mysql.user WHERE user='omeka';" 2>&1
    $users -match "omeka"
}

# TEST 7: Usuario omeka puede conectar
Test-Condition "Usuario 'omeka' puede conectar a BD" {
    (docker-compose exec -T omeka-db mysql -u omeka -pomeka_password omeka -e "SELECT 1;" 2>&1) -match "1"
}

# TEST 8: Omeka está corriendo
Test-Condition "Contenedor omeka está corriendo" {
    $status = docker-compose ps omeka 2>&1
    ($status -match "Up") -or ($status -match "running")
}

# TEST 9: Red está creada
Test-Condition "Red iis-network existe" {
    (docker network ls 2>&1) -match "iis-network"
}

# TEST 10: Volúmenes están creados
Test-Condition "Volúmenes Docker existen" {
    (docker volume ls 2>&1) -match "omeka_db|omeka_files"
}

Write-Host ""
Write-Host "═════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "RESULTADOS: $tests_passed pasados, $tests_failed fallidos" -ForegroundColor Cyan
Write-Host "═════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

if ($tests_failed -eq 0) {
    Write-Host "✓ TODOS LOS TESTS PASARON" -ForegroundColor Green
} else {
    Write-Host "⚠ $tests_failed TESTS FALLARON - Ver secciones de solución arriba" -ForegroundColor Red
}
```

**Uso:**
```powershell
.\Test_Omeka_DB.ps1
```

---

## 📞 CHEAT SHEET DE COMANDOS ÚTILES

```powershell
# VER ESTADO
docker-compose ps
docker-compose logs -f omeka-db
docker-compose logs -f omeka

# DIAGNOSTICAR
docker-compose exec -T omeka-db mysqladmin ping -u root -proot_password
docker-compose exec -T omeka-db mysql -u omeka -pomeka_password omeka -e "SELECT 1;"

# LIMPIAR Y REINICIAR
docker-compose down -v
docker system prune -a -f
.\Reiniciar_Proyecto_Completo.ps1 -Modo completo

# ENTRAR EN CONTENEDOR
docker-compose exec omeka-db bash
docker-compose exec omeka bash

# VER VARIABLES
docker-compose config | Select-String "MYSQL_"
```

---

## 🎓 ENTENDIMIENTO TÉCNICO

### ¿Por qué falla la conexión?

```
FLUJO ESPERADO:
1. docker-compose up -d
2. Docker crea red iis-network
3. Docker levanta omeka-db
4. MySQL se inicia en omeka-db (puerto 3306)
5. MySQL crea usuario 'omeka' y BD 'omeka'
6. Docker levanta omeka (espera a que omeka-db esté healthy)
7. Omeka intenta conectar a omeka-db:3306
8. Omeka autentica con usuario 'omeka' / password 'omeka_password'
9. Omeka accede a BD 'omeka'
10. ✓ Conexión exitosa

FLUJOS DE ERROR:
  • Si paso 5 no completa antes que paso 7 → "Can't connect"
  • Si step 5 tiene password diferente → "Access denied"
  • Si red no está creada → "Connection timeout"
  • Si paso 5 no crea la BD → "Unknown database"
```

### Variables de Entorno

Omeka necesita estas variables para conectar:
```
MYSQL_HOST=omeka-db      # Nombre del servicio Docker (DNS interno)
MYSQL_USER=omeka         # Usuario en MySQL
MYSQL_PASSWORD=omeka_password  # Password de ese usuario
MYSQL_DATABASE=omeka     # Nombre de la BD
```

Si una de estas no coincide con lo que MySQL tiene, la conexión falla.

### Health Checks

Docker tiene un sistema de health checks:

```yaml
# En omeka-db (MySQL)
healthcheck:
  test: ["CMD", "mysqladmin", "ping", "-u", "root", "-proot_password"]
  interval: 10s
  timeout: 5s
  retries: 5
```

Esto le dice a Docker: "cada 10 segundos, verifica que MySQL responda al ping"

Si falla 5 veces, el contenedor se marca como unhealthy.

El servicio `omeka` espera a que `omeka-db` esté healthy antes de iniciar.

---

## ✅ VALIDACIÓN FINAL

Cuando creas que está arreglado, ejecuta:

```powershell
# 1. Diagnóstico visual
.\Reiniciar_Proyecto_Completo.ps1 -Modo diagnostico

# 2. Tests automáticos
.\Test_Omeka_DB.ps1

# 3. Acceso manual a MySQL
docker-compose exec -T omeka-db mysql -u omeka -pomeka_password omeka -e "SELECT VERSION();"

# 4. Verifica web
Start-Process "http://localhost:8081"  # Debería cargar Omeka

# 5. Revisa logs finales
docker-compose logs --tail=20 omeka
```

Si todos pasan, ¡el problema está resuelto! 🎉

---

**Última actualización:** 2024  
**Script versión:** 1.0  
**Compatibilidad:** Windows PowerShell 5.1+, Docker Desktop
