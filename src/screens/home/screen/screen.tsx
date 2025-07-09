import { ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CollectionBody from "./collection";
import CalendarHome from "./calender";
import HeaderHome from "./header";

export const HomeScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-primary">
      <StatusBar barStyle="light-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        className="bg-white"
      >
        <HeaderHome username="Maar" totalOutfits={24} />
        <CalendarHome />
        <CollectionBody />
      </ScrollView>
    </SafeAreaView>
  );
};
