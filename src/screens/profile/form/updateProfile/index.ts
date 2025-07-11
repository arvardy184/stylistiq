import { Gender } from "@/common/enums/gender";

export interface UpdateProfileFormData {
  gender: Gender;
  birthday: Date;
  name: string;
}
