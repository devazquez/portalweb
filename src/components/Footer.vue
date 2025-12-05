<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content grid grid-3">
        <div class="footer-section">
          <h4>Instituto de Investigaciones Sociales</h4>
          <p>UNAM - Universidad Nacional Autónoma de México</p>
          <p class="contact-info">
            📧 <a href="mailto:info@iis.unam.mx">info@iis.unam.mx</a>
          </p>
        </div>
        <div class="footer-section">
          <h4>Enlaces Útiles</h4>
          <ul class="footer-links">
            <li><a href="#recursos">Recursos Digitales</a></li>
            <li><a href="#busqueda">Búsqueda Avanzada</a></li>
            <li><a href="#politica">Política de Privacidad</a></li>
            <li><a href="#terminos">Términos de Uso</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Redes Sociales</h4>
          <div class="social-links">
            <a href="#" class="social-link" title="Facebook">f</a>
            <a href="#" class="social-link" title="Twitter">𝕏</a>
            <a href="#" class="social-link" title="Instagram">📷</a>
            <a href="#" class="social-link" title="YouTube">▶</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 Instituto de Investigaciones Sociales, UNAM. Todos los derechos reservados.</p>
        <p class="footer-tech">Portal desarrollado con Vue.js 3</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  background-color: var(--secondary-color);
  color: white;
  padding: var(--spacing-2xl) 0 var(--spacing-lg) 0;
  margin-top: auto;
  border-top: 1px solid var(--border-color);
}

.footer-content {
  margin-bottom: var(--spacing-2xl);
}

.footer-section h4 {
  color: var(--primary-color);
  margin-bottom: var(--spacing-md);
  font-size: 1rem;
}

.footer-section p {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: var(--spacing-sm);
  font-size: 0.95rem;
}

.contact-info a {
  color: var(--primary-color);
  transition: color 0.3s ease;
}

.contact-info a:hover {
  color: var(--accent-color);
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: var(--spacing-sm);
}

.footer-links a {
  color: rgba(255, 255, 255, 0.8);
  transition: color 0.3s ease;
  font-size: 0.95rem;
}

.footer-links a:hover {
  color: var(--primary-color);
}

.social-links {
  display: flex;
  gap: var(--spacing-md);
}

.social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: rgba(181, 163, 101, 0.2);
  color: var(--primary-color);
  border-radius: 50%;
  transition: all 0.3s ease;
  font-size: 1.2rem;
}

.social-link:hover {
  background-color: var(--primary-color);
  color: var(--secondary-color);
  transform: translateY(-2px);
}

.footer-bottom {
  border-top: 1px solid rgba(181, 163, 101, 0.2);
  padding-top: var(--spacing-lg);
  text-align: center;
}

.footer-bottom p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin-bottom: var(--spacing-sm);
}

.footer-bottom p:last-child {
  margin-bottom: 0;
}

.footer-tech {
  color: rgba(181, 163, 101, 0.6);
  font-size: 0.85rem;
}

/* Responsive */
@media (max-width: 768px) {
  .footer {
    padding: var(--spacing-lg) 0 var(--spacing-md) 0;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
  }

  .footer-section {
    text-align: center;
  }

  .social-links {
    justify-content: center;
  }
}
</style>
