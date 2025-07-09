import React from "react";
import { BaseToast, ErrorToast } from "react-native-toast-message";

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#B2236F", backgroundColor: "#FFF" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "bold",
        color: "#B2236F",
      }}
      text2Style={{
        fontSize: 14,
        color: "#4B5563",
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: "#B2236F", backgroundColor: "#FFF0F3" }}
      text1Style={{
        fontSize: 16,
        fontWeight: "bold",
        color: "#B2236F",
      }}
      text2Style={{
        fontSize: 14,
        color: "#4B5563",
      }}
    />
  ),
};
