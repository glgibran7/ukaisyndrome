import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import {
  Clock3,
  FileText,
  CircleAlert,
  Trophy,
  ChevronRight,
  Info,
} from 'lucide-react-native';

import AppLayout from '../../components/AppLayout';
import AppCard from '../../components/ui/AppCard';
import { startTryout } from '../../api/tryout/attempt.api';

import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { useTheme } from '../../theme/ThemeProvider';

export default function TryoutDetailScreen({ route, navigation }) {
  const { colors, spacing, typography } = useTheme();
  const [starting, setStarting] = useState(false);

  const { tryout } = route.params;

  const handleStartTryout = async () => {
    try {
      setStarting(true);

      const response = await startTryout(tryout.id);

      navigation.replace('TryoutQuestion', {
        attemptToken: response.data.attempt_token,
        tryout,
      });
    } catch (error) {
      console.log('START TRYOUT ERROR:', error);
    } finally {
      setStarting(false);
    }
  };

  const isDisabled =
    tryout?.status === 'closed' ||
    tryout?.status === 'upcoming' ||
    tryout?.remaining_attempt === 0;

  const statusConfig = {
    ongoing: {
      label: 'Berlangsung',
      color: '#22C55E',
      bg: 'rgba(34,197,94,0.12)',
    },
    upcoming: {
      label: 'Akan Datang',
      color: '#F59E0B',
      bg: 'rgba(245,158,11,0.12)',
    },
    closed: {
      label: 'Ditutup',
      color: '#EF4444',
      bg: 'rgba(239,68,68,0.12)',
    },
  }[tryout?.status];

  const InfoItem = ({ icon, label, value }) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
      }}
    >
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 14,
          backgroundColor: `${colors.primary}12`,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        }}
      >
        {icon}
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: colors.textSecondary,
            fontSize: 11,
          }}
        >
          {label}
        </Text>

        <Text
          style={{
            color: colors.text,
            fontSize: 14,
            fontWeight: '700',
            marginTop: 2,
          }}
        >
          {value}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      edges={['bottom']}
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <AppLayout>
        <View style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              padding: spacing.md,
              paddingBottom: 140,
            }}
          >
            {/* HERO */}
            <AppCard
              style={{
                borderRadius: 24,
                padding: spacing.lg,
                marginBottom: spacing.md,
                borderWidth: 1,
                borderColor: `${colors.primary}20`,
              }}
            >
              {/* STATUS */}
              <View
                style={{
                  alignSelf: 'flex-start',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 999,
                  backgroundColor: statusConfig?.bg,
                  marginBottom: spacing.md,
                }}
              >
                <Text
                  style={{
                    color: statusConfig?.color,
                    fontSize: 11,
                    fontWeight: '800',
                  }}
                >
                  {statusConfig?.label}
                </Text>
              </View>

              {/* TITLE */}
              <Text
                style={[
                  typography.h2,
                  {
                    color: colors.text,
                    lineHeight: 30,
                  },
                ]}
              >
                {tryout?.title}
              </Text>

              {/* DATE */}
              <Text
                style={{
                  color: colors.textSecondary,
                  marginTop: 10,
                  fontSize: 12,
                  lineHeight: 20,
                }}
              >
                Akses:{' '}
                {new Date(tryout?.access_start_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
                {' - '}
                {new Date(tryout?.access_end_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            </AppCard>

            {/* INFO */}
            <Text
              style={[
                typography.body,
                {
                  color: colors.text,
                  fontWeight: '700',
                  marginBottom: spacing.sm,
                },
              ]}
            >
              Informasi Tryout
            </Text>

            <AppCard
              style={{
                borderRadius: 20,
                marginBottom: spacing.md,
              }}
            >
              <InfoItem
                icon={<FileText size={18} color={colors.primary} />}
                label="Jumlah Soal"
                value={`${tryout?.total_soal} Soal`}
              />

              <InfoItem
                icon={<Clock3 size={18} color={colors.primary} />}
                label="Durasi"
                value={`${tryout?.duration} Menit`}
              />

              <InfoItem
                icon={<Trophy size={18} color={colors.primary} />}
                label="Maksimal Percobaan"
                value={`${tryout?.max_attempt}x Percobaan`}
              />
              <InfoItem
                icon={<Info size={18} color={colors.primary} />}
                label="Sisa Percobaan"
                value={`${tryout?.remaining_attempt}x Percobaan`}
              />
            </AppCard>

            {/* TERMS */}
            <Text
              style={[
                typography.body,
                {
                  color: colors.text,
                  fontWeight: '700',
                  marginBottom: spacing.sm,
                },
              ]}
            >
              Terms & Conditions
            </Text>

            <AppCard
              style={{
                borderRadius: 20,
                paddingVertical: spacing.md,
              }}
            >
              {[
                'Pastikan koneksi internet stabil sebelum memulai tryout.',
                'Tryout yang sudah dimulai tidak dapat diulang di perangkat lain.',
                'Waktu akan tetap berjalan meskipun aplikasi ditutup.',
                'Jawaban akan tersimpan otomatis selama pengerjaan.',
                'Pastikan semua soal telah dijawab sebelum submit.',
              ].map((item, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    marginBottom: index === 4 ? 0 : spacing.md,
                  }}
                >
                  <CircleAlert
                    size={16}
                    color={colors.primary}
                    style={{ marginTop: 2 }}
                  />

                  <Text
                    style={{
                      flex: 1,
                      marginLeft: 10,
                      color: colors.textSecondary,
                      fontSize: 13,
                      lineHeight: 22,
                    }}
                  >
                    {item}
                  </Text>
                </View>
              ))}
            </AppCard>
          </ScrollView>

          {/* BUTTON */}
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              padding: spacing.md,
              backgroundColor: colors.background,
              borderTopWidth: 1,
              borderTopColor: colors.border,
            }}
          >
            <TouchableOpacity
              disabled={isDisabled || starting}
              activeOpacity={0.9}
              onPress={handleStartTryout}
              style={{
                backgroundColor: isDisabled ? colors.border : colors.primary,

                height: 54,
                borderRadius: 18,
                alignItems: 'center',
                justifyContent: 'center',

                flexDirection: 'row',
                opacity: isDisabled ? 0.7 : 1,
              }}
            >
              {starting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 15,
                      fontWeight: '800',
                      marginRight: 8,
                    }}
                  >
                    {tryout?.status === 'upcoming'
                      ? 'Belum Dimulai'
                      : tryout?.status === 'closed'
                      ? 'Tryout Ditutup'
                      : tryout?.remaining_attempt === 0
                      ? 'Percobaan Habis'
                      : 'Mulai Tryout'}
                  </Text>

                  {!isDisabled && <ChevronRight size={18} color="#fff" />}
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </AppLayout>
    </SafeAreaView>
  );
}
