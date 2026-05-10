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

import { BarChart3, ChevronRight, Search, Trophy } from 'lucide-react-native';

import AppLayout from '../../components/AppLayout';
import AppCard from '../../components/ui/AppCard';

import { useTheme } from '../../theme/ThemeProvider';
import { useToast } from '../../context/ToastProvider';

// nanti ganti API real
// import { getHasilTryout } from '../../api/hasil/hasil.api';

export default function HasilScreen({ navigation }) {
  const { colors, spacing, typography } = useTheme();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [hasil, setHasil] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadHasil();
  }, []);

  const loadHasil = async () => {
    try {
      setLoading(true);

      // ===== DUMMY DATA =====
      const data = [
        {
          id: 1,
          title: 'Tryout UKAI Batch 1',
          score: 78,
          date: '2026-05-01',
        },
        {
          id: 2,
          title: 'Simulasi OSCE Level 1',
          score: 82,
          date: '2026-05-03',
        },
        {
          id: 3,
          title: 'Farmakologi Dasar',
          score: 65,
          date: '2026-05-05',
        },
      ];

      setHasil(data);

      // kalau API:
      // const data = await getHasilTryout();
      // setHasil(data || []);
    } catch (error) {
      showToast(error?.message || 'Gagal memuat hasil');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadHasil();
    } catch (error) {
      showToast(error?.message || 'Gagal refresh');
    } finally {
      setRefreshing(false);
    }
  };

  const filteredHasil = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return hasil;

    return hasil.filter(item => item.title?.toLowerCase().includes(keyword));
  }, [hasil, search]);

  const getScoreColor = score => {
    if (score >= 80) return '#22C55E'; // hijau
    if (score >= 60) return '#FACC15'; // kuning
    return '#EF4444'; // merah
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() =>
        navigation.navigate('HasilDetail', {
          id: item.id,
          title: item.title,
        })
      }
    >
      <AppCard
        style={{
          marginBottom: spacing.sm,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* ICON */}
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
            <Trophy size={20} color={colors.primary} />
          </View>

          {/* CONTENT */}
          <View style={{ flex: 1 }}>
            <Text
              style={[
                typography.body,
                {
                  color: colors.text,
                  fontWeight: '600',
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
              {item.date}
            </Text>
          </View>

          {/* SCORE */}
          <View style={{ alignItems: 'flex-end', marginRight: 10 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '800',
                color: getScoreColor(item.score),
              }}
            >
              {item.score}
            </Text>

            <Text style={[typography.small, { color: colors.textSecondary }]}>
              skor
            </Text>
          </View>

          <ChevronRight size={18} color={colors.textSecondary} />
        </View>
      </AppCard>
    </TouchableOpacity>
  );

  return (
    <AppLayout>
      <View
        style={{
          flex: 1,
          paddingTop: spacing.md,
          paddingHorizontal: spacing.md,
        }}
      >
        {/* HEADER */}
        <View style={{ marginBottom: spacing.md }}>
          <Text style={[typography.small, { color: colors.textSecondary }]}>
            Rekap hasil ujian
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
            Hasil Tryout
          </Text>
        </View>

        {/* SEARCH */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.card || colors.background,
            borderRadius: 16,
            paddingHorizontal: 14,
            marginBottom: spacing.md,
          }}
        >
          <Search size={18} color={colors.textSecondary} />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Cari hasil..."
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

        {/* INFO */}
        <Text
          style={[
            typography.small,
            {
              color: colors.textSecondary,
              marginBottom: spacing.md,
            },
          ]}
        >
          {filteredHasil.length} hasil tersedia
        </Text>

        {/* LIST */}
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
            data={filteredHasil}
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
                  style={[typography.small, { color: colors.textSecondary }]}
                >
                  Belum ada hasil tryout
                </Text>
              </View>
            }
          />
        )}
      </View>
    </AppLayout>
  );
}
