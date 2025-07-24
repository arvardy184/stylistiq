import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  CollectionScreenProps,
  CreateCollectionData,
  UpdateCollectionData,
} from "../types";
import CollectionCard from "../components/CollectionCard";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import CollectionFormModal from "../components/CollectionFormModal";
import ConfirmationModal from "@/components/ui/modal/ConfirmationModal";
import { useCollections } from "../hooks/useCollections";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const CollectionsScreen: React.FC<CollectionScreenProps> = ({ navigation }) => {
  const {
    collections,
    refreshing,
    loading,
    selectedCollections,
    isSelectionMode,
    handleCreateCollection,
    handleUpdateCollection,
    deleteCollection,
    bulkDeleteCollections,
    toggleCollectionSelection,
    enterSelectionMode,
    exitSelectionMode,
    onRefresh,
    loadCollections,
  } = useCollections();

  const [isCreateModalVisible, setIsCreateModalVisible] = React.useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = React.useState(false);
  const [editingCollection, setEditingCollection] = React.useState<any>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = React.useState(false);
  const [deleteContext, setDeleteContext] = React.useState<"single" | "bulk">(
    "single"
  );
  const [collectionToDelete, setCollectionToDelete] = React.useState<{
    id: string;
    name: string;
  } | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      loadCollections();
    }, [])
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      ...(isSelectionMode
        ? {
            title: `${selectedCollections.length} selected`,
            headerLeft: () => (
              <TouchableOpacity onPress={exitSelectionMode} className="ml-4">
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={handleBulkDeletePress}
                disabled={selectedCollections.length === 0}
                className="p-2 bg-red-100 rounded-lg mr-4"
              >
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color={
                    selectedCollections.length === 0 ? "#9CA3AF" : "#DC2626"
                  }
                />
              </TouchableOpacity>
            ),
          }
        : {
            title: "Collections",
            headerLeft: undefined,
            headerRight: () => (
              <View className="flex-row gap-2 mr-4">
                <TouchableOpacity
                  onPress={enterSelectionMode}
                  className="p-2 bg-gray-100 rounded-lg"
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={24}
                    color="#6B7280"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setIsCreateModalVisible(true)}
                  className="p-2 bg-gray-100 rounded-lg"
                >
                  <Ionicons name="add" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
            ),
          }),
    });
  }, [
    navigation,
    isSelectionMode,
    selectedCollections.length,
    enterSelectionMode,
    exitSelectionMode,
    setIsCreateModalVisible,
  ]);

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

  const handleDeleteCollectionPress = (id: string, name: string) => {
    setCollectionToDelete({ id, name });
    setDeleteContext("single");
    setIsDeleteModalVisible(true);
  };

  const handleBulkDeletePress = () => {
    if (selectedCollections.length === 0) return;
    setDeleteContext("bulk");
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    let success = false;
    if (deleteContext === "single" && collectionToDelete) {
      success = await deleteCollection(collectionToDelete.id);
    } else if (deleteContext === "bulk") {
      success = await bulkDeleteCollections(selectedCollections);
    }
    setIsDeleteModalVisible(false);
    setCollectionToDelete(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalVisible(false);
    setCollectionToDelete(null);
  };

  const getDeleteModalMessage = () => {
    if (deleteContext === "single" && collectionToDelete) {
      return `Are you sure you want to delete "${collectionToDelete.name}"? This action cannot be undone.`;
    }
    if (deleteContext === "bulk") {
      return `Are you sure you want to delete ${selectedCollections.length} collection(s)? This action cannot be undone.`;
    }
    return "";
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <LoadingState message="Loading collections..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar backgroundColor="#B2236F" barStyle="light-content" />

      {collections.length === 0 ? (
        <EmptyState />
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
              onDelete={() => handleDeleteCollectionPress(item.id, item.name)}
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

      {/* Create Modal */}
      <CollectionFormModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSubmit={handleCreateSubmit}
        title="Create Collection"
        submitText="Create"
      />

      {/* Edit Modal */}
      <CollectionFormModal
        visible={isEditModalVisible}
        onClose={() => {
          setIsEditModalVisible(false);
          setEditingCollection(null);
        }}
        onSubmit={handleEditSubmit}
        initialData={editingCollection}
        title="Edit Collection"
        submitText="Update"
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        visible={isDeleteModalVisible}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Collection"
        message={getDeleteModalMessage()}
        icon="trash-2"
        confirmText="Delete"
        confirmButtonVariant="destructive"
      />
    </SafeAreaView>
  );
};

export default CollectionsScreen;
