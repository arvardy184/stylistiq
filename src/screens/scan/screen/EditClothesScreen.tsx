import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { ClothesCategory, ClothesStatus } from '@/common/enums/clothes';
import { useAuthStore } from '@/store/auth/authStore';
import { updateClothes } from '@/services/api/clothes';
import { useNotification } from '@/hooks/useNotification';
import { RootStackParamList } from '@/types';

const EditClothesScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'EditClothes'>>();
  const { analyzedItem } = route.params;
  const { token } = useAuthStore();
  const { showSuccess, showError } = useNotification();

  // Debug logs
  console.log('🔍 [DEBUG] EditClothes - analyzedItem:', JSON.stringify(analyzedItem, null, 2));
  console.log('🔍 [DEBUG] EditClothes - analyzedItem.id:', analyzedItem?.id);

  const [formData, setFormData] = useState({
    itemType: analyzedItem?.itemType || '',
    category: analyzedItem?.category || ClothesCategory.TOP,
    color: analyzedItem?.color || '',
    status: analyzedItem?.status || ClothesStatus.BELUM_DIMILIKI,
  });
  const [saving, setSaving] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!token) return;

    // Check if analyzedItem has valid id
    if (!analyzedItem?.id) {
      showError("Invalid Item", "Cannot edit this item - missing ID. Please try scanning again.");
      return;
    }

    if (!formData.itemType.trim() || !formData.color.trim()) {
      showError("Validation Error", "Please fill in all required fields.");
      return;
    }

    try {
      setSaving(true);
      console.log('🔄 [EDIT] Updating clothes item:', analyzedItem.id);
      console.log('🔄 [EDIT] Form data:', formData);

      const updateFormData = new FormData();
      updateFormData.append('itemType', formData.itemType.trim());
      updateFormData.append('category', formData.category);
      updateFormData.append('color', formData.color.trim());
      updateFormData.append('status', formData.status);

      console.log('🔄 [EDIT] Sending FormData to API...');
      const response = await updateClothes(token, analyzedItem.id, updateFormData);
      console.log('✅ [EDIT] Clothes updated successfully:', response);

      showSuccess("Updated Successfully", "Clothes item has been updated!");
      navigation.goBack();
    } catch (error) {
      console.error('❌ [EDIT] Failed to update clothes:', error);
      showError("Update Failed", "Unable to update clothes item. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const categoryOptions = Object.values(ClothesCategory).map(value => ({
    label: value.replace('_', ' ').toUpperCase(),
    value: value
  }));

  const statusOptions = Object.values(ClothesStatus).map(value => ({
    label: value.replace('_', ' ').toUpperCase(),
    value: value
  }));

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center"
        >
          <Ionicons name="arrow-back" size={20} color="#374151" />
        </TouchableOpacity>
        
        <Text className="text-xl font-bold text-gray-900 flex-1 text-center">
          Edit Clothes
        </Text>
        
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          className={`px-4 py-2 rounded-lg ${
            saving ? 'bg-gray-300' : 'bg-blue-500'
          }`}
        >
          <Text className="text-white font-semibold text-sm">
            {saving ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6 py-4">
        {/* Item Type */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Item Type *
          </Text>
          <TextInput
            value={formData.itemType}
            onChangeText={(value) => handleInputChange('itemType', value)}
            placeholder="e.g., T-shirt, Jeans, Sneakers"
            className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Category Dropdown */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Category *
          </Text>
          <View className="bg-white border border-gray-300 rounded-lg overflow-hidden">
            <Picker
              selectedValue={formData.category}
              onValueChange={(value) => handleInputChange('category', value)}
              style={{ height: 50 }}
            >
              {categoryOptions.map((option) => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Color */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Color *
          </Text>
          <TextInput
            value={formData.color}
            onChangeText={(value) => handleInputChange('color', value)}
            placeholder="e.g., Red, Blue, Black"
            className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Status Dropdown */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Status *
          </Text>
          <View className="bg-white border border-gray-300 rounded-lg overflow-hidden">
            <Picker
              selectedValue={formData.status}
              onValueChange={(value) => handleInputChange('status', value)}
              style={{ height: 50 }}
            >
              {statusOptions.map((option) => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Preview */}
        <View className="bg-blue-50 rounded-lg p-4 mb-6">
          <Text className="text-sm font-semibold text-blue-800 mb-2">Preview:</Text>
          <Text className="text-blue-700">
            <Text className="font-semibold">{formData.itemType}</Text> • {' '}
            <Text className="capitalize">{formData.category.replace('_', ' ')}</Text> • {' '}
            <Text className="capitalize">{formData.color}</Text> • {' '}
            <Text className="capitalize">{formData.status.replace('_', ' ')}</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditClothesScreen; 