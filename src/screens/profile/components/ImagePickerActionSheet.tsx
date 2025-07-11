import { View, Text, Modal, Pressable, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  visible: boolean;
  onClose: () => void;
  onLaunchCamera: () => void;
  onLaunchGallery: () => void;
}

const ImagePickerActionSheet = ({
  visible,
  onClose,
  onLaunchCamera,
  onLaunchGallery,
}: Props) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable onPress={onClose} className="flex-1 justify-end bg-black/60">
        <Pressable className="bg-white rounded-t-2xl">
          <SafeAreaView edges={["bottom"]} className="flex-col">
            <View className="p-4 border-b border-gray-200">
              <Text className="text-lg font-bold text-center text-gray-800">
                Change Profile Photo
              </Text>
            </View>
            <TouchableOpacity
              onPress={onLaunchCamera}
              className="flex-row items-center p-4 border-b border-gray-100"
            >
              <Feather name="camera" size={22} color="#1F2937" />
              <Text className="text-base text-gray-700 ml-4">Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onLaunchGallery}
              className="flex-row items-center p-4"
            >
              <Feather name="image" size={22} color="#1F2937" />
              <Text className="text-base text-gray-700 ml-4">
                Choose from Gallery
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onClose}
              className="flex-row items-center justify-center p-4 mt-2 bg-gray-100"
            >
              <Text className="text-base font-bold text-red-500">Cancel</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ImagePickerActionSheet;
