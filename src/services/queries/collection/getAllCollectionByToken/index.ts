import { GetAllCollectionByToken } from "@/services/api/collection";
import { useQuery } from "@tanstack/react-query";

export const useGetAllCollectionByToken = (token: string) => {
  return useQuery({
    queryKey: ["get-collection", token],
    queryFn: () => GetAllCollectionByToken(token),
    enabled: !!token,
  });
};
