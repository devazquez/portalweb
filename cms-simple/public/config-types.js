// ============================================================================
// CONFIGURACIÓN DE TIPOS DE CONTENIDO
// ============================================================================

const CONTENT_TYPES = {
    articulos: {
        name: 'Artículos',
        icon: '📝',
        fields: ['titulo', 'descripcion', 'cuerpo', 'autor', 'categoria'],
        maxSize: 5000 // caracteres
    },
    libros: {
        name: 'Libros',
        icon: '📚',
        fields: ['titulo', 'autor', 'isbn', 'resumen', 'contenido', 'anio'],
        maxSize: 50000 // caracteres
    },
    multimedia: {
        name: 'Multimedia',
        icon: '🎬',
        fields: ['titulo', 'descripcion', 'tipo', 'url', 'duracion', 'tags'],
        maxSize: 1000 // caracteres para descripción
    },
    recursos: {
        name: 'Recursos',
        icon: '📋',
        fields: ['titulo', 'descripcion', 'tipo_recurso', 'url', 'categoria'],
        maxSize: 2000 // caracteres
    }
};

const MAX_FILE_SIZES = {
    imagen: 5 * 1024 * 1024,      // 5 MB
    video: 100 * 1024 * 1024,    // 100 MB
    pdf: 50 * 1024 * 1024,       // 50 MB
    documento: 10 * 1024 * 1024  // 10 MB
};

// ============================================================================
// FUNCIONES DE CONFIGURACIÓN
// ============================================================================

function obtenerTiposContenido() {
    return Object.keys(CONTENT_TYPES);
}

function obtenerConfiguracionTipo(tipo) {
    return CONTENT_TYPES[tipo] || CONTENT_TYPES.articulos;
}

function validarTamanoArchivo(archivo, tipo) {
    const maxSize = MAX_FILE_SIZES[tipo] || 10 * 1024 * 1024;
    return archivo.size <= maxSize;
}

function formatearTamanoArchivo(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const tamaños = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + tamaños[i];
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CONTENT_TYPES,
        MAX_FILE_SIZES,
        obtenerTiposContenido,
        obtenerConfiguracionTipo,
        validarTamanoArchivo,
        formatearTamanoArchivo
    };
}
