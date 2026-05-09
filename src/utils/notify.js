import { Alert } from 'react-native';

export function showError(message = 'Terjadi kesalahan') {
  Alert.alert('Oops', message);
}

export function showSuccess(message = 'Berhasil') {
  Alert.alert('Berhasil', message);
}

export function showInfo(message = '') {
  Alert.alert('Informasi', message);
}
