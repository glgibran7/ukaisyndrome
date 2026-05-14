import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AppTabs from './AppTabs';

import MateriDetailScreen from '../screens/materi/MateriDetailScreen';
import VideoDetailScreen from '../screens/video/VideoDetailScreen';
import TryoutQuestionScreen from '../screens/tryout/TryoutQuestionScreen';
import HasilDetailScreen from '../screens/hasil/HasilDetailScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import MateriViewScreen from '../screens/materi/MateriViewScreen';
import VideoViewScreen from '../screens/video/VideoViewScreen';
import ChangePasswordScreen from '../screens/profile/ChangePasswordScreen';
import PrivateViewScreen from '../screens/private/PrivateViewerScreen';
import TriOutDetailScreen from '../screens/tryout/TryoutDetailScreen';
import TryoutResultScreen from '../screens/tryout/TryoutResultScreen';
import TryoutHasilScreen from '../screens/tryout/TryoutHasilDetailScreen';

const Stack = createNativeStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={AppTabs} />

      <Stack.Screen name="MateriDetail" component={MateriDetailScreen} />
      <Stack.Screen name="MateriViewer" component={MateriViewScreen} />
      <Stack.Screen name="VideoDetail" component={VideoDetailScreen} />
      <Stack.Screen name="VideoViewer" component={VideoViewScreen} />
      <Stack.Screen name="TryoutQuestion" component={TryoutQuestionScreen} />
      <Stack.Screen name="HasilDetail" component={HasilDetailScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="PrivateViewer" component={PrivateViewScreen} />
      <Stack.Screen name="TryoutResult" component={TryoutResultScreen} />
      <Stack.Screen name="TryoutDetail" component={TriOutDetailScreen} />
      <Stack.Screen name="TryoutHasilDetail" component={TryoutHasilScreen} />
    </Stack.Navigator>
  );
}
