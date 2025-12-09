<template>
  <div class="search-page">
    <div class="container">
      <div class="search-header mb-5">
        <h1>Búsqueda Avanzada</h1>
        <p class="text-muted">Encuentra recursos específicos usando nuestras opciones de búsqueda avanzada</p>
      </div>

      <div class="search-form-section">
        <form @submit.prevent="performSearch" class="advanced-search">
          <div class="grid grid-2">
            <div class="form-group">
              <label for="query">Término de búsqueda</label>
              <input 
                id="query"
                v-model="searchQuery"
                type="text"
                placeholder="Ej: sostenibilidad, educación, etc."
                class="search-input"
              >
            </div>
            <div class="form-group">
              <label for="source">Buscar en:</label>
              <select v-model="searchSource" id="source" class="search-input">
                <option value="all">Todos los recursos</option>
                <option value="omeka">Repositorio Omeka-S</option>
                <option value="cms">Contenido CMS</option>
              </select>
            </div>
          </div>
          
          <div class="grid grid-3">
            <div class="form-group">
              <label for="type">Tipo de recurso</label>
              <select v-model="filters.type" id="type" class="search-input">
                <option value="">Todos los tipos</option>
                <option value="articulo">Artículos</option>
                <option value="libro">Libros</option>
                <option value="multimedia">Multimedia</option>
                <option value="datos">Datos</option>
              </select>
            </div>
            <div class="form-group">
              <label for="language">Idioma</label>
              <select v-model="filters.language" id="language" class="search-input">
                <option value="">Todos los idiomas</option>
                <option value="es">Español</option>
                <option value="en">Inglés</option>
                <option value="fr">Francés</option>
              </select>
            </div>
            <div class="form-group">
              <label for="year">Año de publicación</label>
              <select v-model="filters.year" id="year" class="search-input">
                <option value="">Cualquier año</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="older">Anterior a 2021</option>
              </select>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="!searchQuery.trim()">
              Buscar
            </button>
            <button type="button" @click="resetSearch" class="btn btn-outline">
              Limpiar Búsqueda
            </button>
          </div>
        </form>
      </div>

      <!-- Resultados -->
      <div class="search-results" v-if="hasSearched">
        <div v-if="loading" class="loading-container">
          <div class="spinner"></div>
          <p>Buscando recursos...</p>
        </div>
        <div v-else-if="error" class="alert alert-error">
          {{ error }}
        </div>
        <div v-else>
          <h2 class="results-title">
            Resultados para "{{ searchQuery }}"
            <span class="results-count">({{ results.length }} recursos encontrados)</span>
          </h2>
          
          <div v-if="results.length === 0" class="no-results">
            <p>No se encontraron recursos para tu búsqueda.</p>
            <p class="text-muted">Intenta con términos diferentes o ajusta los filtros.</p>
          </div>

          <div v-else class="results-list">
            <article 
              class="result-item" 
              v-for="(result, index) in results" 
              :key="`${result.id}-${result.source}-${index}`"
            >
              <div class="result-header">
                <h3>{{ truncateText(result.title, 100) }}</h3>
                <span class="source-badge">{{ result.source }}</span>
              </div>
              <p class="result-snippet">{{ truncateText(result.description, 200) }}</p>
              <div class="result-meta">
                <span v-if="result.author" class="meta-item">👤 {{ result.author }}</span>
                <span v-if="result.created" class="meta-item">📅 {{ formatDate(result.created) }}</span>
              </div>
              <router-link 
                :to="{
                  path: `/resource/${result.id}`,
                  query: result.source ? { source: result.source } : {}
                }" 
                class="result-link"
              >
                Ver recurso completo →
              </router-link>
            </article>
          </div>
        </div>
      </div>

      <!-- Búsquedas populares (antes de buscar) -->
      <div v-if="!hasSearched" class="popular-searches">
        <h2>Búsquedas Populares</h2>
        <div class="popular-tags">
          <button 
            v-for="term in popularSearchTerms" 
            :key="term"
            @click="searchQuery = term; performSearch()"
            class="popular-tag"
          >
            {{ term }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useResourceStore } from '@/stores/resources'

const resourceStore = useResourceStore()
const searchQuery = ref('')
const searchSource = ref('all')
const filters = ref({
  type: '',
  language: '',
  year: ''
})
const loading = ref(false)
const error = ref(null)
const hasSearched = ref(false)
const results = ref([])

const popularSearchTerms = [
  'Sostenibilidad',
  'Educación',
  'Desigualdad social',
  'Política pública',
  'Desarrollo económico',
  'Género',
  'Medio ambiente',
  'Derechos humanos'
]

const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const performSearch = async () => {
  if (!searchQuery.value.trim()) return
  
  loading.value = true
  error.value = null
  hasSearched.value = true
  
  try {
    await resourceStore.search(searchQuery.value, searchSource.value)
    results.value = resourceStore.omekaResources
    
    // Aplicar filtros adicionales localmente
    if (filters.value.type) {
      results.value = results.value.filter(r => r.type === filters.value.type)
    }
  } catch (err) {
    error.value = 'Error al buscar recursos. Por favor intenta de nuevo.'
    results.value = []
  } finally {
    loading.value = false
  }
}

const resetSearch = () => {
  searchQuery.value = ''
  searchSource.value = 'all'
  filters.value = { type: '', language: '', year: '' }
  results.value = []
  hasSearched.value = false
  error.value = null
}
</script>

<style scoped>
.search-page {
  min-height: 80vh;
  padding: var(--spacing-2xl) 0;
}

.search-header {
  text-align: center;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: var(--spacing-xl);
}

.search-header h1 {
  font-size: 2.5rem;
  margin-bottom: var(--spacing-sm);
}

.search-form-section {
  background: white;
  border-radius: var(--radius);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-2xl);
  box-shadow: var(--shadow);
}

.advanced-search {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.form-actions {
  display: flex;
  gap: var(--spacing-md);
}

.form-actions .btn {
  flex: 1;
}

.search-results {
  margin-bottom: var(--spacing-2xl);
}

.results-title {
  margin-bottom: var(--spacing-lg);
  color: var(--secondary-color);
}

.results-count {
  color: var(--text-light);
  font-size: 0.9rem;
  font-weight: 400;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.result-item {
  background: white;
  border-left: 4px solid var(--primary-color);
  padding: var(--spacing-lg);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
}

.result-item:hover {
  transform: translateX(5px);
  box-shadow: var(--shadow-lg);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}

.result-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--secondary-color);
}

.source-badge {
  background-color: var(--primary-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  text-transform: capitalize;
}

.result-snippet {
  color: var(--text-light);
  margin-bottom: var(--spacing-md);
  line-height: 1.6;
}

.result-meta {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  font-size: 0.9rem;
  color: var(--text-light);
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.result-link {
  color: var(--primary-color);
  font-weight: 600;
  transition: color 0.3s ease;
}

.result-link:hover {
  color: var(--accent-color);
}

.no-results {
  text-align: center;
  padding: var(--spacing-2xl) var(--spacing-lg);
  background: white;
  border-radius: var(--radius);
  border: 1px dashed var(--border-color);
}

.no-results p {
  margin-bottom: var(--spacing-sm);
}

.popular-searches {
  text-align: center;
}

.popular-searches h2 {
  margin-bottom: var(--spacing-xl);
}

.popular-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  justify-content: center;
}

.popular-tag {
  padding: var(--spacing-sm) var(--spacing-lg);
  background-color: white;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  color: var(--text-dark);
}

.popular-tag:hover {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: var(--spacing-lg);
}

/* Responsive */
@media (max-width: 768px) {
  .search-header h1 {
    font-size: 1.75rem;
  }

  .grid-2, .grid-3 {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .result-header {
    flex-direction: column;
  }

  .result-meta {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
