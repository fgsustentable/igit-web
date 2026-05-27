import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Esquemas de LECTURA (Astro Content Collections).
 * DEBEN manterse en espello con keystatic.config.ts (esquemas de EDICIÓN).
 * As imaxes/PDF gárdanse en public/uploads/ e referéncianse como ruta pública (string).
 */

const lang = z.enum(['gl', 'es']);

const novas = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/novas' }),
  schema: z.object({
    title: z.string(),
    lang,
    date: z.coerce.date(),
    summary: z.string(),
    cover: z.string().nullish(),
    tags: z.array(z.string()).default([]),
  }),
});

const publicacions = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/publicacions' }),
  schema: z.object({
    title: z.string(),
    lang,
    date: z.coerce.date(),
    summary: z.string(),
    authors: z.string().nullish(),
    tags: z.array(z.string()).default([]),
    cover: z.string().nullish(),
    pdf: z.string().nullish(),
  }),
});

const proxectos = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/proxectos' }),
  schema: z.object({
    title: z.string(),
    lang,
    date: z.coerce.date().optional(),
    summary: z.string(),
    status: z.enum(['en-curso', 'finalizado']),
    externalUrl: z.string().url().nullish(),
    cover: z.string().nullish(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { novas, publicacions, proxectos };
