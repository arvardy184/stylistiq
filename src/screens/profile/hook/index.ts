import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import mime from "mime";
import { useAuthStore } from "@/store/auth/authStore";
import { useGetProfileUser } from "@/services/queries/user/getProfile";
import { useUpdateProfile } from "@/services/queries/user/updateProfile";
import { useUpdateProfilePicture } from "@/services/queries/user/photoProfile";
import { UpdateProfileFormData } from "../form/updateProfile";
import { updateProfileSchema } from "@/schemas/user/updateProfile";
import { UpdateBodyProfileFormData } from "../form/updateBodyProfile";
import { updateBodyProfileSchema } from "@/schemas/user/updateBodyProfile";
import { useUpdateBodyProfile } from "@/services/queries/user/updateBodyProfile";

export const useProfileScreen = () => {
  const { token, clearToken } = useAuthStore();
  const navigation = useNavigation();
  const { data: userProfile, isLoading, isError } = useGetProfileUser(token);

  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  const [isImagePickerVisible, setImagePickerVisible] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingBody, setIsEditingBody] = useState(false);

  const { mutate: updateProfile, isPending: isUpdatingInfo } =
    useUpdateProfile(token);
  const { mutate: updatePhoto, isPending: isUploading } =
    useUpdateProfilePicture(token);
  const { mutate: updateBodyProfile, isPending: isUpdatingBody } =
    useUpdateBodyProfile(token);

  const {
    control: infoControl,
    handleSubmit: handleInfoSubmit,
    reset: resetInfoForm,
  } = useForm<UpdateProfileFormData>({
    resolver: yupResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      birthday: undefined,
      gender: undefined,
    },
  });

  const {
    control: bodyControl,
    handleSubmit: handleBodySubmit,
    reset: resetBodyForm,
  } = useForm<UpdateBodyProfileFormData>({
    resolver: yupResolver(updateBodyProfileSchema),
    defaultValues: {
      height: 0,
      weight: 0,
      chestCircumference: 0,
      waistCircumference: 0,
      hipCircumference: 0,
      shoulderWidth: 0,
      armLength: 0,
      legLength: 0,
    },
  });

  const getBodyProfileData = () => {
    if (!userProfile?.bodyProfile) {
      return {
        height: "",
        weight: "",
        chestCircumference: "",
        waistCircumference: "",
        hipCircumference: "",
        shoulderWidth: "",
        armLength: "",
        legLength: "",
      };
    }

    return {
      height: userProfile.bodyProfile.height?.toString() || "",
      weight: userProfile.bodyProfile.weight?.toString() || "",
      chestCircumference:
        userProfile.bodyProfile.chestCircumference?.toString() || "",
      waistCircumference:
        userProfile.bodyProfile.waistCircumference?.toString() || "",
      hipCircumference:
        userProfile.bodyProfile.hipCircumference?.toString() || "",
      shoulderWidth: userProfile.bodyProfile.shoulderWidth?.toString() || "",
      armLength: userProfile.bodyProfile.armLength?.toString() || "",
      legLength: userProfile.bodyProfile.legLength?.toString() || "",
    };
  };

  useEffect(() => {
    if (userProfile) {
      resetInfoForm({
        name: userProfile.name || "",
        birthday: userProfile.birthday
          ? new Date(userProfile.birthday)
          : undefined,
        gender: userProfile.gender || undefined,
      });

      resetBodyForm(getBodyProfileData());
    }
  }, [userProfile, resetInfoForm, resetBodyForm]);

  const handleEditInfoPress = () => {
    resetInfoForm({
      name: userProfile?.name || "",
      birthday: userProfile?.birthday
        ? new Date(userProfile.birthday)
        : undefined,
      gender: userProfile?.gender || undefined,
    });
    setIsEditingInfo(true);
  };

  const handleCancelEditInfo = () => setIsEditingInfo(false);

  const onInfoSubmit = (formData: UpdateProfileFormData) => {
    updateProfile(formData, {
      onSuccess: () => setIsEditingInfo(false),
    });
  };

  const handleEditBodyPress = () => {
    const bodyData = getBodyProfileData();
    resetBodyForm(bodyData);
    setIsEditingBody(true);
  };

  const handleChangePasswordPress = () => {
    navigation.navigate("ChangePassword");
  };

  const handleCancelEditBody = () => setIsEditingBody(false);

  const onBodySubmit = (formData: UpdateBodyProfileFormData) => {
    const numericData = Object.entries(formData).reduce((acc, [key, value]) => {
      if (value === "" || value === undefined || value === null) {
        acc[key] = null;
      } else {
        const numValue = Number(value);
        acc[key] = isNaN(numValue) ? null : numValue;
      }
      return acc;
    }, {} as any);

    updateBodyProfile(numericData, {
      onSuccess: () => setIsEditingBody(false),
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
        Toast.show({
          type: "error",
          text1: "Permission required",
          text2: `You need to grant permission to access the ${pickerFunction}`,
        });
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

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const formData = new FormData();
        formData.append("file", {
          uri: asset.uri,
          name: asset.fileName || `profile_${Date.now()}.jpg`,
          type:
            asset.mimeType ||
            mime.getType(asset.fileName || "") ||
            "image/jpeg",
        } as any);

        updatePhoto(formData);
      }
    } catch (error) {
      console.error("Error in handleImagePick:", error);
      Toast.show({
        type: "error",
        text1: "Image Picker Error",
        text2: "Something went wrong.",
      });
    }
  };

  const handleLogout = () => setLogoutModalVisible(true);

  const onConfirmLogout = () => {
    setLogoutModalVisible(false);
    clearToken();
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const formatBirthday = (date?: Date | string) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return {
    userProfile,
    isLoading,
    isError,
    isEditingInfo,
    isUpdatingInfo,
    infoControl,
    handleInfoSubmit,
    onInfoSubmit,
    handleEditInfoPress,
    handleCancelEditInfo,
    isEditingBody,
    isUpdatingBody,
    bodyControl,
    handleBodySubmit,
    onBodySubmit,
    handleEditBodyPress,
    handleCancelEditBody,
    isImagePickerVisible,
    setImagePickerVisible,
    isUploading,
    handleImagePick,
    isLogoutModalVisible,
    setLogoutModalVisible,
    handleLogout,
    onConfirmLogout,
    formatBirthday,
    handleChangePasswordPress,
  };
};
