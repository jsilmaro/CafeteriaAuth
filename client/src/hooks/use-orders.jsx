import { useToast } from "./use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api"; // <-- we'll create this next (axios instance)

/**
 * Hook for managing cafeteria orders using real backend
 */
export function useOrders() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // 🧭 Fetch all orders
  const {
    data: orders = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await api.get("/orders");
      return res.data; // make sure backend returns an array
    },
  });

  // ✏️ Update order
  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, updates }) => {
      const res = await api.patch(`/orders/${id}`, updates);
      return res.data;
    },
    onSuccess: () => {
      toast({
        title: "Order updated",
        description: "Order status has been updated successfully.",
      });
      queryClient.invalidateQueries(["orders"]);
    },
    onError: (err) => {
      toast({
        title: "Update failed",
        description: err.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  // 🗑️ Delete order
  const deleteOrderMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/orders/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast({
        title: "Order deleted",
        description: "Order has been deleted successfully.",
      });
      queryClient.invalidateQueries(["orders"]);
    },
    onError: (err) => {
      toast({
        title: "Delete failed",
        description: err.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  // ➕ Create new order
  const createOrderMutation = useMutation({
    mutationFn: async (orderData) => {
      const res = await api.post("/orders", orderData);
      return res.data;
    },
    onSuccess: () => {
      toast({
        title: "Order created",
        description: "New order has been created successfully.",
      });
      queryClient.invalidateQueries(["orders"]);
    },
    onError: (err) => {
      toast({
        title: "Creation failed",
        description: err.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  return {
    orders,
    isLoading,
    error,
    refetch,
    updateOrderMutation,
    deleteOrderMutation,
    createOrderMutation,
  };
}