<template>
  <nav class="navigation">
    <div class="container">
      <ul class="nav-list">
        <li class="nav-item">
          <router-link 
            to="/" 
            class="nav-link"
            :class="{ active: $route.path === '/' }"
          >
            Inicio
          </router-link>
        </li>
        <li class="nav-item">
          <router-link 
            to="/resources" 
            class="nav-link"
            :class="{ active: $route.path === '/resources' }"
          >
            Recursos
          </router-link>
        </li>
        <li class="nav-item">
          <router-link 
            to="/search" 
            class="nav-link"
            :class="{ active: $route.path === '/search' }"
          >
            Búsqueda Avanzada
          </router-link>
        </li>
        <li class="nav-item">
          <router-link 
            to="/about" 
            class="nav-link"
            :class="{ active: $route.path === '/about' }"
          >
            Acerca de
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style scoped>
.navigation {
  background-color: var(--secondary-color);
  border-bottom: 2px solid var(--primary-color);
}

.nav-list {
  list-style: none;
  display: flex;
  gap: 0;
  margin: 0;
  padding: 0;
}

.nav-item {
  flex: 1;
}

.nav-link {
  display: block;
  padding: var(--spacing-md) var(--spacing-lg);
  color: var(--primary-color);
  font-size: 14px;
  font-weight: 300;
  text-align: center;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
  line-height: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-link:hover,
.nav-link.active {
  background-color: rgba(181, 163, 101, 0.1);
  border-bottom-color: var(--primary-color);
  color: var(--accent-color);
}

/* Responsive */
@media (max-width: 768px) {
  .nav-list {
    flex-direction: column;
  }

  .nav-link {
    padding: var(--spacing-sm) var(--spacing-md);
    line-height: normal;
    height: auto;
  }

  .nav-item {
    border-bottom: 1px solid rgba(181, 163, 101, 0.2);
  }

  .nav-item:last-child {
    border-bottom: none;
  }
}

@media (max-width: 480px) {
  .nav-link {
    font-size: 0.9rem;
    padding: var(--spacing-sm) var(--spacing-sm);
  }
}
</style>
