import { BASE_URL } from "@/config";
import { UpdateBodyProfileFormData } from "@/screens/profile/form/updateBodyProfile";
import { UpdateProfileFormData } from "@/screens/profile/form/updateProfile";
import axios from "axios";

export const Profile = async (token: string) => {
  const response = await axios.get(`${BASE_URL}/user/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};

export const UpdateProfile = async (
  token: string,
  data: UpdateProfileFormData
) => {
  const response = await axios.put(`${BASE_URL}/user`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};

export const UpdateBodyProfile = async (
  token: string,
  data: UpdateBodyProfileFormData
) => {
  const response = await axios.put(`${BASE_URL}/user/body-profile`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};

export const UpdateProfilePicture = async (token: string, file: FormData) => {
  const data = await axios.post(`${BASE_URL}/file/upload`, file, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};
