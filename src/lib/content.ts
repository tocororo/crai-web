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

export function formatDate(date: Date | string, locale = 'es-ES'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
}
