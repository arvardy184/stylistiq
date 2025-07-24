import { Text, View, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuthStore } from "@/store/auth/authStore";
import { useGetAllCollectionByToken } from "@/services/queries/collection/getAllCollectionByToken";
import { Collection } from "./type";
import CollectionCard from "./card";
import { useNavigation } from "@react-navigation/native";

const ColletionBody = () => {
  const { token } = useAuthStore();
  const navigation = useNavigation();
  const {
    data: collections,
    isLoading,
    isError,
  } = useGetAllCollectionByToken(token);

  const SkeletonCard = () => (
    <View className="w-[48%] bg-white rounded-2xl shadow-md overflow-hidden">
      <View className="h-24 bg-slate-200" />
      <View className="p-3">
        <View className="h-5 w-3/4 bg-slate-200 rounded" />
        <View className="h-4 w-1/2 bg-slate-200 rounded mt-2" />
      </View>
    </View>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </>
      );
    }

    if (isError) {
      return (
        <View className="w-full items-center justify-center py-10">
          <Feather name="alert-circle" size={40} color="#ef4444" />
          <Text className="text-slate-600 mt-4 text-center">
            Failed to load collections.
          </Text>
        </View>
      );
    }

    if (!collections || collections.length === 0) {
      return (
        <View className="w-full items-center justify-center py-10 bg-slate-50 rounded-2xl">
          <Feather name="package" size={48} color="#64748b" />
          <Text className="text-xl font-bold text-slate-700 mt-4">
            No Collections Yet
          </Text>
          <Text className="text-slate-500 mt-2 text-center max-w-[80%]">
            Tap the button below to create your first collection.
          </Text>
          <TouchableOpacity className="bg-primary mt-6 py-3 px-6 rounded-full">
            <Text className="text-white font-bold">Create Collection</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return collections.map((collection: Collection) => (
      <CollectionCard key={collection.id} collection={collection} />
    ));
  };

  const toCollection = () => {
    navigation.navigate("Collections");
  };

  return (
    <View className="px-5 mt-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-slate-800 text-2xl font-bold">
          My Collections
        </Text>
        <TouchableOpacity onPress={toCollection}>
          <Text className="text-primary font-semibold">See All</Text>
        </TouchableOpacity>
      </View>

      <View
        className="flex-row flex-wrap justify-between"
        style={{ rowGap: 16 }}
      >
        {renderContent()}
      </View>
    </View>
  );
};
export default ColletionBody;
