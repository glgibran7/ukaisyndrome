import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  PanResponder,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ToastContext = createContext({
  showToast: () => {},
});

export function ToastProvider({ children }) {
  const insets = useSafeAreaInsets();

  const queue = useRef([]);
  const showing = useRef(false);
  const timeoutRef = useRef(null);

  const translateY = useRef(new Animated.Value(-28)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'error',
  });

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const hideInternal = useCallback(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: -28,
        speed: 24,
        bounciness: 0,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToast(prev => ({
        ...prev,
        visible: false,
      }));

      showing.current = false;

      if (queue.current.length > 0) {
        const next = queue.current.shift();

        setTimeout(() => {
          showInternal(next);
        }, 80);
      }
    });
  }, [opacity, translateY]);

  const showInternal = useCallback(
    ({ message, type }) => {
      showing.current = true;

      setToast({
        visible: true,
        message,
        type,
      });

      translateY.setValue(-28);
      opacity.setValue(0);

      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          speed: 18,
          bounciness: 4,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        hideInternal();
      }, 2300);
    },
    [hideInternal, opacity, translateY],
  );

  const showToast = useCallback(
    (message, type = 'error') => {
      const payload = { message, type };

      if (showing.current) {
        queue.current.push(payload);
        return;
      }

      showInternal(payload);
    },
    [showInternal],
  );

  const hideToast = useCallback(() => {
    if (!showing.current) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    hideInternal();
  }, [hideInternal]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 4,

      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy < 0) {
          translateY.setValue(gestureState.dy);
        }
      },

      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -28 || gestureState.vy < -0.7) {
          hideToast();
          return;
        }

        Animated.spring(translateY, {
          toValue: 0,
          speed: 18,
          bounciness: 5,
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  const value = useMemo(
    () => ({
      showToast,
    }),
    [showToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      {toast.visible && (
        <Animated.View
          pointerEvents="box-none"
          style={{
            position: 'absolute',
            left: 12,
            right: 12,
            top: insets.top + 6,
            opacity,
            transform: [{ translateY }],
            zIndex: 9999,
          }}
          {...panResponder.panHandlers}
        >
          <TouchableOpacity
            activeOpacity={0.97}
            onPress={hideToast}
            style={{
              borderRadius: 18,
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                minHeight: 56,
                paddingHorizontal: 14,
                paddingVertical: 11,
                borderRadius: 18,

                backgroundColor: 'rgba(255,255,255,0.92)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.7)',

                shadowColor: '#000',
                shadowOpacity: 0.08,
                shadowRadius: 16,
                shadowOffset: { width: 0, height: 6 },
                elevation: 6,

                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  backgroundColor:
                    toast.type === 'success' ? '#22C55E' : '#EF4444',
                  marginRight: 10,
                  marginTop: 2,
                }}
              />

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '700',
                    color: '#111827',
                    marginBottom: 1,
                  }}
                >
                  {toast.type === 'success' ? 'Berhasil' : 'Terjadi kesalahan'}
                </Text>

                <Text
                  numberOfLines={2}
                  style={{
                    fontSize: 13,
                    lineHeight: 18,
                    color: '#374151',
                    fontWeight: '500',
                  }}
                >
                  {toast.message}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast harus dipakai di dalam ToastProvider');
  }

  return context;
}
