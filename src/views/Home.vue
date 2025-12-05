<template>
  <div class="home">
    <!-- Banner principal -->
    <section class="hero-banner">
      <div class="hero-content">
        <h1 class="hero-title">Recursos Digitales</h1>
        <p class="hero-subtitle">Accede a nuestro acervo de investigaciones y contenidos del Instituto de Investigaciones Sociales</p>
        <router-link to="/resources" class="btn btn-primary mt-3">Explorar Recursos</router-link>
      </div>
    </section>

    <!-- Sección de categorías -->
    <section class="section categories-section">
      <div class="container">
        <h2 class="section-title">Categorías Principales</h2>
        <div class="grid grid-3">
          <div class="category-card" v-for="category in categories" :key="category.id">
            <div class="category-icon">{{ category.icon }}</div>
            <h3>{{ category.name }}</h3>
            <p>{{ category.description }}</p>
            <router-link :to="`/resources?category=${category.id}`" class="card-link">
              Explorar → 
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Últimos recursos -->
    <section class="section latest-resources">
      <div class="container">
        <h2 class="section-title">Recursos Recientes</h2>
        <div v-if="loading" class="loading-container">
          <div class="spinner"></div>
          <p>Cargando recursos...</p>
        </div>
        <div v-else-if="error" class="alert alert-error">
          {{ error }}
        </div>
        <div v-else class="grid grid-2">
          <div class="resource-card" v-for="resource in recentResources" :key="resource.id">
            <div class="resource-image">
              <img 
                :src="resource.image_url || '/placeholder.jpg'" 
                :alt="resource.title"
                @error="handleImageError"
              >
            </div>
            <div class="resource-info">
              <h3>{{ truncateText(resource.title, 60) }}</h3>
              <p class="text-muted">{{ truncateText(resource.description, 100) }}</p>
              <div class="resource-meta">
                <span class="meta-tag" v-if="resource.source">{{ resource.source }}</span>
                <span class="meta-date" v-if="resource.created">{{ formatDate(resource.created) }}</span>
              </div>
              <router-link :to="`/resource/${resource.id}`" class="btn btn-outline">
                Ver Detalles
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section cta-section">
      <div class="container text-center">
        <h2>¿No encontraste lo que buscas?</h2>
        <p>Utiliza nuestra búsqueda avanzada para encontrar recursos específicos</p>
        <router-link to="/search" class="btn btn-primary">Búsqueda Avanzada</router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useResourceStore } from '@/stores/resources'

const resourceStore = useResourceStore()
const loading = ref(false)
const error = ref(null)

const categories = [
  {
    id: 'articulos',
    name: 'Artículos',
    description: 'Artículos de investigación y análisis académico',
    icon: '📄'
  },
  {
    id: 'libros',
    name: 'Libros',
    description: 'Monografías y obras de referencia',
    icon: '📚'
  },
  {
    id: 'multimedia',
    name: 'Multimedia',
    description: 'Videos, imágenes y otros recursos multimedia',
    icon: '🎥'
  },
  {
    id: 'datos',
    name: 'Datos y Bases',
    description: 'Conjuntos de datos para investigación',
    icon: '📊'
  },
  {
    id: 'tesis',
    name: 'Tesis y Disertaciones',
    description: 'Trabajos académicos de postgrado',
    icon: '🎓'
  },
  {
    id: 'eventos',
    name: 'Eventos',
    description: 'Seminarios, conferencias y eventos académicos',
    icon: '🎤'
  }
]

const recentResources = computed(() => {
  return resourceStore.omekaResources.slice(0, 6)
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

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    await resourceStore.loadResources()
  } catch (err) {
    error.value = 'No se pudieron cargar los recursos. Por favor, intenta más tarde.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.home {
  width: 100%;
}

/* Hero Banner */
.hero-banner {
  background: linear-gradient(135deg, var(--secondary-color) 0%, rgba(28, 28, 28, 0.9) 100%);
  color: white;
  padding: 6rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(181,163,101,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)" /></svg>');
  opacity: 0.5;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: white;
}

.hero-subtitle {
  font-size: 1.3rem;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.9);
}

/* Categorías */
.categories-section {
  background-color: white;
}

.section-title {
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  padding-bottom: 1rem;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background-color: var(--primary-color);
}

.category-card {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  padding: var(--spacing-xl);
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-color);
}

.category-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
}

.category-card h3 {
  color: var(--secondary-color);
  margin-bottom: var(--spacing-sm);
}

.category-card p {
  color: var(--text-light);
  font-size: 0.95rem;
  margin-bottom: var(--spacing-md);
}

.card-link {
  color: var(--primary-color);
  font-weight: 600;
  transition: color 0.3s ease;
}

.card-link:hover {
  color: var(--accent-color);
}

/* Recursos */
.latest-resources {
  background-color: #fafafa;
}

.resource-card {
  background: white;
  border-radius: var(--radius);
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.resource-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}

.resource-image {
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
  transform: scale(1.05);
}

.resource-info {
  padding: var(--spacing-lg);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.resource-info h3 {
  font-size: 1.1rem;
  margin-bottom: var(--spacing-sm);
  color: var(--secondary-color);
}

.resource-meta {
  display: flex;
  gap: var(--spacing-sm);
  margin: var(--spacing-md) 0;
  flex-wrap: wrap;
  font-size: 0.85rem;
}

.meta-tag {
  background-color: var(--primary-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  text-transform: capitalize;
}

.meta-date {
  color: var(--text-light);
  font-style: italic;
}

.resource-info > .btn {
  margin-top: auto;
  width: 100%;
  text-align: center;
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, var(--primary-color) 0%, rgba(181, 163, 101, 0.8) 100%);
  color: white;
  text-align: center;
}

.cta-section h2 {
  color: white;
  font-size: 2rem;
  margin-bottom: var(--spacing-md);
}

.cta-section p {
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: var(--spacing-lg);
  font-size: 1.1rem;
}

.cta-section .btn {
  background-color: var(--secondary-color);
  color: white;
}

.cta-section .btn:hover {
  background-color: white;
  color: var(--primary-color);
}

/* Loading */
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
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .hero-banner {
    padding: 3rem 1rem;
  }

  .grid-3 {
    grid-template-columns: 1fr;
  }

  .grid-2 {
    grid-template-columns: 1fr;
  }

  .resource-image {
    height: 150px;
  }

  .cta-section h2 {
    font-size: 1.5rem;
  }
}
</style>
