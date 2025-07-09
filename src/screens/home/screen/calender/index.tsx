import React, { useState, useCallback } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import dayjs, { Dayjs } from "dayjs";
import { useFocusEffect } from "@react-navigation/native";

const outfitSchedule: { [key: string]: string } = {
  "2025-07-09": "Classic White-Blue",
  "2025-07-11": "Friday Casual",
  "2025-07-12": "Weekend Explorer",
};

const CalenderHome = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = dayjs();
    const dayOfWeek = today.day();
    return today.subtract(dayOfWeek === 0 ? 6 : dayOfWeek - 1, "day");
  });
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  useFocusEffect(
    useCallback(() => {
      const today = dayjs();
      const dayOfWeek = today.day();
      const initialMonday = today.subtract(
        dayOfWeek === 0 ? 6 : dayOfWeek - 1,
        "day"
      );
      setSelectedDate(today);
      setCurrentWeekStart(initialMonday);
    }, [])
  );

  const weekdays = ["M", "T", "W", "T", "F", "S", "S"];
  const dates = Array.from({ length: 7 }, (_, i) =>
    currentWeekStart.add(i, "day")
  );

  const handlePrevWeek = () =>
    setCurrentWeekStart(currentWeekStart.subtract(7, "day"));
  const handleNextWeek = () =>
    setCurrentWeekStart(currentWeekStart.add(7, "day"));

  const outfitForSelectedDay =
    outfitSchedule[selectedDate.format("YYYY-MM-DD")];

  return (
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
        {outfitForSelectedDay ? (
          <>
            <Text className="text-sm text-slate-500">Outfit for the day:</Text>
            <Text className="text-xl font-bold text-primary mt-1">
              {outfitForSelectedDay}
            </Text>
          </>
        ) : (
          <Text className="text-base text-slate-400 font-medium py-4">
            No outfit scheduled for this day.
          </Text>
        )}
      </View>
      <TouchableOpacity
        className={`mt-4 py-3 rounded-lg ${
          outfitForSelectedDay ? "bg-primary/10" : "bg-slate-100"
        }`}
        disabled={!outfitForSelectedDay}
      >
        <Text
          className={`font-bold text-center ${
            outfitForSelectedDay ? "text-primary" : "text-slate-400"
          }`}
        >
          View Outfit Details
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CalenderHome;
