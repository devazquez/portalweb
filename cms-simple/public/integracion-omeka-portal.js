// ============================================================================
// INTEGRACIÓN CON OMEKA S Y PORTAL WEB
// ============================================================================

const OMEKA_CONFIG = {
    baseUrl: 'http://localhost:8081/api',
    endpoints: {
        items: '/items',
        search: '/items?search=',
        itemSets: '/item_sets'
    }
};

const PORTAL_CONFIG = {
    baseUrl: 'http://localhost:3000',
    endpoints: {
        articles: '/api/articles',
        books: '/api/books',
        multimedia: '/api/multimedia'
    }
};

// ============================================================================
// FUNCIONES DE INTEGRACIÓN OMEKA S
// ============================================================================

async function buscarEnOmeka(termino) {
    try {
        const url = `${OMEKA_CONFIG.baseUrl}${OMEKA_CONFIG.endpoints.search}${encodeURIComponent(termino)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const resultados = await response.json();
        return resultados;
    } catch (error) {
        console.error('❌ Error buscando en Omeka S:', error);
        return [];
    }
}

async function obtenerItemsOmeka() {
    try {
        const url = `${OMEKA_CONFIG.baseUrl}${OMEKA_CONFIG.endpoints.items}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const items = await response.json();
        return Array.isArray(items) ? items : (items.data || []);
    } catch (error) {
        console.error('❌ Error obteniendo items de Omeka S:', error);
        return [];
    }
}

// ============================================================================
// FUNCIONES DE INTEGRACIÓN PORTAL WEB
// ============================================================================

async function sincronizarConPortal(contenido, tipo = 'articulos') {
    try {
        const url = `${PORTAL_CONFIG.baseUrl}${PORTAL_CONFIG.endpoints[tipo]}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...contenido,
                fuente: 'cms',
                sincronizado: new Date().toISOString()
            })
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('❌ Error sincronizando con Portal:', error);
        return null;
    }
}

async function obtenerContenidoPortal(tipo = 'articulos') {
    try {
        const url = `${PORTAL_CONFIG.baseUrl}${PORTAL_CONFIG.endpoints[tipo]}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const contenido = await response.json();
        return Array.isArray(contenido) ? contenido : (contenido.data || []);
    } catch (error) {
        console.error('❌ Error obteniendo contenido del Portal:', error);
        return [];
    }
}

// ============================================================================
// FUNCIONES DE BÚSQUEDA UNIFICADA
// ============================================================================

async function buscarEnTodos(termino) {
    console.log(`🔍 Buscando "${termino}" en todos los sistemas...`);
    
    const resultados = {
        cms: [],
        omeka: [],
        portal: []
    };

    try {
        // Búsqueda en CMS
        const resCMS = await fetch(`/api/search?query=${encodeURIComponent(termino)}`);
        if (resCMS.ok) {
            resultados.cms = await resCMS.json();
        }

        // Búsqueda en Omeka S
        const resOmeka = await buscarEnOmeka(termino);
        resultados.omeka = resOmeka;

        console.log('✅ Búsqueda completada');
        return resultados;
    } catch (error) {
        console.error('❌ Error en búsqueda unificada:', error);
        return resultados;
    }
}

async function filtrarPorFuente(resultados, fuentes = ['cms', 'omeka', 'portal']) {
    const filtrados = {};
    fuentes.forEach(fuente => {
        if (resultados[fuente]) {
            filtrados[fuente] = resultados[fuente];
        }
    });
    return filtrados;
}

// ============================================================================
// FUNCIONES DE METADATOS
// ============================================================================

async function obtenerMetadatos(itemId, fuente = 'cms') {
    try {
        let url;
        if (fuente === 'omeka') {
            url = `${OMEKA_CONFIG.baseUrl}${OMEKA_CONFIG.endpoints.items}/${itemId}`;
        } else {
            url = `/api/articulos/${itemId}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`❌ Error obteniendo metadatos (${fuente}):`, error);
        return null;
    }
}

// ============================================================================
// FUNCIONES DE CACHÉ
// ============================================================================

class CacheIntegracion {
    constructor(ttl = 300000) { // 5 minutos por defecto
        this.cache = new Map();
        this.ttl = ttl;
    }

    set(key, value) {
        this.cache.set(key, {
            value,
            timestamp: Date.now()
        });
    }

    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;
        
        if (Date.now() - item.timestamp > this.ttl) {
            this.cache.delete(key);
            return null;
        }
        
        return item.value;
    }

    limpiar() {
        this.cache.clear();
    }
}

const cacheIntegracion = new CacheIntegracion();

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        OMEKA_CONFIG,
        PORTAL_CONFIG,
        buscarEnOmeka,
        obtenerItemsOmeka,
        sincronizarConPortal,
        obtenerContenidoPortal,
        buscarEnTodos,
        filtrarPorFuente,
        obtenerMetadatos,
        CacheIntegracion,
        cacheIntegracion
    };
}
