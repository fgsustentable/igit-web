import { useEffect, useRef } from 'react';

interface Props {
  /** Etiquetas traducidas da UI de Pagefind. */
  translations: {
    placeholder: string;
    clear_search: string;
    zero_results: string;
  };
}

type PagefindUIOptions = {
  element: HTMLElement;
  showSubResults?: boolean;
  showImages?: boolean;
  resetStyles?: boolean;
  translations?: Record<string, string>;
};

declare global {
  interface Window {
    PagefindUI?: new (opts: PagefindUIOptions) => unknown;
  }
}

/**
 * Illa de busca. Monta a UI de Pagefind, que se xera no build en `/pagefind/`.
 * En `astro dev` ese directorio non existe aínda: a busca só funciona tras `pnpm build`.
 */
export default function Search({ translations }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || !ref.current) return;
    initialized.current = true;
    const element = ref.current;

    if (!document.querySelector('link[data-pagefind-ui]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/pagefind/pagefind-ui.css';
      link.setAttribute('data-pagefind-ui', '');
      document.head.appendChild(link);
    }

    const init = () => {
      if (!window.PagefindUI) return;
      new window.PagefindUI({
        element,
        showSubResults: true,
        showImages: false,
        resetStyles: false,
        translations,
      });
    };

    if (window.PagefindUI) {
      init();
    } else {
      const script = document.createElement('script');
      script.src = '/pagefind/pagefind-ui.js';
      script.onload = init;
      document.body.appendChild(script);
    }
    // translations é estable (créase unha vez no servidor); init só corre unha vez.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={ref} className="pagefind-igit" />;
}
