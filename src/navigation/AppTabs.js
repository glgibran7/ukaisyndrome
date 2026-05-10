import React, { useMemo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';

import {
  House,
  BookOpen,
  PlayCircle,
  FileText,
  BarChart3,
  User,
  Lock,
} from 'lucide-react-native';

import HomeScreen from '../screens/home/HomeScreen';
import MateriScreen from '../screens/materi/MateriScreen';
import VideoScreen from '../screens/video/VideoScreen';
import TryoutScreen from '../screens/tryout/TryoutScreen';
import HasilScreen from '../screens/hasil/HasilScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import PrivateScreen from '../screens/private/PrivateScreen';

import { useTheme } from '../theme/ThemeProvider';
import { useUserStore } from '../store/userStore';

enableScreens(true); // 🔥 performance boost

const Tab = createBottomTabNavigator();

/* ================= ICON MAP (anti re-render) ================= */
const iconMap = {
  Home: House,
  Materi: BookOpen,
  Video: PlayCircle,
  Private: Lock,
  Tryout: FileText,
  Hasil: BarChart3,
  Profil: User,
};

function TabIcon({ routeName, color, size }) {
  const Icon = iconMap[routeName] || House;
  return <Icon size={size} color={color} />;
}

/* ================= MAIN ================= */
export default function AppTabs() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const user = useUserStore(state => state.user);

  const bottomPadding = Math.max(insets.bottom, 6);

  /* ================= CONDITIONAL TAB ================= */
  const showPrivateTab = useMemo(() => {
    return user?.mentorships !== null && user?.mentorships !== undefined;
  }, [user]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        lazy: true, // 🔥 load saat dibuka
        detachInactiveScreens: true, // 🔥 hemat memory
        tabBarHideOnKeyboard: true,

        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,

        tabBarStyle: {
          position: 'absolute',
          backgroundColor: colors.surface,
          borderTopWidth: 0.5,
          borderTopColor: colors.border,
          height: 56 + bottomPadding,
          paddingBottom: bottomPadding,
          paddingTop: 6,
          elevation: 0,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },

        tabBarIcon: ({ color, size }) => (
          <TabIcon routeName={route.name} color={color} size={size ?? 20} />
        ),
      })}
    >
      {/* ================= TABS ================= */}
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Materi" component={MateriScreen} />
      <Tab.Screen name="Video" component={VideoScreen} />

      {/* ================= PRIVATE (CONDITIONAL) ================= */}
      {showPrivateTab && (
        <Tab.Screen
          name="Private"
          component={PrivateScreen}
          options={{
            tabBarLabel: ({ color }) => (
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '600',
                  color,
                  marginTop: 2,
                }}
              >
                Private
              </Text>
            ),
          }}
        />
      )}

      <Tab.Screen name="Tryout" component={TryoutScreen} />
      <Tab.Screen name="Hasil" component={HasilScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
