import { BASE_URL } from "@/config";
import axios from "axios";
import { notificationService, ScheduleData } from "@/services/notifications";

// --- GET SCHEDULE BY DATE ---
export const getScheduleByDate = async (token: string, date: string) => {
  const endpoint = `${BASE_URL}/schedule/date/${date}`;
  console.log(`🚀 [API][GET] Kicking off: ${endpoint}`);

  try {
    const response = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`✅ [API][GET] Success: ${endpoint}`, { status: response.status, data: response.data });
    return response.data.data;
  } catch (error) {
    console.error(`❌ [API][GET] Error: ${endpoint}`, error.response?.data || error.message);
    throw error;
  }
};

// --- CREATE SCHEDULE ---
export interface CreateSchedulePayload {
  date: string;
  clothesIds: string[];
  reminder?: string; // ISO string 
  note?: string;
}

export const createSchedule = async (token: string, payload: CreateSchedulePayload) => {
  const endpoint = `${BASE_URL}/schedule`;
  console.log(`🚀 [API][POST] Kicking off: ${endpoint}`, { payload });

  try {
    const response = await axios.post(endpoint, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log(`✅ [API][POST] Success: ${endpoint}`, { status: response.status, data: response.data });
    
    // Schedule local notification jika ada reminder
    const scheduleData = response.data.data;
    console.log(scheduleData)
    console.log('payload reminder', payload.reminder)
    if (scheduleData && payload.reminder) {
      try {
        console.log('🔔 [NOTIFICATION] Scheduling notification for new schedule:', scheduleData.id);
        
        // Fetch clothes details untuk notification (jika belum ada di response)
        const notificationData: ScheduleData = {
          id: scheduleData.id,
          date: scheduleData.date,
          note: scheduleData.note,
          reminder: scheduleData.reminder,
          clothes: scheduleData.clothes || [], // Assume clothes ada di response
        };
        
        await notificationService.scheduleNotification(notificationData);
      } catch (notificationError) {
        console.error('❌ [NOTIFICATION] Error scheduling notification:', notificationError);
        // Don't throw, karena schedule sudah berhasil dibuat
      }
    }
    
    return response.data;
  } catch (error) {
    console.error(`❌ [API][POST] Error: ${endpoint}`, error.response?.data || error.message);
    throw error;
  }
};

// --- UPDATE SCHEDULE ---
export interface UpdateSchedulePayload {
  date?: string;
  clothesIds?: string[];
  reminder?: string;
  note?: string;
}

export const updateSchedule = async (token: string, scheduleId: string, payload: UpdateSchedulePayload) => {
  const endpoint = `${BASE_URL}/schedule/${scheduleId}`;
  console.log(`🚀 [API][PUT] Kicking off: ${endpoint}`, { payload });

  try {
    const response = await axios.put(endpoint, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log(`✅ [API][PUT] Success: ${endpoint}`, { status: response.status, data: response.data });
    
    // Update local notification
    const scheduleData = response.data.data;
    if (scheduleData) {
      try {
        console.log('🔔 [NOTIFICATION] Updating notification for schedule:', scheduleData.id);
        
        const notificationData: ScheduleData = {
          id: scheduleData.id,
          date: scheduleData.date,
          note: scheduleData.note,
          reminder: scheduleData.reminder,
          clothes: scheduleData.clothes || [],
        };
        
        if (scheduleData.reminder) {
          await notificationService.updateScheduleNotification(notificationData);
        } else {
          // Cancel notification jika reminder dihapus
          await notificationService.cancelScheduleNotification(scheduleData.id);
        }
      } catch (notificationError) {
        console.error('❌ [NOTIFICATION] Error updating notification:', notificationError);
      }
    }
    
    return response.data;
  } catch (error) {
    console.error(`❌ [API][PUT] Error: ${endpoint}`, error.response?.data || error.message);
    throw error;
  }
};

// --- DELETE SCHEDULE ---
export const deleteSchedule = async (token: string, scheduleId: string) => {
  const endpoint = `${BASE_URL}/schedule/${scheduleId}`;
  console.log(`🚀 [API][DELETE] Kicking off: ${endpoint}`);

  try {
    const response = await axios.delete(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`✅ [API][DELETE] Success: ${endpoint}`, { status: response.status });
    
    // Cancel notification ketika schedule dihapus
    try {
      console.log('🔔 [NOTIFICATION] Cancelling notification for deleted schedule:', scheduleId);
      await notificationService.cancelScheduleNotification(scheduleId);
    } catch (notificationError) {
      console.error('❌ [NOTIFICATION] Error cancelling notification:', notificationError);
    }
    
    return response.data;
  } catch (error) {
    console.error(`❌ [API][DELETE] Error: ${endpoint}`, error.response?.data || error.message);
    throw error;
  }
};
