import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import AuthNavigator from './AuthNavigator';
import MainStack from './MainStack';

export default function RootNavigator() {
  const isLoggedIn = true;

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainStack /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
