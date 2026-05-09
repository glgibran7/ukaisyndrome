import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useUserStore } from '../../store/userStore';
import { User, Mail, Layers, Shield, LogOut } from 'lucide-react-native';

import AppLayout from '../../components/AppLayout';
import AppCard from '../../components/ui/AppCard';
import { useNavigation } from '@react-navigation/native';

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
        {/* HEADER PROFILE (CONSISTENT CARD STYLE) */}
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
              backgroundColor: `${colors.primary}15`,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: spacing.sm,
            }}
          >
            <User size={28} color={colors.primary} />
          </View>

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
                {activeClass?.name || '-'}
              </Text>

              <Text style={[typography.small, { color: colors.textSecondary }]}>
                {activeClass?.batch || '-'}
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
        {/* LOGOUT BUTTON (CONSISTENT STYLE WITH APP BUTTON FEEL) */}
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
