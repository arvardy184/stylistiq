import { BASE_URL } from "@/config";
import axios from "axios";
import { 
  SchedulesResponse, 
  ScheduleResponse, 
  ScheduleFormData, 
  UpdateScheduleData, 
  DeleteScheduleData 
} from "@/types/schedule";

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

// --- CREATE SCHEDULE ---
export const createSchedule = async (token: string, data: ScheduleFormData): Promise<ScheduleResponse> => {
  const endpoint = `${BASE_URL}/schedule`;
  console.log(`🚀 [API][POST] Kicking off: ${endpoint}`, { data });

  try {
    const response = await axios.post<ScheduleResponse>(endpoint, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`✅ [API][POST] Success: ${endpoint}`, { status: response.status, data: response.data });
    return response.data;
  } catch (error) {
    console.error(`❌ [API][POST] Error: ${endpoint}`, error.response?.data || error.message);
    throw error;
  }
};

// --- UPDATE SCHEDULE ---
export const updateSchedule = async (token: string, scheduleId: string, data: UpdateScheduleData): Promise<ScheduleResponse> => {
  const endpoint = `${BASE_URL}/schedule/${scheduleId}`;
  console.log(`🚀 [API][PUT] Kicking off: ${endpoint}`, { data });

  try {
    const response = await axios.put<ScheduleResponse>(endpoint, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`✅ [API][PUT] Success: ${endpoint}`, { status: response.status, data: response.data });
    return response.data;
  } catch (error) {
    console.error(`❌ [API][PUT] Error: ${endpoint}`, error.response?.data || error.message);
    throw error;
  }
};

// --- DELETE SCHEDULES (BULK) ---
export const deleteSchedules = async (token: string, data: DeleteScheduleData): Promise<void> => {
  const endpoint = `${BASE_URL}/schedule`;
  console.log(`🚀 [API][DELETE] Kicking off: ${endpoint}`, { data });

  try {
    const response = await axios.delete(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
      data: data,
    });
    console.log(`✅ [API][DELETE] Success: ${endpoint}`, { status: response.status });
  } catch (error) {
    console.error(`❌ [API][DELETE] Error: ${endpoint}`, error.response?.data || error.message);
    throw error;
  }
};

// --- DELETE SINGLE SCHEDULE ---
export const deleteSchedule = async (token: string, scheduleId: string): Promise<void> => {
  return deleteSchedules(token, { scheduleIds: [scheduleId] });
}; 