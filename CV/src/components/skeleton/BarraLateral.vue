<template>
  <aside class="sidebar" :class="{ 'sidebar-open': isOpen }">
    <div class="toggle-button" @click="toggleSidebar">
      <div class="hamburger" :class="{ active: isOpen }">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>

    <div class="sidebar-content">
      <nav class="nav-menu">
        <ul>
          <li v-for="(item, index) in menuItems" :key="index">
            <a
              :href="item.link"
              class="nav-link"
              :class="{ active: activeSection === item.id }"
              @click.prevent="scrollToSection(item.id)"
            >
              <span class="nav-icon" v-html="item.icon"></span>
              <span class="nav-text">{{ item.text }}</span>
            </a>
          </li>
        </ul>
      </nav>

      <div class="sidebar-footer">
        <div class="social-links">
          <a href="https://github.com/Jastxz" target="_blank" class="social-link">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
              ></path>
            </svg>
          </a>
          <a href="http://www.linkedin.com/in/javier-gil-blázquez-a84015219" target="_blank" class="social-link">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
              ></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
          <a href="mailto:javicraft14@gmail.com" class="social-link">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
              ></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Elementos del menú
const menuItems = [
  {
    id: 'home',
    text: 'Inicio',
    link: '#home',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
  },
  {
    id: 'experience',
    text: 'Experiencia',
    link: '#experience',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>',
  },
  {
    id: 'projects',
    text: 'Proyectos',
    link: '#projects',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>',
  },
  {
    id: 'skills',
    text: 'Habilidades',
    link: '#skills',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
  },
]

// Estado para controlar si la barra lateral está abierta o cerrada
const isOpen = ref(false)
// Estado para la sección activa actual
const activeSection = ref('home')

// Función para alternar la visibilidad de la barra lateral
const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

// Función para desplazarse a una sección específica
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    activeSection.value = sectionId

    // En móviles, cerramos el sidebar al hacer clic
    if (window.innerWidth < 768) {
      isOpen.value = false
    }
  }
}

// Función para detectar la sección actual al hacer scroll
const handleScroll = () => {
  // Obtener todos los elementos de sección
  const sections = menuItems.map((item) => document.getElementById(item.id))

  // Encontrar la sección visible actual
  for (let i = sections.length - 1; i >= 0; i--) {
    const section = sections[i]
    if (section) {
      const rect = section.getBoundingClientRect()
      // Si la sección está visible en el viewport
      if (rect.top <= 150 && rect.bottom >= 150) {
        activeSection.value = section.id
        break
      }
    }
  }
}

// Configurar y limpiar el evento de scroll
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll() // Inicializar la sección activa
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 250px;
  background: linear-gradient(to bottom, var(--color-primary), var(--color-secundary));
  color: var(--color-text);
  z-index: 1000;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

/* En pantallas pequeñas, ocultar sidebar por defecto */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-250px);
  }

  .sidebar-open {
    transform: translateX(0);
  }
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 2rem 0;
  overflow-y: auto;
}

.nav-menu {
  flex-grow: 1;
}

.nav-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  color: var(--link-color);
  text-decoration: none;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background-color: var(--selection-background);
  color: var(--color-text);
}

.nav-link.active {
  background-color: var(--selection-background);
  color: var(--color-text);
  border-left: 4px solid var(--gris-palido);
}

.nav-icon {
  margin-right: 1rem;
  display: flex;
  align-items: center;
  color: var(--color-background);
}

.nav-text {
  color: var(--color-background);
}

.sidebar-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.social-links {
  display: flex;
  justify-content: space-around;
}

.social-link {
  color: var(--link-color);
  transition: color 0.2s ease;
}

.social-link:hover {
  color: var(--link-hover);
}

/* Estilos para el botón hamburguesa */
.toggle-button {
  position: absolute;
  top: 1rem;
  right: -3.5rem;
  width: 3rem;
  height: 3rem;
  background-color: var(--color-primary);
  border-radius: 0 4px 4px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
}

.hamburger {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 1.5rem;
  height: 1.2rem;
}

.hamburger span {
  width: 100%;
  height: 2px;
  background-color: var(--link-color);
  transition: all 0.3s ease;
}

.hamburger.active span:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

/* En pantallas más grandes, siempre mostrar la barra lateral y ocultar el botón */
@media (min-width: 769px) {
  .toggle-button {
    display: none;
  }
}
</style>
