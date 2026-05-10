import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, Image, StatusBar } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';

export default function SplashScreen() {
  const { colors, typography } = useTheme();

  const logoScale = useRef(new Animated.Value(0.88)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const dotOpacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        speed: 14,
        bounciness: 5,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 550,
        delay: 120,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(dotOpacity, {
          toValue: 1,
          duration: 550,
          useNativeDriver: true,
        }),
        Animated.timing(dotOpacity, {
          toValue: 0.3,
          duration: 550,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
      }}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <Animated.View
        style={{
          opacity: logoOpacity,
          transform: [{ scale: logoScale }],
          marginBottom: 22,
        }}
      >
        <View
          style={{
            width: 92,
            height: 92,
            borderRadius: 28,
            backgroundColor: colors.card || '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: colors.border,
            shadowColor: '#000',
            shadowOpacity: 0.06,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 8 },
            elevation: 4,
          }}
        >
          <Image
            source={require('../../assets/images/logo.png')}
            style={{
              width: 58,
              height: 58,
              resizeMode: 'contain',
            }}
          />
        </View>
      </Animated.View>

      <Animated.View
        style={{
          opacity: textOpacity,
          alignItems: 'center',
        }}
      >
        <Text
          style={[
            typography.h1,
            {
              color: colors.text,
              marginBottom: 6,
            },
          ]}
        >
          UKAI
        </Text>

        <Text
          style={[
            typography.small,
            {
              color: colors.textSecondary,
              textAlign: 'center',
              lineHeight: 20,
            },
          ]}
        >
          Menyiapkan pengalaman belajar terbaik...
        </Text>
      </Animated.View>

      <Animated.View
        style={{
          position: 'absolute',
          bottom: 58,
          opacity: dotOpacity,
        }}
      >
        <View
          style={{
            width: 7,
            height: 7,
            borderRadius: 999,
            backgroundColor: colors.primary,
          }}
        />
      </Animated.View>
    </View>
  );
}
