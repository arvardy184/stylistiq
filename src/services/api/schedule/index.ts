import { BASE_URL } from "@/config";
import axios from "axios";
import { 
  SchedulesResponse, 
  ScheduleResponse, 
  ScheduleFormData, 
  UpdateScheduleData, 
  DeleteScheduleData 
} from "@/types/schedule";
import { notificationService, ScheduleData } from "@/services/notifications";

// --- GET ALL SCHEDULES WITH DATE RANGE ---
export const getAllSchedules = async (token: string, startDate: string, endDate: string): Promise<SchedulesResponse> => {
  const endpoint = `${BASE_URL}/schedule?startDate=${startDate}&endDate=${endDate}`;
  console.log(`🚀 [API][GET] Kicking off: ${endpoint}`);

  try {
    const response = await axios.get<SchedulesResponse>(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`✅ [API][GET] Success: ${endpoint}`, { status: response.status, data: response.data });
    return response.data;
  } catch (error) {
    console.error(`❌ [API][GET] Error: ${endpoint}`, error.response?.data || error.message);
    throw error;
  }
};

// --- GET SCHEDULE BY ID ---
export const getScheduleById = async (token: string, scheduleId: string): Promise<ScheduleResponse> => {
  const endpoint = `${BASE_URL}/schedule/${scheduleId}`;
  console.log(`🚀 [API][GET] Kicking off: ${endpoint}`);

  try {
    const response = await axios.get<ScheduleResponse>(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`✅ [API][GET] Success: ${endpoint}`, { status: response.status, data: response.data });
    return response.data;
  } catch (error) {
    console.error(`❌ [API][GET] Error: ${endpoint}`, error.response?.data || error.message);
    throw error;
  }
};

// --- GET SCHEDULE BY DATE ---
export const getScheduleByDate = async (token: string, date: string): Promise<SchedulesResponse> => {
  const endpoint = `${BASE_URL}/schedule/date/${date}`;
  console.log(`🚀 [API][GET] Kicking off: ${endpoint}`, { date });

  try {
    const response = await axios.get<SchedulesResponse>(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`✅ [API][GET] Success: ${endpoint}`, { status: response.status, data: response.data });
    return response.data;
  } catch (error) {
    console.error(`❌ [API][GET] Error: ${endpoint}`, error.response?.data || error.message);
    throw error;
  }
};

export interface CreateSchedulePayload {
  date: string;
  clothesIds: string[];
  reminder?: string; // ISO string 
  note?: string;
}

export interface UpdateSchedulePayload {
  date?: string;
  clothesIds?: string[];
  reminder?: string;
  note?: string;
}
// --- CREATE SCHEDULE ---
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

// --- DELETE SCHEDULES (BULK) ---
// src/services/api/schedule/index.ts
export const deleteSchedules = async (token: string, data: { scheduleIds: string[] }) => {
  const endpoint = `${BASE_URL}/schedule`;
  console.log(`🚀 [API][DELETE] Kicking off: ${endpoint}`, { data });

  try {
    const response = await axios.delete(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
      data: data,
    });
    // Cancel notification untuk semua schedule
    for (const id of data.scheduleIds) {
      try {
        await notificationService.cancelScheduleNotification(id);
      } catch (e) {
        console.error('❌ [NOTIFICATION] Error cancelling notification:', e);
      }
    }
    return response.data;
  } catch (error) {
    console.error(`❌ [API][DELETE] Error: ${endpoint}`, error.response?.data || error.message);
    throw error;
  }
};


// --- DELETE SINGLE SCHEDULE ---
export const deleteSchedule = async (token: string, scheduleId: string): Promise<void> => {
  return deleteSchedules(token, { scheduleIds: [scheduleId] });
}; 