import { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { Control, Controller } from "react-hook-form";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Feather } from "@expo/vector-icons";

interface Props {
  control: Control<any>;
  name: string;
  label: string;
}

const ControlledDatePicker = ({ control, name, label }: Props) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const onDateChange = (
          event: DateTimePickerEvent,
          selectedDate?: Date
        ) => {
          if (Platform.OS === "android") {
            setShowPicker(false);
          }
          if (event.type === "set" && selectedDate) {
            onChange(selectedDate);
          }
        };

        return (
          <View className="mb-4">
            <Text className="text-sm text-gray-600 mb-1">{label}</Text>
            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              className={`flex-row justify-between items-center border p-3 rounded-lg ${
                error ? "border-red-500" : "border-gray-300"
              }`}
            >
              <Text className={!value ? "text-gray-400" : ""}>
                {value
                  ? new Date(value).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : "Select a date"}
              </Text>
              <Feather name="calendar" size={20} color="gray" />
            </TouchableOpacity>

            {showPicker && (
              <DateTimePicker
                value={value ? new Date(value) : new Date()}
                mode="date"
                display="default"
                onChange={onDateChange}
                maximumDate={new Date()}
              />
            )}
            {error && (
              <Text className="text-red-500 text-xs mt-1">{error.message}</Text>
            )}
          </View>
        );
      }}
    />
  );
};
export default ControlledDatePicker;
