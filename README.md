# CRAI Web — Sitio institucional (Astro + Decap CMS)

Sitio web estático del CRAI (Centro de Recursos para el Aprendizaje y la Investigación, UPR), implementado con [Astro](https://astro.build) como generador de sitios estáticos y [Decap CMS](https://decapcms.org) para la edición y gestión del contenido. Todo el contenido es editable desde el panel de administración y vive en `src/content/` (Markdown/YAML validados con Zod).

## Requisitos

- Node.js `>=22.12.0`
- npm

## Instalación

```bash
npm install
cp .env.example .env   # opcional, para la URL pública del sitio
```

## Desarrollo

Levanta el servidor de Astro:

```bash
npm run dev
```

Abre la URL que muestra la terminal (por defecto `http://localhost:4321`).

Para usar el panel de administración en local, en **otra terminal** levanta el backend del CMS:

```bash
npm run cms
```

Esto inicia `decap-server` (por defecto en `localhost:8081`). Con los dos procesos corriendo, abre `/admin` en el navegador para editar el contenido. Los cambios se guardan directamente en `src/content/`.

## Otros comandos

| Comando            | Descripción                              |
|--------------------|------------------------------------------|
| `npm run dev`      | Servidor de desarrollo                   |
| `npm run cms`      | Backend local de Decap CMS               |
| `npm run build`    | Genera el sitio estático en `dist/`      |
| `npm run preview`  | Previsualiza el build de producción      |
| `npm run typecheck`| Verificación de tipos (`astro check`)    |

## Contenido editable

| Colección      | Carpeta                      | Formato   |
|----------------|------------------------------|-----------|
| `config`       | `src/content/config/`        | YAML (un solo fichero `global.yaml`: navegación, footer, contacto, redes) |
| `pages`        | `src/content/pages/`         | Markdown  |
| `noticias`     | `src/content/noticias/`      | Markdown (`draft: true` oculta la noticia) |
| `eventos`      | `src/content/eventos/`       | YAML      |
| `programas`    | `src/content/programas/`     | YAML      |
| `equipo`       | `src/content/equipo/`        | YAML      |
| `testimonios`  | `src/content/testimonios/`   | YAML (sin usar en páginas, reserva futura) |
| `estadisticas` | `src/content/estadisticas/`  | YAML      |
| `timeline`     | `src/content/timeline/`      | YAML (historia, la-universidad) |
| `mvv`          | `src/content/mvv/`           | YAML (misión/visión/valores) |
| `organigrama`  | `src/content/organigrama/`   | YAML (niveles con lista de nodos) |
| `campus`       | `src/content/campus/`        | YAML (campus y sedes) |
| `acreditaciones` | `src/content/acreditaciones/` | YAML    |
| `stats-universidad` | `src/content/stats-universidad/` | YAML (cifras de la-universidad) |
| `admision-pasos` | `src/content/admision-pasos/` | YAML   |
| `admision-requisitos` | `src/content/admision-requisitos/` | YAML (`nivel`: grado/posgrado/doctorado, lista `requisitos`) |
| `becas`        | `src/content/becas/`         | YAML      |
| `calendario-academico` | `src/content/calendario-academico/` | YAML |
| `faq`          | `src/content/faq/`           | YAML      |
| `investigacion-grupos` | `src/content/investigacion-grupos/` | YAML |
| `investigacion-proyectos` | `src/content/investigacion-proyectos/` | YAML |
| `publicaciones` | `src/content/publicaciones/` | YAML     |
| `transferencia` | `src/content/transferencia/` | YAML     |
| `convocatorias` | `src/content/convocatorias/` | YAML     |
| `colaboraciones` | `src/content/colaboraciones/` | YAML    |
| `intercambio`  | `src/content/intercambio/`   | YAML (estudios) |
| `avisos`       | `src/content/avisos/`        | YAML (actualidad) |
| `categorias-noticias` | `src/content/categorias-noticias/` | YAML (sidebar actualidad) |
| `informes`     | `src/content/informes/`      | YAML (transparencia) |
| `normativas`   | `src/content/normativas/`    | YAML      |
| `datos-abiertos` | `src/content/datos-abiertos/` | YAML    |
| `declaraciones` | `src/content/declaraciones/` | YAML     |

Todas las colecciones de bloques usan campo opcional `order` para ordenar en página. La colección `pages` existe pero no se usa en ninguna página (reserva futura).

Los esquemas están en `src/content.config.ts` y el panel del CMS se configura en `public/admin/config.yml` (backend `proxy` local, sin Netlify ni credenciales externas). Las imágenes subidas desde el CMS van a `public/images/uploads/`.

## Estructura

```
├── public/admin/        # Panel de Decap CMS (config.yml)
├── src/
│   ├── components/      # Componentes Astro reutilizables
│   ├── content/         # Contenido editable (Markdown/YAML)
│   ├── layouts/         # BaseLayout (único layout)
│   ├── lib/             # Helpers (getSiteConfig, formatDate, ...)
│   ├── pages/           # Páginas del sitio + /admin + /actualidad/[slug]
│   ├── scripts/         # JS de cliente (dark mode, carruseles, contadores)
│   └── styles/          # CSS global (variables CSS, sin Tailwind)
├── astro.config.mjs
└── crai-upr/            # Prototipo HTML estático original (referencia, no se usa en el build)
```

## Notas

- Sitio en español (`es-ES`).
- Modo oscuro con `data-theme` en `<html>`, persistido en `localStorage`.
- El directorio `crai-upr/` es el diseño HTML de partida; está excluido del `tsconfig.json` y no forma parte del sitio Astro.
