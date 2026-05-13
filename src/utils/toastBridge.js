// utils/toastBridge.js
let _showToast = null;

export function setToastBridge(fn) {
  _showToast = typeof fn === 'function' ? fn : null;
}

export function showToastGlobal(message, type = 'error') {
  if (typeof _showToast === 'function') {
    _showToast(message, type);
  } else {
    console.warn('[toastBridge] showToast belum terdaftar:', message);
  }
}
