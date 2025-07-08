import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ColletionBody from "./collection";
import TotalOutfit from "./totalOutfit";
import HeaderHome from "./header";
import CalenderHome from "./calender";

export const HomeScreen = () => {
  return (
    <SafeAreaView className="flex-1 relative bg-white">
      <View className="absolute top-0 left-0 right-0 h-64 bg-primary z-0" />
      <ScrollView
        className="z-10"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <HeaderHome />
        <TotalOutfit />
        <CalenderHome />
        <ColletionBody />
      </ScrollView>
    </SafeAreaView>
  );
};
