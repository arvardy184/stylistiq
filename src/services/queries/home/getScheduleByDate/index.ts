import { GetScheduleByDate } from "@/services/api/home";
import { useQuery } from "@tanstack/react-query";

export const useGetScheduleByDate = (token: string, date: string) => {
  return useQuery({
    queryKey: ["schedule-by-date", token, date],
    queryFn: () => GetScheduleByDate(token, date),
    enabled: !!token && !!date,
  });
};
