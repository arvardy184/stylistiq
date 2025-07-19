import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { HomeScreen } from "@/screens/home/screen/screen";
import ScanScreen from "@/screens/scan/screen/screen";
import ClothesScreen from "@/screens/clothes/screen/screen";
import CollectionsScreen from "@/screens/collections/screen/screen";
import ProfileScreen from "@/screens/profile/screen/screen";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { MainTabParamList } from "@/types";
const Tab = createBottomTabNavigator();

const CustomScanButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={styles.scanButton}
    onPress={onPress}
  >
    <View style={styles.scanButtonInner}>
      {children}
    </View>
  </TouchableOpacity>
);

const MainTabNavigator = () => {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Ionicons name={focused ? "home" : "home-outline"} size={24} color={focused ? '#EC4899' : '#748c94'} />
              <Text style={[styles.iconLabel, { color: focused ? '#EC4899' : '#748c94' }]}>Home</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="Clothes" 
        component={ClothesScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Ionicons name={focused ? "shirt" : "shirt-outline"} size={24} color={focused ? '#EC4899' : '#748c94'} />
              <Text style={[styles.iconLabel, { color: focused ? '#EC4899' : '#748c94' }]}>Clothes</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="Scan" 
        component={ScanScreen} 
        options={{
          tabBarIcon: () => <Ionicons name="scan" size={32} color="#fff" />,
          tabBarButton: (props) => (
            <CustomScanButton {...props} onPress={() => navigation.navigate("Scan")} />
          ),
        }}
      />
      <Tab.Screen 
        name="Collections" 
        component={CollectionsScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Ionicons name={focused ? "albums" : "albums-outline"} size={24} color={focused ? '#EC4899' : '#748c94'} />
              <Text style={[styles.iconLabel, { color: focused ? '#EC4899' : '#748c94' }]}>Collections</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Ionicons name={focused ? "person" : "person-outline"} size={24} color={focused ? '#EC4899' : '#748c94'} />
              <Text style={[styles.iconLabel, { color: focused ? '#EC4899' : '#748c94' }]}>Profile</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 80,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 5,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLabel: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
  scanButton: {
    top: -30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#EC4899',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#EC4899",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
});

export default MainTabNavigator;
