import { useEffect, useRef, useState } from 'react';
import { NativeModules, Platform, AppState } from 'react-native';

const { ScreenSecurity } = NativeModules;

/**
 * Blokir screenshot & screen recording khusus di halaman tertentu.
 *
 * Android : FLAG_SECURE — blokir screenshot + screen record sepenuhnya.
 * iOS     : Tidak ada API publik untuk blokir screenshot.
 *           Hook ini mendeteksi screen recording aktif dan mengembalikan
 *           `isRecording: true` agar komponen bisa menampilkan overlay hitam.
 *
 * Usage:
 *   const { isRecording } = useScreenSecurity();
 *   {isRecording && <RecordingOverlay />}
 */
export function useScreenSecurity() {
  const [isRecording, setIsRecording] = useState(false);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    // ── Android: aktifkan FLAG_SECURE ──────────────────────────────
    if (Platform.OS === 'android') {
      ScreenSecurity?.enableSecure();
      return () => {
        ScreenSecurity?.disableSecure();
      };
    }

    // ── iOS: deteksi screen recording via isCaptured ───────────────
    // React Native tidak expose UIScreen.isCaptured secara langsung,
    // tapi kita bisa poll via AppState + native check.
    // Solusi paling reliable: pakai library react-native-screenshot-prevent
    // atau deteksi via pendekatan di bawah (polling AppState).
    //
    // Jika pakai react-native-screenshot-prevent:
    //   import RNScreenshotPrevent from 'react-native-screenshot-prevent';
    //   RNScreenshotPrevent.enabled(true);
    //   return () => RNScreenshotPrevent.enabled(false);

    // Fallback tanpa library tambahan — overlay saat app tidak di foreground
    // (screen recording sering dilakukan saat app di background/preview)
    const handleAppStateChange = nextState => {
      if (nextState === 'active') {
        setIsRecording(false);
      } else {
        // inactive = screenshot/recording/multitasking di iOS
        setIsRecording(true);
      }
      appState.current = nextState;
    };

    const sub = AppState.addEventListener('change', handleAppStateChange);
    return () => sub.remove();
  }, []);

  return { isRecording };
}
