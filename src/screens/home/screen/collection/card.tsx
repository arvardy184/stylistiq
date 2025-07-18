import { Text, View, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import { CardProps } from "./type";

const CollectionCard = ({ collection }: CardProps) => {
  const { name, image, clothes } = collection;
  const itemCount = clothes.length;
  return (
    <View className="w-[48%] bg-white rounded-2xl shadow-md overflow-hidden">
      {image ? (
        <Image
          source={{ uri: image }}
          className="h-24 w-full bg-slate-200"
          resizeMode="cover"
        />
      ) : (
        <View className="h-24 bg-slate-200 justify-center items-center">
          <Feather name="image" size={32} color="#94a3b8" />
        </View>
      )}
      <View className="p-3">
        <Text className="text-base font-bold text-slate-800" numberOfLines={1}>
          {name}
        </Text>
        <Text className="text-sm text-slate-500 mt-1">{itemCount} items</Text>
      </View>
    </View>
  );
};

export default CollectionCard;
