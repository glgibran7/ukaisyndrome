import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  RefreshControl,
} from 'react-native';

import { FileText, ChevronRight, Search, Trophy } from 'lucide-react-native';

import AppLayout from '../../components/AppLayout';
import AppCard from '../../components/ui/AppCard';

import { useTheme } from '../../theme/ThemeProvider';
import { useToast } from '../../context/ToastProvider';

import {
  getTryoutPeserta,
  getTryoutResults,
} from '../../api/tryout/tryout.api';

const tabs = [
  { key: 'tryout', label: 'Tryout' },
  { key: 'result', label: 'Hasil' },
];

export default function TryoutScreen({ navigation, route }) {
  const { colors, spacing, typography } = useTheme();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const initialTab = route?.params?.initialTab || 'tryout';

  const [tab, setTab] = useState(initialTab);
  const [search, setSearch] = useState('');

  const [tryouts, setTryouts] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // ambil tryout
      const tryoutRes = await getTryoutPeserta();

      setTryouts(tryoutRes?.data || []);

      // hasil tryout optional
      try {
        const resultRes = await getTryoutResults();
        setResults(resultRes?.data || []);
      } catch (err) {
        console.log('Result endpoint belum tersedia:', err);
        setResults([]);
      }
    } catch (error) {
      console.log('TRYOUT ERROR:', error);

      showToast(error?.message || 'Gagal memuat data tryout', 'error');
    } finally {
      setLoading(false);
    }
  };
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadData();
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const openAttemptToken = route?.params?.openAttemptToken;

    if (tab === 'result' && openAttemptToken && results.length > 0) {
      const found = results.find(
        item => item.attempt_token === openAttemptToken,
      );

      if (found) {
        navigation.navigate('TryoutHasilDetail', {
          attemptToken: found.attempt_token,
          title: found.nama_tryout,
        });
      }
    }
  }, [tab, results, route]);

  const activeData = useMemo(() => {
    const source = tab === 'tryout' ? tryouts : results;
    const keyword = search.trim().toLowerCase();

    if (!keyword) return source;

    return source.filter(item => item.title?.toLowerCase().includes(keyword));
  }, [tab, tryouts, results, search]);

  const handleOpen = item => {
    if (tab === 'tryout') {
      navigation.navigate('TryoutDetail', {
        tryout: item,
      });
      return;
    }
    navigation.navigate('TryoutHasilDetail', {
      attemptToken: item.attempt_token,
      title: item.nama_tryout,
    });
  };

  const renderTab = item => {
    const active = tab === item.key;

    return (
      <TouchableOpacity
        key={item.key}
        activeOpacity={0.85}
        onPress={() => setTab(item.key)}
        style={{
          flex: 1,
          paddingVertical: 10,
          borderRadius: 14,
          alignItems: 'center',
          backgroundColor: active ? colors.primary : 'transparent',
        }}
      >
        <Text
          style={[
            typography.small,
            {
              color: active ? '#fff' : colors.textSecondary,
              fontWeight: '600',
            },
          ]}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };
  const getStatusConfig = status => {
    switch (status) {
      case 'ongoing':
        return {
          label: 'Berlangsung',
          color: '#22C55E',
          bg: 'rgba(34,197,94,0.12)',
        };

      case 'upcoming':
        return {
          label: 'Akan Datang',
          color: '#F59E0B',
          bg: 'rgba(245,158,11,0.12)',
        };

      case 'closed':
        return {
          label: 'Ditutup',
          color: '#EF4444',
          bg: 'rgba(239,68,68,0.12)',
        };

      default:
        return {
          label: 'Unknown',
          color: colors.textSecondary,
          bg: `${colors.textSecondary}15`,
        };
    }
  };

  const renderItem = ({ item }) => {
    const isResult = tab === 'result';

    // =====================================================
    // RESULT CARD
    // =====================================================
    if (isResult) {
      return (
        <TouchableOpacity activeOpacity={0.9} onPress={() => handleOpen(item)}>
          <AppCard
            style={{
              marginBottom: spacing.sm,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 18,
              paddingVertical: 14,
              paddingHorizontal: 14,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              {/* SCORE */}
              <View
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 18,
                  backgroundColor: `${colors.primary}12`,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 14,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '800',
                    color: colors.primary,
                  }}
                >
                  {item.score}
                </Text>

                <Text
                  style={{
                    fontSize: 9,
                    fontWeight: '700',
                    color: colors.primary,
                    marginTop: 1,
                  }}
                >
                  SCORE
                </Text>
              </View>

              {/* CONTENT */}
              <View style={{ flex: 1 }}>
                {/* TITLE */}
                <Text
                  numberOfLines={1}
                  style={[
                    typography.body,
                    {
                      color: colors.text,
                      fontWeight: '700',
                      fontSize: 14,
                    },
                  ]}
                >
                  {item.title}
                </Text>

                {/* ATTEMPT */}
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: 11,
                    marginTop: 3,
                    fontWeight: '600',
                  }}
                >
                  Percobaan ke-{item.attempt_ke}
                </Text>

                {/* STATS */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    marginTop: 8,
                  }}
                >
                  <Text
                    style={{
                      color: '#22C55E',
                      fontSize: 11,
                      fontWeight: '700',
                    }}
                  >
                    {item.benar} benar
                  </Text>

                  <Text
                    style={{
                      color: colors.textSecondary,
                      marginHorizontal: 6,
                      fontSize: 10,
                    }}
                  >
                    •
                  </Text>

                  <Text
                    style={{
                      color: '#EF4444',
                      fontSize: 11,
                      fontWeight: '700',
                    }}
                  >
                    {item.salah} salah
                  </Text>

                  <Text
                    style={{
                      color: colors.textSecondary,
                      marginHorizontal: 6,
                      fontSize: 10,
                    }}
                  >
                    •
                  </Text>

                  <Text
                    style={{
                      color: colors.text,
                      fontSize: 11,
                      fontWeight: '700',
                    }}
                  >
                    {item.kosong} kosong
                  </Text>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      marginHorizontal: 6,
                      fontSize: 10,
                    }}
                  >
                    •
                  </Text>
                  <Text
                    style={{
                      color: '#F59E0B',
                      fontSize: 11,
                      fontWeight: '700',
                    }}
                  >
                    {item.kosong} Ragu
                  </Text>
                </View>

                {/* DATE */}
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: 10,
                    marginTop: 7,
                  }}
                >
                  {new Date(item.tanggal).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </Text>
              </View>

              <ChevronRight size={18} color={colors.textSecondary} />
            </View>
          </AppCard>
        </TouchableOpacity>
      );
    }

    // =====================================================
    // TRYOUT CARD
    // =====================================================

    const statusConfig = getStatusConfig(item.status);

    const disabled = item.status === 'closed' || item.status === 'upcoming';

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        disabled={disabled}
        onPress={() => handleOpen(item)}
      >
        <AppCard
          style={{
            marginBottom: spacing.sm,
            borderWidth: 1,

            borderColor:
              item.status === 'ongoing' ? colors.border : '${colors.primary}20',

            opacity: item.status === 'closed' ? 0.7 : 1,

            borderRadius: 18,
            paddingVertical: 13,
            paddingHorizontal: 14,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            {/* ICON */}
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: `${colors.primary}14`,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <FileText size={20} color={colors.primary} />
            </View>

            {/* CONTENT */}
            <View style={{ flex: 1 }}>
              {/* TITLE */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Text
                  numberOfLines={1}
                  style={[
                    typography.body,
                    {
                      flex: 1,
                      color: colors.text,
                      fontWeight: '700',
                      fontSize: 14,
                      marginRight: 8,
                    },
                  ]}
                >
                  {item.title}
                </Text>

                {/* STATUS */}
                <View
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderRadius: 999,
                    backgroundColor: statusConfig.bg,
                  }}
                >
                  <Text
                    style={{
                      color: statusConfig.color,
                      fontSize: 9,
                      fontWeight: '800',
                    }}
                  >
                    {statusConfig.label}
                  </Text>
                </View>
              </View>

              {/* META */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  marginTop: 7,
                }}
              >
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: 11,
                    fontWeight: '600',
                  }}
                >
                  {item.total_soal} soal
                </Text>

                <Text
                  style={{
                    color: colors.textSecondary,
                    marginHorizontal: 5,
                    fontSize: 10,
                  }}
                >
                  •
                </Text>

                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: 11,
                    fontWeight: '600',
                  }}
                >
                  {item.duration} menit
                </Text>

                <Text
                  style={{
                    color: colors.textSecondary,
                    marginHorizontal: 5,
                    fontSize: 10,
                  }}
                >
                  •
                </Text>

                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: 11,
                    fontWeight: '600',
                  }}
                >
                  Max: {item.max_attempt}x
                </Text>
                <Text
                  style={{
                    color: colors.textSecondary,
                    marginHorizontal: 5,
                    fontSize: 10,
                  }}
                >
                  •
                </Text>

                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: 11,
                    fontWeight: '600',
                  }}
                >
                  Sisa: {item.remaining_attempt}x
                </Text>
              </View>

              {/* DATE */}
              <Text
                numberOfLines={1}
                style={{
                  color: colors.textSecondary,
                  fontSize: 10,
                  marginTop: 6,
                }}
              >
                {new Date(item.access_start_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                })}
                {' - '}
                {new Date(item.access_end_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </Text>
            </View>

            {!disabled && (
              <ChevronRight
                size={18}
                color={colors.textSecondary}
                style={{ marginLeft: 8 }}
              />
            )}
          </View>
        </AppCard>
      </TouchableOpacity>
    );
  };

  return (
    <AppLayout>
      <View
        style={{
          flex: 1,
          paddingTop: spacing.md,
          paddingHorizontal: spacing.md,
        }}
      >
        {/* Header */}
        <View style={{ marginBottom: spacing.md }}>
          <Text style={[typography.small, { color: colors.textSecondary }]}>
            Latihan ujian
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
            Tryout UKAI
          </Text>
        </View>

        {/* Search */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.card || colors.background,
            borderRadius: 16,
            paddingHorizontal: 14,
            marginBottom: spacing.sm,
          }}
        >
          <Search size={18} color={colors.textSecondary} />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder={
              tab === 'tryout' ? 'Cari tryout...' : 'Cari hasil tryout...'
            }
            placeholderTextColor={colors.textSecondary}
            style={{
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 10,
              color: colors.text,
              fontSize: 14,
            }}
          />
        </View>

        {/* Tabs */}
        <View
          style={{
            flexDirection: 'row',
            padding: 4,
            borderRadius: 16,
            backgroundColor: colors.card || colors.background,
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: spacing.md,
          }}
        >
          {tabs.map(renderTab)}
        </View>

        {/* Info */}
        <Text
          style={[
            typography.small,
            {
              color: colors.textSecondary,
              marginBottom: spacing.md,
            },
          ]}
        >
          {activeData.length}{' '}
          {tab === 'tryout' ? 'tryout tersedia' : 'hasil tersedia'}
        </Text>

        {/* Content */}
        {loading ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={activeData}
            keyExtractor={(item, index) => {
              if (tab === 'result') {
                return item.attempt_token
                  ? String(item.attempt_token)
                  : `result-${index}`;
              }

              return item.id ? String(item.id) : `tryout-${index}`;
            }}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 120, // space untuk bottom tab
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
            ListEmptyComponent={
              <View
                style={{
                  paddingTop: spacing.xl,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={[
                    typography.small,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  {tab === 'tryout'
                    ? 'Tidak ada tryout ditemukan'
                    : 'Belum ada hasil tryout'}
                </Text>
              </View>
            }
          />
        )}
      </View>
    </AppLayout>
  );
}
