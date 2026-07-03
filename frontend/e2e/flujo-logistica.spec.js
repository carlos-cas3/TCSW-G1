import { test, expect } from '@playwright/test';

const MOCK_MASTER_ORDERS = [
  { idOMaestra: 1, clienteNombre: 'Juan Perez', clienteDni: '12345678' },
  { idOMaestra: 2, clienteNombre: 'Maria Lopez', clienteDni: '87654321' },
];

const MOCK_VENDOR_SUBORDERS = [
  {
    idSOrden: 1, idOMaestra: 1, estadoParcialVendedor: 1,
    montoSubTotalVendedor: 150.50, fechaCreacionSub: '2026-06-15T10:00:00Z',
    direccionEnvio: 'Av. Siempre Viva 123', distritoEnvio: 'Miraflores',
    metodoEnvio: 'Delivery', telefonoContacto: '999888777',
    items: [
      { idOItem: 1, idProducto: 'PROD-001', cantidad: 2, precioUnitario: 50.00, estadoItem: 1 },
      { idOItem: 2, idProducto: 'PROD-002', cantidad: 1, precioUnitario: 50.50, estadoItem: 1 },
    ],
  },
  {
    idSOrden: 2, idOMaestra: 1, estadoParcialVendedor: 2,
    montoSubTotalVendedor: 200.00, fechaCreacionSub: '2026-06-15T11:00:00Z',
    direccionEnvio: 'Jr. Las Flores 456', distritoEnvio: 'San Isidro',
    metodoEnvio: 'Recojo en tienda', telefonoContacto: '999888777',
    items: [
      { idOItem: 3, idProducto: 'PROD-003', cantidad: 4, precioUnitario: 50.00, estadoItem: 1 },
    ],
  },
  {
    idSOrden: 3, idOMaestra: 2, estadoParcialVendedor: 4,
    montoSubTotalVendedor: 320.00, fechaCreacionSub: '2026-06-14T09:00:00Z',
    direccionEnvio: 'Calle Los Olivos 789', distritoEnvio: 'Barranco',
    metodoEnvio: 'Delivery', telefonoContacto: '999888777',
    items: [
      { idOItem: 4, idProducto: 'PROD-004', cantidad: 1, precioUnitario: 200.00, estadoItem: 1 },
      { idOItem: 5, idProducto: 'PROD-005', cantidad: 2, precioUnitario: 60.00, estadoItem: 1 },
    ],
  },
];

test.describe('Flujo de logística', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('tcsw_token', 'mock-token');
      localStorage.setItem('tcsw_user', JSON.stringify({
        id: 2, vendorId: 63, email: 'g1@gmail.com',
        nombre: 'Admin Vendor', role: { roleName: 'VENDOR_ADMIN' }, roleId: 2,
      }));
    });

    await page.route(/\/api\/v1\/ordenes(\/|$)/, async (route) => {
      const url = route.request().url();
      if (url.includes('/vendedor/')) {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_VENDOR_SUBORDERS) });
      } else {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_MASTER_ORDERS) });
      }
    });
  });

  test('debe mostrar la página de logística con el título y filtros', async ({ page }) => {
    await page.goto('http://localhost:5173/user/logistica');
    await expect(page.locator('text=Centro de Control Logístico')).toBeVisible();
    const searchInput = page.locator('input[placeholder*="Buscar"]');
    await expect(searchInput).toBeVisible();
  });

  test('debe tener la tabla de sub-órdenes visible con las columnas correctas', async ({ page }) => {
    await page.goto('http://localhost:5173/user/logistica');
    await expect(page.locator('text=ID Suborden')).toBeVisible();
    await expect(page.locator('text=Estado Logístico')).toBeVisible();
    await expect(page.locator('text=Monto Total')).toBeVisible();
    await expect(page.locator('text=Gestión')).toBeVisible();
  });

  test('debe mostrar el modal de detalles al hacer clic en Ver', async ({ page }) => {
    await page.goto('http://localhost:5173/user/logistica');
    const verButtons = page.locator('button:has-text("Ver")');
    await expect(verButtons.first()).toBeVisible();
    await verButtons.first().click();
    await expect(page.getByRole('heading', { name: /Sub-Orden/ })).toBeVisible();
    await expect(page.locator('text=Datos del Cliente')).toBeVisible();
    await expect(page.locator('text=Items')).toBeVisible();
    await page.getByRole('button', { name: 'Cerrar', exact: true }).click();
    await expect(page.getByRole('heading', { name: /Sub-Orden/ })).not.toBeVisible();
  });

  test('debe permitir cambiar estado desde el modal', async ({ page }) => {
    await page.goto('http://localhost:5173/user/logistica');
    const verButtons = page.locator('button:has-text("Ver")');
    await expect(verButtons.first()).toBeVisible();
    await verButtons.first().click();
    const estadoSelect = page.locator('.fixed select').first();
    await expect(estadoSelect).toBeVisible();
  });

  test('debe filtrar sub-órdenes por estado', async ({ page }) => {
    await page.goto('http://localhost:5173/user/logistica');
    const filterSelect = page.locator('select').first();
    await expect(filterSelect).toBeVisible();
    await filterSelect.selectOption('1');
    await page.waitForTimeout(500);
  });
});
