import { useState } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "@/store/auth/authStore";

export const useHomeScreen = () => {
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token, clearToken } = useAuthStore();

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
      await new Promise((resolve) => setTimeout(resolve, 2000));
      navigation.navigate("PhotoAnalysis", { imageUri: selectedImage });
      setSelectedImage(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Analysis failed";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearToken();
    Alert.alert("Success", "Logged out successfully");
  };

  const handleLogin = () => {
    navigation.navigate("Auth");
  };

  const handleImageError = (error: string) => {
    Alert.alert("Error", error);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return {
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
  };
};
