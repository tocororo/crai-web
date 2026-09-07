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
      heroImage: image().optional(),
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

// ============================================================
// La Universidad: timeline / historia
// ============================================================
const timeline = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/timeline' }),
  schema: z.object({
    year: z.string(),
    title: z.string(),
    desc: z.string(),
    order: z.number().optional(),
  }),
});

// ============================================================
// La Universidad: misión, visión, valores
// ============================================================
const mvv = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/mvv' }),
  schema: z.object({
    icon: z.string(),
    title: z.string(),
    desc: z.string(),
    order: z.number().optional(),
  }),
});

// ============================================================
// La Universidad: organigrama
// ============================================================
const organigrama = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/organigrama' }),
  schema: z.object({
    level: z.number(),
    nodes: z.array(z.string()),
    order: z.number().optional(),
  }),
});

// ============================================================
// La Universidad: campus y sedes
// ============================================================
const campus = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/campus' }),
  schema: z.object({
    icon: z.string(),
    name: z.string(),
    desc: z.string(),
    order: z.number().optional(),
  }),
});

// ============================================================
// La Universidad: acreditaciones
// ============================================================
const acreditaciones = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/acreditaciones' }),
  schema: z.object({
    icon: z.string(),
    title: z.string(),
    desc: z.string(),
    order: z.number().optional(),
  }),
});

// ============================================================
// La Universidad: cifras (distintas de las de portada)
// ============================================================
const statsUniversidad = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/stats-universidad' }),
  schema: z.object({
    target: z.number(),
    suffix: z.string().default('+'),
    label: z.string(),
    order: z.number().optional(),
  }),
});

// ============================================================
// Admisión: pasos del proceso
// ============================================================
const admisionPasos = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/admision-pasos' }),
  schema: z.object({
    number: z.number(),
    icon: z.string(),
    title: z.string(),
    description: z.string(),
    order: z.number().optional(),
  }),
});

// ============================================================
// Admisión: requisitos por nivel
// ============================================================
const admisionRequisitos = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/admision-requisitos' }),
  schema: z.object({
    title: z.string(),
    icon: z.string(),
    nivel: z.enum(['grado', 'posgrado', 'doctorado']),
    requisitos: z.array(z.string()),
    order: z.number().optional(),
  }),
});

// ============================================================
// Admisión: becas y ayudas
// ============================================================
const becas = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/becas' }),
  schema: z.object({
    icon: z.string(),
    title: z.string(),
    description: z.string(),
    order: z.number().optional(),
  }),
});

// ============================================================
// Admisión: calendario académico
// ============================================================
const calendarioAcademico = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/calendario-academico' }),
  schema: z.object({
    evento: z.string(),
    inicio: z.string(),
    cierre: z.string(),
    order: z.number().optional(),
  }),
});

// ============================================================
// Admisión: preguntas frecuentes
// ============================================================
const faq = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/faq' }),
  schema: z.object({
    question: z.string(),
    answer: z.string(),
    order: z.number().optional(),
  }),
});

// ============================================================
// Investigación: grupos
// ============================================================
const investigacionGrupos = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/investigacion-grupos' }),
  schema: z.object({
    icon: z.string(),
    area: z.string(),
    title: z.string(),
    desc: z.string(),
    order: z.number().optional(),
  }),
});

// ============================================================
// Investigación: proyectos activos
// ============================================================
const investigacionProyectos = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/investigacion-proyectos' }),
  schema: z.object({
    icon: z.string(),
    area: z.string(),
    title: z.string(),
    desc: z.string(),
    order: z.number().optional(),
  }),
});

// ============================================================
// Investigación: publicaciones
// ============================================================
const publicaciones = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/publicaciones' }),
  schema: z.object({
    icon: z.string(),
    title: z.string(),
    authors: z.string(),
    meta: z.string(),
    order: z.number().optional(),
  }),
});

// ============================================================
// Investigación: transferencia de conocimiento
// ============================================================
const transferencia = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/transferencia' }),
  schema: z.object({
    icon: z.string(),
    area: z.string(),
    title: z.string(),
    desc: z.string(),
    order: z.number().optional(),
  }),
});

// ============================================================
// Investigación: convocatorias
// ============================================================
const convocatorias = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/convocatorias' }),
  schema: z.object({
    icon: z.string(),
    area: z.string(),
    title: z.string(),
    desc: z.string(),
    order: z.number().optional(),
  }),
});

// ============================================================
// Investigación: colaboraciones internacionales
// ============================================================
const colaboraciones = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/colaboraciones' }),
  schema: z.object({
    icon: z.string(),
    area: z.string(),
    title: z.string(),
    desc: z.string(),
    order: z.number().optional(),
  }),
});

// ============================================================
// Estudios: programas de intercambio
// ============================================================
const intercambio = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/intercambio' }),
  schema: z.object({
    icon: z.string(),
    title: z.string(),
    desc: z.string(),
    order: z.number().optional(),
  }),
});

// ============================================================
// Actualidad: avisos oficiales
// ============================================================
const avisos = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/avisos' }),
  schema: z.object({
    texto: z.string(),
    order: z.number().optional(),
  }),
});

// ============================================================
// Actualidad: categorías del sidebar
// ============================================================
const categoriasNoticias = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/categorias-noticias' }),
  schema: z.object({
    key: z.string(),
    label: z.string(),
    count: z.number(),
    order: z.number().optional(),
  }),
});

// ============================================================
// Transparencia: informes
// ============================================================
const informes = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/informes' }),
  schema: z.object({
    icon: z.string(),
    title: z.string(),
    desc: z.string(),
    order: z.number().optional(),
  }),
});

// ============================================================
// Transparencia: normativas
// ============================================================
const normativas = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/normativas' }),
  schema: z.object({
    icon: z.string(),
    title: z.string(),
    desc: z.string(),
    order: z.number().optional(),
  }),
});

// ============================================================
// Transparencia: datos abiertos
// ============================================================
const datosAbiertos = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/datos-abiertos' }),
  schema: z.object({
    icon: z.string(),
    title: z.string(),
    desc: z.string(),
    order: z.number().optional(),
  }),
});

// ============================================================
// Transparencia: declaraciones de bienes
// ============================================================
const declaraciones = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/declaraciones' }),
  schema: z.object({
    icon: z.string(),
    title: z.string(),
    desc: z.string(),
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
  estadisticas,
  timeline,
  mvv,
  organigrama,
  campus,
  acreditaciones,
  'stats-universidad': statsUniversidad,
  'admision-pasos': admisionPasos,
  'admision-requisitos': admisionRequisitos,
  becas,
  'calendario-academico': calendarioAcademico,
  faq,
  'investigacion-grupos': investigacionGrupos,
  'investigacion-proyectos': investigacionProyectos,
  publicaciones,
  transferencia,
  convocatorias,
  colaboraciones,
  intercambio,
  avisos,
  'categorias-noticias': categoriasNoticias,
  informes,
  normativas,
  'datos-abiertos': datosAbiertos,
  declaraciones,
};
