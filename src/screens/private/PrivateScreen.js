import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  Search,
  ChevronRight,
  FileText,
  PlayCircle,
  Download,
} from 'lucide-react-native';

import AppLayout from '../../components/AppLayout';
import AppCard from '../../components/ui/AppCard';

import { useTheme } from '../../theme/ThemeProvider';
import { useToast } from '../../context/ToastProvider';

import { getPrivateMaterials } from '../../api/materi/private.api';

const TAB_OPTIONS = [
  { key: 'all', label: 'Semua' },
  { key: 'video', label: 'Video' },
  { key: 'document', label: 'Dokumen' },
];

export default function PrivateScreen({ navigation }) {
  const { colors, spacing, typography } = useTheme();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [materials, setMaterials] = useState([]);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');

  const loadPrivateMaterials = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getPrivateMaterials();
      setMaterials(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log('PRIVATE ERROR:', error);
      showToast(error?.message || 'Gagal memuat materi private');
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadPrivateMaterials();
  }, [loadPrivateMaterials]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadPrivateMaterials();
    } finally {
      setRefreshing(false);
    }
  };

  const filteredMaterials = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return (Array.isArray(materials) ? materials : []).filter(item => {
      const matchTab = tab === 'all' || item.type === tab;
      const matchSearch = keyword
        ? item.title?.toLowerCase().includes(keyword)
        : true;

      return matchTab && matchSearch;
    });
  }, [materials, search, tab]);

  const openMaterial = item => {
    navigation.navigate('PrivateViewer', {
      title: item.title,
      url: item.url,
    });
  };

  const openUrl = async url => {
    if (!url) {
      showToast('Link tidak tersedia');
      return;
    }

    try {
      await Linking.openURL(url);
    } catch (error) {
      showToast('Gagal membuka link');
    }
  };

  const renderTab = ({ key, label }) => {
    const active = tab === key;

    return (
      <TouchableOpacity
        key={key}
        activeOpacity={0.85}
        onPress={() => setTab(key)}
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
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }) => {
    const isVideo = item.type === 'video';
    const canDownload = !isVideo && Number(item.is_downloadable) === 1;

    return (
      <TouchableOpacity activeOpacity={0.88} onPress={() => openMaterial(item)}>
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
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: `${colors.primary}16`,
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
                style={[
                  typography.body,
                  {
                    color: colors.text,
                    fontWeight: '600',
                    lineHeight: 20,
                  },
                ]}
              >
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
                  {item.title
                    ?.toLowerCase()
                    .replace(/\b\w/g, char => char.toUpperCase())}
                </Text>
              </Text>

              <Text
                style={[
                  typography.small,
                  {
                    color: colors.textSecondary,
                    marginTop: 3,
                    textTransform: 'capitalize',
                  },
                ]}
              >
                {isVideo ? 'Video private' : 'Dokumen private'}
              </Text>
            </View>

            {canDownload ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => openUrl(item.url)} // FIXED
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: `${colors.primary}12`,
                  marginLeft: spacing.sm,
                }}
              >
                <Download size={18} color={colors.primary} />
              </TouchableOpacity>
            ) : (
              <ChevronRight size={18} color={colors.textSecondary} />
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
            Materi eksklusif peserta
          </Text>

          <Text style={[typography.h1, { color: colors.text, marginTop: 4 }]}>
            Private Class
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
            placeholder="Cari materi private..."
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
          {TAB_OPTIONS.map(renderTab)}
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
          {filteredMaterials.length} materi tersedia
        </Text>

        {/* Content */}
        {loading ? (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={filteredMaterials}
            keyExtractor={item => String(item.id || item.id_material)}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: spacing.md }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
            ListEmptyComponent={
              <View style={{ paddingTop: spacing.xl, alignItems: 'center' }}>
                <Text
                  style={[typography.small, { color: colors.textSecondary }]}
                >
                  Tidak ada materi ditemukan
                </Text>
              </View>
            }
          />
        )}
      </View>
    </AppLayout>
  );
}
