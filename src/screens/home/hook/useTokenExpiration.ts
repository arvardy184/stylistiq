import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth/authStore";
import { useNavigation } from "@react-navigation/native";

export const useTokenExpiration = () => {
  const navigation = useNavigation();
  const { token, isTokenExpired, clearToken } = useAuthStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleTokenExpiration = () => {
    if (token && isTokenExpired()) {
      clearToken();
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (handleTokenExpiration()) {
      return;
    }
    intervalRef.current = setInterval(() => {
      handleTokenExpiration();
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [token]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      handleTokenExpiration();
    });

    return unsubscribe;
  }, [navigation, token]);
};
