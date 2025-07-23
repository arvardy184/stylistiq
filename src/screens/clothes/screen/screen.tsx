import React, { useState, useCallback, useLayoutEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useClothes } from "../hooks/useClothes";
import { Clothes, ClothesScreenProps, ClothesFormData } from "../types";
import ClothesGrid from "../components/ClothesGrid";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import ClothesFormModal from "../components/ClothesFormModal";
import ConfirmationModal from "@/components/ui/modal/ConfirmationModal";

const ClothesScreen: React.FC<ClothesScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingClothes, setEditingClothes] = useState<Clothes | null>(null);
  const searchRef = useRef<NodeJS.Timeout | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteContext, setDeleteContext] = useState<
    "single" | "bulk" | "none"
  >("none");
  const [itemToDelete, setItemToDelete] = useState<Clothes | null>(null);

  const {
    clothes,
    loading,
    refreshing,
    selectedItems,
    selectionMode,
    searchResults,
    isSearching,
    searchClothesAPI,
    refreshClothes,
    deleteClothesItem,
    bulkDeleteClothes,
    toggleSelection,
    clearSelection,
    selectAll,
    setSelectionMode,
    createClothesItem,
    updateClothesItem,
  } = useClothes();

  const displayClothes = searchQuery.trim() ? searchResults : clothes;

  // --- HANDLER FUNCTIONS ---

  const handleCreateClothes = () => {
    setEditingClothes(null);
    setShowFormModal(true);
  };

  const closeDeleteModal = () => {
    setIsModalVisible(false);
    setDeleteContext("none");
    setItemToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (deleteContext === "single" && itemToDelete) {
      deleteClothesItem(itemToDelete.id);
    } else if (deleteContext === "bulk") {
      bulkDeleteClothes(selectedItems);
    }
    closeDeleteModal();
  };

  // 3. Update delete handlers to open the modal
  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    setDeleteContext("bulk");
    setIsModalVisible(true);
  };

  const handleDeleteClothes = (item: Clothes) => {
    setDeleteContext("single");
    setItemToDelete(item);
    setIsModalVisible(true);
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    if (searchRef.current) clearTimeout(searchRef.current);
    if (text.trim() === "") {
      searchClothesAPI("");
      return;
    }
    searchRef.current = setTimeout(() => {
      searchClothesAPI(text);
    }, 400);
  };

  const handleClothesPress = (item: Clothes) => {
    navigation.navigate("ClothesDetail", {
      clothesId: item.id,
      clothesName: item.name,
    });
  };

  const handleEditClothes = (item: Clothes) => {
    setEditingClothes(item);
    setShowFormModal(true);
  };

  const handleFormSubmit = (data: ClothesFormData) => {
    console.log('Form Submitted...');
    if (editingClothes) {
      updateClothesItem(editingClothes.id, data);
    } else {
      createClothesItem(data);
    }
    setShowFormModal(false);
    setEditingClothes(null);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      ...(selectionMode
        ? {
            headerRight: () => (
              <View className="flex-row items-center gap-4 mr-4">
                <TouchableOpacity
                  onPress={selectAll}
                  className="px-3 py-1 bg-blue-100 rounded-lg"
                >
                  <Text className="text-blue-600 font-medium">Select All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleBulkDelete}
                  disabled={selectedItems.length === 0}
                  className="p-2 bg-red-100 rounded-lg"
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={selectedItems.length === 0 ? "#9CA3AF" : "#DC2626"}
                  />
                </TouchableOpacity>
              </View>
            ),
            headerLeft: () => (
              <TouchableOpacity onPress={clearSelection} className="ml-4">
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            ),
            title: `${selectedItems.length} selected`,
          }
        : {
            headerRight: () => (
              <View className="flex-row gap-2 mr-4">
                <TouchableOpacity
                  onPress={() => setSelectionMode(true)}
                  className="p-2 bg-gray-100 rounded-lg"
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={24}
                    color="#6B7280"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleCreateClothes}
                  className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"
                >
                  <Ionicons name="add" size={24} color="white" />
                </TouchableOpacity>
              </View>
            ),
            headerLeft: undefined,
            title: "Wardrobe",
          }),
    });
  }, [
    navigation,
    selectionMode,
    selectedItems.length,
    selectAll,
    handleBulkDelete,
    clearSelection,
    handleCreateClothes,
  ]);

  useFocusEffect(
    useCallback(() => {
      setSearchQuery("");
      clearSelection();
    }, [clearSelection])
  );

  const getModalMessage = () => {
    if (deleteContext === "single" && itemToDelete) {
      return `This action cannot be undone. Are you sure you want to delete "${itemToDelete.name}"?`;
    }
    if (deleteContext === "bulk") {
      return `This action cannot be undone. You are about to delete ${selectedItems.length} items.`;
    }
    return "";
  };

  return (
    <SafeAreaView
      className="flex-1 bg-gray-50"
      edges={["left", "right", "bottom"]}
    >
      <StatusBar backgroundColor="#B2236F" barStyle="light-content" />

      {!selectionMode && (
        <View className="px-6 py-4 bg-white border-b border-gray-200">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-gray-600">
              {displayClothes.length}
              {displayClothes.length === 1 ? " item" : " items"}
            </Text>
          </View>
          <View className="relative">
            <Ionicons
              name="search"
              size={20}
              color="#9CA3AF"
              style={{ position: "absolute", left: 12, top: 12, zIndex: 1 }}
            />
            <TextInput
              placeholder="Search clothes..."
              value={searchQuery}
              onChangeText={handleSearchChange}
              className="bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-900"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>
      )}

      {loading || isSearching ? (
        <LoadingState />
      ) : displayClothes.length === 0 ? (
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshClothes}
            />
          }
        >
          <EmptyState
            title={searchQuery ? "No clothes found" : "No clothes yet"}
            subtitle={
              searchQuery
                ? "Try adjusting your search terms"
                : "Start building your wardrobe by adding your first clothing item"
            }
            actionText={searchQuery ? "Clear Search" : "Add New Clothes"}
            onAction={
              searchQuery ? () => handleSearchChange("") : handleCreateClothes
            }
            icon={searchQuery ? "search" : "shirt-outline"}
          />
        </ScrollView>
      ) : (
        <ClothesGrid
          clothes={displayClothes}
          onClothesPress={handleClothesPress}
          onClothesEdit={handleEditClothes}
          onClothesDelete={handleDeleteClothes}
          selectionMode={selectionMode}
          selectedItems={selectedItems}
          onItemSelect={toggleSelection}
          refreshing={refreshing}
          onRefresh={refreshClothes}
        />
      )}

      <ClothesFormModal
        visible={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleFormSubmit}
        initialData={editingClothes}
        title={editingClothes ? "Edit Clothes" : "Add New Clothes"}
        submitText={editingClothes ? "Update" : "Create"}
      />

      <ConfirmationModal
        visible={isModalVisible}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Are you sure?"
        message={getModalMessage()}
        icon="trash-2"
        confirmText="Delete"
        confirmButtonVariant="destructive"
      />
    </SafeAreaView>
  );
};

export default ClothesScreen;
