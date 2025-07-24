import { useState, useCallback } from "react";
import { NotificationModalProps } from "@/components/ui/modal/NotificationModal";

interface NotificationState {
  visible: boolean;
  type: NotificationModalProps["type"];
  title: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

const initialState: NotificationState = {
  visible: false,
  type: "info",
  title: "",
  message: "",
  autoClose: true,
  autoCloseDelay: 4000,
};

export const useNotification = () => {
  const [notification, setNotification] = useState<NotificationState>(initialState);

  const showNotification = useCallback((config: Omit<NotificationState, "visible">) => {
    setNotification({
      ...config,
      visible: true,
    });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, visible: false }));
  }, []);

  // Convenience methods for different types
  const showSuccess = useCallback((title: string, message?: string, options?: Partial<NotificationState>) => {
    showNotification({
      type: "success",
      title,
      message,
      ...options,
    });
  }, [showNotification]);

  const showError = useCallback((title: string, message?: string, options?: Partial<NotificationState>) => {
    showNotification({
      type: "error",
      title,
      message,
      ...options,
    });
  }, [showNotification]);

  const showWarning = useCallback((title: string, message?: string, options?: Partial<NotificationState>) => {
    showNotification({
      type: "warning",
      title,
      message,
      ...options,
    });
  }, [showNotification]);

  const showInfo = useCallback((title: string, message?: string, options?: Partial<NotificationState>) => {
    showNotification({
      type: "info",
      title,
      message,
      ...options,
    });
  }, [showNotification]);

  return {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}; 