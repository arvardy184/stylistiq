import { Text, View } from "react-native";
const CollectionCard = () => {
  return (
    <View className="w-[45%] h-28 bg-white rounded-2xl overflow-hidden flex-row shadow-md">
      <View className="flex-1 bg-gray-300" />
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-black p-1">Summer OOTD</Text>
      </View>
    </View>
  );
};

export default CollectionCard;
