import { useState } from "react";
import { useToast } from "./use-toast";

// Mock orders data - aligned with Prisma schema
const initialMockOrders = [
  {
    id: "ord-001",
    userId: "user-001",
    user: {
      fullName: "Jennie Kim",
      studentId: "2023300123",
      email: "jennie.kim@student.ustp.edu.ph"
    },
    orderItems: [
      { 
        id: "item-001",
        item: { name: "Chicken Adobo" },
        quantity: 1, 
        priceAtOrder: 85.00 
      },
      { 
        id: "item-002",
        item: { name: "Rice" },
        quantity: 1, 
        priceAtOrder: 15.00 
      },
      { 
        id: "item-003",
        item: { name: "Lumpia" },
        quantity: 1, 
        priceAtOrder: 45.00 
      }
    ],
    totalPrice: 145.00,
    status: "pending",
    pickupType: "dine_in",
    pickupTime: "2024-01-15T15:15:00Z",
    createdAt: "2024-01-15T15:00:00Z",
    paymentStatus: "pending"
  },
  {
    id: "ord-002",
    userId: "user-002",
    user: {
      fullName: "Maria Santos",
      studentId: "2023300124",
      email: "maria.santos@student.ustp.edu.ph"
    },
    orderItems: [
      { 
        id: "item-004",
        item: { name: "Chicken Adobo" },
        quantity: 1, 
        priceAtOrder: 85.00 
      },
      { 
        id: "item-005",
        item: { name: "Rice" },
        quantity: 1, 
        priceAtOrder: 15.00 
      },
      { 
        id: "item-006",
        item: { name: "Lumpia" },
        quantity: 1, 
        priceAtOrder: 45.00 
      }
    ],
    totalPrice: 145.00,
    status: "pending",
    pickupType: "take_out",
    pickupTime: "2024-01-15T15:15:00Z",
    createdAt: "2024-01-15T15:00:00Z",
    paymentStatus: "pending"
  },
  {
    id: "ord-003",
    userId: "user-003",
    user: {
      fullName: "Juan Dela Cruz",
      studentId: "2023300125",
      email: "juan.delacruz@student.ustp.edu.ph"
    },
    orderItems: [
      { 
        id: "item-007",
        item: { name: "Beef Steak" },
        quantity: 1, 
        priceAtOrder: 95.00 
      },
      { 
        id: "item-008",
        item: { name: "Rice" },
        quantity: 1, 
        priceAtOrder: 15.00 
      }
    ],
    totalPrice: 110.00,
    status: "preparing",
    pickupType: "dine_in",
    pickupTime: "2024-01-15T15:30:00Z",
    createdAt: "2024-01-15T15:10:00Z",
    paymentStatus: "cash_on_pickup"
  },
  {
    id: "ord-004",
    userId: "user-004",
    user: {
      fullName: "Ana Rodriguez",
      studentId: "2023300126",
      email: "ana.rodriguez@student.ustp.edu.ph"
    },
    orderItems: [
      { 
        id: "item-009",
        item: { name: "Pork Sisig" },
        quantity: 1, 
        priceAtOrder: 75.00 
      },
      { 
        id: "item-010",
        item: { name: "Rice" },
        quantity: 2, 
        priceAtOrder: 15.00 
      }
    ],
    totalPrice: 105.00,
    status: "ready",
    pickupType: "take_out",
    pickupTime: "2024-01-15T15:45:00Z",
    createdAt: "2024-01-15T15:20:00Z",
    paymentStatus: "paid"
  }
];

export function useOrders() {
  const { toast } = useToast();
  const [orders, setOrders] = useState(initialMockOrders);
  const [isLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const refetch = () => {
    // TODO: backend integration - refetch orders from API
    console.log('Refetching orders...');
    setOrders([...initialMockOrders]);
  };

  const updateOrderMutation = {
    mutate: ({ id, updates }) => {
      setIsUpdating(true);
      // TODO: backend integration - replace with actual API call
      console.log('Updating order:', id, updates);
      
      // Simulate API delay
      setTimeout(() => {
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === id ? { ...order, ...updates } : order
          )
        );
        setIsUpdating(false);
        
        toast({
          title: "Order updated",
          description: "Order status has been updated successfully.",
        });
      }, 500);
    },
    isPending: isUpdating
  };

  const deleteOrderMutation = {
    mutate: (id) => {
      setIsUpdating(true);
      // TODO: backend integration - replace with actual API call
      console.log('Deleting order:', id);
      
      // Simulate API delay
      setTimeout(() => {
        setOrders(prevOrders => prevOrders.filter(order => order.id !== id));
        setIsUpdating(false);
        
        toast({
          title: "Order deleted",
          description: "Order has been deleted successfully.",
        });
      }, 500);
    },
    isPending: isUpdating
  };

  const createOrderMutation = {
    mutate: (orderData) => {
      setIsUpdating(true);
      // TODO: backend integration - replace with actual API call
      console.log('Creating order:', orderData);
      
      // Simulate API delay
      setTimeout(() => {
        const newOrder = {
          ...orderData,
          id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
          orderTime: new Date().toLocaleTimeString(),
        };
        
        setOrders(prevOrders => [...prevOrders, newOrder]);
        setIsUpdating(false);
        
        toast({
          title: "Order created",
          description: "New order has been created successfully.",
        });
      }, 500);
    },
    isPending: isUpdating
  };

  return {
    orders,
    isLoading,
    error: null,
    refetch,
    updateOrderMutation,
    deleteOrderMutation,
    createOrderMutation,
  };
}