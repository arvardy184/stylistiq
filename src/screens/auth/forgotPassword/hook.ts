import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import { forgotPasswordSchema } from "@/schemas/auth/forgotPassword";
import { useForgotPassword } from "@/services/queries/auth/forgotPassword";
import { ForgotPasswordFormData } from "@/screens/auth/screen/body/form/forgotPassword";
import { UseForgotPasswordModalProps } from "./type";

export const useForgotPasswordModal = ({
  onClose,
}: UseForgotPasswordModalProps) => {
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

  return {
    control,
    handleSubmit,
    errors,
    onSubmit,
    isLoading: forgotPasswordMutation.isPending,
  };
};
