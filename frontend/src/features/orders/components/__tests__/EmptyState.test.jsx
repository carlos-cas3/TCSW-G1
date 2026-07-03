import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EmptyState from '../EmptyState';

// ───────────────────────────────────────────
// TEST 4: Componente EmptyState
// ───────────────────────────────────────────
describe('EmptyState', () => {
  it('debe mostrar el mensaje proporcionado', () => {
    render(<EmptyState mensaje="No hay datos disponibles" />);
    expect(screen.getByText('No hay datos disponibles')).toBeTruthy();
  });

  it('debe renderizarse aunque no tenga mensaje', () => {
    const { container } = render(<EmptyState />);
    const parrafo = container.querySelector('p');
    expect(parrafo).toBeTruthy();
    expect(parrafo.textContent).toBe('');
  });
});
