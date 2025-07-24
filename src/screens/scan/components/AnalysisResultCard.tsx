import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useNotification } from '@/hooks/useNotification';
import { AnalysisResultCardProps, Clothes } from '../types';
import { formatCategoryDisplay } from '@/utils/formatCategoryDisplay';

const DetailRow = ({ icon, label, value, isStatus = false }) => (
  <View className={`mt-2 ${isStatus ? 'flex-col' : 'flex-row items-center'}`}>
    <View className="flex-row items-center">
      <Ionicons name={icon} size={14} color="#6B7280" className="mr-2" />
      <Text className="text-sm text-gray-600 w-20">{label}</Text>
    </View>
    <Text 
      className={`text-sm text-gray-800 font-semibold ${isStatus ? 'mt-1 ml-6 flex-1' : 'capitalize'}`}
      numberOfLines={isStatus ? 2 : 1}
    >
      {value || 'N/A'}
    </Text>
  </View>
);

const AnalysisResultCard: React.FC<AnalysisResultCardProps> = ({ result, onSave }) => {
  const { success, message, originalImageUri, detectedItem } = result;
  const navigation = useNavigation();
  const { showError } = useNotification();

  const handleSave = () => {
    if (detectedItem) {
      onSave(detectedItem);
    }
  };

  const handleMatch = () => {
    if (detectedItem) {
      // Check if item has a valid ID (not temporary)
      if (!detectedItem.id || detectedItem.id.startsWith('temp-')) {
        showError("Cannot Match", "This item needs to be saved to your wardrobe first before finding matches.");
        return;
      }
      navigation.navigate('MatchResult', { analyzedItem: detectedItem });
    }
  };

  const handleEdit = () => {
    if (detectedItem) {
      console.log('🔍 [EDIT] Detected item:', detectedItem);
      // Check if item has a valid ID (not temporary)
      if (!detectedItem.id || detectedItem.id.startsWith('temp-')) {
        showError("Cannot Edit", "This item needs to be saved to your wardrobe first before editing.");
        return;
      }
      navigation.navigate('EditClothes', { analyzedItem: detectedItem });
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
                {formatCategoryDisplay(detectedItem.itemType)}
              </Text>
              <DetailRow icon="shirt-outline" label="Category" value={formatCategoryDisplay(detectedItem.category)} />
              <DetailRow icon="color-palette-outline" label="Color" value={detectedItem.color} />
              {/* {detectedItem.season && (
                <DetailRow icon="sunny-outline" label="Season" value={detectedItem.season} />
              )} */}
              <DetailRow 
                icon="checkmark-circle-outline" 
                label="Status" 
                value={detectedItem.status || 'Belum Dimiliki'} 
                isStatus 
              />
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
        <View className="border-t border-gray-100 p-3 bg-gray-50">
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={handleMatch}
              className="flex-1 bg-purple-100 flex-row items-center justify-center p-2.5 rounded-lg"
            >
              <Ionicons name="search-outline" size={18} color="#8B5CF6" />
              <Text className="text-purple-700 font-semibold ml-1 text-sm">Find Matches</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleEdit}
              className="flex-1 bg-blue-100 flex-row items-center justify-center p-2.5 rounded-lg"
            >
              <Ionicons name="create-outline" size={18} color="#3B82F6" />
              <Text className="text-blue-700 font-semibold ml-1 text-sm">Edit</Text>
            </TouchableOpacity>
            
            {/* <TouchableOpacity
              onPress={handleSave}
              className="flex-1 bg-green-100 flex-row items-center justify-center p-2.5 rounded-lg"
            >
              <Ionicons name="add-circle-outline" size={18} color="#16A34A" />
              <Text className="text-green-700 font-semibold ml-1 text-sm">Add</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      )}
    </View>
  );
};

export default AnalysisResultCard; 