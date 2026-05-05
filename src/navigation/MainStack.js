import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AppTabs from './AppTabs';

import MateriDetailScreen from '../screens/materi/MateriDetailScreen';
import VideoDetailScreen from '../screens/video/VideoDetailScreen';
import TryoutQuestionScreen from '../screens/tryout/TryoutQuestionScreen';
import HasilDetailScreen from '../screens/hasil/HasilDetailScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';

const Stack = createNativeStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={AppTabs} />

      <Stack.Screen name="MateriDetail" component={MateriDetailScreen} />
      <Stack.Screen name="VideoDetail" component={VideoDetailScreen} />
      <Stack.Screen name="TryoutQuestion" component={TryoutQuestionScreen} />
      <Stack.Screen name="HasilDetail" component={HasilDetailScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
}
