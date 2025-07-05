import { View, ScrollView, Image, RefreshControl } from "react-native";
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
      </ScrollView>
    </SafeAreaView>
  );
};
