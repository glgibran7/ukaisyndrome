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

import { FileText, ChevronRight, Search } from 'lucide-react-native';

import AppLayout from '../../components/AppLayout';
import AppCard from '../../components/ui/AppCard';

import { useTheme } from '../../theme/ThemeProvider';
import { useToast } from '../../context/ToastProvider';

// nanti ganti ke API beneran
// import { getTryoutPeserta } from '../../api/tryout/tryout.api';

export default function TryoutScreen({ navigation }) {
  const { colors, spacing, typography } = useTheme();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [tryouts, setTryouts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadTryouts();
  }, []);

  const loadTryouts = async () => {
    try {
      setLoading(true);

      // ===== DUMMY DATA (sementara) =====
      const data = [
        { id: 1, title: 'Tryout UKAI Batch 1' },
        { id: 2, title: 'Simulasi OSCE Level 1' },
        { id: 3, title: 'Tryout Farmakologi Dasar' },
      ];

      setTryouts(data);

      // kalau sudah API:
      // const data = await getTryoutPeserta();
      // setTryouts(data || []);
    } catch (error) {
      showToast(error?.message || 'Gagal memuat tryout');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadTryouts();
    } catch (error) {
      showToast(error?.message || 'Gagal refresh');
    } finally {
      setRefreshing(false);
    }
  };

  const filteredTryouts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return tryouts;

    return tryouts.filter(item => item.title?.toLowerCase().includes(keyword));
  }, [tryouts, search]);

  const openTryout = item => {
    // nanti arahkan ke detail tryout
    navigation.navigate('TryoutDetail', {
      tryoutId: item.id,
      title: item.title,
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity activeOpacity={0.85} onPress={() => openTryout(item)}>
      <AppCard
        style={{
          marginBottom: spacing.sm,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
            <FileText size={20} color={colors.primary} />
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
              Ujian tersedia
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
          <Text
            style={[
              typography.small,
              {
                color: colors.textSecondary,
              },
            ]}
          >
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
            placeholder="Cari tryout..."
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
          {filteredTryouts.length} tryout tersedia
        </Text>

        {/* CONTENT */}
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
            data={filteredTryouts}
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
                  Tidak ada tryout ditemukan
                </Text>
              </View>
            }
          />
        )}
      </View>
    </AppLayout>
  );
}
