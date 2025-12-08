#!/usr/bin/env powershell
# =====================================================
# Script: Test_Omeka_DB.ps1
# Descripción: Tests automáticos para verificar conectividad Omeka-DB
# Uso: .\Test_Omeka_DB.ps1
# =====================================================

# Colores
$Verde = @{ ForegroundColor = "Green" }
$Rojo = @{ ForegroundColor = "Red" }
$Amarillo = @{ ForegroundColor = "Yellow" }
$Cian = @{ ForegroundColor = "Cyan" }
$Gris = @{ ForegroundColor = "Gray" }

# Contadores
$tests_passed = 0
$tests_failed = 0
$tests_warnings = 0

function Escribir-Banner {
    param([string]$Texto)
    Write-Host ""
    Write-Host "╔" + "═" * 58 + "╗" @Cian
    Write-Host "║ $($Texto.PadRight(56)) ║" @Cian
    Write-Host "╚" + "═" * 58 + "╝" @Cian
    Write-Host ""
}

function Test-Condition {
    param(
        [int]$Numero,
        [string]$Nombre,
        [scriptblock]$Condicion,
        [string]$ErrorEsperado = ""
    )
    
    try {
        $resultado = & $Condicion
        
        if ($resultado) {
            Write-Host "$Numero. ✓ $Nombre" @Verde
            $script:tests_passed++
        } else {
            Write-Host "$Numero. ✗ $Nombre" @Rojo
            $script:tests_failed++
            
            if ($ErrorEsperado) {
                Write-Host "   └─ Esperado: $ErrorEsperado" @Amarillo
            }
        }
    } catch {
        Write-Host "$Numero. ⚠ $Nombre" @Amarillo
        Write-Host "   └─ Error: $($_.Exception.Message)" @Rojo
        $script:tests_warnings++
    }
}

function Test-Command {
    param(
        [int]$Numero,
        [string]$Nombre,
        [string]$Comando,
        [string]$PatronEsperado,
        [string]$Descripcion = ""
    )
    
    try {
        Write-Host "$Numero. [Ejecutando]" @Gris -NoNewline
        
        $resultado = Invoke-Expression $Comando 2>&1
        
        if ($resultado -match $PatronEsperado) {
            Write-Host "`r$Numero. ✓ $Nombre" @Verde
            $script:tests_passed++
            
            if ($Descripcion) {
                Write-Host "   └─ $Descripcion" @Gris
            }
        } else {
            Write-Host "`r$Numero. ✗ $Nombre" @Rojo
            Write-Host "   └─ No encontrado: $PatronEsperado" @Amarillo
            Write-Host "   └─ Resultado: $($resultado | Select-Object -First 1)" @Gris
            $script:tests_failed++
        }
    } catch {
        Write-Host "`r$Numero. ✗ $Nombre" @Rojo
        Write-Host "   └─ Excepción: $($_.Exception.Message)" @Rojo
        $script:tests_failed++
    }
}

# =====================================================
# INICIO DE TESTS
# =====================================================

Escribir-Banner "TESTS AUTOMÁTICOS DE OMEKA-DB"

Write-Host "Iniciando suite de tests..." @Cian
Write-Host "Timestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" @Gris
Write-Host ""

# =====================================================
# SECCIÓN 1: DOCKER
# =====================================================

Write-Host "═" * 60
Write-Host "SECCIÓN 1: DOCKER" @Cian
Write-Host "═" * 60
Write-Host ""

Test-Condition 1 "Docker daemon está corriendo" {
    $output = docker ps 2>&1
    $output -match "CONTAINER"
}

Test-Condition 2 "Docker-compose está disponible" {
    $output = docker-compose --version 2>&1
    $output -match "docker-compose version"
}

Test-Command 3 "docker-compose.yml es válido" `
    "docker-compose config > `$null 2>&1" `
    "True" `
    "Sintaxis correcta en docker-compose.yml"

# =====================================================
# SECCIÓN 2: CONTENEDORES
# =====================================================

Write-Host ""
Write-Host "═" * 60
Write-Host "SECCIÓN 2: CONTENEDORES" @Cian
Write-Host "═" * 60
Write-Host ""

Test-Command 4 "Contenedor omeka-db existe" `
    "docker-compose ps omeka-db 2>&1" `
    "omeka-db"

Test-Command 5 "Contenedor omeka existe" `
    "docker-compose ps omeka 2>&1" `
    "omeka"

Test-Command 6 "Contenedor omeka-db está Up" `
    "docker-compose ps omeka-db 2>&1" `
    "Up"

Test-Command 7 "Contenedor omeka está Up" `
    "docker-compose ps omeka 2>&1" `
    "Up"

# =====================================================
# SECCIÓN 3: RED Y NETWORKING
# =====================================================

Write-Host ""
Write-Host "═" * 60
Write-Host "SECCIÓN 3: RED Y NETWORKING" @Cian
Write-Host "═" * 60
Write-Host ""

Test-Command 8 "Red iis-network existe" `
    "docker network ls 2>&1" `
    "iis-network"

Test-Command 9 "Contenedores están en iis-network" `
    "docker network inspect iis-network 2>&1" `
    "omeka"

# =====================================================
# SECCIÓN 4: VOLÚMENES
# =====================================================

Write-Host ""
Write-Host "═" * 60
Write-Host "SECCIÓN 4: VOLÚMENES" @Cian
Write-Host "═" * 60
Write-Host ""

Test-Command 10 "Volumen omeka_db existe" `
    "docker volume ls 2>&1" `
    "omeka_db"

Test-Command 11 "Volumen omeka_files existe" `
    "docker volume ls 2>&1" `
    "omeka_files" 

# =====================================================
# SECCIÓN 5: MYSQL - CONECTIVIDAD
# =====================================================

Write-Host ""
Write-Host "═" * 60
Write-Host "SECCIÓN 5: MYSQL - CONECTIVIDAD" @Cian
Write-Host "═" * 60
Write-Host ""

Test-Command 12 "MySQL responde a ping (root)" `
    "docker-compose exec -T omeka-db mysqladmin ping -u root -proot_password 2>&1" `
    "mysqld is alive" `
    "MySQL daemon está activo"

Test-Command 13 "MySQL responde en puerto 3306" `
    "docker-compose exec -T omeka-db mysqladmin ping -u root -proot_password -h localhost 2>&1" `
    "mysqld is alive"

# =====================================================
# SECCIÓN 6: MYSQL - BASES DE DATOS
# =====================================================

Write-Host ""
Write-Host "═" * 60
Write-Host "SECCIÓN 6: MYSQL - BASES DE DATOS" @Cian
Write-Host "═" * 60
Write-Host ""

Test-Command 14 "Base de datos 'omeka' existe" `
    "docker-compose exec -T omeka-db mysql -u root -proot_password -e 'SHOW DATABASES;' 2>&1" `
    "omeka"

Test-Command 15 "Base de datos 'mysql' existe" `
    "docker-compose exec -T omeka-db mysql -u root -proot_password -e 'SHOW DATABASES;' 2>&1" `
    "mysql"

# =====================================================
# SECCIÓN 7: MYSQL - USUARIOS
# =====================================================

Write-Host ""
Write-Host "═" * 60
Write-Host "SECCIÓN 7: MYSQL - USUARIOS" @Cian
Write-Host "═" * 60
Write-Host ""

Test-Command 16 "Usuario 'omeka' existe en MySQL" `
    "docker-compose exec -T omeka-db mysql -u root -proot_password -e 'SELECT user FROM mysql.user WHERE user=`"omeka`";' 2>&1" `
    "omeka" `
    "Usuario creado correctamente"

Test-Command 17 "Usuario 'root' existe en MySQL" `
    "docker-compose exec -T omeka-db mysql -u root -proot_password -e 'SELECT user FROM mysql.user WHERE user=`"root`";' 2>&1" `
    "root"

# =====================================================
# SECCIÓN 8: MYSQL - PERMISOS
# =====================================================

Write-Host ""
Write-Host "═" * 60
Write-Host "SECCIÓN 8: MYSQL - PERMISOS" @Cian
Write-Host "═" * 60
Write-Host ""

Test-Command 18 "Usuario 'omeka' tiene permisos" `
    "docker-compose exec -T omeka-db mysql -u root -proot_password -e 'SHOW GRANTS FOR `"omeka`"@`"%`";' 2>&1" `
    "GRANT"

Test-Command 19 "Usuario 'omeka' puede acceder a BD 'omeka'" `
    "docker-compose exec -T omeka-db mysql -u omeka -pomeka_password omeka -e 'SELECT 1;' 2>&1" `
    "1" `
    "Credenciales y permisos correctos"

# =====================================================
# SECCIÓN 9: VARIABLES DE ENTORNO
# =====================================================

Write-Host ""
Write-Host "═" * 60
Write-Host "SECCIÓN 9: VARIABLES DE ENTORNO" @Cian
Write-Host "═" * 60
Write-Host ""

Test-Command 20 "MYSQL_HOST está configurado en Omeka" `
    "docker-compose config 2>&1" `
    "MYSQL_HOST.*omeka-db"

Test-Command 21 "MYSQL_USER está configurado en Omeka" `
    "docker-compose config 2>&1" `
    "MYSQL_USER.*omeka"

Test-Command 22 "MYSQL_PASSWORD está configurado en Omeka" `
    "docker-compose config 2>&1" `
    "MYSQL_PASSWORD.*omeka_password"

Test-Command 23 "MYSQL_DATABASE está configurado en Omeka" `
    "docker-compose config 2>&1" `
    "MYSQL_DATABASE.*omeka"

# =====================================================
# SECCIÓN 10: OMEKA - CONECTIVIDAD
# =====================================================

Write-Host ""
Write-Host "═" * 60
Write-Host "SECCIÓN 10: OMEKA - CONECTIVIDAD" @Cian
Write-Host "═" * 60
Write-Host ""

Test-Command 24 "Omeka responde en puerto 8081" `
    "docker-compose exec -T omeka curl -s -o /dev/null -w '%{http_code}' http://localhost/ 2>/dev/null" `
    "200|301|302" `
    "Omeka web server activo"

Test-Command 25 "Logs de Omeka sin errores críticos" `
    "(docker-compose logs --tail=50 omeka 2>&1) -notmatch 'FATAL|Exception'" `
    "True"

# =====================================================
# SECCIÓN 11: SERVICIOS ADICIONALES
# =====================================================

Write-Host ""
Write-Host "═" * 60
Write-Host "SECCIÓN 11: SERVICIOS ADICIONALES" @Cian
Write-Host "═" * 60
Write-Host ""

Test-Command 26 "Contenedor CMS está Up" `
    "docker-compose ps cms 2>&1" `
    "Up"

Test-Command 27 "Contenedor Redis está Up" `
    "docker-compose ps redis 2>&1" `
    "Up"

Test-Command 28 "Contenedor Nginx está Up" `
    "docker-compose ps nginx 2>&1" `
    "Up"

Test-Command 29 "Contenedor Portal está Up" `
    "docker-compose ps portal 2>&1" `
    "Up"

# =====================================================
# RESUMEN
# =====================================================

Write-Host ""
Write-Host "═" * 60
Write-Host "RESUMEN DE RESULTADOS" @Cian
Write-Host "═" * 60
Write-Host ""

$total = $tests_passed + $tests_failed + $tests_warnings

Write-Host "Total de tests:      $total" @Cian
Write-Host "Tests pasados:       $tests_passed" @Verde
Write-Host "Tests fallidos:      $tests_failed" @Rojo
Write-Host "Advertencias:        $tests_warnings" @Amarillo
Write-Host ""

$porcentaje = if ($total -gt 0) { [math]::Round(($tests_passed / $total) * 100, 1) } else { 0 }
Write-Host "Porcentaje de éxito: $porcentaje%" @Cian
Write-Host ""

# =====================================================
# CONCLUSIÓN
# =====================================================

if ($tests_failed -eq 0 -and $tests_warnings -eq 0) {
    Write-Host "╔" + "═" * 58 + "╗" @Verde
    Write-Host "║ ✓ TODOS LOS TESTS PASARON EXITOSAMENTE" + " " * 17 + "║" @Verde
    Write-Host "║ El proyecto está listo para usar" + " " * 24 + "║" @Verde
    Write-Host "╚" + "═" * 58 + "╝" @Verde
    
    Write-Host ""
    Write-Host "Próximos pasos:" @Verde
    Write-Host "  1. Accede a Omeka: http://localhost:8081"
    Write-Host "  2. Accede al Portal: http://localhost:3000"
    Write-Host "  3. Accede a CMS: http://localhost:1337"
    Write-Host ""
    
    exit 0
}

elseif ($tests_failed -eq 0) {
    Write-Host "╔" + "═" * 58 + "╗" @Amarillo
    Write-Host "║ ⚠ TESTS COMPLETADOS CON ADVERTENCIAS" + " " * 21 + "║" @Amarillo
    Write-Host "║ Revisa los detalles arriba" + " " * 32 + "║" @Amarillo
    Write-Host "╚" + "═" * 58 + "╝" @Amarillo
    
    Write-Host ""
    Write-Host "Recomendación: Los tests pasaron, pero hay algunas advertencias." @Amarillo
    Write-Host "El proyecto probablemente funcione, pero monitorea los logs." @Amarillo
    Write-Host ""
    
    exit 1
}

else {
    Write-Host "╔" + "═" * 58 + "╗" @Rojo
    Write-Host "║ ✗ TESTS FALLIDOS - ACCIÓN REQUERIDA" + " " * 23 + "║" @Rojo
    Write-Host "╚" + "═" * 58 + "╝" @Rojo
    
    Write-Host ""
    Write-Host "Problemas encontrados: $tests_failed" @Rojo
    Write-Host ""
    Write-Host "Próximos pasos:" @Amarillo
    Write-Host "  1. Revisa los tests fallidos arriba"
    Write-Host "  2. Ejecuta: .\Reiniciar_Proyecto_Completo.ps1 -Modo diagnostico"
    Write-Host "  3. Consulta: docs/SOLUCIONES_OMEKA_DB.md"
    Write-Host "  4. Si persiste, ejecuta: docker-compose logs -f omeka-db"
    Write-Host ""
    
    exit 2
}
