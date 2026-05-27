import gl from './gl.json';
import es from './es.json';

export type Lang = 'gl' | 'es';

export const LANGS: Lang[] = ['gl', 'es'];
export const DEFAULT_LANG: Lang = 'gl';

const dictionaries = { gl, es } as const;

/** Clave lóxica de cada páxina con par GL/ES. */
export type RouteKey =
  | 'home'
  | 'about'
  | 'news'
  | 'publications'
  | 'projects'
  | 'contact'
  | 'search'
  | 'thanks';

/** Equivalencias de rutas entre idiomas (espello GL ↔ ES). */
export const ROUTES: Record<RouteKey, Record<Lang, string>> = {
  home: { gl: '/', es: '/es/' },
  about: { gl: '/que-facemos', es: '/es/que-hacemos' },
  news: { gl: '/novas', es: '/es/noticias' },
  publications: { gl: '/publicacions', es: '/es/publicaciones' },
  projects: { gl: '/proxectos', es: '/es/proyectos' },
  contact: { gl: '/contacto', es: '/es/contacto' },
  search: { gl: '/buscar', es: '/es/buscar' },
  thanks: { gl: '/grazas', es: '/es/gracias' },
};

/** Detecta o idioma a partir do pathname (gl por defecto, es baixo /es). */
export function getLang(url: URL | string): Lang {
  const pathname = typeof url === 'string' ? url : url.pathname;
  return pathname === '/es' || pathname.startsWith('/es/') ? 'es' : 'gl';
}

/** O outro idioma. */
export function altLang(lang: Lang): Lang {
  return lang === 'gl' ? 'es' : 'gl';
}

/**
 * Tradución por clave con notación de punto, p.ex. t('gl', 'nav.news').
 * Devolve a clave se non existe (visible en desenvolvemento).
 */
export function t(lang: Lang, key: string): string {
  const value = key
    .split('.')
    .reduce<unknown>((acc, part) => (acc != null && typeof acc === 'object' ? (acc as Record<string, unknown>)[part] : undefined), dictionaries[lang]);

  if (typeof value === 'string') return value;
  if (import.meta.env.DEV) console.warn(`[i18n] clave ausente: ${lang}.${key}`);
  return key;
}

/** URL dunha páxina coñecida no idioma indicado. */
export function localizedHref(key: RouteKey, lang: Lang): string {
  return ROUTES[key][lang];
}

/** Formata unha data no idioma de interface (ex.: «20 de maio de 2026»). */
export function formatDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === 'gl' ? 'gl-ES' : 'es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

function normalize(path: string): string {
  if (path === '/' || path === '/es/' || path === '/es') return path === '/es' ? '/es/' : path;
  return path.replace(/\/$/, '');
}

/**
 * Devolve a ruta equivalente no idioma destino.
 * Para páxinas fixas (home, listaxes, contacto…) usa o mapa de equivalencias.
 * Para páxinas de detalle (sen par) cae á portada do idioma destino.
 */
export function localizePath(path: string, targetLang: Lang): string {
  const current = normalize(path);
  for (const pair of Object.values(ROUTES)) {
    if (normalize(pair.gl) === current || normalize(pair.es) === current) {
      return pair[targetLang];
    }
  }
  return ROUTES.home[targetLang];
}

/**
 * Indica se a ruta actual ten un par bilingüe explícito.
 * Útil para decidir se emitir hreflang recíproco.
 */
export function hasLangPair(path: string): boolean {
  const current = normalize(path);
  return Object.values(ROUTES).some(
    (pair) => normalize(pair.gl) === current || normalize(pair.es) === current,
  );
}
