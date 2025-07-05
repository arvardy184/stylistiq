import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Button from "../../../components/ui/button";
import { RouteParams } from "../types/types";

export const PhotoAnalysisScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { imageUri } = (route.params as RouteParams) || {};

  // Mock analysis data
  const mockAnalysis = {
    score: 85,
    isMatching: true,
    styleCategory: "casual",
    feedback:
      "Your outfit has excellent color harmony. The blue and neutral tones work perfectly together.",
    recommendations: [
      "Great color coordination!",
      "Try adding a statement accessory",
      "Consider a different shoe style",
    ],
    colorPalette: ["#2563eb", "#f8fafc", "#1e293b"],
  };

  if (!imageUri) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500 text-base">No analysis found</Text>
          <View className="mt-4">
            <Button
              title="Go Back"
              onPress={() => navigation.goBack()}
              variant="primary"
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const ScoreIndicator = ({ score }: { score: number }) => {
    const getBorderColor = () => {
      if (score >= 70) return "#22c55e";
      if (score >= 50) return "#eab308";
      return "#ef4444";
    };

    return (
      <View className="items-center mb-6">
        <View
          className="w-32 h-32 rounded-full border-8 items-center justify-center"
          style={{ borderColor: getBorderColor() }}
        >
          <Text className="text-2xl font-bold text-gray-800">{score}</Text>
          <Text className="text-xs text-gray-500">out of 100</Text>
        </View>
        <Text
          className={`mt-2 text-lg font-semibold ${
            mockAnalysis.isMatching ? "text-green-600" : "text-red-600"
          }`}
        >
          {mockAnalysis.isMatching ? "✨ Great Match!" : "🎯 Needs Improvement"}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-4 py-2">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-4"
          >
            <Ionicons name="arrow-back" size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">
            Outfit Analysis
          </Text>
        </View>

        <View className="px-4 pb-8">
          {/* Outfit Image */}
          <View className="mb-6">
            <Image
              source={{ uri: imageUri }}
              className="w-full h-80 rounded-xl"
              resizeMode="cover"
            />
          </View>

          {/* Score */}
          <ScoreIndicator score={mockAnalysis.score} />

          {/* Style Category */}
          <View className="mb-6 p-4 bg-gray-50 rounded-xl">
            <Text className="text-xs text-gray-500 mb-1">Style Category</Text>
            <Text className="text-lg font-semibold text-gray-800 capitalize">
              {mockAnalysis.styleCategory}
            </Text>
          </View>

          {/* Feedback */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-3">
              Analysis Feedback
            </Text>
            <View className="p-4 bg-blue-50 rounded-xl">
              <Text className="text-gray-800 leading-5">
                {mockAnalysis.feedback}
              </Text>
            </View>
          </View>

          {/* Color Palette */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-3">
              Detected Colors
            </Text>
            <View className="flex-row flex-wrap">
              {mockAnalysis.colorPalette.map((color, index) => (
                <View key={index} className="mr-3 mb-3 items-center">
                  <View
                    className="w-12 h-12 rounded-full border-2 border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                  <Text className="text-xs text-gray-500 mt-1">{color}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Recommendations */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-3">
              Style Recommendations
            </Text>
            {mockAnalysis.recommendations.map((rec, index) => (
              <View
                key={index}
                className="flex-row items-start mb-3 p-3 bg-green-50 rounded-xl"
              >
                <Text className="text-green-600 mr-2 text-base">•</Text>
                <Text className="flex-1 text-gray-800 leading-4">{rec}</Text>
              </View>
            ))}
          </View>

          {/* Actions */}
          <View className="gap-3">
            <Button
              title="Take Another Photo"
              onPress={() => navigation.navigate("Main")}
              variant="primary"
            />
            <Button
              title="Save to Wardrobe"
              onPress={() => navigation.navigate("Main")}
              variant="outline"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
