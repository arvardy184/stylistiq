import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnalysisResultListProps } from '../types';
import AnalysisResultCard from './AnalysisResultCard';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '@/types';

const AnalysisResultList: React.FC<AnalysisResultListProps> = ({ results, onDone, onSaveItem }) => {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  
  const successfulItems = results.filter(r => r.success && r.detectedItem).length;
  const failedItems = results.length - successfulItems;

  const handleGoToWardrobe = () => {
    // Navigate to the Wardrobe/Clothes tab
    navigation.navigate('Clothes');
    // Call onDone to reset the scan screen state
    onDone();
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-6 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">Analysis Complete</Text>
        <Text className="text-base text-gray-600 mt-1">
          Here are the results of your scan. You can now add the identified items to your wardrobe.
        </Text>
        <View className="flex-row mt-4 gap-4">
            <View className="flex-1 bg-green-100 p-3 rounded-lg items-center">
                <Text className="text-green-800 font-bold text-lg">{successfulItems}</Text>
                <Text className="text-green-700">Successful</Text>
            </View>
            <View className="flex-1 bg-red-100 p-3 rounded-lg items-center">
                <Text className="text-red-800 font-bold text-lg">{failedItems}</Text>
                <Text className="text-red-700">Failed</Text>
            </View>
        </View>
      </View>
      
      <FlatList
        data={results}
        renderItem={({ item }) => (
          <AnalysisResultCard result={item} onSave={onSaveItem} />
        )}
        keyExtractor={(item) => item.id || item.originalImageUri}
        contentContainerStyle={{ paddingBottom: 120 }}
      />
      
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <TouchableOpacity
          onPress={handleGoToWardrobe}
          className="bg-gradient-to-r from-purple-500 to-pink-500 py-4 rounded-full flex-row items-center justify-center shadow-lg"
        >
          <Ionicons name="checkmark-done" size={22} color="white" />
          <Text className="text-white font-bold text-lg ml-2">Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AnalysisResultList; 