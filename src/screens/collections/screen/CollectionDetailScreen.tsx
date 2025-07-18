import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  RefreshControl,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "@/store/auth/authStore";
import { CollectionDetailScreenProps, Clothes } from "../types";
import ClothesCard from "../components/ClothesCard";
import { getCollectionDetail, deleteCollection } from "@/services/api/collections";
import Toast from "react-native-toast-message";

const CollectionDetailScreen: React.FC<CollectionDetailScreenProps> = ({ route }) => {
  const { collectionId, collectionName } = route.params;
  const navigation = useNavigation();
  const { token } = useAuthStore();
  
  const [collection, setCollection] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load collection data
  React.useEffect(() => {
    loadCollectionData();
  }, [collectionId]);

  const loadCollectionData = async () => {
    try {
      setLoading(true);
      const data = await getCollectionDetail(token!, collectionId);
      setCollection(data);
    } catch (error) {
      console.error('Failed to load collection:', error);
      Toast.show({
        type: "error",
        text1: "Failed to load collection",
        text2: "Please try again later",
      });
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
            Toast.show({
              type: "info",
              text1: "Coming Soon",
              text2: "Add clothes functionality will be implemented soon",
            });
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
              Toast.show({
                type: "success",
                text1: "Collection Deleted",
                text2: "The collection has been successfully deleted",
              });
              navigation.goBack();
            } catch (error) {
              Toast.show({
                type: "error",
                text1: "Delete Failed",
                text2: "Failed to delete collection. Please try again.",
              });
            }
          }
        }
      ]
    );
  };

  const handleClothesPress = (clothes: Clothes) => {
    Alert.alert(
      clothes.name,
      `Category: ${clothes.category}\nColor: ${clothes.color}\nSeason: ${clothes.season}`,
      [{ text: "OK" }]
    );
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
          onPress: () => {
            // TODO: Implement remove clothes from collection
            Toast.show({
              type: "info",
              text1: "Coming Soon",
              text2: "Remove clothes functionality will be implemented soon",
            });
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
            {collectionName}
          </Text>
          <Text className="text-gray-500 text-sm text-center">
            {collection?.clothes?.length || 0} items
          </Text>
        </View>
        
        <TouchableOpacity
          onPress={handleDeleteCollection}
          className="w-10 h-10 rounded-full bg-red-50 justify-center items-center"
        >
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
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
    <SafeAreaView className="flex-1 bg-gray-50">
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
              <TouchableOpacity
                onPress={handleAddClothes}
                className="bg-[#B2236F] px-4 py-2 rounded-full"
              >
                <Text className="text-white font-medium text-sm">Add</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={collection.clothes}
              renderItem={({ item }) => (
                <ClothesCard
                  item={item}
                  onPress={() => handleClothesPress(item)}
                  onDelete={() => handleClothesDelete(item.id)}
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
      <TouchableOpacity
        onPress={handleAddClothes}
        className="absolute bottom-20 right-6 bg-[#B2236F] w-14 h-14 rounded-full justify-center items-center shadow-lg shadow-[#B2236F]/40"
        style={{
          elevation: 8,
        }}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CollectionDetailScreen; 