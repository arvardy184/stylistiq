# 🔔 Local Notification Implementation Guide

## Overview
Implementasi local notification untuk schedule outfit yang akan mengingatkan user sesuai waktu yang ditentukan.

## Features
- ✅ Schedule notification saat create/update schedule
- ✅ Cancel notification saat delete schedule  
- ✅ Support foreground dan background notification
- ✅ Navigation ke schedule detail saat notification di-tap
- ✅ Permission handling otomatis
- ✅ Reminder time picker di schedule creation modal

## Architecture

### 1. **Notification Service** (`src/services/notifications/index.ts`)
- **Main class**: `NotificationService`
- **Key functions**:
  - `requestPermissions()`: Request notification permission
  - `scheduleNotification(scheduleData)`: Schedule notification untuk schedule tertentu
  - `cancelScheduleNotification(scheduleId)`: Cancel notification
  - `updateScheduleNotification(scheduleData)`: Update notification (cancel + reschedule)
  - `setupNotificationHandlers()`: Handle notification tap untuk navigation

### 2. **API Integration** (`src/services/api/home/index.ts`)
- **Modified functions**:
  - `createSchedule()`: Auto-schedule notification setelah create
  - `updateSchedule()`: Auto-update notification setelah update
  - `deleteSchedule()`: Auto-cancel notification setelah delete

### 3. **UI Components**
- **ScheduleCreationModal**: Tambah step 3 untuk set reminder time dan note
- **AppNavigator**: Setup notification handlers untuk navigation

## How It Works

### Create Schedule Flow:
1. User pilih clothes/collection di modal
2. User set reminder time (optional) dan note
3. API `createSchedule` dipanggil dengan `reminder` dan `note`
4. Jika ada `reminder`, notification service schedule local notification
5. Notification akan muncul sesuai waktu yang ditentukan

### Notification Content:
- **Title**: "👔 Outfit Reminder"
- **Body**: "Time to wear your kemeja putih, celana hitam and 2 more items!"
- **Subtitle**: Note dari user (jika ada)

### Notification Tap:
- Jika user tap notification, app akan navigate ke `ScheduleDetail` screen
- Data `scheduleId` dikirim via notification payload

## Testing Scenarios

### 1. **Foreground Notification**
```bash
# Set reminder untuk 1-2 menit ke depan
# Biarkan app tetap terbuka
# Notification should appear as banner
```

### 2. **Background Notification**  
```bash
# Set reminder untuk 1-2 menit ke depan
# Minimize app atau switch ke app lain
# Notification should appear in notification center
```

### 3. **Notification Tap**
```bash
# Tap notification dari notification center
# App should open dan navigate ke ScheduleDetail
```

### 4. **Permission Handling**
```bash
# Uninstall dan install ulang app
# First launch should request notification permission
# Decline permission -> notification won't work
# Accept permission -> notification should work
```

### 5. **Update/Delete Schedule**
```bash
# Create schedule dengan reminder
# Update schedule -> old notification cancelled, new one scheduled
# Delete schedule -> notification cancelled
```

## Debug Commands

### Check Scheduled Notifications:
```javascript
// Di console atau debug mode
import { notificationService } from '@/services/notifications';
await notificationService.getAllScheduledNotifications();
```

### Cancel All Notifications:
```javascript
await notificationService.cancelAllNotifications();
```

## Troubleshooting

### Notification Tidak Muncul:
1. **Check permission**: Pastikan user grant notification permission
2. **Check device**: Emulator kadang tidak reliable, test di physical device
3. **Check time**: Pastikan reminder time di masa depan
4. **Check logs**: Lihat console log untuk error

### Navigation Tidak Jalan:
1. **Check navigation ref**: Pastikan `navigationRef` di AppNavigator ter-setup
2. **Check screen exists**: Pastikan `ScheduleDetail` screen terdaftar di navigator
3. **Check data**: Pastikan `scheduleId` ada di notification payload

## Production Considerations

### 1. **Battery Optimization**
- Android bisa kill background process
- User mungkin perlu whitelist app dari battery optimization

### 2. **iOS Limitations** 
- Local notification limit (64 notifications)
- Jika lebih dari limit, implement cleanup strategy

### 3. **Timezone Handling**
- Pastikan reminder time handle timezone dengan benar
- Test di berbagai timezone

## Future Enhancements

1. **Recurring Notifications**: Support untuk reminder harian/mingguan
2. **Custom Sounds**: Different notification sound untuk different outfit types  
3. **Rich Notifications**: Show outfit images di notification
4. **Smart Reminders**: AI-based optimal reminder time

---

## Quick Commands

```bash
# Install dependencies
npx expo install expo-notifications expo-device expo-constants @react-native-community/datetimepicker

# Test notification permission
# Run app -> permission dialog should appear on first launch

# Test notification scheduling  
# Create schedule dengan reminder -> check console logs

# Test notification tap
# Wait for notification -> tap -> should navigate to schedule detail
``` 