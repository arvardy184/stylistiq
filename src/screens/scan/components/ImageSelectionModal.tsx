import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import { compressImage } from "@/utils/imageUtils";

interface ImageSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onImageSelected: (uris: string[]) => void;
}

const ImageSelectionModal: React.FC<ImageSelectionModalProps> = ({
  visible,
  onClose,
  onImageSelected,
}) => {
  const [isCompressing, setIsCompressing] = React.useState(false);

  const processImages = async (uris: string[]) => {
    setIsCompressing(true);
    console.log("Processing Images...");
    Toast.show({
      type: "info",
      text1: "Processing Images...",
      text2: "Please wait while we compress your images.",
    });

    try {
      const compressedUris = await Promise.all(
        uris.map((uri) => compressImage(uri))
      );
      onImageSelected(compressedUris);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Compression Failed",
        text2: "Something went wrong while processing your images.",
      });
    } finally {
      setIsCompressing(false);
      onClose();
    }
  };

  const handleCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Sorry, we need camera permissions to make this work!",
      });
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    if (!result.canceled) {
      processImages([result.assets[0].uri]);
    }
  };

  const handleGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      processImages(uris);
    }
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.container}>
          {isCompressing ? (
            <>
              <ActivityIndicator size="large" color="#8B5CF6" />
              <Text style={[styles.subtitle, { marginTop: 20 }]}>
                Compressing...
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.title}>Add Image</Text>
              <Text style={styles.subtitle}>
                Choose how to add your clothing item.
              </Text>

              <TouchableOpacity
                style={styles.optionButton}
                onPress={handleCamera}
              >
                <Ionicons name="camera-outline" size={24} color="#8B5CF6" />
                <Text style={styles.optionText}>Take a Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionButton}
                onPress={handleGallery}
              >
                <Ionicons name="images-outline" size={24} color="#EC4899" />
                <Text style={styles.optionText}>Choose from Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="border border-primary rounded-2xl w-full items-center px-6 py-4"
                onPress={onClose}
              >
                <Text className="text-black">Cancel</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 25,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    width: "100%",
    marginBottom: 12,
  },
  optionText: {
    fontSize: 18,
    color: "#333",
    marginLeft: 15,
    fontWeight: "600",
  },
  cancelButton: {
    marginTop: 10,
    padding: 10,
  },
  cancelText: {
    fontSize: 16,
    color: "#888",
  },
});

export default ImageSelectionModal;
