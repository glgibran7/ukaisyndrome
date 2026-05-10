import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useUserStore } from '../../store/userStore';
import { Mail, Layers, Shield, LogOut } from 'lucide-react-native';

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

const getInitials = (name = '') => {
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

export default function ProfileScreen() {
  const { colors, spacing, typography } = useTheme();
  const navigation = useNavigation();

  const user = useUserStore(state => state.user);
  const logout = useUserStore(state => state.logout);

  const activeClass = user?.classes?.[0];

  return (
    <AppLayout>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: spacing.md,
        }}
      >
        {/* HEADER PROFILE */}
        <AppCard
          style={{
            alignItems: 'center',
            paddingVertical: spacing.lg,
            marginBottom: spacing.md,
          }}
        >
          {/* AVATAR PREMIUM */}
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 999,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: stringToColor(user?.name),

              // shadow iOS
              shadowColor: '#000',
              shadowOpacity: 0.15,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 6 },

              // shadow Android
              elevation: 6,

              marginBottom: spacing.sm,
            }}
          >
            <Text
              style={{
                fontSize: 26,
                fontWeight: '800',
                color: '#fff',
                letterSpacing: 1,
              }}
            >
              {getInitials(user?.name)}
            </Text>
          </View>

          {/* NAME */}
          <Text
            style={[
              typography.h2,
              {
                color: colors.text,
                textAlign: 'center',
              },
            ]}
          >
            {user?.name || 'Peserta'}
          </Text>

          {/* ROLE */}
          <Text
            style={[
              typography.small,
              {
                color: colors.textSecondary,
                marginTop: 4,
                textTransform: 'capitalize',
              },
            ]}
          >
            {user?.role || '-'}
          </Text>
        </AppCard>

        {/* EMAIL */}
        <AppCard style={{ marginBottom: spacing.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Mail size={18} color={colors.primary} />

            <View style={{ marginLeft: spacing.sm }}>
              <Text style={[typography.small, { color: colors.textSecondary }]}>
                Email
              </Text>
              <Text style={[typography.body, { color: colors.text }]}>
                {user?.email || '-'}
              </Text>
            </View>
          </View>
        </AppCard>

        {/* CLASS */}
        <AppCard style={{ marginBottom: spacing.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Layers size={18} color={colors.primary} />

            <View style={{ marginLeft: spacing.sm }}>
              <Text style={[typography.small, { color: colors.textSecondary }]}>
                Kelas
              </Text>

              <Text style={[typography.body, { color: colors.text }]}>
                {activeClass?.name
                  ?.toLowerCase()
                  .replace(/\b\w/g, c => c.toUpperCase()) || '-'}
              </Text>

              <Text style={[typography.small, { color: colors.textSecondary }]}>
                {activeClass?.batch
                  ?.toLowerCase()
                  .replace(/\b\w/g, c => c.toUpperCase()) || '-'}
              </Text>
            </View>
          </View>
        </AppCard>

        {/* ROLE */}
        <AppCard style={{ marginBottom: spacing.lg }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Shield size={18} color={colors.primary} />

            <View style={{ marginLeft: spacing.sm }}>
              <Text style={[typography.small, { color: colors.textSecondary }]}>
                Role
              </Text>

              <Text
                style={[
                  typography.body,
                  {
                    color: colors.text,
                    textTransform: 'capitalize',
                  },
                ]}
              >
                {user?.role || '-'}
              </Text>
            </View>
          </View>
        </AppCard>

        {/* CHANGE PASSWORD */}
        <AppCard style={{ marginBottom: spacing.sm }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ChangePassword')}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: colors.primary, fontWeight: '700' }}>
              Ganti Password
            </Text>
          </TouchableOpacity>
        </AppCard>

        {/* LOGOUT */}
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

          <Text
            style={{
              color: '#fff',
              fontWeight: '700',
              marginLeft: 8,
            }}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </AppLayout>
  );
}
