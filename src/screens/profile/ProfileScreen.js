import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useUserStore } from '../../store/userStore';
import {
  Mail,
  Layers,
  Shield,
  LogOut,
  KeyRound,
  ChevronRight,
} from 'lucide-react-native';

import AppLayout from '../../components/AppLayout';
import AppCard from '../../components/ui/AppCard';
import { useNavigation } from '@react-navigation/native';

/* =========================
   AVATAR HELPERS
========================= */

const stringToColor = (str = '') => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 70%, 55%)`;
};

const getInitials = (name = '') =>
  name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

export default function ProfileScreen() {
  const { colors, spacing, typography } = useTheme();
  const navigation = useNavigation();

  const user = useUserStore(state => state.user);
  const logout = useUserStore(state => state.logout);

  const activeClass = user?.classes?.[0];

  const Row = ({ icon, label, value }) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
      }}
    >
      {icon}

      <View style={{ marginLeft: spacing.sm, flex: 1 }}>
        <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
          {label}
        </Text>
        <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>
          {value}
        </Text>
      </View>
    </View>
  );

  return (
    <AppLayout>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: spacing.md }}
      >
        {/* ================= HEADER PROFILE ================= */}
        <AppCard
          style={{
            alignItems: 'center',
            paddingVertical: spacing.lg,
            marginBottom: spacing.md,
          }}
        >
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 999,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: stringToColor(user?.name),
              marginBottom: spacing.sm,
              elevation: 6,
            }}
          >
            <Text style={{ fontSize: 26, fontWeight: '800', color: '#fff' }}>
              {getInitials(user?.name)}
            </Text>
          </View>

          <Text style={[typography.h2, { color: colors.text }]}>
            {user?.name || 'Peserta'}
          </Text>

          <Text
            style={{
              color: colors.textSecondary,
              marginTop: 4,
              textTransform: 'capitalize',
            }}
          >
            {user?.role || '-'}
          </Text>
        </AppCard>

        <Text
          style={[
            typography.body,
            {
              color: colors.text,
              fontWeight: '700',
              marginBottom: spacing.sm,
              marginLeft: 2,
            },
          ]}
        >
          Informasi Pribadi
        </Text>

        {/* ================= INFO SECTION (NO STACKED CARDS) ================= */}
        <AppCard style={{ marginBottom: spacing.md }}>
          <Row
            icon={<Mail size={18} color={colors.primary} />}
            label="Email"
            value={user?.email || '-'}
          />

          <View
            style={{
              height: 1,
              backgroundColor: 'rgba(255,255,255,0.05)',
            }}
          />

          <Row
            icon={<Layers size={18} color={colors.primary} />}
            label="Kelas"
            value={
              activeClass?.name?.replace(/\b\w/g, c => c.toUpperCase()) || '-'
            }
          />

          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 12,
              marginLeft: 30,
              marginTop: -6,
              marginBottom: 8,
            }}
          >
            {activeClass?.batch?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}
          </Text>

          <View
            style={{
              height: 1,
              backgroundColor: 'rgba(255,255,255,0.05)',
            }}
          />

          <Row
            icon={<Shield size={18} color={colors.primary} />}
            label="Role"
            value={user?.role?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}
          />
        </AppCard>

        <Text
          style={[
            typography.body,
            {
              color: colors.text,
              fontWeight: '700',
              marginBottom: spacing.sm,
              marginLeft: 2,
            },
          ]}
        >
          Pengaturan
        </Text>

        {/* ================= ACTION SECTION ================= */}
        <AppCard style={{ marginBottom: spacing.md }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ChangePassword')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <KeyRound size={18} color={colors.primary} />
              <Text
                style={{
                  marginLeft: spacing.sm,
                  color: colors.text,
                  fontWeight: '600',
                }}
              >
                Ganti Password
              </Text>
            </View>

            <ChevronRight size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </AppCard>

        {/* ================= LOGOUT ================= */}
        <TouchableOpacity
          onPress={async () => {
            await logout();
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#EF4444',
            paddingVertical: spacing.md,
            borderRadius: 12,
          }}
        >
          <LogOut size={18} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: '700', marginLeft: 8 }}>
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </AppLayout>
  );
}
