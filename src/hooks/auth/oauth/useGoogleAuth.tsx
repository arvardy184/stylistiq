import { useEffect } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { GOOGLE_WEB_CLIENT_ID } from "@env";

export const useGoogleAuth = () => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
    });
  }, []);

  const handleGoogleLogin = async () => {
    try {
      console.log("Attempting Google Sign-In...");
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log("Google Sign-In Success:", userInfo);
      return userInfo;
    } catch (error) {
      console.error("Google Sign-In Error:", error.code, error.message);
      throw error;
    }
  };

  return {
    handleGoogleLogin,
  };
};
