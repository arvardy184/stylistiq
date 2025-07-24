import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AnalysisResultListProps } from "../types";
import AnalysisResultCard from "./AnalysisResultCard";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { MainTabParamList } from "@/types";

const PRIMARY_COLOR = "#B2236F";

const AnalysisResultList: React.FC<AnalysisResultListProps> = ({
  results,
  onDone,
  onSaveItem,
}) => {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();

  const successfulItems = results.filter(
    (r) => r.success && r.detectedItem
  ).length;
  const failedItems = results.length - successfulItems;

  const handleGoToWardrobe = () => {
    navigation.navigate("Wardrobe" as never);
    onDone();
  };

  const ListHeader = () => (
    <View className="p-6 bg-slate-50">
      <Text className="text-3xl font-bold text-slate-900">
        Analysis Finished
      </Text>
      <View className="flex-row mt-6 bg-white p-4 rounded-xl border border-slate-100">
        <View className="flex-1 items-center border-r border-slate-200">
          <Text className="text-2xl font-bold text-green-600">
            {successfulItems}
          </Text>
          <Text className="text-sm font-medium text-slate-500 mt-1">
            Successful
          </Text>
        </View>
        <View className="flex-1 items-center">
          <Text className="text-2xl font-bold text-red-600">{failedItems}</Text>
          <Text className="text-sm font-medium text-slate-500 mt-1">
            Failed
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-slate-50">
      <FlatList
        data={results}
        renderItem={({ item }) => (
          <AnalysisResultCard result={item} onSave={onSaveItem} />
        )}
        keyExtractor={(item) => item.id || item.originalImageUri}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 16 }}
      />

      <View className="absolute bottom-0 left-0 right-0 p-6 mb-5 bg-slate-50 border-t border-slate-200">
        <TouchableOpacity
          onPress={handleGoToWardrobe}
          className="flex-row items-center justify-center rounded-2xl py-4 px-5 shadow-lg shadow-black/20"
          style={{ backgroundColor: PRIMARY_COLOR }}
          activeOpacity={0.8}
        >
          <Ionicons name="checkmark-done-circle" size={24} color="white" />
          <Text className="text-white font-bold text-lg ml-3">Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AnalysisResultList;
