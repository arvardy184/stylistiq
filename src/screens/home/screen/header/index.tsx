import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const HeaderHome = () => {
  return (
    <View className="flex-row justify-between items-center p-5">
      <View>
        <Text className="text-white text-sm font-bold">Good Evening,</Text>
        <Text className="text-white text-2xl font-bold">maar</Text>
      </View>
      <Ionicons name="notifications" size={24} color="white" />
    </View>
  );
};

export default HeaderHome;
