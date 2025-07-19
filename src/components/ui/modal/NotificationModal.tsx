import React, { useEffect, useRef } from "react";
import { View, Text, Modal, TouchableOpacity, Animated, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface NotificationModalProps {
  visible: boolean;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
  actionText?: string;
  onAction?: () => void;
}

const { width } = Dimensions.get("window");

const NotificationModal: React.FC<NotificationModalProps> = ({
  visible,
  type,
  title,
  message,
  onClose,
  autoClose = true,
  autoCloseDelay = 4000,
  actionText,
  onAction,
}) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto close timer
      if (autoClose) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoCloseDelay);

        return () => clearTimeout(timer);
      }
    }
  }, [visible]);

  const handleClose = () => {
    // Hide animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const getIconName = () => {
    switch (type) {
      case "success":
        return "checkmark-circle";
      case "error":
        return "close-circle";
      case "warning":
        return "warning";
      case "info":
      default:
        return "information-circle";
    }
  };

  const getColors = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-500",
          icon: "#10B981",
          border: "border-green-200",
        };
      case "error":
        return {
          bg: "bg-red-500",
          icon: "#EF4444",
          border: "border-red-200",
        };
      case "warning":
        return {
          bg: "bg-yellow-500",
          icon: "#F59E0B",
          border: "border-yellow-200",
        };
      case "info":
      default:
        return {
          bg: "bg-blue-500",
          icon: "#3B82F6",
          border: "border-blue-200",
        };
    }
  };

  const colors = getColors();

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <View className="flex-1">
        <Animated.View
          style={{
            transform: [{ translateY: slideAnim }],
            opacity: opacityAnim,
            position: "absolute",
            top: 0,
            left: 16,
            right: 16,
            zIndex: 9999,
          }}
          className={`bg-white rounded-2xl shadow-lg shadow-black/20 border ${colors.border} overflow-hidden`}
        >
          {/* Color bar */}
          <View className={`h-1 ${colors.bg}`} />
          
          <View className="p-4">
            <View className="flex-row items-start">
              <View className="mr-3 mt-0.5">
                <Ionicons name={getIconName()} size={24} color={colors.icon} />
              </View>
              
              <View className="flex-1">
                <Text className="text-gray-900 font-semibold text-base leading-5">
                  {title}
                </Text>
                {message && (
                  <Text className="text-gray-600 text-sm mt-1 leading-4">
                    {message}
                  </Text>
                )}
                
                {/* Action button and close button row */}
                <View className="flex-row items-center justify-end mt-3 -mb-1">
                  {actionText && onAction && (
                    <TouchableOpacity
                      onPress={() => {
                        onAction();
                        handleClose();
                      }}
                      className={`${colors.bg} px-4 py-2 rounded-lg mr-2`}
                    >
                      <Text className="text-white font-medium text-sm">
                        {actionText}
                      </Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity
                    onPress={handleClose}
                    className="px-3 py-2"
                  >
                    <Text className="text-gray-500 font-medium text-sm">
                      Close
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default NotificationModal; 