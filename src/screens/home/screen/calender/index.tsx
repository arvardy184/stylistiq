import React, { useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import dayjs from "dayjs";

const CalenderHome = () => {
  const today = dayjs();
  const dayOfWeek = today.day();
  const initialMonday = today.subtract(
    dayOfWeek === 0 ? 6 : dayOfWeek - 1,
    "day"
  );

  const [currentWeekStart, setCurrentWeekStart] = useState(initialMonday);
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dates = Array.from({ length: 7 }, (_, i) =>
    currentWeekStart.add(i, "day")
  );

  const handlePrevWeek = () => {
    setCurrentWeekStart(currentWeekStart.subtract(7, "day"));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(currentWeekStart.add(7, "day"));
  };

  return (
    <View className="bg-white border m-5 border-white rounded-lg justify-between">
      <View className="flex-row justify-between items-center px-5 pt-5">
        <TouchableOpacity onPress={handlePrevWeek}>
          <Text className="text-lg text-primary">{"<"}</Text>
        </TouchableOpacity>

        <Text className="text-black text-2xl font-bold">
          This Week's Outfit
        </Text>

        <TouchableOpacity onPress={handleNextWeek}>
          <Text className="text-lg text-primary">{">"}</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between px-5 mt-4">
        {weekdays.map((day, index) => (
          <Text
            key={index}
            className="text-sm text-gray-500 text-center flex-1"
          >
            {day}
          </Text>
        ))}
      </View>

      <View className="flex-row justify-between px-5 mb-4">
        {dates.map((dateObj, index) => {
          const isToday = dateObj.isSame(today, "day");

          return (
            <Text
              key={index}
              className={`text-base text-center flex-1 py-1 rounded-full ${
                isToday ? "bg-primary text-white font-bold" : "text-black"
              }`}
            >
              {dateObj.date()}
            </Text>
          );
        })}
      </View>

      <View className="w-full p-4 bg-primary rounded-b-lg">
        <Text className="text-white text-2xl text-center">
          Classic White-Blue
        </Text>
        <Text className="text-white font-thin text-center">See Details</Text>
      </View>
    </View>
  );
};

export default CalenderHome;
