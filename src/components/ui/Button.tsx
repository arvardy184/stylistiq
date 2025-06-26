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
      borderRadius: 8,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      opacity: disabled || loading ? 0.5 : 1,
    };

    const sizeStyles = {
      sm: { paddingHorizontal: 16, paddingVertical: 8, minHeight: 32 },
      md: { paddingHorizontal: 24, paddingVertical: 12, minHeight: 44 },
      lg: { paddingHorizontal: 32, paddingVertical: 16, minHeight: 52 },
    };

    const variantStyles = {
      primary: { backgroundColor: '#0ea5e9' },
      secondary: { backgroundColor: '#ec4899' },
      outline: { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#0ea5e9' },
    };

    return [baseStyle, sizeStyles[size], variantStyles[variant], style];
  };

  const getTextStyle = () => {
    const sizeStyles = {
      sm: { fontSize: 14 },
      md: { fontSize: 16 },
      lg: { fontSize: 18 },
    };

    const variantStyles = {
      primary: { color: 'white', fontWeight: '600' as const },
      secondary: { color: 'white', fontWeight: '600' as const },
      outline: { color: '#0ea5e9', fontWeight: '600' as const },
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
          color={variant === 'outline' ? '#0ea5e9' : 'white'} 
          style={{ marginRight: 8 }}
        />
      )}
      <Text style={getTextStyle()}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export { Button }; 