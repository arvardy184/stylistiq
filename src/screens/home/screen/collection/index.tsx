import { Text, View, TouchableOpacity } from "react-native";
import CollectionCard from "./card";

const ColletionBody = () => {
  return (
    <View className="px-5 mt-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-slate-800 text-2xl font-bold">
          My Collections
        </Text>
        <TouchableOpacity>
          <Text className="text-primary font-semibold">See All</Text>
        </TouchableOpacity>
      </View>

      <View
        className="flex-row flex-wrap justify-between"
        style={{ rowGap: 16 }}
      >
        <CollectionCard title="Summer Vibes" itemCount={8} />
        <CollectionCard title="Work Wear" itemCount={12} />
        <CollectionCard title="Formal Events" itemCount={5} />
        <CollectionCard title="Casual Weekend" itemCount={15} />
      </View>
    </View>
  );
};
export default ColletionBody;
