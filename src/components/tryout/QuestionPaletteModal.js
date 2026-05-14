import React, { useEffect, useRef } from 'react';

import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
} from 'react-native';

import { X, CheckCircle2, Flag } from 'lucide-react-native';

import { useTheme } from '../../theme/ThemeProvider';

export default function QuestionPaletteModal({
  visible,
  onClose,
  questions,
  answers,
  currentIndex,
  onSelect,
}) {
  const { colors } = useTheme();

  const scaleAnim = useRef(new Animated.Value(0.94)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          damping: 18,
          stiffness: 240,
        }),

        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.94);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  const renderQuestionButton = (item, index) => {
    const ans = answers?.[item.id];

    const answered = !!ans?.answer;
    const isRagu = ans?.ragu;
    const active = index === currentIndex;

    let bg = colors.card;
    let borderColor = colors.border;
    let textColor = colors.text;

    // answered
    if (answered) {
      bg = '#22C55E';
      textColor = '#fff';
    }

    // ragu override answered
    if (isRagu) {
      bg = '#F59E0B';
      textColor = '#fff';
    }

    // active -> beda warna border saja
    if (active) {
      borderColor = colors.primary;
    }

    return (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.88}
        onPress={() => {
          onSelect(index);
          onClose();
        }}
        style={[
          styles.cell,
          {
            backgroundColor: bg,
            borderColor,
          },
        ]}
      >
        {/* nomor */}
        <Text
          style={[
            styles.cellText,
            {
              color: textColor,
            },
          ]}
        >
          {index + 1}
        </Text>

        {/* answered icon */}
        {answered && !isRagu && (
          <View style={styles.iconBadge}>
            <CheckCircle2 size={10} color="#fff" strokeWidth={3} />
          </View>
        )}

        {/* ragu icon */}
        {isRagu && (
          <View
            style={[
              styles.iconBadge,
              {
                backgroundColor: '#fff',
              },
            ]}
          >
            <Flag size={9} color="#F59E0B" strokeWidth={3} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity: opacityAnim,
          },
        ]}
      >
        {/* backdrop */}
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />

        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor: colors.background,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: colors.text }]}>
                Navigasi Soal
              </Text>

              <Text
                style={[
                  styles.subtitle,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                Pilih soal yang ingin dibuka
              </Text>

              {/* LEGEND */}
              <View style={styles.legendWrap}>
                <LegendItem color="#22C55E" label="Dijawab" />

                <LegendItem color="#F59E0B" label="Ragu" />

                <LegendItem
                  outlined
                  borderColor={colors.primary}
                  label="Aktif"
                />
              </View>
            </View>

            {/* close */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onClose}
              style={[
                styles.closeIconButton,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <X size={18} color={colors.text} strokeWidth={2.6} />
            </TouchableOpacity>
          </View>

          {/* LIST */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.grid}>
              {questions.map((item, index) =>
                renderQuestionButton(item, index),
              )}
            </View>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

/* ─────────────────────────────────────────────
   LEGEND ITEM
───────────────────────────────────────────── */
function LegendItem({ color, label, outlined, borderColor }) {
  return (
    <View style={styles.legendItem}>
      <View
        style={[
          styles.legendDot,
          outlined
            ? {
                backgroundColor: 'transparent',
                borderColor,
                borderWidth: 1.5,
              }
            : {
                backgroundColor: color,
              },
        ]}
      />

      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    padding: 18,
  },

  container: {
    borderRadius: 30,
    paddingTop: 20,
    paddingHorizontal: 18,
    paddingBottom: 18,
    maxHeight: '84%',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
  },

  title: {
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  subtitle: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
  },

  legendWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 12,
    marginTop: 14,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },

  legendText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
  },

  closeIconButton: {
    width: 42,
    height: 42,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollContent: {
    paddingBottom: 4,
  },

  // grid fleksibel
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  // tombol soal
  cell: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1.5,
    overflow: 'visible',
  },

  cellText: {
    fontSize: 13,
    fontWeight: '800',
  },

  iconBadge: {
    position: 'absolute',
    top: 2,
    right: 2,

    width: 16,
    height: 16,
    borderRadius: 999,

    backgroundColor: 'rgba(255,255,255,0.22)',

    alignItems: 'center',
    justifyContent: 'center',
  },
});
