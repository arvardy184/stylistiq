import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import dayjs, { Dayjs } from "dayjs";
import { ScheduleScreenProps, Schedule } from "@/types/schedule";
import { useSchedule } from "@/hooks/useSchedule";
import ScheduleCard from "../components/ScheduleCard";
import ConfirmationModal from "@/components/ui/modal/ConfirmationModal";
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

  const [currentDateSchedules, setCurrentDateSchedules] = useState<Schedule[]>(
    []
  );

  // Confirmation modal states
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<Schedule | null>(null);

  // Load schedules when selected date changes
  useEffect(() => {
    loadSchedulesForDate();
  }, [selectedDate]);

  const loadSchedulesForDate = async () => {
    const formattedDate = selectedDate.format("YYYY-MM-DD");
    const scheduleData = await fetchScheduleByDate(formattedDate);
    setCurrentDateSchedules(scheduleData);
  };

  // Auto-refresh when screen gains focus
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
      mode: "create",
    });
  };

  const handleSchedulePress = (schedule: Schedule) => {
    navigation.navigate("ScheduleDetail", {
      scheduleId: schedule.id,
      scheduleName: `Schedule for ${dayjs(schedule.date).format(
        "DD MMM YYYY"
      )}`,
    });
  };

  const handleEditSchedule = (schedule: Schedule) => {
    navigation.navigate("ScheduleForm", {
      selectedDate: schedule.date,
      schedule: schedule,
      mode: "edit",
    });
  };

  const handleDeleteSchedule = (schedule: Schedule) => {
    setScheduleToDelete(schedule);
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (scheduleToDelete) {
      const success = await deleteSingleSchedule(scheduleToDelete.id);
      if (success) {
        // Remove from current view
        setCurrentDateSchedules((prev) =>
          prev.filter((s) => s.id !== scheduleToDelete.id)
        );
      }
    }
    setIsDeleteModalVisible(false);
    setScheduleToDelete(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalVisible(false);
    setScheduleToDelete(null);
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
    <View className="flex-row items-center justify-between p-4 bg-white border-b border-gray-200">
      <TouchableOpacity onPress={handleGoBack} className="p-2">
        <Ionicons name="arrow-back" size={24} />
      </TouchableOpacity>
      <Text className="text-lg font-bold">Schedule</Text>
      <TouchableOpacity onPress={handleCreateSchedule} className="p-2">
        <Ionicons name="add" size={24} color="#3B82F6" />
      </TouchableOpacity>
    </View>
  );

  const renderCalendar = () => (
    <View className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-sm">
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity onPress={handlePrevWeek} className="p-2">
          <Ionicons name="chevron-back" size={20} color="#B2236F" />
        </TouchableOpacity>
        <Text className="text-lg font-bold">
          {currentWeekStart.format("MMMM YYYY")}
        </Text>
        <TouchableOpacity onPress={handleNextWeek} className="p-2">
          <Ionicons name="chevron-forward" size={20} color="#B2236F" />
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-around">
        {dates.map((date, index) => {
          const isSelected = date.isSame(selectedDate, "day");
          const isToday = date.isSame(dayjs(), "day");
          return (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedDate(date)}
              className="items-center"
            >
              <Text className="text-gray-500 text-sm mb-2">
                {weekdays[index]}
              </Text>
              <View
                className={`w-10 h-10 rounded-full justify-center items-center ${
                  isSelected
                    ? "bg-primary"
                    : isToday
                    ? "bg-blue-100"
                    : "bg-transparent"
                }`}
              >
                <Text
                  className={`font-bold ${
                    isSelected
                      ? "text-white"
                      : isToday
                      ? "text-blue-600"
                      : "text-gray-800"
                  }`}
                >
                  {date.date()}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderScheduleList = () => (
    <View className="flex-1 px-4 mt-4">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-bold">
          {selectedDate.format("DD MMMM YYYY")}
        </Text>
        <Text className="text-gray-500">
          {currentDateSchedules.length} schedule(s)
        </Text>
      </View>

      {currentDateSchedules.length === 0 ? (
        <View className="flex-1 justify-center items-center py-12">
          <Ionicons name="calendar-outline" size={64} color="#9CA3AF" />
          <Text className="text-xl font-semibold text-gray-900 mt-4">
            No schedules for this day
          </Text>
          <Text className="text-gray-600 text-center mt-2">
            Create a new schedule to plan your outfit
          </Text>
          <TouchableOpacity
            onPress={handleCreateSchedule}
            className="mt-6 bg-primary px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Create Schedule</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {currentDateSchedules.map((schedule) => (
            <ScheduleCard
              key={schedule.id}
              schedule={schedule}
              onPress={() => handleSchedulePress(schedule)}
              onEdit={() => handleEditSchedule(schedule)}
              onDelete={() => handleDeleteSchedule(schedule)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar backgroundColor="#B2236F" barStyle="light-content" />
      {renderHeader()}
      {renderCalendar()}
      {renderScheduleList()}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        visible={isDeleteModalVisible}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Schedule"
        message={
          scheduleToDelete
            ? `Are you sure you want to delete the schedule for ${dayjs(
                scheduleToDelete.date
              ).format("DD MMM YYYY")}? This action cannot be undone.`
            : ""
        }
        icon="trash-2"
        confirmText="Delete"
        confirmButtonVariant="destructive"
      />
    </SafeAreaView>
  );
};

export default ScheduleScreen;
