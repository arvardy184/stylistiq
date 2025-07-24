import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CollectionItem } from "../types";

interface CollectionCardProps {
  item: CollectionItem;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  isSelectionMode?: boolean;
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  item,
  onPress,
  onEdit,
  onDelete,
  isSelected = false,
  onToggleSelect,
  isSelectionMode = false,
}) => {
  const handlePress = () => {
    if (isSelectionMode && onToggleSelect) {
      onToggleSelect();
    } else {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`bg-white rounded-2xl shadow-lg shadow-black m-2 overflow-hidden ${
        isSelected ? "ring-2 ring-[#B2236F]" : ""
      }`}
      style={{ flex: 1, maxWidth: "45%" }}
    >
      <View className="aspect-square">
        <Image
          source={{
            uri:
              item.image ||
              "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop",
          }}
          className="w-full h-full"
          resizeMode="cover"
        />
        {/* Selection Indicator */}
        {isSelectionMode && (
          <View className="absolute top-2 left-2 w-6 h-6 rounded-full bg-white justify-center items-center">
            {isSelected ? (
              <Ionicons name="checkmark-circle" size={24} color="#B2236F" />
            ) : (
              <View className="w-5 h-5 rounded-full border-2 border-gray-300" />
            )}
          </View>
        )}

        <View className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-full">
          <Text className="text-white text-xs font-medium">
            {item.clothes?.length || 0} items
          </Text>
        </View>

        {!isSelectionMode && (
          <View className="absolute gap-3 bottom-2 right-2 flex-row">
            {onEdit && (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="bg-gray-300 w-8 h-8 rounded-full justify-center items-center"
              >
                <Ionicons name="pencil" size={14} color="#B2236F" />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="bg-gray-300 w-8 h-8 rounded-full justify-center items-center"
              >
                <Ionicons name="trash-outline" size={14} color="#B2236F" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      <View className="p-4">
        <Text
          className="text-gray-800 font-semibold text-base"
          numberOfLines={1}
        >
          {item.name}
        </Text>
        <Text className="text-gray-500 text-sm mt-1">
          Updated {new Date(item.updatedAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CollectionCard;
