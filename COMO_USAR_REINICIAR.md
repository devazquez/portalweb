# 🚀 Cómo Usar el Script de Reinicio

Este documento explica cómo usar el script `Reiniciar_Proyecto_Completo.ps1` para detener, diagnosticar y relanzar todo el proyecto.

---

## 📋 Requisitos Previos

✅ **Windows PowerShell v5.1 o superior**  
✅ **Docker Desktop instalado y corriendo**  
✅ **Node.js v18+ instalado**  
✅ **Estar en el directorio del proyecto:**
```powershell
cd d:\Usuarios\DEVazquezC\Documents\ICAT\IIS\portalweb
```

---

## 🎯 Tres Modos de Uso

### MODO 1: DIAGNÓSTICO (Más Rápido - ~2 minutos)

**Cuándo usarlo:**
- Solo quieres ver qué está pasando sin reiniciar
- Quieres verificar logs y estado actual
- Necesitas identificar el error específico

**Comando:**
```powershell
.\Reiniciar_Proyecto_Completo.ps1 -Modo diagnostico
```

**Qué hace:**
1. Muestra estado actual de todos los contenedores
2. Muestra últimas 15 líneas de logs de MySQL
3. Muestra últimas 15 líneas de logs de Omeka
4. Prueba la conectividad a MySQL
5. Verifica volúmenes y redes Docker

**Salida esperada:**
```
╔════════════════════════════════════════════════════╗
║ DIAGNÓSTICO DEL PROYECTO                           ║
╚════════════════════════════════════════════════════╝

1. ESTADO DE CONTENEDORES
============================================================
CONTAINER ID    IMAGE                    STATUS
abc123...       iis-portal               Up 2 minutes
def456...       omeka/omeka-s            Up 90 seconds
...

2. LOGS RECIENTES DE OMEKA-DB
============================================================
[MySQL logs aquí]

3. TEST DE CONECTIVIDAD
============================================================
✓ MySQL responde correctamente
```

---

### MODO 2: REINICIO RÁPIDO (Sin Reconstruir - ~90 segundos)

**Cuándo usarlo:**
- Los servicios se congelaron o no responden
- Necesitas reiniciar rápido sin perder datos
- No hay cambios en Dockerfiles

**Comando:**
```powershell
.\Reiniciar_Proyecto_Completo.ps1 -Modo rapido
```

**Qué hace:**
1. Detiene todos los servicios (sin eliminar datos)
2. Espera 3 segundos
3. Inicia todos los servicios de nuevo
4. Espera 60 segundos a que se estabilicen
5. Verifica el estado final

**Salida esperada:**
```
╔════════════════════════════════════════════════════╗
║ REINICIO RÁPIDO DEL PROYECTO                       ║
╚════════════════════════════════════════════════════╝

1. Deteniendo servicios [EN PROGRESO] 
  ✓ Servicios detenidos
  ⏳ Esperando antes de reiniciar... ✓

2. Iniciando servicios [EN PROGRESO]
  ⏳ Esperando a que se inicialicen... ✓

3. Verificando estado [EN PROGRESO]
CONTAINER ID    IMAGE         STATUS
abc123...       portal        Up 45 seconds

Accesos:
  • Portal:  http://localhost:3000
  • Omeka:   http://localhost:8081
  • CMS:     http://localhost:1337
```

---

### MODO 3: REINICIO COMPLETO (Reconstruye Todo - ~15-20 minutos)

**Cuándo usarlo:**
- Cambios en `docker-compose.yml`
- Cambios en Dockerfiles o imágenes base
- Problema persiste después de reinicio rápido
- Empezar con todo limpio

**Comando:**
```powershell
.\Reiniciar_Proyecto_Completo.ps1 -Modo completo
```

O simplemente:
```powershell
.\Reiniciar_Proyecto_Completo.ps1
```

**Qué hace (paso a paso):**

```
PASO 1: Detiene todo y elimina volúmenes
  ✓ Servicios detenidos y volúmenes eliminados
  ⏳ Esperando...

PASO 2: Reconstruye todas las imágenes Docker
  Este paso puede tomar 10-15 minutos...
  ✓ Imágenes reconstruidas

PASO 3: Levanta solo la base de datos MySQL
  ✓ Contenedor MySQL iniciado
  ⏳ Esperando a que MySQL esté listo... (45 segundos)

PASO 4: Verifica que MySQL esté listo
  ✓ MySQL está listo

PASO 5: Levanta Omeka-S
  ✓ Contenedor Omeka iniciado
  ⏳ Esperando a que Omeka se configure... (60 segundos)

PASO 6: Levanta resto de servicios
  ✓ Todos los servicios iniciados
  ⏳ Esperando a que todo se inicialice... (120 segundos)

PASO 7: Verifica estado final
  CONTAINER ID    STATUS
  abc123...       Up 10 seconds
  ...

PASO 8: Ejecuta validaciones
  ✓ Base de datos MySQL accesible
  ✓ Portal Web está funcionando

✓ PROYECTO LEVANTADO EXITOSAMENTE

Accesos disponibles:
  • Portal Web:        http://localhost:3000
  • Omeka-S:           http://localhost:8081
  • CMS Strapi:        http://localhost:1337
```

---

## 🔧 Solución de Problemas

### El script no ejecuta (Política de PowerShell)

Si ves: `cannot be loaded because running scripts is disabled`

**Solución:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Luego intenta de nuevo:
```powershell
.\Reiniciar_Proyecto_Completo.ps1 -Modo diagnostico
```

---

### Docker no está disponible

Si ves: `docker: command not found` o `Docker daemon is not running`

**Solución:**
1. Abre **Docker Desktop** desde el menú Inicio
2. Espera a que diga "Docker is running" en la esquina inferior
3. Intenta el comando de nuevo

---

### MySQL no responde (error en PASO 4)

**Síntomas:**
```
⚠ HUBO 1 PROBLEMAS DURANTE EL LEVANTAMIENTO
⚠ MySQL no respondió en el tiempo esperado
```

**Solución:**
1. Ve a MODO DIAGNOSTICO para ver los logs:
   ```powershell
   .\Reiniciar_Proyecto_Completo.ps1 -Modo diagnostico
   ```

2. Revisa los logs de MySQL:
   ```powershell
   docker-compose logs -f omeka-db
   ```

3. Si los logs muestran espacio en disco lleno:
   ```powershell
   docker system prune -a --volumes
   ```

4. Intenta el REINICIO COMPLETO de nuevo

---

### Omeka no conecta a MySQL (error en PASO 5)

**Síntomas:**
```
Error: SQLSTATE[HY000]: General error: 2002 Can't connect to MySQL
```

**Solución (paso por paso):**

1. **Ejecuta diagnóstico:**
   ```powershell
   .\Reiniciar_Proyecto_Completo.ps1 -Modo diagnostico
   ```

2. **Verifica variables de entorno en docker-compose.yml:**
   ```powershell
   # Debe tener exactamente estos valores:
   # MYSQL_HOST=omeka-db
   # MYSQL_USER=omeka
   # MYSQL_PASSWORD=omeka_password
   # MYSQL_DATABASE=omeka
   ```

3. **Si es necesario, elimina todo y reinicia limpio:**
   ```powershell
   docker-compose down -v
   docker volume prune
   docker system prune -a
   .\Reiniciar_Proyecto_Completo.ps1 -Modo completo
   ```

---

## 📊 Tabla de Decisión

| Situación | Comando |
|-----------|---------|
| Quiero ver qué está mal | `.\Reiniciar_Proyecto_Completo.ps1 -Modo diagnostico` |
| Servicio se congeló | `.\Reiniciar_Proyecto_Completo.ps1 -Modo rapido` |
| Cambié docker-compose.yml | `.\Reiniciar_Proyecto_Completo.ps1 -Modo completo` |
| Cambié un Dockerfile | `.\Reiniciar_Proyecto_Completo.ps1 -Modo completo` |
| Problema persiste | Ejecuta diagnóstico → revisa logs → consulta DIAGNOSTICO_OMEKA_DB.md |
| Empezar completamente limpio | `docker-compose down -v` luego `Modo completo` |

---

## 📝 Comandos Útiles Complementarios

```powershell
# Ver logs en tiempo real (Ctrl+C para salir)
docker-compose logs -f omeka
docker-compose logs -f omeka-db
docker-compose logs -f cms

# Ver solo últimas 50 líneas
docker-compose logs --tail=50 omeka-db

# Ver solo errores
docker-compose logs omeka-db | Select-String "ERROR"

# Probar conectividad MySQL manualmente
docker-compose exec -T omeka-db mysqladmin ping -u root -proot_password

# Ejecutar comando SQL directo
docker-compose exec -T omeka-db mysql -u omeka -pomeka_password omeka -e "SELECT 1;"

# Detener un servicio específico
docker-compose stop omeka

# Ver logs de construcción
docker-compose build --no-cache 2>&1 | Tee-Object -FilePath build.log

# Limpiar disco (CUIDADO: elimina datos)
docker system prune -a --volumes
```

---

## ✅ Checklist de Verificación Post-Reinicio

Después de ejecutar el script, verifica:

- [ ] `docker-compose ps` muestra 8 contenedores en estado "Up"
- [ ] Puedes acceder a http://localhost:3000 (Portal Web)
- [ ] Puedes acceder a http://localhost:8081 (Omeka)
- [ ] Puedes acceder a http://localhost:1337 (CMS)
- [ ] Los logs no muestran errores críticos (rojo/ERROR)
- [ ] MySQL está accesible: `docker-compose exec -T omeka-db mysql -u omeka -pomeka_password omeka -e "SELECT 1;"`

---

## 💡 Tips Avanzados

### Ver estadísticas de recursos en tiempo real
```powershell
docker stats
```

### Entrar dentro de un contenedor
```powershell
docker-compose exec omeka bash
docker-compose exec omeka-db bash
```

### Guardar logs a archivo
```powershell
docker-compose logs > logs_$(Get-Date -Format "yyyy-MM-dd_HH-mm-ss").txt
```

### Reiniciar solo un servicio sin afectar otros
```powershell
docker-compose restart omeka
```

---

## 🆘 ¿Aún tiene problemas?

1. **Ejecuta el diagnóstico completo:**
   ```powershell
   .\Reiniciar_Proyecto_Completo.ps1 -Modo diagnostico
   ```

2. **Consulta la guía detallada:**
   ```
   docs/DIAGNOSTICO_OMEKA_DB.md
   ```

3. **Revisa los logs:**
   ```powershell
   docker-compose logs omeka-db
   docker-compose logs omeka
   ```

4. **Verifica el estado de Docker:**
   ```powershell
   docker-compose config  # Valida sintaxis
   docker ps             # Ve todos los contenedores
   docker volume ls      # Ve volúmenes
   docker network ls     # Ve redes
   ```

---

**Última actualización:** 2024  
**Versión del script:** 1.0
