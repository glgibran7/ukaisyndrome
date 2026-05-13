import request from '../client';

export async function getTryoutPeserta() {
  return request('/tryout/peserta');
}

export async function getTryoutResults() {
  return request('/tryout/report');
}
