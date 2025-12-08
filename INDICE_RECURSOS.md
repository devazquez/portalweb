# 📚 GUÍA COMPLETA - ÍNDICE DE RECURSOS

Este documento es tu punto de entrada para resolver el problema de **Omeka-DB** y entender cómo usar todo el proyecto.

---

## 🚀 INICIO RÁPIDO (3 OPCIONES)

### Opción 1: Solo quiero saber qué está mal (2 minutos)

```powershell
cd d:\Usuarios\DEVazquezC\Documents\ICAT\IIS\portalweb
.\Reiniciar_Proyecto_Completo.ps1 -Modo diagnostico
```

**Resultado:** Verás exactamente qué servicio falla y por qué

**Consulta:**
- 📄 `COMO_USAR_REINICIAR.md` → Sección "MODO 1: DIAGNÓSTICO"

---

### Opción 2: Quiero reiniciar sin perder datos (90 segundos)

```powershell
.\Reiniciar_Proyecto_Completo.ps1 -Modo rapido
```

**Resultado:** Todos los servicios se detienen y reinician manteniendo datos

**Consulta:**
- 📄 `COMO_USAR_REINICIAR.md` → Sección "MODO 2: REINICIO RÁPIDO"

---

### Opción 3: Quiero empezar completamente limpio (15-20 minutos)

```powershell
.\Reiniciar_Proyecto_Completo.ps1 -Modo completo
```

**Resultado:** Todo se limpia, reconstruye e inicia desde cero

**Consulta:**
- 📄 `COMO_USAR_REINICIAR.md` → Sección "MODO 3: REINICIO COMPLETO"

---

## 🎯 FLUJO DE SOLUCIÓN DE PROBLEMAS

```
┌─────────────────────────────────────────────────────────┐
│ 1. Ejecuta diagnóstico                                  │
│    .\Reiniciar_Proyecto_Completo.ps1 -Modo diagnostico │
└─────────────────────┬──────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │  Lee el mensaje de error  │
        └──────────┬────────────────┘
                   │
    ┌──────────────┼──────────────┬──────────────┬────────────┐
    │              │              │              │            │
    ▼              ▼              ▼              ▼            ▼
"Can't       "Access        "Connection   "Unknown      Otro
 connect"    denied"        timeout"      database"    error


    │              │              │              │            │
    └──────────────┼──────────────┼──────────────┼────────────┘
                   │
        ┌──────────┴─────────┐
        │ Abre:               │
        │ SOLUCIONES_         │
        │ OMEKA_DB.md         │
        │ Sección A/B/C/D/E   │
        └──────────┬──────────┘
                   │
        ┌──────────┴────────────┐
        │ Sigue pasos específicos│
        │ de esa sección         │
        └──────────┬─────────────┘
                   │
        ┌──────────┴────────────┐
        │ Ejecuta:              │
        │ .\Test_Omeka_DB.ps1   │
        └──────────┬─────────────┘
                   │
            ┌──────┴──────┐
            │             │
        ✓ TESTS          ✗ AÚN NO
        PASARON         FUNCIONA
            │             │
            ▼             ▼
        ¡LISTO!      Vuelve a paso 1
```

---

## 📋 DOCUMENTOS DISPONIBLES

### Scripts Automáticos (Ejecutables)

| Script | Descripción | Tiempo | Uso |
|--------|-------------|--------|-----|
| **Reiniciar_Proyecto_Completo.ps1** | Detiene, diagnostica y levanta el proyecto | 2-20 min | Principal |
| **Test_Omeka_DB.ps1** | Tests automáticos (29 tests) | 1-2 min | Verificación |

### Documentación (Lectura)

| Documento | Contenido | Cuándo Leer |
|-----------|-----------|------------|
| **COMO_USAR_REINICIAR.md** | Guía de 3 modos de reinicio + troubleshooting | AHORA |
| **SOLUCIONES_OMEKA_DB.md** | 5 soluciones específicas por tipo de error | Cuando falle algo |
| **INDICE_RECURSOS.md** | Este documento | Para orientarte |

---

## 🔍 ENCUENTRA RÁPIDAMENTE TU PROBLEMA

### Tengo este error...

#### **"Can't connect to MySQL server" o "Connection refused"**
→ 📄 `SOLUCIONES_OMEKA_DB.md` → **SOLUCIÓN A**

**Causa:** MySQL no estaba listo cuando Omeka intentó conectar  
**Solución:** Aumentar tiempos de espera o verificar startup order

---

#### **"Access denied for user 'omeka'"**
→ 📄 `SOLUCIONES_OMEKA_DB.md` → **SOLUCIÓN B**

**Causa:** Variables de entorno no coinciden  
**Solución:** Verificar MYSQL_PASSWORD y MYSQL_USER en docker-compose.yml

---

#### **"Connection timeout" o "Network is unreachable"**
→ 📄 `SOLUCIONES_OMEKA_DB.md` → **SOLUCIÓN C**

**Causa:** Problema de red Docker  
**Solución:** Limpiar redes y recrear

---

#### **"Unknown database 'omeka'"**
→ 📄 `SOLUCIONES_OMEKA_DB.md` → **SOLUCIÓN D**

**Causa:** BD no creada en MySQL  
**Solución:** Crear BD manualmente o reiniciar limpio

---

#### **Otro error / No identificado**
→ 📄 `SOLUCIONES_OMEKA_DB.md` → **SOLUCIÓN E**

**Paso 1:** Recopila logs en archivo  
**Paso 2:** Intenta 3 soluciones genéricas  
**Paso 3:** Usa script de test automático

---

## 🛠️ COMANDOS MÁS COMUNES

### Ver Estado
```powershell
docker-compose ps                    # Ver todos los contenedores
docker-compose logs -f omeka         # Ver logs de Omeka en tiempo real
docker-compose logs -f omeka-db      # Ver logs de MySQL en tiempo real
docker-compose logs --tail=50 omeka-db  # Últimas 50 líneas
```

### Diagnosticar
```powershell
.\Reiniciar_Proyecto_Completo.ps1 -Modo diagnostico
.\Test_Omeka_DB.ps1
docker-compose exec -T omeka-db mysqladmin ping -u root -proot_password
docker-compose exec -T omeka-db mysql -u omeka -pomeka_password omeka -e "SELECT 1;"
```

### Reiniciar
```powershell
.\Reiniciar_Proyecto_Completo.ps1 -Modo rapido      # Rápido (90 seg)
.\Reiniciar_Proyecto_Completo.ps1 -Modo completo    # Completo (15-20 min)
docker-compose restart omeka                         # Solo Omeka
```

### Limpiar
```powershell
docker-compose down                  # Detener sin eliminar datos
docker-compose down -v               # Detener y eliminar volúmenes
docker system prune -a --volumes -f  # Limpieza agresiva
```

---

## ⏱️ TABLA DE TIEMPOS

| Operación | Tiempo | Pasos |
|-----------|--------|-------|
| Diagnóstico | 2 min | 1 comando |
| Reinicio rápido | 90 seg | 1 comando |
| Reinicio completo | 15-20 min | 1 comando |
| Limpiar + reinicio | 20-25 min | 2 comandos |
| Test automático | 1-2 min | 1 comando |

---

## 📊 RESUMEN POR TIPO DE USUARIO

### "Soy desarrollador / DevOps"

1. Ejecuta: `.\Reiniciar_Proyecto_Completo.ps1 -Modo diagnostico`
2. Lee: `SOLUCIONES_OMEKA_DB.md` (secciones A-E)
3. Consulta: `COMO_USAR_REINICIAR.md` (sección de troubleshooting)

**Archivos técnicos adicionales:**
- `docker-compose.yml` - Configuración de servicios
- `Dockerfile` - Build del portal
- `nginx.conf` - Configuración de proxy

---

### "Soy operator / DevOps"

1. Aprende los 3 modos: `COMO_USAR_REINICIAR.md`
2. Guarda estos comandos:
   ```powershell
   # Daily check
   .\Test_Omeka_DB.ps1
   
   # If something is broken
   .\Reiniciar_Proyecto_Completo.ps1 -Modo diagnostico
   ```
3. Consulta tablas de decisión en `COMO_USAR_REINICIAR.md`

---

### "Tengo poco tiempo, solo quiero que funcione"

1. Ejecuta: `.\Reiniciar_Proyecto_Completo.ps1 -Modo completo`
2. Espera 15-20 minutos
3. Si falla: Ejecuta `.\Test_Omeka_DB.ps1` y ve qué test falló
4. Abre `SOLUCIONES_OMEKA_DB.md` y busca ese error

---

## 🎓 CONOCIMIENTOS RECOMENDADOS

### Nivel Básico (Para usar los scripts)
- [ ] Abrir PowerShell
- [ ] Navegar a carpetas (`cd`)
- [ ] Ejecutar comandos (`.\ script.ps1`)
- [ ] Leer mensajes de error

### Nivel Intermedio (Para troubleshooting)
- [ ] Entender qué es Docker
- [ ] Leer logs de servicios
- [ ] Conceptos de MySQL/BD
- [ ] Networking en Docker

### Nivel Avanzado (Para modificar configuración)
- [ ] Editar YAML (docker-compose.yml)
- [ ] Variables de entorno
- [ ] Healthchecks en Docker
- [ ] Performance tuning

---

## ✅ CHECKLIST FINAL

Cuando creas que está todo arreglado:

```powershell
# 1. Ejecuta tests automáticos
.\Test_Omeka_DB.ps1

# 2. Verifica acceso web
Start-Process "http://localhost:8081"  # Omeka
Start-Process "http://localhost:3000"  # Portal
Start-Process "http://localhost:1337"  # CMS

# 3. Revisa logs
docker-compose logs --tail=20 omeka
docker-compose logs --tail=20 omeka-db

# 4. Prueba conectividad MySQL
docker-compose exec -T omeka-db mysql -u omeka -pomeka_password omeka -e "SELECT VERSION();"
```

Si todo te da ✓, ¡está arreglado! 🎉

---

## 📞 REFERENCIAS RÁPIDAS

**Carpeta del proyecto:**
```
d:\Usuarios\DEVazquezC\Documents\ICAT\IIS\portalweb
```

**Carpeta de documentación:**
```
d:\Usuarios\DEVazquezC\Documents\ICAT\IIS\portalweb\docs
```

**Archivos de Docker:**
```
d:\Usuarios\DEVazquezC\Documents\ICAT\IIS\portalweb\docker-compose.yml
d:\Usuarios\DEVazquezC\Documents\ICAT\IIS\portalweb\Dockerfile
```

**Scripts disponibles:**
```
d:\Usuarios\DEVazquezC\Documents\ICAT\IIS\portalweb\Reiniciar_Proyecto_Completo.ps1
d:\Usuarios\DEVazquezC\Documents\ICAT\IIS\portalweb\Test_Omeka_DB.ps1
```

---

## 🔗 MAPA DE NAVEGACIÓN

```
ÍNDICE (Eres aquí)
│
├─→ Quiero reiniciar
│   └─→ COMO_USAR_REINICIAR.md
│
├─→ Me falla un servicio
│   └─→ SOLUCIONES_OMEKA_DB.md
│
├─→ Quiero hacer tests
│   └─→ ./Test_Omeka_DB.ps1
│
└─→ Quiero entender la arquitectura
    └─→ README.md / ARCHITECTURE.md
```

---

## 💾 HISTORIAL DE CAMBIOS

| Fecha | Cambio |
|-------|--------|
| 2024-01-XX | Creación de scripts y documentación |
| | Agregado SOLUCIONES_OMEKA_DB.md con 5 tipos de errores |
| | Creado Test_Omeka_DB.ps1 con 29 tests automáticos |
| | Documentación COMO_USAR_REINICIAR.md con 3 modos |

---

## 🆘 RÁPIDO: "¿Qué hago AHORA?"

### Paso 1: Abre PowerShell
```powershell
cd d:\Usuarios\DEVazquezC\Documents\ICAT\IIS\portalweb
```

### Paso 2: Ejecuta UNO de estos comandos

**Si quiero ver qué está mal:**
```powershell
.\Reiniciar_Proyecto_Completo.ps1 -Modo diagnostico
```

**Si quiero que funcione ahora:**
```powershell
.\Reiniciar_Proyecto_Completo.ps1 -Modo completo
```

**Si creo que ya está arreglado:**
```powershell
.\Test_Omeka_DB.ps1
```

### Paso 3: Lee el resultado

- **Si ves ✓:** ¡Listo! Vuelve al trabajo
- **Si ves ✗:** Abre `SOLUCIONES_OMEKA_DB.md` y busca ese error

---

**Última actualización:** 2024  
**Versión:** 1.0  
**Soporte:** Consulta los documentos anteriores o ejecuta los scripts automáticos
