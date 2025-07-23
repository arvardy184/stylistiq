import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const EmptyState = () => {
  return (
    <View className="flex-1 justify-center items-center px-6 py-12">
      <View className="bg-gray-100 rounded-full p-6 mb-4">
        <Ionicons name="albums-outline" size={48} color="#9CA3AF" />
      </View>
      <Text className="text-xl font-semibold text-gray-800 mb-2">
        No Collections Yet
      </Text>
      <Text className="text-gray-600 text-center mb-6">
        Start organizing your outfits by creating your first collection
      </Text>
    </View>
  );
};

export default EmptyState;
