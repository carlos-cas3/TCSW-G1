import { describe, it, expect } from 'vitest';
import {
  formatIdOrden,
  formatIdSubOrden,
  formatIdItem,
  renderEstadoOrden,
  renderEstadoItem,
  getBadgeEstado,
  getBadgeItem,
} from './formatters';

// ───────────────────────────────────────────
// TEST 1: Formato de IDs
// ───────────────────────────────────────────
describe('formatIdOrden', () => {
  it('debe formatear el ID de orden correctamente', () => {
    const resultado = formatIdOrden(1);
    expect(resultado).toBe('ORD-0001');
  });

  it('debe formatear IDs grandes correctamente', () => {
    const resultado = formatIdOrden(1001);
    expect(resultado).toBe('ORD-1001');
  });
});

describe('formatIdSubOrden', () => {
  it('debe formatear sub-orden correctamente', () => {
    expect(formatIdSubOrden(1)).toBe('SUB-ORD-0001');
  });
});

describe('formatIdItem', () => {
  it('debe formatear item correctamente', () => {
    expect(formatIdItem(1)).toBe('ITEM-0001');
  });
});

// ───────────────────────────────────────────
// TEST 2: Texto de estados de orden
// ───────────────────────────────────────────
describe('renderEstadoOrden', () => {
  it('debe retornar el texto correcto para cada estado numérico', () => {
    expect(renderEstadoOrden(1)).toBe('Pendiente');
    expect(renderEstadoOrden(2)).toBe('En Preparación');
    expect(renderEstadoOrden(3)).toBe('Parcial. Despachada');
    expect(renderEstadoOrden(4)).toBe('Parcial. Entregada');
    expect(renderEstadoOrden(5)).toBe('Entregada');
    expect(renderEstadoOrden(6)).toBe('En Reclamo');
    expect(renderEstadoOrden(7)).toBe('Anulada');
    expect(renderEstadoOrden(8)).toBe('Devuelta');
  });

  it('debe retornar valor por defecto para estados desconocidos', () => {
    expect(renderEstadoOrden(99)).toBe('Estado 99');
  });
});

describe('getBadgeEstado', () => {
  it('debe retornar clases CSS para cada estado', () => {
    expect(getBadgeEstado(1)).toContain('bg-amber');
    expect(getBadgeEstado(5)).toContain('bg-emerald');
    expect(getBadgeEstado(7)).toContain('bg-red');
    expect(getBadgeEstado(99)).toContain('bg-gray');
  });
});

// ───────────────────────────────────────────
// TEST 3: Texto de estados de item
// ───────────────────────────────────────────
describe('renderEstadoItem', () => {
  it('debe retornar el texto correcto para cada estado de item', () => {
    expect(renderEstadoItem(1)).toBe('Activo');
    expect(renderEstadoItem(2)).toBe('Anulado');
    expect(renderEstadoItem(3)).toBe('En Reclamo');
    expect(renderEstadoItem(4)).toBe('Devuelto');
    expect(renderEstadoItem(5)).toBe('Cambiado');
  });
});

describe('getBadgeItem', () => {
  it('debe retornar clases CSS para cada estado de item', () => {
    expect(getBadgeItem(1)).toContain('bg-emerald');
    expect(getBadgeItem(4)).toContain('bg-rose');
    expect(getBadgeItem(99)).toContain('bg-gray');
  });
});
