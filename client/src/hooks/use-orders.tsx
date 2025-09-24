import { 
  useQuery, 
  useMutation, 
  UseMutationResult,
  UseQueryResult 
} from "@tanstack/react-query";
import { type Order, type InsertOrder } from "@shared/schema";
import { apiRequest, getQueryFn, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Persistent mock data outside the hook to maintain state
const initialMockOrders: Order[] = [
  {
    id: "ORD-001",
    studentName: "Jennie Kim",
    studentId: "2023300123",
    items: [
      { name: "Chicken Adobo", quantity: 1, price: 85.00 },
      { name: "Rice", quantity: 1, price: 15.00 },
      { name: "Lumpia", quantity: 1, price: 45.00 }
    ],
    total: 145.00,
    status: "Pending",
    pickupTime: "3:15 PM",
    orderTime: "3:00 PM",
    paymentMethod: "G-Cash"
  },
  {
    id: "ORD-002",
    studentName: "Maria Santos",
    studentId: "2023300124",
    items: [
      { name: "Chicken Adobo", quantity: 1, price: 85.00 },
      { name: "Rice", quantity: 1, price: 15.00 },
      { name: "Lumpia", quantity: 1, price: 45.00 }
    ],
    total: 145.00,
    status: "Pending",
    pickupTime: "3:15 PM",
    orderTime: "3:00 PM",
    paymentMethod: "G-Cash"
  },
  {
    id: "ORD-003",
    studentName: "Juan Dela Cruz",
    studentId: "2023300125",
    items: [
      { name: "Beef Steak", quantity: 1, price: 95.00 },
      { name: "Rice", quantity: 1, price: 15.00 }
    ],
    total: 110.00,
    status: "Preparing",
    pickupTime: "3:30 PM",
    orderTime: "3:10 PM",
    paymentMethod: "Cash"
  },
  {
    id: "ORD-004",
    studentName: "Ana Rodriguez",
    studentId: "2023300126",
    items: [
      { name: "Pork Sisig", quantity: 1, price: 75.00 },
      { name: "Rice", quantity: 2, price: 30.00 }
    ],
    total: 105.00,
    status: "Ready",
    pickupTime: "3:45 PM",
    orderTime: "3:20 PM",
    paymentMethod: "G-Cash"
  }
];

// Initialize the cache with mock data once
const QUERY_KEY = ["/api/orders"];
if (!queryClient.getQueryData(QUERY_KEY)) {
  queryClient.setQueryData(QUERY_KEY, initialMockOrders);
}

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
    queryKey: QUERY_KEY,
    queryFn: () => {
      // Return cached data or fallback to initial data
      return Promise.resolve(queryClient.getQueryData(QUERY_KEY) || initialMockOrders);
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Order> }) => {
      // Mock update - simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const currentOrders = queryClient.getQueryData<Order[]>(QUERY_KEY) || [];
      const orderIndex = currentOrders.findIndex(o => o.id === id);
      
      if (orderIndex === -1) {
        throw new Error(`Order with id ${id} not found`);
      }
      
      const updatedOrders = [...currentOrders];
      updatedOrders[orderIndex] = { ...updatedOrders[orderIndex], ...updates };
      
      // Update the cache directly instead of invalidating
      queryClient.setQueryData(QUERY_KEY, updatedOrders);
      
      return updatedOrders[orderIndex];
    },
    onSuccess: () => {
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
      // Mock delete - simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const currentOrders = queryClient.getQueryData<Order[]>(QUERY_KEY) || [];
      const filteredOrders = currentOrders.filter(o => o.id !== id);
      
      // Update the cache directly
      queryClient.setQueryData(QUERY_KEY, filteredOrders);
    },
    onSuccess: () => {
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
      // Mock create - simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const currentOrders = queryClient.getQueryData<Order[]>(QUERY_KEY) || [];
      const newOrder: Order = {
        ...order,
        id: `ORD-${String(currentOrders.length + 1).padStart(3, '0')}`,
      };
      
      const updatedOrders = [...currentOrders, newOrder];
      
      // Update the cache directly
      queryClient.setQueryData(QUERY_KEY, updatedOrders);
      
      return newOrder;
    },
    onSuccess: () => {
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