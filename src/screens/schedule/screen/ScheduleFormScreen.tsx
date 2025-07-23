import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import dayjs from "dayjs";
import { useSchedule } from "@/hooks/useSchedule";
import { useClothes } from "@/screens/clothes/hooks/useClothes";
import {
  ScheduleFormData,
  Schedule,
  ScheduleClothes,
} from "@/types/schedule";
import { CLOTHES_CATEGORIES, CLOTHES_SEASONS } from "@/screens/clothes/types";
import LoadingContent from "@/components/ui/loading/LoadingContent";

const ScheduleFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { selectedDate, schedule, mode } = route.params;

  const { createNewSchedule, updateExistingSchedule, loading: scheduleLoading } = useSchedule();
  const { clothes, loading: clothesLoading } = useClothes();

  const [formData, setFormData] = useState<ScheduleFormData>({
    date: selectedDate,
    note: "",
    reminder: undefined,
    clothesIds: [],
  });

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  useEffect(() => {
    if (mode === "edit" && schedule) {
      setFormData({
        date: schedule.date,
        note: schedule.note || "",
        reminder: schedule.reminder,
        clothesIds: schedule.clothes.map((c: ScheduleClothes) => c.id),
      });
    }
  }, [schedule, mode]);

  const handleInputChange = (field: keyof ScheduleFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleClothes = (id: string) => {
    const ids = formData.clothesIds.includes(id)
      ? formData.clothesIds.filter((cid) => cid !== id)
      : [...formData.clothesIds, id];
    handleInputChange("clothesIds", ids);
  };

  const handleSubmit = async () => {
    if (mode === "edit" && schedule) {
      await updateExistingSchedule(schedule.id, formData);
    } else {
      await createNewSchedule(formData);
    }
    navigation.goBack();
  };

  const filteredClothes = selectedCategory
    ? clothes.filter((c) => c.category === selectedCategory)
    : clothes;

  const renderHeader = () => (
    <View className="flex-row items-center justify-between p-4 bg-white border-b border-gray-200">
      <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
        <Ionicons name="arrow-back" size={24} />
      </TouchableOpacity>
      <Text className="text-lg font-bold">
        {mode === "edit" ? "Edit Schedule" : "Create Schedule"}
      </Text>
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={scheduleLoading}
        className="p-2"
      >
        <Text className="text-primary font-bold">Save</Text>
      </TouchableOpacity>
    </View>
  );

  if (clothesLoading) return <LoadingContent />;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {renderHeader()}
      <ScrollView>
        <View className="p-4">
          <TouchableOpacity
            onPress={() => setDatePickerVisibility(true)}
            className="bg-white p-4 rounded-lg shadow-sm mb-4"
          >
            <Text className="font-bold">Date</Text>
            <Text>{dayjs(formData.date).format("DD MMMM YYYY")}</Text>
          </TouchableOpacity>

          <TextInput
            value={formData.note}
            onChangeText={(text) => handleInputChange("note", text)}
            placeholder="Add a note..."
            placeholderTextColor="#9CA3AF"
            className="bg-white p-4 rounded-lg shadow-sm mb-4"
          />

          <TouchableOpacity
            onPress={() => setTimePickerVisibility(true)}
            className="bg-white p-4 rounded-lg shadow-sm mb-4"
          >
            <Text className="font-bold">Reminder</Text>
            <Text>
              {formData.reminder
                ? dayjs(formData.reminder).format("HH:mm")
                : "Set a reminder"}
            </Text>
          </TouchableOpacity>

          {/* Clothes Selection */}
          <View>
            <Text className="text-lg font-bold my-2">Select Clothes</Text>
            {/* Season Filter */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                onPress={() => setSelectedCategory(null)}
                className={`p-2 border rounded-full mr-2 ${
                  !selectedCategory ? "bg-primary border-primary" : "border-gray-300"
                }`}
              >
                <Text
                  className={!selectedCategory ? "text-white" : "text-gray-600"}
                >
                  All
                </Text>
              </TouchableOpacity>
              {CLOTHES_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  className={`p-2 border rounded-full mr-2 ${
                    selectedCategory === category
                      ? "bg-primary border-primary"
                      : "border-gray-300"
                  }`}
                >
                  <Text
                    className={
                      selectedCategory === category ? "text-white" : "text-gray-600"
                    }
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Clothes List */}
            <FlatList
              data={filteredClothes}
              numColumns={4}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleToggleClothes(item.id)}
                  className="m-1"
                >
                  <Image
                    source={{ uri: item.image }}
                    className="w-20 h-20 rounded-lg"
                  />
                  {formData.clothesIds.includes(item.id) && (
                    <View className="absolute top-1 right-1 bg-primary rounded-full p-1">
                      <Ionicons name="checkmark" size={12} color="white" />
                    </View>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </ScrollView>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={(date) => {
          handleInputChange("date", dayjs(date).format("YYYY-MM-DD"));
          setDatePickerVisibility(false);
        }}
        onCancel={() => setDatePickerVisibility(false)}
      />
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={(time) => {
          const reminderDateTime = dayjs(formData.date)
            .hour(time.getHours())
            .minute(time.getMinutes())
            .second(0)
            .toISOString();
          handleInputChange("reminder", reminderDateTime);
          setTimePickerVisibility(false);
        }}
        onCancel={() => setTimePickerVisibility(false)}
      />
    </SafeAreaView>
  );
};

export default ScheduleFormScreen; 