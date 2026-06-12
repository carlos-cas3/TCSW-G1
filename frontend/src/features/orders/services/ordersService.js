import axios from 'axios';

export const obtenerOrdenesPorVendedor = async (idVendedor, token) => {
  const response = await axios.get(`https://backend-servicio-ordenes-production.up.railway.app/api/v1/ordenes/vendedor/${idVendedor}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};