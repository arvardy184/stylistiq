import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useClothes } from "../hooks/useClothes";
import { Clothes, ClothesScreenProps, ClothesFormData } from "../types";
import ClothesGrid from "../components/ClothesGrid";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import ClothesFormModal from '../components/ClothesFormModal'; // Import the modal

const ClothesScreen: React.FC<ClothesScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingClothes, setEditingClothes] = useState<Clothes | null>(null);

  const {
    clothes,
    loading,
    refreshing,
    selectedItems,
    selectionMode,
    refreshClothes,
    deleteClothesItem,
    bulkDeleteClothes,
    toggleSelection,
    clearSelection,
    selectAll,
    setSelectionMode,
    createClothesItem, // Get mutation functions
    updateClothesItem,
  } = useClothes();

  // Filter clothes based on search query
  const filteredClothes = clothes.filter(
    (item) =>
      (item.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.color || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.season || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle clothes press
  const handleClothesPress = (item: Clothes) => {
    navigation.navigate("ClothesDetail", {
      clothesId: item.id,
      clothesName: item.name,
    });
  };

  // Handle edit clothes
  const handleEditClothes = (item: Clothes) => {
    setEditingClothes(item);
    setShowFormModal(true);
  };

  // Handle delete clothes
  const handleDeleteClothes = (item: Clothes) => {
    Alert.alert(
      "Delete Clothes",
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteClothesItem(item.id),
        },
      ]
    );
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    Alert.alert(
      "Delete Selected",
      `Are you sure you want to delete ${selectedItems.length} selected clothes?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => bulkDeleteClothes(selectedItems),
        },
      ]
    );
  };

  // Handle create new clothes
  const handleCreateClothes = () => {
    setEditingClothes(null);
    setShowFormModal(true);
  };

  // Handle form submission
  const handleFormSubmit = (data: ClothesFormData) => {
    if (editingClothes) {
      updateClothesItem(editingClothes.id, data);
    } else {
      createClothesItem(data);
    }
    setShowFormModal(false);
    setEditingClothes(null);
  };

  // Reset focus
  useFocusEffect(
    useCallback(() => {
      setSearchQuery("");
      clearSelection();
    }, [clearSelection])
  );

  // Header component
  const renderHeader = () => {
    if (selectionMode) {
      return (
        <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={clearSelection}
              className="mr-4"
            >
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-gray-900">
              {selectedItems.length} selected
            </Text>
          </View>
          
          <View className="flex-row items-center gap-4">
            <TouchableOpacity
              onPress={selectAll}
              className="px-3 py-1 bg-blue-100 rounded-lg"
            >
              <Text className="text-blue-600 font-medium">Select All</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleBulkDelete}
              className="p-2 bg-red-100 rounded-lg"
            >
              <Ionicons name="trash-outline" size={20} color="#DC2626" />
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View className="px-6 py-4 bg-white border-b border-gray-100">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-2xl font-bold text-gray-900">My Wardrobe</Text>
            <Text className="text-gray-600 mt-1">
              {filteredClothes.length} {filteredClothes.length === 1 ? "item" : "items"}
            </Text>
          </View>
          
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => setSelectionMode(true)}
              className="p-2 bg-gray-100 rounded-lg"
            >
              <Ionicons name="checkmark-circle-outline" size={24} color="#6B7280" />
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleCreateClothes}
              className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"
            >
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Search Bar */}
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
            onChangeText={setSearchQuery}
            className="bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-900"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      {renderHeader()}
      
      {loading ? (
        <LoadingState />
      ) : filteredClothes.length === 0 ? (
        <EmptyState
          title={searchQuery ? "No clothes found" : "No clothes yet"}
          subtitle={
            searchQuery
              ? "Try adjusting your search terms"
              : "Start building your wardrobe by adding your first clothing item"
          }
          actionText={searchQuery ? "Clear Search" : "Add New Clothes"}
          onAction={searchQuery ? () => setSearchQuery("") : handleCreateClothes}
          icon={searchQuery ? "search" : "shirt-outline"}
        />
      ) : (
        <ClothesGrid
          clothes={filteredClothes}
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
    </SafeAreaView>
  );
};

export default ClothesScreen;
