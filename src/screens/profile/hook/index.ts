import { useState } from "react";
import { Alert } from "react-native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";
import { useAuthStore } from "@/store/auth/authStore";
import { useGetProfileUser } from "@/services/queries/user/getProfile";
import { useUpdateProfile } from "@/services/queries/user/updateProfile";
import { useUpdateProfilePicture } from "@/services/queries/user/photoProfile";
import { UpdateProfileFormData } from "../form/updateProfile";
import { updateProfileSchema } from "@/schemas/user/updateProfile";

export const useProfileScreen = () => {
  const { token, clearToken } = useAuthStore();
  const { data: userProfile, isLoading, isError } = useGetProfileUser(token);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isImagePickerVisible, setImagePickerVisible] = useState(false);

  const { mutate: updateProfile, isPending: isUpdating } =
    useUpdateProfile(token);
  const { mutate: updatePhoto, isPending: isUploading } =
    useUpdateProfilePicture(token);

  const { control, handleSubmit, reset } = useForm<UpdateProfileFormData>({
    resolver: yupResolver(updateProfileSchema),
    defaultValues: {
      name: userProfile?.name || "",
      birthday: userProfile?.birthday
        ? new Date(userProfile.birthday)
        : undefined,
      gender: userProfile?.gender || undefined,
    },
  });

  const handleEditPress = () => {
    reset({
      name: userProfile?.name || "",
      birthday: userProfile?.birthday
        ? new Date(userProfile.birthday)
        : undefined,
      gender: userProfile?.gender || undefined,
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    reset();
  };

  const onSubmit = (formData: UpdateProfileFormData) => {
    updateProfile(formData, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  const handleImagePick = async (pickerFunction: "camera" | "gallery") => {
    try {
      setImagePickerVisible(false);
      const permission =
        pickerFunction === "camera"
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permission.status !== "granted") {
        Alert.alert(
          "Permission required",
          `You need to grant permission to access the ${pickerFunction}`
        );
        return;
      }

      const result =
        pickerFunction === "camera"
          ? await ImagePicker.launchCameraAsync({
              quality: 0.7,
              allowsEditing: true,
              aspect: [1, 1],
            })
          : await ImagePicker.launchImageLibraryAsync({
              quality: 0.7,
              allowsEditing: true,
              aspect: [1, 1],
            });

      console.log("Image picker result:", result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        console.log("Selected asset:", asset);

        const formData = new FormData();

        formData.append("file", {
          uri: asset.uri,
          type: asset.type || "image/jpeg",
          name: asset.fileName || `profile_${Date.now()}.jpg`,
        } as any);

        console.log("Uploading image...");

        updatePhoto(formData, {
          onSuccess: (data) => {
            console.log("Upload successful:", data);
            Alert.alert("Success", "Profile picture updated successfully!");
          },
          onError: (error) => {
            console.error("Upload failed:", error);
            Alert.alert(
              "Error",
              "Failed to update profile picture. Please try again."
            );
          },
        });
      } else {
        console.log("Image selection cancelled");
      }
    } catch (error) {
      console.error("Error in handleImagePick:", error);
      Alert.alert("Error", "Something went wrong while picking the image.");
    }
  };

  const handleLogout = () => setLogoutModalVisible(true);

  const onConfirmLogout = () => {
    setLogoutModalVisible(false);
    clearToken();
  };

  const formatBirthday = (date?: Date | string) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleBodyProfileEdit = () => {
    Alert.alert("Navigate", "Go to Edit Body Profile");
  };

  return {
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
  };
};
