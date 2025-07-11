import { BASE_URL } from "@/config";
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

export const UpdateProfilePicture = async (
  token: string,
  formData: FormData
) => {
  const { data } = await axios.post("/file/upload", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};
