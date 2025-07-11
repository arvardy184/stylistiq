import { Gender } from "@/common/enums/gender";

export interface UpdateDataFormData {
  gender: Gender;
  birthday: Date;
  name: string;
}
