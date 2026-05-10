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
  const [logoutVisible, setLogoutVisible] = React.useState(false);
  const [logoutLoading, setLogoutLoading] = React.useState(false);

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await logout();
    } finally {
      setLogoutLoading(false);
      setLogoutVisible(false);
    }
  };

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
          onPress={() => setLogoutVisible(true)}
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
      {logoutVisible && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.35)',
            padding: spacing.md,
          }}
        >
          {/* tap outside */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              if (!logoutLoading) {
                setLogoutVisible(false);
              }
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />

          <View
            style={{
              borderRadius: 24,
              overflow: 'hidden',
            }}
          >
            {/* main card */}
            <View
              style={{
                backgroundColor: colors.card || colors.background,
                borderRadius: 20,
                paddingTop: spacing.lg,
                paddingBottom: spacing.md,
                paddingHorizontal: spacing.md,
                marginBottom: spacing.sm,
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  fontSize: 17,
                  fontWeight: '700',
                  textAlign: 'center',
                  marginBottom: 6,
                }}
              >
                Logout
              </Text>

              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 14,
                  lineHeight: 20,
                  textAlign: 'center',
                  marginBottom: spacing.lg,
                }}
              >
                Apakah kamu yakin ingin keluar dari akun ini?
              </Text>

              <TouchableOpacity
                disabled={logoutLoading}
                onPress={handleLogout}
                activeOpacity={0.85}
                style={{
                  backgroundColor: '#EF4444',
                  paddingVertical: 14,
                  borderRadius: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: logoutLoading ? 0.8 : 1,
                }}
              >
                {logoutLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 15,
                      fontWeight: '700',
                    }}
                  >
                    Logout
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* cancel button */}
            <TouchableOpacity
              disabled={logoutLoading}
              onPress={() => setLogoutVisible(false)}
              activeOpacity={0.85}
              style={{
                backgroundColor: colors.card || colors.background,
                paddingVertical: 15,
                borderRadius: 18,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: colors.primary,
                  fontSize: 16,
                  fontWeight: '700',
                }}
              >
                Batal
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </AppLayout>
  );
}
