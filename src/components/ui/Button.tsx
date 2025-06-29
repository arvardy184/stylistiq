import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: any;
}

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
}: ButtonProps) => {
  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: 8, // rounded-lg
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      opacity: disabled || loading ? 0.5 : 1,
    };

    // Size styles following Tailwind spacing scale
    const sizeStyles = {
      sm: { paddingHorizontal: 16, paddingVertical: 8, minHeight: 32 }, // px-4 py-2 min-h-8
      md: { paddingHorizontal: 24, paddingVertical: 12, minHeight: 44 }, // px-6 py-3 min-h-11  
      lg: { paddingHorizontal: 32, paddingVertical: 16, minHeight: 52 }, // px-8 py-4 min-h-13
    };

    // Variant styles using Tailwind colors
    const variantStyles = {
      primary: { backgroundColor: '#ec4899' }, // bg-primary-500
      secondary: { backgroundColor: '#6b7280' }, // bg-gray-500
      outline: { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#ec4899' }, // border-2 border-primary-500
    };

    return [baseStyle, sizeStyles[size], variantStyles[variant], style];
  };

  const getTextStyle = () => {
    // Text size following Tailwind typography scale
    const sizeStyles = {
      sm: { fontSize: 14 }, // text-sm
      md: { fontSize: 16 }, // text-base
      lg: { fontSize: 18 }, // text-lg
    };

    const variantStyles = {
      primary: { color: 'white', fontWeight: '600' as const }, // text-white font-semibold
      secondary: { color: 'white', fontWeight: '600' as const },
      outline: { color: '#ec4899', fontWeight: '600' as const }, // text-primary-500 font-semibold
    };

    return [sizeStyles[size], variantStyles[variant]];
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={getButtonStyle()}
    >
      {loading && (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' ? '#ec4899' : 'white'} 
          style={{ marginRight: 8 }} // mr-2
        />
      )}
      <Text style={getTextStyle()}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export { Button }; 