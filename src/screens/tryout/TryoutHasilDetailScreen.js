import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  StyleSheet,
  BackHandler,
} from 'react-native';

import {
  ChevronLeft,
  House,
  CheckCircle,
  XCircle,
  MinusCircle,
  Flag,
} from 'lucide-react-native';
import { WebView } from 'react-native-webview';

import AppLayout from '../../components/AppLayout';
import { useTheme } from '../../theme/ThemeProvider';
import { useToast } from '../../context/ToastProvider';
import { getTryoutReport } from '../../api/tryout/attempt.api';
import QuestionPaletteModal from '../../components/tryout/QuestionPaletteModal';

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const OPTIONS = ['A', 'B', 'C', 'D', 'E'];

/* ─────────────────────────────────────────────
   HTML RENDERER — render pertanyaan HTML + gambar
───────────────────────────────────────────── */
function HtmlRenderer({ html, colors }) {
  const wrappedHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: -apple-system, sans-serif;
            font-size: 15px;
            line-height: 1.6;
            color: ${colors.text};
            background: transparent;
            padding: 0;
          }
          img {
            max-width: 100%;
            height: auto;
            border-radius: 10px;
            margin-top: 8px;
          }
          p { margin-bottom: 6px; }
        </style>
      </head>
      <body>${html}</body>
    </html>
  `;

  const [height, setHeight] = useState(80);

  return (
    <WebView
      source={{ html: wrappedHtml }}
      style={{ height, backgroundColor: 'transparent' }}
      scrollEnabled={false}
      onMessage={e => setHeight(Number(e.nativeEvent.data))}
      injectedJavaScript={`
        setTimeout(() => {
          window.ReactNativeWebView.postMessage(
            String(document.documentElement.scrollHeight)
          );
        }, 100);
        true;
      `}
      javaScriptEnabled
    />
  );
}

/* ─────────────────────────────────────────────
   OPTION ITEM — tampilkan pilihan dengan status
───────────────────────────────────────────── */
function OptionItem({ option, text, isCorrect, isUserAnswer, colors }) {
  const isWrong = isUserAnswer && !isCorrect;

  const bg = isCorrect
    ? 'rgba(34,197,94,0.1)'
    : isWrong
    ? 'rgba(239,68,68,0.08)'
    : colors.card;

  const borderColor = isCorrect
    ? '#22C55E'
    : isWrong
    ? '#EF4444'
    : colors.border;

  const textColor = isCorrect ? '#22C55E' : isWrong ? '#EF4444' : colors.text;

  return (
    <View style={[styles.optionItem, { backgroundColor: bg, borderColor }]}>
      {/* Label */}
      <View
        style={[
          styles.optionLabel,
          {
            borderColor,
            backgroundColor: isCorrect || isWrong ? borderColor : colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.optionLabelText,
            { color: isCorrect || isWrong ? '#fff' : colors.textSecondary },
          ]}
        >
          {option}
        </Text>
      </View>

      {/* Text */}
      <Text style={[styles.optionText, { color: textColor, flex: 1 }]}>
        {text}
      </Text>

      {/* Icon */}
      {isCorrect && <CheckCircle size={18} color="#22C55E" strokeWidth={2} />}
      {isWrong && <XCircle size={18} color="#EF4444" strokeWidth={2} />}
    </View>
  );
}

/* ─────────────────────────────────────────────
   MAIN SCREEN
───────────────────────────────────────────── */
export default function TryoutHasilDetailScreen({ route, navigation }) {
  const { colors, spacing, typography } = useTheme();
  const { showToast } = useToast();

  // Ambil data dari route params
  // data: array of question results (dari response API hasil detail)
  // title: judul tryout
  const { attemptToken, title = 'Hasil Tryout' } = route?.params ?? {};

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paletteVisible, setPaletteVisible] = useState(false);
  const [pembahasanExpanded, setPembahasanExpanded] = useState(false);

  const loadReport = async () => {
    try {
      setLoading(true);

      const response = await getTryoutReport(attemptToken);

      // sesuaikan jika struktur API berbeda
      setQuestions(response?.data || []);
    } catch (error) {
      console.log('GET REPORT ERROR:', error);

      showToast(error?.message || 'Gagal memuat pembahasan tryout', 'error');

      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  // Reset expanded saat ganti soal
  useEffect(() => {
    setPembahasanExpanded(false);
  }, [currentIndex]);

  // Blokir back Android → langsung navigasi back
  useEffect(() => {
    const onBack = () => {
      navigation.goBack();
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => sub.remove();
  }, []);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  /* ── Status config ── */
  const getStatusConfig = status => {
    switch (status) {
      case 'benar':
        return { label: 'Benar', color: '#22C55E', icon: CheckCircle };
      case 'salah':
        return { label: 'Salah', color: '#EF4444', icon: XCircle };
      default:
        return { label: 'Kosong', color: '#9CA3AF', icon: MinusCircle };
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      </AppLayout>
    );
  }

  if (!questions.length) {
    return (
      <AppLayout>
        <View style={styles.loadingWrap}>
          <Text style={{ color: colors.textSecondary }}>
            Data pembahasan tidak tersedia
          </Text>
        </View>
      </AppLayout>
    );
  }

  const statusConfig = getStatusConfig(currentQuestion?.status);
  const StatusIcon = statusConfig.icon;

  return (
    <AppLayout>
      <View style={{ flex: 1 }}>
        {/* ── Header ── */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.background,
              borderBottomColor: colors.border,
              paddingHorizontal: spacing.md,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerBack}
          >
            <ChevronLeft size={22} color={colors.text} />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text
              numberOfLines={1}
              style={[styles.headerTitle, { color: colors.text }]}
            >
              {title?.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
            </Text>
            <Text style={[styles.headerSub, { color: colors.textSecondary }]}>
              Review Jawaban
            </Text>
          </View>

          <TouchableOpacity
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [
                  { name: 'Tabs', state: { routes: [{ name: 'Tryout' }] } },
                ],
              })
            }
            style={[styles.homeBtn, { backgroundColor: `${colors.primary}14` }]}
          >
            <House size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* ── Navigasi soal trigger ── */}
        <View
          style={{
            paddingHorizontal: spacing.md,
            paddingTop: spacing.sm,
            paddingBottom: spacing.xs ?? 6,
          }}
        >
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

            {/* Status badge */}
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
            >
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: `${statusConfig.color}15` },
                ]}
              >
                <StatusIcon
                  size={12}
                  color={statusConfig.color}
                  strokeWidth={2.5}
                />
                <Text
                  style={[
                    styles.statusBadgeText,
                    { color: statusConfig.color },
                  ]}
                >
                  {statusConfig.label}
                </Text>
              </View>

              <View
                style={[
                  styles.paletteBtn,
                  { backgroundColor: `${colors.primary}15` },
                ]}
              >
                <Text
                  style={[styles.paletteBtnText, { color: colors.primary }]}
                >
                  Buka
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── Konten soal ── */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: spacing.md,
            paddingBottom: 120,
          }}
        >
          {/* Nomor soal + flag ragu */}
          <View style={styles.questionMeta}>
            <View
              style={[
                styles.questionNumber,
                { backgroundColor: `${colors.primary}14` },
              ]}
            >
              <Text
                style={[styles.questionNumberText, { color: colors.primary }]}
              >
                No. {currentQuestion?.nomor}
              </Text>
            </View>

            {currentQuestion?.is_ragu && (
              <View style={styles.raguBadge}>
                <Flag size={11} color="#F59E0B" strokeWidth={2.5} />
                <Text style={styles.raguText}>Ragu-ragu</Text>
              </View>
            )}
          </View>

          {/* Pertanyaan */}
          <View
            style={[
              styles.questionCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <HtmlRenderer
              html={currentQuestion?.pertanyaan ?? ''}
              colors={colors}
            />
          </View>

          {/* Pilihan jawaban */}
          <View style={{ marginTop: spacing.sm }}>
            {OPTIONS.map(option => {
              const text = currentQuestion?.pilihan?.[option];
              if (!text) return null;

              const isCorrect = currentQuestion?.correct_answer === option;
              const isUserAnswer = currentQuestion?.user_answer === option;

              return (
                <OptionItem
                  key={option}
                  option={option}
                  text={text}
                  isCorrect={isCorrect}
                  isUserAnswer={isUserAnswer}
                  colors={colors}
                />
              );
            })}
          </View>

          {/* Jawaban kamu vs jawaban benar */}
          <View
            style={[
              styles.answerSummary,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.answerRow}>
              <Text
                style={[styles.answerLabel, { color: colors.textSecondary }]}
              >
                Jawaban kamu
              </Text>
              <Text
                style={[
                  styles.answerValue,
                  {
                    color: currentQuestion?.user_answer
                      ? currentQuestion?.status === 'benar'
                        ? '#22C55E'
                        : '#EF4444'
                      : '#9CA3AF',
                  },
                ]}
              >
                {currentQuestion?.user_answer || '—'}
              </Text>
            </View>
            <View
              style={[styles.answerDivider, { backgroundColor: colors.border }]}
            />
            <View style={styles.answerRow}>
              <Text
                style={[styles.answerLabel, { color: colors.textSecondary }]}
              >
                Jawaban benar
              </Text>
              <Text style={[styles.answerValue, { color: '#22C55E' }]}>
                {currentQuestion?.correct_answer}
              </Text>
            </View>
          </View>

          {/* Pembahasan */}
          {currentQuestion?.pembahasan ? (
            <View
              style={[
                styles.pembahasanCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setPembahasanExpanded(prev => !prev)}
                style={styles.pembahasanHeader}
              >
                <Text style={[styles.pembahasanTitle, { color: colors.text }]}>
                  Pembahasan
                </Text>
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: 12,
                    fontWeight: '700',
                  }}
                >
                  {pembahasanExpanded ? 'Tutup' : 'Lihat'}
                </Text>
              </TouchableOpacity>

              {pembahasanExpanded && (
                <View style={{ marginTop: 8 }}>
                  <HtmlRenderer
                    html={currentQuestion.pembahasan}
                    colors={colors}
                  />
                </View>
              )}
            </View>
          ) : (
            <View
              style={[
                styles.pembahasanCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Text
                style={[
                  styles.pembahasanTitle,
                  { color: colors.textSecondary },
                ]}
              >
                Tidak ada pembahasan
              </Text>
            </View>
          )}
        </ScrollView>

        {/* ── Footer navigasi ── */}
        <View
          style={[
            styles.footer,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
              paddingHorizontal: spacing.md,
              paddingBottom: spacing.md,
              paddingTop: spacing.sm,
            },
          ]}
        >
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {/* Prev */}
            <TouchableOpacity
              disabled={currentIndex === 0}
              onPress={() => setCurrentIndex(prev => prev - 1)}
              style={[
                styles.navBtn,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  opacity: currentIndex === 0 ? 0.4 : 1,
                },
              ]}
            >
              <ChevronLeft size={22} color={colors.text} />
            </TouchableOpacity>

            {/* Next / Selesai */}
            {isLastQuestion ? (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => navigation.goBack()}
                style={[
                  styles.navBtnPrimary,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={styles.navBtnPrimaryText}>Selesai Review</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setCurrentIndex(prev => prev + 1)}
                style={[
                  styles.navBtnPrimary,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={styles.navBtnPrimaryText}>Soal Berikutnya</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* ── MODAL PALETTE ── */}
      <QuestionPaletteModal
        visible={paletteVisible}
        onClose={() => setPaletteVisible(false)}
        questions={questions}
        currentIndex={currentIndex}
        mode="pembahasan"
        onSelect={index => setCurrentIndex(index)}
        answers={Object.fromEntries(
          questions.map(item => [
            item.id,
            {
              answer: item.user_answer,
              ragu: item.is_ragu,
            },
          ]),
        )}
      />
    </AppLayout>
  );
}

/* ─────────────────────────────────────────────
   HELPER
───────────────────────────────────────────── */
function LegendDot({ color, label }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginRight: 12,
      }}
    >
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 99,
          backgroundColor: color,
        }}
      />
      <Text style={{ fontSize: 11, color: '#9CA3AF', fontWeight: '600' }}>
        {label}
      </Text>
    </View>
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

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  headerBack: { padding: 4 },
  headerTitle: { fontSize: 14, fontWeight: '700' },
  headerSub: { fontSize: 11, marginTop: 1 },
  homeBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
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

  // Status badge
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusBadgeText: { fontSize: 11, fontWeight: '700' },

  // Question
  questionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    marginTop: 4,
  },
  questionNumber: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  questionNumberText: { fontSize: 12, fontWeight: '700' },
  raguBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(245,158,11,0.12)',
  },
  raguText: { fontSize: 11, color: '#F59E0B', fontWeight: '700' },

  questionCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 4,
  },

  // Options
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 12,
    marginBottom: 8,
    gap: 10,
  },
  optionLabel: {
    width: 30,
    height: 30,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabelText: { fontSize: 13, fontWeight: '800' },
  optionText: { fontSize: 13, lineHeight: 20 },

  // Answer summary
  answerSummary: {
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 8,
    overflow: 'hidden',
  },
  answerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  answerDivider: { height: 1, marginHorizontal: 16 },
  answerLabel: { fontSize: 13, fontWeight: '600' },
  answerValue: { fontSize: 16, fontWeight: '800' },

  // Pembahasan
  pembahasanCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginTop: 10,
  },
  pembahasanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pembahasanTitle: { fontSize: 14, fontWeight: '700' },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  navBtn: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnPrimary: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnPrimaryText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },

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
  paletteLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  paletteGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  paletteCell: {
    width: '18%',
    aspectRatio: 1,
    margin: '1%',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  paletteCellText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  raguDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 7,
    height: 7,
    borderRadius: 99,
    backgroundColor: '#F59E0B',
    borderWidth: 1,
    borderColor: '#fff',
  },
  paletteClose: {
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  paletteCloseText: { color: '#fff', fontWeight: '800' },
});
