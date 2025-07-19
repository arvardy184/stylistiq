import { Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";

const ProfileActionRow = ({
  icon,
  label,
  onPress,
  color = "text-gray-800",
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
  color?: string;
}) => {
  const iconColorHex = color === "text-red-500" ? "#EF4444" : "#1F2937";
  return (
    <TouchableOpacity
      onPress={onPress}
      className="active:bg-gray-100 rounded-xl"
    >
      <View className="flex-row items-center justify-center p-4 border-gray-200">
        <Feather name={icon} size={22} color={iconColorHex} />
        <Text className={`ml-4 text-base ${color} font-semibold`}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ProfileActionRow;
