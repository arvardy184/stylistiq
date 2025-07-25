import { Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

type HeaderHomeProps = {
  username: string;
  totalOutfits: number;
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

const HeaderHome = ({ username, totalOutfits }: HeaderHomeProps) => {
  const navigation = useNavigation();
  return (
    <View className="bg-primary rounded-b-3xl px-5 pb-8 pt-5 mb-6 shadow-lg shadow-slate-300">
      <View className="flex-row justify-between items-center">
        <Text className="text-white text-3xl font-bold">{getGreeting()}</Text>
        <View className="flex-row items-center space-x-3">
          <TouchableOpacity
            onPress={() => navigation.navigate("Schedule" as never)}
            className="p-2"
          >
            <Ionicons name="calendar-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Notification" as never)}
            className="p-2"
          >
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <View className="mt-6">
        <Text className="text-white text-xl">
          Hello, <Text className="font-bold">{username.split(" ")[0]}</Text>
        </Text>
        <Text className="text-white/80 text-sm mt-2">
          You have {totalOutfits} total outfits saved.
        </Text>
      </View>
    </View>
  );
};

export default HeaderHome;
