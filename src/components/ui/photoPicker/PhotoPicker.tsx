import React, { useState } from "react";
import { View, Text, Alert, Modal, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { pickImageFromLibrary, takePhoto } from "../../../utils/imageUtils";
import Button from "../button";
import { PhotoPickerProps } from "@/types";

const PhotoPicker = ({ onImageSelected, onError }: PhotoPickerProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePickFromLibrary = async () => {
    try {
      setLoading(true);
      setModalVisible(false);

      const result = await pickImageFromLibrary();
      if (result) {
        onImageSelected(result.uri);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to pick image";
      onError(message);
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  const handleTakePhoto = async () => {
    try {
      setLoading(true);
      setModalVisible(false);

      const result = await takePhoto();
      if (result) {
        onImageSelected(result.uri);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to take photo";
      onError(message);
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        title="Add Outfit Photo"
        onPress={() => setModalVisible(true)}
        loading={loading}
        className="mb-4"
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6">
            <Text className="text-xl font-bold text-center mb-6 text-gray-800">
              Choose Photo Source
            </Text>

            <TouchableOpacity
              onPress={handleTakePhoto}
              className="flex-row items-center p-4 mb-3 bg-gray-100 rounded-xl"
            >
              <Ionicons name="camera" size={24} color="#ec4899" />
              <Text className="ml-4 text-lg font-medium text-gray-800">
                Take Photo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handlePickFromLibrary}
              className="flex-row items-center p-4 mb-6 bg-gray-100 rounded-xl"
            >
              <Ionicons name="images" size={24} color="#ec4899" />
              <Text className="ml-4 text-lg font-medium text-gray-800">
                Choose from Gallery
              </Text>
            </TouchableOpacity>

            <Button
              title="Cancel"
              onPress={() => setModalVisible(false)}
              variant="outline"
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export { PhotoPicker };
