# IGIT — Sitio Web Institucional

Sitio web público (estático, bilingüe galego/castelán) do Instituto Galego de Intelixencia Territorial (IGIT), asociación sen ánimo de lucro. Explica os fins de IGIT e publica novas, informes e observatorios. Sen base de datos nin login de usuarios; edición vía panel Keystatic. Custo recorrente 0 €.

> O deseño completo está en `docs/blueprint.md`. Empeza por `START_HERE.md`.

## Comandos
- `pnpm dev` — Servidor de desenvolvemento (panel en /keystatic)
- `pnpm build` — Build estático + índice Pagefind
- `pnpm preview` — Previsualiza o build
- `pnpm test` — Probas E2E (Playwright)

## Stack
Astro 5 + TypeScript (strict) + Tailwind CSS v4 + illas React + Keystatic (modo GitHub) + Astro Content Collections (Markdoc) + Pagefind + Web3Forms + Vercel.

## Arquitectura
- `src/pages/` — Páxinas. Árbore galega na raíz; espello castelán baixo `src/pages/es/`.
- `src/content/` — Contido (.mdoc) escrito por Keystatic; lido por Astro Content Collections (`src/content.config.ts`).
- `src/data/` — Singletons editables (`site.json`, `fins.json`). Sementes iniciais en `seed/`.
- `src/i18n/` — Cadeas de interface (`gl.json`, `es.json`) + utilidades (`t`, `localizePath`).
- `src/components/` — `layout/`, `sections/`, `content/`, `forms/`, `search/`.
- `src/layouts/BaseLayout.astro` — head, meta/OG/JSON-LD, fontes, header+footer.
- `keystatic.config.ts` — Coleccións e singletons do panel (espello de `content.config.ts`).
- `public/uploads/` — Imaxes e PDFs subidos dende Keystatic.

### Fluxo de datos
Editor → /keystatic → commit ao repo (GitHub) → Vercel redesprega → Astro le `src/content/` no build → HTML estático.

### Patróns clave
- Estático por defecto; illas React SÓ para LanguageSwitcher, MobileMenu, ContactForm e Search.
- Interface SEMPRE traducida (`t(lang, key)`); contido publícase nun só idioma con `<LangBadge>`.
- As listaxes mostran contido dos dous idiomas con filtro; o detalle renda a interface no idioma do contido.
- Rutas de Keystatic (`/keystatic`, `/api/keystatic`) levan `export const prerender = false`.

## Regras de organización do código
1. Un compoñente por ficheiro. Máx. 300 liñas.
2. Alias `@/` para `src/`.
3. Sen barrel exports; importa do ficheiro orixe.
4. `.astro` por defecto; `.tsx` só cando precise interactividade no cliente.
5. Os esquemas de `keystatic.config.ts` e `src/content.config.ts` deben manterse en espello.

## Sistema de deseño
### Cores
primary `#0E4F5C` · primary-dark `#0A3A44` · secondary `#2E7D5B` · accent `#E0A458` · bg `#FBFAF7` · surface `#FFFFFF` · text `#16242A` · muted `#5C6B70` · border `#E4E2DC` · success `#2E7D5B` · destructive `#C0492F`
### Tipografía
- Titulares: Space Grotesk Variable, 500/700
- Corpo: Inter Variable, 400/500/600, line-height 1.65
### Estilo
- Radius: 8px (botóns/inputs), 12px (tarxetas)
- Bordos sutís > sombras; sombra suave no hover
- Espazado base 4px; ancho máx. 1200px (artigo ~720px)
- Mobile-first; contraste WCAG AA; motivo de liñas de contorno topográfico

## Variables de contorno
| Variable | Descrición |
|----------|-----------|
| `PUBLIC_SITE_URL` | URL canónica |
| `PUBLIC_WEB3FORMS_KEY` | Access key do formulario de contacto |
| `KEYSTATIC_GITHUB_CLIENT_ID` | OAuth App de GitHub |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | Segredo da OAuth App |
| `KEYSTATIC_SECRET` | Cadea aleatoria de sesión |

## Regras No Negociables
1. **NUNCA** publicar nomes de membros da xunta directiva nin crear páxina de "Quen somos / Equipo". O sitio fala do que fai IGIT, non de quen o forma.
2. Identidade visual **propia de IGIT** — non reutilizar a marca do xeodestino Condado Paradanta.
3. Interface sempre nos dous idiomas; o contido pode ir nun só idioma, sempre con etiqueta GL/ES.
4. Custo recorrente 0 €: nada de servizos de pago. Calquera servizo externo debe ter capa gratuíta suficiente.
5. Nunca commitear `.env` nin segredos. Fontes auto-hospedadas (sen Google Fonts en runtime).
