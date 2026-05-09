import React, { useEffect, useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import AuthNavigator from './AuthNavigator';
import MainStack from './MainStack';

import { getToken } from '../utils/token';

export default function RootNavigator() {
  const [ready, setReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const bootstrap = useCallback(async () => {
    const token = await getToken();

    setIsLoggedIn(!!token);
    setReady(true);
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  if (!ready) return null;

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <MainStack />
      ) : (
        <AuthNavigator onLoginSuccess={() => setIsLoggedIn(true)} />
      )}
    </NavigationContainer>
  );
}
