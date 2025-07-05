import CameraScreen from "@/screens/camera/screen/screen";
import ProfileScreen from "@/screens/profile/screen/screen";
import CollectionsScreen from "@/screens/collections/screen/screen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { HomeScreen } from "@/screens/home/screen/screen";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomUploadButton from "../ui/button/uploadButton";
import ClothesScreen from "@/screens/clothes/screen/screen";

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  const navigation = useNavigation();

  const handleUploadPress = () => {
    navigation.navigate("Camera" as never);
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Clothes") {
            iconName = focused ? "shirt" : "shirt-outline";
          } else if (route.name === "Upload") {
            return null;
          } else if (route.name === "Collections") {
            iconName = focused ? "albums" : "albums-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else {
            iconName = "ellipse-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#083D57",
        tabBarInactiveTintColor: "#737373",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb",
          height: 80,
          paddingTop: 8,
          paddingBottom: 20,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: "Home" }}
      />
      <Tab.Screen
        name="Collections"
        component={CollectionsScreen}
        options={{ tabBarLabel: "Collections" }}
      />
      <Tab.Screen
        name="Upload"
        component={CameraScreen}
        options={{
          tabBarLabel: "Upload",
          tabBarButton: () => (
            <View className="-top-10 justify-center items-center">
              <CustomUploadButton onPress={handleUploadPress} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Clothes"
        component={ClothesScreen}
        options={{ tabBarLabel: "Clothes" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: "Profile" }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
