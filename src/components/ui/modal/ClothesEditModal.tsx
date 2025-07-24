import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ClothesEditModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (newName: string) => void;
  clothesName: string;
  loading?: boolean;
}

const ClothesEditModal: React.FC<ClothesEditModalProps> = ({
  visible,
  onClose,
  onSave,
  clothesName,
  loading = false,
}) => {
  const [name, setName] = useState(clothesName);

  useEffect(() => {
    if (visible) {
      setName(clothesName);
    }
  }, [visible, clothesName]);

  const handleSave = () => {
    const trimmedName = name.trim();
    if (trimmedName && trimmedName !== clothesName) {
      onSave(trimmedName);
    } else {
      onClose();
    }
  };

  const handleCancel = () => {
    if (!loading) {
      setName(clothesName);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-black/50">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-center px-6"
        >
          <View className="bg-white rounded-2xl shadow-2xl">
            {/* Header */}
            <View className="border-b border-gray-100 p-6 pb-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-xl font-bold text-gray-800">
                  Edit Clothes Name
                </Text>
                <TouchableOpacity
                  onPress={handleCancel}
                  disabled={loading}
                  className="w-8 h-8 rounded-full bg-gray-100 justify-center items-center"
                >
                  <Ionicons name="close" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Content */}
            <View className="p-6">
              <Text className="text-base font-semibold text-gray-800 mb-3">
                Clothes Name
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter clothes name"
                className="border border-gray-200 rounded-xl px-4 py-3 text-base bg-gray-50"
                placeholderTextColor="#9CA3AF"
                maxLength={50}
                autoFocus={true}
                editable={!loading}
                selectTextOnFocus={true}
              />
              
              <Text className="text-gray-500 text-sm mt-2">
                Give your clothes a memorable name
              </Text>
            </View>

            {/* Actions */}
            <View className="border-t border-gray-100 p-6 pt-4">
              <View className="flex-row space-x-3">
                <TouchableOpacity
                  onPress={handleCancel}
                  disabled={loading}
                  className="flex-1 bg-gray-100 py-3 rounded-xl justify-center items-center"
                >
                  <Text className="text-gray-700 font-semibold text-base">
                    Cancel
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={handleSave}
                  disabled={loading || !name.trim() || name.trim() === clothesName}
                  className={`flex-1 py-3 rounded-xl justify-center items-center flex-row ${
                    loading || !name.trim() || name.trim() === clothesName
                      ? "bg-gray-300"
                      : "bg-[#B2236F]"
                  }`}
                >
                  {loading && (
                    <View className="mr-2">
                      <Ionicons name="refresh" size={16} color="white" />
                    </View>
                  )}
                  <Text
                    className={`font-semibold text-base ${
                      loading || !name.trim() || name.trim() === clothesName
                        ? "text-gray-500"
                        : "text-white"
                    }`}
                  >
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

export default ClothesEditModal; 