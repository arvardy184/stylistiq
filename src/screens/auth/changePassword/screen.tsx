import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Controller } from "react-hook-form";
import { Feather } from "@expo/vector-icons";
import { useChangePasswordScreen } from "./hook";
import { PasswordInputProps } from "./type";

const ChangePasswordScreen = () => {
  const {
    control,
    handleSubmit,
    errors,
    onSubmit,
    isOldPasswordVisible,
    isNewPasswordVisible,
    isConfirmPasswordVisible,
    toggleOldPasswordVisibility,
    toggleNewPasswordVisibility,
    toggleConfirmPasswordVisibility,
    isLoading,
  } = useChangePasswordScreen();

  const renderPasswordInput = ({
    name,
    placeholder,
    isVisible,
    setVisible,
    error,
  }: PasswordInputProps) => (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <View className="mb-4">
          <View className="flex-row items-center bg-white border border-gray-300 rounded-xl">
            <TextInput
              placeholder={placeholder}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={!isVisible}
              className="flex-1 bg-transparent text-gray-800 px-4 py-3 text-base"
              placeholderTextColor="#9CA3AF"
            />
            <Pressable onPress={setVisible} className="p-3">
              <Feather
                name={isVisible ? "eye-off" : "eye"}
                size={20}
                color="#6B7280"
              />
            </Pressable>
          </View>
          {error && (
            <Text className="text-red-500 text-sm mt-1 ml-1">
              {error.message}
            </Text>
          )}
        </View>
      )}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 p-6">
        {renderPasswordInput({
          name: "oldPassword",
          placeholder: "Old Password",
          isVisible: isOldPasswordVisible,
          setVisible: toggleOldPasswordVisibility,
          error: errors.oldPassword,
        })}
        {renderPasswordInput({
          name: "newPassword",
          placeholder: "New Password",
          isVisible: isNewPasswordVisible,
          setVisible: toggleNewPasswordVisibility,
          error: errors.newPassword,
        })}
        {renderPasswordInput({
          name: "confirmPassword",
          placeholder: "Confirm New Password",
          isVisible: isConfirmPasswordVisible,
          setVisible: toggleConfirmPasswordVisibility,
          error: errors.confirmPassword,
        })}

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
          className="w-full mt-4 py-4 bg-primary rounded-xl items-center flex-row justify-center"
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" className="mr-2" />
          ) : null}
          <Text className="text-white text-lg font-bold">
            {isLoading ? "Saving..." : "Save Changes"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;
