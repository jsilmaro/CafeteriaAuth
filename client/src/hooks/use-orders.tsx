import { 
  useQuery, 
  useMutation, 
  UseMutationResult,
  UseQueryResult 
} from "@tanstack/react-query";
import { type Order, type InsertOrder } from "../types/schema";
import { queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MockApiService } from "../services/mockData";

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
    isLoading = false,
    refetch
  } = useQuery<Order[], Error>({
    queryKey: ["orders"],
    queryFn: () => MockApiService.getOrders(),
  });

  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Order> }) => {
      return await MockApiService.updateOrder(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
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
      return await MockApiService.deleteOrder(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
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
      return await MockApiService.createOrder(order);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
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