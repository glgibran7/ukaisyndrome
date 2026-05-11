import React, { useMemo, useRef, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  View,
  Text,
  Platform,
  Animated,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import {
  House,
  BookOpen,
  FileText,
  BarChart3,
  User,
  Sparkles,
} from 'lucide-react-native';

import HomeScreen from '../screens/home/HomeScreen';
import MateriScreen from '../screens/materi/MateriScreen';
import TryoutScreen from '../screens/tryout/TryoutScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import PrivateScreen from '../screens/private/PrivateScreen';

import { useTheme } from '../theme/ThemeProvider';
import { useUserStore } from '../store/userStore';

enableScreens(true);

const Tab = createBottomTabNavigator();

/* ─────────────────────────────────────────────
   ICON MAP
───────────────────────────────────────────── */
const iconMap = {
  Home: House,
  Materi: BookOpen,
  Private: Sparkles,
  Tryout: FileText,
  Hasil: BarChart3,
  Profil: User,
};

/* ─────────────────────────────────────────────
   SINGLE TAB BUTTON
───────────────────────────────────────────── */
function TabButton({
  icon: Icon,
  label,
  focused,
  color,
  onPress,
  onLongPress,
  isPro,
}) {
  const scale = useRef(new Animated.Value(1)).current;
  // Single animated value 0→1 drives everything: pill opacity + icon translate
  const progress = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(progress, {
      toValue: focused ? 1 : 0,
      useNativeDriver: true,
      damping: 16,
      stiffness: 200,
    }).start();
  }, [focused]);

  const pillOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const pillScale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.72, 1],
  });

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.88,
      useNativeDriver: true,
      damping: 10,
      stiffness: 300,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      damping: 14,
      stiffness: 200,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.tabButton}
      android_ripple={null}
    >
      {/* Icon wrapper — pill lives here, never touches label */}
      <View style={styles.iconWrapper}>
        {/* Pill background — fixed size, only opacity+scale animated */}
        <Animated.View
          style={[
            styles.pill,
            {
              backgroundColor: `${color}18`,
              opacity: pillOpacity,
              transform: [{ scaleX: pillScale }],
            },
          ]}
        />

        {/* Icon + PRO badge */}
        <Animated.View
          style={{
            transform: [{ scale }],
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={20} color={color} strokeWidth={focused ? 2.25 : 1.9} />
          {isPro && (
            <View style={styles.proBadge}>
              <Text style={styles.proBadgeText}>PRO</Text>
            </View>
          )}
        </Animated.View>
      </View>

      {/* Label — sits outside iconWrapper, never overlaps pill */}
      <Text
        style={[
          styles.tabLabel,
          {
            color,
            fontWeight: focused ? '700' : '500',
            opacity: focused ? 1 : 0.6,
          },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/* ─────────────────────────────────────────────
   CUSTOM TAB BAR
───────────────────────────────────────────── */
function CustomTabBar({ state, descriptors, navigation }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 8);

  return (
    <View
      style={[
        styles.barWrapper,
        {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: bottomPadding,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOpacity: 0.08,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: -4 },
            },
            android: {
              elevation: 12,
            },
          }),
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const Icon = iconMap[route.name] || House;
        const isPro = route.name === 'Private';

        const color = focused ? colors.primary : colors.textSecondary;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({ type: 'tabLongPress', target: route.key });
        };

        return (
          <TabButton
            key={route.key}
            icon={Icon}
            label={route.name}
            focused={focused}
            color={color}
            onPress={onPress}
            onLongPress={onLongPress}
            isPro={isPro}
          />
        );
      })}
    </View>
  );
}

/* ─────────────────────────────────────────────
   MAIN NAVIGATOR
───────────────────────────────────────────── */
export default function AppTabs() {
  const user = useUserStore(state => state.user);

  const showPrivateTab = useMemo(() => user?.mentorships != null, [user]);

  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        lazy: true,
        detachInactiveScreens: true,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Materi" component={MateriScreen} />
      {showPrivateTab && (
        <Tab.Screen name="Private" component={PrivateScreen} />
      )}
      <Tab.Screen name="Tryout" component={TryoutScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const styles = StyleSheet.create({
  barWrapper: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    minHeight: 54,
  },

  iconWrapper: {
    width: 54,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },

  tabLabel: {
    fontSize: 11,
    letterSpacing: 0.15,
  },
  pill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 999,
  },

  proBadge: {
    position: 'absolute',
    top: -6,
    right: -16,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  proBadgeText: {
    fontSize: 7,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.5,
  },
});
