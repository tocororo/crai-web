import { getCollection, type CollectionEntry } from 'astro:content';

export type Config = CollectionEntry<'config'>['data'];

export async function getSiteConfig(): Promise<Config | undefined> {
  const [config] = await getCollection('config');
  return config?.data;
}

export async function getNavigation(config: Config | undefined) {
  return config?.navigation ?? [];
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// Páginas que el desarrollador puede activar/desactivar desde la Configuración Global.
// La clave coincide con `features.<key>` en src/content/config/global.yaml.
const PAGE_FEATURE_KEYS: Record<string, keyof NonNullable<Config['features']>> = {
  '/admision': 'admision',
};

// Devuelve true si la página indicada por su URL está habilitada (por defecto sí).
export function isPageEnabled(config: Config | undefined, url: string): boolean {
  const path = url.split('#')[0].replace(/\/$/, '') || '/';
  const key = PAGE_FEATURE_KEYS[path];
  if (!key) return true;
  return config?.features?.[key] !== false;
}

// URLs de páginas desactivadas; se exponen al cliente para filtrar el buscador.
export function getHiddenPages(config: Config | undefined): string[] {
  return Object.entries(PAGE_FEATURE_KEYS)
    .filter(([, key]) => config?.features?.[key] === false)
    .map(([path]) => path);
}

export function formatDate(date: Date | string, locale = 'es-ES'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
}
