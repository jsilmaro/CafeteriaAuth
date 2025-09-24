import { useState } from "react";
import { useOrders } from "@/hooks/use-orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import SharedSidebar from "@/components/shared-sidebar";
import { type Order } from "@shared/schema";

export default function PreparingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Preparing');
  
  const { orders, isLoading, error, updateOrderMutation, refetch } = useOrders();

  const statusOptions = ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

  const handleMarkAsReady = (orderId: string) => {
    updateOrderMutation.mutate({ 
      id: orderId, 
      updates: { status: 'Ready' } 
    });
  };

  // Filter orders based on search query and status
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    const matchesSearch = 
      order.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.studentId.includes(searchQuery) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#6A972E]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load orders: {error.message}</p>
          <Button onClick={() => refetch()} data-testid="retry-button">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <SharedSidebar>
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#6A972E] rounded-lg flex items-center justify-center text-white font-bold text-lg">
              F
            </div>
            <h1 className="text-2xl font-bold text-gray-900">FASPeCC</h1>
          </div>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 rounded-full"
                data-testid="search-preparing-orders-input"
              />
              <Button 
                variant="ghost" 
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                data-testid="filter-button"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Page Header */}
        <div className="bg-[#6A972E] text-white p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-bold">Order Management</h2>
          <p className="text-green-100 mt-1">Manage and track all cafeteria orders in real-time.</p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {statusOptions.map((status) => (
            <Button
              key={status}
              variant="outline"
              onClick={() => setStatusFilter(status)}
              className={`px-6 py-2 rounded-full border ${
                statusFilter === status 
                  ? 'bg-black text-white border-black hover:bg-black' 
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
              data-testid={`status-filter-${status.toLowerCase()}`}
            >
              {status}
            </Button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4" data-testid="preparing-orders-list">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No orders found matching your criteria.
            </div>
          ) : (
            filteredOrders.map((order) => (
            <Card key={order.id} className="bg-white shadow-sm rounded-lg border">
              <CardContent className="p-6">
                <div className="flex justify-between">
                  {/* Left side - Order details */}
                  <div className="flex-1">
                    {/* Order ID and Status */}
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{order.id}</h3>
                      <Badge 
                        className="bg-orange-100 text-orange-800 border-orange-200 font-medium px-3 py-1"
                        data-testid={`status-badge-${order.id}`}
                      >
                        {order.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      {/* Customer Details */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Customer Details</h4>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-gray-600">Student Name</p>
                            <p className="font-medium text-gray-900">{order.studentName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Student ID</p>
                            <p className="font-medium text-gray-900">{order.studentId}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Payment Method</p>
                            <Badge variant="outline" className="mt-1">
                              {order.paymentMethod}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Order Items</h4>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between">
                              <span className="text-gray-700">{item.name} x{item.quantity}</span>
                              <span className="font-medium">₱{item.price.toFixed(2)}</span>
                            </div>
                          ))}
                          <div className="border-t pt-2 mt-3">
                            <div className="flex justify-between font-semibold">
                              <span>Total Amount</span>
                              <span>₱{order.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Times and Actions */}
                  <div className="ml-8 text-right flex flex-col justify-between min-w-[200px]">
                    <div className="mb-8">
                      <p className="text-sm text-gray-600 mb-1">Pickup Time</p>
                      <p className="font-medium text-gray-900">{order.pickupTime}</p>
                    </div>
                    
                    <div className="mb-8">
                      <p className="text-sm text-gray-600 mb-1">Order Time</p>
                      <p className="font-medium text-gray-900">{order.orderTime}</p>
                    </div>
                    
                    {order.status === 'Preparing' && (
                      <div>
                        <Button 
                          onClick={() => handleMarkAsReady(order.id)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium"
                          data-testid={`mark-ready-order-${order.id}`}
                          disabled={updateOrderMutation.isPending}
                        >
                          {updateOrderMutation.isPending ? 'Processing...' : 'Mark as Ready'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            ))
          )}
        </div>
      </div>
    </SharedSidebar>
  );
}