import React from "react";
import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ClothesCardProps } from "../types";

const { width: screenWidth } = Dimensions.get("window");
const cardWidth = (screenWidth - 48) / 2; // 48 = padding + gaps

const ClothesCard: React.FC<ClothesCardProps> = ({
  item,
  onPress,
  onEdit,
  onDelete,
  isSelected = false,
  onSelect,
  selectionMode = false,
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
      className={`bg-white rounded-2xl shadow-lg shadow-black/10 m-1 overflow-hidden ${
        isSelected ? "ring-2 ring-blue-500" : ""
      }`}
      style={{ width: cardWidth }}
    >
      <View className="aspect-square relative">
        <Image
          source={{ uri: item.image }}
          className="w-full h-full"
          resizeMode="cover"
        />
        
        {/* Selection overlay */}
        {selectionMode && (
          <View className="absolute inset-0 bg-black/20 justify-center items-center">
            <View className={`w-8 h-8 rounded-full border-2 border-white justify-center items-center ${
              isSelected ? "bg-blue-500" : "bg-transparent"
            }`}>
              {isSelected && (
                <Ionicons name="checkmark" size={18} color="white" />
              )}
            </View>
          </View>
        )}
        
        {/* Category Badge */}
        <View className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full">
          <Text className="text-white text-xs font-semibold">
            {item.category}
          </Text>
        </View>
        
        {/* Action Buttons */}
        {!selectionMode && (
          <View className="absolute top-3 right-3 flex-row gap-2">
            {onEdit && (
              <TouchableOpacity
                onPress={onEdit}
                className="bg-blue-500 w-7 h-7 rounded-full justify-center items-center"
              >
                <Ionicons name="pencil" size={12} color="white" />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity
                onPress={onDelete}
                className="bg-red-500 w-7 h-7 rounded-full justify-center items-center"
              >
                <Ionicons name="trash-outline" size={12} color="white" />
              </TouchableOpacity>
            )}
          </View>
        )}
        
        {/* Color Indicator */}
        <View className="absolute bottom-3 right-3 flex-row gap-1">
          <View 
            className="w-5 h-5 rounded-full border-2 border-white shadow-md"
            style={{ backgroundColor: item.color}} 
          />
        </View>
      </View>
      
      <View className="p-4">
        <Text className="text-gray-900 font-bold text-sm mb-2" numberOfLines={1}>
          {item.name}
        </Text>
        
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Ionicons name="color-palette-outline" size={14} color="#6B7280" />
            <Text className="text-gray-600 text-xs ml-1 capitalize">
              {item.color}
            </Text>
          </View>
          
          <View className="flex-row items-center">
            <Ionicons name="sunny-outline" size={14} color="#6B7280" />
            <Text className="text-gray-600 text-xs ml-1 capitalize">
              {item.season}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ClothesCard; 