import axios from 'axios'
import DOMPurify from 'dompurify'

// Configuración de variables de entorno
const OMEKA_API_URL = import.meta.env.VITE_OMEKA_API_URL || 'http://localhost:8081/api'
const CMS_API_URL = import.meta.env.VITE_CMS_API_URL || 'http://localhost:1337/api'
const API_TIMEOUT = 30000

console.log('🔧 API Configuration:', {
  OMEKA_API_URL,
  CMS_API_URL,
  API_TIMEOUT
})

// Crear instancias de axios con configuraciones separadas
const omekaClient = axios.create({
  baseURL: OMEKA_API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
})

const cmsClient = axios.create({
  baseURL: CMS_API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptores para manejo de errores y seguridad
omekaClient.interceptors.response.use(
  response => response,
  error => {
    console.error('Omeka API error:', error)
    return Promise.reject({
      message: 'Error al conectar con el repositorio de recursos',
      status: error.response?.status || 'unknown'
    })
  }
)

cmsClient.interceptors.response.use(
  response => response,
  error => {
    console.error('CMS API error:', error)
    return Promise.reject({
      message: 'Error al conectar con el CMS',
      status: error.response?.status || 'unknown'
    })
  }
)

// Función para sanitizar datos HTML
export const sanitizeHTML = (html) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    KEEP_CONTENT: true
  })
}

// Función para validar URLs
export const isValidUrl = (urlString) => {
  try {
    new URL(urlString)
    return true
  } catch (err) {
    return false
  }
}

// Funciones de API
export const fetchOmekaResources = async (params = {}) => {
  try {
    console.log('📡 Fetching Omeka resources from:', OMEKA_API_URL)
    const response = await omekaClient.get('/items', { params })
    console.log('✅ Omeka response received:', response.data)
    
    // Omeka puede devolver { value: [...], Count: N } o directamente [...]
    let items = response.data.value || response.data
    // Si no es array, convertir a array
    if (!Array.isArray(items)) {
      items = [items]
    }
    console.log('📦 Processing', items.length, 'items from Omeka')
    
    const sanitizedData = items.map(item => ({
      // ID y metadatos básicos de Omeka
      id: item['o:id'],
      title: item['dcterms:title']?.[0]?.['@value'] || 'Sin título',
      description: item['dcterms:description']?.[0]?.['@value'] || '',
      subject: item['dcterms:subject']?.[0]?.['@value'] || '',
      
      // Campos esperados por el componente (con valores por defecto)
      type: 'Recurso', // Omeka no proporciona tipo de manera estándar
      image_url: null, // Las imágenes en Omeka están en items relacionados
      author: item['dcterms:creator']?.[0]?.['@value'] || 'Autor desconocido',
      created: item['o:created']?.['@value'] || null,
      tags: item['dcterms:subject'] ? [item['dcterms:subject'][0]['@value']] : [],
      
      // Campo para identificar la fuente
      source: 'omeka'
    }))
    console.log('🎯 Sanitized data ready:', sanitizedData)
    return sanitizedData
  } catch (error) {
    console.error('❌ Error fetching Omeka resources:', error)
    throw error
  }
}

export const fetchOmekaResourceById = async (id) => {
  try {
    if (!id || typeof id !== 'string') {
      throw new Error('ID de recurso inválido')
    }
    const response = await omekaClient.get(`/items/${id}`)
    const item = response.data
    return {
      // ID y metadatos básicos de Omeka
      id: item['o:id'],
      title: item['dcterms:title']?.[0]?.['@value'] || 'Sin título',
      description: item['dcterms:description']?.[0]?.['@value'] || '',
      subject: item['dcterms:subject']?.[0]?.['@value'] || '',
      
      // Campos esperados por el componente
      type: 'Recurso',
      image_url: null,
      author: item['dcterms:creator']?.[0]?.['@value'] || 'Autor desconocido',
      created: item['o:created']?.['@value'] || null,
      tags: item['dcterms:subject'] ? [item['dcterms:subject'][0]['@value']] : [],
      
      source: 'omeka'
    }
  } catch (error) {
    throw error
  }
}

export const fetchCMSContent = async (params = {}) => {
  try {
    const response = await cmsClient.get('/content', { params })
    const items = response.data.data || response.data
    const sanitizedData = (Array.isArray(items) ? items : []).map(item => ({
      id: item.id,
      title: item.title || '',
      body: item.body || '',
      source: 'cms'
    }))
    return sanitizedData
  } catch (error) {
    console.warn('CMS API no disponible:', error.message)
    return []
  }
}

export const fetchCMSContentById = async (id) => {
  try {
    if (!id || typeof id !== 'string') {
      throw new Error('ID de contenido inválido')
    }
    const response = await cmsClient.get(`/content/${id}`)
    const item = response.data.data || response.data
    return {
      id: item.id,
      title: item.title || '',
      body: item.body || '',
      source: 'cms'
    }
  } catch (error) {
    throw error
  }
}

export const searchResources = async (query, source = 'all') => {
  try {
    // Validar entrada
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      throw new Error('Término de búsqueda inválido')
    }

    const searchQuery = query.trim().substring(0, 100) // Limitar longitud

    let results = []

    if (source === 'omeka' || source === 'all') {
      try {
        const omekaResults = await omekaClient.get('/items', {
          params: { search: searchQuery }
        })
        let items = omekaResults.data.value || omekaResults.data
        // Si no es array, convertir a array
        if (!Array.isArray(items)) {
          items = [items]
        }
        results = results.concat(items.map(item => ({
          id: item['o:id'],
          title: item['dcterms:title']?.[0]?.['@value'] || 'Sin título',
          description: item['dcterms:description']?.[0]?.['@value'] || '',
          subject: item['dcterms:subject']?.[0]?.['@value'] || '',
          type: 'Recurso',
          image_url: null,
          author: item['dcterms:creator']?.[0]?.['@value'] || 'Autor desconocido',
          created: item['o:created']?.['@value'] || null,
          tags: item['dcterms:subject'] ? [item['dcterms:subject'][0]['@value']] : [],
          source: 'omeka'
        })))
      } catch (err) {
        console.error('Omeka search error:', err)
      }
    }

    if (source === 'cms' || source === 'all') {
      try {
        const cmsResults = await cmsClient.get('/search', {
          params: { query: searchQuery }
        })
        const items = cmsResults.data.data || cmsResults.data
        results = results.concat((Array.isArray(items) ? items : []).map(item => ({
          id: item.id,
          title: item.title || '',
          body: item.body || '',
          source: 'cms'
        })))
      } catch (err) {
        console.error('CMS search error:', err)
      }
    }

    return results
  } catch (error) {
    throw error
  }
}

export default {
  fetchOmekaResources,
  fetchOmekaResourceById,
  fetchCMSContent,
  fetchCMSContentById,
  searchResources,
  sanitizeHTML,
  isValidUrl
}
