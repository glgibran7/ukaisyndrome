import api from '../client';
import { saveToken } from '../../utils/token';
import { endpoints } from '../enpoints';

export async function login({ email, password }) {
  const response = await api(endpoints.login, {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      platform: 'mobile',
    }),
  });

  const accessToken = response?.data?.access_token;
  const refreshToken = response?.data?.refresh_token;

  if (!accessToken) {
    throw new Error('Token tidak ditemukan');
  }

  await saveToken(accessToken, refreshToken);

  return response;
}
