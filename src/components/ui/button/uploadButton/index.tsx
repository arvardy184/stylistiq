import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CustomUploadButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableOpacity
      className="w-16 h-16 rounded-full bg-primary justify-center items-center shadow-lg active:opacity-70"
      onPress={onPress}
    >
      <Ionicons name="scan" size={24} color="white" />
    </TouchableOpacity>
  );
};

export default CustomUploadButton;
