import { OGImageRoute } from 'astro-og-canvas';
import { getCollection } from 'astro:content';

/**
 * Xeración de imaxes Open Graph por páxina (astro-og-canvas).
 * `default` → /og/default.png (páxinas estáticas).
 * `<colección>-<id>` → tarxeta co título de cada nova/publicación/proxecto.
 * Fontes auto-hospedadas (src/assets/fonts) → build determinista e offline.
 */
export const prerender = true;

const COLLECTIONS = ['novas', 'publicacions', 'proxectos'] as const;

const contentEntries = (
  await Promise.all(
    COLLECTIONS.map(async (collection) => {
      const entries = await getCollection(collection);
      return entries.map(
        (entry) =>
          [
            `${collection}-${entry.id}`,
            { title: entry.data.title, description: entry.data.summary },
          ] as const,
      );
    }),
  )
).flat();

const pages: Record<string, { title: string; description: string }> = {
  default: {
    title: 'Instituto Galego de Intelixencia Territorial',
    description: 'Intelixencia territorial para Galicia',
  },
  ...Object.fromEntries(contentEntries),
};

export const { getStaticPaths, GET } = await OGImageRoute({
  param: 'route',
  pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    bgGradient: [
      [14, 79, 92],
      [10, 58, 68],
    ],
    border: { color: [224, 164, 88], width: 24, side: 'inline-start' },
    padding: 72,
    font: {
      title: {
        color: [255, 255, 255],
        size: 58,
        lineHeight: 1.2,
        families: ['Space Grotesk'],
      },
      description: {
        color: [214, 224, 224],
        size: 30,
        lineHeight: 1.4,
        families: ['Inter'],
      },
    },
    fonts: ['./src/assets/fonts/SpaceGrotesk-700.ttf', './src/assets/fonts/Inter-400.ttf'],
  }),
});
