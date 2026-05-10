import React, { useMemo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { View, Text, Platform } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';

import {
  House,
  BookOpen,
  PlayCircle,
  FileText,
  BarChart3,
  User,
  Sparkles,
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

enableScreens(true);

const Tab = createBottomTabNavigator();

/* ================= ICON MAP ================= */

const iconMap = {
  Home: House,
  Materi: BookOpen,
  Video: PlayCircle,
  Private: Sparkles,
  Tryout: FileText,
  Hasil: BarChart3,
  Profil: User,
};

/* ================= TAB ICON ================= */

function TabIcon({ routeName, color, size }) {
  const Icon = iconMap[routeName] || House;

  /* ================= PRIVATE + PRO BADGE ================= */
  if (routeName === 'Private') {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* ICON NORMAL */}
        <Icon size={size ?? 20} color={color} />

        {/* BADGE */}
        <View
          style={{
            position: 'absolute',

            top: -6,
            right: -18,

            backgroundColor: '#F59E0B',

            paddingHorizontal: 5,
            paddingVertical: 1,

            borderRadius: 999,

            borderWidth: 1.5,
            borderColor: '#fff',
          }}
        >
          <Text
            style={{
              fontSize: 8,
              fontWeight: '900',
              color: '#fff',
              letterSpacing: 0.3,
            }}
          >
            PRO
          </Text>
        </View>
      </View>
    );
  }

  return <Icon size={size ?? 20} color={color} />;
}

/* ================= MAIN ================= */

export default function AppTabs() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const user = useUserStore(state => state.user);

  const bottomPadding = Math.max(insets.bottom, 6);

  /* ================= CONDITIONAL PRIVATE ================= */

  const showPrivateTab = useMemo(() => {
    return user?.mentorships !== null && user?.mentorships !== undefined;
  }, [user]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        lazy: true,
        detachInactiveScreens: true,
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

          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOpacity: 0.05,
              shadowRadius: 10,
              shadowOffset: {
                width: 0,
                height: -2,
              },
            },

            android: {
              elevation: 8,
            },
          }),
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },

        tabBarIcon: ({ color, size }) => (
          <TabIcon routeName={route.name} color={color} size={size} />
        ),
      })}
    >
      {/* ================= TABS ================= */}

      <Tab.Screen name="Home" component={HomeScreen} />

      <Tab.Screen name="Materi" component={MateriScreen} />

      <Tab.Screen name="Video" component={VideoScreen} />

      {/* ================= PRIVATE ================= */}

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
