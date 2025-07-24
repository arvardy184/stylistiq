import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator, // Impor untuk loading indicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import {
  CollectionFormModalProps,
  CreateCollectionData,
  ImagePickerAsset,
  UpdateCollectionData,
} from "../types";
// ✨ 1. Impor fungsi kompresi gambar Anda
import { compressImage } from "@/utils/imageUtils"; // Sesuaikan path jika perlu

const CollectionFormModal: React.FC<CollectionFormModalProps> = ({
  visible,
  onClose,
  onSubmit,
  initialData,
  title,
  submitText,
}) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState<ImagePickerAsset | string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false); // State baru untuk loading kompresi

  useEffect(() => {
    if (visible) {
      if (initialData) {
        setName(initialData.name);
        setImage(initialData.image || null);
      } else {
        setName("");
        setImage(null);
      }
    }
  }, [initialData, visible]);

  const handleImagePicker = async () => {
    // ... (Fungsi handleImagePicker Anda tidak perlu diubah)
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Denied");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1, // Ambil kualitas asli, kompresi dilakukan manual
    });
    if (!result.canceled) {
      setImage(result.assets[0] as ImagePickerAsset);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Validation Error", "Please enter a collection name");
      return;
    }

    setLoading(true);
    try {
      let finalImageData: ImagePickerAsset | string | undefined;

      // Periksa apakah ada gambar baru yang dipilih (berupa objek Asset)
      if (image && typeof image === "object" && "uri" in image) {
        // ✨ 2. Lakukan kompresi sebelum upload
        setIsCompressing(true); // Tampilkan loading kompresi
        console.log("⏳ Compressing image...");
        const compressedUri = await compressImage(image.uri);
        setIsCompressing(false); // Sembunyikan loading kompresi

        // Siapkan data gambar dengan URI yang sudah dikompres
        const fileExtension = compressedUri.split(".").pop()?.toLowerCase() || 'jpeg';
        const mimeType = fileExtension === 'png' ? 'image/png' : 'image/jpeg';
        
        finalImageData = {
          uri: compressedUri,
          type: mimeType,
          fileName: image.fileName || `collection-${Date.now()}.${fileExtension}`,
        };
      } else if (typeof image === 'string') {
        // Jika gambar tidak diubah (masih berupa URL string dari server)
        finalImageData = image;
      }

      const dataToSubmit: CreateCollectionData | UpdateCollectionData = {
        name: name.trim(),
        image: finalImageData,
      };

      await onSubmit(dataToSubmit);
      onClose();
    } catch (error) {
      console.error("Submit error:", error);
      // Anda bisa tambahkan Toast atau Alert error di sini
    } finally {
      setLoading(false);
      setIsCompressing(false);
    }
  };

  const handleCancel = () => {
    if (!loading) {
      onClose();
    }
  };

  // Helper untuk mendapatkan URI yang akan ditampilkan di UI
  const getImageUri = () => {
    if (!image) return null;
    if (typeof image === "string") return image; // Untuk mode edit (URL dari server)
    return image.uri; // Untuk gambar baru dari picker
  };

  const displayUri = getImageUri();

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
          className="flex-1 justify-end"
        >
          <View
            className="bg-white rounded-t-3xl"
            style={{ maxHeight: "85%", minHeight: "50%" }}
          >
            {/* Header */}
            <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
              <TouchableOpacity onPress={handleCancel}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
              <Text className="text-lg font-bold text-gray-800">{title}</Text>
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading}
                className={`px-3 py-2 rounded-full ${
                  loading ? "bg-gray-300" : "bg-[#B2236F]"
                }`}
              >
                <Text className="text-white font-medium text-sm">
                  {submitText}
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              className="flex-1 p-4"
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Name Input */}
              <View className="mb-4">
                <Text className="text-base font-semibold text-gray-800 mb-2">
                  Collection Name
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter collection name"
                  className="border border-gray-200 rounded-xl px-4 py-3 text-base"
                  placeholderTextColor="#9CA3AF"
                  maxLength={50}
                  autoFocus={true}
                />
              </View>

              {/* Image Section */}
              <View className="mb-4">
                <Text className="text-base font-semibold text-gray-800 mb-2">
                  Collection Image (Optional)
                </Text>

                {displayUri ? (
                  <View className="relative">
                    <Image
                      source={{ uri: displayUri }}
                      className="w-full h-40 rounded-xl"
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      onPress={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 w-8 h-8 rounded-full justify-center items-center"
                    >
                      <Ionicons name="trash-outline" size={16} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleImagePicker}
                      className="absolute bottom-2 right-2 bg-[#B2236F] w-8 h-8 rounded-full justify-center items-center"
                    >
                      <Ionicons name="camera-outline" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={handleImagePicker}
                    className="border-2 border-dashed border-gray-300 rounded-xl h-40 justify-center items-center"
                  >
                    <Ionicons
                      name="camera-outline"
                      size={32}
                      color="#9CA3AF"
                    />
                    <Text className="text-gray-500 mt-2">Tap to add image</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Info Text */}
              <View className="bg-gray-50 rounded-xl p-3 mb-4">
                <Text className="text-sm text-gray-600">
                  💡 Adding an image helps you quickly identify your
                  collection. You can always change it later.
                </Text>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

export default CollectionFormModal;