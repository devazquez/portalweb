<template>
  <div class="not-found">
    <div class="container">
      <div class="not-found-content">
        <div class="error-code">404</div>
        <h1>Página No Encontrada</h1>
        <p class="error-message">
          Lo sentimos, la página que buscas no existe o ha sido trasladada.
        </p>
        
        <div class="suggestions">
          <h2>¿Qué puedes hacer?</h2>
          <ul>
            <li><router-link to="/">Volver a la página de inicio</router-link></li>
            <li><router-link to="/resources">Explorar recursos</router-link></li>
            <li><router-link to="/search">Usar búsqueda avanzada</router-link></li>
            <li><router-link to="/about">Conocer más sobre el portal</router-link></li>
          </ul>
        </div>

        <div class="cta">
          <router-link to="/" class="btn btn-primary">
            Ir a Inicio
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.not-found {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl) 0;
  background: linear-gradient(135deg, #f5f5f5 0%, #fff 100%);
}

.not-found-content {
  text-align: center;
  max-width: 600px;
}

.error-code {
  font-size: 10rem;
  font-weight: 700;
  color: var(--primary-color);
  opacity: 0.1;
  margin-bottom: 0;
  line-height: 1;
}

.not-found-content h1 {
  font-size: 2.5rem;
  margin-top: -2rem;
  margin-bottom: var(--spacing-lg);
  color: var(--secondary-color);
}

.error-message {
  font-size: 1.2rem;
  color: var(--text-light);
  margin-bottom: var(--spacing-2xl);
  line-height: 1.6;
}

.suggestions {
  background: white;
  padding: var(--spacing-xl);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  margin-bottom: var(--spacing-xl);
  text-align: left;
}

.suggestions h2 {
  text-align: center;
  margin-bottom: var(--spacing-lg);
  color: var(--secondary-color);
}

.suggestions ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.suggestions li {
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--border-color);
}

.suggestions li:last-child {
  border-bottom: none;
}

.suggestions a {
  color: var(--primary-color);
  font-weight: 600;
  font-size: 1.05rem;
  text-decoration: none;
  transition: color 0.3s ease;
  display: inline-block;
}

.suggestions a:hover {
  color: var(--accent-color);
}

.cta {
  margin-top: var(--spacing-xl);
}

.btn {
  padding: var(--spacing-md) var(--spacing-2xl);
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .error-code {
    font-size: 6rem;
  }

  .not-found-content h1 {
    font-size: 1.75rem;
    margin-top: -1rem;
  }

  .error-message {
    font-size: 1rem;
  }

  .suggestions {
    padding: var(--spacing-lg);
  }

  .suggestions a {
    font-size: 1rem;
  }
}
</style>
