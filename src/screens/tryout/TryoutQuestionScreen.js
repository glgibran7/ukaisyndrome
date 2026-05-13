import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from 'react';

import {
  View,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Text,
  StyleSheet,
  Animated,
  BackHandler,
} from 'react-native';

import { AlertTriangle, CheckCircle, Clock, Send } from 'lucide-react-native';

import AppLayout from '../../components/AppLayout';

import { useTheme } from '../../theme/ThemeProvider';
import { useToast } from '../../context/ToastProvider';

import {
  getAttemptQuestions,
  saveAttemptAnswers,
  submitAttempt,
} from '../../api/tryout/attempt.api';

import TryoutHeader from '../../components/tryout/TryoutHeader';
import QuestionPalette from '../../components/tryout/QuestionPalette';
import QuestionCard from '../../components/tryout/QuestionCard';
import OptionCard from '../../components/tryout/OptionCard';
import TryoutFooter from '../../components/tryout/TryoutFooter';

import useTryoutTimer from '../../hook/useTryoutTimer';
import { formatTime } from '../../utils/formatTime';

const OPTIONS = ['A', 'B', 'C', 'D', 'E'];

/* ─────────────────────────────────────────────
   SUBMIT CONFIRMATION MODAL
───────────────────────────────────────────── */
function SubmitModal({ visible, onCancel, onConfirm, stats, submitting }) {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0.88)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          damping: 16,
          stiffness: 260,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.88);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onCancel}
    >
      <Animated.View style={[styles.modalBackdrop, { opacity: opacityAnim }]}>
        {/* Backdrop tap */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={onCancel}
          style={StyleSheet.absoluteFill}
        />

        <Animated.View
          style={[
            styles.modalCard,
            {
              backgroundColor: colors.background,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Icon */}
          <View
            style={[
              styles.modalIconWrap,
              { backgroundColor: `${colors.primary}14` },
            ]}
          >
            <Send size={28} color={colors.primary} strokeWidth={1.8} />
          </View>

          {/* Title */}
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            Kumpulkan Jawaban?
          </Text>
          <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
            Pastikan semua jawaban sudah benar sebelum dikumpulkan.
          </Text>

          {/* Stats */}
          <View
            style={[
              styles.statsRow,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <StatPill label="Dijawab" value={stats.answered} color="#22C55E" />
            <View
              style={[styles.statDivider, { backgroundColor: colors.border }]}
            />
            <StatPill label="Belum" value={stats.unanswered} color="#EF4444" />
            <View
              style={[styles.statDivider, { backgroundColor: colors.border }]}
            />
            <StatPill label="Ragu" value={stats.ragu} color="#F59E0B" />
          </View>

          {/* Warning jika ada yang belum dijawab */}
          {stats.unanswered > 0 && (
            <View
              style={[
                styles.warningBox,
                {
                  backgroundColor: 'rgba(239,68,68,0.08)',
                  borderColor: 'rgba(239,68,68,0.2)',
                },
              ]}
            >
              <AlertTriangle size={14} color="#EF4444" strokeWidth={2} />
              <Text style={styles.warningText}>
                {stats.unanswered} soal belum dijawab
              </Text>
            </View>
          )}

          {/* Buttons */}
          <View style={styles.modalButtons}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onCancel}
              disabled={submitting}
              style={[
                styles.btnSecondary,
                { borderColor: colors.border, backgroundColor: colors.card },
              ]}
            >
              <Text style={[styles.btnSecondaryText, { color: colors.text }]}>
                Periksa Lagi
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onConfirm}
              disabled={submitting}
              style={[styles.btnPrimary, { backgroundColor: colors.primary }]}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.btnPrimaryText}>Kumpulkan</Text>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

function StatPill({ label, value, color }) {
  return (
    <View style={styles.statPill}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

/* ─────────────────────────────────────────────
   MAIN SCREEN
───────────────────────────────────────────── */
export default function TryoutQuestionScreen({ route, navigation }) {
  const { colors, spacing } = useTheme();
  const { showToast } = useToast();

  const { attemptToken } = route.params;

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [paletteVisible, setPaletteVisible] = useState(false);
  const [submitVisible, setSubmitVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { remainingTime, setRemainingTime } = useTryoutTimer(0);

  // ── Blokir back button Android ──────────────────────
  useEffect(() => {
    const onBack = () => {
      setSubmitVisible(true);
      return true; // prevent default back
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => sub.remove();
  }, []);

  // ── Load questions ──────────────────────────────────
  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const response = await getAttemptQuestions(attemptToken);
      setQuestions(response.data.questions || []);
      setRemainingTime(response.data.remaining_time || 0);
    } catch (error) {
      console.log('GET QUESTION ERROR:', error);
      showToast(error?.message || 'Gagal memuat soal tryout', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ── Auto save setiap 10 detik ───────────────────────
  useEffect(() => {
    if (!Object.keys(answers).length) return;
    const interval = setInterval(() => handleSaveAnswers(), 10000);
    return () => clearInterval(interval);
  }, [answers]);

  const handleSaveAnswers = async () => {
    try {
      await saveAttemptAnswers(attemptToken, answers);
    } catch (error) {
      console.log('SAVE ANSWER ERROR:', error);
    }
  };

  // ── Auto submit saat waktu habis ────────────────────
  useEffect(() => {
    if (remainingTime === 0 && !loading && questions.length > 0) {
      handleSubmit();
    }
  }, [remainingTime]);

  // ── Select answer ───────────────────────────────────
  const selectAnswer = (questionId, option) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        answer: option.toUpperCase(),
        ragu: prev?.[questionId]?.ragu || false,
      },
    }));
  };

  // ── Toggle ragu ─────────────────────────────────────
  const toggleRagu = questionId => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        answer: prev?.[questionId]?.answer || '',
        ragu: !prev?.[questionId]?.ragu,
      },
    }));
  };

  // ── Stats untuk modal konfirmasi ────────────────────
  const submitStats = useMemo(() => {
    const answered = questions.filter(q => answers?.[q.id]?.answer).length;
    const ragu = questions.filter(q => answers?.[q.id]?.ragu).length;
    return {
      total: questions.length,
      answered,
      unanswered: questions.length - answered,
      ragu,
    };
  }, [questions, answers]);

  // ── Submit ──────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (submitting) return;

    try {
      setSubmitting(true);

      // Simpan jawaban terakhir dulu
      await saveAttemptAnswers(attemptToken, answers);

      // Submit
      const response = await submitAttempt(attemptToken);

      setSubmitVisible(false);

      showToast('Tryout berhasil dikumpulkan!', 'success');

      // Navigate ke halaman hasil
      navigation.replace('TryoutResult', {
        attemptToken,
        result: response?.data || null,
      });
    } catch (error) {
      console.log('SUBMIT ERROR:', error);
      showToast(error?.message || 'Gagal mengumpulkan jawaban', 'error');
    } finally {
      setSubmitting(false);
    }
  }, [submitting, attemptToken, answers, navigation]);

  // ── Derived state ───────────────────────────────────
  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers?.[currentQuestion?.id];

  const formattedTime = useMemo(
    () => formatTime(remainingTime),
    [remainingTime],
  );

  // ── Loading state ───────────────────────────────────
  if (loading) {
    return (
      <AppLayout>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <View style={{ flex: 1 }}>
        {/* HEADER */}
        <View
          style={{
            paddingHorizontal: spacing.md,
            paddingTop: spacing.md,
            paddingBottom: spacing.sm,
          }}
        >
          <TryoutHeader
            colors={colors}
            spacing={spacing}
            currentIndex={currentIndex}
            formattedTime={formattedTime}
          />

          {/* Navigasi soal trigger */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setPaletteVisible(true)}
            style={[
              styles.paletteButton,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View>
              <Text
                style={[styles.paletteLabel, { color: colors.textSecondary }]}
              >
                Navigasi Soal
              </Text>
              <Text style={[styles.paletteValue, { color: colors.text }]}>
                Soal {currentIndex + 1} dari {questions.length}
              </Text>
            </View>

            <View
              style={[
                styles.paletteBtn,
                { backgroundColor: `${colors.primary}15` },
              ]}
            >
              <Text style={[styles.paletteBtnText, { color: colors.primary }]}>
                Buka
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* CONTENT */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: spacing.md,
            paddingBottom: 140,
          }}
        >
          <QuestionCard question={currentQuestion} colors={colors} />

          <View style={{ height: spacing.md }} />

          {OPTIONS.map(option => {
            const optionText = currentQuestion?.pilihan?.[option];
            if (!optionText) return null;

            const selected = currentAnswer?.answer === option;

            return (
              <OptionCard
                key={option}
                option={option}
                text={optionText}
                selected={selected}
                onPress={() => selectAnswer(currentQuestion.id, option)}
                colors={colors}
                spacing={spacing}
              />
            );
          })}
        </ScrollView>

        {/* FOOTER */}
        <TryoutFooter
          colors={colors}
          spacing={spacing}
          currentIndex={currentIndex}
          questions={questions}
          currentAnswer={currentAnswer}
          currentQuestion={currentQuestion}
          toggleRagu={toggleRagu}
          setCurrentIndex={setCurrentIndex}
          onSubmitPress={() => setSubmitVisible(true)}
        />
      </View>

      {/* ── MODAL PALETTE ── */}
      <Modal
        visible={paletteVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPaletteVisible(false)}
      >
        <View style={[styles.paletteBackdrop, { padding: spacing.md }]}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setPaletteVisible(false)}
            style={StyleSheet.absoluteFill}
          />

          <View
            style={[styles.paletteCard, { backgroundColor: colors.background }]}
          >
            {/* Header */}
            <View style={{ marginBottom: spacing.md }}>
              <Text style={[styles.paletteTitle, { color: colors.text }]}>
                Navigasi Soal
              </Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  marginTop: 4,
                  fontSize: 12,
                }}
              >
                Hijau = sudah dijawab • Kuning = ragu-ragu
              </Text>
            </View>

            {/* Grid */}
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.paletteGrid}>
                {questions.map((item, index) => {
                  const ans = answers?.[item.id];
                  const answered = !!ans?.answer;
                  const isRagu = ans?.ragu;
                  const active = index === currentIndex;

                  const bg = active
                    ? colors.primary
                    : isRagu
                    ? '#F59E0B'
                    : answered
                    ? '#22C55E'
                    : colors.card;

                  return (
                    <TouchableOpacity
                      key={item.id}
                      activeOpacity={0.9}
                      onPress={() => {
                        setCurrentIndex(index);
                        setPaletteVisible(false);
                      }}
                      style={[
                        styles.paletteCell,
                        {
                          backgroundColor: bg,
                          borderColor: active ? colors.primary : colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.paletteCellText,
                          {
                            color:
                              active || answered || isRagu
                                ? '#fff'
                                : colors.text,
                          },
                        ]}
                      >
                        {index + 1}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            {/* Close */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setPaletteVisible(false)}
              style={[styles.paletteClose, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.paletteCloseText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── MODAL SUBMIT ── */}
      <SubmitModal
        visible={submitVisible}
        onCancel={() => !submitting && setSubmitVisible(false)}
        onConfirm={handleSubmit}
        stats={submitStats}
        submitting={submitting}
      />
    </AppLayout>
  );
}

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const styles = StyleSheet.create({
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Palette button
  paletteButton: {
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  paletteLabel: { fontSize: 11, marginBottom: 2 },
  paletteValue: { fontWeight: '700' },
  paletteBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  paletteBtnText: { fontWeight: '700', fontSize: 12 },

  // Palette modal
  paletteBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
  },
  paletteCard: {
    borderRadius: 24,
    padding: 16,
    maxHeight: '75%',
  },
  paletteTitle: { fontSize: 18, fontWeight: '800' },
  paletteGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  paletteCell: {
    width: '18%',
    aspectRatio: 1,
    margin: '1%',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  paletteCellText: { fontWeight: '800' },
  paletteClose: {
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  paletteCloseText: { color: '#fff', fontWeight: '800' },

  // Submit modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
  },
  modalIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    width: '100%',
    marginBottom: 14,
  },
  statPill: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 26,
  },
  statLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '600',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    marginVertical: 8,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    width: '100%',
    marginBottom: 20,
  },
  warningText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  btnSecondary: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSecondaryText: {
    fontWeight: '700',
    fontSize: 14,
  },
  btnPrimary: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimaryText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
});
