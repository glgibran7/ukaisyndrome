import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

const Tab = createBottomTabNavigator();

function getTabIcon(routeName, color, size) {
  switch (routeName) {
    case 'Home':
      return <House size={size} color={color} />;
    case 'Materi':
      return <BookOpen size={size} color={color} />;
    case 'Video':
      return <PlayCircle size={size} color={color} />;
    case 'Private':
      return <Lock size={size} color={color} />;
    case 'Tryout':
      return <FileText size={size} color={color} />;
    case 'Hasil':
      return <BarChart3 size={size} color={color} />;
    case 'Profil':
      return <User size={size} color={color} />;
    default:
      return <House size={size} color={color} />;
  }
}

export default function AppTabs() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const bottomPadding =
    Platform.OS === 'ios'
      ? Math.max(insets.bottom, 6)
      : Math.max(insets.bottom, 6);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,

        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 56 + bottomPadding,
          paddingTop: 6,
          paddingBottom: bottomPadding,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },

        tabBarIcon: ({ color, size }) =>
          getTabIcon(route.name, color, size ?? 20),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Materi" component={MateriScreen} />
      <Tab.Screen name="Video" component={VideoScreen} />

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

          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 34,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {/* glow tipis */}
              {focused && (
                <View
                  style={{
                    position: 'absolute',
                    width: 28,
                    height: 28,
                    borderRadius: 999,
                    backgroundColor: 'rgba(250, 204, 21, 0.14)',
                  }}
                />
              )}

              <Lock
                size={20}
                color={focused ? '#D4A017' : colors.textSecondary}
              />

              {/* badge PRO atas kanan */}
              <View
                style={{
                  position: 'absolute',
                  top: -7,
                  right: -8,
                  paddingHorizontal: 4,
                  paddingVertical: 1,
                  borderRadius: 999,
                  backgroundColor: focused ? '#D4A017' : '#B88917',

                  shadowColor: '#FACC15',
                  shadowOpacity: focused ? 0.35 : 0.15,
                  shadowRadius: focused ? 5 : 2,
                  shadowOffset: { width: 0, height: 0 },
                  elevation: focused ? 4 : 1,
                  zIndex: 2,
                }}
              >
                <Text
                  style={{
                    fontSize: 7,
                    fontWeight: '800',
                    color: '#fff',
                    letterSpacing: 0.3,
                  }}
                >
                  PRO
                </Text>
              </View>
            </View>
          ),
        }}
      />

      <Tab.Screen name="Tryout" component={TryoutScreen} />
      <Tab.Screen name="Hasil" component={HasilScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
