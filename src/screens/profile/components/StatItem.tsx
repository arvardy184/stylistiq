import { View, Text } from "react-native";

const StatItem = ({ count, label }: { count: number; label: string }) => (
  <View className="items-center">
    <Text className="text-xl font-bold text-primary">{count}</Text>
    <Text className="text-sm text-gray-500 mt-1">{label}</Text>
  </View>
);

export default StatItem;
