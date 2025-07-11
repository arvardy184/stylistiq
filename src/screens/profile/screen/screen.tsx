import { useState } from "react";
import { useGetProfileUser } from "@/services/queries/user/profile";
import { useAuthStore } from "@/store/auth/authStore";
import { View, Text, ScrollView, Image, StatusBar, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Gender } from "@/common/enums/gender";
import ConfirmationModal from "@/components/ui/modal/ConfirmationModal";
import LoadingContent from "@/components/ui/loading/LoadingContent";
import ProfileInfoRow from "../components/ProfileInfoRow";
import MeasurementGridItem from "../components/MeasurementGridItem";
import ProfileActionRow from "../components/ProfileActionRow";
import StatItem from "../components/StatItem";

const ProfileScreen = () => {
  const { token, clearToken } = useAuthStore();
  const { data: userProfile, isLoading, isError } = useGetProfileUser(token);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);

  if (isLoading) {
    return <LoadingContent />;
  }

  if (isError || !userProfile) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-100 p-4">
        <Feather name="alert-triangle" size={48} color="#B2236F" />
        <Text className="mt-4 text-center text-lg text-gray-800">
          Failed to load profile.
        </Text>
      </SafeAreaView>
    );
  }

  const handleLogout = () => setLogoutModalVisible(true);

  const onConfirmLogout = () => {
    setLogoutModalVisible(false);
    clearToken();
  };

  const formatBirthday = (date?: Date) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const bodyProfile = userProfile.bodyProfile;

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-primary">
      <SafeAreaView
        edges={["left", "right", "bottom"]}
        className="flex-1 bg-gray-100"
      >
        <StatusBar barStyle="light-content" />
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          <View className="bg-primary items-center p-6 pb-8 rounded-b-3xl">
            {userProfile.profilePhoto ? (
              <Image
                source={{ uri: userProfile.profilePhoto }}
                className="h-28 w-28 rounded-full border-4 border-white"
              />
            ) : (
              <View className="h-28 w-28 items-center justify-center rounded-full bg-white/30 border-4 border-white">
                <Feather name="user" size={60} color="white" />
              </View>
            )}
            <Text className="mt-4 text-2xl font-bold text-white">
              {userProfile.name || "User"}
            </Text>
            <Text className="text-base text-white/80">{userProfile.email}</Text>
          </View>
          <View className="flex-row justify-around bg-white mx-4 -mt-6 p-4 rounded-xl shadow-md">
            <StatItem count={userProfile.clothesCount || 0} label="Outfits" />
            <StatItem
              count={userProfile.collectionsCount || 0}
              label="Collections"
            />
            <StatItem
              count={userProfile.schedulesCount || 0}
              label="Schedules"
            />
          </View>

          <View className="px-4">
            <View className="mt-6 rounded-xl bg-white p-4 shadow-sm">
              <Text className="text-lg font-semibold text-gray-800 mb-4">
                Personal Information
              </Text>
              <ProfileInfoRow
                icon="gift"
                label="Birthday"
                value={formatBirthday(userProfile.birthday)}
              />
              <ProfileInfoRow
                icon="hash"
                label="Age"
                value={userProfile.age ? `${userProfile.age} years` : "Not set"}
              />
              <ProfileInfoRow
                icon="users"
                label="Gender"
                value={
                  userProfile.gender
                    ? userProfile.gender === Gender.MALE
                      ? "Male"
                      : "Female"
                    : "Not set"
                }
                isLast
              />
            </View>
            <View className="mt-6 rounded-xl bg-white p-4 shadow-sm">
              <Text className="text-lg font-semibold text-gray-800 mb-2">
                Body Profile
              </Text>
              <View className="flex-row flex-wrap justify-between mt-2">
                <MeasurementGridItem
                  label="Height"
                  value={bodyProfile?.height}
                  unit="cm"
                />
                <MeasurementGridItem
                  label="Weight"
                  value={bodyProfile?.weight}
                  unit="kg"
                />
                <MeasurementGridItem
                  label="Chest Circ."
                  value={bodyProfile?.chestCircumference}
                  unit="cm"
                />
                <MeasurementGridItem
                  label="Waist Circ."
                  value={bodyProfile?.waistCircumference}
                  unit="cm"
                />
                <MeasurementGridItem
                  label="Hip Circ."
                  value={bodyProfile?.hipCircumference}
                  unit="cm"
                />
                <MeasurementGridItem
                  label="Shoulder Width"
                  value={bodyProfile?.shoulderWidth}
                  unit="cm"
                />
                <MeasurementGridItem
                  label="Arm Length"
                  value={bodyProfile?.armLength}
                  unit="cm"
                />
                <MeasurementGridItem
                  label="Leg Length"
                  value={bodyProfile?.legLength}
                  unit="cm"
                />
              </View>
            </View>
            <View className="mt-6 rounded-xl bg-white shadow-sm">
              <ProfileActionRow
                icon="edit"
                label="Edit Profile"
                onPress={() =>
                  Alert.alert("Navigation", "Navigate to Edit Profile screen")
                }
              />
              <ProfileActionRow
                icon="log-out"
                label="Log Out"
                color="text-red-500"
                onPress={handleLogout}
                isLast
              />
            </View>
          </View>
        </ScrollView>

        <ConfirmationModal
          visible={isLogoutModalVisible}
          onClose={() => setLogoutModalVisible(false)}
          onConfirm={onConfirmLogout}
          title="Confirm Logout"
          message="Are you sure you want to log out of your account?"
          icon="log-out"
          confirmText="Yes, Log Out"
          cancelText="Cancel"
          confirmButtonVariant="destructive"
        />
      </SafeAreaView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
