# IGIT — Sitio Web Institucional — Blueprint

> Xerado por The Architect o 2026-05-27
> Arquetipo: Content Platform (institucional + publicación) — bilingüe GL/ES
> Idioma do proxecto: galego (defecto) + castelán

---

## 0. Lectura rápida para quen constrúe

Estás a construír o **sitio web público do Instituto Galego de Intelixencia Territorial (IGIT)**, unha asociación sen ánimo de lucro de Galicia. O sitio ten dous traballos:

1. **Explicar que fai IGIT** (os seus fins) de forma clara e potente.
2. **Publicar contido** de tres tipos: **Novas**, **Publicacións/Informes** e **Observatorios e proxectos**.

É un sitio **estático (Astro)**, **bilingüe galego/castelán**, con **panel de edición visual gratuíto (Keystatic)** e **custo recorrente 0 €**. Non hai base de datos, nin login de usuarios finais, nin backend propio.

**Regra de ouro deste proxecto:** NUNCA aparecen nomes de membros da xunta directiva nin hai páxina de "Quen somos / Equipo". O sitio fala do *que fai* IGIT, non de *quen* o forma. (Decisión expresa do cliente por privacidade.)

Podes construír todo isto de principio a fin seguindo a **Sección 9 (Orde de construción)**. Non precisas máis contexto.

---

## 1. Resumo do proxecto

### Visión
IGIT é unha asociación galega sen ánimo de lucro que aplica **cartografía, sistemas de información xeográfica (SIG), teledetección, análise de datos e intelixencia artificial** ao coñecemento, planificación e xestión do territorio. O sitio web é a súa cara pública: explica a misión, dá credibilidade institucional ante administracións, universidades, financiadores e cidadanía, e serve de canle de publicación dos seus estudos, novas e observatorios de datos.

### Obxectivos
- Comunicar con claridade **que fai IGIT** e os seus fins (Art. 6 dos estatutos).
- Publicar e organizar **informes territoriais, novas e observatorios** de forma autónoma, sen tocar código.
- Proxectar unha imaxe **seria, técnica e fiable**, cunha identidade visual propia de IGIT.
- Funcionar en **galego e castelán** sen multiplicar o traballo de tradución.
- Manter **custo recorrente 0 €** (só o dominio, opcional).

### Métricas de éxito
- Calquera membro da xunta pode publicar unha nova ou un informe dende o panel sen axuda técnica.
- Lighthouse ≥ 95 en Performance, Accesibilidade, Best Practices e SEO en móbil.
- Páxina principal lexible e comprensible en < 10 s para alguén que non coñece IGIT.

---

## 2. Stack tecnolóxico

| Capa | Tecnoloxía | Por que |
|------|-----------|---------|
| Framework | **Astro 5** | Sitio de contido → estático por defecto, cero JS salvo onde faga falta. Máximo rendemento e mínimo mantemento. |
| Linguaxe | **TypeScript** | Tipado en compoñentes, esquemas de contido e utilidades. |
| Estilos | **Tailwind CSS v4** | Sistema de deseño consistente vía tokens; sen CSS solto. |
| Compoñentes | **Compoñentes Astro** + **illas React** mínimas | React só en buscador, menú móbil, troco de idioma e validación do formulario. |
| Xestor de contido | **Keystatic** (modo GitHub) | Panel visual gratuíto; o contido gárdase como ficheiros no propio repo. Sen cotas. |
| Lectura de contido | **Astro Content Collections** + **Markdoc** | Astro le os ficheiros que escribe Keystatic e renderízaos con tipado. |
| Internacionalización | **i18n nativo de Astro** | Locales `gl` (defecto) e `es`. Interface traducida; contido no idioma orixinal. |
| Buscador | **Pagefind** | Índice de busca xerado no build. Estático, custo 0, sen servizo externo. |
| Formulario contacto | **Web3Forms** | Envío de correo a IGIT sen backend. Capa gratuíta. |
| Tipografías | **@fontsource-variable** (auto-hospedadas) | Sen Google Fonts en runtime (sen FOUT, mellor privacidade). |
| Imaxes OG | **astro-og-canvas** | Imaxes de previsualización social xeradas no build. |
| RSS / Sitemap | **@astrojs/rss** + **@astrojs/sitemap** | Feed de novas e mapa do sitio para SEO. |
| Despregue | **Vercel** (capa gratuíta) | Build automático en cada push; rexión UE. |
| Xestor de paquetes | **pnpm** | Rápido e determinista. |

**Custo recorrente: 0 €.** Único gasto opcional: dominio `igit.gal` (~12 €/ano).

---

## 3. Estrutura de directorios

```
igit-web/
  astro.config.mjs            # Astro + integracións (react, markdoc, keystatic, sitemap) + adaptador Vercel + i18n
  keystatic.config.ts         # Definición do panel de edición (coleccións + singletons)
  tailwind.config.ts          # (se fai falta) — en Tailwind v4 a config principal vai en CSS
  src/
    content.config.ts         # Esquemas de Astro Content Collections (novas, publicacions, proxectos)
    content/
      novas/                  # .mdoc escritos por Keystatic
      publicacions/
      proxectos/
    data/
      site.json               # Singleton: claim, contacto, redes (editable en Keystatic)
      fins.json               # Singleton: lista de fins/liñas de traballo (editable)
    i18n/
      gl.json                 # Cadeas de interface en galego
      es.json                 # Cadeas de interface en castelán
      utils.ts                # getLang(url), t(lang, key), localizePath()
    layouts/
      BaseLayout.astro        # <head>, fontes, meta, OG, JSON-LD, header+footer
    components/
      layout/
        Header.astro          # Navegación + LanguageSwitcher + menú móbil
        Footer.astro          # Pé institucional
        LanguageSwitcher.tsx  # Illa React — troca gl/es preservando a ruta
        MobileMenu.tsx        # Illa React — menú hamburguesa
      sections/
        Hero.astro            # Sección principal da home
        Fins.astro            # Grade de fins/liñas de traballo (sen persoas)
        Destacados.astro      # Últimas novas / publicacións / proxectos
        CTAContacto.astro     # Chamada final á acción
      content/
        ContentCard.astro     # Tarxeta para listaxes (nova/publicación/proxecto)
        LangBadge.astro       # Etiqueta GL/ES no contido
        Prose.astro           # Envoltura tipográfica para corpo Markdoc
        TopoTexture.astro     # SVG de liñas de contorno (motivo de marca)
      forms/
        ContactForm.tsx       # Illa React — formulario Web3Forms con validación
      search/
        Search.tsx            # Illa React — Pagefind UI
    pages/
      index.astro             # Home (galego)
      que-facemos.astro       # Fins + actividades (galego) — SEN equipo/xunta
      novas/index.astro       # Listaxe de novas (galego)
      publicacions/index.astro
      proxectos/index.astro
      contacto.astro
      grazas.astro            # Páxina de agradecemento tras enviar form
      buscar.astro
      novas/[slug].astro      # Detalle (chrome no idioma do contido)
      publicacions/[slug].astro
      proxectos/[slug].astro
      es/                     # Espello en castelán das páxinas fixas e listaxes
        index.astro
        que-hacemos.astro
        noticias/index.astro
        publicaciones/index.astro
        proyectos/index.astro
        contacto.astro
        gracias.astro
        buscar.astro
      404.astro
    styles/
      global.css              # @import "tailwindcss"; tokens de deseño (@theme); estilos base
  public/
    uploads/                  # Imaxes e PDFs subidos dende Keystatic
    favicon.svg
    robots.txt
  package.json
  .env.example
  README.md
```

**Nota sobre detalle vs listaxe:** as **listaxes** existen en galego e en castelán (a interface tradúcese). As **páxinas de detalle** son únicas por elemento e renderan a interface no **idioma propio do contido** (cada nova/informe/proxecto está escrito nun só idioma). As listaxes dos dous idiomas enlazan ás mesmas URLs de detalle. Así evítase duplicar tradución de cada artigo.

---

## 4. Modelo de contido

Defínese **dúas veces, en espello**: en `keystatic.config.ts` (edición) e en `src/content.config.ts` (lectura/render). Os campos deben coincidir.

### Coleccións

**Novas** (`src/content/novas/*.mdoc`)
| Campo | Tipo | Notas |
|-------|------|-------|
| `title` | text | Obrigatorio |
| `lang` | select `gl`/`es` | Idioma do contido. Obrigatorio |
| `date` | date | Para orde e RSS |
| `summary` | text (multiliña) | Resumo para tarxeta e meta description |
| `cover` | image (opcional) | Gárdase en `public/uploads/novas/` |
| `tags` | array de text | Etiquetas/categorías |
| `content` | markdoc | Corpo do artigo |

**Publicacións/Informes** (`src/content/publicacions/*.mdoc`)
| Campo | Tipo | Notas |
|-------|------|-------|
| `title` | text | Obrigatorio |
| `lang` | select `gl`/`es` | Obrigatorio |
| `date` | date | Data de publicación |
| `summary` | text (multiliña) | Abstract |
| `authors` | text (opcional) | Autoría do informe (institucional/externa). **NON nomes da xunta.** |
| `tags` | array de text | Temáticas |
| `cover` | image (opcional) | Portada |
| `pdf` | file (opcional) | PDF descargable en `public/uploads/pdf/` |
| `content` | markdoc | Texto/resumo do informe na páxina |

**Observatorios e proxectos** (`src/content/proxectos/*.mdoc`)
| Campo | Tipo | Notas |
|-------|------|-------|
| `title` | text | Obrigatorio |
| `lang` | select `gl`/`es` | Obrigatorio |
| `summary` | text (multiliña) | Descrición curta |
| `status` | select `en-curso`/`finalizado` | Estado |
| `externalUrl` | url (opcional) | Ligazón á app externa (ex.: Observatorio do Condado Paradanta) |
| `cover` | image (opcional) | Imaxe do proxecto |
| `featured` | checkbox | Destacar na home |
| `content` | markdoc | Detalle do proxecto |

### Singletons (textos institucionais editables)

**`site`** (`src/data/site.json`): `claim` (gl/es), `heroTitle` (gl/es), `heroSubtitle` (gl/es), `contactEmail`, `phone` (opcional), `address` (opcional), `linkedin`/`x`/`bluesky` (opcional).

**`fins`** (`src/data/fins.json`): lista de fins/liñas de traballo, cada un con `icon`, `title` (gl/es), `description` (gl/es). Sementar cos 8 fins do Art. 6 (ver Sección 17).

### Relacións
Non hai relacións de BD. O "vínculo" entre contidos é por `tags` e pola colección. Os proxectos poden apuntar a apps externas vía `externalUrl`.

---

## 5. API / Endpoints

O sitio é **estático**: non hai API propia salvo as rutas que inxecta Keystatic.

| Método | Ruta | Descrición | Render |
|--------|------|-----------|--------|
| GET | `/keystatic/[...params]` | Panel de edición (UI) | server (prerender=false) |
| ALL | `/api/keystatic/[...params]` | Endpoints internos de Keystatic + OAuth GitHub | server (prerender=false) |
| POST | `https://api.web3forms.com/submit` | Envío do formulario (servizo externo) | — |

O formulario de contacto faise **POST directo a Web3Forms** (sen ruta propia). O `access_key` de Web3Forms é público por deseño; o anti-spam resólvese cun **honeypot** (`botcheck`).

---

## 6. Arquitectura frontend

### Rutas / Páxinas
| Ruta (GL) | Ruta (ES) | Páxina | Que mostra |
|-----------|-----------|--------|------------|
| `/` | `/es/` | Home | Hero, fins, destacados, CTA |
| `/que-facemos` | `/es/que-hacemos` | Que facemos | Fins detallados + actividades (sen equipo) |
| `/novas` | `/es/noticias` | Listaxe novas | Tarxetas + filtro por idioma + busca |
| `/publicacions` | `/es/publicaciones` | Listaxe informes | Tarxetas con PDF + etiquetas |
| `/proxectos` | `/es/proyectos` | Listaxe proxectos | Tarxetas con estado + ligazón externa |
| `/novas/[slug]` | (mesma URL) | Detalle nova | Artigo; chrome no idioma do contido |
| `/publicacions/[slug]` | (mesma URL) | Detalle informe | Texto + descarga PDF |
| `/proxectos/[slug]` | (mesma URL) | Detalle proxecto | Detalle + botón "Visitar" |
| `/contacto` | `/es/contacto` | Contacto | Formulario + datos institucionais |
| `/buscar` | `/es/buscar` | Busca | Pagefind UI |
| `/grazas` | `/es/gracias` | Grazas | Confirmación de envío |
| `/404` | — | 404 | Erro amable bilingüe |

### Estratexia bilingüe (clave)
- **Interface** (menús, botóns, títulos de sección, pé): sempre traducida vía `src/i18n/{gl,es}.json` e a función `t(lang, key)`.
- **Contido** (novas/informes/proxectos): publícase **nun só idioma** (campo `lang`) e amósase con **`<LangBadge>`**. Nas listaxes aparece TODO o contido dos dous idiomas, ordenado por data, cun **filtro opcional** GL/ES. Así non hai que traducir cada artigo.
- **`LanguageSwitcher`**: troca `/` ↔ `/es/` preservando a sección equivalente (mapa de equivalencias en `i18n/utils.ts`).
- **hreflang**: as páxinas fixas con par GL/ES emiten `<link rel="alternate" hreflang>` recíproco.

### Xerarquía de compoñentes (home)
```
BaseLayout
  Header (nav + LanguageSwitcher + MobileMenu)
  main
    Hero (claim + CTA + TopoTexture)
    Fins (grade dende fins.json)
    Destacados (getCollection → últimas 3 de cada tipo → ContentCard)
    CTAContacto
  Footer
```

### Xestión de estado
Sen estado global. Render estático en build (`getStaticPaths` + `getCollection`). As illas React son illadas e sen estado compartido:
- `LanguageSwitcher`, `MobileMenu`: estado local de UI.
- `ContactForm`: estado local (validación + fetch a Web3Forms).
- `Search` (Pagefind): carga o índice baixo demanda no cliente.

---

## 7. Sistema de deseño

Identidade **propia de IGIT** (NON reutilizar a marca do xeodestino Condado Paradanta). Concepto: *intelixencia territorial* = datos + territorio + IA. Ton institucional, técnico-científico e fiable, pero accesible.

### Cores
| Rol | Hex | Uso |
|-----|-----|-----|
| Primary (petróleo) | `#0E4F5C` | Cabeceiras, ligazóns, marca, botóns primarios |
| Primary-dark | `#0A3A44` | Hover, pé, fondos escuros |
| Secondary (verde territorio) | `#2E7D5B` | Acentos temáticos, estados "en curso", iconas |
| Accent (ámbar) | `#E0A458` | CTAs destacados, subliñados, badges |
| Background | `#FBFAF7` | Fondo de páxina (branco oso) |
| Surface | `#FFFFFF` | Tarxetas, paneis |
| Text | `#16242A` | Texto de corpo (case negro azulado) |
| Muted | `#5C6B70` | Texto secundario, metadatos, bordos |
| Border | `#E4E2DC` | Bordos, separadores |
| Success | `#2E7D5B` | Confirmacións |
| Destructive | `#C0492F` | Erros de formulario (terracota) |

### Tipografía
| Rol | Fonte | Escala | Peso |
|-----|-------|--------|------|
| Titulares | **Space Grotesk** (variable, auto-hospedada) | 2rem–4rem (clamp fluído) | 500 / 700 |
| Corpo | **Inter** (variable, auto-hospedada) | 1rem (1.0625rem en lectura longa), line-height 1.65 | 400 / 500 / 600 |
| Mono (opcional) | **JetBrains Mono** | 0.875rem | 400 |

### Espazado e layout
- Escala base 4px: 4, 8, 12, 16, 24, 32, 48, 64, 96.
- Border radius: 4px (chips), **8px** (botóns/inputs), **12px** (tarxetas), full (avatares/pills).
- Ancho máximo de contido: **1200px** (lectura de artigo: ~720px / `prose`).
- Breakpoints: Tailwind por defecto (sm 640, md 768, lg 1024, xl 1280).

### Estilo de compoñentes
Editorial-institucional: xeneroso espazo en branco, **bordos sutís** sobre sombras pesadas, tarxetas con sombra suave no hover. Motivo gráfico: **liñas de contorno topográfico** en SVG de baixa opacidade no hero e divisorias de sección, e leves acentos de grella/coordenadas. Transicións curtas (150–200ms), nada esaxerado. Mobile-first. Contraste mínimo WCAG AA.

Os tokens defínense en `src/styles/global.css` co bloque `@theme` de Tailwind v4 (variables CSS), p.ex.:
```css
@import "tailwindcss";
@theme {
  --color-primary: #0E4F5C;
  --color-secondary: #2E7D5B;
  --color-accent: #E0A458;
  --color-bg: #FBFAF7;
  --font-display: "Space Grotesk Variable", system-ui, sans-serif;
  --font-body: "Inter Variable", system-ui, sans-serif;
}
```

---

## 8. Autenticación

**Non hai login de usuarios finais.** O sitio é público.

A única autenticación é a **do panel de edición Keystatic**, en modo **GitHub**:
- O repo vive en GitHub. Quen edita entra en `/keystatic` e autentícase coa súa **conta de GitHub** (gratuíta) mediante unha **GitHub OAuth App**.
- Ao gardar, Keystatic fai commit (ou PR) ao repo → Vercel redesprega automaticamente.
- Só as persoas con acceso de escritura ao repo poden publicar.

| Rol | Pode facer |
|-----|-----------|
| Visitante | Ler todo o sitio público |
| Editor (colaborador do repo en GitHub) | Crear/editar/borrar contido dende `/keystatic` |
| Admin (owner do repo) | O anterior + xestionar accesos e despregue |

> **Alternativa se non se quere GitHub:** migrar a **Sanity** (login propio hospedado, capa gratuíta). Non é o camiño por defecto deste blueprint.

---

## 9. Orde de construción

> **SECCIÓN MÁIS IMPORTANTE.** Constrúe en orde. Cada paso é verificable.

**Paso 1 — Andamiaxe**
```bash
pnpm create astro@latest igit-web -- --template minimal --typescript strict --no-git
cd igit-web
pnpm astro add react tailwind sitemap vercel
pnpm add @keystatic/core @keystatic/astro @astrojs/markdoc
pnpm add -D pagefind @fontsource-variable/space-grotesk @fontsource-variable/inter astro-og-canvas
```
Configura `astro.config.mjs`: `site: 'https://igit.gal'`, `output: 'static'`, adaptador `vercel`, integracións `react()`, `markdoc()`, `keystatic()`, `sitemap()`, e bloque `i18n` con `defaultLocale: 'gl'`, `locales: ['gl','es']`, `routing: { prefixDefaultLocale: false }`. **Verifica:** `pnpm dev` arranca sen erros.

**Paso 2 — Tokens de deseño e tipografías**
Crea `src/styles/global.css` con `@import "tailwindcss"`, o bloque `@theme` (cores + fontes da Sección 7) e estilos base. Importa as fontes variables en `BaseLayout`. **Verifica:** unha páxina de proba mostra as cores e fontes correctas.

**Paso 3 — i18n**
Crea `src/i18n/gl.json`, `src/i18n/es.json` (cadeas de nav, botóns, seccións, pé, formulario, 404) e `src/i18n/utils.ts` con `getLang(url)`, `t(lang, key)` e `localizePath(path, lang)` + mapa de equivalencias de rutas GL↔ES. **Verifica:** `t('gl','nav.news')` e `t('es','nav.news')` devolven o esperado.

**Paso 4 — Layout base**
`BaseLayout.astro` (head, meta, OG, JSON-LD Organization, fontes), `Header.astro` (nav + `LanguageSwitcher` + `MobileMenu`), `Footer.astro`, `TopoTexture.astro`. **Verifica:** cabeceira e pé renderan nos dous idiomas e o troco de idioma funciona.

**Paso 5 — Keystatic + Content Collections**
Crea `keystatic.config.ts` (storage `github` cfg dende env; coleccións `novas`/`publicacions`/`proxectos` + singletons `site`/`fins`, segundo Sección 4) e `src/content.config.ts` (esquemas espello con `glob` loader + Markdoc). Engade as rutas `/keystatic` e `/api/keystatic` con `export const prerender = false`. En desenvolvemento usa `storage: { kind: 'local' }`. **Verifica:** `/keystatic` abre o panel e podes crear unha nova de proba que aparece en `src/content/novas/`.

**Paso 6 — Datos semente**
Enche `src/data/fins.json` cos 8 fins do Art. 6 e `src/data/site.json` co claim e contacto (Sección 17). Crea 2-3 entradas de exemplo por colección (mestura GL e ES) para poder estilar listaxes. **Verifica:** `getCollection('novas')` devolve as entradas.

**Paso 7 — Home**
`index.astro` (GL) e `es/index.astro` (ES) compoñendo `Hero` + `Fins` + `Destacados` + `CTAContacto`. **Verifica:** ambas as homes renderan e os destacados saen das coleccións.

**Paso 8 — Que facemos**
`que-facemos.astro` / `es/que-hacemos.astro`: misión + fins detallados + lista de actividades (Art. 6.2). **SEN equipo, SEN nomes da xunta.** **Verifica:** non aparece ningún nome de persoa.

**Paso 9 — Novas (listaxe + detalle)**
`novas/index.astro` + `es/noticias/index.astro` (tarxetas, orde por data, filtro idioma con `LangBadge`) e `novas/[slug].astro` (`getStaticPaths` sobre a colección; chrome no `lang` do contido; render Markdoc con `Prose`). **Verifica:** clic nunha tarxeta abre o detalle correcto.

**Paso 10 — Publicacións (listaxe + detalle)**
Igual ca novas, engadindo **botón de descarga do PDF** e `authors`/`tags`. **Verifica:** a descarga do PDF funciona.

**Paso 11 — Proxectos (listaxe + detalle)**
Listaxe con `status` e, no detalle, botón **"Visitar"** se hai `externalUrl` (enlazar aquí o Observatorio do Condado Paradanta). **Verifica:** a ligazón externa abre en nova pestana.

**Paso 12 — Contacto**
`contacto.astro` / `es/contacto.astro` con `ContactForm.tsx` (campos nome, email, mensaxe + honeypot `botcheck`; POST a Web3Forms; redirección a `/grazas`). Mostra os datos institucionais de `site.json`. **Verifica:** un envío de proba chega ao correo de IGIT.

**Paso 13 — Busca**
Engade script postbuild `pagefind --site dist`. Crea `buscar.astro` / `es/buscar.astro` coa illa `Search.tsx` (Pagefind UI). **Verifica:** tras `pnpm build`, a busca atopa contido.

**Paso 14 — SEO**
Sitemap (`@astrojs/sitemap`), RSS de novas (`@astrojs/rss` en `/rss.xml`), OG por páxina (`astro-og-canvas`), JSON-LD Organization, `hreflang` recíproco, `robots.txt`, canonicals, metadatos por páxina. **Verifica:** `/sitemap-index.xml` e `/rss.xml` existen e validan.

**Paso 15 — Probas**
`pnpm add -D @playwright/test`. Smoke test: todas as páxinas (GL/ES) responden 200, o troco de idioma funciona, o formulario valida, a busca devolve resultados, ningunha páxina contén nomes da xunta. **Verifica:** `pnpm test` en verde.

**Paso 16 — Despregue**
Sube o repo a GitHub. Crea unha **GitHub OAuth App** para Keystatic e configura `KEYSTATIC_*` en Vercel. Importa o proxecto en Vercel (rexión UE), define as env vars, desprega. Configura o dominio `igit.gal` se o hai. Cambia `keystatic.config.ts` a `storage: { kind: 'github', repo: 'org/igit-web' }`. **Verifica:** sitio en produción + edición funcional dende `/keystatic` en liña.

---

## 10. Configuración do contorno

### Requisitos previos
- Node.js ≥ 20
- pnpm ≥ 9
- Conta de GitHub (repo + OAuth App para Keystatic)
- Conta de Vercel (capa gratuíta)
- Conta de Web3Forms (gratuíta) → `access_key`

### Variables de contorno
| Variable | Descrición | Onde conseguila |
|----------|-----------|-----------------|
| `PUBLIC_SITE_URL` | URL canónica (ex. `https://igit.gal`) | A túa elección |
| `PUBLIC_WEB3FORMS_KEY` | Access key do formulario | web3forms.com (rexístrate co correo de IGIT) |
| `KEYSTATIC_GITHUB_CLIENT_ID` | OAuth App de GitHub (Keystatic) | GitHub → Settings → Developer settings → OAuth Apps |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | Segredo da OAuth App | Idem |
| `KEYSTATIC_SECRET` | Cadea aleatoria para asinar a sesión de Keystatic | `openssl rand -hex 32` |

> En desenvolvemento, Keystatic en modo `local` non precisa as variables `KEYSTATIC_*`.

### Comandos iniciais
```bash
pnpm install
cp .env.example .env        # enche os valores
pnpm dev                    # http://localhost:4321  (panel en /keystatic)
pnpm build                  # build estático + índice Pagefind
pnpm preview                # previsualiza o build
```

---

## 11. Dependencias

### Core
| Paquete | Función |
|---------|---------|
| `astro` | Framework |
| `@astrojs/react` | Illas React |
| `@astrojs/vercel` | Adaptador de despregue (rutas server de Keystatic) |
| `@astrojs/sitemap` | Sitemap |
| `@astrojs/rss` | Feed RSS de novas |
| `@astrojs/markdoc` | Render do corpo Markdoc |
| `tailwindcss` (v4) | Estilos |
| `@keystatic/core`, `@keystatic/astro` | Panel de edición |
| `react`, `react-dom` | Runtime das illas e do panel |
| `@fontsource-variable/space-grotesk`, `@fontsource-variable/inter` | Tipografías auto-hospedadas |

### Dev
| Paquete | Función |
|---------|---------|
| `pagefind` | Índice de busca (postbuild) |
| `astro-og-canvas` | Imaxes OG |
| `@playwright/test` | Probas E2E |
| `typescript` | Tipado |

---

## 12. Estratexia de despregue

### Hospedaxe
**Vercel**, capa gratuíta, **rexión UE** (Frankfurt `fra1`). Build automático en cada push a `main`. As rutas de Keystatic execútanse como funcións server; o resto é estático/CDN.

### CI/CD
- Push a `main` → build de produción.
- Pull requests → despregue de previsualización automático.
- Publicar contido dende `/keystatic` → commit ao repo → redespregue.
- Postbuild `pagefind --site dist` integrado no comando de build.

### Dominio e DNS
Se se adquire `igit.gal`: engadir en Vercel → Domains e apuntar os rexistros DNS que indique Vercel. Forzar HTTPS (automático).

### Contornos
- **Local:** Keystatic `local`, sen env de GitHub.
- **Produción:** Keystatic `github`, env completas en Vercel.

---

## 13. Estratexia de probas

### Unitarias
Lixeiras (Vitest opcional) para utilidades de i18n (`t`, `localizePath`) e para o filtrado/orde de contido.

### Integración
Verificar que `getCollection` lee correctamente o que escribe Keystatic (un test que cargue cada colección e valide o esquema).

### E2E (Playwright) — fluxos críticos
1. Cargan todas as páxinas GL e ES (200).
2. O `LanguageSwitcher` leva á páxina equivalente.
3. As listaxes mostran contido e o filtro de idioma funciona.
4. O formulario de contacto valida e redirixe a `/grazas`.
5. A busca devolve resultados tras o build.
6. **Garda de privacidade:** ningunha páxina contén os apelidos da xunta directiva (test que falla se aparecen).

---

## 14. Skills a usar durante o build

| Skill | Cando | Por que |
|-------|-------|---------|
| `/ui-ux-pro-max` | Paso 2 (sistema de deseño) | Afinar paleta, parellas tipográficas e estilo de compoñentes |
| `/frontend-design` | Pasos 4, 7–12 (layout e seccións) | Interfaces distintivas e de calidade de produción |
| `/humanizer` | Paso 6 (copys semente) e textos de marca | Redacción natural, sen patróns de IA |
| `/seo-audit` | Paso 14 | Auditoría técnica de SEO antes de lanzar |
| `/playwright-cli` | Paso 15 | Automatizar as probas E2E |
| `/pdf-design` | Opcional | Se algún día IGIT quere xerar informes en PDF con plantilla propia (agora só se suben) |

---

## 15. CLAUDE.md para o proxecto destino

```markdown
# IGIT — Sitio Web Institucional

Sitio web público (estático, bilingüe galego/castelán) do Instituto Galego de Intelixencia Territorial (IGIT), asociación sen ánimo de lucro. Explica os fins de IGIT e publica novas, informes e observatorios. Sen base de datos nin login de usuarios; edición vía panel Keystatic. Custo recorrente 0 €.

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
- `src/data/` — Singletons editables (`site.json`, `fins.json`).
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
```

---

## 16. Regras No Negociables (do blueprint)

1. **Sen "Quen somos" e sen nomes da xunta** en NINGUNHA páxina (decisión expresa do cliente). Inclúe un test E2E que falle se aparecen.
2. **Identidade propia de IGIT**, distinta da marca Paradanta.
3. **Bilingüe sempre na interface**; contido no idioma orixinal con `<LangBadge>`. Nada de hardcodear texto de UI sen pasar por `i18n`.
4. **Custo 0 €**: só tecnoloxías con capa gratuíta. O dominio é o único gasto admisible.
5. **Estático por defecto**: illas React só onde haxa interactividade real.
6. **Mobile-first** e **accesible** (WCAG AA, navegación por teclado, alt en imaxes).
7. **Esquemas en espello**: `keystatic.config.ts` ≡ `src/content.config.ts`.
8. **Nunca commitear segredos**; `.env` fóra do repo; fontes auto-hospedadas.
9. **Privacidade do contacto:** considerar un correo institucional (`info@igit.gal`) en vez do persoal, e teléfono/enderezo como opcionais.

---

## 17. Apéndice — Datos de IGIT (fonte: estatutos)

**Denominación:** Instituto Galego de Intelixencia Territorial (IGIT). Asociación sen ánimo de lucro (LO 1/2002).
**Ámbito:** Comunidade Autónoma de Galicia. **Duración:** indefinida.
**Sede:** rúa de Muros nº 78, Roxos–Villestro, 15896 Santiago de Compostela.
**Contacto (estatutos):** tel. 646545908 · `xgaraboa@gmail.com` *(valorar substituír por correo institucional na web)*.

### Fins (Art. 6.1) — sementar en `fins.json`
1. Promover o coñecemento, análise e estudo do territorio mediante cartografía, SIG, análise de datos, teledetección e intelixencia artificial.
2. Desenvolver proxectos e estudos de planificación territorial, paisaxe, sustentabilidade ambiental, desenvolvemento rural e xestión do territorio.
3. Impulsar o uso de tecnoloxías dixitais, análise de datos e IA aplicadas ao coñecemento, planificación e xestión do territorio.
4. Desenvolver observatorios territoriais e sistemas de monitorización baseados en datos.
5. Fomentar a educación territorial e a alfabetización cartográfica.
6. Promover o uso responsable e ético da intelixencia artificial.
7. Apoiar o desenvolvemento territorial sostible.
8. Fomentar a colaboración entre administracións, universidades e entidades.

### Actividades (Art. 6.2) — para a páxina "Que facemos"
Estudos e informes territoriais · cartografía e SIG · análise territorial e ambiental · ferramentas baseadas en IA · observatorios territoriais · cursos e formación · programas educativos · publicación de estudos · colaboración con entidades públicas e privadas.

### Vínculo con outros proxectos
O **Observatorio de Turismo e Sustentabilidade do Geodestino Condado Paradanta** é un exemplo concreto dos "observatorios territoriais" que IGIT promove → engadir como ficha en `proxectos` con `externalUrl` cando estea publicado.
