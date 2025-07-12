import * as yup from "yup";

const transformEmptyStringToNull = (value: any, originalValue: any) => {
  return originalValue === "" ? null : value;
};

export const updateBodyProfileSchema = yup.object().shape({
  height: yup
    .number()
    .transform(transformEmptyStringToNull)
    .positive("Value must be positive")
    .nullable(),
  weight: yup
    .number()
    .transform(transformEmptyStringToNull)
    .positive("Value must be positive")
    .nullable(),
  chestCircumference: yup
    .number()
    .transform(transformEmptyStringToNull)
    .positive("Value must be positive")
    .nullable(),
  waistCircumference: yup
    .number()
    .transform(transformEmptyStringToNull)
    .positive("Value must be positive")
    .nullable(),
  hipCircumference: yup
    .number()
    .transform(transformEmptyStringToNull)
    .positive("Value must be positive")
    .nullable(),
  shoulderWidth: yup
    .number()
    .transform(transformEmptyStringToNull)
    .positive("Value must be positive")
    .nullable(),
  armLength: yup
    .number()
    .transform(transformEmptyStringToNull)
    .positive("Value must be positive")
    .nullable(),
  legLength: yup
    .number()
    .transform(transformEmptyStringToNull)
    .positive("Value must be positive")
    .nullable(),
});
