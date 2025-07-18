import { FieldError } from "react-hook-form";
import { ChangePasswordFormData } from "../screen/body/form/changePassword";

export interface PasswordInputProps {
  name: keyof ChangePasswordFormData;
  placeholder: string;
  isVisible: boolean;
  setVisible: () => void;
  error?: FieldError;
}
