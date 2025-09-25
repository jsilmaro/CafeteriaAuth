import { useState, useEffect } from "react";
import { useToast } from "./use-toast";

// Mock orders data
const initialMockOrders = [
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

export function useOrders() {
  const { toast } = useToast();
  const [orders, setOrders] = useState(initialMockOrders);
  const [isLoading, setIsLoading] = useState(false);
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