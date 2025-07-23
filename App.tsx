import React from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppNavigator } from "./src/navigation/AppNavigator";
import "./global.css";
import "./global.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useFonts,
  Figtree_400Regular,
  Figtree_500Medium,
  Figtree_600SemiBold,
  Figtree_700Bold,
} from "@expo-google-fonts/figtree";
import * as SplashScreen from "expo-splash-screen";
import { NotificationProvider } from "@/providers/NotificationProvider";
import { notificationService } from "@/services/notifications";
import Toast from "react-native-toast-message";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function App() {
  const [fontsLoaded] = useFonts({
    Figtree: Figtree_400Regular,
    "Figtree-Medium": Figtree_500Medium,
    "Figtree-SemiBold": Figtree_600SemiBold,
    "Figtree-Bold": Figtree_700Bold,
  });

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Request notification permissions on app start
  React.useEffect(() => {
    const initializeNotifications = async () => {
      try {
        await notificationService.requestPermissions();
      } catch (error) {
        console.error('❌ [APP] Error initializing notifications:', error);
      }
    };
    
    initializeNotifications();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <NotificationProvider>
            <AppNavigator />
            <StatusBar style="auto" />
            <Toast />
          </NotificationProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
