import api from '../client';
import { saveToken, removeToken } from '../../utils/token';
import { saveAccessToken, removeAccessToken } from '../../utils/authStorage';
import endpoints from '../enpoints';

export async function login({ email, password }) {
  // bersihkan token lama dulu supaya login benar-benar fresh
  await removeToken();
  await removeAccessToken();

  const response = await api(endpoints.login, {
    method: 'POST',
    useAuth: false,
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
  await saveAccessToken(accessToken);

  return response;
}
