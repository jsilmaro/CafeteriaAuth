import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useOrders } from "../hooks/use-orders";
import api from "../lib/api"; // still needed to create offline orders manually

export default function POSModal({ isOpen, onClose }) {
  const { orders, isLoading, refetch } = useOrders();

  const [creating, setCreating] = useState(false);
  const [newOrder, setNewOrder] = useState({
    pickupType: "dine_in",
    totalPrice: "",
  });

  // 🧾 Create a dine-in (offline) order
  const handleCreateOfflineOrder = async () => {
    if (!newOrder.totalPrice) {
      toast({
        title: "Please enter total price",
        variant: "destructive",
      });
      return;
    }

    try {
      setCreating(true);
      const res = await api.post("/orders", {
        userId: "offline", // You can create a dedicated system user in backend if needed
        pickupType: "dine_in",
        totalPrice: Number(newOrder.totalPrice),
        status: "pending",
        paymentStatus: "pending",
      });

      toast({
        title: "Offline order created successfully",
      });

      setNewOrder({ pickupType: "dine_in", totalPrice: "" });
      refetch(); // refresh orders
    } catch (err) {
      console.error("Create offline order error:", err);
      toast({
        title: "Failed to create order",
        description: err.response?.data?.error || err.message,
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            🧾 Point of Sale (POS)
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Left panel – Active orders */}
          <div className="md:w-2/3 border rounded-lg p-3 bg-gray-50">
            <h3 className="font-medium mb-2">Active Orders</h3>
            <ScrollArea className="h-[50vh] pr-2">
              {isLoading ? (
                <p className="text-center py-4 text-sm text-gray-500">
                  Loading orders...
                </p>
              ) : orders.length === 0 ? (
                <p className="text-center py-4 text-sm text-gray-500">
                  No active orders
                </p>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-3 mb-2 bg-white rounded-lg shadow-sm border"
                  >
                    <div className="flex justify-between">
                      <p className="font-medium">
                        #{order.id.slice(0, 6).toUpperCase()}
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          order.status.toLowerCase() === "ready"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Type: {order.pickupType || "—"}
                    </p>
                    <p className="text-sm text-gray-600">
                      ₱{Number(order.total).toFixed(2)}
                    </p>
                  </div>
                ))
              )}
            </ScrollArea>
          </div>

          {/* Right panel – Create offline order */}
          <div className="md:w-1/3 border rounded-lg p-3 bg-white">
            <h3 className="font-medium mb-2">Create Offline Order</h3>
            <Separator className="mb-3" />

            <div className="space-y-3">
              <div className="space-y-1">
                <Label>Total Price</Label>
                <Input
                  type="number"
                  min="0"
                  value={newOrder.totalPrice}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, totalPrice: e.target.value })
                  }
                  placeholder="Enter total amount"
                />
              </div>

              <Button
                className="w-full bg-[#6B8E23] hover:bg-[#5A7C1E]"
                onClick={handleCreateOfflineOrder}
                disabled={creating}
              >
                {creating ? "Creating..." : "Create Dine-In Order"}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
