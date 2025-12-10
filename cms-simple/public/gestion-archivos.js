// ============================================================================
// GESTIÓN DE CARGA DE ARCHIVOS
// ============================================================================

const UPLOAD_CONFIG = {
    maxFileSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'video/mp4', 'application/msword'],
    uploadEndpoint: '/api/upload'
};

const FILE_TYPES = {
    image: {
        extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
        mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        maxSize: 5 * 1024 * 1024, // 5MB
        icon: '🖼️'
    },
    pdf: {
        extensions: ['.pdf'],
        mimeTypes: ['application/pdf'],
        maxSize: 50 * 1024 * 1024, // 50MB
        icon: '📄'
    },
    video: {
        extensions: ['.mp4', '.webm', '.avi', '.mov'],
        mimeTypes: ['video/mp4', 'video/webm', 'video/x-msvideo', 'video/quicktime'],
        maxSize: 100 * 1024 * 1024, // 100MB
        icon: '🎬'
    },
    document: {
        extensions: ['.doc', '.docx', '.txt', '.odt'],
        mimeTypes: ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'application/vnd.oasis.opendocument.text'],
        maxSize: 10 * 1024 * 1024, // 10MB
        icon: '📋'
    },
    audio: {
        extensions: ['.mp3', '.wav', '.ogg', '.flac'],
        mimeTypes: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac'],
        maxSize: 20 * 1024 * 1024, // 20MB
        icon: '🎵'
    }
};

// ============================================================================
// VALIDACIÓN DE ARCHIVOS
// ============================================================================

function obtenerTipoArchivo(archivo) {
    const extension = archivo.name.toLowerCase().split('.').pop();
    for (const [tipo, config] of Object.entries(FILE_TYPES)) {
        if (config.extensions.includes(`.${extension}`)) {
            return tipo;
        }
    }
    return null;
}

function validarArchivo(archivo) {
    const tipoArchivo = obtenerTipoArchivo(archivo);
    
    if (!tipoArchivo) {
        return {
            valido: false,
            error: `Tipo de archivo no permitido: ${archivo.name}`
        };
    }
    
    const config = FILE_TYPES[tipoArchivo];
    
    if (archivo.size > config.maxSize) {
        return {
            valido: false,
            error: `El archivo excede el tamaño máximo de ${formatearTamano(config.maxSize)}`
        };
    }
    
    return { valido: true, tipoArchivo };
}

function formatearTamano(bytes) {
    const unidades = ['B', 'KB', 'MB', 'GB'];
    let tamanio = bytes;
    let indice = 0;
    
    while (tamanio >= 1024 && indice < unidades.length - 1) {
        tamanio /= 1024;
        indice++;
    }
    
    return `${tamanio.toFixed(2)} ${unidades[indice]}`;
}

// ============================================================================
// CARGA DE ARCHIVOS
// ============================================================================

class GestorCarga {
    constructor() {
        this.cargasActivas = new Map();
        this.historial = [];
    }

    async cargarArchivo(archivo, opciones = {}) {
        const id = Date.now().toString();
        
        // Validar archivo
        const validacion = validarArchivo(archivo);
        if (!validacion.valido) {
            console.error(`❌ ${validacion.error}`);
            return { 
                exito: false, 
                error: validacion.error,
                id 
            };
        }

        // Crear FormData
        const formData = new FormData();
        formData.append('archivo', archivo);
        formData.append('tipo', validacion.tipoArchivo);
        if (opciones.descripcion) {
            formData.append('descripcion', opciones.descripcion);
        }
        if (opciones.metadatos) {
            formData.append('metadatos', JSON.stringify(opciones.metadatos));
        }

        try {
            this.cargasActivas.set(id, {
                archivo: archivo.name,
                progreso: 0,
                estado: 'cargando',
                tipo: validacion.tipoArchivo
            });

            const response = await fetch(UPLOAD_CONFIG.uploadEndpoint, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const resultado = await response.json();
            
            this.cargasActivas.set(id, {
                ...this.cargasActivas.get(id),
                progreso: 100,
                estado: 'completado',
                url: resultado.url
            });

            this.historial.push({
                id,
                archivo: archivo.name,
                tipo: validacion.tipoArchivo,
                tamanio: archivo.size,
                timestamp: new Date().toISOString(),
                url: resultado.url
            });

            console.log(`✅ Archivo cargado: ${archivo.name}`);
            return { 
                exito: true, 
                url: resultado.url,
                id,
                ...resultado
            };

        } catch (error) {
            console.error(`❌ Error cargando archivo:`, error);
            
            this.cargasActivas.set(id, {
                ...this.cargasActivas.get(id),
                estado: 'error',
                error: error.message
            });

            return { 
                exito: false, 
                error: error.message,
                id 
            };
        }
    }

    async cargarMultiples(archivos, opciones = {}) {
        const promesas = Array.from(archivos).map(archivo => 
            this.cargarArchivo(archivo, opciones)
        );
        return Promise.all(promesas);
    }

    obtenerEstado(id) {
        return this.cargasActivas.get(id) || null;
    }

    obtenerHistorial() {
        return this.historial;
    }

    limpiarHistorial() {
        this.historial = [];
    }
}

// ============================================================================
// UTILIDADES DE VISTA PREVIA
// ============================================================================

function generarVistaPrevia(archivo) {
    const tipo = obtenerTipoArchivo(archivo);
    
    if (!tipo) {
        return null;
    }

    const lector = new FileReader();
    const promesa = new Promise((resolver) => {
        lector.onload = (e) => {
            let vista = '';
            const config = FILE_TYPES[tipo];

            switch (tipo) {
                case 'image':
                    vista = `<img src="${e.target.result}" alt="${archivo.name}" style="max-width: 200px; max-height: 200px;">`;
                    break;
                case 'video':
                    vista = `<video width="200" height="150" controls><source src="${e.target.result}" type="${archivo.type}"></video>`;
                    break;
                case 'pdf':
                    vista = `<div class="preview-pdf">${config.icon} PDF: ${archivo.name}</div>`;
                    break;
                default:
                    vista = `<div class="preview-file">${config.icon} ${archivo.name}</div>`;
            }

            resolver({
                html: vista,
                tipo,
                nombre: archivo.name,
                tamanio: formatearTamano(archivo.size)
            });
        };

        lector.onerror = () => {
            resolver(null);
        };

        if (tipo === 'image') {
            lector.readAsDataURL(archivo);
        } else if (tipo === 'video') {
            lector.readAsDataURL(archivo);
        } else {
            resolver({
                html: `<div class="preview-file">${FILE_TYPES[tipo].icon} ${archivo.name}</div>`,
                tipo,
                nombre: archivo.name,
                tamanio: formatearTamano(archivo.size)
            });
        }
    });

    return promesa;
}

// ============================================================================
// INTERFAZ DE ZONA DE ARRASTRE
// ============================================================================

class ZonaArrastre {
    constructor(elemento, callback) {
        this.elemento = elemento;
        this.callback = callback;
        this.inicializar();
    }

    inicializar() {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evento => {
            this.elemento.addEventListener(evento, (e) => this.manejarEvento(e));
        });
    }

    manejarEvento(e) {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === 'dragenter' || e.type === 'dragover') {
            this.elemento.classList.add('arrastrable-activo');
        } else if (e.type === 'dragleave') {
            this.elemento.classList.remove('arrastrable-activo');
        } else if (e.type === 'drop') {
            this.elemento.classList.remove('arrastrable-activo');
            const archivos = e.dataTransfer.files;
            if (this.callback) {
                this.callback(archivos);
            }
        }
    }
}

// Instancia global del gestor de carga
const gestorCarga = new GestorCarga();

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        UPLOAD_CONFIG,
        FILE_TYPES,
        obtenerTipoArchivo,
        validarArchivo,
        formatearTamano,
        GestorCarga,
        gestorCarga,
        generarVistaPrevia,
        ZonaArrastre
    };
}
