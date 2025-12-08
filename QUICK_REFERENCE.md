# ⚡ QUICK REFERENCE - TARJETA DE REFERENCIA RÁPIDA

Imprime este documento o ténalos abierto mientras trabajas.

---

## 🚀 LOS 3 COMANDOS PRINCIPALES

```powershell
# 1️⃣ VER QUÉ ESTÁ MAL (2 minutos)
.\Reiniciar_Proyecto_Completo.ps1 -Modo diagnostico

# 2️⃣ REINICIAR RÁPIDO (90 segundos)
.\Reiniciar_Proyecto_Completo.ps1 -Modo rapido

# 3️⃣ REINICIO COMPLETO (15-20 minutos)
.\Reiniciar_Proyecto_Completo.ps1 -Modo completo
```

---

## 📍 IDENTIFICA TU ERROR EN 3 PASOS

```powershell
# Paso 1: Ejecuta diagnóstico
.\Reiniciar_Proyecto_Completo.ps1 -Modo diagnostico

# Paso 2: Lee el error que aparece en LOGS DE OMEKA

# Paso 3: Busca en la tabla de abajo y sigue el link
```

### Tabla de Errores → Soluciones

| Error | Solución | Tiempo |
|-------|----------|--------|
| `Can't connect to MySQL` | SOLUCIONES_OMEKA_DB.md → A | 5 min |
| `Access denied for user` | SOLUCIONES_OMEKA_DB.md → B | 5 min |
| `Connection timeout` | SOLUCIONES_OMEKA_DB.md → C | 10 min |
| `Unknown database` | SOLUCIONES_OMEKA_DB.md → D | 5 min |
| Otro error | SOLUCIONES_OMEKA_DB.md → E | 15 min |

---

## 🔧 COMANDOS DE DIAGNÓSTICO

```powershell
# VER ESTADO
docker-compose ps                           # Ver todos los servicios

# VER LOGS EN VIVO
docker-compose logs -f omeka                # Logs de Omeka
docker-compose logs -f omeka-db             # Logs de MySQL
docker-compose logs -f cms                  # Logs de CMS

# PROBAR MYSQL
docker-compose exec -T omeka-db mysqladmin ping -u root -proot_password
docker-compose exec -T omeka-db mysql -u omeka -pomeka_password omeka -e "SELECT 1;"

# EJECUTAR TESTS AUTOMÁTICOS
.\Test_Omeka_DB.ps1
```

---

## 🔄 FLUJO DE DECISIÓN

```
¿Funciona todo?
  ├─ Sí → ✓ ¡Listo!
  └─ No → ¿Qué error ves?
         ├─ No sé → Ejecuta diagnóstico
         │          .\Reiniciar_Proyecto_Completo.ps1 -Modo diagnostico
         │
         └─ Veo un error → Busca en tabla arriba
                          Abre SOLUCIONES_OMEKA_DB.md
                          Sección A/B/C/D/E
```

---

## 🕐 TIEMPOS DE ESPERA CRÍTICOS

| Componente | Tiempo Mínimo | Qué Pasa |
|-----------|---------------|---------|
| MySQL inicia | 45-60 seg | Crea usuario 'omeka' |
| Omeka inicia | 60+ seg | Se conecta a MySQL |
| Sistema completo | 120+ seg | Todos los servicios listos |

**NOTA:** Si Omeka intenta conectar antes, falla con "Can't connect"

---

## 📊 TABLA DE DECISIÓN - ¿QUÉ COMANDO EJECUTO?

| Situación | Comando |
|-----------|---------|
| Quiero diagnosticar | `.\Reiniciar_Proyecto_Completo.ps1 -Modo diagnostico` |
| Se congeló un servicio | `.\Reiniciar_Proyecto_Completo.ps1 -Modo rapido` |
| Cambié docker-compose.yml | `.\Reiniciar_Proyecto_Completo.ps1 -Modo completo` |
| Cambié un Dockerfile | `.\Reiniciar_Proyecto_Completo.ps1 -Modo completo` |
| Quiero empezar limpio | `docker-compose down -v` + `Modo completo` |
| Solo quiero ver logs | `docker-compose logs -f omeka-db` |
| Quiero hacer tests | `.\Test_Omeka_DB.ps1` |
| Problema persiste | Lee SOLUCIONES_OMEKA_DB.md sección E |

---

## ✅ CHECKLIST POST-SOLUCIÓN

Verifica esto para confirmar que está arreglado:

```powershell
# 1. Tests automáticos pasan
.\Test_Omeka_DB.ps1
# Resultado esperado: "✓ TODOS LOS TESTS PASARON EXITOSAMENTE"

# 2. Puedes acceder a los servicios
http://localhost:8081    # Omeka
http://localhost:3000    # Portal
http://localhost:1337    # CMS

# 3. MySQL responde
docker-compose exec -T omeka-db mysql -u omeka -pomeka_password omeka -e "SELECT 1;"
# Resultado esperado: "| 1 |"

# 4. Logs no muestran ERROR
docker-compose logs omeka-db | Select-String "ERROR"
docker-compose logs omeka | Select-String "ERROR"
# Resultado esperado: Nada (sin errores)
```

Si todos pasan → ✓ **PROBLEMA RESUELTO**

---

## 🚨 EMERGENCIA - RESET COMPLETO

Si nada funciona, ejecuta esto:

```powershell
# OPCIÓN NUCLEAR - ELIMINA TODOS LOS DATOS
docker-compose down -v
docker volume prune -f
docker system prune -a -f
docker-compose build --no-cache
.\Reiniciar_Proyecto_Completo.ps1 -Modo completo
```

⚠️ **ADVERTENCIA:** Esto elimina TODOS los datos. Solo usar si nada más funciona.

---

## 📚 DOCUMENTACIÓN ASOCIADA

| Archivo | Para |
|---------|------|
| `COMO_USAR_REINICIAR.md` | Instrucciones detalladas de cada modo |
| `SOLUCIONES_OMEKA_DB.md` | 5 soluciones específicas por tipo de error |
| `INDICE_RECURSOS.md` | Mapa completo de documentación |
| `README.md` | Información general del proyecto |
| `docker-compose.yml` | Configuración de servicios |

---

## 🎯 ACCESOS RÁPIDOS

```
Portal Web:    http://localhost:3000
Omeka:         http://localhost:8081
CMS:           http://localhost:1337
Nginx Proxy:   http://localhost
```

---

## 🔑 CREDENCIALES DE BASE DE DATOS

```
Usuario:   omeka
Password:  omeka_password
Host:      omeka-db (en Docker) o localhost:3306 (local)
BD:        omeka
```

Para acceso directo:
```powershell
docker-compose exec -T omeka-db mysql -u omeka -pomeka_password omeka
```

---

## 💾 VARIABLES DE ENTORNO CRÍTICAS

Estas deben coincidir en `docker-compose.yml`:

```yaml
# Sección omeka-db (MySQL)
MYSQL_ROOT_PASSWORD: root_password
MYSQL_DATABASE: omeka
MYSQL_USER: omeka
MYSQL_PASSWORD: omeka_password

# Sección omeka
MYSQL_HOST: omeka-db
MYSQL_DATABASE: omeka
MYSQL_USER: omeka
MYSQL_PASSWORD: omeka_password
```

Si alguna no coincide → Error "Access denied"

---

## 🔍 BUSCAR RÁPIDAMENTE

**¿Donde está...?**
- Los scripts: `d:\Usuarios\DEVazquezC\Documents\ICAT\IIS\portalweb\`
- Los logs: `docker-compose logs omeka`
- La configuración: `docker-compose.yml`
- Las soluciones: `SOLUCIONES_OMEKA_DB.md`

---

## 📞 CUANDO PEDIR AYUDA

Prepara esta información:

```powershell
# 1. Captura el error
.\Reiniciar_Proyecto_Completo.ps1 -Modo diagnostico > error.txt

# 2. Captura los logs
docker-compose logs omeka > logs_omeka.txt
docker-compose logs omeka-db > logs_mysql.txt

# 3. Revisa el resultado
cat error.txt
cat logs_omeka.txt
```

Entonces:
1. Busca el error en la tabla de SOLUCIONES_OMEKA_DB.md
2. Si no coincide, ve a sección E
3. Sigue los pasos de SOLUCIÓN E

---

## ⏱️ TIEMPO ESTIMADO POR PROBLEMA

| Problema | Tiempo Solución |
|----------|-----------------|
| MySQL no inicia | 5 min |
| Access denied | 5 min |
| Connection timeout | 10 min |
| BD no existe | 5 min |
| Error desconocido | 15 min |
| Problema complicado | 30-60 min |

---

## 🎓 TRES COSAS QUE RECORDAR

1. **MySQL tarda en iniciar (45-60 segundos)** - Omeka debe esperar
2. **Las variables de entorno deben coincidir exactamente** - O falla con "Access denied"
3. **Si algo falla, ejecuta diagnóstico primero** - Luego busca en tabla de soluciones

---

## 🆘 LAST RESORT - SOS

Si NADA funciona, haz esto:

```powershell
# 1. Detén todo
docker-compose down -v

# 2. Limpia completamente
docker system prune -a -f

# 3. Espera 10 segundos
Start-Sleep -Seconds 10

# 4. Inicia limpio
docker-compose build --no-cache
.\Reiniciar_Proyecto_Completo.ps1 -Modo completo

# 5. Mientras espera, abre en otra ventana
docker-compose logs -f omeka-db
docker-compose logs -f omeka
```

Si después de esto aún falla, entonces sí necesitas ayuda profesional. Recopila:
- Salida de Tests: `.\Test_Omeka_DB.ps1 > test_results.txt`
- Logs últimas 100 líneas de cada servicio
- Tu `docker-compose.yml`

---

**VERSIÓN:** 1.0  
**ÚLTIMA ACTUALIZACIÓN:** 2024  
**IMPRIME ESTA PÁGINA Y TÉNALADÓNDE PUEDAS VERLA** 📌
