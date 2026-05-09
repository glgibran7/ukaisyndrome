import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';

import { ChevronLeft, House } from 'lucide-react-native';

import AppLayout from '../../components/AppLayout';
import AppCard from '../../components/ui/AppCard';

import { useTheme } from '../../theme/ThemeProvider';
import { changePassword } from '../../api/user/user.api';

export default function ChangePasswordScreen({ navigation }) {
  const { colors, spacing, typography } = useTheme();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Semua field wajib diisi');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Password baru tidak sama');
      return;
    }

    try {
      setLoading(true);

      await changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      });

      Alert.alert('Sukses', 'Password berhasil diubah');

      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');

      navigation.goBack();
    } catch (err) {
      Alert.alert('Gagal', 'Password lama salah atau server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <View
        style={{
          flex: 1,
          paddingTop: spacing.md,
          paddingHorizontal: spacing.md,
        }}
      >
        {/* HEADER (CONSISTENT WITH MATERI DETAIL STYLE) */}
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

          <TextInput
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry
            placeholder="Masukkan password lama"
            placeholderTextColor={colors.textSecondary}
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 12,
              padding: 12,
              color: colors.text,
            }}
          />
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

          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            placeholder="Masukkan password baru"
            placeholderTextColor={colors.textSecondary}
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 12,
              padding: 12,
              color: colors.text,
            }}
          />
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

          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholder="Ulangi password baru"
            placeholderTextColor={colors.textSecondary}
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 12,
              padding: 12,
              color: colors.text,
            }}
          />
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
  );
}
