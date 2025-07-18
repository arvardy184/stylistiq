import React, { useState } from "react";
import { View, Text, TextInput, SafeAreaView, Pressable } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRoute, RouteProp } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { resetPasswordSchema } from "@/schemas/auth/resetPassword";
import { useResetPassword } from "@/services/queries/auth/resetPassword";
import Button from "@/components/ui/button";
import { ResetPasswordFormData } from "../screen/body/form/resetPassword";

type RootStackParamList = {
  ResetPassword: { email: string };
};

type ResetPasswordScreenRouteProp = RouteProp<
  RootStackParamList,
  "ResetPassword"
>;

const ResetPasswordScreen = () => {
  const route = useRoute<ResetPasswordScreenRouteProp>();
  const { email } = route.params;

  const resetPasswordMutation = useResetPassword();

  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      email: email,
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPasswordMutation.mutate(data);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center p-6">
        <Text className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Reset Your Password
        </Text>
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
                  onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
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
                  onPress={() =>
                    setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                  }
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
          disabled={resetPasswordMutation.isPending}
          loading={resetPasswordMutation.isPending}
          className="w-full rounded-xl py-4 bg-[#B2236F] shadow-md shadow-[#B2236F]/40 mt-8"
          textClassName="text-white text-lg font-bold"
        />
      </View>
    </SafeAreaView>
  );
};

export default ResetPasswordScreen;
