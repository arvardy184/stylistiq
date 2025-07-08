import { Text, View } from "react-native";

const TotalOutfit = () => {
  return (
    <View className="flex-row justify-center items-center gap-24">
      <View className="flex items-center gap-2">
        <Text className="text-white text-sm font-bold">Outfit Total</Text>
        <Text className="text-white text-2xl font-bold">24</Text>
      </View>
    </View>
  );
};

export default TotalOutfit;
