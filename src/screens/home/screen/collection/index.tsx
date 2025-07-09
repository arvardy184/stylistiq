import { Text, View } from "react-native";
import CollectionCard from "./card";

const ColletionBody = () => {
  return (
    <View className="px-5 mt-4">
      <Text className="text-black text-2xl font-bold mb-3">Collections</Text>

      <View className="flex-row flex-wrap justify-between gap-y-4">
        <CollectionCard />
        <CollectionCard />
        <CollectionCard />
        <CollectionCard />
      </View>
      <Text className="text-black mt-5 text-right">See Details</Text>
    </View>
  );
};
export default ColletionBody;
