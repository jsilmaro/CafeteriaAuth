import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ChevronsUpDown, X } from "lucide-react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const status = ["Available", "Unavailable"];

function EditItemModal({ isOpen, onClose, onSave, item, onDelete, categories }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    photoUrl: "",
    availability: true,
    stockLimit: 0,
    categoryId: "", // store id here
  });

  useEffect(() => {
    if (item) {
      setFormData({
        id: item.id, // ✅ include this
        name: item.name || "",
        description: item.description || "",
        price: item.price || "",
        photoURL: item.photoURL || "",
        availability: item.availability ?? true,
        stockLimit: item.stockLimit || 0,
        categoryId: item.category?.id || "", // or category.id if you use IDs
      });
    } else {
      setFormData({
        id: null,
        name: "",
        description: "",
        price: "",
        photoURL: "",
        availability: true,
        stockLimit: 0,
        categoryId: "",
      });
    }
  }, [item, isOpen, categories]);

  const handleSave = () => {
    onSave(formData); // ✅ includes id now
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <div>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {item ? "Edit Menu Item" : "Add New Item"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="photoURL">Item Image</Label>
              <div className="flex gap-4 items-center">
                {formData.photoURL && (
                  <div className="relative">
                    <img
                      src={formData.photoURL}
                      alt="Preview"
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, photoURL: "" })}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    id="photoURL"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData({ ...formData, photoURL: reader.result });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                      Choose an image file to upload
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  placeholder="Chicken Adobo"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  placeholder="₱0.00"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="A delicious Filipino dish..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="min-h-[100px]"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col w-1/2">
              <Label className="pb-3">Category</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="justify-start">
                    <ChevronsUpDown className="mr-2 h-4 w-4" />
                    {categories.find(c => c.id === formData.categoryId)?.name || "Select a category"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {Array.isArray(categories) &&
                    categories.map((cat) => (
                      <DropdownMenuItem
                        key={cat.id}
                        onClick={() => setFormData({ ...formData, categoryId: cat.id })}
                      >
                        {cat.name}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex flex-col items-center justify-start w-1/2">
              <Label htmlFor="stockLimit" className="pb-3 w-full text-left">
                Stock Quantity
              </Label>
              <Input
                id="stockLimit"
                type="number"
                min={0}
                value={formData.stockLimit}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stockLimit: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="flex flex-col w-1/2">
              <Label className="pb-3">Status</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className={`justify-start ${formData.availability ? "bg-green-400" : "bg-red-400"}`}>
                    <ChevronsUpDown />
                    {formData.availability ? "Available" : "Unavailable"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {status.map((stat) => (
                    <DropdownMenuItem
                      key={stat}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          availability: stat === "Available",
                        })
                      }
                    >
                      {stat}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex justify-between pt-6 gap-2">
            <Button
              variant="outline"
              className="bg-red-400 text-white"
              onClick={() => {
                if (item && item.id) {
                  onDelete(item.id);
                }
              }}
            >
              Delete Item
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {item ? "Save Changes" : "Add Item"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

EditItemModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  item: PropTypes.object,
  onDelete: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default EditItemModal;