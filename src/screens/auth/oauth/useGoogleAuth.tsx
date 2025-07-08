import { useEffect } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { GOOGLE_WEB_CLIENT_ID } from "@/config";
import { useOauthMutation } from "@/services/queries/auth/oauth";

export const useGoogleAuth = () => {
  const { mutate } = useOauthMutation();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
    });
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const token = userInfo.data.idToken;
      mutate(token);
    } catch (error) {
      console.error("Google Sign-In Error:", error.code, error.message);
      throw error;
    }
  };

  return {
    handleGoogleLogin,
  };
};
