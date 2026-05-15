import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  Easing,
  Image,
  StatusBar,
  Dimensions,
} from 'react-native';

import DeviceInfo from 'react-native-device-info';

import { useTheme } from '../../theme/ThemeProvider';

const { width: SW, height: SH } = Dimensions.get('window');

// ─── Particle ──────────────────────────────────────────────────────────────
function Particle({ delay, color }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;

  const dx = useRef((Math.random() - 0.5) * 60).current;
  const startX = useRef(Math.random() * SW).current;
  const startY = useRef(Math.random() * SH).current;
  const duration = useRef(8000 + Math.random() * 4000).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 0.7,
              duration: duration * 0.2,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: duration * 0.8,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(translateY, {
            toValue: -140,
            duration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: dx,
            duration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: startX,
        top: startY,
        width: 3,
        height: 3,
        borderRadius: 999,
        backgroundColor: color,
        opacity,
        transform: [{ translateY }, { translateX }],
      }}
    />
  );
}

// ─── Pulsing ring ──────────────────────────────────────────────────────────
function PulsingRing({ size, delay, baseOpacity, color }) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(baseOpacity)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1.04,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: baseOpacity * 1.8,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: baseOpacity,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1,
        borderColor: color,
        opacity,
        transform: [{ scale }],
      }}
    />
  );
}

// ─── Loading dots ──────────────────────────────────────────────────────────
function LoadingDots({ color }) {
  const d0 = useRef(new Animated.Value(0.25)).current;
  const d1 = useRef(new Animated.Value(0.25)).current;
  const d2 = useRef(new Animated.Value(0.25)).current;
  const dots = [d0, d1, d2];

  useEffect(() => {
    const anims = dots.map((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 180),
          Animated.timing(dot, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.25,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.delay((dots.length - i - 1) * 180),
        ]),
      ),
    );
    anims.forEach(a => a.start());
    return () => anims.forEach(a => a.stop());
  }, []);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      {dots.map((opacity, i) => (
        <Animated.View
          key={i}
          style={{
            width: 6 - i,
            height: 6 - i,
            borderRadius: 999,
            backgroundColor: color,
            opacity,
          }}
        />
      ))}
    </View>
  );
}

// ─── SplashScreen ──────────────────────────────────────────────────────────
export default function SplashScreen() {
  const { colors, typography } = useTheme();

  const logoScale = useRef(new Animated.Value(0.75)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTransY = useRef(new Animated.Value(12)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        speed: 12,
        bounciness: 7,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(glowOpacity, {
        toValue: 0.14,
        duration: 800,
        delay: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 500,
          delay: 220,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(textTransY, {
          toValue: 0,
          duration: 500,
          delay: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const particleDelays = useRef(
    Array.from({ length: 18 }, () => Math.random() * 3000),
  ).current;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={colors.statusBar || 'dark-content'}
      />

      {/* Particles */}
      {particleDelays.map((delay, i) => (
        <Particle key={i} delay={delay} color={colors.primary} />
      ))}

      {/* Ambient glow blob */}
      <Animated.View
        style={{
          position: 'absolute',
          width: 260,
          height: 200,
          borderRadius: 130,
          backgroundColor: colors.primary,
          opacity: glowOpacity,
          top: SH / 2 - 160,
        }}
      />

      {/* Pulsing rings */}
      <PulsingRing
        size={320}
        delay={0}
        baseOpacity={0.12}
        color={colors.primary}
      />
      <PulsingRing
        size={220}
        delay={400}
        baseOpacity={0.18}
        color={colors.primary}
      />
      <PulsingRing
        size={140}
        delay={800}
        baseOpacity={0.28}
        color={colors.primary}
      />

      {/* Logo */}
      <Animated.View
        style={{
          opacity: logoOpacity,
          transform: [{ scale: logoScale }],
          marginBottom: 24,
          zIndex: 2,
        }}
      >
        <View
          style={{
            width: 88,
            height: 88,
            borderRadius: 26,
            backgroundColor: colors.card || colors.background,
            borderWidth: 1.5,
            borderColor: colors.border,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: colors.primary,
            shadowOpacity: 0.35,
            shadowRadius: 24,
            shadowOffset: { width: 0, height: 8 },
            elevation: 12,
          }}
        >
          <Image
            source={require('../../assets/images/logo.png')}
            style={{ width: 50, height: 50, resizeMode: 'contain' }}
          />
        </View>
      </Animated.View>

      {/* Text */}
      <Animated.View
        style={{
          opacity: textOpacity,
          transform: [{ translateY: textTransY }],
          alignItems: 'center',
          zIndex: 2,
        }}
      >
        <Text
          style={[
            typography.h1,
            {
              color: colors.text,
              letterSpacing: 3,
              marginBottom: 8,
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
          Menyiapkan pengalaman belajar{'\n'}terbaik untukmu…
        </Text>
      </Animated.View>

      {/* Loading dots */}
      <View style={{ position: 'absolute', bottom: 68 }}>
        <LoadingDots color={colors.primary} />
      </View>

      {/* Version */}
      <Text
        style={{
          position: 'absolute',
          bottom: 34,

          fontSize: 11,

          color: colors.textSecondary,

          letterSpacing: 0.8,

          opacity: 0.4,
        }}
      >
        v{DeviceInfo.getVersion()}
      </Text>

      <Text
        style={{
          position: 'absolute',
          bottom: 12,

          fontSize: 11,

          color: colors.textSecondary,

          opacity: 0.5,

          textAlign: 'center',

          lineHeight: 18,

          letterSpacing: 0.3,
        }}
      >
        © {new Date().getFullYear()} Outlook Project. All rights reserved.
      </Text>
    </View>
  );
}
