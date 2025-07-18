import { ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CollectionBody from "./collection";
import CalendarHome from "./calender";
import HeaderHome from "./header";
import { useAuthStore } from "@/store/auth/authStore";
import { useGetProfileUser } from "@/services/queries/user/getProfile";
import { useTokenExpiration } from "../hook/useTokenExpiration";
import LoadingContent from "@/components/ui/loading/LoadingContent";

export const HomeScreen = () => {
  const { token } = useAuthStore();
  const { data: userProfile, isLoading } = useGetProfileUser(token);
  useTokenExpiration();

  if (isLoading) {
    <LoadingContent />;
  }

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <StatusBar barStyle="light-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        className="bg-white"
      >
        <HeaderHome
          username={userProfile?.name || "User"}
          totalOutfits={userProfile?.clothesCount || 0}
        />
        <CalendarHome />
        <CollectionBody />
      </ScrollView>
    </SafeAreaView>
  );
};
