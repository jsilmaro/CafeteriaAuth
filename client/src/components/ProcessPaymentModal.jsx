import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

export default function ProcessPaymentModal({ open, onClose, order, onSuccess }) {
  const [amountReceived, setAmountReceived] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  if (!order) return null;

  const total = order.totalPrice
    ? Number(order.totalPrice)
    : order.items?.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0) || 0;
  const received = Number(amountReceived || 0);
  const change = received - total;

  const handleSubmit = async () => {
    if (!amountReceived || isNaN(received)) {
      toast({ title: "Please enter a valid amount", variant: "destructive" });
      return;
    }
    if (received < total) {
      toast({ title: "Amount received is less than total", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      await api.post("/payments", {
        orderId: order.id,
        amountReceived: received,
        customerName: order.customerName || order.studentName || "Student",
        customerType: order.customerType || "student",
      });

      toast({ title: "Payment processed successfully!" });
      if (onSuccess) await onSuccess();
      onClose();
    } catch (err) {
      console.error("❌ Payment failed:", err);
      toast({ title: "Failed to process payment", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Process Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div>
            <Label>Total Amount</Label>
            <Input type="text" value={`₱${total.toFixed(2)}`} readOnly />
          </div>

          <div>
            <Label>Amount Received</Label>
            <Input
              type="number"
              value={amountReceived}
              onChange={(e) => setAmountReceived(e.target.value)}
              placeholder="Enter amount received"
            />
          </div>

          {amountReceived && (
            <div>
              <Label>Change</Label>
              <Input
                type="text"
                value={change >= 0 ? `₱${change.toFixed(2)}` : "Invalid amount"}
                readOnly
                className={change < 0 ? "text-red-500" : "text-green-600"}
              />
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Processing..." : "Confirm Payment"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}