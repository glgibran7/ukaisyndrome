import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Linking,
  RefreshControl,
} from 'react-native';

import {
  ChevronLeft,
  Search,
  FileText,
  ExternalLink,
  House,
  Video,
  FileVideo,
  CirclePlay,
} from 'lucide-react-native';

import AppLayout from '../../components/AppLayout';
import AppCard from '../../components/ui/AppCard';

import { useTheme } from '../../theme/ThemeProvider';
import { useToast } from '../../context/ToastProvider';

import { getMateriPeserta } from '../../api/materi/materi.api';

export default function VideoDetailScreen({ route, navigation }) {
  const { modulId, modulTitle } = route.params;
  const [refreshing, setRefreshing] = useState(false);

  const { colors, spacing, typography } = useTheme();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [materials, setMaterials] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadMateri();
  }, []);

  const loadMateri = async () => {
    try {
      setLoading(true);

      const data = await getMateriPeserta(modulId);

      const filtered = (data || []).filter(item => item.type === 'video');

      setMaterials(filtered);
    } catch (error) {
      showToast(error?.message || 'Gagal memuat materi');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadMateri();
    } catch (error) {
      showToast(error?.message || 'Gagal memuat materi');
    } finally {
      setRefreshing(false);
    }
  };

  const filteredMaterials = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return materials;
    }

    return materials.filter(item =>
      item.title?.toLowerCase().includes(keyword),
    );
  }, [materials, search]);

  const openDocument = item => {
    navigation.navigate('MateriViewer', {
      title: item.title,
      url: item.url,
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity activeOpacity={0.85} onPress={() => openDocument(item)}>
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
            <CirclePlay size={20} color={colors.primary} />
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
          </View>

          <ExternalLink size={18} color={colors.textSecondary} />
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
              Isi video belajar
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
            marginBottom: spacing.md,
          }}
        >
          <Search size={18} color={colors.textSecondary} />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Cari dokumen..."
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

        <Text
          style={[
            typography.small,
            {
              color: colors.textSecondary,
              marginBottom: spacing.md,
            },
          ]}
        >
          {filteredMaterials.length} dokumen tersedia
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
                  Tidak ada dokumen ditemukan
                </Text>
              </View>
            }
          />
        )}
      </View>
    </AppLayout>
  );
}
