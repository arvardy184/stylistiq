import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { ButtonProps } from "./types";
import { cn } from "@/utils/cn";

const Button = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  className,
  textClassName,
}: ButtonProps & { textClassName?: string }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={cn("flex-row items-center justify-center", className)}
    >
      {loading && (
        <ActivityIndicator size="small" color="white" className="mr-2" />
      )}
      <Text className={textClassName}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
