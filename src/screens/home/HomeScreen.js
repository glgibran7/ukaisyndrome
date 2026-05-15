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
  Modal,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { X, Sun, SunMoon } from 'lucide-react-native';

import AppLayout from '../../components/AppLayout';
import { useUserStore } from '../../store/userStore';
import { useTheme } from '../../theme/ThemeProvider';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MENTOR_CARD_WIDTH = 128;
const MODULE_CARD_WIDTH = 128;

// GLOBAL SESSION FLAG
let hasShownAdsThisSession = false;

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

// ─── Ads Modal ────────────────────────────────────────────────────────────────
function AdsModal({ visible, ads, onClose }) {
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const btnOpacity = useRef(new Animated.Value(0)).current;
  const [countdown, setCountdown] = useState(3);
  const countdownRef = useRef(null);

  // Auto-detect ukuran gambar
  const [imgRatio, setImgRatio] = useState(1);
  const cardWidth = SCREEN_WIDTH - 56;
  const MAX_HEIGHT = Dimensions.get('window').height * 0.75;
  const imgHeight = Math.min(cardWidth / imgRatio, MAX_HEIGHT);

  useEffect(() => {
    if (ads?.[0]?.image) {
      Image.getSize(
        ads[0].image,
        (w, h) => setImgRatio(w / h),
        () => setImgRatio(1),
      );
    }
  }, [ads]);

  useEffect(() => {
    if (visible) {
      setCountdown(3);

      // Animasi masuk
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          damping: 16,
          stiffness: 220,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Countdown 3 detik sebelum tombol close muncul
      countdownRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownRef.current);
            Animated.timing(btnOpacity, {
              toValue: 1,
              duration: 250,
              useNativeDriver: true,
            }).start();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      scaleAnim.setValue(0.85);
      opacityAnim.setValue(0);
      btnOpacity.setValue(0);
    }

    return () => clearInterval(countdownRef.current);
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.85,
        useNativeDriver: true,
        damping: 14,
        stiffness: 240,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  if (!ads?.length) return null;

  const ad = ads[0];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View style={[styles.adsBackdrop, { opacity: opacityAnim }]}>
        {/* Backdrop tap — hanya bisa tutup kalau countdown habis */}
        {countdown === 0 && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={handleClose}
            style={StyleSheet.absoluteFill}
          />
        )}

        <Animated.View
          style={[styles.adsCard, { transform: [{ scale: scaleAnim }] }]}
        >
          {/* Gambar iklan */}
          <Image
            source={{ uri: ad.image }}
            style={[styles.adsImage, { height: imgHeight }]}
            resizeMode="contain"
          />

          {/* Tombol close — muncul setelah countdown */}
          <Animated.View style={[styles.closeWrap, { opacity: btnOpacity }]}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleClose}
              style={styles.closeBtn}
            >
              <X size={16} color="#fff" strokeWidth={2.5} />
            </TouchableOpacity>
          </Animated.View>

          {/* Countdown badge — tampil selama hitung mundur */}
          {countdown > 0 && (
            <View style={styles.countdownBadge}>
              <Text style={styles.countdownText}>{countdown}</Text>
            </View>
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function HomeScreen({ navigation }) {
  const { colors, spacing, typography } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const user = useUserStore(state => state.user);
  const fetchUser = useUserStore(state => state.fetchUser);

  const [mentors, setMentors] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  const [ads, setAds] = useState([]);
  const [adsVisible, setAdsVisible] = useState(false);

  const mentorScrollRef = useRef(null);
  const moduleScrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [mentorDirection, setMentorDirection] = useState(1);
  const [moduleDirection, setModuleDirection] = useState(1);

  const pageOpacity = useRef(new Animated.Value(0)).current;
  const pageTranslateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    checkActiveTryout();
  }, []);

  const checkActiveTryout = async () => {
    try {
      const raw = await AsyncStorage.getItem('ACTIVE_TRYOUT_SESSION');

      if (!raw) return;

      const session = JSON.parse(raw);

      navigation.replace('TryoutQuestion', {
        attemptToken: session.attemptToken,
      });
    } catch (e) {
      console.log(e);
    }
  };

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
      const [mRes, modRes, adsRes] = await Promise.all([
        fetch(
          'https://raw.githubusercontent.com/glgibran7/ukai-assets/main/mentors.json',
        ),
        fetch(
          'https://raw.githubusercontent.com/glgibran7/ukai-assets/main/modules.json',
        ),
        fetch(
          'https://raw.githubusercontent.com/glgibran7/ukai-assets/main/ads.json',
        ),
      ]);

      setMentors(await mRes.json());
      setModules(await modRes.json());

      const adsData = await adsRes.json();

      if (adsData?.length) {
        setAds(adsData);

        /**
         * hanya tampil sekali selama app masih hidup
         */
        if (!hasShownAdsThisSession) {
          hasShownAdsThisSession = true;

          setTimeout(() => {
            setAdsVisible(true);
          }, 400);
        }
      }
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
              {greeting}
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

      {/* ── Ads Popup ── */}
      <AdsModal
        visible={adsVisible}
        ads={ads}
        onClose={() => setAdsVisible(false)}
      />
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
  activeText: { fontSize: 11, color: '#fff', fontWeight: '700' },
  batchChip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  batchText: { fontSize: 12, color: '#fff', fontWeight: '700' },
  decCircle: { position: 'absolute', borderRadius: 999 },
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
  mentorImage: { width: '100%', height: '100%', resizeMode: 'cover' },
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
  moduleImage: { width: '100%', height: '100%', resizeMode: 'cover' },

  // Ads
  adsBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  adsCard: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000',
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
  },
  adsImage: {
    width: '100%',
  },
  closeWrap: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  countdownBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  countdownText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },
});
