import { Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

const ProfileInfoRow = ({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
}) => (
  <View className="flex-row items-center rounded-lg bg-gray-100 p-5 my-2">
    <Feather name={icon} size={20} color="#6B7280" />
    <Text className="ml-4 text-base text-gray-600">{label}</Text>
    <Text className="ml-auto text-base font-medium text-gray-800">{value}</Text>
  </View>
);

export default ProfileInfoRow;
