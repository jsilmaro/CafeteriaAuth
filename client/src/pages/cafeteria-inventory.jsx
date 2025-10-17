import {
  CircleAlert,
  CircleCheck,
  CircleX,
  LayoutGrid,
  Plus,
  Search,
  ChevronRight,
  Filter,
} from "lucide-react";
import SharedSidebar from "../components/shared-sidebar";
import { Button } from "../components/ui/button";
import { useState, useEffect } from "react";
import FoodCard from "../components/food-card";
import EditItemModal from "../components/edit-item";
import AddItemModal from "../components/add-item";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../components/ui/dropdown-menu";

import api from "@/lib/api";

function CafeteriaInventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filter, setFilter] = useState("All Items");
  // ADDED: New state for category filter
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  const [inventoryItems, setInventoryItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get("/menu");
        setInventoryItems(res.data); // ✅ your backend should return an array of menu items
        console.log("📦 Loaded items:", res.data);
      } catch (err) {
        console.error("❌ Failed to fetch inventory:", err);
      }
    };

    fetchItems();
  }, []);

  // ✅ NEW: List of categories for the dropdown
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/menu/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Add Item (POST /menu)
  const handleAddItem = async (newItem) => {
    try {
      // Map frontend fields to backend expected keys
      const payload = {
        name: newItem.name,
        description: newItem.description,
        price: Number(newItem.price),
        availability: newItem.availability ?? true,
        stockLimit: Number(newItem.stockLimit),
        categoryId: newItem.categoryId || newItem.category, // depending on your AddItemModal
        photoUrl: newItem.photoURL || newItem.photoUrl || "",
      };

      const response = await api.post("/menu", payload);
      const savedItem = response.data;

      setInventoryItems((prev) => [...prev, savedItem]);
      setIsAddModalOpen(false);
      console.log("✅ Item added:", savedItem);
    } catch (error) {
      console.error("❌ Failed to add item:", error);
      alert(error.response?.data?.error || "Failed to save item");
    }
  };

  // ✅ Save / Update Item (PUT /menu/:id)
  const handleSaveItem = async (updatedItem) => {
    try {
      const payload = {
        name: updatedItem.name,
        description: updatedItem.description,
        price: Number(updatedItem.price),
        availability: updatedItem.availability,
        stockLimit: Number(updatedItem.stockLimit),
        categoryId: updatedItem.categoryId || updatedItem.category,
        ...(updatedItem.photoURL || updatedItem.photoUrl
          ? { photoUrl: updatedItem.photoURL || updatedItem.photoUrl }
          : {}),
      };

      let response;

      if (updatedItem.id) {
        // 🧩 Update existing item
        response = await api.put(`/menu/${updatedItem.id}`, payload);
        setInventoryItems((prev) =>
          prev.map((item) =>
            item.id === updatedItem.id ? response.data : item
          )
        );
        console.log("✅ Item updated:", response.data);
      } else {
        // 🧩 Create new one
        response = await api.post(`/menu`, payload);
        setInventoryItems((prev) => [...prev, response.data]);
        console.log("✅ Item created:", response.data);
      }

      setIsEditModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error("❌ Failed to save item:", error);
      alert(error.response?.data?.error || "Failed to save item");
    }
  };

  // ✅ Delete Item (DELETE /menu/:id)
  const handleDeleteItem = async (itemId) => {
    try {
      await api.delete(`/menu/${itemId}`);
      setInventoryItems((prev) => prev.filter((item) => item.id !== itemId));
      console.log("🗑️ Item deleted:", itemId);
      setIsEditModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error("❌ Failed to delete item:", error);
      alert(error.response?.data?.error || "Failed to delete item");
    }
  };

  // ✅ Search
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // UPDATED: Now filters by both availability and category
  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesAvailabilityFilter = true;
    if (filter === "Available") matchesAvailabilityFilter = item.availability && item.stockLimit > 0;
    if (filter === "Low Stock") matchesAvailabilityFilter = item.stockLimit > 0 && item.stockLimit < 5;
    if (filter === "Sold Out") matchesAvailabilityFilter = item.stockLimit === 0;

    const matchesCategoryFilter =
      categoryFilter === "All Categories" || item.category?.name === categoryFilter;

    return matchesSearch && matchesAvailabilityFilter && matchesCategoryFilter;
  });

  const inventoryData = [
    {
      name: "Total Items",
      numberOfItems: filteredItems.length,
      icon: <LayoutGrid size={24} color="#6A972E" />,
    },
    {
      name: "Available",
      numberOfItems: filteredItems.filter((i) => i.availability && i.stockLimit > 0).length,
      icon: <CircleCheck size={24} color="#22C55E" />,
    },
    {
      name: "Low Stock",
      numberOfItems: filteredItems.filter((i) => i.stockLimit > 0 && i.stockLimit < 5).length,
      icon: <CircleAlert size={24} color="#FACC15" />,
    },
    {
    name: "Sold Out",
      numberOfItems: filteredItems.filter((i) => i.stockLimit === 0).length,
      icon: <CircleX size={24} color="#EF4444" />,
    },
  ];

  return (
    <SharedSidebar>
      {/* Top Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">Inventory Management</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input 
                  placeholder="Search" 
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 w-full sm:w-60 md:w-80 border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6 flex flex-col gap-6 sm:gap-8">
        {/* Page Header */}
        <div className="bg-[#6B8E23] text-white p-4 sm:p-6 lg:p-8 rounded-lg flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 min-h-[100px] sm:min-h-[120px]">
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Inventory Management</h2>
            <p className="text-green-100 mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg">Track stock levels, update product quantities, and manage suppliers</p>
          </div>
          <div className="w-full lg:w-auto lg:ml-6">
            <Button
              className="bg-[#9CAF88] text-black px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-lg text-sm sm:text-base lg:text-lg font-semibold flex items-center justify-center gap-2 sm:gap-3 hover:bg-[#8CA86E] shadow-lg w-full lg:w-auto"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus size={20} className="sm:w-6 sm:h-6 lg:w-7 lg:h-7" /> Add New Item
            </Button>
          </div>
        </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex-1 sm:w-48 justify-between">
                  <span className="truncate">Availability: {filter}</span>
                  <ChevronRight className="ml-2 h-4 w-4 flex-shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem onClick={() => setFilter("All Items")}>
                  All Items
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("Available")}>
                  Available
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("Low Stock")}>
                  Low Stock
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("Sold Out")}>
                  Sold Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* NEW: Second dropdown for categories */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex-1 sm:w-48 justify-between">
                  <span>Category: {categoryFilter}</span>
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem onClick={() => setCategoryFilter("All Categories")}>
                  All Categories
                </DropdownMenuItem>

                {categories.map((cat) => (
                  <DropdownMenuItem
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.name)}
                  >
                    {cat.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {inventoryData.map((item, index) => (
              <div key={index} className="bg-white p-3 sm:p-4 rounded-lg shadow">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:p-3">
                  <div className="flex flex-col gap-1 flex-1">
                    <h3 className="text-gray-600 text-xs sm:text-sm">{item.name}</h3>
                    <p className="text-lg sm:text-xl lg:text-2xl font-semibold">
                      {item.numberOfItems} items
                    </p>
                  </div>
                  <div className="bg-gray-100 p-2 sm:p-3 rounded-full flex-shrink-0">
                    <div className="text-gray-600">{item.icon}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filteredItems.map((food) => (
              <FoodCard
                key={food.id}
                name={food.name}
                description={food.description}
                price={food.price}
                availability={food.availability}
                stockLimit={food.stockLimit} // ✅ match backend
                photoURL={food.photoUrl}        // ✅ match backend
                onEdit={() => {
                  setEditingItem(food);
                  setIsEditModalOpen(true);
                }}
              />
            ))}
          </div>

          <EditItemModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingItem(null);
            }}
            onSave={handleSaveItem}           // ✅ calls backend (PUT /api/menu/:id)
            onDelete={handleDeleteItem}       // ✅ calls backend (DELETE /api/menu/:id)
            item={editingItem}
            categories={categories} // ✅ fix category type warning
          />

          <AddItemModal
            open={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAdd={handleAddItem} // ✅ already hooked to backend
            categories={categories}
            fetchCategories={fetchCategories}
          />
        </div>
    </SharedSidebar>
  );
}

export default CafeteriaInventory;