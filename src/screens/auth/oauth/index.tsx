import { View, Text } from "react-native";
import Button from "@/components/ui/button";
import { useGoogleAuth } from "@/hooks/auth/oauth/useGoogleAuth";

const OauthScreen = () => {
  const { handleGoogleLogin } = useGoogleAuth();

  return (
    <View className="flex-1 justify-center items-center p-6 bg-white">
      <View className="mb-8 items-center">
        <Text className="text-3xl font-bold text-gray-800 mb-2">
          Welcome Back! 👋
        </Text>
        <Text className="text-base text-gray-500 text-center">
          Sign in to continue your style journey
        </Text>
      </View>

      <View className="w-full mb-6">
        <Button
          title="Continue with Google"
          onPress={handleGoogleLogin}
          variant="outline"
          size="lg"
          className="w-full border-gray-300"
        />
      </View>

      <View className="mt-8 px-4">
        <Text className="text-xs text-gray-400 text-center">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
};

export default OauthScreen;
