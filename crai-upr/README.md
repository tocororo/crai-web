# Universidad del Futuro - Sitio Web Institucional

Sitio web completo e institucional para la **Universidad del Futuro**, diseñado con un estilo serio, profesional y accesible, similar al de las universidades públicas latinoamericanas.

## Estructura del Sitio

```
crai-upr/
├── index.html                     # Página de inicio
├── css/
│   └── styles.css                 # Estilos globales con variables CSS
├── js/
│   └── script.js                  # JavaScript vanilla (interactividad)
├── pages/
│   ├── la-universidad.html        # Historia, misión, autoridades
│   ├── estudios.html              # Oferta académica con filtros
│   ├── admision.html              # Proceso de admisión, FAQ, formulario
│   ├── investigacion.html         # Grupos y proyectos de investigación
│   ├── actualidad.html            # Noticias, eventos, newsletter
│   └── transparencia.html         # Informes, normativas, datos abiertos
├── assets/
│   ├── img/                       # Imágenes del sitio
│   ├── pdf/                       # Documentos descargables
│   └── icons/                     # Iconos personalizados
└── README.md
```

## Características

- **Diseño responsive** (mobile-first con breakpoints en 768px, 992px, 1200px)
- **Paleta institucional**: azul oscuro (#003366) y dorado (#E8A317)
- **Modo oscuro** con persistencia en localStorage
- **Animaciones** scroll reveal y contadores progresivos
- **Buscador interno** con resultados en vivo
- **Navegación accesible** (WCAG 2.1 AA, skip link, ARIA labels)
- **Formulario de contacto** con validación en frontend
- **FAQ interactivo** con acordeón
- **Filtros** para programas académicos y noticias
- **Cookies consent** banner
- **SEO** optimizado (Open Graph, Schema.org, meta tags)

## Tecnologías

- HTML5 semántico
- CSS3 con Flexbox, Grid y variables CSS
- JavaScript vanilla (ES6+)
- Font Awesome 6 (iconos)
- Google Fonts (Montserrat + Open Sans)

## Cómo usar

1. Abre `index.html` en cualquier navegador moderno.
2. Navega por las secciones desde el menú principal.
3. Para personalizar:
   - Edita `css/styles.css` para cambiar colores, fuentes o espaciados (variables CSS en `:root`)
   - Edita `js/script.js` para modificar la interactividad
   - Reemplaza los placeholders en los HTML con contenido real

## Personalización

### Colores institucionales

Edita las variables en `css/styles.css`:

```css
:root {
  --primary: #003366;
  --secondary: #E8A317;
  --accent: #F5F5F5;
  --text-primary: #333333;
  --text-light: #FFFFFF;
}
```

### Contenido

Cada archivo HTML contiene contenido placeholder. Reemplaza:
- Textos, nombres de programas, autoridades
- Imágenes placeholder por imágenes reales
- Enlaces a redes sociales, documentos PDF, etc.

## Licencia

Proyecto educativo de código abierto.
