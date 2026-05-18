import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Check, Eye, EyeOff } from 'lucide-react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { login } from '../../api/auth/auth.api';
import { useTheme } from '../../theme/ThemeProvider';
import AppLoader from '../../components/ui/AppLoader';
import { useToast } from '../../context/ToastProvider';
import { useUserStore } from '../../store/userStore';

const REMEMBER_ME_KEY = 'ukai-remember-email';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getErrorMessage(error) {
  const msg = (error?.message || '').toLowerCase();
  const status = error?.status || error?.statusCode || 0;

  // Jaringan
  if (
    msg.includes('network') ||
    msg.includes('timeout') ||
    msg.includes('connection') ||
    msg.includes('fetch')
  ) {
    return 'Tidak ada koneksi internet, periksa jaringanmu';
  }

  // Server error
  if (status >= 500) {
    return 'Server sedang bermasalah, coba lagi nanti';
  }

  // Kredensial salah (401 atau pesan umum dari server)
  if (
    status === 401 ||
    msg.includes('invalid credentials') ||
    msg.includes('wrong password') ||
    msg.includes('incorrect') ||
    msg.includes('unauthorized') ||
    msg.includes('password salah') ||
    msg.includes('tidak valid') ||
    msg.includes('not found') ||
    msg.includes('tidak ditemukan') ||
    msg.includes('invalid') ||
    msg.includes('wrong')
  ) {
    return 'Email atau password yang kamu masukkan salah';
  }

  // Akun dinonaktifkan
  if (
    msg.includes('disabled') ||
    msg.includes('blocked') ||
    msg.includes('banned') ||
    msg.includes('inactive') ||
    msg.includes('nonaktif')
  ) {
    return 'Akunmu dinonaktifkan, silakan hubungi admin';
  }

  // Token tidak ditemukan (dari auth.api.js)
  if (msg.includes('token tidak ditemukan')) {
    return 'Login gagal, coba beberapa saat lagi';
  }

  // Fallback
  return 'Login gagal, periksa email dan password kamu';
}

export default function LoginScreen({ onLoginSuccess }) {
  const { colors, spacing, typography } = useTheme();
  const { showToast } = useToast();
  const fetchUser = useUserStore(state => state.fetchUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secure, setSecure] = useState(true);
  const [focusedField, setFocusedField] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);

  // Load saved email saat pertama mount
  useEffect(() => {
    const loadSavedEmail = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem(REMEMBER_ME_KEY);
        if (savedEmail) {
          setEmail(savedEmail);
          setRememberMe(true);
        }
      } catch (err) {
        console.log('Gagal load saved email:', err);
      }
    };

    loadSavedEmail();
  }, []);

  const handleLogin = async () => {
    // Validasi sisi client — per field agar pesan spesifik
    if (!email.trim() && !password.trim()) {
      showToast('Email dan password tidak boleh kosong');
      return;
    }
    if (!email.trim()) {
      showToast('Email tidak boleh kosong');
      return;
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      showToast('Format email tidak valid, contoh: nama@email.com');
      return;
    }
    if (!password.trim()) {
      showToast('Password tidak boleh kosong');
      return;
    }

    try {
      setLoading(true);

      await login({
        email: email.trim(),
        password,
      });

      if (rememberMe) {
        await AsyncStorage.setItem(REMEMBER_ME_KEY, email.trim());
      } else {
        await AsyncStorage.removeItem(REMEMBER_ME_KEY);
      }

      await fetchUser();

      showToast('Login berhasil', 'success');
      onLoginSuccess?.();
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRememberMe = async () => {
    const next = !rememberMe;
    setRememberMe(next);

    if (!next) {
      try {
        await AsyncStorage.removeItem(REMEMBER_ME_KEY);
      } catch (err) {
        console.log('Gagal hapus saved email:', err);
      }
    }
  };

  const inputStyle = field => ({
    borderWidth: 1.4,
    borderColor: focusedField === field ? colors.primary : `${colors.border}CC`,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 15,
    color: colors.text,
    backgroundColor: colors.card || colors.background,
    fontSize: 15,
  });

  return (
    <SafeAreaView
      edges={['bottom']}
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <KeyboardAwareScrollView
          enableOnAndroid
          extraScrollHeight={24}
          keyboardOpeningTime={0}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.xl * 1.2,
            paddingBottom: spacing.xl * 2,
            justifyContent: 'center',
          }}
        >
          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: spacing.xl }}>
            <View
              style={{
                width: 92,
                height: 92,
                borderRadius: 28,
                backgroundColor: colors.card || colors.background,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: spacing.md,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Image
                source={require('../../assets/images/logo.png')}
                style={{ width: 58, height: 58, resizeMode: 'contain' }}
              />
            </View>

            <Text
              style={[typography.h1, { color: colors.text, marginBottom: 6 }]}
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
                  maxWidth: 290,
                },
              ]}
            >
              Login untuk melanjutkan pembelajaran
            </Text>
          </View>

          {/* Form Card */}
          <View
            style={{
              backgroundColor: colors.card || colors.background,
              borderRadius: 28,
              padding: spacing.lg,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            {/* Email */}
            <Text
              style={[
                typography.small,
                { color: colors.textSecondary, marginBottom: 8 },
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
              returnKeyType="next"
              blurOnSubmit={false}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              style={[inputStyle('email'), { marginBottom: spacing.md }]}
            />

            {/* Password */}
            <Text
              style={[
                typography.small,
                { color: colors.textSecondary, marginBottom: 8 },
              ]}
            >
              Password
            </Text>

            <View style={{ position: 'relative', marginBottom: spacing.md }}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Masukkan password"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={secure}
                returnKeyType="done"
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                onSubmitEditing={handleLogin}
                style={[inputStyle('password'), { paddingRight: 50 }]}
              />

              <TouchableOpacity
                onPress={() => setSecure(prev => !prev)}
                style={{ position: 'absolute', right: 14, top: 15 }}
              >
                {secure ? (
                  <EyeOff size={20} color={colors.textSecondary} />
                ) : (
                  <Eye size={20} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>

            {/* Remember me */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleToggleRememberMe}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: spacing.lg,
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

              <Text style={[typography.small, { color: colors.textSecondary }]}>
                Ingat saya
              </Text>
            </TouchableOpacity>

            {/* Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.9}
              style={{
                backgroundColor: colors.primary,
                paddingVertical: 16,
                borderRadius: 18,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: loading ? 0.75 : 1,
              }}
            >
              <Text
                style={[typography.body, { color: '#fff', fontWeight: '700' }]}
              >
                Masuk
              </Text>
            </TouchableOpacity>
          </View>

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
            Belum punya akun ?
          </Text>
          <Text
            style={[
              typography.small,
              {
                color: colors.textSecondary,
                textAlign: 'center',
                marginTop: spacing.xs,
              },
            ]}
          >
            Hubungi admin untuk mendapatkan akses
          </Text>
          {/* ── Footer ── */}
          <View
            style={{
              alignItems: 'center',
              marginTop: spacing.xl,
              paddingBottom: spacing.md,
            }}
          >
            {/* Divider */}
            <View
              style={{
                width: 48,
                height: 4,
                borderRadius: 999,
                backgroundColor: `${colors.primary}25`,
                marginBottom: spacing.md,
              }}
            />

            <Text
              style={{
                marginTop: 4,
                fontSize: 16,
                fontWeight: '800',
                color: colors.primary,
                letterSpacing: 0.5,
              }}
            >
              Outlook Project
            </Text>

            {/* Copyright */}
            <Text
              style={{
                marginTop: 8,
                fontSize: 11,
                color: colors.textSecondary,
                opacity: 0.7,
                textAlign: 'center',
                lineHeight: 18,
              }}
            >
              © {new Date().getFullYear()} Outlook Project. All rights reserved.
            </Text>
          </View>
        </KeyboardAwareScrollView>

        <AppLoader visible={loading} />
      </View>
    </SafeAreaView>
  );
}
