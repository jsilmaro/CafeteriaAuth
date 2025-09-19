import { 
  useQuery, 
  useMutation, 
  UseMutationResult,
  UseQueryResult 
} from "@tanstack/react-query";
import { type Order, type InsertOrder } from "@shared/schema";
import { apiRequest, getQueryFn, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type UseOrdersResult = {
  orders: Order[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  updateOrderMutation: UseMutationResult<Order, Error, { id: string; updates: Partial<Order> }>;
  deleteOrderMutation: UseMutationResult<void, Error, string>;
  createOrderMutation: UseMutationResult<Order, Error, InsertOrder>;
};

export function useOrders(): UseOrdersResult {
  const { toast } = useToast();

  const {
    data: orders = [],
    error,
    isLoading,
    refetch
  } = useQuery<Order[], Error>({
    queryKey: ["/api/orders"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Order> }) => {
      const res = await apiRequest("PUT", `/api/orders/${id}`, updates);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Order updated",
        description: "Order status has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/orders/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Order deleted",
        description: "Order has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (order: InsertOrder) => {
      const res = await apiRequest("POST", "/api/orders", order);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Order created",
        description: "New order has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Create failed",
        description: error.message,
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