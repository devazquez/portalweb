#!/usr/bin/env powershell
param([string]$Modo = "completo")

$Verde = @{ForegroundColor="Green"}
$Rojo = @{ForegroundColor="Red"}
$Amarillo = @{ForegroundColor="Yellow"}
$Cian = @{ForegroundColor="Cyan"}

Write-Host ""
Write-Host "DIAGNOSTICO Y REINICIO DEL PROYECTO" @Cian
Write-Host ""

if ($Modo -eq "diagnostico") {
    Write-Host "=== MODO DIAGNOSTICO ===" @Amarillo
    Write-Host ""
    
    Write-Host "1. Estado de contenedores:" @Verde
    docker-compose ps
    Write-Host ""
    
    Write-Host "2. Logs de MySQL (ultimas 15 lineas):" @Verde
    docker-compose logs --tail=15 omeka-db
    Write-Host ""
    
    Write-Host "3. Logs de Omeka (ultimas 15 lineas):" @Verde
    docker-compose logs --tail=15 omeka
    Write-Host ""
    
    Write-Host "4. Test de conectividad MySQL:" @Verde
    try {
        $result = docker-compose exec -T omeka-db mysqladmin ping -u root -proot_password 2>&1
        if ($result -like "*alive*") {
            Write-Host "OK - MySQL responde" @Verde
        } else {
            Write-Host "ERROR - MySQL no responde" @Rojo
        }
    } catch {
        Write-Host "ERROR: $_" @Rojo
    }
    Write-Host ""
    
    exit 0
}

if ($Modo -eq "rapido") {
    Write-Host "=== MODO REINICIO RAPIDO ===" @Amarillo
    Write-Host ""
    
    Write-Host "Deteniendo servicios..." @Amarillo
    docker-compose stop
    Start-Sleep -Seconds 3
    
    Write-Host "Iniciando servicios..." @Amarillo
    docker-compose start
    Start-Sleep -Seconds 60
    
    Write-Host "Verificando estado..." @Amarillo
    docker-compose ps
    Write-Host ""
    Write-Host "Listo. Accesos:" @Verde
    Write-Host "  Portal:  http://localhost:3000"
    Write-Host "  Omeka:   http://localhost:8081"
    Write-Host "  CMS:     http://localhost:1337"
    Write-Host ""
    
    exit 0
}

if ($Modo -eq "completo") {
    Write-Host "=== MODO REINICIO COMPLETO ===" @Amarillo
    Write-Host ""
    
    Write-Host "Paso 1 - Deteniendo y limpiando..." @Amarillo
    docker-compose down -v
    Start-Sleep -Seconds 3
    
    Write-Host "Paso 2 - Reconstruyendo imagenes..." @Amarillo
    Write-Host "(Esto puede tomar 10-15 minutos)"
    docker-compose build --no-cache
    
    Write-Host "Paso 3 - Levantando MySQL..." @Amarillo
    docker-compose up -d omeka-db
    Write-Host "Esperando 45 segundos..."
    Start-Sleep -Seconds 45
    
    Write-Host "Paso 4 - Verificando MySQL..." @Amarillo
    try {
        $result = docker-compose exec -T omeka-db mysqladmin ping -u root -proot_password 2>&1
        if ($result -like "*alive*") {
            Write-Host "OK - MySQL listo" @Verde
        } else {
            Write-Host "ERROR - MySQL no responde" @Rojo
            Write-Host "Ver logs: docker-compose logs omeka-db" @Amarillo
            exit 1
        }
    } catch {
        Write-Host "ERROR: $_" @Rojo
        exit 1
    }
    
    Write-Host "Paso 5 - Levantando Omeka..." @Amarillo
    docker-compose up -d omeka
    Write-Host "Esperando 60 segundos..."
    Start-Sleep -Seconds 60
    
    Write-Host "Paso 6 - Levantando resto de servicios..." @Amarillo
    docker-compose up -d
    Write-Host "Esperando 120 segundos..."
    Start-Sleep -Seconds 120
    
    Write-Host "Paso 7 - Estado final:" @Amarillo
    docker-compose ps
    Write-Host ""
    
    Write-Host "LISTO - Proyecto levantado" @Verde
    Write-Host ""
    Write-Host "Accesos:" @Verde
    Write-Host "  Portal:  http://localhost:3000"
    Write-Host "  Omeka:   http://localhost:8081"
    Write-Host "  CMS:     http://localhost:1337"
    Write-Host ""
    
    exit 0
}

Write-Host "Uso: .\Reiniciar_Proyecto_Completo.ps1 -Modo [diagnostico|rapido|completo]" @Amarillo
