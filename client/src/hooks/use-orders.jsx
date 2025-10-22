import { useState, useEffect } from "react";
import { useToast } from "./use-toast";
import api from "../lib/api"; // ✅ axios instance

export function useOrders() {
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  // 🟢 Fetch all orders (based on role)
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/orders");

      const formattedOrders = response.data.map(order => ({
        id: order.id,
        studentName: order.user?.fullName || "Unknown",
        studentId: order.user?.studentId || order.userId,
        paymentMethod:
          order.paymentStatus === "cash_on_pickup"
            ? "Cash on Pickup"
            : order.paymentStatus,
        status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
        pickupTime: order.pickupTime
          ? new Date(order.pickupTime).toLocaleString()
          : "Not set",
        orderTime: new Date(order.createdAt).toLocaleString(),
        items: order.orderItems?.map(oi => ({
          name: oi.item?.name || "Unknown Item",
          quantity: oi.quantity,
          price: Number(oi.priceAtOrder || 0),
        })) || [],
        total: Number(order.totalPrice || 0),
      }));

      setOrders(formattedOrders);
      setError(null);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.response?.data?.error || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const refetch = fetchOrders;

  // 🧾 Update order status (for staff/admin)
  const updateOrderMutation = {
    mutate: async ({ id, status }) => {
      try {
        setIsUpdating(true);
        const res = await api.put(`/orders/${id}/status`, { status });
        const updated = res.data;

        setOrders((prev) =>
          prev.map((order) => (order.id === id ? { ...order, ...updated } : order))
        );

        toast({
          title: "Order updated",
          description: `Order ${id} marked as ${status}`,
        });
      } catch (err) {
        console.error("❌ Update order error:", err);
        toast({
          title: "Failed to update order",
          description: err.response?.data?.error || err.message,
          variant: "destructive",
        });
      } finally {
        setIsUpdating(false);
      }
    },
    isPending: isUpdating,
  };

  // 🗑️ Delete order (staff/admin)
  const deleteOrderMutation = {
    mutate: async (id) => {
      try {
        setIsUpdating(true);
        await api.delete(`/orders/${id}`);
        setOrders((prev) => prev.filter((order) => order.id !== id));
        toast({
          title: "Order deleted",
          description: `Order ${id} deleted successfully.`,
        });
      } catch (err) {
        console.error("❌ Delete order error:", err);
        toast({
          title: "Failed to delete order",
          description: err.response?.data?.error || err.message,
          variant: "destructive",
        });
      } finally {
        setIsUpdating(false);
      }
    },
    isPending: isUpdating,
  };

  return {
    orders,
    isLoading,
    error,
    refetch,
    updateOrderMutation,
    deleteOrderMutation,
  };
}
