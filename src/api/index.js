import axios from 'axios'
import DOMPurify from 'dompurify'

// Configuración de variables de entorno
const OMEKA_API_URL = import.meta.env.VITE_OMEKA_API_URL || 'http://localhost:8081/api'
const CMS_API_URL = import.meta.env.VITE_CMS_API_URL || 'http://localhost:8082/api'
const API_TIMEOUT = 30000

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
    const response = await omekaClient.get('/items', { params })
    // Sanitizar datos recibidos
    const sanitizedData = response.data.map(item => ({
      ...item,
      title: sanitizeHTML(item.title || ''),
      description: sanitizeHTML(item.description || '')
    }))
    return sanitizedData
  } catch (error) {
    throw error
  }
}

export const fetchOmekaResourceById = async (id) => {
  try {
    if (!id || typeof id !== 'string') {
      throw new Error('ID de recurso inválido')
    }
    const response = await omekaClient.get(`/items/${id}`)
    return {
      ...response.data,
      title: sanitizeHTML(response.data.title || ''),
      description: sanitizeHTML(response.data.description || '')
    }
  } catch (error) {
    throw error
  }
}

export const fetchCMSContent = async (params = {}) => {
  try {
    const response = await cmsClient.get('/content', { params })
    const sanitizedData = response.data.map(item => ({
      ...item,
      title: sanitizeHTML(item.title || ''),
      body: sanitizeHTML(item.body || '')
    }))
    return sanitizedData
  } catch (error) {
    throw error
  }
}

export const fetchCMSContentById = async (id) => {
  try {
    if (!id || typeof id !== 'string') {
      throw new Error('ID de contenido inválido')
    }
    const response = await cmsClient.get(`/content/${id}`)
    return {
      ...response.data,
      title: sanitizeHTML(response.data.title || ''),
      body: sanitizeHTML(response.data.body || '')
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
        results = results.concat(omekaResults.data.map(item => ({
          ...item,
          source: 'omeka',
          title: sanitizeHTML(item.title || '')
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
        results = results.concat(cmsResults.data.map(item => ({
          ...item,
          source: 'cms',
          title: sanitizeHTML(item.title || '')
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
