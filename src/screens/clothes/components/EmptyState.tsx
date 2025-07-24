import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No Clothes Yet",
  subtitle = "Start building your wardrobe by adding your first clothing item",
  icon = "shirt-outline",
}) => {
  return (
    <View className="flex-1 justify-center items-center px-8">
      <View className="bg-gradient-to-br from-purple-100 to-pink-100 w-32 h-32 rounded-full justify-center items-center mb-6">
        <Ionicons name={icon} size={64} color="#8B5CF6" />
      </View>

      <Text className="text-xl font-bold text-gray-900 text-center mb-2">
        {title}
      </Text>

      <Text className="text-gray-600 text-center mb-8 leading-6">
        {subtitle}
      </Text>
    </View>
  );
};

export default EmptyState;
