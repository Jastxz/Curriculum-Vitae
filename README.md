# CV Personal - Javier Gil Blázquez

Página web personal de currículum vitae desarrollada con Vue 3, TypeScript y Vite. Incluye componentes interactivos para demostrar proyectos desarrollados.

## 🚀 Características

- **💼 CV Interactivo**: Navegación fluida entre secciones (Inicio, Experiencia, Proyectos, Habilidades)
- **🌐 Multiidioma**: Soporte para español e inglés con vue-i18n
- **🌙 Tema Dual**: Modo claro y oscuro con Pinia store
- **📱 Responsive**: Diseño adaptable a dispositivos móviles y desktop
- **🎮 Proyectos Interactivos**: Componentes demostrativos de proyectos reales
- **⚡ Rápido**: Construido con Vite para desarrollo y build optimizados

## 🛠️ Stack Tecnológico

- **Frontend**: Vue 3 (Composition API)
- **Lenguaje**: TypeScript
- **Build Tool**: Vite
- **Estilos**: CSS Variables con tema dinámico
- **Estado**: Pinia
- **Internacionalización**: Vue I18n
- **Componentes**: Reutilizables y modulares
- **Iconos**: SVG personalizados

## 📦 Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/Jastxz/CV.git
   cd CV
   ```

2. **Instala las dependencias**
   ```bash
   yarn install
   ```

3. **Ejecuta el servidor de desarrollo**
   ```bash
   yarn dev
   ```

4. **Construye para producción**
   ```bash
   yarn build
   ```

## 🏗️ Estructura del Proyecto

```
CV/
├── src/
│   ├── components/
│   │   ├── home/              # Contenido de cada sección
│   │   ├── skeleton/          # Layout principal (Header, Sidebar, Footer)
│   │   └── tools/             # Componentes reutilizables
│   ├── i18n/                  # Configuración de idiomas
│   │   └── locales/           # Archivos de traducción
│   ├── stores/                # Stores de Pinia
│   ├── composables/           # Composables de Vue
│   └── assets/                # Estilos globales
├── public/                    # Archivos estáticos
└── README.md
```

## 🎨 Componentes Destacados

### 📋 Componentes Base
- **`Tarjeta.vue`**: Tarjetas versátiles para mostrar información
- **`Lista.vue`**: Listas configurables con búsqueda y ordenamiento
- **`Tabla.vue`**: Tablas interactivas con paginación y filtros
- **`ModalProyecto.vue`**: Modal reutilizable para proyectos interactivos
- **`Parrafo.vue`**, **`Imagen.vue`**: Componentes de contenido

### 🔧 Herramientas Interactivas
- **`SelectorLenguaje.vue`**: Cambio de idioma dinámico
- **`CambiarTema.vue`**: Toggle entre modo claro/oscuro
- **`VisualizadorPrimos.vue`**: Demo interactiva de herramientas matemáticas

## 🌟 Proyectos Integrados

### Herramientas de Números Primos
Visualizador interactivo que conecta con un microservicio Spring Boot:

**Características:**
- 📊 **Coordenadas Polares**: Gráfico interactivo con zoom y grid dinámico
- 📈 **Diferencias**: Tabla searchable con datos de números primos
- 🎮 **Controles**: Zoom con rueda, ajuste de grid con teclado
- 🔍 **Búsqueda**: Filtrado en tiempo real en tablas

**API Endpoints:**
- `POST /v0/polar` - Coordenadas polares de números primos
- `POST /v0/diff` - Diferencias entre números primos consecutivos

## 🌐 Internacionalización

El sitio está completamente traducido a:
- 🇪🇸 **Español** (por defecto)
- 🇺🇸 **Inglés**

Las traducciones se almacenan en `src/i18n/locales/` y se detecta automáticamente el idioma del navegador.

## 🎨 Sistema de Temas

**Variables CSS personalizadas** permiten cambio dinámico entre:
- ☀️ **Modo Claro**: Colores claros y profesionales
- 🌙 **Modo Oscuro**: Interfaz oscura para mejor experiencia nocturna

Los temas se persisten en `localStorage` y respetan las preferencias del sistema.

## 📱 Diseño Responsive

- **Desktop**: Sidebar fija con navegación fluida
- **Tablet/Mobile**: Hamburger menu con overlay
- **Componentes**: Se adaptan automáticamente al viewport
- **Imágenes**: Lazy loading y optimización automática

## 🚀 Scripts Disponibles

```bash
# Desarrollo
yarn dev          # Servidor de desarrollo
yarn build        # Build de producción  
yarn preview      # Preview del build
```

## 🔧 Configuración

### Vite Configuration
- **Proxy**: Configurado para desarrollo con APIs locales
- **Plugins**: Vue, TypeScript, Vue DevTools
- **Optimizaciones**: Tree shaking, code splitting

### TypeScript
- **Strict mode**: Activado para mayor seguridad de tipos
- **Path mapping**: Alias `@/` para imports relativos
- **Composables**: Tipado fuerte en toda la aplicación

## 📂 Personalización

Para adaptar este CV a tus necesidades:

1. **Contenido**: Modifica los archivos en `src/i18n/locales/`
2. **Estilos**: Ajusta las variables CSS en `src/assets/base.css`
3. **Componentes**: Agrega nuevos componentes en `src/components/`
4. **Proyectos**: Crea nuevos visualizadores siguiendo el patrón de `VisualizadorPrimos.vue`

## 🤝 Contribuciones

Este es un proyecto personal, pero si encuentras bugs o mejoras:

1. Fork del repositorio
2. Crea una rama feature (`git checkout -b feature/mejora`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/mejora`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de uso personal. El código está disponible para referencia y aprendizaje.

## 📞 Contacto

- **Email**: javgilbla@proton.me
- **LinkedIn**: [Javier Gil Blázquez](http://www.linkedin.com/in/javier-gil-blázquez-a84015219)
- **GitHub**: [@Jastxz](https://github.com/Jastxz)

---

⭐ **¿Te gusta el proyecto?** ¡Dale una estrella en GitHub!

*Desarrollado con ❤️ usando Vue 3 y TypeScript*