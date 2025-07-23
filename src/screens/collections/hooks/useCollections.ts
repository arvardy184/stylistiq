import { useState, useEffect } from "react";
import { CollectionItem, CreateCollectionData, UpdateCollectionData } from "../types";
import { getCollections, createCollection, updateCollection, deleteCollections } from "@/services/api/collections";
import { useAuthStore } from "@/store/auth/authStore";
import Toast from "react-native-toast-message";

export const useCollections = () => {
  const { token } = useAuthStore();
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // Load collections on mount
  useEffect(() => {
    if (token) {
      loadCollections();
    }
  }, [token]);

  const loadCollections = async () => {
    try {
      setLoading(true);
      const data = await getCollections(token!);
      setCollections(data);
    } catch (error) {
      console.error('Failed to load collections:', error);
      Toast.show({
        type: "error",
        text1: "Failed to load collections",
        text2: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCollectionPress = (collection: CollectionItem) => {
    // Navigate to collection detail screen
    // This will be handled by the parent component
    console.log('Collection pressed:', collection.name);
  };

  const handleCreateCollection = async (data: CreateCollectionData) => {
    try {
      const newCollection = await createCollection(token!, data.name, data.image);
     setCollections(prev => [newCollection, ...prev]);
      Toast.show({
        type: "success",
        text1: "Collection Created",
        text2: `"${data.name}" has been created successfully`,
      });
    } catch (error) {
      console.error('Failed to create collection:', error);
      Toast.show({
        type: "error",
        text1: "Create Failed",
        text2: "Failed to create collection. Please try again.",
      });
      throw error;
    }
  };

  const handleUpdateCollection = async (id: string, data: UpdateCollectionData) => {
    try {
      const updatedCollection = await updateCollection(token!, id, data.name, data.image);
      setCollections(prev => prev.map(item => 
        item.id === id ? updatedCollection : item
      ));
      console.log('🔄 [UPDATE] Collection updated:', updatedCollection);
      Toast.show({
        type: "success",
        text1: "Collection Updated",
        text2: "Collection has been updated successfully",
      });
    } catch (error) {
      console.error('Failed to update collection:', error);
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: "Failed to update collection. Please try again.",
      });
      throw error;
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCollections();
    setRefreshing(false);
  };

  // Delete single collection - returns callback for confirmation
  const deleteCollection = async (id: string) => {
    try {
      await deleteCollections(token!, [id]);
      setCollections(prev => prev.filter(item => item.id !== id));
      Toast.show({
        type: "success",
        text1: "Collection Deleted",
        text2: "Collection has been deleted successfully",
      });
      return true;
    } catch (error) {
      console.error('Failed to delete collection:', error);
      Toast.show({
        type: "error",
        text1: "Delete Failed",
        text2: "Failed to delete collection. Please try again.",
      });
      return false;
    }
  };

  // Bulk delete collections - returns callback for confirmation
  const bulkDeleteCollections = async (collectionIds: string[]) => {
    try {
      await deleteCollections(token!, collectionIds);
      setCollections(prev => prev.filter(item => !collectionIds.includes(item.id)));
      setSelectedCollections([]);
      setIsSelectionMode(false);
      Toast.show({
        type: "success",
        text1: "Collections Deleted",
        text2: `${collectionIds.length} collection(s) deleted successfully`,
      });
      return true;
    } catch (error) {
      console.error('Failed to delete collections:', error);
      Toast.show({
        type: "error",
        text1: "Delete Failed",
        text2: "Failed to delete collections. Please try again.",
      });
      return false;
    }
  };

  const toggleCollectionSelection = (id: string) => {
    setSelectedCollections(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const enterSelectionMode = () => {
    setIsSelectionMode(true);
    setSelectedCollections([]);
  };

  const exitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedCollections([]);
  };

  return {
    collections,
    refreshing,
    loading,
    selectedCollections,
    isSelectionMode,
    handleCollectionPress,
    handleCreateCollection,
    handleUpdateCollection,
    deleteCollection,
    bulkDeleteCollections,
    toggleCollectionSelection,
    enterSelectionMode,
    exitSelectionMode,
    onRefresh,
    loadCollections,
  };
}; 