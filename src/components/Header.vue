<template>
  <header class="header">
    <div class="header-top">
      <div class="container flex-between">
        <div class="logo">
          <router-link to="/">
            <img src="@/assets/images/logo.png" alt="IIS UNAM" class="logo-img">
          </router-link>
        </div>
        <div class="header-title">
          <h1>Instituto de Investigaciones Sociales</h1>
          <p class="subtitle">UNAM - Portal de Recursos Digitales</p>
        </div>
        <div class="search-box">
          <form @submit.prevent="handleSearch" class="search-form">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Buscar recursos..."
              class="search-input"
              aria-label="Buscar"
            >
            <button type="submit" class="search-btn" aria-label="Enviar búsqueda">
              <span class="search-icon">🔍</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useResourceStore } from '@/stores/resources'

const router = useRouter()
const resourceStore = useResourceStore()
const searchQuery = ref('')

const handleSearch = async () => {
  if (searchQuery.value.trim()) {
    await resourceStore.search(searchQuery.value)
    router.push(`/search?q=${encodeURIComponent(searchQuery.value)}`)
  }
}
</script>

<style scoped>
.header {
  background-color: white;
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-top {
  padding: var(--spacing-lg) 0;
}

.logo {
  flex-shrink: 0;
  width: 80px;
}

.logo-img {
  max-width: 100%;
  height: auto;
}

.header-title {
  flex: 1;
  text-align: center;
  padding: 0 var(--spacing-xl);
}

.header-title h1 {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
  color: var(--secondary-color);
  font-weight: 600;
}

.subtitle {
  font-size: 0.9rem;
  color: var(--primary-color);
  margin: 0;
}

.search-box {
  flex-shrink: 0;
  width: 250px;
}

.search-form {
  display: flex;
  gap: var(--spacing-sm);
}

.search-input {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  font-size: 0.95rem;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.search-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-btn:hover {
  background-color: var(--accent-color);
}

.search-icon {
  font-size: 1.2rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .header-top {
    padding: var(--spacing-md) 0;
  }

  .header-title h1 {
    font-size: 1.25rem;
  }

  .search-box {
    width: 200px;
  }

  .header-title {
    padding: 0 var(--spacing-md);
  }
}

@media (max-width: 768px) {
  .header-top {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .logo {
    width: 60px;
    align-self: flex-start;
  }

  .header-title {
    padding: 0;
    text-align: left;
  }

  .header-title h1 {
    font-size: 1.1rem;
    margin-bottom: 0.125rem;
  }

  .subtitle {
    font-size: 0.8rem;
  }

  .search-box {
    width: 100%;
  }
}
</style>
