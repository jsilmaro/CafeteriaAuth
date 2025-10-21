import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import POSModal from "@/components/POSModal";

export default function FloatingPOSButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setOpen(true)}
          className="rounded-full h-14 w-14 bg-green-600 hover:bg-green-700 shadow-lg"
        >
          <ShoppingCart className="w-6 h-6 text-white" />
        </Button>
      </div>

      {/* POS Modal */}
      <POSModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
