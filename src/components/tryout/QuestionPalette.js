import React from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';

export default function QuestionPalette({
  questions,
  answers,
  currentIndex,
  setCurrentIndex,
  colors,
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {questions.map((item, index) => {
        const answered = answers?.[item.id]?.answer;

        const active = index === currentIndex;

        return (
          <TouchableOpacity
            key={item.id}
            onPress={() => setCurrentIndex(index)}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,

              marginRight: 10,

              alignItems: 'center',
              justifyContent: 'center',

              backgroundColor: active
                ? colors.primary
                : answered
                ? '#22C55E'
                : colors.card,

              borderWidth: 1,
              borderColor: active ? colors.primary : colors.border,
            }}
          >
            <Text
              style={{
                color: active ? '#fff' : answered ? '#fff' : colors.text,

                fontWeight: '700',
              }}
            >
              {index + 1}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
