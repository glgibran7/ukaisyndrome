import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import AuthNavigator from './AuthNavigator';
import MainStack from './MainStack';

import { getToken } from '../utils/token';

export default function RootNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  const checkAuth = async () => {
    const token = await getToken();
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (isLoggedIn === null) {
    return null;
  }

  return (
    <NavigationContainer onStateChange={checkAuth}>
      {isLoggedIn ? <MainStack /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
