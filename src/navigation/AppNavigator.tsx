import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { PhotoAnalysisScreen } from "../screens/photoAnalysis/screen/screen";
import MainTabNavigator from "@/components/navbar/navbar";
import AuthScreen from "@/screens/auth/screen/screen";
import { useAuthStore } from "@/store/auth/authStore";
import NotificationScreen from "@/screens/notification/screen/screen";
import ResetPasswordScreen from "@/screens/auth/resetPassword/screen";
import ChangePasswordScreen from "@/screens/auth/changePassword/screen";

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
        <Stack.Screen name="Login" component={AuthScreen} />
        <Stack.Screen
          name="Notification"
          component={NotificationScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen name="Register" component={AuthScreen} />
        <Stack.Screen
          name="ResetPassword"
          options={{ headerShown: true }}
          component={ResetPasswordScreen}
        />
        <Stack.Screen
          name="ChangePassword"
          options={{ headerShown: true }}
          component={ChangePasswordScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export { AppNavigator };
