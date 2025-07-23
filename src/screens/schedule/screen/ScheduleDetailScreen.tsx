import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import { useSchedule } from "@/hooks/useSchedule";
import { Schedule } from "@/types/schedule";
import LoadingContent from "@/components/ui/loading/LoadingContent";
import { StatusBar } from "react-native";

const ScheduleDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { scheduleId, scheduleName } = route.params;

  const { fetchScheduleById, deleteSingleSchedule, loading } = useSchedule();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadScheduleDetail = async () => {
    const data = await fetchScheduleById(scheduleId);
    setSchedule(data);
  };

  useEffect(() => {
    loadScheduleDetail();
  }, [scheduleId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadScheduleDetail();
    setRefreshing(false);
  };

  const handleGoBack = () => navigation.goBack();
  const handleEdit = () => {
    navigation.navigate("ScheduleForm", {
      schedule: schedule,
      mode: "edit",
      selectedDate: schedule?.date,
    });
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Schedule",
      `Are you sure you want to delete this schedule?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success = await deleteSingleSchedule(scheduleId);
            if (success) {
              navigation.goBack();
            }
          },
        },
      ]
    );
  };

  if (loading && !schedule) {
    return <LoadingContent />;
  }

  if (!schedule) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-gray-500">Schedule not found.</Text>
        <TouchableOpacity onPress={handleGoBack} className="mt-4">
          <Text className="text-primary">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top", "left", "right"]}>
      <StatusBar backgroundColor="#B2236F" barStyle="light-content" />
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={handleGoBack} className="p-2">
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text className="text-lg font-bold" numberOfLines={1}>
          {scheduleName}
        </Text>
        <View className="flex-row">
          <TouchableOpacity onPress={handleEdit} className="p-2">
            <Ionicons name="create-outline" size={24} color="#3B82F6" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} className="p-2">
            <Ionicons name="trash-outline" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="p-4">
          {/* Note Section */}
          <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <Text className="text-base font-bold mb-2">Note</Text>
            <Text className="text-gray-600">
              {schedule.note || "No note for this schedule."}
            </Text>
          </View>

          {/* Reminder Section */}
          <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <Text className="text-base font-bold mb-2">Reminder</Text>
            <Text className="text-gray-600">
              {schedule.reminder
                ? dayjs(schedule.reminder).format("DD MMM YYYY, HH:mm")
                : "No reminder set."}
            </Text>
          </View>

          {/* Clothes Section */}
          <View className="bg-white p-4 rounded-lg shadow-sm">
            <Text className="text-base font-bold mb-2">
              Outfit ({schedule.clothes.length} items)
            </Text>
            {schedule.clothes.map((item) => (
              <View
                key={item.id}
                className="flex-row items-center p-2 border-b border-gray-100"
              >
                <Image
                  source={{ uri: item.image }}
                  className="w-16 h-16 rounded-lg mr-4"
                />
                <View>
                  <Text className="font-bold">{item.itemType}</Text>
                  <Text className="text-gray-500 capitalize">
                    {item.category} - {item.color}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ScheduleDetailScreen; 