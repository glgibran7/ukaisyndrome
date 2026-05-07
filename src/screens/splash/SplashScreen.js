import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

import { getToken } from '../../utils/token';
import { useTheme } from '../../theme/ThemeProvider';

export default function SplashScreen({ navigation }) {
  const { colors, typography } = useTheme();

  useEffect(() => {
    const bootstrap = async () => {
      const token = await getToken();

      setTimeout(() => {
        if (token) {
          navigation.navigate('Tabs');
        } else {
          navigation.navigate('Login');
        }
      }, 1200);
    };

    bootstrap();
  }, [navigation]);

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
