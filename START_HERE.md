# START HERE — IGIT Web

Este cartafol é o **workspace de construción** do sitio web de **IGIT (Instituto Galego de Intelixencia Territorial)**. O deseño xa está feito; aquí constrúese o sitio.

> ⚠️ Este workspace foi preparado por **The Architect**, que só deseña. A construción real faina **unha sesión NOVA de Claude Code aberta nesta carpeta** (`D:\IGIT_WEB`).

---

## Como arrincar (sesión nova de Claude Code)

1. Abre Claude Code **nesta carpeta** (`D:\IGIT_WEB`).
2. Le, por esta orde:
   - `CLAUDE.md` — contexto permanente do proxecto.
   - `docs/blueprint.md` — o deseño completo (17 seccións).
3. Segue a **Sección 9 — Orde de construción** do blueprint, paso a paso (16 pasos, do andamiaxe ao despregue). Verifica cada paso antes de pasar ao seguinte.

Primeiro comando (Paso 1):
```bash
pnpm create astro@latest igit-web -- --template minimal --typescript strict --no-git
```
*(Podes scaffolding directamente nesta carpeta; axusta a ruta se Astro crea unha subcarpeta.)*

---

## Sementes xa preparadas

En `seed/` tes contido inicial para copiar a `src/data/` no Paso 6:
- `seed/fins.json` → `src/data/fins.json` (os 8 fins do Art. 6 + actividades, bilingüe GL/ES).
- `seed/site.json` → `src/data/site.json` (claim, hero, contacto).

---

## 🔒 Regras que NON se poden romper

1. **Nada de "Quen somos" e nada de nomes da xunta directiva** en ningunha páxina. O sitio fala do *que fai* IGIT, non de *quen* o forma. (Hai un test E2E que debe fallar se aparecen apelidos da xunta.)
2. **Identidade propia de IGIT** (petróleo `#0E4F5C` + verde `#2E7D5B` + ámbar `#E0A458`). **NON** usar a marca do xeodestino Condado Paradanta.
3. **Bilingüe**: interface sempre traducida; o contido pode ir nun só idioma, sempre con etiqueta GL/ES.
4. **Custo 0 €**: só servizos con capa gratuíta.

---

## Contas a crear antes do despregue (Paso 16)

- **GitHub** — repo + OAuth App para Keystatic (`KEYSTATIC_GITHUB_*`).
- **Vercel** — importar repo, rexión UE, definir env vars.
- **Web3Forms** — rexistro co correo de IGIT → `PUBLIC_WEB3FORMS_KEY`.
- (Opcional) dominio `igit.gal`.

En desenvolvemento, Keystatic funciona en modo `local` sen ningunha conta.

---

## Decisións do cliente (Xaime)

- **Correo de contacto:** `info@igit.gal` (institucional). Xa fixado en `seed/site.json`. ⚠️ Para que o formulario (Web3Forms) entregue o correo, esa caixa debe existir; mentres non se cree o dominio/buzón, rexistrar Web3Forms cunha caixa que funcione.
- **Teléfono e enderezo:** **NON se publican** (privacidade). Quitados de `site.json`.
- **Observatorio Condado Paradanta:** engadir como ficha en *Proxectos* (`externalUrl`) cando estea en liña.

---

## Estrutura deste workspace
```
D:\IGIT_WEB\
  CLAUDE.md            # contexto do proxecto (para a sesión de build)
  START_HERE.md        # este ficheiro
  docs/
    blueprint.md       # deseño completo (fonte da verdade)
  seed/
    fins.json          # → src/data/fins.json
    site.json          # → src/data/site.json
```
