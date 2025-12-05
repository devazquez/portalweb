<template>
  <div class="resource-detail">
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Cargando recurso...</p>
    </div>
    
    <div v-else-if="error" class="container mt-5">
      <div class="alert alert-error">
        {{ error }}
      </div>
      <router-link to="/resources" class="btn btn-secondary mt-3">
        ← Volver a Recursos
      </router-link>
    </div>

    <div v-else-if="resource" class="resource-detail-content">
      <!-- Breadcrumb -->
      <div class="breadcrumb-section">
        <div class="container">
          <nav class="breadcrumb">
            <router-link to="/">Inicio</router-link>
            <span>/</span>
            <router-link to="/resources">Recursos</router-link>
            <span>/</span>
            <span>{{ truncateText(resource.title, 40) }}</span>
          </nav>
        </div>
      </div>

      <!-- Header del recurso -->
      <section class="resource-header">
        <div class="container">
          <div class="resource-hero">
            <div class="resource-hero-image">
              <img 
                :src="resource.image_url || '/placeholder.jpg'" 
                :alt="resource.title"
                @error="handleImageError"
              >
            </div>
            <div class="resource-hero-content">
              <div class="resource-badge">{{ resource.type || 'Recurso' }}</div>
              <h1>{{ resource.title }}</h1>
              
              <div class="resource-metadata">
                <div class="metadata-item" v-if="resource.author">
                  <span class="metadata-label">Autor:</span>
                  <span class="metadata-value">{{ resource.author }}</span>
                </div>
                <div class="metadata-item" v-if="resource.created">
                  <span class="metadata-label">Fecha:</span>
                  <span class="metadata-value">{{ formatDate(resource.created) }}</span>
                </div>
                <div class="metadata-item" v-if="resource.language">
                  <span class="metadata-label">Idioma:</span>
                  <span class="metadata-value">{{ resource.language }}</span>
                </div>
                <div class="metadata-item" v-if="resource.source">
                  <span class="metadata-label">Fuente:</span>
                  <span class="metadata-value">{{ resource.source }}</span>
                </div>
              </div>

              <div class="resource-actions">
                <a :href="resource.url" v-if="resource.url" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                  🔗 Ver Recurso Original
                </a>
                <button @click="downloadResource" class="btn btn-secondary">
                  ⬇️ Descargar
                </button>
                <button @click="shareResource" class="btn btn-outline">
                  📤 Compartir
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Contenido principal -->
      <section class="resource-main">
        <div class="container">
          <div class="resource-layout">
            <!-- Contenido principal -->
            <main class="resource-body">
              <div class="description-section">
                <h2>Descripción</h2>
                <div class="description-content" v-html="sanitizedDescription"></div>
              </div>

              <div class="content-section" v-if="resource.content">
                <h2>Contenido</h2>
                <div class="content-display" v-html="sanitizedContent"></div>
              </div>

              <div class="keywords-section" v-if="resource.tags && resource.tags.length > 0">
                <h2>Palabras Clave</h2>
                <div class="keywords-list">
                  <span class="keyword" v-for="tag in resource.tags" :key="tag">
                    #{{ tag }}
                  </span>
                </div>
              </div>

              <!-- Recursos relacionados -->
              <div class="related-resources" v-if="relatedResources.length > 0">
                <h2>Recursos Relacionados</h2>
                <div class="related-grid">
                  <div 
                    class="related-card" 
                    v-for="related in relatedResources.slice(0, 3)" 
                    :key="related.id"
                  >
                    <div class="related-image">
                      <img :src="related.image_url || '/placeholder.jpg'" :alt="related.title">
                    </div>
                    <h4>{{ truncateText(related.title, 50) }}</h4>
                    <router-link :to="`/resource/${related.id}`" class="related-link">
                      Ver más →
                    </router-link>
                  </div>
                </div>
              </div>
            </main>

            <!-- Sidebar -->
            <aside class="resource-sidebar">
              <!-- Información de licencia -->
              <div class="sidebar-box" v-if="resource.license">
                <h3>Licencia</h3>
                <p>{{ resource.license }}</p>
              </div>

              <!-- Información de acceso -->
              <div class="sidebar-box">
                <h3>Acceso</h3>
                <p>{{ resource.public ? '🔓 Acceso Público' : '🔒 Acceso Restringido' }}</p>
              </div>

              <!-- Estadísticas -->
              <div class="sidebar-box">
                <h3>Información</h3>
                <div class="stats">
                  <div class="stat-item">
                    <span class="stat-number">{{ resource.view_count || 0 }}</span>
                    <span class="stat-label">Vistas</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-number">{{ resource.download_count || 0 }}</span>
                    <span class="stat-label">Descargas</span>
                  </div>
                </div>
              </div>

              <!-- Cita -->
              <div class="sidebar-box">
                <h3>Citar este Recurso</h3>
                <textarea readonly class="citation-box">{{ citationText }}</textarea>
                <button @click="copyCitation" class="btn btn-small mt-2">
                  Copiar Cita
                </button>
              </div>

              <!-- Navegación -->
              <div class="sidebar-box navigation-box">
                <router-link to="/resources" class="btn btn-secondary w-100">
                  ← Volver a Recursos
                </router-link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useResourceStore } from '@/stores/resources'
import { fetchOmekaResourceById, sanitizeHTML } from '@/api'

const route = useRoute()
const resourceStore = useResourceStore()
const resource = ref(null)
const loading = ref(true)
const error = ref(null)

const sanitizedDescription = computed(() => {
  return sanitizeHTML(resource.value?.description || '')
})

const sanitizedContent = computed(() => {
  return sanitizeHTML(resource.value?.content || '')
})

const relatedResources = computed(() => {
  return resourceStore.omekaResources.filter(r => 
    r.id !== resource.value?.id &&
    (r.tags?.some(t => resource.value?.tags?.includes(t)) || false)
  )
})

const citationText = computed(() => {
  if (!resource.value) return ''
  return `${resource.value.author || 'Autor'} (${new Date(resource.value.created).getFullYear()}). "${resource.value.title}". Instituto de Investigaciones Sociales, UNAM.`
})

const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const handleImageError = (event) => {
  event.target.src = '/placeholder.jpg'
}

const downloadResource = () => {
  if (resource.value?.download_url) {
    window.open(resource.value.download_url, '_blank')
  }
}

const shareResource = () => {
  const url = window.location.href
  const title = resource.value?.title || 'Recurso'
  
  if (navigator.share) {
    navigator.share({
      title: title,
      url: url
    })
  } else {
    // Fallback: copiar al portapapeles
    navigator.clipboard.writeText(url)
    alert('Enlace copiado al portapapeles')
  }
}

const copyCitation = () => {
  navigator.clipboard.writeText(citationText.value)
  alert('Cita copiada al portapapeles')
}

onMounted(async () => {
  loading.value = true
  error.value = null
  
  try {
    const id = route.params.id
    resource.value = await fetchOmekaResourceById(id)
  } catch (err) {
    error.value = 'No se pudo cargar el recurso. Por favor intenta más tarde.'
    console.error('Error loading resource:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.resource-detail {
  min-height: 80vh;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
  gap: var(--spacing-lg);
}

/* Breadcrumb */
.breadcrumb-section {
  background-color: #f9f9f9;
  padding: var(--spacing-lg) 0;
  border-bottom: 1px solid var(--border-color);
}

.breadcrumb {
  display: flex;
  gap: var(--spacing-sm);
  font-size: 0.9rem;
  color: var(--text-light);
}

.breadcrumb a {
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.3s ease;
}

.breadcrumb a:hover {
  color: var(--accent-color);
}

.breadcrumb span {
  color: var(--border-color);
}

/* Resource Header */
.resource-header {
  background: white;
  padding: var(--spacing-2xl) 0;
  border-bottom: 1px solid var(--border-color);
}

.resource-hero {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: var(--spacing-2xl);
  align-items: start;
}

.resource-hero-image {
  width: 100%;
  aspect-ratio: 3/4;
  overflow: hidden;
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
}

.resource-hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.resource-hero-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.resource-badge {
  display: inline-block;
  width: fit-content;
  background-color: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: capitalize;
}

.resource-hero-content h1 {
  font-size: 2.2rem;
  margin: 0;
}

.resource-metadata {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background-color: #f9f9f9;
  border-radius: var(--radius);
}

.metadata-item {
  display: flex;
  flex-direction: column;
}

.metadata-label {
  font-weight: 600;
  color: var(--text-dark);
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.metadata-value {
  color: var(--text-light);
}

.resource-actions {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.resource-actions .btn {
  flex: 1;
  min-width: 150px;
}

/* Resource Main */
.resource-main {
  padding: var(--spacing-2xl) 0;
}

.resource-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: var(--spacing-2xl);
}

.resource-body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
}

.description-section,
.content-section,
.keywords-section,
.related-resources {
  background: white;
  padding: var(--spacing-xl);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.description-section h2,
.content-section h2,
.keywords-section h2,
.related-resources h2 {
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.description-content,
.content-display {
  line-height: 1.8;
  color: var(--text-dark);
}

.description-content :deep(p),
.content-display :deep(p) {
  margin-bottom: var(--spacing-md);
}

.keywords-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.keyword {
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
}

.related-card {
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
}

.related-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}

.related-image {
  width: 100%;
  height: 150px;
  overflow: hidden;
  background-color: var(--border-color);
}

.related-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.related-card h4 {
  padding: var(--spacing-md) var(--spacing-md) 0 var(--spacing-md);
  font-size: 1rem;
  margin: 0;
}

.related-link {
  display: block;
  padding: var(--spacing-sm) var(--spacing-md) var(--spacing-md) var(--spacing-md);
  color: var(--primary-color);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
}

.related-link:hover {
  color: var(--accent-color);
}

/* Sidebar */
.resource-sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  position: sticky;
  top: 150px;
}

.sidebar-box {
  background: white;
  padding: var(--spacing-lg);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.sidebar-box h3 {
  border-bottom: 1px solid var(--border-color);
  padding-bottom: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  color: var(--secondary-color);
  font-size: 1rem;
}

.sidebar-box p {
  margin: 0;
  color: var(--text-dark);
}

.stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.stat-item {
  text-align: center;
  padding: var(--spacing-sm);
  background-color: var(--light-bg);
  border-radius: var(--radius);
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
}

.stat-label {
  display: block;
  font-size: 0.85rem;
  color: var(--text-light);
}

.citation-box {
  width: 100%;
  height: 100px;
  padding: var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  resize: none;
}

.navigation-box {
  padding: 0;
}

.navigation-box .btn {
  width: 100%;
  text-align: center;
}

/* Responsive */
@media (max-width: 1024px) {
  .resource-hero {
    grid-template-columns: 1fr;
  }

  .resource-layout {
    grid-template-columns: 1fr;
  }

  .resource-sidebar {
    position: static;
  }

  .related-grid {
    grid-template-columns: 1fr;
  }

  .resource-metadata {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .resource-hero-image {
    display: none;
  }

  .resource-hero-content h1 {
    font-size: 1.75rem;
  }

  .resource-actions {
    flex-direction: column;
  }

  .resource-actions .btn {
    width: 100%;
  }

  .breadcrumb {
    flex-wrap: wrap;
  }
}
</style>
