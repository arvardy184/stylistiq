import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthState } from "./type";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      loginTime: null,

      setToken: (token: string) =>
        set({
          token,
          loginTime: Date.now(),
        }),

      clearToken: () =>
        set({
          token: null,
          loginTime: null,
        }),

      isTokenExpired: () => {
        const { loginTime } = get();
        if (!loginTime) return false;

        const now = Date.now();
        const hoursPassed = (now - loginTime) / (1000 * 60 * 60);
        return hoursPassed >= 24;
      },
    }),
    {
      name: "auth-storage",
      storage: {
        getItem: async (key) => {
          const item = await AsyncStorage.getItem(key);
          return item ? JSON.parse(item) : null;
        },
        setItem: async (key, value) => {
          await AsyncStorage.setItem(key, JSON.stringify(value));
        },
        removeItem: async (key) => {
          await AsyncStorage.removeItem(key);
        },
      },
    }
  )
);
