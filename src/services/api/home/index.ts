import { BASE_URL } from "@/config";
import axios from "axios";

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
    return response.data;
  } catch (error) {
    console.error(`❌ [API][POST] Error: ${endpoint}`, error.response?.data || error.message);
    throw error;
  }
};
