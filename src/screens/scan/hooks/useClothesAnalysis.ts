import { useState, useCallback } from 'react';
import { useAuthStore } from '@/store/auth/authStore';
import { analyzeClothes, createClothes } from '@/services/api/clothes';
import { AnalysisResultItem, Clothes } from '../types';
import { ClothesFormData } from '@/screens/clothes/types';
import Toast from 'react-native-toast-message';

export const useClothesAnalysis = () => {
  const { token } = useAuthStore();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addImages = useCallback((uris: string[]) => {
    // Avoid duplicates
    const newUris = uris.filter(uri => !selectedImages.includes(uri));
    setSelectedImages(prev => [...prev, ...newUris]);
  }, [selectedImages]);

  const removeImage = useCallback((uri: string) => {
    setSelectedImages(prev => prev.filter(item => item !== uri));
  }, []);

  const startAnalysis = useCallback(async () => {
    if (!token || selectedImages.length === 0) {
      Toast.show({ type: 'error', text1: 'No images selected.' });
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResults([]);

    try {
      console.log('🚀 Starting analysis...');
      const response = await analyzeClothes(token, selectedImages);
      
      if (response && response.clothes && Array.isArray(response.clothes)) {
        // The API returns a flat list of clothes. We map them to AnalysisResultItem.
        // This assumes that if one image is sent, all results belong to it.
        const results: AnalysisResultItem[] = response.clothes.map((detected: any) => {
          const clothesItem: Clothes = {
            id: detected.id,
            name: detected.itemType || 'Untitled', // Map itemType to name
            image: detected.image,
            category: detected.category,
            color: detected.color,
            season: detected.season || 'All Season', // Default season if not provided
            createdAt: detected.createdAt,
            updatedAt: detected.updatedAt,
          };

          return {
            id: detected.id,
            success: true,
            message: 'Item detected successfully',
            // Assumption: associate with the first image if multiple clothes are detected.
            // This part may need refinement if the API supports linking results to specific images in a multi-image upload.
            originalImageUri: selectedImages[0], 
            detectedItem: clothesItem,
          };
        });
        
        setAnalysisResults(results);
        console.log('✅ Analysis complete (processed):', results);
      } else {
        throw new Error('Invalid response from server. Expected a "clothes" array.');
      }
    } catch (err: any) {
      console.error('❌ Analysis failed:', err);
      const errorMessage = err.message || err.response?.data?.message || 'An unexpected error occurred during analysis.';
      setError(errorMessage);
      Toast.show({ type: 'error', text1: 'Analysis Failed', text2: errorMessage });
    } finally {
      setIsLoading(false);
    }
  }, [token, selectedImages]);

  const saveAnalyzedItem = useCallback(async (item: Clothes) => {
    if (!token) return;
    
    // Convert Clothes to ClothesFormData
    const formData: ClothesFormData = {
      name: item.name,
      category: item.category,
      color: item.color,
      season: item.season,
      image: item.image, // Assuming the analysis result gives a URL to the processed image
    };

    try {
      console.log(`🔄 Saving item: ${item.name}`);
      // Since the backend already processed the image, we might not need to re-upload it.
      // This depends on the API. Assuming `createClothes` can handle a URL or a new file upload.
      // For now, let's just use the existing createClothes logic which expects a FormData.
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('category', formData.category);
      payload.append('color', formData.color);
      payload.append('season', formData.season);
      if (formData.image) {
          payload.append('image', {
              uri: formData.image,
              type: 'image/jpeg',
              name: 'uploaded_image.jpg',
          } as any);
      }
      
      await createClothes(token, payload);
      
      Toast.show({
        type: 'success',
        text1: 'Item Saved!',
        text2: `${item.name} has been added to your wardrobe.`,
      });
      
      // Remove from results list to indicate it's been saved
      setAnalysisResults(prev => prev.filter(r => r.detectedItem?.id !== item.id));

    } catch (err: any) {
      console.error(`❌ Failed to save item: ${item.name}`, err);
      const errorMessage = err.response?.data?.message || 'Could not save item.';
      Toast.show({ type: 'error', text1: 'Save Failed', text2: errorMessage });
    }
  }, [token]);


  const clearAll = useCallback(() => {
    setSelectedImages([]);
    setAnalysisResults([]);
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    selectedImages,
    analysisResults,
    isLoading,
    error,
    addImages,
    removeImage,
    startAnalysis,
    saveAnalyzedItem,
    clearAll,
  };
}; 