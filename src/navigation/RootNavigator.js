import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import AuthNavigator from './AuthNavigator';
import MainStack from './MainStack';
import SplashScreen from '../screens/splash/SplashScreen';

import { getToken } from '../utils/token';

export default function RootNavigator() {
  const [ready, setReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    bootstrap();
  }, []);

  const bootstrap = async () => {
    try {
      const token = await getToken();
      setIsLoggedIn(!!token);
    } finally {
      setTimeout(() => {
        setReady(true);
      }, 900);
    }
  };

  if (!ready) {
    return <SplashScreen />;
  }

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
