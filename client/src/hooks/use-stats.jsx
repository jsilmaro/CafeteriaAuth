import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

export function useStats() {
  return useQuery({
    queryKey: ["stats-overview"],
    queryFn: async () => {
      const res = await api.get("/stats/overview");
      return res.data;
    },
  });
}
