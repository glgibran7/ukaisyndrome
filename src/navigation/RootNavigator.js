import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import AuthNavigator from './AuthNavigator';
import MainStack from './MainStack';
import SplashScreen from '../screens/splash/SplashScreen';

import { getToken } from '../utils/token';
import { useUserStore } from '../store/userStore';

export default function RootNavigator() {
  const [ready, setReady] = useState(false);

  const user = useUserStore(state => state.user);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await getToken();
      } finally {
        setTimeout(() => {
          setReady(true);
        }, 900);
      }
    };

    bootstrap();
  }, []);

  if (!ready) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {user ? <MainStack /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
