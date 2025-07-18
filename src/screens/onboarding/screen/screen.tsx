import React, { useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Animated,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Slide, ViewableItemsChangedInfo } from "../type/type";
import { slides } from "../components/slide";
import Paginator from "../components/paginator";
import SlideItem from "../components/slideItem";
import { useNavigation } from "@react-navigation/native";

const OnboardingScreen: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const navigation = useNavigation<any>();
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList<Slide>>(null);
  const backButtonOpacity = useRef(new Animated.Value(0)).current;
  const isLastSlide = currentIndex === slides.length - 1;
  const viewableItemsChanged = useRef(
    ({ viewableItems }: ViewableItemsChangedInfo) => {
      if (viewableItems[0] && viewableItems[0].index !== null) {
        const newIndex = viewableItems[0].index;
        setCurrentIndex(newIndex);
        Animated.timing(backButtonOpacity, {
          toValue: newIndex > 0 ? 1 : 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    }
  ).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollToNext = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    }
  };

  const scrollToPrevious = () => {
    if (currentIndex > 0) {
      slidesRef.current?.scrollToIndex({ index: currentIndex - 1 });
    }
  };

  const skipOnboarding = () => {
    slidesRef.current?.scrollToEnd({ animated: true });
  };

  const handleGetStarted = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    navigation.replace("Login");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="h-16 flex-row items-center justify-between px-6 mt-10">
        <Animated.View style={{ opacity: backButtonOpacity }}>
          <TouchableOpacity
            onPress={scrollToPrevious}
            className="p-2"
            disabled={currentIndex === 0}
          >
            <Feather name="arrow-left" size={24} color="#1e293b" />
          </TouchableOpacity>
        </Animated.View>
        {!isLastSlide && (
          <TouchableOpacity onPress={skipOnboarding}>
            <Text className="text-[#B2236F] font-semibold text-base">Skip</Text>
          </TouchableOpacity>
        )}
      </View>
      <View className="flex-1">
        <FlatList
          data={slides}
          renderItem={({ item }) => <SlideItem item={item} scrollX={scrollX} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>
      <View className="px-8 pb-8 pt-4">
        <Paginator data={slides} scrollX={scrollX} />
        <TouchableOpacity
          onPress={isLastSlide ? handleGetStarted : scrollToNext}
          activeOpacity={0.8}
          className="h-14 w-full items-center justify-center rounded-full bg-[#B2236F] mt-2 shadow-lg shadow-rose-200"
        >
          <Text className="text-white font-bold text-base">
            {isLastSlide ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
