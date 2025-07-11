import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
} from "react-native";
import { Control, Controller } from "react-hook-form";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

interface Item {
  label: string;
  value: string;
}

interface Props {
  control: Control<any>;
  name: string;
  label: string;
  items: Item[];
}

const ControlledDropdown = ({ control, name, label, items }: Props) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const selectedLabel = items.find((item) => item.value === value)?.label;

        return (
          <View className="mb-4">
            <Text className="text-sm text-gray-600 mb-1">{label}</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className={`flex-row justify-between items-center border p-3 rounded-lg ${
                error ? "border-red-500" : "border-gray-300"
              }`}
            >
              <Text className={!value ? "text-gray-400" : "text-gray-800"}>
                {selectedLabel || "Select an option..."}
              </Text>
              <Feather name="chevron-down" size={20} color="gray" />
            </TouchableOpacity>

            {error && (
              <Text className="text-red-500 text-xs mt-1">{error.message}</Text>
            )}
            <Modal
              transparent={true}
              visible={modalVisible}
              animationType="slide"
              onRequestClose={() => setModalVisible(false)}
            >
              <Pressable
                onPress={() => setModalVisible(false)}
                className="flex-1 justify-end bg-black/60"
              >
                <Pressable className="bg-white rounded-t-2xl max-h-[60%]">
                  <SafeAreaView edges={["bottom"]} className="flex-col">
                    <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center my-3" />
                    <View className="flex-row justify-between items-center px-4 pb-3 border-b border-gray-200">
                      <Text className="text-lg font-bold text-gray-800">
                        {label}
                      </Text>
                      <TouchableOpacity
                        onPress={() => setModalVisible(false)}
                        className="p-1"
                      >
                        <Feather name="x" size={24} color="#6B7280" />
                      </TouchableOpacity>
                    </View>
                    <FlatList
                      data={items}
                      keyExtractor={(item) => item.value}
                      renderItem={({ item }) => {
                        const isSelected = item.value === value;
                        return (
                          <TouchableOpacity
                            onPress={() => {
                              onChange(item.value);
                              setModalVisible(false);
                            }}
                            className="flex-row justify-between items-center p-4 border-b border-gray-100"
                          >
                            <Text
                              className={`text-base ${
                                isSelected
                                  ? "text-primary font-bold"
                                  : "text-gray-700"
                              }`}
                            >
                              {item.label}
                            </Text>
                            {isSelected && (
                              <Feather name="check" size={22} color="#B2236F" />
                            )}
                          </TouchableOpacity>
                        );
                      }}
                    />
                  </SafeAreaView>
                </Pressable>
              </Pressable>
            </Modal>
          </View>
        );
      }}
    />
  );
};

export default ControlledDropdown;
