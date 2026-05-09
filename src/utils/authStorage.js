import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN_KEY = 'access_token';
const REMEMBER_ME_KEY = 'remember_me';
const LAST_EMAIL_KEY = 'last_email';

export async function saveAccessToken(token) {
  await AsyncStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export async function getAccessToken() {
  return AsyncStorage.getItem(ACCESS_TOKEN_KEY);
}

export async function removeAccessToken() {
  await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
}

export async function saveRememberMe(value) {
  await AsyncStorage.setItem(REMEMBER_ME_KEY, value ? 'true' : 'false');
}

export async function getRememberMe() {
  const value = await AsyncStorage.getItem(REMEMBER_ME_KEY);
  return value === 'true';
}

export async function saveLastEmail(email) {
  await AsyncStorage.setItem(LAST_EMAIL_KEY, email);
}

export async function getLastEmail() {
  return AsyncStorage.getItem(LAST_EMAIL_KEY);
}

export async function clearRememberedEmail() {
  await AsyncStorage.removeItem(LAST_EMAIL_KEY);
}
