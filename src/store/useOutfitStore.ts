import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OutfitAnalysis, UserPreferences } from '@/types';

interface OutfitStore {
  // State
  outfits: OutfitAnalysis[];
  currentAnalysis: OutfitAnalysis | null;
  userPreferences: UserPreferences;
  isLoading: boolean;
  
  // Actions
  addOutfit: (outfit: OutfitAnalysis) => void;
  removeOutfit: (id: string) => void;
  setCurrentAnalysis: (analysis: OutfitAnalysis | null) => void;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
  setLoading: (loading: boolean) => void;
  clearOutfits: () => void;
}

export const useOutfitStore = create<OutfitStore>()(
  persist(
    (set, get) => ({
      // Initial state
      outfits: [],
      currentAnalysis: null,
      userPreferences: {
        favoriteColors: [],
        stylePreferences: [],
        darkMode: false,
      },
      isLoading: false,

      // Actions
      addOutfit: (outfit) =>
        set((state) => ({
          outfits: [outfit, ...state.outfits],
        })),

      removeOutfit: (id) =>
        set((state) => ({
          outfits: state.outfits.filter((outfit) => outfit.id !== id),
        })),

      setCurrentAnalysis: (analysis) =>
        set({ currentAnalysis: analysis }),

      updateUserPreferences: (preferences) =>
        set((state) => ({
          userPreferences: { ...state.userPreferences, ...preferences },
        })),

      setLoading: (loading) =>
        set({ isLoading: loading }),

      clearOutfits: () =>
        set({ outfits: [], currentAnalysis: null }),
    }),
    {
      name: 'outfit-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 