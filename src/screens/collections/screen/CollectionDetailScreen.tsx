import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useAuthStore } from "@/store/auth/authStore";
import { CollectionDetailScreenProps, Clothes } from "../types";
import ClothesCard from "../components/ClothesCard";
import { getCollectionDetail, deleteCollection, removeClothesFromCollection } from "@/services/api/collections";
import { updateClothesName } from "@/services/api/clothes";
import ClothesEditModal from "@/components/ui/modal/ClothesEditModal";
import { useNotification } from "@/hooks/useNotification";

const CollectionDetailScreen: React.FC<CollectionDetailScreenProps> = ({ route }) => {
  const { collectionId, collectionName } = route.params;
  const navigation = useNavigation();
  const { token } = useAuthStore();
  
  const [collection, setCollection] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedClothes, setSelectedClothes] = useState<string[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingClothes, setEditingClothes] = useState<Clothes | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  
  const { showSuccess, showError, showInfo } = useNotification();

  // Load collection data
  React.useEffect(() => {
    loadCollectionData();
  }, [collectionId]);

  // Reset selection mode when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      setSelectionMode(false);
      setSelectedClothes([]);
    }, [])
  );

  const loadCollectionData = async () => {
    try {
      setLoading(true);
      const data = await getCollectionDetail(token!, collectionId);
      setCollection(data);
    } catch (error) {
      console.error('Failed to load collection:', error);
      showError("Failed to load collection", "Please try again later");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCollectionData();
    setRefreshing(false);
  };

  const handleAddClothes = () => {
    Alert.alert(
      "Add Clothes",
      "Add new clothes to this collection",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Add", 
          onPress: () => {
            // TODO: Navigate to add clothes screen
            showInfo("Coming Soon", "Add clothes functionality will be implemented soon");
          }
        }
      ]
    );
  };

  const handleDeleteCollection = () => {
    Alert.alert(
      "Delete Collection",
      `Are you sure you want to delete "${collectionName}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCollection(token!, collectionId);
              showSuccess("Collection Deleted", "The collection has been successfully deleted");
              navigation.goBack();
            } catch (error) {
              showError("Delete Failed", "Failed to delete collection. Please try again.");
            }
          }
        }
      ]
    );
  };

  const handleClothesPress = (clothes: Clothes) => {
    const displayName = clothes.name || clothes.itemType;
    const details = [
      `Category: ${clothes.category}`,
      `Color: ${clothes.color}`,
      clothes.season && `Season: ${clothes.season}`,
      clothes.note && `Note: ${clothes.note}`
    ].filter(Boolean).join('\n');
    
    Alert.alert(
      displayName,
      details,
      [{ text: "OK" }]
    );
  };

  const handleClothesEdit = (clothes: Clothes) => {
    setEditingClothes(clothes);
    setEditModalVisible(true);
  };

  const handleSaveClothesName = async (newName: string) => {
    if (!editingClothes) return;

    try {
      setEditLoading(true);
      await updateClothesName(token!, editingClothes.id, newName);
      
      // Update the clothes name in the collection state
      setCollection((prev: any) => ({
        ...prev,
        clothes: prev.clothes.map((item: Clothes) =>
          item.id === editingClothes.id ? { ...item, name: newName } : item
        ),
      }));
      
      showSuccess("Name Updated", "Clothes name has been updated successfully");
      setEditModalVisible(false);
      setEditingClothes(null);
    } catch (error) {
      console.error('Failed to update clothes name:', error);
      showError("Update Failed", "Failed to update clothes name. Please try again.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleCloseEditModal = () => {
    if (!editLoading) {
      setEditModalVisible(false);
      setEditingClothes(null);
    }
  };

  const handleClothesDelete = (clothesId: string) => {
    Alert.alert(
      "Remove Clothes",
      "Remove this item from the collection?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: async () => {
            try {
              // Get all clothes IDs except the one to remove
              const remainingClothesIds = collection.clothes
                .filter((item: Clothes) => item.id !== clothesId)
                .map((item: Clothes) => item.id);
              
              const updatedCollection = await removeClothesFromCollection(token!, collectionId, remainingClothesIds);
              setCollection(updatedCollection);
              
              showSuccess("Clothes Removed", "The item has been removed from the collection");
            } catch (error) {
              showError("Remove Failed", "Failed to remove clothes. Please try again.");
            }
          }
        }
      ]
    );
  };

  // Selection mode functions
  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedClothes([]);
  };

  const toggleClothesSelection = (clothesId: string) => {
    if (selectedClothes.includes(clothesId)) {
      setSelectedClothes(selectedClothes.filter(id => id !== clothesId));
    } else {
      setSelectedClothes([...selectedClothes, clothesId]);
    }
  };

  const selectAllClothes = () => {
    if (selectedClothes.length === collection.clothes.length) {
      setSelectedClothes([]);
    } else {
      setSelectedClothes(collection.clothes.map((item: Clothes) => item.id));
    }
  };

  const handleBulkRemove = () => {
    if (selectedClothes.length === 0) {
      showError("No Selection", "Please select clothes to remove");
      return;
    }

    Alert.alert(
      "Remove Selected Clothes",
      `Are you sure you want to remove ${selectedClothes.length} selected clothes from this collection?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: async () => {
            try {
              // Get remaining clothes IDs (the ones NOT selected)
              const remainingClothesIds = collection.clothes
                .filter((item: Clothes) => !selectedClothes.includes(item.id))
                .map((item: Clothes) => item.id);
              
              const updatedCollection = await removeClothesFromCollection(token!, collectionId, remainingClothesIds);
              setCollection(updatedCollection);
              setSelectionMode(false);
              setSelectedClothes([]);
              
              showSuccess("Clothes Removed", `${selectedClothes.length} clothes removed from collection`);
            } catch (error) {
              showError("Remove Failed", "Failed to remove clothes. Please try again.");
            }
          }
        }
      ]
    );
  };

  const renderHeader = () => (
    <View className="bg-white px-6 py-4 border-b border-gray-100">
      <View className="flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center"
        >
          <Ionicons name="arrow-back" size={20} color="#374151" />
        </TouchableOpacity>
        
        <View className="flex-1 mx-4">
          <Text className="text-xl font-bold text-gray-800 text-center">
            {selectionMode ? `${selectedClothes.length} selected` : collectionName}
          </Text>
          <Text className="text-gray-500 text-sm text-center">
            {collection?.clothes?.length || 0} items
          </Text>
        </View>
        
        <View className="flex-row items-center gap-2">
          {selectionMode ? (
            <>
              <TouchableOpacity
                onPress={selectAllClothes}
                className="w-10 h-10 rounded-full bg-blue-50 justify-center items-center"
              >
                <Ionicons 
                  name={selectedClothes.length === collection?.clothes?.length ? "checkmark-done" : "checkmark-circle-outline"} 
                  size={20} 
                  color="#3B82F6" 
                />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleBulkRemove}
                className="w-10 h-10 rounded-full bg-red-50 justify-center items-center"
                disabled={selectedClothes.length === 0}
              >
                <Ionicons 
                  name="trash-outline" 
                  size={20} 
                  color={selectedClothes.length === 0 ? "#9CA3AF" : "#EF4444"} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={toggleSelectionMode}
                className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center"
              >
                <Ionicons name="close" size={20} color="#374151" />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={toggleSelectionMode}
                className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center"
              >
                <Ionicons name="checkmark-circle-outline" size={20} color="#374151" />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleDeleteCollection}
                className="w-10 h-10 rounded-full bg-red-50 justify-center items-center"
              >
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );

  const renderCollectionInfo = () => (
    <View className="bg-white mx-4 mt-4 rounded-2xl p-4 shadow-sm shadow-black/5">
      <View className="flex-row items-center mb-3">
        <View className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl justify-center items-center mr-4">
          <Ionicons name="albums" size={24} color="white" />
        </View>
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800">
            {collectionName}
          </Text>
          <Text className="text-gray-500 text-sm">
            Created {new Date(collection?.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
      
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Ionicons name="shirt-outline" size={16} color="#6B7280" />
          <Text className="text-gray-600 ml-2">
            {collection?.clothes?.length || 0} clothes
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={16} color="#6B7280" />
          <Text className="text-gray-600 ml-2">
            Updated {new Date(collection?.updatedAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center px-6 py-12">
      <View className="bg-gray-100 rounded-full p-6 mb-4">
        <Ionicons name="shirt-outline" size={48} color="#9CA3AF" />
      </View>
      <Text className="text-xl font-semibold text-gray-800 mb-2">
        No Clothes Yet
      </Text>
      <Text className="text-gray-600 text-center mb-6">
        Start building your collection by adding some clothes
      </Text>
      <TouchableOpacity
        onPress={handleAddClothes}
        className="bg-[#B2236F] px-6 py-3 rounded-full"
      >
        <Text className="text-white font-semibold">Add Clothes</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        {renderHeader()}
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500">Loading collection...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'left', 'right']}>
      {renderHeader()}
      
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderCollectionInfo()}
        
        {(!collection?.clothes || collection.clothes.length === 0) ? (
          renderEmptyState()
        ) : (
          <View className="mt-4">
            <View className="flex-row items-center justify-between px-6 mb-4">
              <Text className="text-lg font-semibold text-gray-800">
                Clothes ({collection.clothes.length})
              </Text>
              {!selectionMode && (
                <TouchableOpacity
                  onPress={handleAddClothes}
                  className="bg-[#B2236F] px-4 py-2 rounded-full"
                >
                  <Text className="text-white font-medium text-sm">Add</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <FlatList
              data={collection.clothes}
              renderItem={({ item }) => (
                <ClothesCard
                  item={item}
                  onPress={() => handleClothesPress(item)}
                  onEdit={() => handleClothesEdit(item)}
                  onDelete={() => handleClothesDelete(item.id)}
                  selectionMode={selectionMode}
                  isSelected={selectedClothes.includes(item.id)}
                  onSelect={() => toggleClothesSelection(item.id)}
                />
              )}
              keyExtractor={(item) => item.id}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingBottom: 100,
              }}
            />
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      {!selectionMode && (
        <TouchableOpacity
          onPress={handleAddClothes}
          className="absolute bottom-20 right-6 bg-[#B2236F] w-14 h-14 rounded-full justify-center items-center shadow-lg shadow-[#B2236F]/40"
          style={{
            elevation: 8,
          }}
        >
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      )}

      {/* Clothes Edit Modal */}
      <ClothesEditModal
        visible={editModalVisible}
        onClose={handleCloseEditModal}
        onSave={handleSaveClothesName}
        clothesName={editingClothes?.name || editingClothes?.itemType || ""}
        loading={editLoading}
      />
    </SafeAreaView>
  );
};

export default CollectionDetailScreen; 