import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Animated,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';

import AppLayout from '../../components/AppLayout';
import { useUserStore } from '../../store/userStore';
import { useTheme } from '../../theme/ThemeProvider';

const MENTOR_CARD_WIDTH = 128;
const MODULE_CARD_WIDTH = 128;

// ─── Skeleton shimmer block ───────────────────────────────────────────────────
function SkeletonBox({ width, height, radius = 10, style }) {
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 750,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: '#E2E8F0',
          opacity,
        },
        style,
      ]}
    />
  );
}

// ─── Section header ────────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle, colors, typography, spacing }) {
  return (
    <View
      style={{
        marginBottom: spacing.sm,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
      }}
    >
      <View>
        <Text
          style={[typography.h3, { color: colors.text, letterSpacing: -0.3 }]}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[
              typography.small,
              { color: colors.textSecondary, marginTop: 2 },
            ]}
          >
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );
}

// ─── Mentor card ──────────────────────────────────────────────────────────────
function MentorCard({ mentor, spacing }) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 30,
    }).start();
  const onPressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
    }).start();

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View
        style={[
          styles.mentorCard,
          { transform: [{ scale }], marginRight: spacing.sm },
        ]}
      >
        <Image source={{ uri: mentor.image }} style={styles.mentorImage} />
      </Animated.View>
    </TouchableOpacity>
  );
}

// ─── Module card ──────────────────────────────────────────────────────────────
function ModuleCard({ module, spacing }) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 30,
    }).start();
  const onPressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
    }).start();
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View
        style={[
          styles.moduleCard,
          { transform: [{ scale }], marginRight: spacing.sm },
        ]}
      >
        <Image source={{ uri: module.image }} style={styles.moduleImage} />
      </Animated.View>
    </TouchableOpacity>
  );
}

// ─── Quick stat pill ──────────────────────────────────────────────────────────
function StatPill({ icon, label, value, colors, typography }) {
  return (
    <View
      style={[
        styles.statPill,
        {
          backgroundColor: `${colors.primary}`,
          borderColor: `${colors.primary}`,
        },
      ]}
    >
      <Text style={{ fontSize: 18 }}>{icon}</Text>
      <View style={{ marginLeft: 8 }}>
        <Text
          style={[
            typography.small,
            { color: colors.textSecondary, fontSize: 10 },
          ]}
        >
          {label}
        </Text>
        <Text
          style={[
            typography.small,
            { color: colors.text, fontWeight: '800', fontSize: 13 },
          ]}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const { colors, spacing, typography } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const user = useUserStore(state => state.user);
  const fetchUser = useUserStore(state => state.fetchUser);

  const [mentors, setMentors] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  const mentorScrollRef = useRef(null);
  const moduleScrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [mentorDirection, setMentorDirection] = useState(1);
  const [moduleDirection, setModuleDirection] = useState(1);

  // Fade-in for entire page
  const pageOpacity = useRef(new Animated.Value(0)).current;
  const pageTranslateY = useRef(new Animated.Value(16)).current;

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchUser();
      await fetchData();
    } catch (e) {
      console.log('Refresh gagal', e);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!user) fetchUser().catch(console.log);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [mRes, modRes] = await Promise.all([
        fetch(
          'https://cdn.jsdelivr.net/gh/glgibran7/ukai-assets@main/mentors.json',
        ),
        fetch(
          'https://cdn.jsdelivr.net/gh/glgibran7/ukai-assets@main/modules.json',
        ),
      ]);
      setMentors(await mRes.json());
      setModules(await modRes.json());
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      Animated.parallel([
        Animated.timing(pageOpacity, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(pageTranslateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  // Auto-scroll mentor
  useEffect(() => {
    if (!mentors.length) return;
    const itemWidth = MENTOR_CARD_WIDTH + spacing.sm;
    const interval = setInterval(() => {
      let next = activeIndex + mentorDirection;
      let dir = mentorDirection;
      if (next >= mentors.length - 1) {
        next = mentors.length - 1;
        dir = -1;
      }
      if (next <= 0) {
        next = 0;
        dir = 1;
      }
      mentorScrollRef.current?.scrollTo({
        x: next * itemWidth,
        animated: true,
      });
      setActiveIndex(next);
      setMentorDirection(dir);
    }, 3200);
    return () => clearInterval(interval);
  }, [activeIndex, mentorDirection, mentors, spacing.sm]);

  // Auto-scroll module
  useEffect(() => {
    if (!modules.length) return;
    const itemWidth = MODULE_CARD_WIDTH + spacing.sm;
    const interval = setInterval(() => {
      let next = activeModuleIndex + moduleDirection;
      let dir = moduleDirection;
      if (next >= modules.length - 1) {
        next = modules.length - 1;
        dir = -1;
      }
      if (next <= 0) {
        next = 0;
        dir = 1;
      }
      moduleScrollRef.current?.scrollTo({
        x: next * itemWidth,
        animated: true,
      });
      setActiveModuleIndex(next);
      setModuleDirection(dir);
    }, 3200);
    return () => clearInterval(interval);
  }, [activeModuleIndex, moduleDirection, modules, spacing.sm]);

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 11
      ? 'Selamat Pagi'
      : greetingHour < 15
      ? 'Selamat Siang'
      : greetingHour < 18
      ? 'Selamat Sore'
      : 'Selamat Malam';

  return (
    <AppLayout>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {/* ── Sticky Header ── */}
        <View
          style={[
            styles.stickyHeader,
            {
              paddingHorizontal: spacing.md,
              backgroundColor: colors.background,
            },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={[
                typography.small,
                { color: colors.textSecondary, fontSize: 12 },
              ]}
            >
              {greeting} 👋
            </Text>
            <Text
              numberOfLines={1}
              style={[
                typography.h1,
                {
                  color: colors.text,
                  marginTop: 2,
                  letterSpacing: -0.5,
                  fontSize: 24,
                },
              ]}
            >
              {user?.name
                ?.toLowerCase()
                .replace(/\b\w/g, c => c.toUpperCase()) || 'Pengguna'}
            </Text>
          </View>

          {/* Date pill */}
          <View
            style={[
              styles.datePill,
              {
                backgroundColor: `${colors.primary}12`,
                borderColor: `${colors.primary}20`,
              },
            ]}
          >
            <Text
              style={[
                typography.small,
                { color: colors.primary, fontSize: 10, fontWeight: '700' },
              ]}
            >
              {new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </Text>
          </View>
        </View>

        {/* ── Scrollable Body ── */}
        <Animated.ScrollView
          style={{
            opacity: pageOpacity,
            transform: [{ translateY: pageTranslateY }],
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: spacing.md,
            paddingTop: spacing.sm,
            paddingBottom: spacing.xl + 24,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
          {/* ── Class Card ── */}
          {user?.classes?.[0] && (
            <View
              style={[
                styles.classCard,
                { backgroundColor: colors.primary, marginBottom: spacing.lg },
              ]}
            >
              {/* Decorative circles */}
              <View
                style={[
                  styles.decCircle,
                  {
                    width: 120,
                    height: 120,
                    top: -40,
                    right: -30,
                    backgroundColor: 'rgba(255,255,255,0.08)',
                  },
                ]}
              />
              <View
                style={[
                  styles.decCircle,
                  {
                    width: 80,
                    height: 80,
                    bottom: -20,
                    right: 60,
                    backgroundColor: 'rgba(255,255,255,0.06)',
                  },
                ]}
              />

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.classLabel}>Kelas Aktif</Text>
                  <Text style={styles.className} numberOfLines={2}>
                    {user.classes[0].name
                      ?.toLowerCase()
                      .replace(/\b\w/g, c => c.toUpperCase())}
                  </Text>
                </View>

                {/* Active badge */}
                <View style={styles.activeBadge}>
                  <View style={styles.activeDot} />
                  <Text style={styles.activeText}>Aktif</Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 14,
                }}
              >
                <View style={styles.batchChip}>
                  <Text style={styles.batchText}>
                    {user.classes[0].batch
                      ?.toLowerCase()
                      .replace(/\b\w/g, c => c.toUpperCase())}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* ── Mentors ── */}
          <View style={{ marginBottom: spacing.lg }}>
            <SectionHeader
              title="Daftar Mentor"
              subtitle="Belajar langsung dari ahlinya"
              colors={colors}
              typography={typography}
              spacing={spacing}
            />

            {loading ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {[1, 2, 3].map(i => (
                  <View key={i} style={{ marginRight: spacing.sm }}>
                    <SkeletonBox
                      width={MENTOR_CARD_WIDTH}
                      height={MENTOR_CARD_WIDTH * 1.25}
                      radius={14}
                    />
                    <SkeletonBox
                      width={MENTOR_CARD_WIDTH * 0.7}
                      height={12}
                      radius={6}
                      style={{ marginTop: 8 }}
                    />
                    <SkeletonBox
                      width={MENTOR_CARD_WIDTH * 0.5}
                      height={10}
                      radius={6}
                      style={{ marginTop: 6 }}
                    />
                  </View>
                ))}
              </ScrollView>
            ) : (
              <ScrollView
                ref={mentorScrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                snapToInterval={MENTOR_CARD_WIDTH + spacing.sm}
                snapToAlignment="start"
                onMomentumScrollEnd={e => {
                  const i = Math.round(
                    e.nativeEvent.contentOffset.x /
                      (MENTOR_CARD_WIDTH + spacing.sm),
                  );
                  setActiveIndex(i >= mentors.length ? 0 : i);
                }}
              >
                {mentors.map((mentor, i) => (
                  <MentorCard key={i} mentor={mentor} spacing={spacing} />
                ))}
              </ScrollView>
            )}
          </View>
          {/* ── Modules ── */}
          <View style={{ marginBottom: spacing.xl }}>
            <SectionHeader
              title="Modul Terupdate"
              subtitle="Menggunakan modul terbaru untuk anda"
              colors={colors}
              typography={typography}
              spacing={spacing}
            />

            {loading ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {[1, 2].map(i => (
                  <View key={i} style={{ marginRight: spacing.sm }}>
                    <SkeletonBox
                      width={MODULE_CARD_WIDTH}
                      height={MODULE_CARD_WIDTH * 0.6}
                      radius={14}
                    />
                    <SkeletonBox
                      width={MODULE_CARD_WIDTH * 0.8}
                      height={12}
                      radius={6}
                      style={{ marginTop: 8 }}
                    />
                    <SkeletonBox
                      width={MODULE_CARD_WIDTH * 0.5}
                      height={10}
                      radius={6}
                      style={{ marginTop: 6 }}
                    />
                  </View>
                ))}
              </ScrollView>
            ) : (
              <ScrollView
                ref={moduleScrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                snapToInterval={MODULE_CARD_WIDTH + spacing.sm}
                snapToAlignment="start"
                onMomentumScrollEnd={e => {
                  const i = Math.round(
                    e.nativeEvent.contentOffset.x /
                      (MODULE_CARD_WIDTH + spacing.sm),
                  );
                  setActiveModuleIndex(i >= modules.length ? 0 : i);
                }}
              >
                {modules.map((module, i) => (
                  <ModuleCard key={i} module={module} spacing={spacing} />
                ))}
              </ScrollView>
            )}
          </View>
        </Animated.ScrollView>
      </View>
    </AppLayout>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  stickyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 8,
    zIndex: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  datePill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    marginLeft: 12,
  },
  classCard: {
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  classLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  className: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '800',
    letterSpacing: -0.4,
    lineHeight: 26,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginLeft: 10,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ADE80',
    marginRight: 5,
  },
  activeText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '700',
  },
  batchChip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  batchText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '700',
  },
  decCircle: {
    position: 'absolute',
    borderRadius: 999,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  mentorCard: {
    width: MENTOR_CARD_WIDTH,
    height: MENTOR_CARD_WIDTH * 1.35,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  mentorImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  moduleCard: {
    width: MODULE_CARD_WIDTH,
    height: MODULE_CARD_WIDTH * 1.35,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  moduleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 4,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});
