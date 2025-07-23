import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useClothesDetail } from "../hooks/useClothes";
import { Clothes, ClothesDetailScreenProps, ClothesFormData } from "../types";
import LoadingState from "../components/LoadingState";
import ConfirmationModal from "@/components/ui/modal/ConfirmationModal";
import ClothesFormModal from "../components/ClothesFormModal";

const { width: screenWidth } = Dimensions.get("window");

const ClothesDetailScreen: React.FC<ClothesDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { clothesId, clothesName } = route.params;
  const { clothesDetail, loading, deleteClothesItem, bulkDeleteClothes,createClothesItem,updateClothesItem } = useClothesDetail(clothesId);   
  const [editingClothes, setEditingClothes] = useState<Clothes | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteContext, setDeleteContext] = useState<
    "single" | "bulk" | "none"
  >("none");
  const [itemToDelete, setItemToDelete] = useState<Clothes | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);  
  const closeDeleteModal = () => {
    setIsModalVisible(false);
    setDeleteContext("none");
    setItemToDelete(null);
  };
  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleEdit = () => {
    setEditingClothes(clothesDetail); 
    setShowFormModal(true);
    console.log("tes edit");
   
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

  const handleConfirmDelete = async () => {
    if (deleteContext === "single" && itemToDelete) {
     await deleteClothesItem(itemToDelete.id);
      navigation.navigate("Wardrobe");
    } else if (deleteContext === "bulk") {
      await bulkDeleteClothes(selectedItems);
    }
    closeDeleteModal();
  };
  const getModalMessage = () => {
    if (deleteContext === "single" && itemToDelete) {
      return `This action cannot be undone. Are you sure you want to delete "${itemToDelete.name}"?`;
    }
    if (deleteContext === "bulk") {
      return `This action cannot be undone. You are about to delete ${selectedItems.length} items.`;
    }
    return "";
  };

  const handleDelete = () => {
    setIsModalVisible(true);
    setDeleteContext("single");
    setItemToDelete(clothesDetail);
    console.log("tes delete");
  };


  const DetailItem = ({ icon, label, value, color = "#6B7280" }) => (
    <View className="flex-row items-center py-3 border-b border-gray-100">
      <View className="w-10 h-10 bg-gray-100 rounded-lg justify-center items-center mr-4">
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View className="flex-1">
        <Text className="text-gray-600 text-sm">{label}</Text>
        <Text className="text-gray-900 font-medium text-base">{value}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <LoadingState type="simple" />
      </SafeAreaView>
    );
  }

  if (!clothesDetail) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <View className="flex-1 justify-center items-center px-8">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="text-xl font-bold text-gray-900 text-center mt-4">
            Clothes Not Found
          </Text>
          <Text className="text-gray-600 text-center mt-2">
            The clothes item you're looking for doesn't exist or has been deleted.
          </Text>
          <TouchableOpacity
            onPress={handleGoBack}
            className="mt-8 bg-blue-500 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-medium">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (

    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
  

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Image Section */}
        <View className="relative bg-gray-50">
          <Image
            source={{ uri: clothesDetail.image }}
            style={{ width: screenWidth, height: screenWidth }}
            resizeMode="cover"
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
          />
          
          {imageLoading && (
            <View className="absolute inset-0 justify-center items-center bg-gray-100">
              <LoadingState type="simple" />
            </View>
          )}
          
          {/* Category Badge */}
          <View className="absolute top-6 left-6 bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-full">
            <Text className="text-white font-semibold">
              {clothesDetail.category}
            </Text>
          </View>
          
          {/* Color Indicator */}
          <View className="absolute top-6 right-6 flex-row items-center bg-white/90 px-3 py-2 rounded-full">
            <View
              className="w-4 h-4 rounded-full mr-2"
              style={{ backgroundColor: clothesDetail.color }}
            />
            <Text className="text-gray-900 font-medium capitalize">
              {clothesDetail.color}
            </Text>
          </View>
        </View>

        {/* Details Section */}
        <View className="px-6 py-6">
          <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-900 mb-2">
              {clothesDetail.name}
            </Text>
            <Text className="text-gray-600">
              Added {new Date(clothesDetail.createdAt).toLocaleDateString()}
            </Text>
          </View>

          <View className="bg-gray-50 rounded-2xl p-4 mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Item Details
            </Text>
            
            <DetailItem
              icon="shirt-outline"
              label="Category"
              value={clothesDetail.category}
              color="#8B5CF6"
            />
            
            <DetailItem
              icon="color-palette-outline"
              label="Color"
              value={clothesDetail.color}
              color="#EC4899"
            />
            
            {/* <DetailItem
              icon="sunny-outline"
              label="Season"
              value={clothesDetail.season}
              color="#F59E0B"
            /> */}
            
            <DetailItem
              icon="calendar-outline"
              label="Date Added"
              value={new Date(clothesDetail.createdAt).toLocaleDateString()}
              color="#10B981"
            />
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-4 mb-8">
            <TouchableOpacity
              onPress={handleEdit}
              className="flex-1 bg-blue-500 py-4 rounded-xl flex-row items-center justify-center"
            >
              <Ionicons name="pencil" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">Edit</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleDelete}
              className="flex-1 bg-red-500 py-4 rounded-xl flex-row items-center justify-center"
            >
              <Ionicons name="trash-outline" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <ClothesFormModal
  visible={showFormModal}
  onClose={() => {
    setShowFormModal(false);
    setEditingClothes(null);
  }}
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

export default ClothesDetailScreen; 