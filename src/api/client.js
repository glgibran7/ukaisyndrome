import AsyncStorage from '@react-native-async-storage/async-storage';

import { getToken, removeToken } from '../utils/token';
import { removeAccessToken } from '../utils/authStorage';
import { showToastGlobal } from '../utils/toastBridge'; // ← ganti Alert

import { API_BASE_URL } from '@env';

let isLogoutTriggered = false;

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

  // ─── HANDLE 401 ─────────────────────────────
  if (response.status === 401) {
    const message =
      data?.message || data?.status || 'Session invalid or expired';

    const lowerMessage = message.toLowerCase();

    // LOGIN SALAH → jangan logout global
    if (
      lowerMessage.includes('invalid credentials') ||
      lowerMessage.includes('wrong password') ||
      lowerMessage.includes('email atau password')
    ) {
      throw { status: response.status, message };
    }

    // TOKEN INVALID / LOGIN DEVICE LAIN
    if (!isLogoutTriggered) {
      isLogoutTriggered = true;

      // Tampilkan toast error
      showToastGlobal(
        'Akun sedang digunakan di perangkat lain. Silakan login kembali.',
        'error',
      );

      // Jalankan logout setelah toast muncul
      setTimeout(async () => {
        try {
          await removeToken();
          await removeAccessToken();

          await AsyncStorage.multiRemove([
            'user',
            'access_token',
            'refresh_token',
          ]);

          global.logout?.();
        } catch (e) {
          console.log('Logout error:', e);
        } finally {
          isLogoutTriggered = false;
        }
      }, 1800); // beri jeda agar toast sempat terbaca sebelum redirect
    }

    throw { status: response.status, message };
  }

  // ─── HANDLE ERROR ───────────────────────────
  if (!response.ok) {
    throw {
      status: response.status,
      message: data?.message || 'Request failed',
    };
  }

  return data;
}

export default request;
