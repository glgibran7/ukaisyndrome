import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';

const ToastContext = createContext({
  showToast: () => {},
});

export function ToastProvider({ children }) {
  const queue = useRef([]);
  const showing = useRef(false);
  const timeoutRef = useRef(null);

  const translateY = useRef(new Animated.Value(40)).current;
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
      Animated.timing(translateY, {
        toValue: 40,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
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

      translateY.setValue(40);
      opacity.setValue(0);

      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        hideInternal();
      }, 2200);
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

  const backgroundColor = toast.type === 'success' ? '#16A34A' : '#DC2626';

  const icon = toast.type === 'success' ? '✓' : '!';

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
            left: 20,
            right: 20,
            bottom: 28,
            opacity,
            transform: [{ translateY }],
          }}
        >
          <TouchableOpacity
            activeOpacity={0.96}
            onPress={hideToast}
            style={{
              backgroundColor,
              borderRadius: 18,
              paddingHorizontal: 16,
              paddingVertical: 14,
              shadowColor: '#000',
              shadowOpacity: 0.15,
              shadowRadius: 14,
              shadowOffset: { width: 0, height: 8 },
              elevation: 8,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                backgroundColor: 'rgba(255,255,255,0.18)',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: '700',
                }}
              >
                {icon}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: '700',
                  marginBottom: 1,
                }}
              >
                {toast.type === 'success' ? 'Berhasil' : 'Terjadi Kesalahan'}
              </Text>

              <Text
                style={{
                  color: '#fff',
                  fontSize: 13,
                  lineHeight: 18,
                  opacity: 0.95,
                }}
              >
                {toast.message}
              </Text>
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
