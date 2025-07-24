import { Text, View, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CardProps } from "./type";
import { formatCategoryDisplay } from "@/utils/formatCategoryDisplay";

const CollectionCard = ({ collection }: CardProps) => {
  const { id, name, image, clothes } = collection;
  const itemCount = clothes.length;

  const navigation = useNavigation();

  const imageUrl =
    image ||
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop";

  const handlePress = () => {
    navigation.navigate("CollectionDetail", {
      collectionId: id,
      collectionName: name,
    });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="w-[48%]"
      activeOpacity={0.8}
    >
      <View className="bg-white rounded-2xl shadow-md shadow-black/20">
        <View className="rounded-2xl overflow-hidden">
          <Image
            source={{ uri: imageUrl }}
            className="h-24 w-full bg-slate-200"
            resizeMode="cover"
          />
          <View className="p-3">
            <Text
              className="text-base font-bold text-slate-800"
              numberOfLines={1}
            >
              {formatCategoryDisplay(name)}
            </Text>
            <Text className="text-sm text-slate-500 mt-1">
              {itemCount} items
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CollectionCard;
