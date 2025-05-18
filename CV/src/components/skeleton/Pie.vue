<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="contact-info">
        <span class="sign">© {{ currentYear }} Javier Gil</span>
        <span class="separator">—</span>
        <a href="mailto:javicraft14@gmail.com" class="footer-link">Mail</a>
        <span class="dot">•</span>
        <a href="https://github.com/Jastxz" target="_blank" class="footer-link">GitHub</a>
        <span class="dot">•</span>
        <a
          href="http://www.linkedin.com/in/javier-gil-blázquez-a84015219"
          target="_blank"
          class="footer-link"
          >LinkedIn</a
        >
      </div>
      <div class="contact-info">
        <a :href="cvDownloadLinkES" target="_blank" class="footer-link">
          <span>Descargar CV ES</span>
        </a>
        <span class="dot">•</span>
        <a :href="cvDownloadLinkEN" target="_blank" class="footer-link">
          <span>Download CV EN</span>
        </a>
      </div>
      <div class="made-with">Hecho con <span class="vue-text">Vue</span></div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Constante para mostrar el año actual siempre
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
// Enlace de descarga de CV
const cvDownloadLinkES = "https://docs.google.com/document/d/1BpEp3Xwy3bsel0OpNQPGe7oAS4NTftIHgIlcR-y485Y/edit?usp=drive_link"
const cvDownloadLinkEN = "https://docs.google.com/document/d/1x49RGZPNeZimYRvpMlToUlk6E00t9MUMSBUlMPuycB4/edit?usp=drive_link"
</script>

<style scoped>
.footer {
  width: 100%;
  padding: 1.5rem 0;
  background: linear-gradient(to left, var(--color-primary), var(--color-secondary));
  color: var(--color-background);
  font-size: 0.875rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
}

.contact-info {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.sign {
  color: var(--color-text);
}

.separator {
  margin: 0 0.25rem;
}

.dot {
  margin: 0 0.5rem;
  opacity: 0.7;
}

.footer-link {
  color: var(--color-background);
  text-decoration: none;
  transition:
    color 0.2s ease,
    text-decoration 0.2s ease;
  position: relative;
}

.footer-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 1px;
  bottom: -2px;
  left: 0;
  background-color: var(--color-text);
  transition: width 0.3s ease;
}

.footer-link:hover {
  color: var(--color-text);
}

.footer-link:hover::after {
  width: 100%;
}

.made-with {
  margin-top: 0.75rem;
  opacity: 0.9;
}

.vue-text {
  color: var(--vue-text);
  font-weight: 600;
}

/* Estilos responsivos */
@media (max-width: 640px) {
  .contact-info {
    flex-direction: column;
    gap: 0.25rem;
  }

  .separator,
  .dot {
    display: none;
  }
}
</style>
