import {
  View,
  Text,
  ScrollView,
  Image,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Gender } from "@/common/enums/gender";
import LoadingContent from "@/components/ui/loading/LoadingContent";
import ConfirmationModal from "@/components/ui/modal/ConfirmationModal";
import ControlledTextInput from "../components/ControlledTextInput";
import ControlledDatePicker from "../components/ControlledDatePicker";
import ControlledDropdown from "../components/ControlledDropdown";
import ProfileActionRow from "../components/ProfileActionRow";
import MeasurementGridItem from "../components/MeasurementGridItem";
import CardHeader from "../components/CardHeader";
import ProfileInfoRow from "../components/ProfileInfoRow";
import StatItem from "../components/StatItem";
import ImagePickerActionSheet from "../components/ImagePickerActionSheet";
import { useProfileScreen } from "../hook";

const ProfileScreen = () => {
  const {
    userProfile,
    isLoading,
    isError,
    isLogoutModalVisible,
    setLogoutModalVisible,
    isEditing,
    isImagePickerVisible,
    setImagePickerVisible,
    isUpdating,
    isUploading,
    control,
    handleSubmit,
    handleEditPress,
    handleCancelEdit,
    onSubmit,
    handleImagePick,
    handleLogout,
    onConfirmLogout,
    formatBirthday,
    handleBodyProfileEdit,
  } = useProfileScreen();

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

  const bodyProfile = userProfile.bodyProfile;

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-primary">
      <SafeAreaView
        edges={["left", "right", "bottom"]}
        className="flex-1 bg-gray-100"
      >
        <StatusBar barStyle="light-content" />
        <ScrollView
          contentContainerStyle={{ paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="bg-primary items-center p-6 pb-8 rounded-b-3xl">
            <TouchableOpacity
              onPress={() => setImagePickerVisible(true)}
              disabled={isUploading}
            >
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
              <View className="absolute bottom-0 right-0 bg-white p-2 rounded-full border-2 border-primary">
                {isUploading ? (
                  <ActivityIndicator size="small" color="#B2236F" />
                ) : (
                  <Feather name="camera" size={20} color="#B2236F" />
                )}
              </View>
            </TouchableOpacity>
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
              {!isEditing ? (
                <>
                  <CardHeader
                    title="Personal Information"
                    onEditPress={handleEditPress}
                  />
                  <ProfileInfoRow
                    icon="user"
                    label="Name"
                    value={userProfile.name || "Not set"}
                  />
                  <ProfileInfoRow
                    icon="gift"
                    label="Birthday"
                    value={formatBirthday(userProfile.birthday)}
                  />
                  <ProfileInfoRow
                    icon="hash"
                    label="Age"
                    value={
                      userProfile.age ? `${userProfile.age} years` : "Not set"
                    }
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
                </>
              ) : (
                <>
                  <Text className="text-lg font-semibold text-gray-800 mb-4">
                    Edit Personal Information
                  </Text>
                  <ControlledTextInput
                    control={control}
                    name="name"
                    label="Full Name"
                    placeholder="Enter your name"
                  />
                  <ControlledDatePicker
                    control={control}
                    name="birthday"
                    label="Birthday"
                  />
                  <ControlledDropdown
                    control={control}
                    name="gender"
                    label="Gender"
                    items={[
                      { label: "Male", value: Gender.MALE },
                      { label: "Female", value: Gender.FEMALE },
                    ]}
                  />
                  <View className="flex-row mt-4 gap-3">
                    <TouchableOpacity
                      onPress={handleCancelEdit}
                      className="flex-1 py-3 bg-gray-200 rounded-lg items-center"
                    >
                      <Text className="font-semibold text-gray-700">
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleSubmit(onSubmit)}
                      disabled={isUpdating}
                      className="flex-1 py-3 bg-primary rounded-lg items-center"
                    >
                      <Text className="font-semibold text-white">
                        {isUpdating ? "Saving..." : "Save Changes"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
            <View className="mt-6 rounded-xl bg-white p-4 shadow-sm">
              <CardHeader
                title="Body Profile"
                onEditPress={handleBodyProfileEdit}
              />
              <View className="flex-row flex-wrap justify-between">
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
                icon="log-out"
                label="Log Out"
                color="text-red-500"
                onPress={handleLogout}
                isLast
              />
            </View>
          </View>
        </ScrollView>

        <ImagePickerActionSheet
          visible={isImagePickerVisible}
          onClose={() => setImagePickerVisible(false)}
          onLaunchCamera={() => handleImagePick("camera")}
          onLaunchGallery={() => handleImagePick("gallery")}
        />
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
