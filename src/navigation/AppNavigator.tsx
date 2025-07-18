import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { PhotoAnalysisScreen } from "../screens/photoAnalysis/screen/screen";
import MainTabNavigator from "@/components/navbar/navbar";
import AuthScreen from "@/screens/auth/screen/screen";
import CollectionDetailScreen from "@/screens/collections/screen/CollectionDetailScreen";
import ClothesDetailScreen from "@/screens/clothes/screen/ClothesDetailScreen";
import { useAuthStore } from "@/store/auth/authStore";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { token } = useAuthStore();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={token ? "Main" : "Login"}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Main" component={MainTabNavigator} />
        <Stack.Screen
          name="PhotoAnalysis"
          component={PhotoAnalysisScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="CollectionDetail"
          component={CollectionDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ClothesDetail"
          component={ClothesDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Login" component={AuthScreen} />
        <Stack.Screen name="Register" component={AuthScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export { AppNavigator };
