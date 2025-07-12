import { View, Text, Modal, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ProfileCompletionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onCompleteProfile: () => void;
}

export const ProfileCompletionModal = ({
  isVisible,
  onClose,
  onCompleteProfile,
}): ProfileCompletionModalProps => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/60">
        <View className="w-4/5 max-w-sm bg-white rounded-2xl p-8 items-center shadow-xl">
          <View className="bg-[#083D57]/10 p-4 rounded-full mb-5">
            <Ionicons name="document-text-outline" size={48} color="#083D57" />
          </View>
          <Text className="text-xl font-bold text-center text-gray-800 mb-2">
            One More Step!
          </Text>
          <Text className="text-base text-center text-gray-600 mb-8">
            Please complete your profile to get a better and more accurate
            experience.
          </Text>
          <Pressable
            className="w-full bg-primary py-3 rounded-full shadow"
            onPress={onCompleteProfile}
          >
            <Text className="text-white text-center font-bold text-base">
              Complete Profile
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};
