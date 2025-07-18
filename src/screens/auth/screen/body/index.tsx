import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Button from "@/components/ui/button";
import { LoginFields } from "../../login";
import { RegisterFields } from "../../register";
import { useAuthForm } from "./hook/useAuthForm";

const AuthBody = ({
  isLogin,
  onForgotPasswordPress,
}: {
  isLogin: boolean;
  onForgotPasswordPress: () => void;
}) => {
  const {
    loginForm,
    registerForm,
    onLoginSubmit,
    onRegisterSubmit,
    handleSwitchForm,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isLoading,
  } = useAuthForm(isLogin);

  return (
    <View className="bg-white rounded-2xl p-6 shadow-xl shadow-black mx-1 border border-gray-100">
      {isLogin ? (
        <>
          <LoginFields
            control={loginForm.control}
            errors={loginForm.formState.errors}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
          <TouchableOpacity
            onPress={onForgotPasswordPress}
            className="self-end -mt-2 mb-5"
          >
            <Text className="text-[#B2236F] font-semibold text-base">
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <RegisterFields
          control={registerForm.control}
          errors={registerForm.formState.errors}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          showConfirmPassword={showConfirmPassword}
          setShowConfirmPassword={setShowConfirmPassword}
        />
      )}
      <Button
        title={isLogin ? "Sign In" : "Sign Up"}
        onPress={
          isLogin
            ? loginForm.handleSubmit(onLoginSubmit)
            : registerForm.handleSubmit(onRegisterSubmit)
        }
        disabled={isLoading}
        className="w-full rounded-xl py-4 bg-[#B2236F] shadow-md shadow-[#B2236F]/40"
        textClassName="text-white text-lg font-bold"
      />
      <View className="flex-row justify-center items-center mt-6">
        <Text className="text-gray-500 text-base">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
        </Text>
        <TouchableOpacity onPress={handleSwitchForm}>
          <Text className="text-[#B2236F] font-bold text-base">
            {isLogin ? "Sign Up" : "Sign In"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AuthBody;
