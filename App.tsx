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
import Toast from "react-native-toast-message";
import { toastConfig } from "@/components/ui/toast/CustomToast";

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

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </SafeAreaProvider>
      </QueryClientProvider>
      <Toast config={toastConfig} />
    </GestureHandlerRootView>
  );
}
