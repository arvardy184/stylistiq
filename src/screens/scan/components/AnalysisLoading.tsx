import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

interface AnalysisLoadingProps {
  imageCount: number;
}

const AnalysisLoading: React.FC<AnalysisLoadingProps> = ({ imageCount }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 1500 }), -1, true);
  }, []);

  const style0 = useAnimatedStyle(() => {
    const val = progress.value;
    const scale = interpolate(val, [0, 0.5, 1], [1, 1.3, 1], Extrapolate.CLAMP);
    const opacity = interpolate(
      val,
      [0, 0.5, 1],
      [0.7, 1, 0.7],
      Extrapolate.CLAMP
    );
    return { transform: [{ scale }], opacity, marginHorizontal: 8 };
  });

  const style1 = useAnimatedStyle(() => {
    const val = progress.value;
    const scale = interpolate(val, [0, 0.5, 1], [1, 1.3, 1], Extrapolate.CLAMP);
    const opacity = interpolate(
      val,
      [0, 0.5, 1],
      [0.7, 1, 0.7],
      Extrapolate.CLAMP
    );
    return { transform: [{ scale }], opacity, marginHorizontal: 8 };
  });

  const style2 = useAnimatedStyle(() => {
    const val = progress.value;
    const scale = interpolate(val, [0, 0.5, 1], [1, 1.3, 1], Extrapolate.CLAMP);
    const opacity = interpolate(
      val,
      [0, 0.5, 1],
      [0.7, 1, 0.7],
      Extrapolate.CLAMP
    );
    return { transform: [{ scale }], opacity, marginHorizontal: 8 };
  });

  return (
    <View className="flex-1 justify-center items-center bg-white p-8">
      <View className="flex-row mb-8">
        <Animated.View style={style0}>
          <Ionicons name="shirt-outline" size={48} color="#8B5CF6" />
        </Animated.View>
        <Animated.View style={style1}>
          <Ionicons name="scan-outline" size={48} color="#EC4899" />
        </Animated.View>
        <Animated.View style={style2}>
          <Ionicons name="color-palette-outline" size={48} color="#F59E0B" />
        </Animated.View>
      </View>

      <Text className="text-2xl font-bold text-gray-800 mb-2">
        Analyzing Your Clothes...
      </Text>

      <Text className="text-gray-600 text-center">
        Please wait a moment while we identify {imageCount}{" "}
        {imageCount > 1 ? "items" : "item"}. This shouldn't take long!
      </Text>
    </View>
  );
};

export default AnalysisLoading;
