import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

interface CardHeaderProps {
  title: string;
  onEditPress: () => void;
}

const CardHeader = ({ title, onEditPress }: CardHeaderProps) => {
  return (
    <View className="flex-row items-center justify-between mb-4">
      <Text className="text-lg font-semibold text-gray-800">{title}</Text>
      <TouchableOpacity
        onPress={onEditPress}
        className="flex-row items-center bg-primary/10 p-2 rounded-lg active:bg-primary/20"
      >
        <Feather name="edit-2" size={16} color="#B2236F" />
        <Text className="text-sm font-semibold text-primary ml-1.5">Edit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CardHeader;
