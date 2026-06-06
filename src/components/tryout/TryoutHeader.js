import React from 'react';
import { View, Text } from 'react-native';
import { Clock3 } from 'lucide-react-native';

export default function TryoutHeader({
  colors,
  spacing,
  currentIndex,
  formattedTime,
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
      }}
    >
      <Text
        style={{
          color: colors.text,
          fontSize: 18,
          fontWeight: '800',
        }}
      >
        Soal {currentIndex + 1}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: `${colors.primary}12`,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 14,
        }}
      >
        <Clock3 size={16} color={colors.primary} />

        <Text
          style={{
            color: colors.primary,
            fontWeight: '800',
            marginLeft: 6,
          }}
        >
          {formattedTime}
        </Text>
      </View>
    </View>
  );
}
