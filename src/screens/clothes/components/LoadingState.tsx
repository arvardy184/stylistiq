import React from "react";
import { View, Dimensions, ActivityIndicator } from "react-native";

const { width: screenWidth } = Dimensions.get("window");
const cardWidth = (screenWidth - 48) / 2;

const SkeletonCard: React.FC = () => {
  return (
    <View className="bg-white rounded-2xl shadow-lg shadow-black/10 m-1 overflow-hidden" style={{ width: cardWidth }}>
      <View className="aspect-square bg-gray-200 animate-pulse" />
      <View className="p-4">
        <View className="h-4 bg-gray-200 rounded mb-2 animate-pulse" />
        <View className="flex-row justify-between">
          <View className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
          <View className="h-3 bg-gray-200 rounded w-12 animate-pulse" />
        </View>
      </View>
    </View>
  );
};

interface LoadingStateProps {
  type?: "grid" | "simple";
  count?: number;
}

const LoadingState: React.FC<LoadingStateProps> = ({ type = "grid", count = 6 }) => {
  if (type === "simple") {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  return (
    <View className="flex-1 px-4">
      <View className="flex-row flex-wrap justify-between pt-4">
        {Array.from({ length: count }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </View>
    </View>
  );
};

export default LoadingState; 