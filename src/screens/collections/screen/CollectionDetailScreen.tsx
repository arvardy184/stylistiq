import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
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
import {
  getCollectionDetail,
  deleteCollection,
  removeClothesFromCollection,
  addClothesToCollection,
} from "@/services/api/collections";
import { updateClothesName } from "@/services/api/clothes";
import ClothesEditModal from "@/components/ui/modal/ClothesEditModal";
import ConfirmationModal from "@/components/ui/modal/ConfirmationModal";
import AddClothesToCollectionModal from "../components/AddClothesToCollectionModal";
import { useNotification } from "@/hooks/useNotification";

const CollectionDetailScreen: React.FC<CollectionDetailScreenProps> = ({
  route,
}) => {
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
  const [addClothesModalVisible, setAddClothesModalVisible] = useState(false);
  const [isAddingClothes, setIsAddingClothes] = useState(false);

  // Confirmation modal states
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [confirmContext, setConfirmContext] = useState<
    "deleteCollection" | "removeClothes" | "bulkRemove" | "none"
  >("none");
  const [itemToProcess, setItemToProcess] = useState<any>(null);

  const { showSuccess, showError, showInfo } = useNotification();

  // Load collection data
  React.useEffect(() => {
    loadCollectionData();
  }, [collectionId]);

  // Auto-refresh when screen gains focus
  useFocusEffect(
    React.useCallback(() => {
      loadCollectionData();
      setSelectionMode(false);
      setSelectedClothes([]);
    }, [])
  );

  const loadCollectionData = async () => {
    try {
      setLoading(true);
      const data = await getCollectionDetail(token!, collectionId);
      console.log("Collection detail:", data);
      setCollection(data);
    } catch (error) {
      console.error("Failed to load collection:", error);
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
    setAddClothesModalVisible(true);
  };

  const handleConfirmAddClothes = async (selectedIds: string[]) => {
    setIsAddingClothes(true);
    try {
      const updatedCollection = await addClothesToCollection(
        token!,
        collectionId,
        selectedIds
      );
      setCollection(updatedCollection);
      showSuccess(
        "Clothes Added",
        `${selectedIds.length} item(s) have been added to the collection.`
      );
      setAddClothesModalVisible(false);
    } catch (error) {
      showError("Failed to add clothes", "Please try again later.");
    } finally {
      setIsAddingClothes(false);
    }
  };

  // Delete collection with confirmation modal
  const handleDeleteCollection = () => {
    setConfirmContext("deleteCollection");
    setIsConfirmModalVisible(true);
  };

  const handleClothesPress = (clothes: Clothes) => {
    const displayName = clothes.name || clothes.itemType;
    const details = [
      `Category: ${clothes.category}`,
      `Color: ${clothes.color}`,
      clothes.note && `Note: ${clothes.note}`,
    ]
      .filter(Boolean)
      .join("\n");

    showInfo(displayName, details);
  };

  const handleClothesEdit = (clothes: Clothes) => {
    setEditingClothes(clothes);
    setEditModalVisible(true);
  };

  const handleEditClothes = async (clothesId: string, newName: string) => {
    try {
      setEditLoading(true);
      await updateClothesName(token!, clothesId, newName);

      // Update local state
      setCollection((prev: any) => ({
        ...prev,
        clothes: prev.clothes.map((item: Clothes) =>
          item.id === clothesId ? { ...item, name: newName } : item
        ),
      }));

      showSuccess("Clothes Updated", "The item name has been updated");
      setEditModalVisible(false);
      setEditingClothes(null);
    } catch (error) {
      showError(
        "Update Failed",
        "Failed to update clothes name. Please try again."
      );
    } finally {
      setEditLoading(false);
    }
  };

  // Remove single clothes with confirmation modal
  const handleClothesDelete = (clothesId: string) => {
    setConfirmContext("removeClothes");
    setItemToProcess(clothesId);
    setIsConfirmModalVisible(true);
  };

  // Selection mode functions
  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedClothes([]);
  };

  const toggleClothesSelection = (clothesId: string) => {
    if (selectedClothes.includes(clothesId)) {
      setSelectedClothes(selectedClothes.filter((id) => id !== clothesId));
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

  // Bulk remove with confirmation modal
  const handleBulkRemove = () => {
    if (selectedClothes.length === 0) {
      showError("No Selection", "Please select clothes to remove");
      return;
    }
    setConfirmContext("bulkRemove");
    setIsConfirmModalVisible(true);
  };

  // Handle confirmation modal actions
  const handleConfirmAction = async () => {
    try {
      if (confirmContext === "deleteCollection") {
        await deleteCollection(token!, collectionId);
        showSuccess(
          "Collection Deleted",
          "The collection has been successfully deleted"
        );
        navigation.navigate("Collections" as never);
      } else if (confirmContext === "removeClothes" && itemToProcess) {
        // Get all clothes IDs except the one to remove
        const remainingClothesIds = collection.clothes
          .filter((item: Clothes) => item.id !== itemToProcess)
          .map((item: Clothes) => item.id);

        const updatedCollection = await removeClothesFromCollection(
          token!,
          collectionId,
          remainingClothesIds
        );
        setCollection(updatedCollection);
        showSuccess(
          "Clothes Removed",
          "The item has been removed from the collection"
        );
      } else if (confirmContext === "bulkRemove") {
        // Get remaining clothes IDs (the ones NOT selected)
        const remainingClothesIds = collection.clothes
          .filter((item: Clothes) => !selectedClothes.includes(item.id))
          .map((item: Clothes) => item.id);

        const updatedCollection = await removeClothesFromCollection(
          token!,
          collectionId,
          remainingClothesIds
        );
        setCollection(updatedCollection);
        setSelectionMode(false);
        setSelectedClothes([]);
        showSuccess(
          "Clothes Removed",
          `${selectedClothes.length} clothes removed from collection`
        );
      }
    } catch (error) {
      if (confirmContext === "deleteCollection") {
        showError(
          "Delete Failed",
          "Failed to delete collection. Please try again."
        );
      } else {
        showError(
          "Remove Failed",
          "Failed to remove clothes. Please try again."
        );
      }
    } finally {
      closeConfirmModal();
    }
  };

  const closeConfirmModal = () => {
    setIsConfirmModalVisible(false);
    setConfirmContext("none");
    setItemToProcess(null);
  };

  const getConfirmModalMessage = () => {
    switch (confirmContext) {
      case "deleteCollection":
        return `Are you sure you want to delete "${collectionName}"? This action cannot be undone.`;
      case "removeClothes":
        return "Remove this item from the collection?";
      case "bulkRemove":
        return `Are you sure you want to remove ${selectedClothes.length} selected clothes from this collection?`;
      default:
        return "";
    }
  };

  const getConfirmModalTitle = () => {
    switch (confirmContext) {
      case "deleteCollection":
        return "Delete Collection";
      case "removeClothes":
        return "Remove Clothes";
      case "bulkRemove":
        return "Remove Selected Clothes";
      default:
        return "Confirm Action";
    }
  };

  const renderHeader = () => (
    <View className="flex-row items-center justify-between p-4 bg-white border-b border-gray-200">
      <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
        <Ionicons name="arrow-back" size={24} />
      </TouchableOpacity>
      <Text className="text-lg font-bold" numberOfLines={1}>
        {collectionName}
      </Text>
      <View className="flex-row">
        <TouchableOpacity onPress={handleAddClothes} className="p-2 mr-2">
          <Ionicons name="add" size={24} color="#3B82F6" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDeleteCollection} className="p-2">
          <Ionicons name="trash-outline" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderListHeader = () => (
    <View className="py-4">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-semibold">
          Items ({collection?.clothes?.length || 0})
        </Text>
        {collection?.clothes?.length > 0 && (
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={selectAllClothes}
              className="px-3 py-1 bg-blue-100 rounded-lg"
            >
              <Text className="text-blue-600 font-medium">
                {selectedClothes.length === collection.clothes.length
                  ? "Deselect All"
                  : "Select All"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleSelectionMode}
              className="px-3 py-1 bg-gray-100 rounded-lg"
            >
              <Text className="text-gray-600 font-medium">
                {selectionMode ? "Cancel" : "Select"}
              </Text>
            </TouchableOpacity>
            {selectionMode && selectedClothes.length > 0 && (
              <TouchableOpacity
                onPress={handleBulkRemove}
                className="px-3 py-1 bg-red-100 rounded-lg"
              >
                <Text className="text-red-600 font-medium">Remove</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center py-20">
      <Ionicons name="shirt-outline" size={64} color="#9CA3AF" />
      <Text className="text-xl font-semibold text-gray-900 mt-4">
        No clothes in this collection
      </Text>
      <Text className="text-gray-600 text-center mt-2 px-8">
        Add some clothes to start building your collection
      </Text>
      <TouchableOpacity
        onPress={handleAddClothes}
        className="mt-6 bg-blue-500 px-6 py-3 rounded-lg"
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
    <SafeAreaView
      className="flex-1 bg-gray-50"
      edges={["top", "left", "right"]}
    >
      {renderHeader()}

      <FlatList
        data={collection?.clothes || []}
        renderItem={({ item }) => {
          console.log("Item:", item);
          return (
            <ClothesCard
              item={item}
              onPress={() => handleClothesPress(item)}
              onEdit={() => handleClothesEdit(item)}
              onDelete={() => handleClothesDelete(item.id)}
              selectionMode={selectionMode}
              isSelected={selectedClothes.includes(item.id)}
              onSelect={() => toggleClothesSelection(item.id)}
            />
          );
        }}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 100,
        }}
      />

      {/* Add Clothes Modal */}
      <AddClothesToCollectionModal
        visible={addClothesModalVisible}
        onClose={() => setAddClothesModalVisible(false)}
        onAdd={handleConfirmAddClothes}
        existingClothesIds={
          collection?.clothes?.map((item: Clothes) => item.id) || []
        }
        isLoading={isAddingClothes}
      />

      {/* Edit Clothes Modal */}
      <ClothesEditModal
        visible={editModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setEditingClothes(null);
        }}
        onSave={(newName: string) =>
          handleEditClothes(editingClothes?.id || "", newName)
        }
        clothesName={editingClothes?.name || editingClothes?.itemType || ""}
        loading={editLoading}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        visible={isConfirmModalVisible}
        onClose={closeConfirmModal}
        onConfirm={handleConfirmAction}
        title={getConfirmModalTitle()}
        message={getConfirmModalMessage()}
        icon="trash-2"
        confirmText={
          confirmContext === "deleteCollection" ? "Delete" : "Remove"
        }
        confirmButtonVariant="destructive"
      />
    </SafeAreaView>
  );
};

export default CollectionDetailScreen;
