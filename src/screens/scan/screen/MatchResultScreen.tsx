import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Modal,
  TextInput,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { matchClothes } from "@/services/api/clothes";
import {
  createCollection,
  addClothesToCollection,
} from "@/services/api/collections";
import { useAuthStore } from "@/store/auth/authStore";
import { Clothes } from "@/screens/collections/types";
import { useNotification } from "@/hooks/useNotification";
import { RootStackParamList } from "@/types";
import { formatCategoryDisplay } from "@/utils/formatCategoryDisplay";

// Define the primary color for reuse
const PRIMARY_COLOR = "#B2236F";

const MatchResultScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, "MatchResult">>();
  const { analyzedItem } = route.params;
  const { token } = useAuthStore();
  const { showError, showSuccess } = useNotification();

  const [matchedClothes, setMatchedClothes] = useState<Clothes[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [creatingCollection, setCreatingCollection] = useState(false);

  useEffect(() => {
    fetchMatchedClothes();
  }, []);

  const fetchMatchedClothes = async () => {
    if (!token) return;

    try {
      setLoading(true);
      if (!analyzedItem?.id) {
        const response = await matchClothes(token, []);
        setMatchedClothes(response.data || []);
        return;
      }
      const clothesIds = [analyzedItem.id];
      const response = await matchClothes(token, clothesIds);
      setMatchedClothes(response.data || []);
    } catch (error) {
      console.error("❌ [MATCH] Failed to fetch matched clothes:", error);
      showError(
        "Match Failed",
        "Unable to find matching clothes. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedItems([]);
  };

  const handleCreateCollection = async () => {
    if (!token || !collectionName.trim()) {
      showError("Invalid Input", "Please enter a collection name.");
      return;
    }

    try {
      setCreatingCollection(true);
      const validClothesIds = selectedItems.filter((id) =>
        matchedClothes.some((clothes) => clothes.id === id)
      );

      if (analyzedItem?.id) {
        validClothesIds.push(analyzedItem.id);
      }

      await createCollection(
        token,
        collectionName.trim(),
        undefined,
        validClothesIds.length > 0 ? validClothesIds : undefined
      );

      const itemCount = validClothesIds.length;
      const message =
        itemCount > 0
          ? `"${collectionName}" has been created with ${itemCount} items!`
          : `"${collectionName}" has been created!`;

      showSuccess("Collection Created", message);
      setShowCreateModal(false);
      setCollectionName("");
      setSelectedItems([]);
      setSelectionMode(false);

      navigation.navigate("Main", {
        screen: "Collections",
        params: { refresh: true },
      } as never);
    } catch (error) {
      console.error("❌ [COLLECTION] Failed to create:", error);
      showError(
        "Creation Failed",
        "Unable to create collection. Please try again."
      );
    } finally {
      setCreatingCollection(false);
    }
  };

  const renderMatchedItem = ({ item }: { item: Clothes }) => {
    const isSelected = selectedItems.includes(item.id);

    return (
      <TouchableOpacity
        onPress={() => (selectionMode ? toggleSelection(item.id) : null)}
        className={`bg-white rounded-xl shadow-sm m-2 p-3 border-2 ${
          isSelected ? "border-pink-600" : "border-transparent"
        }`}
        style={{ width: "45%" }}
      >
        <View className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden relative">
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="flex-1 justify-center items-center">
              <Ionicons name="shirt-outline" size={32} color="#9CA3AF" />
            </View>
          )}

          {selectionMode && (
            <View className="absolute top-2 right-2">
              <View
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  isSelected
                    ? "bg-pink-600 border-pink-700"
                    : "bg-white border-gray-300"
                }`}
              >
                {isSelected && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
            </View>
          )}
        </View>

        <Text className="text-sm font-semibold text-gray-800" numberOfLines={1}>
          {item.itemType}
        </Text>
        <Text className="text-xs text-gray-500 capitalize mt-1">
          {formatCategoryDisplay(item.category)} • {item.color}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderAnalyzedItem = () => (
    <View className="bg-white rounded-2xl p-4 mx-4 mb-6 shadow-md border border-gray-200">
      <Text className="text-pink-700 font-bold mb-3 text-base">
        Your Analyzed Item
      </Text>
      <View className="flex-row items-center">
        <Image
          source={{ uri: analyzedItem.image }}
          className="w-20 h-20 rounded-lg"
          resizeMode="cover"
        />
        <View className="flex-1 ml-4">
          <Text className="text-gray-800 font-bold text-lg">
            {analyzedItem.itemType}
          </Text>
          <Text className="text-gray-500 capitalize">
            {formatCategoryDisplay(analyzedItem.category)} •{" "}
            {analyzedItem.color}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderActionButtons = () => (
    <View className="px-5 mb-4">
      <View className="flex-row justify-between">
        <TouchableOpacity
          onPress={toggleSelectionMode}
          className={`flex-1 py-3 rounded-xl mr-2 ${
            selectionMode ? "bg-gray-200" : "bg-gray-800"
          } items-center`}
        >
          <Text
            className={`font-semibold ${
              selectionMode ? "text-gray-800" : "text-white"
            }`}
          >
            {selectionMode ? "Cancel" : "Select Items"}
          </Text>
        </TouchableOpacity>

        {selectionMode && (
          <TouchableOpacity
            onPress={() => setShowCreateModal(true)}
            className="flex-1 py-3 bg-pink-600 rounded-xl ml-2 items-center"
          >
            <Text className="text-white font-semibold">
              Create Collection{" "}
              {selectedItems.length > 0 ? `(${selectedItems.length})` : ""}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderCreateCollectionModal = () => (
    <Modal
      visible={showCreateModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowCreateModal(false)}
    >
      <View className="flex-1 bg-black/60 justify-center items-center p-4">
        <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-xl font-bold text-gray-800">
              New Collection
            </Text>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Ionicons name="close-circle" size={26} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <Text className="text-gray-500 mb-5">
            Name your collection
            {selectedItems.length > 0
              ? ` with ${selectedItems.length + 1} item(s).`
              : "."}
          </Text>

          <TextInput
            value={collectionName}
            onChangeText={setCollectionName}
            placeholder="e.g. Summer Vibes, Work Outfits"
            placeholderTextColor="#9CA3AF"
            className="bg-gray-100 border border-gray-300 rounded-lg p-3 mb-6 text-gray-800"
            autoFocus
          />

          <View className="flex-row">
            <TouchableOpacity
              onPress={() => setShowCreateModal(false)}
              className="flex-1 py-3 bg-gray-200 rounded-xl mr-2 items-center"
            >
              <Text className="text-gray-800 font-semibold">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCreateCollection}
              disabled={!collectionName.trim() || creatingCollection}
              className={`flex-1 py-3 rounded-xl ml-2 items-center ${
                !collectionName.trim() || creatingCollection
                  ? "bg-pink-200"
                  : "bg-pink-600"
              }`}
            >
              {creatingCollection ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white font-semibold">Create</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderHeader = () => (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white">
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center"
      >
        <Ionicons name="arrow-back" size={22} color="#4B5563" />
      </TouchableOpacity>
      <Text className="text-lg font-bold text-gray-800">Style Matches</Text>
      <View className="w-10" />
    </View>
  );

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center px-6 -mt-20">
      <View className="bg-pink-100 rounded-full p-5 mb-5">
        <Ionicons name="search-outline" size={48} color={PRIMARY_COLOR} />
      </View>
      <Text className="text-xl font-semibold text-gray-800 mb-2 text-center">
        No Matches Found
      </Text>
      <Text className="text-gray-500 text-center mb-6">
        We couldn't find any clothes that match your item. Try adding more
        variety to your digital wardrobe!
      </Text>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Main", { screen: "Wardrobe" } as never)
        }
        className="bg-pink-600 px-6 py-3 rounded-full flex-row items-center"
      >
        <Ionicons
          name="add"
          size={20}
          color="white"
          style={{ marginRight: 8 }}
        />
        <Text className="text-white font-semibold">Add to Wardrobe</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView
      className="flex-1 bg-gray-50"
      edges={["top", "left", "right"]}
    >
      {renderHeader()}

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={PRIMARY_COLOR} />
          <Text className="text-gray-500 mt-4 text-base">
            Finding your style synergy...
          </Text>
        </View>
      ) : (
        <FlatList
          data={matchedClothes}
          renderItem={renderMatchedItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          ListHeaderComponent={
            <View className="pt-6">
              {renderAnalyzedItem()}
              {matchedClothes.length > 0 && (
                <>
                  {renderActionButtons()}
                  <Text className="text-lg font-semibold text-gray-800 px-5 my-2">
                    Matching Items ({matchedClothes.length})
                  </Text>
                </>
              )}
            </View>
          }
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={{
            paddingHorizontal: 8,
            paddingBottom: 100,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {renderCreateCollectionModal()}
    </SafeAreaView>
  );
};

export default MatchResultScreen;
