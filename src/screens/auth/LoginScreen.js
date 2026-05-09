import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';

import { Check, Eye, EyeOff } from 'lucide-react-native';

import { login } from '../../api/auth/auth.api';
import { useTheme } from '../../theme/ThemeProvider';
import AppLoader from '../../components/ui/AppLoader';
import { useToast } from '../../context/ToastProvider';

export default function LoginScreen({ navigation, onLoginSuccess }) {
  const { colors, spacing, typography } = useTheme();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [secure, setSecure] = useState(true);
  const [focusedField, setFocusedField] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showToast('Email dan password wajib diisi');
      return;
    }

    try {
      setLoading(true);

      await login({
        email: email.trim(),
        password,
      });

      showToast('Login berhasil', 'success');

      onLoginSuccess?.();

      // Tidak perlu navigation.replace()
      // RootNavigator akan otomatis pindah ke MainStack
    } catch (error) {
      showToast(error?.message || 'Email atau password tidak valid', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = field => ({
    borderWidth: 1.5,
    borderColor: focusedField === field ? colors.primary : colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.text,
    backgroundColor: colors.card || colors.background,
    fontSize: 15,
  });

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.xl * 1.2,
          paddingBottom: spacing.xl,
        }}
      >
        {/* Header */}
        <View
          style={{
            alignItems: 'center',
            marginBottom: spacing.xl,
          }}
        >
          <View
            style={{
              width: 82,
              height: 82,
              borderRadius: 24,
              backgroundColor: colors.card || colors.background,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: spacing.lg,
              marginBottom: spacing.md,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Image
              source={require('../../assets/images/logo.png')}
              style={{
                width: 52,
                height: 52,
                resizeMode: 'contain',
              }}
            />
          </View>

          <Text
            style={[
              typography.h1,
              {
                color: colors.text,
                marginBottom: 6,
              },
            ]}
          >
            Selamat Datang
          </Text>

          <Text
            style={[
              typography.small,
              {
                color: colors.textSecondary,
                textAlign: 'center',
                lineHeight: 20,
                maxWidth: 280,
              },
            ]}
          >
            Masuk ke akunmu untuk melanjutkan belajar bersama UKAI.
          </Text>
        </View>

        {/* Form Card */}
        <View
          style={{
            backgroundColor: colors.card || colors.background,
            borderRadius: 24,
            padding: spacing.lg,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          {/* Email */}
          <Text
            style={[
              typography.small,
              {
                color: colors.textSecondary,
                marginBottom: 8,
              },
            ]}
          >
            Email
          </Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Masukkan email"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="none"
            keyboardType="email-address"
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            style={[
              inputStyle('email'),
              {
                marginBottom: spacing.md,
              },
            ]}
          />

          {/* Password */}
          <Text
            style={[
              typography.small,
              {
                color: colors.textSecondary,
                marginBottom: 8,
              },
            ]}
          >
            Password
          </Text>

          <View
            style={{
              position: 'relative',
              marginBottom: spacing.md,
            }}
          >
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Masukkan password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry={secure}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              style={[
                inputStyle('password'),
                {
                  paddingRight: 48,
                },
              ]}
            />

            <TouchableOpacity
              onPress={() => setSecure(prev => !prev)}
              style={{
                position: 'absolute',
                right: 14,
                top: 14,
              }}
            >
              {secure ? (
                <EyeOff size={20} color={colors.textSecondary} />
              ) : (
                <Eye size={20} color={colors.textSecondary} />
              )}
            </TouchableOpacity>
          </View>

          {/* Remember Me UI only */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: spacing.lg,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setRememberMe(prev => !prev)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 6,
                  borderWidth: 1.5,
                  borderColor: rememberMe ? colors.primary : colors.border,
                  backgroundColor: rememberMe ? colors.primary : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 10,
                }}
              >
                {rememberMe && <Check size={13} color="#fff" strokeWidth={3} />}
              </View>

              <Text
                style={[
                  typography.small,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                Ingat saya
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.9}
            style={{
              backgroundColor: colors.primary,
              paddingVertical: 15,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: loading ? 0.75 : 1,
            }}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text
                style={[
                  typography.body,
                  {
                    color: '#fff',
                    fontWeight: '700',
                  },
                ]}
              >
                Masuk
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text
          style={[
            typography.small,
            {
              color: colors.textSecondary,
              textAlign: 'center',
              marginTop: spacing.lg,
            },
          ]}
        >
          Belajar lebih terarah bersama mentor terbaik.
        </Text>
      </ScrollView>

      <AppLoader visible={loading} />
    </KeyboardAvoidingView>
  );
}
