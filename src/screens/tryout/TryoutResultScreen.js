import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
} from 'react-native';
import { CheckCircle, RotateCcw, Home, Award } from 'lucide-react-native';

import AppLayout from '../../components/AppLayout';
import { useTheme } from '../../theme/ThemeProvider';

/* ─────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────── */
function StatCard({ label, value, color, bg, delay, anim }) {
  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 0],
  });

  return (
    <Animated.View
      style={[
        styles.statCard,
        { backgroundColor: bg, opacity: anim, transform: [{ translateY }] },
      ]}
    >
      <Text style={[styles.statCardValue, { color }]}>{value}</Text>
      <Text style={styles.statCardLabel}>{label}</Text>
    </Animated.View>
  );
}

/* ─────────────────────────────────────────────
   MAIN SCREEN
───────────────────────────────────────────── */
export default function TryoutResultScreen({ route, navigation }) {
  const { colors, spacing, typography } = useTheme();
  const result = route?.params?.result ?? null;

  // Animasi
  const scoreAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const stat1Anim = useRef(new Animated.Value(0)).current;
  const stat2Anim = useRef(new Animated.Value(0)).current;
  const stat3Anim = useRef(new Animated.Value(0)).current;
  const stat4Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // Score muncul pertama
      Animated.spring(scoreAnim, {
        toValue: 1,
        useNativeDriver: true,
        damping: 14,
        stiffness: 160,
      }),
      // Fade in teks & stats bertahap
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 240,
        useNativeDriver: true,
      }),
      Animated.stagger(80, [
        Animated.spring(stat1Anim, {
          toValue: 1,
          useNativeDriver: true,
          damping: 14,
          stiffness: 200,
        }),
        Animated.spring(stat2Anim, {
          toValue: 1,
          useNativeDriver: true,
          damping: 14,
          stiffness: 200,
        }),
        Animated.spring(stat3Anim, {
          toValue: 1,
          useNativeDriver: true,
          damping: 14,
          stiffness: 200,
        }),
        Animated.spring(stat4Anim, {
          toValue: 1,
          useNativeDriver: true,
          damping: 14,
          stiffness: 200,
        }),
      ]),
    ]).start();
  }, []);

  const scoreScale = scoreAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  const score = result?.score ?? 0;
  const scoreRounded = Math.round(score * 100) / 100;

  // Warna score berdasarkan nilai
  const scoreColor =
    score >= 75 ? '#22C55E' : score >= 50 ? '#F59E0B' : '#EF4444';

  const scoreBg =
    score >= 75
      ? 'rgba(34,197,94,0.1)'
      : score >= 50
      ? 'rgba(245,158,11,0.1)'
      : 'rgba(239,68,68,0.1)';

  const scoreLabel =
    score >= 75 ? 'Lulus' : score >= 50 ? 'Cukup Baik' : 'Perlu Belajar Lagi';

  return (
    <AppLayout>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.container,
          { paddingHorizontal: spacing.md, paddingBottom: 40 },
        ]}
      >
        {/* ── Header ── */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <Award size={22} color={colors.primary} strokeWidth={2} />
          <Text style={[styles.headerText, { color: colors.textSecondary }]}>
            Hasil Tryout
          </Text>
        </Animated.View>

        {/* ── Score ring ── */}
        <Animated.View
          style={[
            styles.scoreRing,
            {
              backgroundColor: scoreBg,
              borderColor: scoreColor + '40',
              transform: [{ scale: scoreScale }],
              opacity: scoreAnim,
            },
          ]}
        >
          <Text style={[styles.scoreValue, { color: scoreColor }]}>
            {scoreRounded}
          </Text>
          <Text style={[styles.scoreUnit, { color: scoreColor }]}>/ 100</Text>
          <Text style={[styles.scoreLabel, { color: scoreColor }]}>
            {scoreLabel}
          </Text>
        </Animated.View>

        {/* ── Stats grid ── */}
        <View style={styles.statsGrid}>
          <StatCard
            label="Benar"
            value={result?.benar ?? 0}
            color="#22C55E"
            bg="rgba(34,197,94,0.08)"
            anim={stat1Anim}
          />
          <StatCard
            label="Salah"
            value={result?.salah ?? 0}
            color="#EF4444"
            bg="rgba(239,68,68,0.08)"
            anim={stat2Anim}
          />
          <StatCard
            label="Kosong"
            value={result?.kosong ?? 0}
            color="#9CA3AF"
            bg="rgba(156,163,175,0.08)"
            anim={stat3Anim}
          />
          <StatCard
            label="Ragu-ragu"
            value={result?.ragu_ragu ?? 0}
            color="#F59E0B"
            bg="rgba(245,158,11,0.08)"
            anim={stat4Anim}
          />
        </View>

        {/* ── Progress bar benar/salah ── */}
        <Animated.View
          style={[
            styles.progressCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={styles.progressHeader}>
            <Text style={[styles.progressTitle, { color: colors.text }]}>
              Distribusi Jawaban
            </Text>
            <Text
              style={[styles.progressTotal, { color: colors.textSecondary }]}
            >
              {(result?.benar ?? 0) +
                (result?.salah ?? 0) +
                (result?.kosong ?? 0)}{' '}
              soal
            </Text>
          </View>

          <ProgressBar
            benar={result?.benar ?? 0}
            salah={result?.salah ?? 0}
            kosong={result?.kosong ?? 0}
            total={
              (result?.benar ?? 0) +
              (result?.salah ?? 0) +
              (result?.kosong ?? 0)
            }
          />

          <View style={styles.progressLegend}>
            <LegendDot color="#22C55E" label={`${result?.benar ?? 0} Benar`} />
            <LegendDot color="#EF4444" label={`${result?.salah ?? 0} Salah`} />
            <LegendDot
              color="#E5E7EB"
              label={`${result?.kosong ?? 0} Kosong`}
            />
          </View>
        </Animated.View>

        {/* ── Buttons ── */}
        <Animated.View style={[styles.buttons, { opacity: fadeAnim }]}>
          {/* ── Buttons ── */}
          <Animated.View style={[styles.buttonsWrap, { opacity: fadeAnim }]}>
            {/* Row 1 */}
            <View style={styles.buttons}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() =>
                  navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: 'Tabs',
                        state: {
                          routes: [{ name: 'Tryout' }],
                        },
                      },
                    ],
                  })
                }
                style={[
                  styles.btnSecondary,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.card,
                  },
                ]}
              >
                <Home size={18} color={colors.text} strokeWidth={2} />

                <Text style={[styles.btnSecondaryText, { color: colors.text }]}>
                  Kembali
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() =>
                  navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: 'Tabs',
                        state: {
                          routes: [{ name: 'Tryout' }],
                        },
                      },
                    ],
                  })
                }
                style={[styles.btnPrimary, { backgroundColor: colors.primary }]}
              >
                <RotateCcw size={18} color="#fff" strokeWidth={2.2} />

                <Text style={styles.btnPrimaryText}>Coba Lagi</Text>
              </TouchableOpacity>
            </View>

            {/* Row 2 - Pembahasan */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'Tabs',
                      state: {
                        routes: [
                          {
                            name: 'Tryout',
                            params: {
                              initialTab: 'result',
                              openAttemptToken: route?.params?.attemptToken,
                            },
                          },
                        ],
                      },
                    },
                  ],
                })
              }
              style={[
                styles.btnPembahasan,
                {
                  backgroundColor: `${colors.primary}15`,
                  borderColor: `${colors.primary}25`,
                },
              ]}
            >
              <CheckCircle size={18} color={colors.primary} strokeWidth={2.2} />

              <Text
                style={[styles.btnPembahasanText, { color: colors.primary }]}
              >
                Lihat Pembahasan
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </AppLayout>
  );
}

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function ProgressBar({ benar, salah, kosong, total }) {
  if (total === 0) return null;
  const pBenar = (benar / total) * 100;
  const pSalah = (salah / total) * 100;
  const pKosong = (kosong / total) * 100;

  return (
    <View style={styles.bar}>
      {pBenar > 0 && (
        <View
          style={[
            styles.barSegment,
            { flex: pBenar, backgroundColor: '#22C55E' },
          ]}
        />
      )}
      {pSalah > 0 && (
        <View
          style={[
            styles.barSegment,
            { flex: pSalah, backgroundColor: '#EF4444' },
          ]}
        />
      )}
      {pKosong > 0 && (
        <View
          style={[
            styles.barSegment,
            { flex: pKosong, backgroundColor: '#E5E7EB' },
          ]}
        />
      )}
    </View>
  );
}

function LegendDot({ color, label }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 28,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Score
  scoreRing: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  scoreValue: {
    fontSize: 52,
    fontWeight: '900',
    lineHeight: 56,
  },
  scoreUnit: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  scoreLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 6,
  },

  // Stats grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    width: '100%',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '44%',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  statCardValue: {
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 32,
  },
  statCardLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
    marginTop: 4,
  },

  // Progress card
  progressCard: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  progressTotal: {
    fontSize: 12,
    fontWeight: '600',
  },
  bar: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 10,
  },
  barSegment: {
    height: '100%',
  },
  progressLegend: {
    flexDirection: 'row',
    gap: 14,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 99,
  },
  legendLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
  },

  // Buttons
  buttons: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  buttonsWrap: {
    width: '100%',
    gap: 12,
  },
  btnPembahasan: {
    width: '100%',
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },

  btnPembahasanText: {
    fontWeight: '800',
    fontSize: 14,
  },

  pembahasanButton: {
    height: 54,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  pembahasanText: {
    fontWeight: '800',
    fontSize: 14,
  },
  btnSecondary: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnSecondaryText: {
    fontWeight: '700',
    fontSize: 14,
  },
  btnPrimary: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnPrimaryText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
});
