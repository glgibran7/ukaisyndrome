import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import AuthNavigator from './AuthNavigator';
import MainStack from './MainStack';

import { getToken } from '../utils/token';
import { useUserStore } from '../store/userStore';

export default function RootNavigator() {
  const [ready, setReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const user = useUserStore(state => state.user);

  useEffect(() => {
    const bootstrap = async () => {
      const token = await getToken();

      setIsLoggedIn(!!token);
      setReady(true);
    };

    bootstrap();
  }, []);

  useEffect(() => {
    if (!ready) return;

    setIsLoggedIn(!!user);
  }, [user, ready]);

  if (!ready) return null;

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainStack /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
