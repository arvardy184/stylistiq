// Navigation types
export type RootStackParamList = {
  Main: undefined;
  PhotoAnalysis: { imageUri?: string };
  OutfitDetails: { outfitId: string };
  ClothesDetail: { clothesId: string; clothesName: string };
  MatchResult: { analyzedItem: any };
  Schedule: { selectedDate?: string };
  ScheduleForm: { 
    selectedDate: string; 
    schedule?: any; 
    mode: "create" | "edit" 
  };
  ScheduleDetail: { 
    scheduleId: string; 
    scheduleName: string 
  };
  Login: undefined;
  Register: undefined;
  Notification: undefined;
  ResetPassword: { email: string };
  ChangePassword: undefined;
  Onboarding: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Wardrobe: undefined;
  Scan: undefined;
  Collections: undefined;
  Profile: undefined;
};

// Outfit analysis types
export interface OutfitAnalysis {
  id: string;
  imageUri: string;
  isMatching: boolean;
  score: number;
  recommendations: string[];
  colorPalette: string[];
  styleCategory: StyleCategory;
  feedback: string;
  analyzedAt: Date;
}

export type StyleCategory =
  | "casual"
  | "formal"
  | "business"
  | "party"
  | "sporty"
  | "vintage"
  | "street";

// User preferences
export interface UserPreferences {
  favoriteColors: string[];
  stylePreferences: StyleCategory[];
  bodyType?: string;
  darkMode: boolean;
}

// API types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface AnalyzeOutfitRequest {
  imageBase64: string;
  userPreferences?: UserPreferences;
}

// Component props
export interface PhotoPickerProps {
  onImageSelected: (uri: string) => void;
  onError: (error: string) => void;
}

// Fix for navigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export interface OutfitCardProps {
  outfit: OutfitAnalysis;
  onPress: () => void;
}
