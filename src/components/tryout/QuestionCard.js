import React from 'react';
import { Dimensions } from 'react-native';
import RenderHTML from 'react-native-render-html';

import AppCard from '../ui/AppCard';

const { width } = Dimensions.get('window');

export default function QuestionCard({ question, colors }) {
  return (
    <AppCard
      style={{
        borderRadius: 22,
      }}
    >
      <RenderHTML
        contentWidth={width - 40}
        source={{
          html: question?.pertanyaan || '',
        }}
        baseStyle={{
          color: colors.text,
          fontSize: 15,
          lineHeight: 26,
        }}
      />
    </AppCard>
  );
}
