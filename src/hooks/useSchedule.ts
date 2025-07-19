import { useState, useCallback } from "react";
import { useAuthStore } from "@/store/auth/authStore";
import { useNotification } from "@/hooks/useNotification";
import {
  getAllSchedules,
  getScheduleById,
  getScheduleByDate,
  createSchedule,
  updateSchedule,
  deleteSchedules,
  deleteSchedule,
} from "@/services/api/schedule";
import {
  Schedule,
  ScheduleFormData,
  UpdateScheduleData,
} from "@/types/schedule";

export const useSchedule = () => {
  const { token } = useAuthStore();
  const { showSuccess, showError } = useNotification();
  
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Get schedules by date range
  const fetchSchedules = useCallback(async (startDate: string, endDate: string) => {
    if (!token) return;

    try {
      setLoading(true);
      console.log("🔄 Fetching schedules...", { startDate, endDate });
      
      const response = await getAllSchedules(token, startDate, endDate);
      setSchedules(response.data || []);
      console.log("✅ Schedules fetched successfully:", response.data?.length || 0, "items");
    } catch (error) {
      console.error("❌ Error fetching schedules:", error);
      showError("Failed to load schedules", "Please try again.");
    } finally {
      setLoading(false);
    }
  }, [token, showError]);

  // Get schedule by specific date
  const fetchScheduleByDate = useCallback(async (date: string): Promise<Schedule[]> => {
    if (!token) return [];

    try {
      console.log("🔄 Fetching schedule for date:", date);
      
      const response = await getScheduleByDate(token, date);
      const scheduleData = response.data || [];
      console.log("✅ Schedule fetched for date:", scheduleData.length, "items");
      return scheduleData;
    } catch (error) {
      console.error("❌ Error fetching schedule by date:", error);
      showError("Failed to load schedule", "Please try again.");
      return [];
    }
  }, [token, showError]);

  // Get schedule by ID
  const fetchScheduleById = useCallback(async (scheduleId: string): Promise<Schedule | null> => {
    if (!token) return null;

    try {
      console.log("🔄 Fetching schedule by ID:", scheduleId);
      
      const response = await getScheduleById(token, scheduleId);
      console.log("✅ Schedule fetched by ID:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching schedule by ID:", error);
      showError("Failed to load schedule details", "Please try again.");
      return null;
    }
  }, [token, showError]);

  // Create new schedule
  const createNewSchedule = useCallback(async (data: ScheduleFormData): Promise<Schedule | null> => {
    if (!token) return null;

    try {
      setLoading(true);
      console.log("🔄 Creating new schedule...", data);
      
      const response = await createSchedule(token, data);
      const newSchedule = response.data;
      
      // Add to local state
      setSchedules(prev => [newSchedule, ...prev]);
      
      showSuccess("Schedule Created", "Your outfit schedule has been created successfully!");
      console.log("✅ Schedule created successfully:", newSchedule);
      return newSchedule;
    } catch (error) {
      console.error("❌ Error creating schedule:", error);
      showError("Failed to create schedule", "Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  }, [token, showSuccess, showError]);

  // Update schedule
  const updateExistingSchedule = useCallback(async (scheduleId: string, data: UpdateScheduleData): Promise<Schedule | null> => {
    if (!token) return null;

    try {
      setLoading(true);
      console.log("🔄 Updating schedule...", { scheduleId, data });
      
      const response = await updateSchedule(token, scheduleId, data);
      const updatedSchedule = response.data;
      
      // Update local state
      setSchedules(prev => prev.map(schedule => 
        schedule.id === scheduleId ? updatedSchedule : schedule
      ));
      
      showSuccess("Schedule Updated", "Your outfit schedule has been updated successfully!");
      console.log("✅ Schedule updated successfully:", updatedSchedule);
      return updatedSchedule;
    } catch (error) {
      console.error("❌ Error updating schedule:", error);
      showError("Failed to update schedule", "Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  }, [token, showSuccess, showError]);

  // Delete single schedule
  const deleteSingleSchedule = useCallback(async (scheduleId: string): Promise<boolean> => {
    if (!token) return false;

    try {
      setLoading(true);
      console.log("🔄 Deleting schedule...", scheduleId);
      
      await deleteSchedule(token, scheduleId);
      
      // Remove from local state
      setSchedules(prev => prev.filter(schedule => schedule.id !== scheduleId));
      
      showSuccess("Schedule Deleted", "Your outfit schedule has been deleted.");
      console.log("✅ Schedule deleted successfully");
      return true;
    } catch (error) {
      console.error("❌ Error deleting schedule:", error);
      showError("Failed to delete schedule", "Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  }, [token, showSuccess, showError]);

  // Delete multiple schedules
  const deleteMultipleSchedules = useCallback(async (scheduleIds: string[]): Promise<boolean> => {
    if (!token) return false;

    try {
      setLoading(true);
      console.log("🔄 Deleting multiple schedules...", scheduleIds);
      
      await deleteSchedules(token, { scheduleIds });
      
      // Remove from local state
      setSchedules(prev => prev.filter(schedule => !scheduleIds.includes(schedule.id)));
      
      showSuccess("Schedules Deleted", `${scheduleIds.length} schedules have been deleted.`);
      console.log("✅ Multiple schedules deleted successfully");
      return true;
    } catch (error) {
      console.error("❌ Error deleting multiple schedules:", error);
      showError("Failed to delete schedules", "Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  }, [token, showSuccess, showError]);

  // Refresh schedules
  const refreshSchedules = useCallback(async (startDate: string, endDate: string) => {
    setRefreshing(true);
    await fetchSchedules(startDate, endDate);
    setRefreshing(false);
  }, [fetchSchedules]);

  // Clear schedules
  const clearSchedules = useCallback(() => {
    setSchedules([]);
  }, []);

  return {
    // State
    schedules,
    loading,
    refreshing,
    
    // Actions
    fetchSchedules,
    fetchScheduleByDate,
    fetchScheduleById,
    createNewSchedule,
    updateExistingSchedule,
    deleteSingleSchedule,
    deleteMultipleSchedules,
    refreshSchedules,
    clearSchedules,
  };
}; 