import { Clothes } from "@/screens/collections/types";

// The result for a single analyzed image
export interface AnalysisResultItem {
  id: string; // Could be a temporary ID or the ID of the new clothing item
  success: boolean; // Was the analysis successful for this image?
  message?: string; // Optional message, e.g., "No clothes found" or an error
  originalImageUri: string; // The local URI of the image that was sent
  detectedItem: Clothes | null; // The clothes data if analysis was successful
}

// The overall API response for the /clothes/analyze endpoint
export interface ClothesAnalysisResponse {
  statusCode: number;
  message: string;
  data: AnalysisResultItem[];
}

// Props for the main screen component
export interface ScanScreenProps {
  navigation: any;
}

// Props for child components
export interface ImageGridProps {
  images: { uri: string }[];
  onRemoveImage: (uri: string) => void;
  onAddImages: () => void;
}

export interface AnalysisResultListProps {
  results: AnalysisResultItem[];
  onDone: () => void;
  onSaveItem: (item: Clothes) => void;
}

export interface AnalysisResultCardProps {
  result: AnalysisResultItem;
  onSave: (item: Clothes) => void;
} 

export type { Clothes };
