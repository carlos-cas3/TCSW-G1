import { describe, it, expect } from 'vitest';

// ───────────────────────────────────────────
// TEST 5: Lógica de filtros de órdenes
// ───────────────────────────────────────────
describe('filtro de órdenes por texto', () => {
  const ordenes = [
    { idOMaestra: 1, clienteNombre: 'Juan Perez', clienteDni: '12345678' },
    { idOMaestra: 2, clienteNombre: 'Maria Lopez', clienteDni: '87654321' },
  ];

  it('debe filtrar correctamente por nombre de cliente', () => {
    const termino = 'juan';
    const filtradas = ordenes.filter(o =>
      o.clienteNombre.toLowerCase().includes(termino)
    );
    expect(filtradas).toHaveLength(1);
    expect(filtradas[0].idOMaestra).toBe(1);
  });

  it('debe filtrar correctamente por DNI', () => {
    const termino = '87654321';
    const filtradas = ordenes.filter(o =>
      o.clienteDni.includes(termino)
    );
    expect(filtradas).toHaveLength(1);
  });

  it('debe retornar vacío si no hay coincidencias', () => {
    const termino = 'zzzz';
    const filtradas = ordenes.filter(o =>
      o.clienteNombre.toLowerCase().includes(termino)
    );
    expect(filtradas).toHaveLength(0);
  });
});

// ───────────────────────────────────────────
// TEST 6: Formato de moneda
// ───────────────────────────────────────────
describe('formato de moneda S/', () => {
  it('debe formatear correctamente con dos decimales', () => {
    const formatear = (valor) => `S/ ${valor.toFixed(2)}`;
    expect(formatear(150.5)).toBe('S/ 150.50');
    expect(formatear(0)).toBe('S/ 0.00');
    expect(formatear(99.99)).toBe('S/ 99.99');
    expect(formatear(1000)).toBe('S/ 1000.00');
  });

  it('debe manejar valores negativos', () => {
    const formatear = (valor) => `S/ ${valor.toFixed(2)}`;
    expect(formatear(-50)).toBe('S/ -50.00');
  });
});
