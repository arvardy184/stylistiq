import React from "react";
import { View, Text, Image } from "react-native";

const AuthHeader = ({ isLogin }: { isLogin: boolean }) => {
  return (
    <View className="bg-primary items-center px-8 pt-12 pb-20 rounded-b-[40px]">
      <Image
        source={require("../../../../assets/icon/icon-nobg.png")}
        className="w-32 h-32"
        resizeMode="contain"
      />

      <Text className="text-white text-4xl font-extrabold text-center mt-2">
        {isLogin ? "Welcome Back!" : "Create Account"}
      </Text>
      <Text className="text-white/80 text-lg text-center mt-2 font-light">
        {isLogin
          ? "Sign in to continue your journey"
          : "Sign up to get started"}
      </Text>
    </View>
  );
};

export default AuthHeader;
