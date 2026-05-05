import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';

import AppLayout from '../../components/AppLayout';
import AppCard from '../../components/ui/AppCard';
import AppButton from '../../components/ui/AppButton';
import mentors from '../../data/mentors';
import modules from '../../data/moduls';
import programs from '../../data/programs';

import { useTheme } from '../../theme/ThemeProvider';

const MENTOR_WIDTH = 160;
const MODULE_WIDTH = 160;

export default function HomeScreen() {
  const { colors, spacing, typography } = useTheme();

  const mentorScrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const moduleScrollRef = useRef(null);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);

  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  useEffect(() => {
    const itemWidth = MENTOR_WIDTH + spacing.sm;

    const interval = setInterval(() => {
      const nextIndex =
        activeIndex === mentors.length - 1 ? 0 : activeIndex + 1;

      mentorScrollRef.current?.scrollTo({
        x: nextIndex * itemWidth,
        animated: true,
      });

      setActiveIndex(nextIndex);
    }, 3200);

    return () => clearInterval(interval);
  }, [activeIndex, spacing.sm]);

  useEffect(() => {
    const itemWidth = MODULE_WIDTH + spacing.xs;

    const interval = setInterval(() => {
      const nextIndex =
        activeModuleIndex === modules.length - 1 ? 0 : activeModuleIndex + 1;

      moduleScrollRef.current?.scrollTo({
        x: nextIndex * itemWidth,
        animated: true,
      });

      setActiveModuleIndex(nextIndex);
    }, 3200);

    return () => clearInterval(interval);
  }, [activeModuleIndex, spacing.xs]);

  return (
    <AppLayout>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: spacing.md,
          paddingBottom: spacing.xl,
        }}
      >
        {/* Greeting */}
        <View
          style={{
            marginBottom: spacing.lg,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View>
            <Text style={[typography.small, { color: colors.textSecondary }]}>
              Selamat datang
            </Text>

            <Text
              style={[
                typography.h1,
                {
                  color: colors.text,
                  marginTop: 4,
                },
              ]}
            >
              Gibran
            </Text>
          </View>

          <Text
            style={[
              typography.small,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            {today}
          </Text>
        </View>

        {/* Tryout */}
        {/* <AppCard style={{ marginBottom: spacing.lg }}>
          <Text style={[typography.h3, { color: colors.text }]}>
            Tryout Hari Ini
          </Text>

          <Text
            style={[
              typography.small,
              {
                color: colors.textSecondary,
                marginTop: 6,
                marginBottom: spacing.sm,
              },
            ]}
          >
            Uji kemampuanmu dengan tryout terbaru
          </Text>

          <AppButton title="Mulai Tryout" />
        </AppCard> */}

        {/* Mentor */}
        <View>
          <Text
            style={[
              typography.h3,
              {
                color: colors.text,
                marginBottom: spacing.sm,
              },
            ]}
          >
            Mentor
          </Text>
          {/* <Text
            style={[
              typography.small,
              { color: colors.textSecondary, marginBottom: 12 },
            ]}
          >
            Kenali mentor-mentor terbaik kami yang siap membimbingmu meraih
            kesuksesan
          </Text> */}

          <ScrollView
            ref={mentorScrollRef}
            horizontal
            pagingEnabled={false}
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={e => {
              const itemWidth = MENTOR_WIDTH + spacing.sm;
              const index = Math.round(
                e.nativeEvent.contentOffset.x / itemWidth,
              );
              setActiveIndex(index >= mentors.length ? 0 : index);
            }}
          >
            {mentors.map((mentor, index) => (
              <View
                key={index}
                style={{
                  marginBottom: spacing.sm,
                  width: 160,
                  paddingRight: spacing.sm,
                }}
              >
                <View style={styles.mentorImageWrapper}>
                  <Image source={mentor.image} style={styles.mentorImage} />
                </View>
              </View>
            ))}
          </ScrollView>

          {/* <View style={styles.dots}>
            {mentors.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      index === activeIndex ? colors.primary : colors.border,
                  },
                ]}
              />
            ))}
          </View> */}
        </View>

        {/* Modul */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text
            style={[
              typography.h3,
              {
                color: colors.text,
                marginBottom: spacing.sm,
              },
            ]}
          >
            Modul Terupdate
          </Text>

          {/* <Text
            style={[
              typography.small,
              {
                color: colors.textSecondary,
                marginTop: 2,
                marginBottom: spacing.sm,
              },
            ]}
          >
            Jelajahi modul terupdate untuk meningkatkan kemampuanmu
          </Text> */}

          <ScrollView
            ref={moduleScrollRef}
            horizontal
            pagingEnabled={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: spacing.sm }}
            onMomentumScrollEnd={e => {
              const itemWidth = MODULE_WIDTH + spacing.xs;
              const index = Math.round(
                e.nativeEvent.contentOffset.x / itemWidth,
              );

              setActiveModuleIndex(index >= modules.length ? 0 : index);
            }}
          >
            {modules.map((module, index) => (
              <View
                key={index}
                style={{
                  width: 160,
                  marginRight: spacing.xs,
                }}
              >
                <View style={styles.moduleImageWrapper}>
                  <Image source={module.image} style={styles.moduleImage} />
                </View>

                {/* <View style={{ paddingTop: spacing.sm }}>
                  <Text
                    style={[
                      typography.body,
                      {
                        color: colors.text,
                        fontWeight: '600',
                      },
                    ]}
                    numberOfLines={3}
                  >
                    {module.title}
                  </Text>

                  <Text
                    style={[
                      typography.small,
                      {
                        color: colors.textSecondary,
                        marginTop: 2,
                      },
                    ]}
                    numberOfLines={3}
                  >
                    {module.desc}
                  </Text>
                </View> */}
              </View>
            ))}
          </ScrollView>

          {/* <View style={styles.dots}>
            {modules.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      index === activeModuleIndex
                        ? colors.primary
                        : colors.border,
                  },
                ]}
              />
            ))}
          </View> */}
        </View>

        {/* Paket Program */}
        <View style={{ marginBottom: spacing.sm }}>
          <Text
            style={[
              typography.h3,
              {
                color: colors.text,
                marginBottom: spacing.sm,
              },
            ]}
          >
            Paket Program
          </Text>

          {/* <Text
            style={[
              typography.small,
              {
                color: colors.textSecondary,
                marginBottom: spacing.sm,
              },
            ]}
          >
            Pilih paket program yang tersedia untuk meningkatkan kemampuanmu
          </Text> */}

          {programs.map((program, index) => {
            const highlighted = index === 1;

            return (
              <AppCard
                key={program.title}
                style={{
                  marginBottom: spacing.sm,
                  borderWidth: highlighted ? 2 : 1,
                  borderColor: highlighted ? colors.primary : colors.border,
                }}
              >
                <Text
                  style={[
                    typography.h3,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  {program.title}
                </Text>

                <Text
                  style={[
                    typography.small,
                    {
                      color: colors.primary,

                      fontWeight: '600',
                    },
                  ]}
                >
                  {program.highlight}
                </Text>

                <Text
                  style={[
                    typography.small,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  {program.desc}
                </Text>
                {/* <View style={{ marginTop: spacing.sm }}>
                  {program.highlights.slice(0, 3).map((item, idx) => (
                    <Text
                      key={idx}
                      style={[
                        typography.small,
                        {
                          color: colors.textSecondary,
                          marginTop: 2,
                        },
                      ]}
                    >
                      • {item}
                    </Text>
                  ))}
                </View> */}

                <View
                  style={{
                    marginTop: spacing.sm,
                    alignSelf: 'flex-start',
                    paddingHorizontal: 10,
                    borderRadius: 999,
                    backgroundColor: highlighted
                      ? colors.primary
                      : colors.border,
                  }}
                >
                  <Text
                    style={[
                      typography.small,
                      {
                        color: highlighted ? '#fff' : colors.text,
                        fontWeight: '600',
                      },
                    ]}
                  >
                    {highlighted ? 'Rekomendasi' : 'Tersedia'}
                  </Text>
                </View>
              </AppCard>
            );
          })}
        </View>
      </ScrollView>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  mentorImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },

  moduleImage: {
    width: '100%',
    height: 180,
    resizeMode: 'contain',
  },

  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    marginHorizontal: 4,
  },

  moduleImageWrapper: {
    overflow: 'hidden',
  },
});
