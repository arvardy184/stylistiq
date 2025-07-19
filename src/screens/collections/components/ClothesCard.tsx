import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Clothes } from "../types";

interface ClothesCardProps {
  item: Clothes;
  onPress: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  selectionMode?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

const ClothesCard: React.FC<ClothesCardProps> = ({ 
  item, 
  onPress, 
  onDelete,
  onEdit, 
  selectionMode = false, 
  isSelected = false, 
  onSelect 
}) => {
  const handlePress = () => {
    if (selectionMode && onSelect) {
      onSelect();
    } else {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`bg-white rounded-xl shadow-md shadow-black/5 m-2 overflow-hidden ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      style={{ flex: 1, maxWidth: "45%" }}
    >
      <View className="aspect-square relative">
        <Image
          source={{ uri: item.image }}
          className="w-full h-full"
          resizeMode="cover"
        />
        
        {/* Selection Overlay */}
        {selectionMode && (
          <View className="absolute inset-0 bg-black/20 justify-center items-center">
            <View className={`w-8 h-8 rounded-full border-2 border-white justify-center items-center ${
              isSelected ? 'bg-blue-500' : 'bg-transparent'
            }`}>
              {isSelected && (
                <Ionicons name="checkmark" size={20} color="white" />
              )}
            </View>
          </View>
        )}
        
        {/* Category Badge */}
        <View className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded-full">
          <Text className="text-white text-xs font-medium">
            {item.category}
          </Text>
        </View>
        
        {/* Action Buttons - only show when not in selection mode */}
        {!selectionMode && (onEdit || onDelete) && (
          <View className="absolute top-2 right-2 flex-row">
            {onEdit && (
              <TouchableOpacity
                onPress={onEdit}
                className="bg-blue-500 w-6 h-6 rounded-full justify-center items-center mr-1"
              >
                <Ionicons name="create-outline" size={14} color="white" />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity
                onPress={onDelete}
                className="bg-red-500 w-6 h-6 rounded-full justify-center items-center"
              >
                <Ionicons name="trash-outline" size={14} color="white" />
              </TouchableOpacity>
            )}
          </View>
        )}
        
        {/* Color Indicator */}
        <View className="absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white"
              style={{ backgroundColor: item.color }} />
      </View>
      
      <View className="p-3">
        <Text className="text-gray-800 font-semibold text-sm" numberOfLines={1}>
          {item.name || item.itemType}
        </Text>
        <View className="flex-row items-center mt-1">
          <Ionicons name="color-palette-outline" size={12} color="#6B7280" />
          <Text className="text-gray-500 text-xs ml-1 capitalize">
            {item.color}
          </Text>
        </View>
        {item.season && (
          <View className="flex-row items-center mt-1">
            <Ionicons name="sunny-outline" size={12} color="#6B7280" />
            <Text className="text-gray-500 text-xs ml-1 capitalize">
              {item.season}
            </Text>
          </View>
        )}
        {item.note && (
          <View className="flex-row items-center mt-1">
            <Ionicons name="document-text-outline" size={12} color="#6B7280" />
            <Text className="text-gray-500 text-xs ml-1" numberOfLines={1}>
              {item.note}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ClothesCard; 