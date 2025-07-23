import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useClothesAnalysis } from "../hooks/useClothesAnalysis";
import { ScanScreenProps } from "../types";

import ImagePickerPrompt from "../components/ImagePickerPrompt";
import ImageGrid from "../components/ImageGrid";
import AnalysisLoading from "../components/AnalysisLoading";
import AnalysisResultList from "../components/AnalysisResultList";
import ImageSelectionModal from "../components/ImageSelectionModal";

const ScanScreen: React.FC<ScanScreenProps> = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const {
    selectedImages,
    analysisResults,
    isLoading,
    error,
    addImages,
    removeImage,
    startAnalysis,
    saveAnalyzedItem,
    clearAll,
  } = useClothesAnalysis();

  const handleImagesSelected = (uris: string[]) => {
    console.log('Images Selected...');
    addImages(uris);
    setModalVisible(false);
  };

  const renderContent = () => {
    if (isLoading) {
      return <AnalysisLoading imageCount={selectedImages.length} />;
    }

    if (analysisResults.length > 0) {
      return (
        <AnalysisResultList
          results={analysisResults}
          onSaveItem={saveAnalyzedItem}
          onDone={clearAll}
        />
      );
    }

    if (selectedImages.length > 0) {
      return (
        <ImageGrid
          images={selectedImages}
          onAddImages={() => setModalVisible(true)}
          onRemoveImage={removeImage}
        />
      );
    }

    return <ImagePickerPrompt onAddImages={() => setModalVisible(true)} />;
  };

  const showHeader = analysisResults.length === 0 && !isLoading;
  const showAnalyzeButton =
    selectedImages.length > 0 && analysisResults.length === 0 && !isLoading;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#B2236F" barStyle="light-content" />

      {showHeader && (
        <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
          <Text className="text-2xl font-bold text-gray-900">
            Image Analysis
          </Text>
          {selectedImages.length > 0 && (
            <TouchableOpacity onPress={clearAll} className="p-2">
              <Ionicons name="trash-outline" size={24} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {error && (
        <View className="p-4 bg-red-100 m-4 rounded-lg">
          <Text className="text-red-700 font-semibold">An Error Occurred</Text>
          <Text className="text-red-600 mt-1">{error}</Text>
        </View>
      )}

      <View className="flex-1">{renderContent()}</View>

      {showAnalyzeButton && (
        <View className="absolute bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-sm border-t border-gray-200">
          <TouchableOpacity
            onPress={startAnalysis}
            className="bg-gradient-to-r from-purple-500 to-pink-500 py-4 rounded-full flex-row items-center justify-center shadow-lg"
            disabled={isLoading}
          >
            <Ionicons name="scan" size={22} color="white" />
            <Text className="text-white font-bold text-lg ml-2">
              Analyze {selectedImages.length}{" "}
              {selectedImages.length > 1 ? "Images" : "Image"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <ImageSelectionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onImageSelected={handleImagesSelected}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});

export default ScanScreen;
