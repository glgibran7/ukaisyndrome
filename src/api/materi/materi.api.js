import api from '../client';

export async function getMateriPeserta(idModul) {
  const response = await api(`/materi/peserta/${idModul}`);
  return response?.data || [];
}
