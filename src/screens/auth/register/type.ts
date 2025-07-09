import { Control, FieldErrors } from "react-hook-form";
export interface RegisterFieldsProps {
  control: Control<any>;
  errors: FieldErrors<any>;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (val: boolean) => void;
}
