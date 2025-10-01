import { useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { 
  Search, 
  ShoppingCart, 
  Heart,
  Clock,
  User,
  LogOut,
  BookOpen
} from "lucide-react";
import { cn } from "../lib/utils";

export default function StudentDashboard() {
  const { user, logoutMutation } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => logoutMutation.mutate();

  // Mock menu data aligned with Prisma schema
  const menuCategories = [
    {
      id: "cat-1",
      name: "Main Dishes",
      description: "Hearty main courses",
      items: [
        {
          id: "item-1",
          name: "Chicken Adobo",
          description: "Traditional Filipino chicken adobo with rice",
          price: 85.00,
          photoUrl: null,
          availability: true,
          stockLimit: 50,
          categoryId: "cat-1"
        },
        {
          id: "item-2",
          name: "Beef Steak",
          description: "Tender beef steak with garlic rice",
          price: 95.00,
          photoUrl: null,
          availability: true,
          stockLimit: 30,
          categoryId: "cat-1"
        },
        {
          id: "item-3",
          name: "Pork Sisig",
          description: "Crispy pork sisig with egg",
          price: 75.00,
          photoUrl: null,
          availability: false,
          stockLimit: 25,
          categoryId: "cat-1"
        }
      ]
    },
    {
      id: "cat-2",
      name: "Beverages",
      description: "Refreshing drinks",
      items: [
        {
          id: "item-4",
          name: "Fresh Orange Juice",
          description: "Freshly squeezed orange juice",
          price: 25.00,
          photoUrl: null,
          availability: true,
          stockLimit: 100,
          categoryId: "cat-2"
        },
        {
          id: "item-5",
          name: "Iced Coffee",
          description: "Cold brewed coffee with ice",
          price: 35.00,
          photoUrl: null,
          availability: true,
          stockLimit: 50,
          categoryId: "cat-2"
        }
      ]
    }
  ];

  // Mock recent orders aligned with Prisma schema
  const recentOrders = [
    {
      id: "ord-001",
      status: "picked_up",
      pickupType: "dine_in",
      totalPrice: 120.00,
      createdAt: "2024-01-15T12:30:00Z",
      paymentStatus: "paid",
      orderItems: [
        { item: { name: "Chicken Adobo" }, quantity: 1, priceAtOrder: 85.00 },
        { item: { name: "Fresh Orange Juice" }, quantity: 1, priceAtOrder: 25.00 }
      ]
    },
    {
      id: "ord-002",
      status: "preparing",
      pickupType: "take_out",
      totalPrice: 95.00,
      createdAt: "2024-01-15T14:15:00Z",
      paymentStatus: "pending",
      orderItems: [
        { item: { name: "Beef Steak" }, quantity: 1, priceAtOrder: 95.00 }
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "picked_up": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "preparing": return "bg-blue-100 text-blue-800";
      case "ready": return "bg-purple-100 text-purple-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status) => {
    switch (status) {
      case "picked_up": return "Completed";
      case "pending": return "Pending";
      case "preparing": return "Preparing";
      case "ready": return "Ready for Pickup";
      case "rejected": return "Rejected";
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Student Portal</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.fullName}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search menu items..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
            <Button variant="outline" size="sm">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <ShoppingCart className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Welcome Section */}
        <div className="mb-8 p-6 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex items-center space-x-4">
            <User className="h-12 w-12 text-blue-200" />
            <div>
              <h2 className="text-2xl font-semibold">Welcome, {user?.fullName}!</h2>
              <p className="text-blue-100">Student ID: {user?.studentId}</p>
              <p className="text-blue-200 text-sm">Browse our delicious menu and place your orders</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Menu Section */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Today&apos;s Menu</h3>
            
            {menuCategories.map((category) => (
              <Card key={category.id} className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{category.name}</CardTitle>
                  <p className="text-gray-600 text-sm">{category.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {category.items.map((item) => (
                      <div 
                        key={item.id}
                        className={cn(
                          "flex items-center justify-between p-4 border rounded-lg",
                          item.availability ? "bg-white" : "bg-gray-50 opacity-75"
                        )}
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            {!item.availability && (
                              <Badge variant="secondary" className="bg-red-100 text-red-800">
                                Out of Stock
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                          <p className="text-gray-500 text-xs mt-2">
                            Stock: {item.stockLimit} available
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="font-semibold text-gray-900">₱{item.price.toFixed(2)}</span>
                          <Button 
                            size="sm" 
                            disabled={!item.availability}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order History Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Recent Orders</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-gray-900">#{order.id}</span>
                        <Badge className={getStatusColor(order.status)}>
                          {formatStatus(order.status)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        {order.orderItems.map((orderItem, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-700">
                              {orderItem.item.name} x{orderItem.quantity}
                            </span>
                            <span className="font-medium">
                              ₱{orderItem.priceAtOrder.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Total:</span>
                          <span className="font-semibold">₱{order.totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>{formatDate(order.createdAt)}</span>
                          <span>{formatTime(order.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                  View All Orders
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
