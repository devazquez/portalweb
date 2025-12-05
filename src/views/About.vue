<template>
  <div class="about">
    <div class="container">
      <section class="about-section">
        <h1>Acerca del Portal</h1>
        <p class="lead">
          Este portal es una plataforma digital desarrollada para facilitar el acceso a los recursos 
          de investigación y contenidos digitales del Instituto de Investigaciones Sociales de la UNAM.
        </p>
      </section>

      <section class="about-section">
        <h2>Misión</h2>
        <p>
          Proporcionar acceso democrático y equitativo a los recursos académicos y de investigación 
          del Instituto de Investigaciones Sociales, facilitando la difusión del conocimiento científico 
          y el acceso a la información para investigadores, estudiantes y el público en general.
        </p>
      </section>

      <section class="about-section">
        <h2>Características Principales</h2>
        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon">🔍</div>
            <h3>Búsqueda Avanzada</h3>
            <p>Herramientas de búsqueda potentes que conectan recursos de múltiples fuentes</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📱</div>
            <h3>Diseño Responsivo</h3>
            <p>Acceso optimizado desde dispositivos móviles y de escritorio</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🔒</div>
            <h3>Seguridad</h3>
            <p>Protección de datos y cumplimiento con estándares internacionales de privacidad</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🌐</div>
            <h3>Múltiples Fuentes</h3>
            <p>Integración con repositorio Omeka-S y CMS headless para contenido diverso</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">⚡</div>
            <h3>Rendimiento</h3>
            <p>Plataforma rápida y eficiente construida con tecnologías modernas</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📚</div>
            <h3>Contenido Diverso</h3>
            <p>Acceso a artículos, libros, multimedia, datos y más</p>
          </div>
        </div>
      </section>

      <section class="about-section">
        <h2>Tecnología</h2>
        <div class="tech-stack">
          <div class="tech-category">
            <h3>Frontend</h3>
            <ul>
              <li>Vue.js 3 - Framework JavaScript reactivo</li>
              <li>Vite - Build tool de próxima generación</li>
              <li>Vue Router - Enrutamiento de aplicaciones</li>
              <li>Pinia - Gestión de estado</li>
              <li>Axios - Cliente HTTP</li>
            </ul>
          </div>
          <div class="tech-category">
            <h3>Infraestructura</h3>
            <ul>
              <li>Docker - Containerización de aplicaciones</li>
              <li>Docker Compose - Orquestación de servicios</li>
              <li>Omeka-S - Repositorio digital</li>
              <li>CMS Headless - Gestión de contenidos</li>
            </ul>
          </div>
          <div class="tech-category">
            <h3>Seguridad</h3>
            <ul>
              <li>DOMPurify - Sanitización HTML</li>
              <li>HTTPS/TLS - Comunicación cifrada</li>
              <li>Validación de entrada - Prevención de inyecciones</li>
              <li>CORS - Control de acceso cruzado</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="about-section">
        <h2>Instituciones Participantes</h2>
        <div class="institutions">
          <div class="institution-item">
            <h3>Instituto de Investigaciones Sociales (IIS)</h3>
            <p>
              El Instituto de Investigaciones Sociales es una entidad de la Universidad Nacional Autónoma de México 
              dedicada a la investigación en ciencias sociales y a la formación de investigadores.
            </p>
            <p><strong>Sitio oficial:</strong> <a href="https://www.iis.unam.mx/" target="_blank">www.iis.unam.mx</a></p>
          </div>
          <div class="institution-item">
            <h3>Universidad Nacional Autónoma de México (UNAM)</h3>
            <p>
              La UNAM es la máxima casa de estudios de México y una de las universidades más importantes de América Latina, 
              comprometida con la investigación, educación y difusión del conocimiento.
            </p>
            <p><strong>Sitio oficial:</strong> <a href="https://www.unam.mx/" target="_blank">www.unam.mx</a></p>
          </div>
        </div>
      </section>

      <section class="about-section">
        <h2>Contacto y Soporte</h2>
        <div class="contact-info">
          <p>
            Para más información sobre este portal o si tienes preguntas, comentarios y sugerencias, 
            no dudes en ponerte en contacto con nosotros.
          </p>
          <div class="contact-methods">
            <div class="contact-method">
              <strong>📧 Email:</strong>
              <a href="mailto:info@iis.unam.mx">info@iis.unam.mx</a>
            </div>
            <div class="contact-method">
              <strong>🌐 Sitio Web:</strong>
              <a href="https://www.iis.unam.mx/" target="_blank">Instituto de Investigaciones Sociales</a>
            </div>
            <div class="contact-method">
              <strong>📞 Teléfono:</strong>
              <span>+52 55 XXXX XXXX</span>
            </div>
          </div>
        </div>
      </section>

      <section class="about-section">
        <h2>Políticas y Términos</h2>
        <div class="policies">
          <div class="policy-item">
            <h3>Política de Privacidad</h3>
            <p>
              Respetamos tu privacidad y protegemos tus datos personales de acuerdo con las leyes aplicables.
            </p>
            <router-link to="#" class="policy-link">Leer política completa →</router-link>
          </div>
          <div class="policy-item">
            <h3>Términos de Uso</h3>
            <p>
              Al usar este portal aceptas nuestros términos y condiciones de servicio.
            </p>
            <router-link to="#" class="policy-link">Leer términos completos →</router-link>
          </div>
          <div class="policy-item">
            <h3>Licencias de Contenido</h3>
            <p>
              Los recursos en este portal están disponibles bajo diferentes licencias. Consulta la información 
              específica de cada recurso para conocer los derechos de uso.
            </p>
            <router-link to="#" class="policy-link">Más información sobre licencias →</router-link>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.about {
  padding: var(--spacing-2xl) 0;
  min-height: 80vh;
}

.about-section {
  margin-bottom: var(--spacing-2xl);
  padding-bottom: var(--spacing-2xl);
  border-bottom: 1px solid var(--border-color);
}

.about-section:last-child {
  border-bottom: none;
}

.about-section h1 {
  font-size: 2.5rem;
  margin-bottom: var(--spacing-lg);
}

.about-section h2 {
  font-size: 2rem;
  margin-bottom: var(--spacing-lg);
  border-bottom: 3px solid var(--primary-color);
  padding-bottom: var(--spacing-md);
}

.lead {
  font-size: 1.2rem;
  color: var(--text-light);
  line-height: 1.8;
}

/* Features Grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-xl);
  margin-top: var(--spacing-xl);
}

.feature-item {
  text-align: center;
  padding: var(--spacing-lg);
  background: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
}

.feature-item h3 {
  margin-bottom: var(--spacing-sm);
  color: var(--secondary-color);
}

.feature-item p {
  color: var(--text-light);
  font-size: 0.95rem;
  margin: 0;
}

/* Tech Stack */
.tech-stack {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-xl);
  margin-top: var(--spacing-xl);
}

.tech-category {
  background: white;
  padding: var(--spacing-lg);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  border-left: 4px solid var(--primary-color);
}

.tech-category h3 {
  color: var(--secondary-color);
  margin-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
  padding-bottom: var(--spacing-sm);
}

.tech-category ul {
  list-style: none;
  padding: 0;
}

.tech-category li {
  padding: var(--spacing-xs) 0;
  color: var(--text-dark);
  border-bottom: 1px solid #f0f0f0;
}

.tech-category li:last-child {
  border-bottom: none;
}

.tech-category li::before {
  content: '✓ ';
  color: var(--primary-color);
  font-weight: bold;
  margin-right: 0.5rem;
}

/* Instituciones */
.institutions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-xl);
  margin-top: var(--spacing-xl);
}

.institution-item {
  background: white;
  padding: var(--spacing-lg);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  border-top: 3px solid var(--primary-color);
}

.institution-item h3 {
  color: var(--secondary-color);
  margin-bottom: var(--spacing-sm);
}

.institution-item p {
  color: var(--text-dark);
  margin-bottom: var(--spacing-sm);
}

.institution-item a {
  color: var(--primary-color);
  font-weight: 600;
}

.institution-item a:hover {
  color: var(--accent-color);
}

/* Contacto */
.contact-info {
  background: white;
  padding: var(--spacing-xl);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.contact-info p {
  color: var(--text-dark);
  margin-bottom: var(--spacing-lg);
}

.contact-methods {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}

.contact-method {
  padding: var(--spacing-md);
  background-color: #f9f9f9;
  border-left: 3px solid var(--primary-color);
  border-radius: var(--radius);
}

.contact-method strong {
  display: block;
  margin-bottom: var(--spacing-xs);
  color: var(--secondary-color);
}

.contact-method a,
.contact-method span {
  color: var(--text-dark);
}

.contact-method a:hover {
  color: var(--primary-color);
}

/* Policies */
.policies {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
  margin-top: var(--spacing-xl);
}

.policy-item {
  background: white;
  padding: var(--spacing-lg);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.policy-item h3 {
  color: var(--secondary-color);
  margin-bottom: var(--spacing-sm);
}

.policy-item p {
  color: var(--text-dark);
  margin-bottom: var(--spacing-md);
}

.policy-link {
  color: var(--primary-color);
  font-weight: 600;
  transition: color 0.3s ease;
}

.policy-link:hover {
  color: var(--accent-color);
}

/* Responsive */
@media (max-width: 768px) {
  .about-section h1 {
    font-size: 1.75rem;
  }

  .about-section h2 {
    font-size: 1.5rem;
  }

  .features-grid,
  .tech-stack,
  .institutions,
  .policies {
    grid-template-columns: 1fr;
  }
}
</style>
