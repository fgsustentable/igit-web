import { useEffect, useId, useState } from 'react';

interface NavLink {
  href: string;
  label: string;
  current: boolean;
}

interface Props {
  links: NavLink[];
  openLabel: string;
  closeLabel: string;
  /** CTA opcional ao final do menú (ex.: Buscar). */
  searchHref: string;
  searchLabel: string;
}

export default function MobileMenu({ links, openLabel, closeLabel, searchHref, searchLabel }: Props) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-btn border border-border text-primary transition-colors hover:bg-primary/5 focus-visible:bg-primary/5"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          {/* Fondo escurecido */}
          <button
            type="button"
            aria-label={closeLabel}
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-text/40 backdrop-blur-sm"
          />
          <nav
            id={panelId}
            aria-label={openLabel}
            className="absolute right-0 top-0 flex h-full w-72 max-w-[85vw] flex-col gap-1 bg-surface p-5 shadow-xl"
          >
            <div className="mb-2 flex justify-end">
              <button
                type="button"
                aria-label={closeLabel}
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-btn border border-border text-primary"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={link.current ? 'page' : undefined}
                className={`rounded-btn px-3 py-2.5 text-base font-medium transition-colors hover:bg-primary/5 ${
                  link.current ? 'bg-primary/8 text-primary' : 'text-text'
                }`}
              >
                {link.label}
              </a>
            ))}
            <a
              href={searchHref}
              className="mt-3 inline-flex items-center gap-2 rounded-btn bg-primary px-3 py-2.5 text-base font-semibold text-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              {searchLabel}
            </a>
          </nav>
        </div>
      )}
    </div>
  );
}
