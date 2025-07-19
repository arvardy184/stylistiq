import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import dayjs, { Dayjs } from "dayjs";
import { ScheduleScreenProps, Schedule } from "@/types/schedule";
import { useSchedule } from "@/hooks/useSchedule";
import ScheduleCard from "../components/ScheduleCard";
import { useNotification } from "@/hooks/useNotification";

const ScheduleScreen: React.FC<ScheduleScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const { showError } = useNotification();
  const { selectedDate: routeSelectedDate } = route?.params || {};
  
  // Initialize with passed date or current date
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const initialDate = routeSelectedDate ? dayjs(routeSelectedDate) : dayjs();
    const dayOfWeek = initialDate.day();
    return initialDate.subtract(dayOfWeek === 0 ? 6 : dayOfWeek - 1, "day");
  });
  
  const [selectedDate, setSelectedDate] = useState<Dayjs>(() => 
    routeSelectedDate ? dayjs(routeSelectedDate) : dayjs()
  );
  
  const {
    schedules,
    loading,
    refreshing,
    fetchScheduleByDate,
    deleteSingleSchedule,
    refreshSchedules,
  } = useSchedule();

  const [currentDateSchedules, setCurrentDateSchedules] = useState<Schedule[]>([]);

  // Load schedules when selected date changes
  useEffect(() => {
    loadSchedulesForDate();
  }, [selectedDate]);

  const loadSchedulesForDate = async () => {
    const formattedDate = selectedDate.format("YYYY-MM-DD");
    const scheduleData = await fetchScheduleByDate(formattedDate);
    setCurrentDateSchedules(scheduleData);
  };

  // Refresh when screen gains focus
  useFocusEffect(
    React.useCallback(() => {
      loadSchedulesForDate();
    }, [selectedDate])
  );

  const onRefresh = async () => {
    await loadSchedulesForDate();
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleCreateSchedule = () => {
    const formattedDate = selectedDate.format("YYYY-MM-DD");
    navigation.navigate("ScheduleForm", { 
      selectedDate: formattedDate,
      mode: "create"
    });
  };

  const handleSchedulePress = (schedule: Schedule) => {
    navigation.navigate("ScheduleDetail", { 
      scheduleId: schedule.id,
      scheduleName: `Schedule for ${dayjs(schedule.date).format("DD MMM YYYY")}`
    });
  };

  const handleEditSchedule = (schedule: Schedule) => {
    navigation.navigate("ScheduleForm", { 
      selectedDate: schedule.date,
      schedule: schedule,
      mode: "edit"
    });
  };

  const handleDeleteSchedule = (schedule: Schedule) => {
    const formattedDate = dayjs(schedule.date).format("DD MMM YYYY");
    Alert.alert(
      "Delete Schedule",
      `Are you sure you want to delete the schedule for ${formattedDate}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success = await deleteSingleSchedule(schedule.id);
            if (success) {
              // Remove from current view
              setCurrentDateSchedules(prev => prev.filter(s => s.id !== schedule.id));
            }
          },
        },
      ]
    );
  };

  // Calendar navigation
  const weekdays = ["M", "T", "W", "T", "F", "S", "S"];
  const dates = Array.from({ length: 7 }, (_, i) =>
    currentWeekStart.add(i, "day")
  );

  const handlePrevWeek = () =>
    setCurrentWeekStart(currentWeekStart.subtract(7, "day"));
  const handleNextWeek = () =>
    setCurrentWeekStart(currentWeekStart.add(7, "day"));

  const renderHeader = () => (
    <View className="bg-white px-6 py-4 border-b border-gray-100">
      <View className="flex-row items-center justify-between">
        <TouchableOpacity
          onPress={handleGoBack}
          className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center"
        >
          <Ionicons name="arrow-back" size={20} color="#374151" />
        </TouchableOpacity>
        
        <View className="flex-1 mx-4">
          <Text className="text-xl font-bold text-gray-800 text-center">
            Outfit Schedule
          </Text>
          <Text className="text-gray-500 text-sm text-center">
            {selectedDate.format("DD MMMM YYYY")}
          </Text>
        </View>
        
        <TouchableOpacity
          onPress={handleCreateSchedule}
          className="w-10 h-10 rounded-full bg-[#B2236F] justify-center items-center"
        >
          <Ionicons name="add" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCalendar = () => (
    <View className="bg-white mx-4 mt-4 rounded-2xl shadow-lg shadow-black/5 p-5">
      {/* Month Navigation */}
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity onPress={handlePrevWeek} className="p-2">
          <Ionicons name="chevron-back" size={24} color="#B2236F" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800">
          {currentWeekStart.format("MMMM YYYY")}
        </Text>
        <TouchableOpacity onPress={handleNextWeek} className="p-2">
          <Ionicons name="chevron-forward" size={24} color="#B2236F" />
        </TouchableOpacity>
      </View>

      {/* Week Days */}
      <View className="flex-row justify-around">
        {dates.map((dateObj, index) => {
          const isSelected = dateObj.isSame(selectedDate, "day");
          const isToday = dateObj.isSame(dayjs(), "day");
          const hasSchedule = currentDateSchedules.some(s => 
            dayjs(s.date).isSame(dateObj, "day")
          );

          return (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedDate(dateObj)}
              className="items-center gap-2"
            >
              <Text className="font-semibold text-gray-500">
                {weekdays[index]}
              </Text>
              <View
                className={`w-12 h-12 rounded-full justify-center items-center relative ${
                  isSelected 
                    ? "bg-[#B2236F]" 
                    : isToday 
                    ? "bg-[#B2236F]/20" 
                    : "bg-transparent"
                }`}
              >
                <Text
                  className={`text-base font-bold ${
                    isSelected 
                      ? "text-white" 
                      : isToday 
                      ? "text-[#B2236F]" 
                      : "text-gray-800"
                  }`}
                >
                  {dateObj.date()}
                </Text>
                
                {/* Schedule indicator */}
                {hasSchedule && !isSelected && (
                  <View className="absolute bottom-1 w-1.5 h-1.5 bg-[#B2236F] rounded-full" />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderScheduleList = () => {
    if (loading) {
      return (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500">Loading schedules...</Text>
        </View>
      );
    }

    if (currentDateSchedules.length === 0) {
      return (
        <View className="flex-1 justify-center items-center px-6">
          <View className="bg-gray-100 rounded-full p-6 mb-4">
            <Ionicons name="calendar-outline" size={48} color="#9CA3AF" />
          </View>
          <Text className="text-xl font-semibold text-gray-800 mb-2">
            No Schedule Yet
          </Text>
          <Text className="text-gray-600 text-center mb-6">
            Create an outfit schedule for {selectedDate.format("DD MMMM YYYY")}
          </Text>
          <TouchableOpacity
            onPress={handleCreateSchedule}
            className="bg-[#B2236F] px-6 py-3 rounded-full flex-row items-center"
          >
            <Ionicons name="add" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Create Schedule</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="mt-4">
          <View className="flex-row items-center justify-between px-6 mb-4">
            <Text className="text-lg font-semibold text-gray-800">
              Schedules ({currentDateSchedules.length})
            </Text>
          </View>

          {currentDateSchedules.map((schedule) => (
            <ScheduleCard
              key={schedule.id}
              schedule={schedule}
              onPress={handleSchedulePress}
              onEdit={handleEditSchedule}
              onDelete={handleDeleteSchedule}
            />
          ))}
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'left', 'right']}>
      {renderHeader()}
      {renderCalendar()}
      <View className="flex-1 mt-4">
        {renderScheduleList()}
      </View>
    </SafeAreaView>
  );
};

export default ScheduleScreen; 