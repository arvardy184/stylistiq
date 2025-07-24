import React, { useState, useEffect, useCallback } from "react";
import { StatusBar } from "react-native";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  notificationService,
  NotificationItem,
} from "@/services/notifications";

type NotificationCardProps = {
  item: NotificationItem;
  onPress: (item: NotificationItem) => void;
};

const NotificationCard = ({ item, onPress }: NotificationCardProps) => {
  const { title, message, timestamp, read } = item;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      className="flex-row bg-white rounded-lg shadow-sm mb-3 overflow-hidden border border-gray-100"
    >
      <View className="w-1.5 bg-primary" />
      <View className="flex-1 p-4">
        <Text
          className={`text-base font-bold ${
            read ? "text-gray-600" : "text-gray-800"
          }`}
        >
          {title}
        </Text>
        <Text
          className={`text-sm mt-1 ${read ? "text-gray-400" : "text-gray-500"}`}
        >
          {message}
        </Text>
        <Text className="text-xs text-gray-400 mt-2">
          {`${formatDate(timestamp)} at ${formatTime(timestamp)}`}
        </Text>
      </View>
      {!read && (
        <View className="w-2.5 h-2.5 bg-primary rounded-full absolute top-4 right-4" />
      )}
    </TouchableOpacity>
  );
};

const groupNotificationsByDay = (notifications: NotificationItem[]) => {
  const groups: { [key: string]: NotificationItem[] } = {};

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  notifications.forEach((notif) => {
    const notifDate = new Date(notif.timestamp);

    if (notifDate.toDateString() === today.toDateString()) {
      if (!groups["Today"]) groups["Today"] = [];
      groups["Today"].push(notif);
    } else if (notifDate.toDateString() === yesterday.toDateString()) {
      if (!groups["Yesterday"]) groups["Yesterday"] = [];
      groups["Yesterday"].push(notif);
    } else {
      const dayKey = notifDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!groups[dayKey]) groups[dayKey] = [];
      groups[dayKey].push(notif);
    }
  });

  return groups;
};

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const notificationHistory =
        await notificationService.getNotificationHistory();

      // Remove duplicates based on ID and ensure unique keys
      const uniqueNotifications = notificationHistory.filter(
        (notification, index, self) =>
          self.findIndex((n) => n.id === notification.id) === index
      );

      setNotifications(uniqueNotifications);
      console.log(
        "📱 [SCREEN] Loaded notifications:",
        uniqueNotifications.length
      );
    } catch (error) {
      console.error("❌ [SCREEN] Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handleNotificationPress = async (item: NotificationItem) => {
    try {
      // Mark notification as read if not already read
      if (!item.read) {
        await notificationService.markAsRead(item.id);
        // Update local state
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === item.id ? { ...notif, read: true } : notif
          )
        );
      }

      if (item.type === "schedule_reminder" && item.scheduleId) {
        console.log("🔔 [SCREEN] Navigate to schedule:", item.scheduleId);
      }
    } catch (error) {
      console.error("❌ [SCREEN] Error handling notification press:", error);
    }
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear All Notifications",
      "Are you sure you want to clear all notification history?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            try {
              await notificationService.clearNotificationHistory();
              setNotifications([]);
              console.log("✅ [SCREEN] Cleared all notifications");
            } catch (error) {
              console.error("❌ [SCREEN] Error clearing notifications:", error);
            }
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [])
  );

  useEffect(() => {
    loadNotifications();
  }, []);

  const groupedNotifications = groupNotificationsByDay(notifications);
  const hasNotifications = Object.keys(groupedNotifications).length > 0;

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-gray-500">Loading notifications...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar backgroundColor="#B2236F" barStyle="light-content" />

      {/* Header with clear all button */}
      {hasNotifications && (
        <View className="px-4 pt-4 pb-2 bg-gray-50">
          <TouchableOpacity
            onPress={handleClearAll}
            className="self-end bg-red-100 px-3 py-1 rounded-full"
          >
            <Text className="text-red-600 text-sm font-medium">Clear All</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {hasNotifications ? (
          Object.entries(groupedNotifications).map(
            ([day, dayNotifications]) => (
              <View key={day} className="mb-4">
                <Text className="text-lg font-bold text-gray-700 mb-3">
                  {day}
                </Text>
                {dayNotifications.map((item, index) => (
                  <NotificationCard
                    key={`${item.id}-${index}`}
                    item={item}
                    onPress={handleNotificationPress}
                  />
                ))}
              </View>
            )
          )
        ) : (
          <View className="flex-1 justify-center items-center mt-20">
            <Text className="text-gray-400 text-center">
              No notifications yet.{"\n"}
              Schedule reminders will appear here.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default NotificationScreen;
