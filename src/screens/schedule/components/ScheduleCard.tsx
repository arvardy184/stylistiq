import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScheduleCardProps } from "@/types/schedule";
import dayjs from "dayjs";

const ScheduleCard: React.FC<ScheduleCardProps> = ({
  schedule,
  onPress,
  onEdit,
  onDelete,
}) => {
  const { date, note, reminder, clothes } = schedule;
  
  const formattedDate = dayjs(date).format("DD MMM YYYY");
  const formattedReminder = reminder ? dayjs(reminder).format("DD MMM, HH:mm") : null;
  const clothesCount = clothes.length;

  return (
    <TouchableOpacity
      onPress={() => onPress(schedule)}
      className="bg-white rounded-2xl shadow-lg shadow-black/5 mx-4 mb-4 overflow-hidden"
    >
      {/* Header */}
      <View className="bg-gradient-to-r from-[#B2236F] to-[#EC4899] px-6 py-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-white font-bold text-lg">{formattedDate}</Text>
            {note && (
              <Text className="text-white/90 text-sm mt-1" numberOfLines={2}>
                {note}
              </Text>
            )}
          </View>
          
          <View className="flex-row">
            {onEdit && (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  onEdit(schedule);
                }}
                className="bg-white/20 w-8 h-8 rounded-full justify-center items-center mr-2"
              >
                <Ionicons name="create-outline" size={16} color="white" />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  onDelete(schedule);
                }}
                className="bg-white/20 w-8 h-8 rounded-full justify-center items-center"
              >
                <Ionicons name="trash-outline" size={16} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Content */}
      <View className="p-6">
        {/* Reminder */}
        {formattedReminder && (
          <View className="flex-row items-center mb-4">
            <View className="bg-yellow-100 w-8 h-8 rounded-full justify-center items-center mr-3">
              <Ionicons name="alarm-outline" size={16} color="#F59E0B" />
            </View>
            <View>
              <Text className="text-gray-800 font-medium text-sm">Reminder</Text>
              <Text className="text-gray-600 text-xs">{formattedReminder}</Text>
            </View>
          </View>
        )}

        {/* Clothes Section */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-gray-800 font-semibold text-base">
            Outfit ({clothesCount} {clothesCount === 1 ? 'item' : 'items'})
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="shirt-outline" size={16} color="#6B7280" />
          </View>
        </View>

        {/* Clothes Preview */}
        {clothesCount > 0 ? (
          <View>
            {/* First 3 clothes preview */}
            <View className="flex-row mb-3">
              {clothes.slice(0, 3).map((item, index) => (
                <View
                  key={item.id}
                  className="w-12 h-12 bg-gray-100 rounded-lg mr-2 overflow-hidden"
                  style={{ marginLeft: index > 0 ? -8 : 0, zIndex: 3 - index }}
                >
                  <Image
                    source={{ uri: item.image }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
              ))}
              
              {clothesCount > 3 && (
                <View className="w-12 h-12 bg-gray-200 rounded-lg justify-center items-center ml-2">
                  <Text className="text-gray-600 text-xs font-bold">+{clothesCount - 3}</Text>
                </View>
              )}
            </View>

            {/* Clothes categories */}
            <View className="flex-row flex-wrap">
              {Array.from(new Set(clothes.map(c => c.category))).slice(0, 3).map((category, index) => (
                <View key={index} className="bg-gray-100 px-3 py-1 rounded-full mr-2 mb-1">
                  <Text className="text-gray-700 text-xs font-medium capitalize">
                    {category}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View className="bg-gray-50 rounded-lg p-4 items-center justify-center">
            <Ionicons name="shirt-outline" size={24} color="#9CA3AF" />
            <Text className="text-gray-500 text-sm mt-2">No clothes selected</Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View className="border-t border-gray-100 px-6 py-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={14} color="#9CA3AF" />
            <Text className="text-gray-500 text-xs ml-1">
              Created {dayjs(schedule.createdAt).format("DD MMM")}
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={() => onPress(schedule)}
            className="flex-row items-center"
          >
            <Text className="text-[#B2236F] text-sm font-medium mr-1">View Details</Text>
            <Ionicons name="chevron-forward" size={14} color="#B2236F" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ScheduleCard; 