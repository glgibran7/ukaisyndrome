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

// nanti ganti API asli
// import { getTryoutPeserta, getTryoutResults } from '../../api/tryout/tryout.api';

const tabs = [
  { key: 'tryout', label: 'Tryout' },
  { key: 'result', label: 'Hasil' },
];

export default function TryoutScreen({ navigation }) {
  const { colors, spacing, typography } = useTheme();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [tab, setTab] = useState('tryout');
  const [search, setSearch] = useState('');

  const [tryouts, setTryouts] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // dummy data
      const tryoutData = [
        { id: 1, title: 'Tryout UKAI Batch 1' },
        { id: 2, title: 'Simulasi OSCE Level 1' },
        { id: 3, title: 'Tryout Farmakologi Dasar' },
      ];

      const resultData = [
        { id: 101, title: 'Tryout UKAI Batch 1', score: 82 },
        { id: 102, title: 'Simulasi OSCE Level 1', score: 76 },
      ];

      setTryouts(tryoutData);
      setResults(resultData);

      // nanti kalau API
      // const tryoutData = await getTryoutPeserta();
      // const resultData = await getTryoutResults();
    } catch (error) {
      showToast(error?.message || 'Gagal memuat data tryout');
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

  const activeData = useMemo(() => {
    const source = tab === 'tryout' ? tryouts : results;
    const keyword = search.trim().toLowerCase();

    if (!keyword) return source;

    return source.filter(item => item.title?.toLowerCase().includes(keyword));
  }, [tab, tryouts, results, search]);

  const handleOpen = item => {
    if (tab === 'tryout') {
      navigation.navigate('TryoutDetail', {
        tryoutId: item.id,
        title: item.title,
      });
      return;
    }

    navigation.navigate('TryoutResultDetail', {
      resultId: item.id,
      title: item.title,
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

  const renderItem = ({ item }) => {
    const isResult = tab === 'result';

    return (
      <TouchableOpacity activeOpacity={0.85} onPress={() => handleOpen(item)}>
        <AppCard
          style={{
            marginBottom: spacing.sm,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                backgroundColor: `${colors.primary}18`,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: spacing.md,
              }}
            >
              {isResult ? (
                <Trophy size={20} color={colors.primary} />
              ) : (
                <FileText size={20} color={colors.primary} />
              )}
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={[
                  typography.body,
                  {
                    color: colors.text,
                    fontWeight: '600',
                    lineHeight: 20,
                  },
                ]}
              >
                {item.title}
              </Text>

              <Text
                style={[
                  typography.small,
                  {
                    color: colors.textSecondary,
                    marginTop: 2,
                  },
                ]}
              >
                {isResult ? `Nilai: ${item.score}` : 'Ujian tersedia'}
              </Text>
            </View>

            <ChevronRight size={18} color={colors.textSecondary} />
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
            keyExtractor={item => String(item.id)}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
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
