# AGENTS.md

## What this is

Astro 7 + Decap CMS institutional site for CRAI (Centro de Recursos para el Aprendizaje y la Investigación, UPR). Spanish-language content throughout (`es-ES` locale). Deploys as a static site.

## Commands

| Task | Command |
|------|---------|
| Dev server | `npm run dev` |
| Build | `npm run build` |
| Typecheck | `npm run typecheck` (`astro check`) |
| CMS admin | `npm run cms` (starts `decap-server` on `localhost:8081`) |

No linter, formatter, or test suite is configured. Node `>=22.12.0` required.

## Architecture

**Content collections** are defined in `src/content.config.ts`. Each has a Zod schema and maps to a folder under `src/content/`:

| Collection | Format | Folder | Purpose |
|------------|--------|--------|---------|
| `config` | YAML | `src/content/config/` | Single global config file (`global.yaml`) — nav, footer, contact, social |
| `pages` | Markdown | `src/content/pages/` | Editable page content |
| `noticias` | Markdown | `src/content/noticias/` | News/blog posts with frontmatter |
| `eventos` | YAML | `src/content/eventos/` | Events (day/month strings, not dates) |
| `programas` | YAML | `src/content/programas/` | Academic programs (grado/posgrado/doctorado) |
| `equipo` | YAML | `src/content/equipo/` | Team/authorities |
| `testimonios` | YAML | `src/content/testimonios/` | UNUSED in pages (reserved) |
| `estadisticas` | YAML | `src/content/estadisticas/` | Homepage + transparencia stats counters |
| `timeline` | YAML | `src/content/timeline/` | la-universidad history |
| `mvv` | YAML | `src/content/mvv/` | Misión/visión/valores |
| `organigrama` | YAML | `src/content/organigrama/` | Org chart levels (`level`, `nodes[]`) |
| `campus` | YAML | `src/content/campus/` | Campus/sedes |
| `acreditaciones` | YAML | `src/content/acreditaciones/` | Accreditations |
| `stats-universidad` | YAML | `src/content/stats-universidad/` | la-universidad counters |
| `admision-pasos` | YAML | `src/content/admision-pasos/` | Admission steps |
| `admision-requisitos` | YAML | `src/content/admision-requisitos/` | Requirements by `nivel` + `requisitos[]` |
| `becas` | YAML | `src/content/becas/` | Scholarships |
| `calendario-academico` | YAML | `src/content/calendario-academico/` | Academic calendar rows |
| `faq` | YAML | `src/content/faq/` | FAQ (`question`/`answer`) |
| `investigacion-grupos` / `-proyectos` | YAML | `src/content/investigacion-*/` | Research groups/projects |
| `publicaciones` | YAML | `src/content/publicaciones/` | Publications (`authors`, `meta`) |
| `transferencia` / `convocatorias` / `colaboraciones` | YAML | `src/content/{transferencia,convocatorias,colaboraciones}/` | Research page blocks |
| `intercambio` | YAML | `src/content/intercambio/` | Exchange programs (estudios) |
| `avisos` | YAML | `src/content/avisos/` | Sidebar notices (actualidad) |
| `categorias-noticias` | YAML | `src/content/categorias-noticias/` | Sidebar categories |
| `informes` / `normativas` / `datos-abiertos` / `declaraciones` | YAML | `src/content/{informes,normativas,datos-abiertos,declaraciones}/` | Transparencia blocks |

Block collections all use optional `order` for page sorting. `pages` collection is also UNUSED (reserved).

**CMS config** at `public/admin/config.yml` mirrors these collections. Backend is `proxy` mode (local `decap-server`), not Netlify/Git Gateway. Working git branch is `dev` (`config.yml` `branch` matches it).

**Key files:**
- `src/lib/content.ts` — helpers: `getSiteConfig()`, `getNavigation()`, `slugify()`, `formatDate()`
- `src/layouts/BaseLayout.astro` — single layout; hides Header/Footer/cookie/scripts on `/admin` routes
- `src/styles/global.css` — all styles in one file (~3300 lines); CSS variables drive theming
- `src/scripts/main.js` — client-side JS (dark mode toggle, scroll reveal, carousels, counters)

**Dynamic routes:** Only `src/pages/actualidad/[slug].astro` uses `getStaticPaths()` from the `noticias` collection.

## Gotchas

- **`crai-upr/`** is the original static HTML prototype. Excluded from `tsconfig.json`. Do not modify as part of the Astro project.
- **Global config** is a single YAML file (`src/content/config/global.yaml`), not multiple files per the `glob` loader pattern.
- **Image fields** in content collections (e.g., `heroImage`, `photo`) use Astro's `image()` schema — content files referencing them must pass through `render()` or access `.src`.
- **News slugs** use `n.id` (filename-based), not `n.slug`. Example: `/actualidad/${n.id}`.
- **No Tailwind** — styles are plain CSS with custom properties. The original prompt mentioned Tailwind but the project uses vanilla CSS.
- **Dark mode** is toggled via `data-theme` attribute on `<html>`, persisted in `localStorage`.
- **Draft filtering** — news pages filter `!data.draft` before rendering. Setting `draft: true` in frontmatter hides the post.
- **Decap CMS requires every collection to have a `title` field or an `identifier_field`** — otherwise the admin panel throws `The Field title is missing for the collection "X"` and the page reloads in an infinite loop. Block collections without a `title` field set `identifier_field` (e.g. `level`, `evento`, `label`).
