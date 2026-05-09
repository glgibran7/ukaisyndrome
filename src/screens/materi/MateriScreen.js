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

import { BookText, ChevronRight, Search } from 'lucide-react-native';

import AppLayout from '../../components/AppLayout';
import AppCard from '../../components/ui/AppCard';

import { useTheme } from '../../theme/ThemeProvider';
import { useToast } from '../../context/ToastProvider';

import { getModulPeserta } from '../../api/modul/modul.api';

export default function MateriScreen({ navigation }) {
  const { colors, spacing, typography } = useTheme();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadModules();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadModules();
    } catch (error) {
      showToast(error?.message || 'Gagal memuat modul');
    } finally {
      setRefreshing(false);
    }
  };

  const loadModules = async () => {
    try {
      setLoading(true);
      const data = await getModulPeserta();
      setModules(data || []);
    } catch (error) {
      showToast(error?.message || 'Gagal memuat modul');
    } finally {
      setLoading(false);
    }
  };

  const filteredModules = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return modules;
    }

    return modules.filter(item => item.title?.toLowerCase().includes(keyword));
  }, [modules, search]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => {
        navigation.navigate('MateriDetail', {
          modulId: item.id,
          modulTitle: item.title,
        });
      }}
    >
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
            <BookText size={20} color={colors.primary} />
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
        {/* Header */}
        <View
          style={{
            marginBottom: spacing.md,
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
            Materi belajar
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
            Modul UKAI
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
            marginBottom: spacing.md,
          }}
        >
          <Search size={18} color={colors.textSecondary} />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Cari modul..."
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

        {/* Sub info */}
        <Text
          style={[
            typography.small,
            {
              color: colors.textSecondary,
              marginBottom: spacing.md,
            },
          ]}
        >
          {filteredModules.length} modul tersedia
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
            data={filteredModules}
            keyExtractor={item => String(item.id)}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 0,
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
                  Tidak ada modul ditemukan
                </Text>
              </View>
            }
          />
        )}
      </View>
    </AppLayout>
  );
}
