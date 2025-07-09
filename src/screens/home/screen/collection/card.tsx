import { Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

type CardProps = {
  title: string;
  itemCount: number;
};

const CollectionCard = ({ title, itemCount }: CardProps) => {
  return (
    <View className="w-[48%] bg-white rounded-2xl shadow-md shadow-slate-700 overflow-hidden">
      <View className="h-24 bg-slate-200 justify-center items-center">
        <Feather name="image" size={32} color="#94a3b8" />
      </View>
      <View className="p-3">
        <Text className="text-base font-bold text-slate-800" numberOfLines={1}>
          {title}
        </Text>
        <Text className="text-sm text-slate-500 mt-1">{itemCount} items</Text>
      </View>
    </View>
  );
};

export default CollectionCard;
