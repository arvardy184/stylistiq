import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/auth/authStore";
import { getAllClothes, getClothesById, createClothes, updateClothes, deleteClothes, searchClothes } from "@/services/api/clothes";
import { Clothes, ClothesFormData } from "../types";
import Toast from "react-native-toast-message";

export const useClothes = () => {
  const [clothes, setClothes] = useState<Clothes[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [searchResults, setSearchResults] = useState<Clothes[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const { token } = useAuthStore();

  const fetchClothes = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      console.log("🔄 Fetching clothes...");
      
      const response = await getAllClothes(token);
      const clothesData = response.data || [];
      
      setClothes(clothesData);
      console.log("✅ Clothes fetched successfully:", clothesData.length, "items");
    } catch (error) {
      console.error("❌ Error fetching clothes:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load clothes. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, [token]);

  const refreshClothes = useCallback(async () => {
    if (!token) return;
    
    try {
      setRefreshing(true);
      console.log("🔄 Refreshing clothes...");
      
      const response = await getAllClothes(token);
      const clothesData = response.data || [];
      
      setClothes(clothesData);
      console.log("✅ Clothes refreshed successfully");
    } catch (error) {
      console.error("❌ Error refreshing clothes:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to refresh clothes.",
      });
    } finally {
      setRefreshing(false);
    }
  }, [token]);

  const createClothesItem = useCallback(async (data: ClothesFormData) => {
    if (!token) return;
    
    try {
      console.log("🔄 Creating new clothes item...");
      
      const formData = new FormData();
      // formData.append("name", data.name);
      formData.append("category", data.category);
      formData.append("color", data.color);
      // formData.append("season", data.season);
      
      if (data.image) {
        formData.append("image", {
          uri: data.image,
          type: "image/jpeg",
          name: "clothes-image.jpg",
        } as any);
      }
      
      const response = await createClothes(token, formData);
      const newClothes = response.data;
      
      // Add to list optimistically
      setClothes(prev => [newClothes, ...prev]);
      
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Clothes item created successfully!",
      });
      
      console.log("✅ Clothes item created successfully");
    } catch (error) {
      console.error("❌ Error creating clothes item:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to create clothes item. Please try again.",
      });
    }
  }, [token]);

  const updateClothesItem = useCallback(async (id: string, data: ClothesFormData) => {
    if (!token) return;
    
    try {
      console.log("🔄 Updating clothes item:", id);
      
      const formData = new FormData();
      // formData.append("name", data.name);
      formData.append("itemType", data.itemType);
      formData.append("category", data.category);
      formData.append("color", data.color);
      // formData.append("season", data.season);
      if(data.note) formData.append("note", data.note);

      if (data.image && data.image.startsWith('file:')) {
        formData.append("image", {
          uri: data.image,
          type: "image/jpeg",
          name: `clothes-image-${Date.now()}.jpg`,
        } as any);
      }
      
      const response = await updateClothes(token, id, formData);
      const updatedClothes = response.data;
      
      // Update in list optimistically
      setClothes(prev => prev.map(item => 
        item.id === id ? updatedClothes : item
      ));
      
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Clothes item updated successfully!",
      });
      
      console.log("✅ Clothes item updated successfully");
    } catch (error) {
      console.error("❌ Error updating clothes item:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to update clothes item. Please try again.",
      });
    }
  }, [token]);

  const deleteClothesItem = useCallback(async (id: string) => {
    if (!token) return;
    
    try {
      console.log("🔄 Deleting clothes item:", id);
      
      await deleteClothes(token, [id]); // Pass as an array
      
      // Remove from list optimistically
      setClothes(prev => prev.filter(item => item.id !== id));
      
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Clothes item deleted successfully!",
      });
      
      console.log("✅ Clothes item deleted successfully");
    } catch (error) {
      console.error("❌ Error deleting clothes item:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to delete clothes item. Please try again.",
      });
    }
  }, [token]);

  const bulkDeleteClothes = useCallback(async (ids: string[]) => {
    if (!token || ids.length === 0) return;
    
    try {
      console.log("🔄 Bulk deleting clothes items:", ids);
      
      await deleteClothes(token, ids); // Use the new bulk delete service
      
      // Remove from list optimistically
      setClothes(prev => prev.filter(item => !ids.includes(item.id)));
      setSelectedItems([]);
      setSelectionMode(false);
      
      Toast.show({
        type: "success",
        text1: "Success",
        text2: `${ids.length} clothes items deleted successfully!`,
      });
      
      console.log("✅ Bulk delete completed successfully");
    } catch (error) {
      console.error("❌ Error bulk deleting clothes items:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to delete some clothes items. Please try again.",
      });
    }
  }, [token]);

  const searchClothesAPI = useCallback(async (query: string) => {
    if (!token || !query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const results = await searchClothes(token, query);
      setSearchResults(results || []);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to search clothes.",
      });
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [token]);

  const toggleSelection = useCallback((id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
    setSelectionMode(false);
  }, []);

  const selectAll = useCallback(() => {
    setSelectedItems(clothes.map(item => item.id));
  }, [clothes]);

  // Initialize data
  useEffect(() => {
    fetchClothes();
  }, [fetchClothes]);

  return {
    clothes,
    loading,
    refreshing,
    selectedItems,
    selectionMode,
    searchResults,
    isSearching,
    searchClothesAPI,
    fetchClothes,
    refreshClothes,
    createClothesItem,
    updateClothesItem,
    deleteClothesItem,
    bulkDeleteClothes,
    toggleSelection,
    clearSelection,
    selectAll,
    setSelectionMode,
  };
};

export const useClothesDetail = (clothesId: string) => {
  const [clothesDetail, setClothesDetail] = useState<Clothes | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { token } = useAuthStore();

  const fetchClothesDetail = useCallback(async () => {
    if (!token || !clothesId) return;
    
    try {
      setLoading(true);
      console.log("🔄 Fetching clothes detail:", clothesId);
      
      const response = await getClothesById(token, clothesId);
      const clothesData = response.data;
      
      setClothesDetail(clothesData);
      console.log("✅ Clothes detail fetched successfully");
    } catch (error) {
      console.error("❌ Error fetching clothes detail:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load clothes detail. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, [token, clothesId]);

  useEffect(() => {
    fetchClothesDetail();
  }, [fetchClothesDetail]);

  return {
    clothesDetail,
    loading,
    fetchClothesDetail,
  };
}; 