import { useQuery } from "@tanstack/react-query";

export function usePublicStats() {
  return useQuery({
    queryKey: ["/api/stats/public"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: ["/api/admin/stats"],
    refetchInterval: 60000, // Refresh every minute
  });
}
