import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { PhotoPicker } from "../../../components/ui/photoPicker/PhotoPicker";
import { Button } from "../../../components/ui/button";

export const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageSelected = (uri: string) => {
    setSelectedImage(uri);
  };

  const handleAnalyzeOutfit = async () => {
    if (!selectedImage) {
      Alert.alert("Error", "Please select an image first");
      return;
    }

    try {
      setLoading(true);

      // Simulate analysis delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Navigate to analysis result
      navigation.navigate("PhotoAnalysis", { imageUri: selectedImage });

      // Clear selected image
      setSelectedImage(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Analysis failed";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="py-6">
          <Text className="text-3xl font-bold text-gray-800 mb-2">
            Welcome to Stylistiq! 👗
          </Text>
          <Text className="text-base text-gray-500">
            Upload your outfit photo and get instant style analysis
          </Text>
        </View>

        {/* Photo Selection */}
        <View className="mb-6">
          <PhotoPicker
            onImageSelected={handleImageSelected}
            onError={(error) => Alert.alert("Error", error)}
          />

          {selectedImage && (
            <View className="mt-4">
              <Image
                source={{ uri: selectedImage }}
                className="w-full h-80 rounded-xl"
                resizeMode="cover"
              />
              <View className="mt-4">
                <Button
                  title="Analyze This Outfit"
                  onPress={handleAnalyzeOutfit}
                  loading={loading}
                />
              </View>
            </View>
          )}
        </View>

        {/* Quick Tips */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Style Tips 💡
          </Text>
          <View className="p-4 bg-pink-100 rounded-xl mb-3">
            <Text className="text-pink-700 font-medium">
              Take photos in good lighting for better analysis
            </Text>
          </View>
          <View className="p-4 bg-pink-100 rounded-xl mb-3">
            <Text className="text-pink-700 font-medium">
              Full-body shots give the most accurate results
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
