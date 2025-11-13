import { useState, useEffect } from "react";
import { useToast } from "./use-toast";
import api from "../lib/api"; // ✅ axios instance

export function useOrders() {
  const { toast } = useToast();

  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  // 🟢 Fetch orders and payments together and merge
  const fetchOrdersWithPayments = async () => {
    try {
      setIsLoading(true);

      // Fetch orders and payments concurrently
      const [ordersRes, paymentsRes] = await Promise.all([
        api.get("/orders"),
        api.get("/payments")
      ]);

      const ordersData = ordersRes.data;
      const paymentsData = paymentsRes.data;

      const mergedOrders = ordersData.map(order => {
        const payment = paymentsData.find(p => p.orderId === order.id);

        return {
          id: order.id,
          studentName: order.user?.fullName || "Unknown",
          studentId: order.user?.studentId || order.userId,
          paymentMethod:
            order.paymentStatus === "cash_on_pickup"
              ? "Cash on Pickup"
              : order.paymentStatus,
          status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
          paymentConfirmed: order.paymentConfirmed,
          paymentStatus: order.paymentStatus,
          pickupTime: order.pickupTime
            ? new Date(order.pickupTime).toLocaleString()
            : "Not set",
          orderTime: new Date(order.createdAt).toLocaleString(),
          items:
            order.orderItems?.map(oi => ({
              name: oi.item?.name || "Unknown Item",
              quantity: oi.quantity,
              price: Number(oi.priceAtOrder || 0),
            })) || [],
          total: Number(order.totalPrice || 0),

          // ✅ Payment details
          paymentAmountReceived: payment?.amountReceived,
          paymentChange: payment?.change,
          paymentProcessedBy: payment?.processedBy?.fullName,
          paymentTime: payment?.createdAt
            ? new Date(payment.createdAt).toLocaleString()
            : null,
        };
      });

      setPayments(paymentsRes.data);
      setOrders(mergedOrders);
      setError(null);
    } catch (err) {
      console.error("Error fetching orders/payments:", err);
      setError(err.response?.data?.error || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Refetch utility
  const refetch = async () => {
    await fetchOrdersWithPayments();
  };

  // 🧾 Update order status (for staff/admin)
  const updateOrderMutation = {
    mutate: async ({ id, status }) => {
      try {
        setIsUpdating(true);
        const res = await api.put(`/orders/${id}/status`, { status });
        const updatedOrder = res.data;

        // Update order in state
        setOrders(prev =>
          prev.map(order => (order.id === id ? { ...order, ...updatedOrder } : order))
        );

        toast({
          title: "Order updated",
          description: `Order ${id} marked as ${status}`,
        });

        // Refresh payments in case status affects them
        await fetchOrdersWithPayments();

        return updatedOrder;
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
    mutate: async id => {
      try {
        setIsUpdating(true);
        await api.delete(`/orders/${id}`);
        setOrders(prev => prev.filter(order => order.id !== id));
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

  // ✅ Fetch on mount
  useEffect(() => {
    fetchOrdersWithPayments();
  }, []);

  return {
    orders,
    payments,
    isLoading,
    error,
    refetch,
    updateOrderMutation,
    deleteOrderMutation,
  };
}
