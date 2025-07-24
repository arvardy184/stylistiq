import React from "react";
import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ClothesCardProps } from "../types";
import { formatCategoryDisplay } from "@/utils/formatCategoryDisplay";

const { width: screenWidth } = Dimensions.get("window");
const cardWidth = (screenWidth - 32) / 2;

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
    } else if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`bg-white rounded-2xl shadow-md shadow-black m-1 overflow-hidden border border-transparent ${
        isSelected ? "border-blue-500" : ""
      }`}
      style={{ width: cardWidth }}
    >
      <View className="aspect-square relative">
        <Image
          source={{ uri: item.image }}
          className="w-full h-full"
          resizeMode="cover"
        />
        {selectionMode && (
          <View className="absolute inset-0 bg-black/30 justify-center items-center">
            <View
              className={`w-8 h-8 rounded-full border-2 border-white justify-center items-center ${
                isSelected ? "bg-blue-500" : "bg-black/20"
              }`}
            >
              {isSelected && (
                <Ionicons name="checkmark" size={20} color="white" />
              )}
            </View>
          </View>
        )}

        {!selectionMode && (
          <View className="absolute top-2 right-2 flex-row gap-2">
            {onEdit && (
              <TouchableOpacity
                onPress={onEdit}
                className="bg-gray-300 w-8 h-8 rounded-full justify-center items-center"
              >
                <Ionicons name="pencil" size={14} color="#B2236F" />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity
                onPress={onDelete}
                className="bg-gray-300 w-8 h-8 rounded-full justify-center items-center"
              >
                <Ionicons name="trash-outline" size={14} color="#B2236F" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Info Container */}
      <View className="p-3">
        <Text
          className="text-gray-800 font-bold text-base mb-2"
          numberOfLines={1}
        >
          {formatCategoryDisplay(item.itemType)}
        </Text>

        <View className="flex-row flex-wrap gap-2 items-center">
          <View className="bg-gray-100 rounded-full px-2.5 py-1">
            <Text className="text-gray-700 text-xs font-medium">
              {formatCategoryDisplay(item.category)}
            </Text>
          </View>
          <View className="flex-row items-center bg-gray-100 rounded-full px-2.5 py-1">
            <Text className="text-gray-700 text-xs font-medium capitalize">
              {item.color}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ClothesCard;
