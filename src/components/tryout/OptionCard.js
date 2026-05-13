import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

import AppCard from '../ui/AppCard';

export default function OptionCard({
  option,
  text,
  selected,
  onPress,
  colors,
  spacing,
}) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <AppCard
        style={{
          marginBottom: spacing.sm,

          borderRadius: 18,

          borderWidth: 1,

          borderColor: selected ? colors.primary : colors.border,

          backgroundColor: selected ? `${colors.primary}10` : colors.card,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
          }}
        >
          <View
            style={{
              width: 34,
              height: 34,
              borderRadius: 12,

              alignItems: 'center',
              justifyContent: 'center',

              backgroundColor: selected
                ? colors.primary
                : `${colors.primary}10`,

              marginRight: 12,
            }}
          >
            <Text
              style={{
                color: selected ? '#fff' : colors.primary,

                fontWeight: '800',
              }}
            >
              {option}
            </Text>
          </View>

          <Text
            style={{
              flex: 1,
              color: colors.text,
              fontSize: 14,
              lineHeight: 24,
            }}
          >
            {text}
          </Text>
        </View>
      </AppCard>
    </TouchableOpacity>
  );
}
