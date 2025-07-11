import { Text, View } from "react-native";

const MeasurementGridItem = ({
  label,
  value,
  unit,
}: {
  label: string;
  value?: number | null;
  unit: string;
}) => (
  <View className="w-[48%] bg-gray-50 rounded-lg p-3 mb-3 items-center">
    <Text className="text-lg font-bold text-primary">
      {value ? value : "-"}
      <Text className="text-base font-medium text-primary">
        {value ? ` ${unit}` : ""}
      </Text>
    </Text>
    <Text className="text-xs text-gray-500 mt-1">{label}</Text>
  </View>
);

export default MeasurementGridItem;
