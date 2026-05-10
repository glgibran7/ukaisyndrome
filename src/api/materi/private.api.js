import request from '../client';
import endpoints from '../enpoints';

export async function getPrivateMaterials(type = '') {
  const query = type ? `?type=${type}` : '';
  const response = await request(`${endpoints.privateMaterials}${query}`);
  return response.data || [];
}
