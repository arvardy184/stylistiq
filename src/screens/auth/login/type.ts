import { Control, FieldErrors } from "react-hook-form";

export interface LoginFieldsProps {
  control: Control<any>;
  errors: FieldErrors<any>;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  isLogin: boolean;
}
