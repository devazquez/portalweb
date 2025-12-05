# Guía de Testing y Mejores Prácticas

## Testing Unitario

### Instalación de Dependencias de Test

```powershell
npm install --save-dev vitest @vue/test-utils happy-dom
```

### Ejemplo de Test para Componente

```javascript
// components/__tests__/Header.spec.js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Header from '../Header.vue'

describe('Header Component', () => {
  it('renders header title', () => {
    const wrapper = mount(Header)
    expect(wrapper.find('h1').exists()).toBe(true)
  })

  it('has search input', () => {
    const wrapper = mount(Header)
    expect(wrapper.find('.search-input').exists()).toBe(true)
  })

  it('emits search event on form submit', async () => {
    const wrapper = mount(Header)
    const input = wrapper.find('.search-input')
    await input.setValue('test query')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('search')).toBeTruthy()
  })
})
```

### Ejecutar Tests

```powershell
# Todos los tests
npm run test

# Con cobertura
npm run test:coverage

# Modo watch
npm run test:watch
```

## Testing de API

### Ejemplo con Axios Mock

```javascript
// api/__tests__/index.spec.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { fetchOmekaResources } from '../index'

vi.mock('axios')

describe('API Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch Omeka resources successfully', async () => {
    const mockData = [
      { id: 1, title: 'Resource 1' },
      { id: 2, title: 'Resource 2' }
    ]

    axios.get.mockResolvedValueOnce({ data: mockData })

    const result = await fetchOmekaResources()
    expect(result).toEqual(mockData)
    expect(axios.get).toHaveBeenCalledWith('/items', expect.any(Object))
  })

  it('should handle API errors gracefully', async () => {
    const error = new Error('Network Error')
    axios.get.mockRejectedValueOnce(error)

    await expect(fetchOmekaResources()).rejects.toThrow()
  })
})
```

## Mejores Prácticas de Código

### 1. Componentes Vue

```vue
<template>
  <!-- 1. Template limpio y semántico -->
  <article class="resource-card">
    <!-- 2. Usar v-if en lugar de v-show para renderizado condicional -->
    <div v-if="resource" class="content">
      <!-- 3. Usar keys en listas -->
      <div v-for="item in items" :key="item.id">{{ item.name }}</div>
    </div>
    <!-- 4. Usar aria-labels para accesibilidad -->
    <button aria-label="Compartir recurso" @click="share">Compartir</button>
  </article>
</template>

<script setup>
// 1. Usar composition API setup syntax
import { ref, computed, onMounted } from 'vue'

// 2. Agrupar lógica relacionada
const resource = ref(null)
const isLoading = ref(false)
const error = ref(null)

// 3. Usar computed para datos derivados
const resourceTitle = computed(() => resource.value?.title || 'Sin título')

// 4. Usar async/await en lugar de .then()
const loadResource = async () => {
  isLoading.value = true
  try {
    // lógica de carga
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

// 5. Limpiar en onUnmounted
onMounted(() => {
  loadResource()
})
</script>

<style scoped>
/* 1. Usar variables CSS */
.resource-card {
  background-color: var(--primary-color);
  padding: var(--spacing-lg);
}

/* 2. Nesting lógico */
.resource-card:hover {
  transform: translateY(-2px);
}

/* 3. Mobile-first */
@media (max-width: 768px) {
  .resource-card {
    padding: var(--spacing-md);
  }
}
</style>
```

### 2. Gestión de Estado (Pinia)

```javascript
// stores/resources.js - BUENAS PRÁCTICAS

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useResourceStore = defineStore('resources', () => {
  // 1. Estado privado (usando ref)
  const _resources = ref([])
  const _loading = ref(false)
  const _error = ref(null)

  // 2. Computed para estado derivado
  const resources = computed(() => _resources.value)
  const isLoading = computed(() => _loading.value)
  const hasError = computed(() => _error.value !== null)

  // 3. Acciones con manejo de errores
  const loadResources = async () => {
    _loading.value = true
    _error.value = null
    try {
      const data = await api.fetchResources()
      _resources.value = data
    } catch (err) {
      _error.value = err.message
      console.error('Error loading resources:', err)
    } finally {
      _loading.value = false
    }
  }

  // 4. Resetear state cuando sea necesario
  const reset = () => {
    _resources.value = []
    _loading.value = false
    _error.value = null
  }

  return {
    resources,
    isLoading,
    hasError,
    loadResources,
    reset
  }
})
```

### 3. Servicios API

```javascript
// api/index.js - BUENAS PRÁCTICAS

import axios from 'axios'
import DOMPurify from 'dompurify'

// 1. Crear instancias separadas para cada API
const omekaClient = axios.create({
  baseURL: import.meta.env.VITE_OMEKA_API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
})

// 2. Interceptores para manejo consistente
omekaClient.interceptors.response.use(
  response => response,
  error => {
    // Log centralizado de errores
    console.error('API Error:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url
    })
    return Promise.reject(error)
  }
)

// 3. Validación de entrada
const validateInput = (input, rules) => {
  if (!input || typeof input !== 'string') {
    throw new Error('Input must be a non-empty string')
  }
  if (input.length > rules.maxLength) {
    throw new Error(`Input exceeds max length of ${rules.maxLength}`)
  }
  return true
}

// 4. Sanitización de salida
const sanitizeOutput = (data) => {
  if (typeof data === 'string') {
    return DOMPurify.sanitize(data)
  }
  if (Array.isArray(data)) {
    return data.map(item => sanitizeOutput(item))
  }
  if (typeof data === 'object') {
    return Object.entries(data).reduce((acc, [key, value]) => {
      acc[key] = sanitizeOutput(value)
      return acc
    }, {})
  }
  return data
}

// 5. Usar async/await con try/catch
export const fetchResources = async (query = '') => {
  try {
    validateInput(query, { maxLength: 100 })
    const response = await omekaClient.get('/items', {
      params: { search: query, limit: 50 }
    })
    return sanitizeOutput(response.data)
  } catch (error) {
    throw new Error(`Failed to fetch resources: ${error.message}`)
  }
}
```

## Linting y Formato de Código

### Instalación

```powershell
npm install --save-dev eslint eslint-plugin-vue prettier
```

### Configuración ESLint (.eslintrc.js)

```javascript
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
  }
}
```

### Ejecutar Linting

```powershell
# Verificar
npm run lint

# Corregir automáticamente
npm run lint -- --fix
```

## Performance

### Auditar Performance

```javascript
// Usar Performance API
console.time('fetch-resources')
const data = await fetchResources()
console.timeEnd('fetch-resources')

// Chrome DevTools
// F12 → Performance tab → Record y analizar
```

### Optimizaciones Comunes

```vue
<script setup>
import { lazy } from 'vue'

// 1. Lazy loading de componentes pesados
const HeavyChart = lazy(() => import('./HeavyChart.vue'))

// 2. Memoización para funciones costosas
import { computed } from 'vue'
const expensiveComputation = computed(() => {
  // solo recalcula si sus dependencias cambian
})

// 3. Virtual scrolling para listas grandes
// Usar vue-virtual-scroller para listas > 100 items
</script>

<style>
/* 1. Evitar !important */
/* 2. Evitar selectores muy específicos */
/* 3. Usar CSS Grid/Flex en lugar de float */
</style>
```

## Seguridad

### OWASP Top 10

```javascript
// 1. Input Validation
if (!isValidEmail(email)) {
  throw new Error('Invalid email')
}

// 2. Output Encoding
const sanitized = DOMPurify.sanitize(userContent)

// 3. SQL Injection Prevention (Backend)
// Usar prepared statements, nunca concatenar strings

// 4. CSRF Protection (Backend)
// Usar CSRF tokens en formularios

// 5. XSS Prevention
// Usar v-text en lugar de v-html cuando sea posible
<div v-text="userContent"></div>

// 6. Secure Headers (configurar en servidor)
// Strict-Transport-Security, CSP, X-Frame-Options, etc.
```

## Documentación de Código

```javascript
/**
 * Busca recursos por término
 * @param {string} query - Término de búsqueda (máx 100 caracteres)
 * @param {string} [source='all'] - Fuente: 'omeka', 'cms', o 'all'
 * @returns {Promise<Array>} Array de recursos encontrados
 * @throws {Error} Si el término de búsqueda es inválido
 * 
 * @example
 * const results = await searchResources('desigualdad')
 * console.log(results.length) // Número de resultados
 */
export async function searchResources(query, source = 'all') {
  // Implementación
}
```

## Convenciones de Commits

```
Format: <type>(<scope>): <subject>

Types:
- feat: Nueva característica
- fix: Corrección de bug
- docs: Cambios en documentación
- style: Cambios de formato (no afectan funcionalidad)
- refactor: Refactorización de código
- test: Agregar o modificar tests
- chore: Cambios en configuración

Ejemplo:
feat(search): agregar filtros avanzados
fix(api): corregir error en sanitización
docs: actualizar guía de instalación
```

## Checklist de Calidad

Antes de hacer commit:

- [ ] Código pasa linting
- [ ] Tests unitarios pasan
- [ ] No hay errores en consola
- [ ] Componentes se ven bien en móvil
- [ ] Variables de entorno sensibles no están commiteadas
- [ ] Código comentado está removido
- [ ] Performance es aceptable (< 3s de carga)

---

**Última actualización:** Diciembre 2024
