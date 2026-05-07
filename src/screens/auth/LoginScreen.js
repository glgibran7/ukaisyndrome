import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

import { login } from '../../api/auth/auth.api';
import { useTheme } from '../../theme/ThemeProvider';

export default function LoginScreen({ navigation }) {
  const { colors, spacing, typography } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Login gagal', 'Email dan password wajib diisi');
      return;
    }

    try {
      setLoading(true);

      await login({
        email,
        password,
      });
      navigation.replace('Splash');
    } catch (error) {
      Alert.alert('Login gagal', error.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        padding: spacing.lg,
      }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text
        style={[
          typography.h1,
          {
            color: colors.text,
            marginBottom: spacing.xs,
          },
        ]}
      >
        Masuk
      </Text>

      <Text
        style={[
          typography.small,
          {
            color: colors.textSecondary,
            marginBottom: spacing.lg,
          },
        ]}
      >
        Login untuk melanjutkan belajar
      </Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor={colors.textSecondary}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 12,
          color: colors.text,
          marginBottom: spacing.sm,
        }}
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor={colors.textSecondary}
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 12,
          color: colors.text,
          marginBottom: spacing.md,
        }}
      />

      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        style={{
          backgroundColor: colors.primary,
          paddingVertical: 14,
          borderRadius: 12,
          alignItems: 'center',
          opacity: loading ? 0.7 : 1,
        }}
      >
        <Text
          style={[
            typography.body,
            {
              color: '#fff',
              fontWeight: '600',
            },
          ]}
        >
          {loading ? 'Memproses...' : 'Login'}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
