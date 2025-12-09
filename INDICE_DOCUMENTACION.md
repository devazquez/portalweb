# 📚 ÍNDICE DE DOCUMENTACIÓN TÉCNICA

## Portal Web del Instituto de Investigaciones Sociales - UNAM

**Proyecto Completado | Versión 1.0 | Diciembre 2025**

---

## 📋 DOCUMENTOS DISPONIBLES

### 1. **DOCUMENTACION_TECNICA.docx** ⭐ PRINCIPAL
**Formato:** Microsoft Word (.docx)  
**Páginas:** ~35-40  
**Contenido:**
- Introducción general del proyecto
- Arquitectura completa del sistema
- Stack tecnológico detallado
- Componentes principales
- Requisitos hardware y software
- Guía de instalación (Windows, macOS, Linux)
- Configuración y despliegue
- API Reference completa
- Estructura del código
- Troubleshooting y mantenimiento

**Ideal para:** Presentaciones, impresión, entrega a stakeholders

---

### 2. **DOCUMENTACION_TECNICA.md**
**Formato:** Markdown (.md)  
**Páginas Equivalentes:** 40+  
**Contenido:** Idéntico a .docx

**Ideal para:** Lectura en navegador, integración en wiki

---

### 3. **GUIA_RAPIDA.md** ⚡ PARA DESARROLLADORES
**Formato:** Markdown (.md)  
**Páginas Equivalentes:** 10-12  
**Contenido:**
- Instalación rápida en 5 pasos
- Operaciones comunes
- Comandos útiles (referencia rápida)
- Troubleshooting práctico
- Backup y restauración
- Endpoints de API
- Checklists

**Ideal para:** Developers, DevOps, operaciones diarias

---

### 4. **ESPECIFICACION_TECNICA.md** 🔧 ESPECIFICACIONES
**Formato:** Markdown (.md)  
**Páginas Equivalentes:** 12-15  
**Contenido:**
- Resumen ejecutivo
- Arquitectura técnica
- Pila tecnológica
- Flujo de datos
- Especificación de APIs
- Estructura de directorios
- Ciclo de vida
- Requerimientos de recursos
- Estándares y mejores prácticas
- Matriz de decisiones técnicas

**Ideal para:** Arquitectos, líderes técnicos, auditorías

---

### 5. **README.md** 📖 ENTRADA PRINCIPAL
**Ubicación:** Raíz del proyecto  
**Contenido:**
- Descripción general
- Características principales
- Requisitos previos
- Links a documentación detallada

**Ideal para:** Primer contacto con el proyecto

---

### 6. **CMS_SIMPLE.md** 📝 CMS ESPECÍFICO
**Contenido:**
- Descripción del CMS
- Endpoints REST
- Estructura de datos JSON
- Ejemplos de uso

---

## 🎯 MATRIZ DE USO

| Usuario | Documento Principal | Documento Secundario |
|---------|-------------------|----------------------|
| **Administrador** | DOCUMENTACION_TECNICA.docx | GUIA_RAPIDA.md |
| **Developer** | GUIA_RAPIDA.md | ESPECIFICACION_TECNICA.md |
| **DevOps/Ops** | GUIA_RAPIDA.md | ESPECIFICACION_TECNICA.md |
| **Arquitecto** | ESPECIFICACION_TECNICA.md | DOCUMENTACION_TECNICA.md |
| **Stakeholder** | DOCUMENTACION_TECNICA.docx | README.md |
| **Investigador (Usuario Final)** | README.md | - |

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
portalweb/
├── 📄 DOCUMENTACION_TECNICA.docx      ⭐ MAIN (40 págs)
├── 📄 DOCUMENTACION_TECNICA.md        (Markdown version)
├── 📄 GUIA_RAPIDA.md                  (Instalación rápida)
├── 📄 ESPECIFICACION_TECNICA.md       (Specs)
├── 📄 README.md                       (Intro)
├── 📄 CMS_SIMPLE.md                   (CMS details)
└── 📁 docs/
    ├── API.md                          (API endpoints)
    ├── INSTALLATION.md                 (Detailed setup)
    └── TROUBLESHOOTING.md              (Common issues)
```

---

## 🚀 CÓMO EMPEZAR

### Para Instalación Rápida
1. Leer: **GUIA_RAPIDA.md** (5 minutos)
2. Ejecutar pasos 1-5
3. ¡Listo! Acceder a http://localhost:3000

### Para Entender la Arquitectura
1. Leer: **README.md** (2 minutos)
2. Leer: **ESPECIFICACION_TECNICA.md** (15 minutos)
3. Revisar: Diagramas en DOCUMENTACION_TECNICA.docx

### Para Desarrollo
1. Consultar: **GUIA_RAPIDA.md** (operaciones comunes)
2. Revisar: **ESPECIFICACION_TECNICA.md** (APIs)
3. Revisar: **CMS_SIMPLE.md** (si trabaja con CMS)

### Para Presentación Oficial
1. Usar: **DOCUMENTACION_TECNICA.docx** (presentable)
2. Incluir: Capturas de pantallas (opcional)
3. Imprimir o digitalizar

---

## 📊 COBERTURA DE TEMAS

| Tema | TECNICA | GUIA | ESPECIF | README |
|------|---------|------|---------|--------|
| Instalación | ✅ | ✅ | - | ✅ |
| APIs | ✅ | ✅ | ✅ | - |
| Arquitectura | ✅ | - | ✅ | - |
| Troubleshooting | ✅ | ✅ | - | - |
| Despliegue | ✅ | ✅ | ✅ | - |
| Operaciones | ✅ | ✅ | - | - |
| Comandos | - | ✅ | - | - |
| Stack Tech | ✅ | - | ✅ | - |

---

## 💡 RECOMENDACIONES DE LECTURA

### Por Rol

**👨‍💼 Project Manager**
```
1. README.md (5 min)
2. DOCUMENTACION_TECNICA.docx (20 min)
3. Sección: "Características Principales"
```

**👨‍💻 Frontend Developer**
```
1. README.md (5 min)
2. ESPECIFICACION_TECNICA.md (15 min)
3. Sección: "Estructura de Directorios"
4. GUIA_RAPIDA.md (siempre disponible)
```

**🔧 Backend Developer**
```
1. ESPECIFICACION_TECNICA.md (20 min)
2. Secciones: "APIs", "Base de Datos"
3. CMS_SIMPLE.md (si trabaja con CMS)
4. GUIA_RAPIDA.md (referencia)
```

**🚀 DevOps Engineer**
```
1. GUIA_RAPIDA.md (10 min)
2. Sección: "Operaciones Comunes"
3. ESPECIFICACION_TECNICA.md (Monitoreo)
4. docker-compose.yml (archivo)
```

**🏗️ Solutions Architect**
```
1. ESPECIFICACION_TECNICA.md (30 min)
2. Sección: "Decisiones Técnicas"
3. DOCUMENTACION_TECNICA.docx (diagramas)
4. Reunión con equipo
```

---

## 🔍 BÚSQUEDA RÁPIDA DE TEMAS

### Instalación
- **GUIA_RAPIDA.md** → Sección 3
- **DOCUMENTACION_TECNICA.docx** → Sección 7

### APIs
- **ESPECIFICACION_TECNICA.md** → Sección V
- **DOCUMENTACION_TECNICA.docx** → Sección 9

### Troubleshooting
- **GUIA_RAPIDA.md** → Sección 9
- **DOCUMENTACION_TECNICA.docx** → Sección 11

### Despliegue
- **GUIA_RAPIDA.md** → Sección 11
- **DOCUMENTACION_TECNICA.docx** → Sección 8

### Comandos Docker
- **GUIA_RAPIDA.md** → Sección 12
- **ESPECIFICACION_TECNICA.md** → Logging

---

## 📝 INFORMACIÓN DE CONTACTO

**Equipo de Desarrollo:** IIS-Dev@unam.mx  
**Institución:** Instituto de Investigaciones Sociales, UNAM  
**Licencia:** MIT  
**Repositorio:** https://github.com/tu-usuario/portalweb  

---

## ✅ CHECKLIST DE DOCUMENTACIÓN

- [x] Documentación técnica completa (40 págs)
- [x] Guía rápida de instalación
- [x] Especificación técnica
- [x] README.md
- [x] CMS_SIMPLE.md
- [x] APIs documentadas
- [x] Comandos referencia rápida
- [x] Troubleshooting guide
- [x] Estructura del código
- [x] Diagramas de arquitectura
- [x] Ejemplos de uso
- [x] Matriz de decisiones

---

## 🎓 PRÓXIMOS PASOS

1. **Lectura:** Empezar con el documento apropiado según tu rol
2. **Instalación:** Seguir GUIA_RAPIDA.md
3. **Exploración:** Revisar código en src/
4. **Desarrollo:** Usar ESPECIFICACION_TECNICA.md como referencia
5. **Despliegue:** Consultar DOCUMENTACION_TECNICA.docx Sección 8

---

**Última Actualización:** Diciembre 2025  
**Versión:** 1.0  
**Estado:** ✅ Completo
