import React, { useEffect, useMemo, useRef } from 'react';

import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
} from 'react-native';

import {
  X,
  CheckCircle2,
  Flag,
  XCircle,
  MinusCircle,
} from 'lucide-react-native';

import { useTheme } from '../../theme/ThemeProvider';

export default function QuestionPaletteModal({
  visible,
  onClose,
  questions = [],
  answers = {},
  currentIndex = 0,
  onSelect,

  // mode
  mode = 'tryout', // tryout | pembahasan

  // optional custom title
  title = 'Navigasi Soal',
  subtitle = 'Pilih soal yang ingin dibuka',
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

  const legends = useMemo(() => {
    if (mode === 'pembahasan') {
      return [
        {
          color: '#22C55E',
          label: 'Benar',
        },
        {
          color: '#EF4444',
          label: 'Salah',
        },
        {
          color: '#9CA3AF',
          label: 'Kosong',
        },
        {
          color: '#F59E0B',
          label: 'Ragu',
        },
        {
          outlined: true,
          borderColor: colors.primary,
          label: 'Aktif',
        },
      ];
    }

    return [
      {
        color: '#22C55E',
        label: 'Dijawab',
      },
      {
        color: '#F59E0B',
        label: 'Ragu',
      },
      {
        outlined: true,
        borderColor: colors.primary,
        label: 'Aktif',
      },
    ];
  }, [mode, colors.primary]);

  const renderQuestionButton = (item, index) => {
    const ans = answers?.[item.id];

    const active = index === currentIndex;

    let bg = colors.card;
    let borderColor = colors.border;
    let textColor = colors.text;

    let icon = null;

    /* ─────────────────────────────
       MODE TRYOUT
    ───────────────────────────── */
    if (mode === 'tryout') {
      const answered = !!ans?.answer;
      const isRagu = ans?.ragu;

      if (answered) {
        bg = '#22C55E';
        textColor = '#fff';

        icon = (
          <View style={styles.iconBadge}>
            <CheckCircle2 size={10} color="#fff" strokeWidth={3} />
          </View>
        );
      }

      if (isRagu) {
        bg = '#F59E0B';
        textColor = '#fff';

        icon = (
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
        );
      }
    }

    /* ─────────────────────────────
       MODE PEMBAHASAN
    ───────────────────────────── */
    if (mode === 'pembahasan') {
      const status = item?.status;
      const isRagu = item?.is_ragu;

      if (status === 'benar') {
        bg = '#22C55E';
        textColor = '#fff';

        icon = (
          <View style={styles.iconBadge}>
            <CheckCircle2 size={10} color="#fff" strokeWidth={3} />
          </View>
        );
      } else if (status === 'salah') {
        bg = '#EF4444';
        textColor = '#fff';

        icon = (
          <View style={styles.iconBadge}>
            <XCircle size={10} color="#fff" strokeWidth={3} />
          </View>
        );
      } else {
        bg = '#9CA3AF';
        textColor = '#fff';

        icon = (
          <View style={styles.iconBadge}>
            <MinusCircle size={10} color="#fff" strokeWidth={3} />
          </View>
        );
      }

      if (isRagu) {
        icon = (
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
        );
      }
    }

    // active
    if (active) {
      borderColor = colors.primary;
    }

    return (
      <TouchableOpacity
        key={item.id ?? index}
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

        {icon}
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
                {title}
              </Text>

              <Text
                style={[
                  styles.subtitle,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                {subtitle}
              </Text>

              {/* LEGEND */}
              <View style={styles.legendWrap}>
                {legends.map((item, idx) => (
                  <LegendItem
                    key={idx}
                    color={item.color}
                    label={item.label}
                    outlined={item.outlined}
                    borderColor={item.borderColor}
                  />
                ))}
              </View>
            </View>

            {/* CLOSE */}
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

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  cell: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1.5,
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
