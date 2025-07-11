import { Profile } from "@/services/api/user";
import { useQuery } from "@tanstack/react-query";

export const useGetProfileUser = (token: string) => {
  return useQuery({
    queryKey: ["user-profile", token],
    queryFn: () => Profile(token),
    enabled: !!token,
  });
};
