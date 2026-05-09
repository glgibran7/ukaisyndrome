import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

export default function SplashScreen() {
  const { colors, typography } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={[
          typography.h1,
          {
            color: colors.text,
            marginBottom: 20,
          },
        ]}
      >
        UKAI
      </Text>

      <ActivityIndicator size="small" color={colors.primary} />
    </View>
  );
}
