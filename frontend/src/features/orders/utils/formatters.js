export const formatIdOrden = (id) => `ORD-${String(id).padStart(4, '0')}`;
export const formatIdSubOrden = (id) => `SUB-ORD-${String(id).padStart(4, '0')}`;
export const formatIdItem = (id) => `ITEM-${String(id).padStart(4, '0')}`;

export const getBadgeEstado = (estado) => {
  switch (estado) {
    case 1: return 'bg-amber-50 text-amber-700 border-amber-200';
    case 2: return 'bg-sky-50 text-sky-700 border-sky-200';
    case 3: return 'bg-blue-50 text-blue-700 border-blue-200';
    case 4: return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 5: return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    default: return 'bg-gray-100 text-gray-600 border-gray-200';
  }
};

export const getBadgeItem = (estado) => {
  return estado === 1
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : 'bg-gray-100 text-gray-600 border-gray-200';
};

export const renderEstadoOrden = (estadoNumerico) => {
  if (estadoNumerico === 1) return "Pendiente";
  if (estadoNumerico === 2) return "En Preparación";
  if (estadoNumerico === 3) return "Parcial. Despachada";
  if (estadoNumerico === 4) return "Parcial. Entregada";
  if (estadoNumerico === 5) return "Entregada";
  return `Estado ${estadoNumerico}`;
};

export const renderEstadoVendedor = (estado) => {
  if (estado === 1) return 'PENDIENTE';
  if (estado === 2) return 'EN PREPARACIÓN';
  if (estado === 3) return 'DESPACHADO';
  if (estado === 4) return 'ENTREGADO';
  return 'DESCONOCIDO';
};

export const renderEstadoItem = (estado) => {
  return estado === 1 ? 'Activo' : 'Inactivo';
};
