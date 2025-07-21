import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ImagePickerPromptProps {
  onAddImages: () => void;
}

const ImagePickerPrompt: React.FC<ImagePickerPromptProps> = ({ onAddImages }) => {
  return (
    <View className="flex-1 justify-center items-center p-8 bg-gray-50 rounded-3xl m-4">
      <View className="border-2 border-dashed border-gray-300 rounded-2xl w-full items-center justify-center p-10">
        <View className="bg-gradient-to-br from-purple-100 to-pink-100 w-24 h-24 rounded-full justify-center items-center mb-6">
          <Ionicons name="images-outline" size={48} color="#8B5CF6" />
        </View>
        <Text className="text-xl font-bold text-gray-800 text-center mb-2">
          Scan Your Clothes
        </Text>
        <Text className="text-gray-600 text-center mb-8">
          Use your camera or select images from your gallery to get started.
        </Text>
        <TouchableOpacity
          onPress={onAddImages}
          className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-full shadow-lg shadow-purple-500/25"
        >
          <Text className="text-white font-semibold text-base">Select Images</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ImagePickerPrompt; 