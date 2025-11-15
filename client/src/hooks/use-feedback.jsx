import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

export function useAllFeedback() {
  return useQuery({
    queryKey: ["feedback-all"],
    queryFn: async () => {
      const res = await api.get("/feedback/all");
      return res.data;
    }
  });
}
