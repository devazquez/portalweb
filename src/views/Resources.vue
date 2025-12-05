<template>
  <div class="resources">
    <div class="container">
      <div class="resources-header mb-5">
        <h1>Recursos Digitales</h1>
        <p class="text-muted">Explora nuestro acervo completo de investigaciones y contenidos</p>
      </div>

      <div class="resources-layout">
        <!-- Sidebar de filtros -->
        <aside class="filters-sidebar">
          <div class="filter-group">
            <h3>Filtrar por:</h3>
            
            <div class="filter-section">
              <h4>Tipo de Recurso</h4>
              <label class="checkbox">
                <input type="checkbox" v-model="filters.type" value="articulo">
                <span>Artículos</span>
              </label>
              <label class="checkbox">
                <input type="checkbox" v-model="filters.type" value="libro">
                <span>Libros</span>
              </label>
              <label class="checkbox">
                <input type="checkbox" v-model="filters.type" value="multimedia">
                <span>Multimedia</span>
              </label>
              <label class="checkbox">
                <input type="checkbox" v-model="filters.type" value="datos">
                <span>Datos</span>
              </label>
            </div>

            <div class="filter-section">
              <h4>Ordenar por:</h4>
              <select v-model="sortBy" class="sort-select">
                <option value="recent">Más recientes</option>
                <option value="title">Título (A-Z)</option>
                <option value="popular">Más populares</option>
              </select>
            </div>

            <button @click="clearAllFilters" class="btn btn-outline w-100">
              Limpiar filtros
            </button>
          </div>
        </aside>

        <!-- Grid de recursos -->
        <main class="resources-grid">
          <div v-if="loading" class="loading-container">
            <div class="spinner"></div>
            <p>Cargando recursos...</p>
          </div>
          <div v-else-if="error" class="alert alert-error">
            {{ error }}
          </div>
          <div v-else-if="filteredAndSortedResources.length === 0" class="no-results">
            <p>No se encontraron recursos que coincidan con los filtros aplicados.</p>
            <button @click="clearAllFilters" class="btn btn-secondary mt-3">
              Limpiar filtros e intentar de nuevo
            </button>
          </div>
          <div v-else class="grid grid-2">
            <article 
              class="resource-card" 
              v-for="resource in filteredAndSortedResources" 
              :key="resource.id"
            >
              <div class="resource-image">
                <img 
                  :src="resource.image_url || '/placeholder.jpg'" 
                  :alt="resource.title"
                  @error="handleImageError"
                >
                <span class="resource-badge">{{ resource.type || 'Recurso' }}</span>
              </div>
              <div class="resource-content">
                <h3>{{ truncateText(resource.title, 80) }}</h3>
                <p class="resource-description">{{ truncateText(resource.description, 120) }}</p>
                
                <div class="resource-meta">
                  <span class="meta-item" v-if="resource.author">
                    👤 {{ resource.author }}
                  </span>
                  <span class="meta-item" v-if="resource.created">
                    📅 {{ formatDate(resource.created) }}
                  </span>
                </div>

                <div class="resource-tags" v-if="resource.tags">
                  <span class="tag" v-for="tag in resource.tags.slice(0, 3)" :key="tag">
                    #{{ tag }}
                  </span>
                </div>

                <router-link 
                  :to="`/resource/${resource.id}`" 
                  class="btn btn-primary w-100"
                >
                  Ver Recurso Completo
                </router-link>
              </div>
            </article>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useResourceStore } from '@/stores/resources'

const resourceStore = useResourceStore()
const loading = ref(false)
const error = ref(null)
const filters = ref({ type: [] })
const sortBy = ref('recent')

const filteredAndSortedResources = computed(() => {
  let results = resourceStore.filteredResources

  // Ordenar
  if (sortBy.value === 'title') {
    results = [...results].sort((a, b) => 
      (a.title || '').localeCompare(b.title || '')
    )
  } else if (sortBy.value === 'popular') {
    results = [...results].sort((a, b) => 
      (b.view_count || 0) - (a.view_count || 0)
    )
  }

  return results
})

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

const handleImageError = (event) => {
  event.target.src = '/placeholder.jpg'
}

const clearAllFilters = () => {
  filters.value = { type: [] }
  sortBy.value = 'recent'
  resourceStore.clearFilters()
}

onMounted(async () => {
  if (resourceStore.omekaResources.length === 0) {
    loading.value = true
    error.value = null
    try {
      await resourceStore.loadResources()
    } catch (err) {
      error.value = 'No se pudieron cargar los recursos. Por favor, intenta más tarde.'
    } finally {
      loading.value = false
    }
  }
})
</script>

<style scoped>
.resources {
  min-height: 80vh;
  padding: var(--spacing-2xl) 0;
}

.resources-header {
  text-align: center;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: var(--spacing-xl);
}

.resources-header h1 {
  font-size: 2.5rem;
  margin-bottom: var(--spacing-sm);
}

.resources-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: var(--spacing-xl);
}

.filters-sidebar {
  position: sticky;
  top: 150px;
  height: fit-content;
}

.filter-group {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  padding: var(--spacing-lg);
}

.filter-group h3 {
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
}

.filter-section {
  margin-bottom: var(--spacing-lg);
}

.filter-section h4 {
  font-size: 0.95rem;
  margin-bottom: var(--spacing-sm);
  color: var(--text-dark);
}

.checkbox {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-sm);
  cursor: pointer;
}

.checkbox input[type="checkbox"] {
  width: auto;
  margin-right: var(--spacing-sm);
  cursor: pointer;
}

.checkbox span {
  cursor: pointer;
  user-select: none;
}

.sort-select {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  font-family: var(--font-sans);
}

.w-100 {
  width: 100%;
}

.resources-grid {
  min-height: 500px;
}

.resource-card {
  background: white;
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.resource-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.resource-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background-color: var(--border-color);
}

.resource-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.resource-card:hover .resource-image img {
  transform: scale(1.1);
}

.resource-badge {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  background-color: var(--primary-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
}

.resource-content {
  padding: var(--spacing-lg);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.resource-content h3 {
  font-size: 1.1rem;
  margin-bottom: var(--spacing-sm);
  color: var(--secondary-color);
}

.resource-description {
  color: var(--text-light);
  font-size: 0.95rem;
  margin-bottom: var(--spacing-md);
  flex: 1;
}

.resource-meta {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
  font-size: 0.9rem;
  color: var(--text-light);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.resource-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
}

.tag {
  display: inline-block;
  background-color: #f0f0f0;
  color: var(--text-dark);
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  font-size: 0.85rem;
  color: var(--primary-color);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: var(--spacing-lg);
}

.no-results {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: var(--radius);
  border: 1px solid var(--border-color);
}

.no-results p {
  font-size: 1.1rem;
  color: var(--text-light);
}

/* Responsive */
@media (max-width: 1024px) {
  .resources-layout {
    grid-template-columns: 200px 1fr;
    gap: var(--spacing-lg);
  }

  .filters-sidebar {
    top: 120px;
  }
}

@media (max-width: 768px) {
  .resources-layout {
    grid-template-columns: 1fr;
  }

  .filters-sidebar {
    position: static;
    order: 2;
  }

  .resources-grid {
    order: 1;
  }

  .resources-header h1 {
    font-size: 1.75rem;
  }

  .grid-2 {
    grid-template-columns: 1fr;
  }
}
</style>
