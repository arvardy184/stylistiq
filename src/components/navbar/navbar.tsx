import { View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { HomeScreen } from "@/screens/home/screen/screen";
import CameraScreen from "@/screens/camera/screen/screen";
import ProfileScreen from "@/screens/profile/screen/screen";
import CollectionsScreen from "@/screens/collections/screen/screen";
import ClothesScreen from "@/screens/clothes/screen/screen";
import CustomUploadButton from "../ui/button/uploadButton";
import { useMainTabNavigator } from "./hook/useMainTabNavigator";
import { ProfileCompletionModal } from "../modal/ProfileCompletionModal";

const Tab = createBottomTabNavigator();

const iconMap: { [key: string]: { focused: string; unfocused: string } } = {
  Home: { focused: "home", unfocused: "home-outline" },
  Clothes: { focused: "shirt", unfocused: "shirt-outline" },
  Collections: { focused: "albums", unfocused: "albums-outline" },
  Profile: { focused: "person", unfocused: "person-outline" },
};

const MainTabNavigator = () => {
  const {
    isModalVisible,
    handleCompleteProfile,
    handleUploadPress,
    protectedTabListener,
    handleModalClose,
  } = useMainTabNavigator();

  return (
    <>
      <ProfileCompletionModal
        isVisible={isModalVisible}
        onClose={handleModalClose}
        onCompleteProfile={handleCompleteProfile}
      />

      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: "#083D57",
          tabBarInactiveTintColor: "#737373",
          tabBarStyle: {
            backgroundColor: "#ffffff",
            height: 80,
            paddingBottom: 20,
            paddingTop: 8,
            elevation: 5,
            borderTopWidth: 0,
          },
          tabBarIcon: ({ focused, color }) => {
            const { name } = route;
            if (name === "Upload") return null;
            const iconName = focused
              ? iconMap[name].focused
              : iconMap[name].unfocused;
            return <Ionicons name={iconName as any} size={24} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ tabBarLabel: "Home" }}
          listeners={protectedTabListener}
        />
        <Tab.Screen
          name="Clothes"
          component={ClothesScreen}
          options={{ tabBarLabel: "Clothes" }}
          listeners={protectedTabListener}
        />
        <Tab.Screen
          name="Upload"
          component={CameraScreen}
          options={{
            tabBarButton: () => (
              <View className="-top-10 items-center">
                <CustomUploadButton onPress={handleUploadPress} />
                <Text className="text-xs font-medium mt-1 text-gray-500">
                  Upload
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Collections"
          component={CollectionsScreen}
          options={{ tabBarLabel: "Collections" }}
          listeners={protectedTabListener}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ tabBarLabel: "Profile" }}
        />
      </Tab.Navigator>
    </>
  );
};

export default MainTabNavigator;
