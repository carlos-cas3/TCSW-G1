import { fetchWithAuth } from "../../../shared/api/httpClient";
import { API } from "../../../config/api";

const POSTVENTA_URL = `${API.POSTVENTA}/api/v1/reclamos`;

export const buscarOrdenesPorDni = (dni) => fetchWithAuth(`${POSTVENTA_URL}/buscar-orden/${dni}`);

export const crearTicket = (data) =>
  fetchWithAuth(`${POSTVENTA_URL}/tickets`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const listarTicketsPorVendedor = (idVendedor) =>
  fetchWithAuth(`${POSTVENTA_URL}/tickets/vendedor/${idVendedor}`);

export const aprobarTicket = (id, data) =>
  fetchWithAuth(`${POSTVENTA_URL}/tickets/${id}/aprobar`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const rechazarTicket = (id, data) =>
  fetchWithAuth(`${POSTVENTA_URL}/tickets/${id}/rechazar`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const anularSubOrden = (id) =>
  fetchWithAuth(`${POSTVENTA_URL}/suborden/${id}/anular`, {
    method: "PUT",
  });

export const anularItem = (id) =>
  fetchWithAuth(`${POSTVENTA_URL}/items/${id}/anular`, {
    method: "PUT",
  });

export const obtenerDetalleItems = (ids) =>
  fetchWithAuth(`${POSTVENTA_URL}/items/detalle`, {
    method: "POST",
    body: JSON.stringify(ids),
  });

export const listarTodosLosTickets = () =>
  fetchWithAuth(`${POSTVENTA_URL}/tickets`);

export const obtenerHistorial = (idTicket) =>
  fetchWithAuth(`${POSTVENTA_URL}/tickets/${idTicket}/historial`);
