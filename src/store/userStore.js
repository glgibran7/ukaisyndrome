import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getMe } from '../api/user/user.api';
import { removeToken } from '../utils/token';
import { removeAccessToken } from '../utils/authStorage';

export const useUserStore = create(
  persist(
    set => ({
      user: null,
      loading: false,

      fetchUser: async () => {
        try {
          set({ loading: true });

          const data = await getMe();

          set({
            user: data,
            loading: false,
          });

          return data;
        } catch (error) {
          console.log('Gagal fetch user:', error);

          set({
            user: null,
            loading: false,
          });

          throw error;
        }
      },
      setUser: user => set({ user }),

      logout: async () => {
        try {
          // kosongkan state memory dulu
          set({
            user: null,
            loading: false,
          });

          // hapus token
          await removeToken();
          await removeAccessToken();

          // hapus storage persist zustand
          await useUserStore.persist.clearStorage();
        } catch (error) {
          console.log('Logout error:', error);
        }
      },
    }),
    {
      name: 'ukai-user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        user: state.user,
      }),
    },
  ),
);
