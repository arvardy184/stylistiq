import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Konfigurasi behavior notifikasi
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface ScheduleData {
  id: string;
  date: string;
  note?: string;
  reminder: string;
  clothes: Array<{
    id: string;
    itemType: string;
    color: string;
    category: string;
  }>;
}

export interface NotificationItem {
  id: string;
  key: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  scheduleId?: string;
  type: "schedule_reminder" | "general";
}

class NotificationService {
  private readonly STORAGE_KEY = "@notifications_history";

  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        console.log("🔔 [NOTIFICATION] Permission status:", status);
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("❌ [NOTIFICATION] Permission not granted");
        return false;
      }

      // Set notification channel for Android
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("schedule-reminders", {
          name: "Schedule Reminders",
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#8B5CF6",
        });
      }

      console.log("✅ [NOTIFICATION] Permission granted");
      return true;
    } catch (error) {
      console.error("❌ [NOTIFICATION] Error requesting permissions:", error);
      return false;
    }
  }

  /**
   * Save notification to storage
   */
  private async saveNotificationToHistory(
    notification: NotificationItem
  ): Promise<void> {
    try {
      const existingNotifications = await this.getNotificationHistory();
      const updatedNotifications = [notification, ...existingNotifications];

      // Keep only last 100 notifications to prevent storage bloat
      const limitedNotifications = updatedNotifications.slice(0, 100);

      await AsyncStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(limitedNotifications)
      );
      console.log("✅ [NOTIFICATION] Saved to history:", notification.id);
    } catch (error) {
      console.error("❌ [NOTIFICATION] Error saving to history:", error);
    }
  }

  /**
   * Get notification history from storage
   */
  async getNotificationHistory(): Promise<NotificationItem[]> {
    try {
      const stored = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];

      const notifications = JSON.parse(stored);
      // Convert timestamp strings back to Date objects
      return notifications.map((notif: any) => ({
        ...notif,
        timestamp: new Date(notif.timestamp),
      }));
    } catch (error) {
      console.error("❌ [NOTIFICATION] Error getting history:", error);
      return [];
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const notifications = await this.getNotificationHistory();
      const updatedNotifications = notifications.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      );

      await AsyncStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(updatedNotifications)
      );
      console.log("✅ [NOTIFICATION] Marked as read:", notificationId);
    } catch (error) {
      console.error("❌ [NOTIFICATION] Error marking as read:", error);
    }
  }

  /**
   * Clear all notification history
   */
  async clearNotificationHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEY);
      console.log("✅ [NOTIFICATION] Cleared notification history");
    } catch (error) {
      console.error("❌ [NOTIFICATION] Error clearing history:", error);
    }
  }

  /**
   * Schedule notification untuk schedule tertentu
   */
  async scheduleNotification(
    scheduleData: ScheduleData
  ): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.log("❌ [NOTIFICATION] No permission to schedule notification");
        return null;
      }

      // Parse reminder time
      const reminderDate = new Date(scheduleData.reminder);
      const now = new Date();

      // Check if reminder time is in the future
      if (reminderDate <= now) {
        console.log(
          "⚠️ [NOTIFICATION] Reminder time is in the past, skipping notification"
        );
        return null;
      }

      // Generate notification content
      const clothesCount = scheduleData.clothes.length;
      const clothesSummary = scheduleData.clothes
        .slice(0, 2)
        .map((item) => `${item.itemType} ${item.color}`)
        .join(", ");

      const title = "👔 Outfit Reminder";
      const body =
        clothesCount > 0
          ? `Time to wear your ${clothesSummary}${
              clothesCount > 2 ? ` and ${clothesCount - 2} more items` : ""
            }!`
          : `Don't forget your scheduled outfit for today!`;

      const subtitle = scheduleData.note || "Your outfit is ready";

      // Schedule the notification
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          subtitle,
          data: {
            scheduleId: scheduleData.id,
            type: "schedule_reminder",
            scheduleDate: scheduleData.date,
          },
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: reminderDate,
        },
        identifier: `schedule_${scheduleData.id}`,
      });

      console.log("✅ [NOTIFICATION] Scheduled notification:", {
        notificationId,
        scheduleId: scheduleData.id,
        reminderTime: reminderDate.toISOString(),
        title,
        body,
      });

      return notificationId;
    } catch (error) {
      console.error("❌ [NOTIFICATION] Error scheduling notification:", error);
      return null;
    }
  }

  /**
   * Cancel notification untuk schedule tertentu
   */
  async cancelScheduleNotification(scheduleId: string): Promise<boolean> {
    try {
      const identifier = `schedule_${scheduleId}`;
      await Notifications.cancelScheduledNotificationAsync(identifier);

      console.log(
        "✅ [NOTIFICATION] Cancelled notification for schedule:",
        scheduleId
      );
      return true;
    } catch (error) {
      console.error("❌ [NOTIFICATION] Error cancelling notification:", error);
      return false;
    }
  }

  /**
   * Update notification (cancel old + schedule new)
   */
  async updateScheduleNotification(
    scheduleData: ScheduleData
  ): Promise<string | null> {
    try {
      // Cancel existing notification
      await this.cancelScheduleNotification(scheduleData.id);

      // Schedule new notification
      const notificationId = await this.scheduleNotification(scheduleData);

      console.log(
        "✅ [NOTIFICATION] Updated notification for schedule:",
        scheduleData.id
      );
      return notificationId;
    } catch (error) {
      console.error("❌ [NOTIFICATION] Error updating notification:", error);
      return null;
    }
  }

  /**
   * Get all scheduled notifications (untuk debugging)
   */
  async getAllScheduledNotifications() {
    try {
      const notifications =
        await Notifications.getAllScheduledNotificationsAsync();
      console.log(
        "📋 [NOTIFICATION] All scheduled notifications:",
        notifications.length
      );
      return notifications;
    } catch (error) {
      console.error(
        "❌ [NOTIFICATION] Error getting scheduled notifications:",
        error
      );
      return [];
    }
  }

  /**
   * Cancel all notifications
   */
  async cancelAllNotifications(): Promise<boolean> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log("✅ [NOTIFICATION] Cancelled all notifications");
      return true;
    } catch (error) {
      console.error(
        "❌ [NOTIFICATION] Error cancelling all notifications:",
        error
      );
      return false;
    }
  }

  /**
   * Handle notification received (untuk navigation)
   */
  setupNotificationHandlers(navigateToSchedule: (scheduleId: string) => void) {
    // Handle notification tap when app is foreground
    const foregroundSubscription =
      Notifications.addNotificationReceivedListener(async (notification) => {
        console.log(
          "📱 [NOTIFICATION] Received in foreground:",
          notification.request.content.title
        );

        // Save notification to history when received
        const notificationItem: NotificationItem = {
          id: notification.request.identifier,
          title: notification.request.content.title || "Notification",
          message: notification.request.content.body || "",
          timestamp: new Date(),
          read: false,
          scheduleId: notification.request.content.data?.scheduleId as string,
          type:
            (notification.request.content.data?.type as "schedule_reminder") ||
            "general",
        };

        await this.saveNotificationToHistory(notificationItem);
      });

    // Handle notification tap when app is background/terminated
    const backgroundSubscription =
      Notifications.addNotificationResponseReceivedListener(
        async (response) => {
          const data = response.notification.request.content.data;
          console.log("🔔 [NOTIFICATION] User tapped notification:", data);

          // Save notification to history if not already saved
          const notificationItem: NotificationItem = {
            id: response.notification.request.identifier,
            title:
              response.notification.request.content.title || "Notification",
            message: response.notification.request.content.body || "",
            timestamp: new Date(),
            read: true, // Mark as read since user tapped it
            scheduleId: data?.scheduleId as string,
            type: (data?.type as "schedule_reminder") || "general",
          };

          await this.saveNotificationToHistory(notificationItem);

          if (data?.type === "schedule_reminder" && data?.scheduleId) {
            navigateToSchedule(data.scheduleId as string);
          }
        }
      );

    return {
      foregroundSubscription,
      backgroundSubscription,
    };
  }
}

export const notificationService = new NotificationService();
export default notificationService;
