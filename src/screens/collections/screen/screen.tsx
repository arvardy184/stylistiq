import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CollectionScreenProps, CreateCollectionData, UpdateCollectionData } from "../types";
import CollectionCard from "../components/CollectionCard";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import CollectionFormModal from "../components/CollectionFormModal";
import { useCollections } from "../hooks/useCollections";

const CollectionsScreen: React.FC<CollectionScreenProps> = ({ navigation }) => {
  const {
    collections,
    refreshing,
    loading,
    selectedCollections,
    isSelectionMode,
    handleCollectionPress,
    handleCreateCollection,
    handleUpdateCollection,
    handleDeleteCollection,
    handleBulkDeleteCollections,
    toggleCollectionSelection,
    enterSelectionMode,
    exitSelectionMode,
    onRefresh,
    loadCollections,
  } = useCollections();

  const [isCreateModalVisible, setIsCreateModalVisible] = React.useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = React.useState(false);
  const [editingCollection, setEditingCollection] = React.useState<any>(null);

  const renderHeader = () => (
    <View className="px-6 py-4 bg-white">
      {isSelectionMode ? (
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={exitSelectionMode}
            className="flex-row items-center"
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
            <Text className="text-lg font-semibold text-gray-800 ml-2">
              {selectedCollections.length} selected
            </Text>
          </TouchableOpacity>
          
          <View className="flex-row">
            {selectedCollections.length > 0 && (
              <TouchableOpacity
                onPress={() => handleBulkDeleteCollections(selectedCollections)}
                className="bg-red-500 px-4 py-2 rounded-full mr-2"
              >
                <Text className="text-white font-semibold">Delete</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-800">Collections</Text>
            <Text className="text-gray-600 mt-1">
              Organize your outfits by style or occasion
            </Text>
          </View>
          
          {collections.length > 0 && (
            <TouchableOpacity
              onPress={enterSelectionMode}
              className="bg-gray-100 p-2 rounded-full"
            >
              <Ionicons name="checkmark-circle-outline" size={24} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  const handleCreateCollectionPress = () => {
    setIsCreateModalVisible(true);
  };

  const handleEditCollectionPress = (collection: any) => {
    setEditingCollection(collection);
    setIsEditModalVisible(true);
  };

  const handleCreateSubmit = async (data: CreateCollectionData) => {
    await handleCreateCollection(data);
    setIsCreateModalVisible(false);
  };

  const handleEditSubmit = async (data: UpdateCollectionData) => {
    if (editingCollection) {
      await handleUpdateCollection(editingCollection.id, data);
      setIsEditModalVisible(false);
      setEditingCollection(null);
    }
  };

  const renderEmptyState = () => (
    <EmptyState onCreateCollection={handleCreateCollectionPress} />
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        {renderHeader()}
        <LoadingState message="Loading collections..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {renderHeader()}
      
      {collections.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={collections}
          renderItem={({ item }) => (
            <CollectionCard
              item={item}
              onPress={() => {
                navigation.navigate("CollectionDetail", {
                  collectionId: item.id,
                  collectionName: item.name,
                });
              }}
              onEdit={() => handleEditCollectionPress(item)}
              onDelete={() => handleDeleteCollection(item.id, item.name)}
              isSelected={selectedCollections.includes(item.id)}
              onToggleSelect={() => toggleCollectionSelection(item.id)}
              isSelectionMode={isSelectionMode}
            />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 100,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={handleCreateCollectionPress}
        className="absolute bottom-20 right-6 bg-[#B2236F] w-14 h-14 rounded-full justify-center items-center shadow-lg shadow-[#B2236F]/40"
        style={{
          elevation: 8,
        }}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      {/* Modals */}
      <CollectionFormModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSubmit={handleCreateSubmit}
        title="Create Collection"
        submitText="Create"
      />

      <CollectionFormModal
        visible={isEditModalVisible}
        onClose={() => {
          setIsEditModalVisible(false);
          setEditingCollection(null);
        }}
        onSubmit={handleEditSubmit}
        initialData={editingCollection ? {
          name: editingCollection.name,
          image: editingCollection.image,
        } : undefined}
        title="Edit Collection"
        submitText="Update"
      />
    </SafeAreaView>
  );
};

export default CollectionsScreen;
