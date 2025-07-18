import React from "react";
import { View, Text, ActivityIndicator } from "react-native";

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message = "Loading..." }) => {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#B2236F" />
      <Text className="text-gray-500 mt-4 text-center">{message}</Text>
    </View>
  );
};

export default LoadingState; 