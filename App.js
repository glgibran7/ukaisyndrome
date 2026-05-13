import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider, useTheme } from './src/theme/ThemeProvider';
import RootNavigator from './src/navigation/RootNavigator';
import { ToastProvider } from './src/context/ToastProvider';

import { useUserStore } from './src/store/userStore';

function AppContent() {
  const { mode } = useTheme();

  const logout = useUserStore(state => state.logout);

  useEffect(() => {
    global.logout = logout;

    return () => {
      global.logout = undefined;
    };
  }, [logout]);

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
      />

      <RootNavigator />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
