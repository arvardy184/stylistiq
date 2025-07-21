import React, { useState, useCallback, useEffect } from "react";
import { Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import dayjs, { Dayjs } from "dayjs";
import { useFocusEffect } from "@react-navigation/native";
import { useGetScheduleByDate } from "@/services/queries/home/getScheduleByDate";
import { createSchedule, CreateSchedulePayload } from "@/services/api/home";
import { useAuthStore } from "@/store/auth/authStore";
import { useNotification } from "@/hooks/useNotification";
import ScheduleCreationModal from "./ScheduleCreationModal";

const CalenderHome = () => {
  const { token } = useAuthStore();
  const { showSuccess, showError } = useNotification();
  const [currentWeekStart, setCurrentWeekStart] = useState(() => dayjs().startOf('week'));
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreatingSchedule, setIsCreatingSchedule] = useState(false);

  const formattedDate = selectedDate.format("YYYY-MM-DD");
  const { data: scheduleData, isLoading: isScheduleLoading, refetch: refetchSchedule } = useGetScheduleByDate(token, formattedDate);

  useEffect(() => {
    if (formattedDate) {
      refetchSchedule();
    }
  }, [formattedDate, refetchSchedule]);

  useFocusEffect(
    useCallback(() => {
      const today = dayjs();
      setSelectedDate(today);
      setCurrentWeekStart(today.startOf('week'));
      refetchSchedule();
    }, [refetchSchedule])
  );

  const handleCreateSchedule = async (clothesIds: string[]) => {
    if (!token) return;
    
    setIsCreatingSchedule(true);
    const payload: CreateSchedulePayload = {
      date: selectedDate.format("YYYY-MM-DD"),
      clothesIds,
    };
    
    try {
      await createSchedule(token, payload);
      showSuccess("Schedule Created!", "Your outfit for the day has been set.");
      setIsModalVisible(false);
      refetchSchedule(); // Refresh data for the selected date
    } catch (error) {
      showError("Failed to Create Schedule", "Please try again later.");
    } finally {
      setIsCreatingSchedule(false);
    }
  };

  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];
  const dates = Array.from({ length: 7 }, (_, i) => currentWeekStart.add(i, "day"));

  const handlePrevWeek = () => setCurrentWeekStart(currentWeekStart.subtract(7, "day"));
  const handleNextWeek = () => setCurrentWeekStart(currentWeekStart.add(7, "day"));

  const outfitForSelectedDay = scheduleData?.[0]?.clothes;

  return (
    <>
      <View className="bg-white rounded-2xl shadow-lg shadow-slate-600 mx-5 my-4 p-5">
        <View className="flex-row justify-between items-center mb-4">
            <TouchableOpacity onPress={handlePrevWeek} className="p-2">
                <Feather name="chevron-left" size={24} color="#B2236F" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-slate-800">
                {currentWeekStart.format("MMMM YYYY")}
            </Text>
            <TouchableOpacity onPress={handleNextWeek} className="p-2">
                <Feather name="chevron-right" size={24} color="#B2236F" />
            </TouchableOpacity>
        </View>

        <View className="flex-row justify-around">
            {dates.map((dateObj, index) => {
            const isSelected = dateObj.isSame(selectedDate, "day");
            return (
                <TouchableOpacity
                key={index}
                onPress={() => setSelectedDate(dateObj)}
                className="items-center gap-2"
                >
                <Text className="font-semibold text-slate-500">
                    {weekdays[index]}
                </Text>
                <View
                    className={`w-10 h-10 rounded-full justify-center items-center ${
                    isSelected ? "bg-primary rounded-full" : "bg-transparent"
                    }`}
                >
                    <Text
                    className={`text-base font-bold ${
                        isSelected ? "text-white" : "text-slate-800"
                    }`}
                    >
                    {dateObj.date()}
                    </Text>
                </View>
                </TouchableOpacity>
            );
            })}
        </View>

        <View className="mt-6 border-t border-slate-200 pt-4 items-center">
          {isScheduleLoading ? (
            <ActivityIndicator size="large" color="#B2236F" />
          ) : outfitForSelectedDay && outfitForSelectedDay.length > 0 ? (
            <>
              <Text className="text-sm text-slate-500">Outfit for the day:</Text>
              <Text className="text-xl font-bold text-primary mt-1">
                {outfitForSelectedDay.length} {outfitForSelectedDay.length > 1 ? 'items' : 'item'}
              </Text>
            </>
          ) : (
            <Text className="text-base text-slate-400 font-medium py-4">
              No outfit scheduled for this day.
            </Text>
          )}
        </View>

        <TouchableOpacity
          className="mt-4 py-3 rounded-lg bg-primary/10"
          onPress={() => setIsModalVisible(true)}
        >
          <Text className="font-bold text-center text-primary">
            {outfitForSelectedDay && outfitForSelectedDay.length > 0 ? "Edit Schedule" : "Create Schedule"}
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScheduleCreationModal 
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSchedule={handleCreateSchedule}
        isLoading={isCreatingSchedule}
      />
    </>
  );
};

export default CalenderHome;
