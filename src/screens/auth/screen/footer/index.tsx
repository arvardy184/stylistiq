import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGoogleAuth } from "../../oauth/useGoogleAuth";

const AuthFooter = () => {
  const { handleGoogleLogin } = useGoogleAuth();

  return (
    <View className="px-5 mt-5 items-center">
      <View className="flex-row items-center w-full mb-5">
        <View className="flex-1 h-px bg-gray-200" />
        <Text className="mx-4 text-gray-400 text-sm">Or continue with</Text>
        <View className="flex-1 h-px bg-gray-200" />
      </View>

      <TouchableOpacity
        onPress={() => handleGoogleLogin()}
        className="
          flex-row items-center justify-center w-full
          bg-white py-3.5 rounded-xl
          border border-primary
          shadow-md shadow-black/5
        "
      >
        <Ionicons name="logo-google" size={24} color="#DB4437" />
        <Text className="text-gray-700 text-base font-semibold ml-3">
          Sign In with Google
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthFooter;
