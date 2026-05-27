import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

/** Feed RSS das novas de IGIT (contido GL e ES mesturado, orde por data). */
export async function GET(context: APIContext) {
  const novas = (await getCollection('novas')).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );

  return rss({
    title: 'IGIT — Novas',
    description:
      'Novas do Instituto Galego de Intelixencia Territorial (IGIT): intelixencia territorial para Galicia.',
    site: context.site ?? 'https://igit.gal',
    items: novas.map((entry) => ({
      title: entry.data.title,
      pubDate: entry.data.date,
      description: entry.data.summary,
      link: `/novas/${entry.id}`,
    })),
    customData: '<language>gl-ES</language>',
  });
}
