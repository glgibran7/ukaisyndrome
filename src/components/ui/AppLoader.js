import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';

export default function AppLoader({ visible, text = 'Memuat...' }) {
  const { colors, typography } = useTheme();

  if (!visible) return null;

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
      }}
    >
      <View
        style={{
          backgroundColor: colors.card || colors.background,
          paddingHorizontal: 24,
          paddingVertical: 20,
          borderRadius: 18,
          alignItems: 'center',
          minWidth: 140,
        }}
      >
        <ActivityIndicator size="small" color={colors.primary} />

        <Text
          style={[
            typography.small,
            {
              color: colors.text,
              marginTop: 10,
            },
          ]}
        >
          {text}
        </Text>
      </View>
    </View>
  );
}
