import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// ============================================================
// Configuración global del sitio (Header, Footer, Contacto, Redes)
// ============================================================
const config = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/config' }),
  schema: z.object({
    siteName: z.string(),
    siteSubtitle: z.string(),
    logo: z.string().optional(),
    description: z.string(),
    contact: z.object({
      address: z.string(),
      phone: z.string(),
      email: z.string(),
    }),
    social: z.object({
      facebook: z.url().optional(),
      twitter: z.url().optional(),
      instagram: z.url().optional(),
      linkedin: z.url().optional(),
      youtube: z.url().optional(),
    }),
    navigation: z.array(
      z.object({
        label: z.string(),
        url: z.string(),
        children: z
          .array(
            z.object({
              label: z.string(),
              url: z.string(),
            })
          )
          .optional(),
      })
    ),
    footer: z.object({
      description: z.string(),
      quickLinksTitle: z.string(),
      quickLinks: z.array(z.object({ label: z.string(), url: z.string() })),
      servicesTitle: z.string(),
      services: z.array(z.object({ label: z.string(), url: z.string() })),
      transparencyTitle: z.string(),
      transparency: z.array(z.object({ label: z.string(), url: z.string() })),
      copyright: z.string(),
    }),
  }),
});

// ============================================================
// Páginas editables (contenido markdown)
// ============================================================
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      badge: z.string().optional(),
      badgeIcon: z.string().optional(),
      heroImage: image().optional(),
      heroTitle: z.string().optional(),
      heroSubtitle: z.string().optional(),
      breadcrumb: z.string().optional(),
      order: z.number().optional(),
      draft: z.boolean().default(false),
    }),
});

// ============================================================
// Noticias / Blog
// ============================================================
const noticias = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/noticias' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      author: z.string(),
      category: z.string().default('Noticias'),
      heroImage: z.string().optional(),
      icon: z.string().optional(),
      draft: z.boolean().default(false),
    }),
});

// ============================================================
// Eventos
// ============================================================
const eventos = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/eventos' }),
  schema: z.object({
    title: z.string(),
    day: z.string(),
    month: z.string(),
    location: z.string(),
    time: z.string(),
    featured: z.boolean().default(false),
  }),
});

// ============================================================
// Programas académicos
// ============================================================
const programas = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/programas' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(),
    category: z.enum(['grado', 'posgrado', 'doctorado']),
    duration: z.string().optional(),
    modality: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().optional(),
  }),
});

// ============================================================
// Equipo / Autoridades
// ============================================================
const equipo = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/equipo' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      position: z.string(),
      bio: z.string().optional(),
      photo: image().optional(),
      icon: z.string().optional(),
      order: z.number().optional(),
    }),
});

// ============================================================
// Testimonios
// ============================================================
const testimonios = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/testimonios' }),
  schema: z.object({
    author: z.string(),
    role: z.string(),
    quote: z.string(),
    rating: z.number().min(1).max(5).default(5),
  }),
});

// ============================================================
// Grupos de Investigación
// ============================================================
const grupos = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/grupos' }),
  schema: z.object({
    area: z.string(),
    icon: z.string(),
    title: z.string(),
    description: z.string(),
    coordinador: z.string().optional(),
    order: z.number().optional(),
  }),
});

// ============================================================
// Proyectos Activos
// ============================================================
const proyectos = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/proyectos' }),
  schema: z.object({
    area: z.string(),
    icon: z.string(),
    title: z.string(),
    coordinador: z.string().optional(),
    description: z.string(),
    order: z.number().optional(),
  }),
});

// ============================================================
// Estadísticas
// ============================================================
const estadisticas = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/estadisticas' }),
  schema: z.object({
    value: z.number(),
    suffix: z.string().default('+'),
    label: z.string(),
    order: z.number().optional(),
  }),
});

export const collections = {
  config,
  pages,
  noticias,
  eventos,
  programas,
  equipo,
  testimonios,
  grupos,
  proyectos,
  estadisticas,
};
