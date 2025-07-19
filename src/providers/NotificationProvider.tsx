import React from "react";
import { useNotification } from "@/hooks/useNotification";
import NotificationModal from "@/components/ui/modal/NotificationModal";

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const { notification, hideNotification } = useNotification();

  return (
    <>
      {children}
      <NotificationModal
        visible={notification.visible}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={hideNotification}
        autoClose={notification.autoClose}
        autoCloseDelay={notification.autoCloseDelay}
        actionText={notification.actionText}
        onAction={notification.onAction}
      />
    </>
  );
}; 