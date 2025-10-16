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
import { useState } from "react";
import FoodCard from "../components/food-card";
import EditItemModal from "../components/edit-item";
import AddItemModal from "../components/add-item";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../components/ui/dropdown-menu";

function CafeteriaInventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filter, setFilter] = useState("All Items");
  // ADDED: New state for category filter
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  const [inventoryItems, setInventoryItems] = useState([
    {
      id: 1,
      name: "Chicken Adobo",
      description:
        "A popular Filipino dish consisting of chicken braised in a savory and tangy sauce.",
      price: "50 PHP",
      availability: true,
      amountOfStock: 15,
      photoURL:
        "https://images.pexels.com/photos/6525933/pexels-photo-6525933.jpeg",
      category: "Value Meals",
    },
    {
      id: 2,
      name: "Pancit Canton",
      description: "Stir-fried noodles with vegetables, meat, and savory sauce.",
      price: "40 PHP",
      availability: true,
      amountOfStock: 10,
      photoURL:
        "https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg",
      category: "Short Order",
    },
    {
      id: 3,
      name: "Lumpiang Shanghai",
      description: "Crispy spring rolls filled with ground pork and vegetables.",
      price: "30 PHP",
      availability: true,
      amountOfStock: 20,
      photoURL:
        "https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg",
      category: "Snacks",
    },
    {
      id: 4,
      name: "Sinigang na Baboy",
      description: "Pork soup with sour tamarind broth and assorted vegetables.",
      price: "60 PHP",
      availability: false,
      amountOfStock: 0,
      photoURL:
        "https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg",
      category: "Value Meals",
    },
    {
      id: 5,
      name: "Tocino",
      description: "Sweet cured pork served with garlic rice and egg.",
      price: "45 PHP",
      availability: true,
      amountOfStock: 4,
      photoURL:
        "https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg",
      category: "Packed Meals",
    },
    {
      id: 6,
      name: "Bicol Express",
      description: "Spicy pork stew cooked in coconut milk and chili peppers.",
      price: "55 PHP",
      availability: true,
      amountOfStock: 12,
      photoURL:
        "https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg",
      category: "Packed Meals",
    },
  ]);

  // NEW: List of categories for the dropdown
  const categories = [
    "All Categories",
    "Snacks",
    "Budget Snacks",
    "Value Meals",
    "Packed Meals",
    "Buffet",
    "Short Order",
  ];

  const handleDeleteItem = (itemId) => {
    setInventoryItems((currentItems) =>
      currentItems.filter((item) => item.id !== itemId)
    );
    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // UPDATED: Now filters by both availability and category
  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesAvailabilityFilter = true;
    if (filter === "Available") matchesAvailabilityFilter = item.availability && item.amountOfStock > 0;
    if (filter === "Low Stock") matchesAvailabilityFilter = item.amountOfStock > 0 && item.amountOfStock < 5;
    if (filter === "Sold Out") matchesAvailabilityFilter = item.amountOfStock === 0;

    const matchesCategoryFilter =
      categoryFilter === "All Categories" || item.category === categoryFilter;

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
      numberOfItems: filteredItems.filter((i) => i.availability && i.amountOfStock > 0).length,
      icon: <CircleCheck size={24} color="#22C55E" />,
    },
    {
      name: "Low Stock",
      numberOfItems: filteredItems.filter((i) => i.amountOfStock > 0 && i.amountOfStock < 5).length,
      icon: <CircleAlert size={24} color="#FACC15" />,
    },
    {
    name: "Sold Out",
      numberOfItems: filteredItems.filter((i) => i.amountOfStock === 0).length,
      icon: <CircleX size={24} color="#EF4444" />,
    },
  ];

  return (
    <SharedSidebar>
      {/* Top Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-gray-900">Inventory Management</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input 
                placeholder="Search" 
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 w-80 border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 flex flex-col gap-8">
        {/* Page Header */}
        <div className="bg-[#6B8E23] text-white p-8 rounded-lg mb-6 flex items-center justify-between min-h-[120px]">
          <div className="flex-1">
            <h2 className="text-3xl font-bold">Inventory Management</h2>
            <p className="text-green-100 mt-2 text-lg">Track stock levels, update product quantities, and manage suppliers</p>
          </div>
          <div className="ml-6">
            <Button
              className="bg-[#9CAF88] text-black px-8 py-4 rounded-lg text-lg font-semibold flex items-center gap-3 hover:bg-[#8CA86E] shadow-lg"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus size={28} /> Add New Item
            </Button>
          </div>
        </div>

          <div className="flex gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-48 flex justify-between items-center">
                  <span>Availability: {filter}</span>
                  <ChevronRight className="ml-2 h-4 w-4" />
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
                <Button variant="outline" className="w-48 flex justify-between items-center">
                  <span>Category: {categoryFilter}</span>
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {categories.map((cat) => (
                  <DropdownMenuItem
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                  >
                    {cat}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {inventoryData.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center justify-between p-3">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-gray-600 text-sm">{item.name}</h3>
                    <p className="text-2xl font-semibold">
                      {item.numberOfItems} items
                    </p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-full">
                    <div className="text-gray-600">{item.icon}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-8">
            {filteredItems.map((food) => (
              <FoodCard
                key={food.id}
                name={food.name}
                description={food.description}
                price={food.price}
                availability={food.availability}
                amountOfStock={food.amountOfStock}
                photoURL={food.photoURL}
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
            onSave={(updatedItem) => {
              setInventoryItems((items) =>
                items.map((item) =>
                  item.id === editingItem.id ? { ...item, ...updatedItem } : item
                )
              );
              setIsEditModalOpen(false);
              setEditingItem(null);
            }}
            onDelete={handleDeleteItem}
            item={editingItem}
          />

          <AddItemModal
            open={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAdd={(newItem) => {
              setInventoryItems((items) => [
                ...items,
                { ...newItem, id: items.length + 1 },
              ]);
              setIsAddModalOpen(false);
            }}
          />
        </div>
    </SharedSidebar>
  );
}

export default CafeteriaInventory;