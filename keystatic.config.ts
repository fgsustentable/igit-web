import { config, fields, collection, singleton } from '@keystatic/core';

/**
 * Panel de edición (Keystatic).
 * DEBE manterse en espello con src/content.config.ts.
 *
 * - Desenvolvemento: storage `local` (sen contas).
 * - Produción: storage `github` (define PUBLIC_KEYSTATIC_REPO = "owner/igit-web").
 */

const repo = (import.meta.env.PUBLIC_KEYSTATIC_REPO ?? 'OWNER/igit-web') as `${string}/${string}`;

const langField = fields.select({
  label: 'Idioma do contido',
  description: 'O idioma no que está escrito este contido (amósase cunha etiqueta GL/ES).',
  options: [
    { label: 'Galego', value: 'gl' },
    { label: 'Castelán', value: 'es' },
  ],
  defaultValue: 'gl',
});

const tagsField = fields.array(fields.text({ label: 'Etiqueta' }), {
  label: 'Etiquetas',
  itemLabel: (props) => props.value,
});

export default config({
  storage: import.meta.env.DEV ? { kind: 'local' } : { kind: 'github', repo },
  ui: {
    brand: { name: 'IGIT' },
    navigation: {
      Contido: ['novas', 'publicacions', 'proxectos'],
      Textos: ['site', 'fins'],
    },
  },
  collections: {
    novas: collection({
      label: 'Novas',
      path: 'src/content/novas/*',
      slugField: 'title',
      format: { contentField: 'content' },
      columns: ['title', 'date'],
      schema: {
        title: fields.slug({ name: { label: 'Título' } }),
        lang: langField,
        date: fields.date({ label: 'Data', defaultValue: { kind: 'today' } }),
        summary: fields.text({ label: 'Resumo', multiline: true }),
        cover: fields.image({
          label: 'Portada',
          directory: 'public/uploads/novas',
          publicPath: '/uploads/novas/',
        }),
        tags: tagsField,
        content: fields.markdoc({ label: 'Contido' }),
      },
    }),

    publicacions: collection({
      label: 'Publicacións',
      path: 'src/content/publicacions/*',
      slugField: 'title',
      format: { contentField: 'content' },
      columns: ['title', 'date'],
      schema: {
        title: fields.slug({ name: { label: 'Título' } }),
        lang: langField,
        date: fields.date({ label: 'Data de publicación', defaultValue: { kind: 'today' } }),
        summary: fields.text({ label: 'Resumo / abstract', multiline: true }),
        authors: fields.text({
          label: 'Autoría',
          description: 'Autoría institucional ou externa. NON nomes da xunta directiva.',
        }),
        tags: tagsField,
        cover: fields.image({
          label: 'Portada',
          directory: 'public/uploads/publicacions',
          publicPath: '/uploads/publicacions/',
        }),
        pdf: fields.file({
          label: 'PDF descargable',
          directory: 'public/uploads/pdf',
          publicPath: '/uploads/pdf/',
        }),
        content: fields.markdoc({ label: 'Contido' }),
      },
    }),

    proxectos: collection({
      label: 'Observatorios e proxectos',
      path: 'src/content/proxectos/*',
      slugField: 'title',
      format: { contentField: 'content' },
      columns: ['title', 'status'],
      schema: {
        title: fields.slug({ name: { label: 'Título' } }),
        lang: langField,
        date: fields.date({ label: 'Data', defaultValue: { kind: 'today' } }),
        summary: fields.text({ label: 'Descrición curta', multiline: true }),
        status: fields.select({
          label: 'Estado',
          options: [
            { label: 'En curso', value: 'en-curso' },
            { label: 'Finalizado', value: 'finalizado' },
          ],
          defaultValue: 'en-curso',
        }),
        externalUrl: fields.url({
          label: 'Ligazón externa',
          description: 'App ou web do observatorio/proxecto (ex.: Observatorio do Condado Paradanta).',
        }),
        cover: fields.image({
          label: 'Imaxe',
          directory: 'public/uploads/proxectos',
          publicPath: '/uploads/proxectos/',
        }),
        featured: fields.checkbox({ label: 'Destacar na portada', defaultValue: false }),
        content: fields.markdoc({ label: 'Contido' }),
      },
    }),
  },

  singletons: {
    site: singleton({
      label: 'Sitio (claim e contacto)',
      path: 'src/data/site',
      format: { data: 'json' },
      schema: {
        claim: fields.object({
          gl: fields.text({ label: 'Claim (galego)' }),
          es: fields.text({ label: 'Claim (castelán)' }),
        }),
        heroTitle: fields.object({
          gl: fields.text({ label: 'Título hero (galego)' }),
          es: fields.text({ label: 'Título hero (castelán)' }),
        }),
        heroSubtitle: fields.object({
          gl: fields.text({ label: 'Subtítulo hero (galego)', multiline: true }),
          es: fields.text({ label: 'Subtítulo hero (castelán)', multiline: true }),
        }),
        contactEmail: fields.text({ label: 'Correo de contacto' }),
        social: fields.object({
          linkedin: fields.url({ label: 'LinkedIn' }),
          x: fields.url({ label: 'X' }),
          bluesky: fields.url({ label: 'Bluesky' }),
        }),
      },
    }),

    fins: singleton({
      label: 'Fins e actividades',
      path: 'src/data/fins',
      format: { data: 'json' },
      schema: {
        fins: fields.array(
          fields.object({
            icon: fields.text({ label: 'Icona (nome lucide)' }),
            title: fields.object({
              gl: fields.text({ label: 'Título (galego)' }),
              es: fields.text({ label: 'Título (castelán)' }),
            }),
            description: fields.object({
              gl: fields.text({ label: 'Descrición (galego)', multiline: true }),
              es: fields.text({ label: 'Descrición (castelán)', multiline: true }),
            }),
          }),
          { label: 'Fins', itemLabel: (props) => props.fields.title.fields.gl.value || 'Fin' },
        ),
        actividades: fields.object({
          gl: fields.array(fields.text({ label: 'Actividade' }), {
            label: 'Actividades (galego)',
            itemLabel: (props) => props.value,
          }),
          es: fields.array(fields.text({ label: 'Actividade' }), {
            label: 'Actividades (castelán)',
            itemLabel: (props) => props.value,
          }),
        }),
      },
    }),
  },
});
