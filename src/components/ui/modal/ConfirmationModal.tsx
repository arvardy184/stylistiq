import { View, Text, Modal, TouchableOpacity, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  icon?: keyof typeof Feather.glyphMap;
  confirmText?: string;
  cancelText?: string;
  confirmButtonVariant?: "primary" | "destructive";
}

const ConfirmationModal = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  icon,
  confirmText = "Yes",
  cancelText = "Cancel",
  confirmButtonVariant = "primary",
}: ConfirmationModalProps) => {
  const getIconColor = () => {
    if (confirmButtonVariant === "destructive") return "#EF4444";
    return "#B2236F";
  };

  const getConfirmButtonClass = () => {
    if (confirmButtonVariant === "destructive") {
      return "bg-red-500";
    }
    return "bg-primary";
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        className="flex-1 justify-center items-center bg-black/60"
      >
        <Pressable className="w-11/12 max-w-sm bg-white rounded-2xl p-6 shadow-xl items-center">
          {icon && (
            <View className="w-16 h-16 rounded-full items-center justify-center bg-gray-100 mb-4">
              <Feather name={icon} size={32} color={getIconColor()} />
            </View>
          )}

          <Text className="text-xl font-bold text-center text-gray-800">
            {title}
          </Text>

          <Text className="text-base text-center text-gray-600 mt-2">
            {message}
          </Text>

          <View className="flex-row w-full mt-6 gap-3">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 py-3 bg-gray-200 active:bg-gray-300 rounded-lg items-center"
            >
              <Text className="text-base font-semibold text-gray-700">
                {cancelText}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              className={`flex-1 py-3 ${getConfirmButtonClass()} active:opacity-80 rounded-lg items-center`}
            >
              <Text className="text-base font-semibold text-white">
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ConfirmationModal;
