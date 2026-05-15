import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  RefreshControl,
  Linking,
} from 'react-native';

import {
  ChevronLeft,
  Search,
  FileText,
  PlayCircle,
  ExternalLink,
  House,
} from 'lucide-react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import AppLayout from '../../components/AppLayout';
import AppCard from '../../components/ui/AppCard';

import { useTheme } from '../../theme/ThemeProvider';
import { useToast } from '../../context/ToastProvider';

import { getMateriPeserta } from '../../api/materi/materi.api';

const tabs = [
  { key: 'all', label: 'Semua' },
  { key: 'document', label: 'Dokumen' },
  { key: 'video', label: 'Video' },
];

export default function MateriDetailScreen({ route, navigation }) {
  const { modulId, modulTitle } = route.params;

  const { colors, spacing, typography } = useTheme();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [materials, setMaterials] = useState([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadMateri();
  }, []);

  const loadMateri = async () => {
    try {
      setLoading(true);

      const data = await getMateriPeserta(modulId);

      setMaterials(Array.isArray(data) ? data : []);
    } catch (error) {
      showToast(error?.message || 'Gagal memuat materi');
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      await loadMateri();
    } finally {
      setRefreshing(false);
    }
  };

  const filteredMaterials = useMemo(() => {
    let result = Array.isArray(materials) ? materials : [];

    if (activeTab !== 'all') {
      result = result.filter(item => item.type === activeTab);
    }

    const keyword = search.trim().toLowerCase();

    if (keyword) {
      result = result.filter(item =>
        item.title?.toLowerCase().includes(keyword),
      );
    }

    return result;
  }, [materials, activeTab, search]);

  const openItem = item => {
    navigation.navigate('MateriViewer', {
      title: item.title,
      url: item.url,
      is_downloadable: item.is_downloadable,
    });
  };

  const renderTab = tab => {
    const active = activeTab === tab.key;

    return (
      <TouchableOpacity
        key={tab.key}
        activeOpacity={0.85}
        onPress={() => setActiveTab(tab.key)}
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
          {tab.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }) => {
    const isVideo = item.type === 'video';

    return (
      <TouchableOpacity activeOpacity={0.85} onPress={() => openItem(item)}>
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
              {isVideo ? (
                <PlayCircle size={20} color={colors.primary} />
              ) : (
                <FileText size={20} color={colors.primary} />
              )}
            </View>

            <View style={{ flex: 1 }}>
              <Text
                numberOfLines={2}
                style={[
                  typography.body,
                  {
                    color: colors.text,
                    fontWeight: '600',
                    lineHeight: 20,
                  },
                ]}
              >
                {item.title
                  ?.toLowerCase()
                  .replace(/\b\w/g, char => char.toUpperCase())}
              </Text>

              <Text
                style={[
                  typography.small,
                  {
                    color: colors.textSecondary,
                    marginTop: 4,
                    textTransform: 'capitalize',
                  },
                ]}
              >
                {isVideo ? 'Video' : 'Dokumen'}
              </Text>
            </View>

            <ExternalLink size={18} color={colors.textSecondary} />
          </View>
        </AppCard>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      edges={['bottom']}
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
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
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                marginRight: spacing.sm,
                padding: 4,
              }}
            >
              <ChevronLeft size={22} color={colors.text} />
            </TouchableOpacity>

            <View style={{ flex: 1 }}>
              <Text
                style={[
                  typography.small,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                Isi materi
              </Text>

              <Text
                numberOfLines={2}
                style={[
                  typography.h3,
                  {
                    color: colors.text,
                    marginTop: 2,
                  },
                ]}
              >
                {modulTitle}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'Tabs',
                      state: {
                        routes: [{ name: 'Home' }],
                      },
                    },
                  ],
                })
              }
              style={{
                marginLeft: spacing.sm,
                width: 38,
                height: 38,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: `${colors.primary}14`,
                borderWidth: 1,
                borderColor: `${colors.primary}25`,
              }}
            >
              <House size={18} color={colors.primary} />
            </TouchableOpacity>
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
              placeholder="Cari materi..."
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

          <Text
            style={[
              typography.small,
              {
                color: colors.textSecondary,
                marginBottom: spacing.md,
              },
            ]}
          >
            {filteredMaterials.length} materi tersedia
          </Text>

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
              data={filteredMaterials}
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
                    Tidak ada materi ditemukan
                  </Text>
                </View>
              }
            />
          )}
        </View>
      </AppLayout>
    </SafeAreaView>
  );
}
