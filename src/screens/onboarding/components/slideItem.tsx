import { Animated, Image, useWindowDimensions, View } from "react-native";
import { SlideItemProps } from "../type/type";

const SlideItem: React.FC<SlideItemProps & { scrollX: Animated.Value }> = ({
  item,
  scrollX,
}) => {
  const { width } = useWindowDimensions();
  const inputRange = [
    (parseInt(item.id) - 2) * width,
    (parseInt(item.id) - 1) * width,
    parseInt(item.id) * width,
  ];

  const imageSource =
    typeof item.image === "string" ? { uri: item.image } : item.image;

  const titleAnim = {
    opacity: scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 0],
      extrapolate: "clamp",
    }),
    transform: [
      {
        translateY: scrollX.interpolate({
          inputRange,
          outputRange: [30, 0, 30],
          extrapolate: "clamp",
        }),
      },
    ],
  };

  const descriptionAnim = {
    opacity: scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 0],
      extrapolate: "clamp",
    }),
    transform: [
      {
        translateY: scrollX.interpolate({
          inputRange,
          outputRange: [50, 0, 50],
          extrapolate: "clamp",
        }),
      },
    ],
  };

  return (
    <View style={{ width }} className="items-center px-8 pt-4">
      <Image
        source={imageSource}
        className="w-full h-72 rounded-2xl"
        resizeMode="contain"
      />
      <View className="mt-12">
        <Animated.Text
          style={titleAnim}
          className="text-3xl font-bold text-center text-slate-800 leading-tight"
        >
          {item.title}
        </Animated.Text>
        <Animated.Text
          style={descriptionAnim}
          className="mt-4 text-base text-center text-slate-500"
        >
          {item.description}
        </Animated.Text>
      </View>
    </View>
  );
};
export default SlideItem;
