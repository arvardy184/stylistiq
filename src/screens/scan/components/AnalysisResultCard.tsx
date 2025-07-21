import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnalysisResultCardProps, Clothes } from '../types';

const DetailRow = ({ icon, label, value }) => (
  <View className="flex-row items-center mt-2">
    <Ionicons name={icon} size={14} color="#6B7280" className="mr-2" />
    <Text className="text-sm text-gray-600 w-20">{label}</Text>
    <Text className="text-sm text-gray-800 font-semibold capitalize">{value}</Text>
  </View>
);

const AnalysisResultCard: React.FC<AnalysisResultCardProps> = ({ result, onSave }) => {
  const { success, message, originalImageUri, detectedItem } = result;

  const handleSave = () => {
    if (detectedItem) {
      onSave(detectedItem);
    }
  };

  return (
    <View className="bg-white rounded-2xl shadow-md shadow-black/5 m-4 overflow-hidden">
      <View className="flex-row">
        {/* Image */}
        <Image
          source={{ uri: originalImageUri }}
          className="w-1/3 aspect-square"
          resizeMode="cover"
        />

        {/* Details */}
        <View className="flex-1 p-4">
          {success && detectedItem ? (
            <>
              <Text className="text-lg font-bold text-gray-900" numberOfLines={1}>
                {detectedItem.name}
              </Text>
              <DetailRow icon="shirt-outline" label="Category" value={detectedItem.category} />
              <DetailRow icon="color-palette-outline" label="Color" value={detectedItem.color} />
              <DetailRow icon="sunny-outline" label="Season" value={detectedItem.season} />
            </>
          ) : (
            <View className="justify-center flex-1">
              <Ionicons name="alert-circle-outline" size={32} color="#EF4444" className="self-center mb-2" />
              <Text className="text-lg font-bold text-red-600 text-center">Analysis Failed</Text>
              <Text className="text-sm text-gray-600 text-center mt-1">{message || "Could not identify item."}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Footer / Action */}
      {success && detectedItem && (
        <View className="border-t border-gray-100 p-2 bg-gray-50">
          <TouchableOpacity
            onPress={handleSave}
            className="bg-green-100 flex-row items-center justify-center p-3 rounded-lg"
          >
            <Ionicons name="add-circle-outline" size={20} color="#16A34A" />
            <Text className="text-green-700 font-semibold ml-2">Add to Wardrobe</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default AnalysisResultCard; 