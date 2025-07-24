import { ScrollView, StatusBar, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useState } from "react";
import CollectionBody from "./collection";
import CalendarHome from "./calender";
import HeaderHome from "./header";
import { useAuthStore } from "@/store/auth/authStore";
import { useGetProfileUser } from "@/services/queries/user/getProfile";
import { useTokenExpiration } from "../hook/useTokenExpiration";
import LoadingContent from "@/components/ui/loading/LoadingContent";

export const HomeScreen = () => {
  const { token } = useAuthStore();
  const { data: userProfile, isLoading, refetch } = useGetProfileUser(token);
  useTokenExpiration();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (err) {
      console.error("Refresh failed", err);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  if (isLoading && !refreshing) {
    return <LoadingContent />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#B2236F" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
