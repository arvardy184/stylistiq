import React from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@/components/ui/button";
import { forgotPasswordSchema } from "@/schemas/auth/forgotPassword";
import { ForgotPasswordFormData } from "../screen/body/form/forgotPassword";
import { ForgotPasswordModalProps } from "./type";
import { useForgotPassword } from "@/services/queries/auth/forgotPassword";
import { useNavigation } from "@react-navigation/native";

const ForgotPasswordModal = ({
  visible,
  onClose,
}: ForgotPasswordModalProps) => {
  const forgotPasswordMutation = useForgotPassword();
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPasswordMutation.mutateAsync(data.email);
      reset();
      onClose();
      navigation.navigate("ResetPassword", { email: data.email });
    } catch (error) {
      console.error("Forgot password error:", error);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        className="flex-1 justify-center items-center bg-black/60"
      >
        <Pressable
          onPress={() => {}}
          className="bg-white w-11/12 max-w-sm rounded-2xl p-6 shadow-xl shadow-black/20"
        >
          <Text className="text-center text-gray-500 mb-6">
            Enter your email to reset your password.
          </Text>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <TextInput
                  placeholder="Enter your email"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  className="bg-gray-100 text-gray-800 border border-gray-300 rounded-xl px-4 py-3 text-base"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {errors.email && (
                  <Text className="text-red-500 text-sm mt-1 ml-1">
                    {errors.email.message}
                  </Text>
                )}
              </View>
            )}
          />

          <Button
            title="Send"
            onPress={handleSubmit(onSubmit)}
            disabled={forgotPasswordMutation.isPending}
            loading={forgotPasswordMutation.isPending}
            className="w-full rounded-xl py-4 bg-[#B2236F] shadow-md shadow-[#B2236F]/40 mt-6"
            textClassName="text-white text-lg font-bold"
          />

          <TouchableOpacity onPress={onClose} className="mt-4">
            <Text className="text-center text-gray-500 font-medium">
              Cancel
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ForgotPasswordModal;
