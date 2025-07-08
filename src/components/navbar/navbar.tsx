import CameraScreen from "@/screens/camera/screen/screen";
import ProfileScreen from "@/screens/profile/screen/screen";
import CollectionsScreen from "@/screens/collections/screen/screen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { HomeScreen } from "@/screens/home/screen/screen";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomUploadButton from "../ui/button/uploadButton";
import ClothesScreen from "@/screens/clothes/screen/screen";

const Tab = createBottomTabNavigator();

const iconMap = {
  Home: { focused: "home", unfocused: "home-outline" },
  Collections: { focused: "albums", unfocused: "albums-outline" },
  Clothes: { focused: "shirt", unfocused: "shirt-outline" },
  Profile: { focused: "person", unfocused: "person-outline" },
};

const MainTabNavigator = () => {
  const navigation = useNavigation();

  const handleUploadPress = () => {
    navigation.navigate("Camera" as never);
  };

  return (
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

          const iconName = iconMap[name]
            ? focused
              ? iconMap[name].focused
              : iconMap[name].unfocused
            : "ellipse-outline";

          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <Text className="text-xs font-medium" style={{ color }}>
              Home
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Clothes"
        component={ClothesScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <Text className="text-xs font-medium" style={{ color }}>
              Clothes
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Upload"
        component={CameraScreen}
        options={{
          tabBarButton: () => (
            <View className="-top-10 items-center">
              <CustomUploadButton onPress={handleUploadPress} />
              <Text
                className="text-xs font-medium mt-1"
                style={{ color: "#737373" }}
              >
                Upload
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Collections"
        component={CollectionsScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <Text className="text-xs font-medium" style={{ color }}>
              Collections
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <Text className="text-xs font-medium" style={{ color }}>
              Profile
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
