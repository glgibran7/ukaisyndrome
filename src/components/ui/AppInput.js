import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

export default function AppInput(props) {
  const { colors, spacing, radius } = useTheme();

  return (
    <TextInput
      placeholderTextColor={colors.textSecondary}
      {...props}
      style={[
        styles.input,
        {
          color: colors.text,
          backgroundColor: colors.surface,
          borderColor: colors.border,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          borderRadius: radius.md,
        },
        props.style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    fontSize: 16,
  },
});
