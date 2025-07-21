import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth/authStore";
import { useGetProfileUser } from "@/services/queries/user/getProfile";

export const useMainTabNavigator = () => {
  const navigation = useNavigation();
  const { token } = useAuthStore();
  const { data: userProfile, isLoading } = useGetProfileUser(token);
  const [isModalVisible, setModalVisible] = useState(false);

  const isProfileIncomplete =
    userProfile &&
    (!userProfile.birthday || !userProfile.age || !userProfile.name);

  useEffect(() => {
    if (!isLoading && isProfileIncomplete) {
      setModalVisible(true);
    }
  }, [isLoading, isProfileIncomplete]);

  const handleCompleteProfile = () => {
    setModalVisible(false);
    navigation.navigate("Profile" as never);
  };

  const handleUploadPress = () => {
    if (isProfileIncomplete) {
      setModalVisible(true);
    } else {
      navigation.navigate("Scan" as never);
    }
  };

  const protectedTabListener = {
    tabPress: (e: any) => {
      if (isProfileIncomplete) {
        e.preventDefault();
        setModalVisible(true);
      }
    },
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  return {
    isModalVisible,
    isProfileIncomplete,
    handleCompleteProfile,
    handleUploadPress,
    protectedTabListener,
    handleModalClose,
  };
};
