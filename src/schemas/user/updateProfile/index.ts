import * as yup from "yup";
import { Gender } from "@/common/enums/gender";

export const updateProfileSchema = yup.object().shape({
  name: yup.string().optional(),
  birthday: yup.date().optional(),
  gender: yup
    .mixed<Gender>()
    .oneOf(Object.values(Gender), "Invalid gender value")
    .optional(),
});
