// Import existing Clothes interface from collections
import { Clothes } from "../../collections/types";

// Re-export for consistency
export type { Clothes };

// API Response types
export interface ClothesResponse {
  statusCode: number;
  message: string;
  data: Clothes[];
}

export interface ClothesDetailResponse {
  statusCode: number;
  message: string;
  data: Clothes;
}

// Navigation types
export interface ClothesScreenProps {
  navigation: any;
}

export interface ClothesDetailScreenProps {
  navigation: any;
  route: {
    params: {
      clothesId: string;
      clothesName: string;
    };
  };
}

// Component Props
export interface ClothesCardProps {
  item: Clothes;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isSelected?: boolean;
  onSelect?: () => void;
  selectionMode?: boolean;
}

export interface ClothesGridProps {
  clothes: Clothes[];
  onClothesPress: (item: Clothes) => void;
  onClothesEdit?: (item: Clothes) => void;
  onClothesDelete?: (item: Clothes) => void;
  selectionMode?: boolean;
  selectedItems?: string[];
  onItemSelect?: (id: string) => void;
}

export interface ClothesFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: ClothesFormData) => void;
  initialData?: ClothesFormData;
  title: string;
  submitText: string;
}

// Form Data types
export interface ClothesFormData {
  itemType: string;
  category: string;
  color: string;
  image?: string;
  note?: string;
}

// Filter types
export interface ClothesFilters {
  category?: string;
  color?: string;
  season?: string;
  search?: string;
}

// Categories and options
export const CLOTHES_CATEGORIES = [
  "top",
  "bottom", 
  "outer",
  "head_wear",
  "accessory",
  "foot_wear",
  "full_body"
] as const;

export const CLOTHES_COLORS = [
  "Red",
  "Blue", 
  "Green",
  "Yellow",
  "Purple",
  "Orange",
  "Pink",
  "Black",
  "White",
  "Gray",
  "Brown",
  "Beige",
  "Navy",
  "Maroon"
] as const;

export const CLOTHES_SEASONS = [
  "Spring",
  "Summer",
  "Fall",
  "Winter",
  "All Season"
] as const;

export type ClothesCategory = typeof CLOTHES_CATEGORIES[number];
export type ClothesColor = typeof CLOTHES_COLORS[number];
export type ClothesSeason = typeof CLOTHES_SEASONS[number]; 