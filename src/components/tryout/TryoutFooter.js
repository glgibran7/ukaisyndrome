import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import { ChevronLeft, ChevronRight, Flag } from 'lucide-react-native';

export default function TryoutFooter({
  colors,
  spacing,
  currentIndex,
  questions,
  currentAnswer,
  toggleRagu,
  currentQuestion,
  setCurrentIndex,
}) {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,

        padding: spacing.md,

        backgroundColor: colors.background,

        borderTopWidth: 1,
        borderTopColor: colors.border,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => toggleRagu(currentQuestion.id)}
        style={{
          height: 48,
          borderRadius: 16,

          alignItems: 'center',
          justifyContent: 'center',

          marginBottom: spacing.sm,

          flexDirection: 'row',

          backgroundColor: currentAnswer?.ragu ? '#7C3AED' : colors.card,

          borderWidth: 1,
          borderColor: currentAnswer?.ragu ? '#7C3AED' : colors.border,
        }}
      >
        <Flag
          size={18}
          color={currentAnswer?.ragu ? '#fff' : colors.textSecondary}
        />

        <Text
          style={{
            marginLeft: 8,

            color: currentAnswer?.ragu ? '#fff' : colors.text,

            fontWeight: '700',
          }}
        >
          Tandai Ragu-ragu
        </Text>
      </TouchableOpacity>

      <View
        style={{
          flexDirection: 'row',
        }}
      >
        <TouchableOpacity
          disabled={currentIndex === 0}
          onPress={() => setCurrentIndex(prev => prev - 1)}
          style={{
            flex: 1,

            height: 52,

            borderRadius: 16,

            alignItems: 'center',
            justifyContent: 'center',

            marginRight: 8,

            backgroundColor: colors.card,

            borderWidth: 1,
            borderColor: colors.border,

            opacity: currentIndex === 0 ? 0.5 : 1,
          }}
        >
          <ChevronLeft size={22} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            setCurrentIndex(prev =>
              prev + 1 >= questions.length ? prev : prev + 1,
            )
          }
          style={{
            flex: 4,

            height: 52,

            borderRadius: 16,

            alignItems: 'center',
            justifyContent: 'center',

            flexDirection: 'row',

            backgroundColor: colors.primary,
          }}
        >
          <Text
            style={{
              color: '#fff',
              fontWeight: '800',
              marginRight: 8,
            }}
          >
            Soal Berikutnya
          </Text>

          <ChevronRight size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
