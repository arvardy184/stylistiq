import { RouteProp } from "@react-navigation/native";

export type RootStackParamList = {
  ResetPassword: { email: string };
};

export type ResetPasswordScreenRouteProp = RouteProp<
  RootStackParamList,
  "ResetPassword"
>;
