import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Clothes } from "../types";

interface ClothesCardProps {
  item: Clothes;
  onPress: () => void;
  onDelete?: () => void;
}

const ClothesCard: React.FC<ClothesCardProps> = ({ item, onPress, onDelete }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl shadow-md shadow-black/5 m-2 overflow-hidden"
      style={{ flex: 1, maxWidth: "45%" }}
    >
      <View className="aspect-square relative">
        <Image
          source={{ uri: item.image }}
          className="w-full h-full"
          resizeMode="cover"
        />
        
        {/* Category Badge */}
        <View className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded-full">
          <Text className="text-white text-xs font-medium">
            {item.category}
          </Text>
        </View>
        
        {/* Delete Button */}
        {onDelete && (
          <TouchableOpacity
            onPress={onDelete}
            className="absolute top-2 right-2 bg-red-500 w-6 h-6 rounded-full justify-center items-center"
          >
            <Ionicons name="trash-outline" size={14} color="white" />
          </TouchableOpacity>
        )}
        
        {/* Color Indicator */}
        <View className="absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white"
              style={{ backgroundColor: item.color }} />
      </View>
      
      <View className="p-3">
        <Text className="text-gray-800 font-semibold text-sm" numberOfLines={1}>
          {item.name}
        </Text>
        <View className="flex-row items-center mt-1">
          <Ionicons name="color-palette-outline" size={12} color="#6B7280" />
          <Text className="text-gray-500 text-xs ml-1 capitalize">
            {item.color}
          </Text>
        </View>
        <View className="flex-row items-center mt-1">
          <Ionicons name="sunny-outline" size={12} color="#6B7280" />
          <Text className="text-gray-500 text-xs ml-1 capitalize">
            {item.season}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ClothesCard; 