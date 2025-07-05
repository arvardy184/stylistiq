import React from "react";
import { View, Text, ScrollView, Image, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PhotoPicker } from "../../../components/ui/photoPicker/PhotoPicker";
import Button from "@/components/ui/button";
import { useHomeScreen } from "../hook/useHomeScreen";

export const HomeScreen = () => {
  const {
    selectedImage,
    refreshing,
    loading,
    token,
    handleImageSelected,
    handleAnalyzeOutfit,
    handleLogout,
    handleLogin,
    handleImageError,
    onRefresh,
  } = useHomeScreen();

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
            onError={handleImageError}
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

        {/* Authentication Button */}
        <View className="mb-6">
          {token ? (
            <Button title="Logout" onPress={handleLogout} loading={loading} />
          ) : (
            <Button title="Login" onPress={handleLogin} loading={loading} />
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
