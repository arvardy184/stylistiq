import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Konfigurasi behavior notifikasi
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    // shouldShowAlert: true, deprecated katanya 
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

class NotificationService {
  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          console.log('🔔 [NOTIFICATION] Permission status:', status);
          finalStatus = status;
        }

        if (finalStatus !== 'granted') {
          console.log('❌ [NOTIFICATION] Permission not granted');
          return false;
        }

        // Set notification channel for Android
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('schedule-reminders', {
            name: 'Schedule Reminders',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#8B5CF6',
          });
        }

        console.log('✅ [NOTIFICATION] Permission granted');
        return true;
    } catch (error) {
      console.error('❌ [NOTIFICATION] Error requesting permissions:', error);
      return false;
    }
  }

  /**
   * Schedule notification untuk schedule tertentu
   */
  async scheduleNotification(scheduleData: ScheduleData): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        //lakukan request permission
        console.log('❌ [NOTIFICATION] No permission to schedule notification');
        return null;
      }

      // Parse reminder time
      const reminderDate = new Date(scheduleData.reminder);
      const now = new Date();

      // Check if reminder time is in the future
      if (reminderDate <= now) {
        console.log('⚠️ [NOTIFICATION] Reminder time is in the past, skipping notification');
        return null;
      }

      // Generate notification content
      const clothesCount = scheduleData.clothes.length;
      const clothesSummary = scheduleData.clothes
        .slice(0, 2)
        .map(item => `${item.itemType} ${item.color}`)
        .join(', ');
      
      const title = '👔 Outfit Reminder';
      const body = clothesCount > 0 
        ? `Time to wear your ${clothesSummary}${clothesCount > 2 ? ` and ${clothesCount - 2} more items` : ''}!`
        : `Don't forget your scheduled outfit for today!`;
      
      const subtitle = scheduleData.note || 'Your outfit is ready';

      // Schedule the notification
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          subtitle,
          data: {
            scheduleId: scheduleData.id,
            type: 'schedule_reminder',
            scheduleDate: scheduleData.date,
          },
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: reminderDate,
        },
        identifier: `schedule_${scheduleData.id}`, //unique
      });

      console.log('✅ [NOTIFICATION] Scheduled notification:', {
        notificationId,
        scheduleId: scheduleData.id,
        reminderTime: reminderDate.toISOString(),
        title,
        body,
      });

      return notificationId;
    } catch (error) {
      console.error('❌ [NOTIFICATION] Error scheduling notification:', error);
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
      
      console.log('✅ [NOTIFICATION] Cancelled notification for schedule:', scheduleId);
      return true;
    } catch (error) {
      console.error('❌ [NOTIFICATION] Error cancelling notification:', error);
      return false;
    }
  }

  /**
   * Update notification (cancel old + schedule new)
   */
  async updateScheduleNotification(scheduleData: ScheduleData): Promise<string | null> {
    try {
      // Cancel existing notification
      await this.cancelScheduleNotification(scheduleData.id);
      
      // Schedule new notification
      const notificationId = await this.scheduleNotification(scheduleData);
      
      console.log('✅ [NOTIFICATION] Updated notification for schedule:', scheduleData.id);
      return notificationId;
    } catch (error) {
      console.error('❌ [NOTIFICATION] Error updating notification:', error);
      return null;
    }
  }

  /**
   * Get all scheduled notifications (untuk debugging)
   */
  async getAllScheduledNotifications() {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      console.log('📋 [NOTIFICATION] All scheduled notifications:', notifications.length);
      return notifications;
    } catch (error) {
      console.error('❌ [NOTIFICATION] Error getting scheduled notifications:', error);
      return [];
    }
  }

  /**
   * Cancel all notifications
   */
  async cancelAllNotifications(): Promise<boolean> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('✅ [NOTIFICATION] Cancelled all notifications');
      return true;
    } catch (error) {
      console.error('❌ [NOTIFICATION] Error cancelling all notifications:', error);
      return false;
    }
  }

  /**
   * Handle notification received (untuk navigation)
   */
  setupNotificationHandlers(navigateToSchedule: (scheduleId: string) => void) {
    // Handle notification tap when app is foreground
    const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('📱 [NOTIFICATION] Received in foreground:', notification.request.content.title);
    });

    // Handle notification tap when app is background/terminated
    const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      console.log('🔔 [NOTIFICATION] User tapped notification:', data);
      
      if (data?.type === 'schedule_reminder' && data?.scheduleId) {
        navigateToSchedule(data.scheduleId as string);
      }
    });

    return {
      foregroundSubscription,
      backgroundSubscription,
    };
  }
}

export const notificationService = new NotificationService();
export default notificationService; 