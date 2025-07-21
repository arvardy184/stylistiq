import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MainTabNavigator from "@/components/navbar/navbar";
import AuthScreen from "@/screens/auth/screen/screen";
import CollectionDetailScreen from "@/screens/collections/screen/CollectionDetailScreen";
import ClothesDetailScreen from "@/screens/clothes/screen/ClothesDetailScreen";
import { useAuthStore } from "@/store/auth/authStore";
import NotificationScreen from "@/screens/notification/screen/screen";
import ResetPasswordScreen from "@/screens/auth/resetPassword/screen";
import ChangePasswordScreen from "@/screens/auth/changePassword/screen";
import OnboardingScreen from "@/screens/onboarding/screen/screen";
import LoadingContent from "@/components/ui/loading/LoadingContent";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(
    null
  );

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

  if (loading) return <LoadingContent />;

  return (
    <NavigationContainer>
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
          options={{ headerShown: true, title: "Collection Detail" }}
        />
        <Stack.Screen
          name="ClothesDetail"
          component={ClothesDetailScreen}
          options={{ headerShown: true, title: "Clothes Detail" }}
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
