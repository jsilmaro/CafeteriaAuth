import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { supabase } from "@/lib/supabase";
import api from "@/lib/api";

function AddItem({ open, onClose, onAdd, categories, fetchCategories }) {
  const [preview, setPreview] = useState(null);
  const [category, setCategory] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [available, setAvailable] = useState(true);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [file, setFile] = useState(null);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let photoUrl = "";

    try {
      // ✅ Upload image if selected
      if (file) {
        const fileName = `${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from(import.meta.env.VITE_SUPABASE_BUCKET)
          .upload(fileName, file);

        if (error) throw error;

        const { data: publicUrlData } = supabase.storage
          .from(import.meta.env.VITE_SUPABASE_BUCKET)
          .getPublicUrl(fileName);

        photoUrl = publicUrlData.publicUrl;
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Image upload failed");
    }

    // ✅ Step 5: Handle “Add New Category” flow
    let categoryId = category; // existing selected ID

    if (showNewCategory && newCategory) {
      try {
        const token = localStorage.getItem("token"); // make sure staff user is logged in
        const res = await api.post(
          "/menu/categories",
          { name: newCategory, description: "" },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        categoryId = res.data.id;
        console.log("✅ Created new category:", res.data.name);

        // 🟢 Refresh parent category list
        if (fetchCategories) await fetchCategories();
      } catch (err) {
        console.error("❌ Failed to create category:", err.response?.data || err);
        alert(err.response?.data?.error || "Failed to create new category");
        return;
      }
    }

    // ✅ Build final payload
    const item = {
      name,
      price: Number(price),
      description,
      categoryId, // use the resolved ID
      stockLimit: Number(stock),
      availability: available,
      photoUrl,
    };

    // ✅ Call parent handler
    if (onAdd) onAdd(item);

    // ✅ Reset form
    setName("");
    setPrice("");
    setDescription("");
    setCategory("");
    setNewCategory("");
    setShowNewCategory(false);
    setStock(0);
    setAvailable(true);
    setPreview(null);
    onClose();
  };

  useEffect(() => {
    return () => {
      if (preview) {
        // Clean up object URL if necessary (though reader.result is base64, not URL.createObjectURL)
        // If you were using URL.createObjectURL, this cleanup would be vital.
        // For base64, no explicit revocation is strictly needed.
      }
    };
  }, [preview]);

  if (!open) return null;

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === "add-new") {
      setShowNewCategory(true);
      setCategory("");
    } else {
      setCategory(value);
      setShowNewCategory(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[600px] relative">
        <button
          className="absolute top-2 right-2 text-red-500 font-bold"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-lg font-semibold mb-4">Add New Menu Item</h2>
        <form className="space-y-4" onSubmit={handleSubmit}> {/* Increased space-y */}
          {/* Item Image */}
          <div>
            <label className="block font-medium mb-1 text-sm">Item Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover rounded"
              />
            )}
          </div>

          {/* Item Name and Price */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-medium mb-1 text-sm">Item Name</label>
              <Input
                placeholder="e.g., Chicken Adobo"
                className="w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1 text-sm">Price</label>
              <Input
                type="number"
                placeholder="₱0.00"
                className="w-full"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-1 text-sm">Description</label>
            <textarea
              placeholder="Describe the menu item..."
              className="w-full border rounded p-2 text-sm" // Added text-sm for smaller font
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Category and Stock Quantity */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-medium mb-1 text-sm">Category</label>
              <select
                value={category}
                onChange={handleCategoryChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
                <option value="add-new">+ Add New Category</option>
              </select>
              {showNewCategory && (
                <Input
                  className="mt-2 text-sm" // Added text-sm
                  placeholder="Type new category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  required
                />
              )}
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1 text-sm">Stock Quantity</label>
              <div className="flex items-center gap-1 border rounded w-full"> {/* Combined border and rounded here */}
                <button
                  type="button"
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-l" // Styled buttons
                  onClick={() => setStock((q) => Math.max(0, q - 1))}
                >
                  -
                </button>
                <Input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="flex-1 text-center border-y-0 border-x text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-y-0 focus:border-x px-0" // Input with no borders
                  min="0"
                />
                <button
                  type="button"
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-r" // Styled buttons
                  onClick={() => setStock((q) => q + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Available for Order */}
          <div className="flex items-center gap-2 mt-2">
            <Switch checked={available} onCheckedChange={setAvailable} id="available-switch" />
            <div>
              <label htmlFor="available-switch" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Available for Order</label>
              <p className="text-xs text-gray-500">Toggle to show/hide item from customer menu</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4"> {/* Increased pt */}
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#6B8E23] hover:bg-[#5C7A1E]">Add Item</Button> {/* Green button */}
          </div>
        </form>
      </div>
    </div>
  );
}

AddItem.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func,
  categories: PropTypes.array,
  fetchCategories: PropTypes.func,
};

export default AddItem;