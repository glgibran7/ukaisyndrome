import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import { ChevronLeft, House } from 'lucide-react-native';

import AppLayout from '../../components/AppLayout';
import { useTheme } from '../../theme/ThemeProvider';
import { useUserStore } from '../../store/userStore';

function transformGoogleDriveUrl(url) {
  if (!url) return '';

  if (url.includes('/preview')) {
    return url;
  }

  const match = url.match(/\/d\/(.*?)\//);

  if (match?.[1]) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }

  return url;
}

export default function PrivateViewerScreen({ route, navigation }) {
  const { title, url } = route.params;

  const { colors, spacing, typography } = useTheme();
  const user = useUserStore(state => state.user);

  const name = user?.name || 'Peserta';
  const previewUrl = transformGoogleDriveUrl(url);

  const watermarks = Array.from({ length: 48 });

  return (
    <AppLayout>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: spacing.md,
            paddingTop: spacing.sm,
            paddingBottom: spacing.sm,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            backgroundColor: colors.background,
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

          <Text
            numberOfLines={2}
            style={[
              typography.body,
              {
                flex: 1,
                color: colors.text,
                fontWeight: '700',
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
              {title
                ?.toLowerCase()
                .replace(/\b\w/g, char => char.toUpperCase())}
            </Text>{' '}
          </Text>

          <TouchableOpacity
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
              width: 34,
              height: 34,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: `${colors.primary}14`,
            }}
          >
            <House size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Watermark */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignContent: 'space-around',
          }}
        >
          {watermarks.map((_, i) => (
            <Text
              key={i}
              style={{
                width: '33%',
                textAlign: 'center',
                fontSize: 14,
                fontWeight: '700',
                color: 'rgba(0,0,0,0.06)',
                transform: [{ rotate: '-25deg' }],
                marginVertical: 40,
              }}
            >
              {name}
            </Text>
          ))}
        </View>

        {/* Viewer */}
        <View style={{ flex: 1 }}>
          <WebView
            source={{ uri: previewUrl }}
            startInLoadingState
            javaScriptEnabled
            domStorageEnabled
          />

          {/* Overlay kanan atas */}
          <View
            pointerEvents="auto"
            style={{
              position: 'absolute',
              top: 2,
              right: 2,
              width: 72,
              height: 72,
              borderRadius: 14,
              backgroundColor: colors.background,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <Image
              source={require('../../assets/images/logo.png')}
              style={{
                width: 48,
                height: 48,
                resizeMode: 'contain',
              }}
            />
          </View>
        </View>
      </View>
    </AppLayout>
  );
}
