import { useState, useCallback } from 'react';
import { useAuthStore } from '@/store/auth/authStore';
import { analyzeClothes, createClothes } from '@/services/api/clothes';
import { AnalysisResultItem } from '../types';
import { Clothes } from '@/screens/collections/types'; 
import Toast from 'react-native-toast-message';
import { formatCategoryDisplay } from '@/utils/formatCategoryDisplay';

export const useClothesAnalysis = () => {
  const { token } = useAuthStore();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addImages = useCallback((uris: string[]) => {
    console.log('📸 Adding images to analysis:', uris);
    const newUris = uris.filter(uri => !selectedImages.includes(uri));
    setSelectedImages(prev => [...prev, ...newUris]);
    console.log('📸 Total selected images:', selectedImages.length + newUris.length);
  }, [selectedImages]);

  const removeImage = useCallback((uri: string) => {
    console.log('🗑️ Removing image from analysis:', uri);
    setSelectedImages(prev => prev.filter(item => item !== uri));
  }, []);

  const startAnalysis = useCallback(async () => {
    if (!token) {
      Toast.show({ type: 'error', text1: 'Authentication Error', text2: 'Please login first.' });
      return;
    }

    if (selectedImages.length === 0) {
      Toast.show({ type: 'error', text1: 'No Images', text2: 'Please select images to analyze.' });
      return;
    }

    console.log('🚀 [ANALYSIS] Starting analysis for', selectedImages.length, 'images');
    setIsLoading(true);
    setError(null);
    setAnalysisResults([]);

    try {
      const response = await analyzeClothes(token, selectedImages);
      console.log('📊 [ANALYSIS] Raw response:', response);
      
      if (response && response.clothes && Array.isArray(response.clothes)) {
        // Map API response to AnalysisResultItem format
        const results: AnalysisResultItem[] = response.clothes.map((detected: any, index: number) => {
          const clothesItem: Clothes = {
            id: detected.id || `temp-${Date.now()}-${index}`,
            itemType: detected.itemType || 'Unknown Item',
            image: detected.image || selectedImages[index] || selectedImages[0],
            category: detected.category || 'Uncategorized',
            color: detected.color || 'Unknown',
            status: detected.status || 'Belum Dimiliki',
            note: detected.note || undefined, // Optional field
            createdAt: detected.createdAt || new Date().toISOString(),
            updatedAt: detected.updatedAt || new Date().toISOString(),
          };

          return {
            id: clothesItem.id,
            success: true,
            message: `${detected.itemType || 'Item'} detected successfully`,
            originalImageUri: selectedImages[index] || selectedImages[0],
            detectedItem: clothesItem,
          };
        });
        
        setAnalysisResults(results);
        console.log('✅ [ANALYSIS] Analysis complete:', results.length, 'items detected');
        
        Toast.show({
          type: 'success',
          text1: 'Analysis Complete!',
          text2: `Found ${results.length} clothing items`,
        });
      } else {
        throw new Error('Invalid response format from analysis API. Expected a "clothes" array.');
      }
    } catch (err: any) {
      console.error('❌ [ANALYSIS] Analysis failed:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Analysis failed unexpectedly';
      setError(errorMessage);
      Toast.show({ 
        type: 'error', 
        text1: 'Analysis Failed', 
        text2: errorMessage 
      });
    } finally {
      setIsLoading(false);
    }
  }, [token, selectedImages]);

  const saveAnalyzedItem = useCallback(async (item: Clothes) => {
    if (!token) {
      Toast.show({ type: 'error', text1: 'Authentication Error', text2: 'Please login first.' });
      return;
    }
    
    console.log('💾 [SAVE] Saving analyzed item:', item.itemType);

    try {
      // Create FormData with correct field mapping
      const formData = new FormData();
      formData.append('itemType', item.itemType);
      formData.append('category', item.category);
      formData.append('color', item.color);
      
      if (item.note) {
        formData.append('note', item.note);
      }

      // Handle image - if it's a local file URI, upload it
      if (item.image && item.image.startsWith('file:')) {
        formData.append('image', {
          uri: item.image,
          type: 'image/jpeg',
          name: `analyzed-${Date.now()}.jpg`,
        } as any);
      }
      
      console.log('💾 [SAVE] Sending FormData to API...');
      const response = await createClothes(token, formData);
      console.log('✅ [SAVE] Item saved successfully:', response);
      
      Toast.show({
        type: 'success',
        text1: 'Item Saved!',
        text2: `${formatCategoryDisplay(item.itemType)} added to your wardrobe`,
      });
      
      // Remove from results list to indicate it's been saved
      setAnalysisResults(prev => prev.filter(r => r.detectedItem?.id !== item.id));

    } catch (err: any) {
      console.error('❌ [SAVE] Failed to save item:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Could not save item';
      Toast.show({ 
        type: 'error', 
        text1: 'Save Failed', 
        text2: errorMessage 
      });
    }
  }, [token]);

  const clearAll = useCallback(() => {
    console.log('🧹 [CLEAR] Clearing all analysis data');
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