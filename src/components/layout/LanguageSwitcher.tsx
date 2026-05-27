import { useEffect, useState } from 'react';

type Lang = 'gl' | 'es';

/** Táboa mínima e autocontida (non importa as traducións para non inflar o bundle). */
const PAIRS: ReadonlyArray<readonly [string, string]> = [
  ['/', '/es/'],
  ['/que-facemos', '/es/que-hacemos'],
  ['/novas', '/es/noticias'],
  ['/publicacions', '/es/publicaciones'],
  ['/proxectos', '/es/proyectos'],
  ['/contacto', '/es/contacto'],
  ['/buscar', '/es/buscar'],
  ['/grazas', '/es/gracias'],
];

function normalize(path: string): string {
  if (path === '/es') return '/es/';
  if (path === '/' || path === '/es/') return path;
  return path.replace(/\/$/, '');
}

function resolve(pathname: string, to: Lang): string {
  const current = normalize(pathname);
  for (const [gl, es] of PAIRS) {
    if (normalize(gl) === current || normalize(es) === current) {
      return to === 'gl' ? gl : es;
    }
  }
  // Páxina de detalle ou descoñecida: cae á portada do idioma destino.
  return to === 'gl' ? '/' : '/es/';
}

interface Props {
  /** Idioma actual da páxina. */
  lang: Lang;
  /** Ruta equivalente calculada no servidor (estado inicial sen JS). */
  fallbackHref: string;
  /** Etiqueta accesible. */
  label: string;
}

export default function LanguageSwitcher({ lang, fallbackHref, label }: Props) {
  const to: Lang = lang === 'gl' ? 'es' : 'gl';
  const [href, setHref] = useState(fallbackHref);

  useEffect(() => {
    setHref(resolve(window.location.pathname, to));
  }, [to]);

  return (
    <a
      href={href}
      hrefLang={to}
      lang={to}
      aria-label={label}
      className="inline-flex items-center gap-1 rounded-btn border border-border px-2.5 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white focus-visible:bg-primary focus-visible:text-white"
    >
      <span aria-hidden="true">{to.toUpperCase()}</span>
    </a>
  );
}
