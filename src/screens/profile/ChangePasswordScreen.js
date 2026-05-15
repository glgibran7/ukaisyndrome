import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

import { ChevronLeft, House, Eye, EyeOff } from 'lucide-react-native';
import AppLayout from '../../components/AppLayout';
import AppCard from '../../components/ui/AppCard';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import { changePassword } from '../../api/user/user.api';
import { useToast } from '../../context/ToastProvider';

export default function ChangePasswordScreen({ navigation }) {
  const { colors, spacing, typography } = useTheme();
  const { showToast } = useToast();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      showToast('Semua field wajib diisi', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('Password baru tidak sama', 'error');
      return;
    }

    try {
      setLoading(true);

      await changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      });

      showToast('Password berhasil diubah', 'success');

      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        navigation.goBack();
      }, 400);
    } catch (err) {
      showToast(
        err?.message || 'Password lama salah atau server error',
        'error',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      edges={['bottom']}
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <AppLayout>
        <View
          style={{
            flex: 1,
            paddingTop: spacing.md,
            paddingHorizontal: spacing.md,
          }}
        >
          {/* HEADER */}
          <View
            style={{
              marginBottom: spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                marginRight: spacing.sm,
                padding: 4,
              }}
            >
              <ChevronLeft size={22} color={colors.text} />
            </TouchableOpacity>

            <View style={{ flex: 1 }}>
              <Text style={[typography.small, { color: colors.textSecondary }]}>
                Keamanan akun
              </Text>

              <Text
                style={[
                  typography.h3,
                  {
                    color: colors.text,
                    marginTop: 2,
                  },
                ]}
              >
                Ganti Password
              </Text>
            </View>

            <TouchableOpacity
              onPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'Tabs',
                      state: {
                        routes: [{ name: 'Home' }],
                      },
                    },
                  ],
                })
              }
              style={{
                marginLeft: spacing.sm,
                width: 38,
                height: 38,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: `${colors.primary}14`,
                borderWidth: 1,
                borderColor: `${colors.primary}25`,
              }}
            >
              <House size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* FORM */}
          <AppCard style={{ marginBottom: spacing.sm }}>
            <Text
              style={[
                typography.small,
                { color: colors.textSecondary, marginBottom: 6 },
              ]}
            >
              Password Lama
            </Text>

            <View
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 12,
              }}
            >
              <TextInput
                value={oldPassword}
                onChangeText={setOldPassword}
                secureTextEntry={!showOldPassword}
                placeholder="Masukkan password lama"
                placeholderTextColor={colors.textSecondary}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  color: colors.text,
                }}
              />

              <TouchableOpacity
                onPress={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? (
                  <EyeOff size={20} color={colors.textSecondary} />
                ) : (
                  <Eye size={20} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
          </AppCard>

          <AppCard style={{ marginBottom: spacing.sm }}>
            <Text
              style={[
                typography.small,
                { color: colors.textSecondary, marginBottom: 6 },
              ]}
            >
              Password Baru
            </Text>

            <View
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 12,
              }}
            >
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
                placeholder="Masukkan password baru"
                placeholderTextColor={colors.textSecondary}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  color: colors.text,
                }}
              />

              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff size={20} color={colors.textSecondary} />
                ) : (
                  <Eye size={20} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
          </AppCard>

          <AppCard style={{ marginBottom: spacing.md }}>
            <Text
              style={[
                typography.small,
                { color: colors.textSecondary, marginBottom: 6 },
              ]}
            >
              Konfirmasi Password
            </Text>

            <View
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 12,
              }}
            >
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                placeholder="Ulangi password baru"
                placeholderTextColor={colors.textSecondary}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  color: colors.text,
                }}
              />

              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color={colors.textSecondary} />
                ) : (
                  <Eye size={20} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
          </AppCard>

          {/* BUTTON */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            style={{
              backgroundColor: colors.primary,
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: 'center',
              opacity: loading ? 0.7 : 1,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>
              {loading ? 'Menyimpan...' : 'Simpan Password'}
            </Text>
          </TouchableOpacity>
        </View>
      </AppLayout>
    </SafeAreaView>
  );
}
