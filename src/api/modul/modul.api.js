import api from '../client';
import endpoints from '../enpoints';

export async function getModulPeserta() {
  const response = await api(endpoints.modulPeserta);
  return response?.data || [];
}
