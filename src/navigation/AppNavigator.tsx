import React, { useEffect, useState, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MainTabNavigator from "@/components/navbar/navbar";
import AuthScreen from "@/screens/auth/screen/screen";
import CollectionDetailScreen from "@/screens/collections/screen/CollectionDetailScreen";
import ClothesDetailScreen from "@/screens/clothes/screen/ClothesDetailScreen";
import MatchResultScreen from "@/screens/scan/screen/MatchResultScreen";
import EditClothesScreen from "@/screens/scan/screen/EditClothesScreen";
import { useAuthStore } from "@/store/auth/authStore";
import NotificationScreen from "@/screens/notification/screen/screen";
import ResetPasswordScreen from "@/screens/auth/resetPassword/screen";
import ChangePasswordScreen from "@/screens/auth/changePassword/screen";
import OnboardingScreen from "@/screens/onboarding/screen/screen";
import LoadingContent from "@/components/ui/loading/LoadingContent";
import ScheduleScreen from "@/screens/schedule/screen/ScheduleScreen";
import ScheduleDetailScreen from "@/screens/schedule/screen/ScheduleDetailScreen";
import ScheduleFormScreen from "@/screens/schedule/screen/ScheduleFormScreen";
import { notificationService } from "@/services/notifications";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(
    null
  );
  const navigationRef = useRef<any>(null);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem("hasSeenOnboarding");
        setHasSeenOnboarding(value === "true");
      } catch (e) {
        console.error("Error reading onboarding status:", e);
        setHasSeenOnboarding(false);
      } finally {
        setLoading(false);
      }
    };
    checkOnboardingStatus();
  }, []);

  useEffect(() => {
    if (!token) return;

    const navigateToSchedule = (scheduleId: string) => {
      if (navigationRef.current) {
        navigationRef.current.navigate("ScheduleDetail", { scheduleId });
      }
    };

    const subscriptions =
      notificationService.setupNotificationHandlers(navigateToSchedule);

    return () => {
      subscriptions.foregroundSubscription.remove();
      subscriptions.backgroundSubscription.remove();
    };
  }, [token]);

  if (loading) return <LoadingContent />;

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={
          hasSeenOnboarding === false ? "Onboarding" : token ? "Main" : "Login"
        }
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Main" component={MainTabNavigator} />
        <Stack.Screen
          name="CollectionDetail"
          component={CollectionDetailScreen}
          options={{ headerShown: false, title: "Collection Detail" }}
        />
        <Stack.Screen
          name="ClothesDetail"
          component={ClothesDetailScreen}
          options={{ headerShown: true, title: "Clothes Detail" }}
        />
        <Stack.Screen
          name="MatchResult"
          component={MatchResultScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditClothes"
          component={EditClothesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Schedule"
          component={ScheduleScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ScheduleDetail"
          component={ScheduleDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ScheduleForm"
          component={ScheduleFormScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Login" component={AuthScreen} />
        <Stack.Screen
          name="Notification"
          component={NotificationScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen name="Register" component={AuthScreen} />
        <Stack.Screen
          name="ResetPassword"
          options={{ headerShown: true, title: "Reset Password" }}
          component={ResetPasswordScreen}
        />
        <Stack.Screen
          name="ChangePassword"
          options={{ headerShown: true, title: "Change Password" }}
          component={ChangePasswordScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export { AppNavigator };
