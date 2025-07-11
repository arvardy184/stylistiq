import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LoadingContent = () => {
  return (
    <SafeAreaView className="flex-1 bg-primary items-center justify-center">
      <ActivityIndicator size="large" color="#0000ff" />
    </SafeAreaView>
  );
};
export default LoadingContent;
