import React from "react";
import { View, FlatList, RefreshControl } from "react-native";
import { ClothesGridProps } from "../types";
import ClothesCard from "./ClothesCard";

const ClothesGrid: React.FC<ClothesGridProps & { 
  refreshing?: boolean;
  onRefresh?: () => void;
}> = ({
  clothes,
  onClothesPress,
  onClothesEdit,
  onClothesDelete,
  selectionMode = false,
  selectedItems = [],
  onItemSelect,
  refreshing = false,
  onRefresh,
}) => {
  const renderClothesItem = ({ item }) => (
    <ClothesCard
      item={item}
      onPress={() => onClothesPress(item)}
      onEdit={onClothesEdit ? () => onClothesEdit(item) : undefined}
      onDelete={onClothesDelete ? () => onClothesDelete(item) : undefined}
      selectionMode={selectionMode}
      isSelected={selectedItems.includes(item.id)}
      onSelect={onItemSelect ? () => onItemSelect(item.id) : undefined}
    />
  );

  return (
    <View className="flex-1 px-4">
      <FlatList
        data={clothes}
        renderItem={renderClothesItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#8B5CF6"
              colors={["#8B5CF6"]}
            />
          ) : undefined
        }
      />
    </View>
  );
};

export default ClothesGrid; 