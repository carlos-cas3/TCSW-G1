import { test, expect } from '@playwright/test';

test.describe('Flujo de reclamo', () => {
  test.use({
    storageState: undefined,
  });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('tcsw_token', 'mock-token');
      localStorage.setItem('tcsw_user', JSON.stringify({
        id: 1,
        email: 'mike@gmail.com',
        nombre: 'Super Admin',
        role: { roleName: 'SUPER_ADMIN' },
        roleId: 1,
      }));
    });
  });

  test('debe mostrar la página de nuevo reclamo con el stepper', async ({ page }) => {
    await page.goto('http://localhost:5173/admin/reclamos/nuevo');
    await expect(page.locator('text=Nueva Gestión de Reclamo')).toBeVisible();
    await expect(page.locator('text=Paso 1: Buscar Cliente por DNI')).toBeVisible();
  });

  test('debe tener el campo de búsqueda de DNI', async ({ page }) => {
    await page.goto('http://localhost:5173/admin/reclamos/nuevo');
    const input = page.locator('input[placeholder*="DNI"]');
    await expect(input).toBeVisible();
    await input.fill('12345678');
    await expect(input).toHaveValue('12345678');
  });
});
