import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';

import RenderHTML from 'react-native-render-html';

import { ChevronLeft, ChevronRight, Clock3, Flag } from 'lucide-react-native';

import AppLayout from '../../components/AppLayout';
import AppCard from '../../components/ui/AppCard';

import { useTheme } from '../../theme/ThemeProvider';

import {
  getAttemptQuestions,
  saveAttemptAnswers,
} from '../../api/tryout/attempt.api';

const { width } = Dimensions.get('window');

const OPTIONS = ['A', 'B', 'C', 'D', 'E'];

export default function TryoutQuestionScreen({ route, navigation }) {
  const { colors, spacing, typography } = useTheme();

  const { attemptToken } = route.params;

  const [loading, setLoading] = useState(true);

  const [questions, setQuestions] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [answers, setAnswers] = useState({});

  const [remainingTime, setRemainingTime] = useState(0);

  // =====================================================
  // LOAD QUESTIONS
  // =====================================================

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

      Alert.alert('Error', 'Gagal memuat soal tryout');
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // TIMER
  // =====================================================

  useEffect(() => {
    if (remainingTime <= 0) return;

    const interval = setInterval(() => {
      setRemainingTime(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingTime]);

  // =====================================================
  // AUTOSAVE
  // =====================================================

  useEffect(() => {
    if (!Object.keys(answers).length) return;

    const interval = setInterval(() => {
      handleSaveAnswers();
    }, 10000);

    return () => clearInterval(interval);
  }, [answers]);

  const handleSaveAnswers = async () => {
    try {
      await saveAttemptAnswers(attemptToken, answers);
    } catch (error) {
      console.log('SAVE ANSWER ERROR:', error);
    }
  };

  // =====================================================
  // SELECT ANSWER
  // =====================================================

  const selectAnswer = (questionId, option) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        answer: option.toUpperCase(),
        ragu: prev?.[questionId]?.ragu || false,
      },
    }));
  };

  // =====================================================
  // TOGGLE RAGU
  // =====================================================

  const toggleRagu = questionId => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        answer: prev?.[questionId]?.answer || '',
        ragu: !prev?.[questionId]?.ragu,
      },
    }));
  };

  // =====================================================
  // CURRENT QUESTION
  // =====================================================

  const currentQuestion = questions[currentIndex];

  const currentAnswer = answers?.[currentQuestion?.id];

  // =====================================================
  // TIMER FORMAT
  // =====================================================

  const formattedTime = useMemo(() => {
    const hours = Math.floor(remainingTime / 3600);

    const minutes = Math.floor((remainingTime % 3600) / 60);

    const seconds = remainingTime % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0',
    )}:${String(seconds).padStart(2, '0')}`;
  }, [remainingTime]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <AppLayout>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
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
          {/* TOP */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: spacing.md,
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: 18,
                fontWeight: '800',
              }}
            >
              Soal {currentIndex + 1}
            </Text>

            {/* TIMER */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: `${colors.primary}12`,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 14,
              }}
            >
              <Clock3 size={16} color={colors.primary} />

              <Text
                style={{
                  color: colors.primary,
                  fontWeight: '800',
                  marginLeft: 6,
                }}
              >
                {formattedTime}
              </Text>
            </View>
          </View>

          {/* PALETTE */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {questions.map((item, index) => {
              const answered = answers?.[item.id]?.answer;

              const active = index === currentIndex;

              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => setCurrentIndex(index)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,

                    marginRight: 10,

                    alignItems: 'center',
                    justifyContent: 'center',

                    backgroundColor: active
                      ? colors.primary
                      : answered
                      ? '#22C55E'
                      : colors.card,

                    borderWidth: 1,
                    borderColor: active ? colors.primary : colors.border,
                  }}
                >
                  <Text
                    style={{
                      color: active ? '#fff' : answered ? '#fff' : colors.text,

                      fontWeight: '700',
                    }}
                  >
                    {index + 1}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* CONTENT */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: spacing.md,
            paddingBottom: 140,
          }}
        >
          {/* QUESTION */}
          <AppCard
            style={{
              borderRadius: 22,
              marginBottom: spacing.md,
            }}
          >
            <RenderHTML
              contentWidth={width - 40}
              source={{
                html: currentQuestion?.pertanyaan || '',
              }}
              baseStyle={{
                color: colors.text,
                fontSize: 15,
                lineHeight: 26,
              }}
            />
          </AppCard>

          {/* OPTIONS */}
          {OPTIONS.map(option => {
            const selected = currentAnswer?.answer === option;

            const optionText = currentQuestion?.pilihan?.[option];

            if (!optionText) return null;

            return (
              <TouchableOpacity
                key={option}
                activeOpacity={0.9}
                onPress={() => selectAnswer(currentQuestion.id, option)}
              >
                <AppCard
                  style={{
                    marginBottom: spacing.sm,

                    borderRadius: 18,

                    borderWidth: 1,

                    borderColor: selected ? colors.primary : colors.border,

                    backgroundColor: selected
                      ? `${colors.primary}10`
                      : colors.card,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                    }}
                  >
                    {/* OPTION */}
                    <View
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 12,

                        alignItems: 'center',
                        justifyContent: 'center',

                        backgroundColor: selected
                          ? colors.primary
                          : `${colors.primary}10`,

                        marginRight: 12,
                      }}
                    >
                      <Text
                        style={{
                          color: selected ? '#fff' : colors.primary,

                          fontWeight: '800',
                        }}
                      >
                        {option}
                      </Text>
                    </View>

                    {/* TEXT */}
                    <Text
                      style={{
                        flex: 1,
                        color: colors.text,
                        fontSize: 14,
                        lineHeight: 24,
                      }}
                    >
                      {optionText}
                    </Text>
                  </View>
                </AppCard>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* FOOTER */}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,

            padding: spacing.md,

            backgroundColor: colors.background,

            borderTopWidth: 1,
            borderTopColor: colors.border,
          }}
        >
          {/* RAGU */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => toggleRagu(currentQuestion.id)}
            style={{
              height: 48,
              borderRadius: 16,

              alignItems: 'center',
              justifyContent: 'center',

              marginBottom: spacing.sm,

              flexDirection: 'row',

              backgroundColor: currentAnswer?.ragu ? '#F59E0B' : colors.card,

              borderWidth: 1,
              borderColor: currentAnswer?.ragu ? '#F59E0B' : colors.border,
            }}
          >
            <Flag
              size={18}
              color={currentAnswer?.ragu ? '#fff' : colors.textSecondary}
            />

            <Text
              style={{
                marginLeft: 8,

                color: currentAnswer?.ragu ? '#fff' : colors.text,

                fontWeight: '700',
              }}
            >
              Tandai Ragu-ragu
            </Text>
          </TouchableOpacity>

          {/* NAVIGATION */}
          <View
            style={{
              flexDirection: 'row',
            }}
          >
            {/* PREV */}
            <TouchableOpacity
              disabled={currentIndex === 0}
              onPress={() => setCurrentIndex(prev => prev - 1)}
              style={{
                flex: 1,

                height: 52,

                borderRadius: 16,

                alignItems: 'center',
                justifyContent: 'center',

                marginRight: 8,

                backgroundColor: colors.card,

                borderWidth: 1,
                borderColor: colors.border,

                opacity: currentIndex === 0 ? 0.5 : 1,
              }}
            >
              <ChevronLeft size={22} color={colors.text} />
            </TouchableOpacity>

            {/* NEXT */}
            <TouchableOpacity
              onPress={() =>
                setCurrentIndex(prev =>
                  prev + 1 >= questions.length ? prev : prev + 1,
                )
              }
              style={{
                flex: 4,

                height: 52,

                borderRadius: 16,

                alignItems: 'center',
                justifyContent: 'center',

                flexDirection: 'row',

                backgroundColor: colors.primary,
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontWeight: '800',
                  marginRight: 8,
                }}
              >
                Soal Berikutnya
              </Text>

              <ChevronRight size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </AppLayout>
  );
}
