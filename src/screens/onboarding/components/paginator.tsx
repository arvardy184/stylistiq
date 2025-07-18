import { Animated, useWindowDimensions, View } from "react-native";
import { PaginatorProps } from "../type/type";

const Paginator: React.FC<PaginatorProps> = ({ data, scrollX }) => {
  const { width } = useWindowDimensions();
  return (
    <View className="flex-row h-16 items-center justify-center">
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 20, 10],
          extrapolate: "clamp",
        });
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: "clamp",
        });
        return (
          <Animated.View
            key={i.toString()}
            style={{ width: dotWidth, opacity, backgroundColor: "#B2236F" }}
            className="h-2.5 rounded-full mx-1"
          />
        );
      })}
    </View>
  );
};

export default Paginator;
