import { test, expect } from '@playwright/test';

/** Rutas con par bilingüe (chrome no idioma de cada unha). */
const GL_ROUTES = [
  '/',
  '/que-facemos',
  '/novas',
  '/publicacions',
  '/proxectos',
  '/contacto',
  '/buscar',
  '/grazas',
];
const ES_ROUTES = [
  '/es/',
  '/es/que-hacemos',
  '/es/noticias',
  '/es/publicaciones',
  '/es/proyectos',
  '/es/contacto',
  '/es/buscar',
  '/es/gracias',
];
/** Mostras de páxinas de detalle (unha por colección) + feed. */
const DETAIL_ROUTES = [
  '/novas/igit-constituese-como-asociacion',
  '/publicacions/estado-da-cartografia-dixital-en-galicia',
  '/proxectos/observatorio-condado-paradanta',
  '/rss.xml',
];

const ALL_ROUTES = [...GL_ROUTES, ...ES_ROUTES, ...DETAIL_ROUTES];

test.describe('Smoke — todas as páxinas responden 200', () => {
  for (const route of ALL_ROUTES) {
    test(`200 en ${route}`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status(), `${route} debería responder 200`).toBe(200);
    });
  }
});

test.describe('Idioma da interface por ruta', () => {
  test('a home galega declara lang="gl"', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'gl');
  });

  test('a home castelá declara lang="es"', async ({ page }) => {
    await page.goto('/es/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  });

  test('o troco de idioma leva de GL a ES e mantén a sección', async ({ page }) => {
    await page.goto('/que-facemos');
    await page.getByRole('link', { name: 'Cambiar a castelán' }).click();
    await expect(page).toHaveURL(/\/es\/que-hacemos\/?$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  });
});

test.describe('Formulario de contacto', () => {
  test('mostra erros de validación cos campos baleiros', async ({ page }) => {
    await page.goto('/contacto');
    await page.getByRole('button', { name: 'Enviar mensaxe' }).click();
    await expect(page.getByText('Indica o teu nome.')).toBeVisible();
    await expect(page.getByText('Indica o teu correo.')).toBeVisible();
    await expect(page.getByText('Escribe unha mensaxe.')).toBeVisible();
  });
});

test.describe('Busca (Pagefind)', () => {
  test('devolve resultados para un termo do contido', async ({ page }) => {
    await page.goto('/buscar');
    const input = page.locator('input.pagefind-ui__search-input');
    await input.waitFor({ state: 'visible', timeout: 20_000 });
    await input.fill('territorial');
    await expect(page.locator('.pagefind-ui__result').first()).toBeVisible({ timeout: 20_000 });
  });
});

test.describe('Regra non negociable — sen "Quen somos" nin xunta directiva', () => {
  // Frases que delatarían unha páxina de equipo / nomes da xunta.
  // Se algún día se publican apelidos da xunta, engádense aquí para que falle.
  const FORBIDDEN = [
    /quen\s+somos/i,
    /qui[eé]nes?\s+somos/i,
    /xunta\s+directiva/i,
    /junta\s+directiva/i,
    /o\s+noso\s+equipo/i,
    /nuestro\s+equipo/i,
  ];

  for (const route of [...GL_ROUTES, ...ES_ROUTES, ...DETAIL_ROUTES.slice(0, 3)]) {
    test(`sen termos de equipo/xunta en ${route}`, async ({ page }) => {
      await page.goto(route);
      const body = (await page.locator('body').textContent()) ?? '';
      for (const re of FORBIDDEN) {
        expect(body, `"${re}" non debería aparecer en ${route}`).not.toMatch(re);
      }
    });
  }

  test('non existe páxina /quen-somos nin /equipo', async ({ page }) => {
    for (const route of ['/quen-somos', '/equipo', '/es/quienes-somos', '/es/equipo']) {
      const response = await page.goto(route);
      expect(response?.status(), `${route} non debería existir`).toBe(404);
    }
  });
});
