import React from "react";
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  Pressable,
  StatusBar,
} from "react-native";
import { Controller } from "react-hook-form";
import { Feather } from "@expo/vector-icons";
import Button from "@/components/ui/button";
import { useResetPasswordScreen } from "./hook";

const ResetPasswordScreen = () => {
  const {
    control,
    handleSubmit,
    errors,
    onSubmit,
    isNewPasswordVisible,
    isConfirmPasswordVisible,
    toggleNewPasswordVisibility,
    toggleConfirmPasswordVisibility,
    isLoading,
  } = useResetPasswordScreen();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar backgroundColor="#B2236F" barStyle="light-content" />
      <View className="flex-1 justify-center p-6">
        <Text className="text-center text-gray-500 mb-8">
          Create a new, secure password for your account.
        </Text>

        <Controller
          control={control}
          name="newPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="mb-4">
              <View className="flex-row items-center bg-gray-100 border border-gray-300 rounded-xl">
                <TextInput
                  placeholder="New Password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry={!isNewPasswordVisible}
                  className="flex-1 bg-transparent text-gray-800 px-4 py-3 text-base"
                  placeholderTextColor="#9CA3AF"
                />
                <Pressable
                  onPress={toggleNewPasswordVisibility}
                  className="p-3"
                >
                  <Feather
                    name={isNewPasswordVisible ? "eye-off" : "eye"}
                    size={20}
                    color="#6B7280"
                  />
                </Pressable>
              </View>
              {errors.newPassword && (
                <Text className="text-red-500 text-sm mt-1 ml-1">
                  {errors.newPassword.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <View className="flex-row items-center bg-gray-100 border border-gray-300 rounded-xl">
                <TextInput
                  placeholder="Confirm New Password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry={!isConfirmPasswordVisible}
                  className="flex-1 bg-transparent text-gray-800 px-4 py-3 text-base"
                  placeholderTextColor="#9CA3AF"
                />
                <Pressable
                  onPress={toggleConfirmPasswordVisibility}
                  className="p-3"
                >
                  <Feather
                    name={isConfirmPasswordVisible ? "eye-off" : "eye"}
                    size={20}
                    color="#6B7280"
                  />
                </Pressable>
              </View>
              {errors.confirmPassword && (
                <Text className="text-red-500 text-sm mt-1 ml-1">
                  {errors.confirmPassword.message}
                </Text>
              )}
            </View>
          )}
        />

        <Button
          title="Reset Password"
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
          loading={isLoading}
          className="w-full rounded-xl py-4 bg-[#B2236F] shadow-md shadow-[#B2236F]/40 mt-8"
          textClassName="text-white text-lg font-bold"
        />
      </View>
    </SafeAreaView>
  );
};

export default ResetPasswordScreen;
