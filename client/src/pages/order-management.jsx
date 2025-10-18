import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Filter, Search, Loader2 } from "lucide-react";
import { useOrders } from "../hooks/use-orders";
import SharedSidebar from "../components/shared-sidebar";

export default function OrderManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Pending");

  const { orders, isLoading, error, updateOrderMutation, refetch } = useOrders();

  const statusOptions = ["Pending", "Preparing", "Ready", "Completed", "Cancelled"];

  const handleAccept = (orderId) => {
    updateOrderMutation.mutate({
      id: orderId,
      updates: { status: "Preparing" },
    });
  };

  const handleReject = (orderId) => {
    updateOrderMutation.mutate({
      id: orderId,
      updates: { status: "Cancelled" },
    });
  };

  const handleMarkAsReady = (orderId) => {
    updateOrderMutation.mutate({
      id: orderId,
      updates: { status: "Ready" },
    });
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      order.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.studentId.includes(searchQuery) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (isLoading) {
    return (
      <SharedSidebar>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#6A972E]" />
        </div>
      </SharedSidebar>
    );
  }

  if (error) {
    return (
      <SharedSidebar>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">
              Failed to load orders: {error.message}
            </p>
            <Button onClick={() => refetch()}>Retry</Button>
          </div>
        </div>
      </SharedSidebar>
    );
  }

  return (
    <SharedSidebar>
      {/* Header */}
      <div className="bg-white border-b px-4 sm:px-6 py-4 sticky top-0 z-20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#6A972E] rounded-lg flex items-center justify-center text-white font-bold text-lg">
              F
            </div>
            <h1 className="text-2xl font-bold text-gray-900">FASPeCC</h1>
          </div>

          {/* Search Bar */}
          <div className="w-full sm:w-auto flex-1 max-w-md mx-auto sm:mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 rounded-full w-full"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
        {/* Page Header */}
        <div className="bg-[#6A972E] text-white p-4 sm:p-6 rounded-lg mb-6">
          <h2 className="text-xl sm:text-2xl font-bold">Order Management</h2>
          <p className="text-green-100 mt-1 text-sm sm:text-base">
            Manage and track all cafeteria orders in real-time.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-6">
          {statusOptions.map((status) => (
            <Button
              key={status}
              variant="outline"
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 text-sm rounded-full border ${
                statusFilter === status
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {status}
            </Button>
          ))}
        </div>

        {/* Orders List */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4" data-testid="orders-list">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500 col-span-full">
              No orders found matching your criteria.
            </div>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="bg-white shadow-sm rounded-lg border">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col md:flex-row justify-between md:items-start gap-6">
                    {/* Left Section */}
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 break-words">
                          {order.id}
                        </h3>
                        <Badge
                          className={`px-3 py-1 text-xs rounded-full ${
                            order.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "Preparing"
                              ? "bg-orange-100 text-orange-800"
                              : order.status === "Ready"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {order.status.toUpperCase()}
                        </Badge>
                      </div>

                      {/* Customer + Order Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3">
                            Customer Details
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p>
                              <span className="text-gray-600">Name: </span>
                              <span className="font-medium">{order.studentName}</span>
                            </p>
                            <p>
                              <span className="text-gray-600">ID: </span>
                              <span className="font-medium">{order.studentId}</span>
                            </p>
                            <p>
                              <span className="text-gray-600">Payment: </span>
                              <Badge variant="outline" className="text-gray-700 bg-gray-100">
                                {order.paymentMethod}
                              </Badge>
                            </p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3">
                            Order Items
                          </h4>
                          <div className="space-y-1 text-sm">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex justify-between">
                                <span className="truncate">
                                  {item.name} x{item.quantity}
                                </span>
                                <span>₱{item.price.toFixed(2)}</span>
                              </div>
                            ))}
                            <div className="border-t border-gray-200 pt-2 font-semibold text-gray-900">
                              Total: ₱{order.total.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="md:text-right flex flex-col justify-between min-w-[180px] gap-4">
                      <div className="text-sm space-y-1">
                        <p className="text-gray-600">Pickup Time</p>
                        <p className="font-medium text-gray-900">{order.pickupTime}</p>
                        <p className="text-gray-600 mt-2">Order Time</p>
                        <p className="font-medium text-gray-900">{order.orderTime}</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap md:flex-col gap-2">
                        {order.status === "Pending" && (
                          <>
                            <Button
                              onClick={() => handleAccept(order.id)}
                              className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-md w-full"
                              disabled={updateOrderMutation.isPending}
                            >
                              Accept
                            </Button>
                            <Button
                              onClick={() => handleReject(order.id)}
                              className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-md w-full"
                              disabled={updateOrderMutation.isPending}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {order.status === "Preparing" && (
                          <Button
                            onClick={() => handleMarkAsReady(order.id)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-4 py-2 rounded-md w-full"
                            disabled={updateOrderMutation.isPending}
                          >
                            Mark as Ready
                          </Button>
                        )}
                      </div>
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
