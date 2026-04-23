import { expect, test } from '@playwright/test';

test('homepage renders core public content', async ({ page }) => {
	await page.goto('http://127.0.0.1:4173/');

	await expect(page).toHaveTitle(/Sikopling Kalsel/i);
	await expect(page.getByRole('heading', { name: 'SIKOPLING', exact: true })).toBeVisible();
	await expect(page.getByText('Capaian SIKOPLING Secara Ringkas')).toBeVisible();
});
