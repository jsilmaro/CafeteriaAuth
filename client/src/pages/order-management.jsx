import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Filter, Search, Loader2 } from 'lucide-react';
import { useOrders } from '../hooks/use-orders';
import SharedSidebar from "../components/shared-sidebar";

export default function OrderManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Pending');
  
  const { orders, isLoading, error, updateOrderMutation, refetch } = useOrders();

  // 🧩 Normalize frontend status names to match backend enum
  const normalizeStatus = (status) => {
    const map = {
      Pending: "pending",
      Preparing: "preparing",
      Ready: "ready",
      Completed: "picked_up",
      Cancelled: "rejected",
    };
    return map[status] || status.toLowerCase();
  };

  const statusOptions = ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

  const handleAccept = (orderId) => {
    updateOrderMutation.mutate({ 
      id: orderId, 
      status: normalizeStatus('Preparing') 
    });
  };

  const handleReject = (orderId) => {
    updateOrderMutation.mutate({ 
      id: orderId, 
      status: normalizeStatus('Cancelled') 
    });
  };

  const handleMarkAsReady = (orderId) => {
    updateOrderMutation.mutate({ 
      id: orderId, 
      status: normalizeStatus('Ready') 
    });
  };

  // Filter orders by status and search query
  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'All' || normalizeStatus(order.status) === normalizeStatus(statusFilter);
    const matchesSearch = !searchQuery || 
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
            <p className="text-red-600 mb-4">Failed to load orders: {error.message}</p>
            <Button onClick={() => refetch()} data-testid="retry-button">
              Retry
            </Button>
          </div>
        </div>
      </SharedSidebar>
    );
  }

  return (
    <SharedSidebar>
      {/* Top Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">Order Management</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input 
                  placeholder="Search" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-60 md:w-80 border border-gray-300 rounded-md px-3 py-2 text-sm"
                  data-testid="search-orders-input"
                />
              </div>
              <Button variant="outline" size="sm" data-testid="filter-button">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-4 sm:p-6">
        {/* Page Header */}
        <div className="bg-[#6B8E23] text-white p-4 sm:p-6 rounded-lg mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold">Order Management</h2>
          <p className="text-green-100 mt-1 text-sm sm:text-base">Manage and track all cafeteria orders in real-time.</p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
          {statusOptions.map((status) => (
            <Button
              key={status}
              variant="outline"
              onClick={() => setStatusFilter(status)}
              className={`px-3 sm:px-4 md:px-6 py-2 rounded-full border text-xs sm:text-sm ${
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
        <div className="space-y-3 sm:space-y-4" data-testid="orders-list">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm sm:text-base">
              No orders found matching your criteria.
            </div>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="bg-white shadow-sm rounded-lg border">
                <CardContent className="p-4 sm:p-6">
                  {/* Pending Orders Design */}
                  {order.status === 'Pending' && (
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-4 lg:gap-0">
                      <div className="flex-1 w-full">
                        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900">{order.id}</h3>
                          <Badge 
                            className="bg-orange-100 text-orange-800 font-medium px-2 sm:px-3 py-1 rounded-full text-xs"
                            data-testid={`order-status-${order.status.toLowerCase()}`}
                          >
                            {order.status.toUpperCase()}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Customer Details</h4>
                            <div className="space-y-2 sm:space-y-3">
                              <div>
                                <p className="text-gray-600 text-xs sm:text-sm mb-1">Student Name</p>
                                <p className="font-medium text-gray-900 text-sm sm:text-base">{order.studentName}</p>
                              </div>
                              <div>
                                <p className="text-gray-600 text-xs sm:text-sm mb-1">Student ID</p>
                                <p className="font-medium text-gray-900 text-sm sm:text-base">{order.studentId}</p>
                              </div>
                              <div>
                                <p className="text-gray-600 text-xs sm:text-sm mb-1">Payment Method</p>
                                <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300 font-normal text-xs">
                                  {order.paymentMethod}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Order Items</h4>
                            <div className="space-y-2 mb-3 sm:mb-4">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-xs sm:text-sm">
                                  <span className="text-gray-700">{item.name} x{item.quantity}</span>
                                  <span className="font-medium text-gray-900">₱{item.price.toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                            <div className="border-t border-gray-200 pt-2 sm:pt-3">
                              <div className="flex justify-between text-sm sm:text-base font-semibold">
                                <span className="text-gray-900">Total Amount</span>
                                <span className="text-gray-900">₱{order.total.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="w-full lg:w-auto lg:ml-8 lg:min-w-[200px] flex flex-col gap-3 sm:gap-4 lg:text-right">
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600 mb-1">Pickup Time</p>
                          <p className="font-medium text-gray-900 text-sm sm:text-base">{order.pickupTime}</p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600 mb-1">Order Time</p>
                          <p className="font-medium text-gray-900 text-sm sm:text-base">{order.orderTime}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row lg:flex-col gap-2 sm:gap-3 mt-2 sm:mt-4">
                          <Button 
                            onClick={() => handleAccept(order.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 rounded-lg font-medium text-sm w-full sm:flex-1 lg:w-full"
                            data-testid={`accept-order-${order.id}`}
                            disabled={updateOrderMutation.isPending}
                          >
                            {updateOrderMutation.isPending ? 'Processing...' : 'Accept'}
                          </Button>
                          <Button 
                            onClick={() => handleReject(order.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2 rounded-lg font-medium text-sm w-full sm:flex-1 lg:w-full"
                            data-testid={`reject-order-${order.id}`}
                            disabled={updateOrderMutation.isPending}
                          >
                            {updateOrderMutation.isPending ? 'Processing...' : 'Reject'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Preparing Orders Design - Based on the image */}
                  {order.status === 'Preparing' && (
                    <div className="flex flex-col lg:flex-row justify-between gap-4 lg:gap-0">
                      {/* Left side - Order details */}
                      <div className="flex-1 w-full">
                        {/* Order ID and Status */}
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900">{order.id}</h3>
                          <Badge 
                            className="bg-orange-100 text-orange-800 border-orange-200 font-medium px-2 sm:px-3 py-1 text-xs"
                            data-testid={`status-badge-${order.id}`}
                          >
                            {order.status.toUpperCase()}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                          {/* Customer Details */}
                          <div>
                            <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">Customer Details</h4>
                            <div className="space-y-2">
                              <div>
                                <p className="text-xs sm:text-sm text-gray-600">Student name</p>
                                <p className="font-medium text-gray-900 text-sm sm:text-base">{order.studentName}</p>
                              </div>
                              <div>
                                <p className="text-xs sm:text-sm text-gray-600">Student ID</p>
                                <p className="font-medium text-gray-900 text-sm sm:text-base">{order.studentId}</p>
                              </div>
                              <div>
                                <p className="text-xs sm:text-sm text-gray-600">Payment Method</p>
                                <Badge variant="outline" className="mt-1 text-xs">
                                  {order.paymentMethod}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div>
                            <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">Order Items</h4>
                            <div className="space-y-2">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-xs sm:text-sm">
                                  <span className="text-gray-700">{item.name} x{item.quantity}</span>
                                  <span className="font-medium">₱{item.price.toFixed(2)}</span>
                                </div>
                              ))}
                              <div className="border-t pt-2 mt-3">
                                <div className="flex justify-between font-semibold text-sm sm:text-base">
                                  <span>Total Amount</span>
                                  <span>₱{order.total.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right side - Times and Actions */}
                      <div className="w-full lg:w-auto lg:ml-8 flex flex-col gap-3 sm:gap-4 lg:text-right lg:min-w-[200px]">
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600 mb-1">Pickup Time</p>
                          <p className="font-medium text-gray-900 text-sm sm:text-base">{order.pickupTime}</p>
                        </div>
                        
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600 mb-1">Order Time</p>
                          <p className="font-medium text-gray-900 text-sm sm:text-base">{order.orderTime}</p>
                        </div>
                        
                        <div className="mt-2 sm:mt-4">
                          <Button 
                            onClick={() => handleMarkAsReady(order.id)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium text-sm w-full"
                            data-testid={`mark-ready-order-${order.id}`}
                            disabled={updateOrderMutation.isPending}
                          >
                            {updateOrderMutation.isPending ? 'Processing...' : 'Mark as Ready'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Other Status Orders - Responsive design */}
                  {!['Pending', 'Preparing'].includes(order.status) && (
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-4 lg:gap-0">
                      <div className="flex-1 w-full">
                        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900">{order.id}</h3>
                          <Badge 
                            className="bg-orange-100 text-orange-800 font-medium px-2 sm:px-3 py-1 rounded-full text-xs"
                            data-testid={`order-status-${order.status.toLowerCase()}`}
                          >
                            {order.status.toUpperCase()}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Customer Details</h4>
                            <div className="space-y-2 sm:space-y-3">
                              <div>
                                <p className="text-gray-600 text-xs sm:text-sm mb-1">Student Name</p>
                                <p className="font-medium text-gray-900 text-sm sm:text-base">{order.studentName}</p>
                              </div>
                              <div>
                                <p className="text-gray-600 text-xs sm:text-sm mb-1">Student ID</p>
                                <p className="font-medium text-gray-900 text-sm sm:text-base">{order.studentId}</p>
                              </div>
                              <div>
                                <p className="text-gray-600 text-xs sm:text-sm mb-1">Payment Method</p>
                                <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300 font-normal text-xs">
                                  {order.paymentMethod}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Order Items</h4>
                            <div className="space-y-2 mb-3 sm:mb-4">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-xs sm:text-sm">
                                  <span className="text-gray-700">{item.name} x{item.quantity}</span>
                                  <span className="font-medium text-gray-900">₱{item.price.toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                            <div className="border-t border-gray-200 pt-2 sm:pt-3">
                              <div className="flex justify-between text-sm sm:text-base font-semibold">
                                <span className="text-gray-900">Total Amount</span>
                                <span className="text-gray-900">₱{order.total.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="w-full lg:w-auto lg:ml-12 flex flex-col gap-3 sm:gap-4 lg:text-right">
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600 mb-1">Pickup Time</p>
                          <p className="font-medium text-gray-900 text-sm sm:text-base">{order.pickupTime}</p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600 mb-1">Order Time</p>
                          <p className="font-medium text-gray-900 text-sm sm:text-base">{order.orderTime}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </SharedSidebar>
  );
}