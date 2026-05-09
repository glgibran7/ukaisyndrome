import { getToken } from '../utils/token';
import { API_BASE_URL } from '@env';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const useAuth = options.useAuth !== false;
  const token = useAuth ? await getToken() : null;

  const response = await fetch(url, {
    ...options,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  let data = {};

  try {
    data = await response.json();
  } catch (e) {}

  console.log('REQUEST URL:', url);
  console.log('RESPONSE STATUS:', response.status);
  console.log('RESPONSE DATA:', data);

  if (!response.ok) {
    throw new Error(data?.message || 'Request failed');
  }

  return data;
}

export default request;
