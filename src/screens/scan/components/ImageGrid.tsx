import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ImageGridProps {
  images: string[];
  onRemoveImage: (uri: string) => void;
  onAddImages: () => void;
}

const { width } = Dimensions.get('window');
const numColumns = 3;
const imageSize = (width - 32 - (numColumns - 1) * 8) / numColumns;

const ImageGrid: React.FC<ImageGridProps> = ({ images, onRemoveImage, onAddImages }) => {
  const data = [...images, 'add_button'];

  const renderItem = ({ item }: { item: string }) => {
    if (item === 'add_button') {
      return (
        <TouchableOpacity
          onPress={onAddImages}
          className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg justify-center items-center"
          style={{ width: imageSize, height: imageSize, margin: 4 }}
        >
          <Ionicons name="add" size={32} color="#9CA3AF" />
          <Text className="text-xs text-gray-500 mt-1">Add More</Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={{ width: imageSize, height: imageSize, margin: 4 }}>
        <Image
          source={{ uri: item }}
          className="w-full h-full rounded-lg"
        />
        <TouchableOpacity
          onPress={() => onRemoveImage(item)}
          className="absolute -top-1 -right-1 bg-red-500 w-6 h-6 rounded-full justify-center items-center shadow-md"
        >
          <Ionicons name="close" size={14} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => item === 'add_button' ? 'add' : `${item}-${index}`}
      numColumns={numColumns}
      contentContainerStyle={{ padding: 12 }}
    />
  );
};

export default ImageGrid; 