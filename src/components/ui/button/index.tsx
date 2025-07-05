import { cn } from "@/utils/cn";
import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { ButtonProps } from "./types";

const Button = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className,
}: ButtonProps) => {
  const baseClasses = "rounded-lg flex-row items-center justify-center";

  const sizeClasses = {
    sm: "px-4 py-2 min-h-8",
    md: "px-6 py-3 min-h-11",
    lg: "px-8 py-4 min-h-13",
  };

  const variantClasses = {
    primary: "bg-primary-500",
    secondary: "bg-gray-500",
    outline: "bg-transparent border-2 border-primary-500",
  };

  const stateClasses = disabled || loading ? "opacity-50" : "";

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const textVariantClasses = {
    primary: "text-white font-semibold",
    secondary: "text-white font-semibold",
    outline: "text-primary-500 font-semibold",
  };

  const buttonClasses = cn(
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    stateClasses,
    className
  );

  const textClasses = cn(textSizeClasses[size], textVariantClasses[variant]);

  const indicatorColor = variant === "outline" ? "#ec4899" : "white";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={buttonClasses}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={indicatorColor}
          className="mr-2"
        />
      )}
      <Text className={textClasses}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
