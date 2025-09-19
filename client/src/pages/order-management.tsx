import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Filter, Search, X, Loader2 } from 'lucide-react';
import { type Order } from '@shared/schema';
import { useOrders } from '@/hooks/use-orders';

export default function OrderManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Pending');
  
  const { orders, isLoading, error, updateOrderMutation } = useOrders();

  const statusOptions = ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

  const handleAccept = (orderId: string) => {
    updateOrderMutation.mutate({ 
      id: orderId, 
      updates: { status: 'Preparing' } 
    });
  };

  const handleReject = (orderId: string) => {
    updateOrderMutation.mutate({ 
      id: orderId, 
      updates: { status: 'Cancelled' } 
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'default';
      case 'Preparing':
        return 'secondary';
      case 'Ready':
        return 'outline';
      case 'Completed':
        return 'default';
      case 'Cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  };

  // Filter orders by status and search query
  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    const matchesSearch = !searchQuery || 
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
          <Button onClick={() => window.location.reload()} data-testid="retry-button">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
                className="pl-10 pr-10"
                data-testid="search-orders-input"
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
              variant={statusFilter === status ? "default" : "outline"}
              onClick={() => setStatusFilter(status)}
              className={`px-6 py-2 rounded-full ${
                statusFilter === status 
                  ? 'bg-black text-white' 
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
              data-testid={`status-filter-${status.toLowerCase()}`}
            >
              {status === 'Pending' && <X className="mr-2 h-4 w-4" />}
              {status}
            </Button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4" data-testid="orders-list">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No orders found matching your criteria.
            </div>
          ) : (
            filteredOrders.map((order) => (
            <Card key={order.id} className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-lg font-semibold">{order.id}</h3>
                      <Badge 
                        variant="secondary" 
                        className="bg-orange-100 text-orange-800 font-medium"
                        data-testid={`order-status-${order.status.toLowerCase()}`}
                      >
                        {order.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Customer Details</h4>
                        <p className="text-gray-600 text-sm mb-1">Student Name</p>
                        <p className="font-medium mb-2">{order.studentName}</p>
                        <p className="text-gray-600 text-sm mb-1">Student ID</p>
                        <p className="font-medium mb-3">{order.studentId}</p>
                        <p className="text-gray-600 text-sm mb-1">Payment Method</p>
                        <Badge variant="outline" className="bg-gray-100">
                          {order.paymentMethod}
                        </Badge>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Order Items</h4>
                        <div className="space-y-1 mb-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span className="text-gray-700">{item.name} x{item.quantity}</span>
                              <span className="font-medium">₱{item.price.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between font-semibold">
                            <span>Total Amount</span>
                            <span>₱{order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="ml-8 text-right">
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-1">Pickup Time</p>
                      <p className="font-medium">{order.pickupTime}</p>
                    </div>
                    <div className="mb-6">
                      <p className="text-sm text-gray-600 mb-1">Order Time</p>
                      <p className="font-medium">{order.orderTime}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleAccept(order.id)}
                        className="bg-[#6A972E] hover:bg-[#5A8125] text-white px-6"
                        data-testid={`accept-order-${order.id}`}
                        disabled={updateOrderMutation.isPending}
                      >
                        {updateOrderMutation.isPending ? 'Processing...' : 'Accept'}
                      </Button>
                      <Button 
                        onClick={() => handleReject(order.id)}
                        variant="destructive"
                        className="px-6"
                        data-testid={`reject-order-${order.id}`}
                        disabled={updateOrderMutation.isPending}
                      >
                        {updateOrderMutation.isPending ? 'Processing...' : 'Reject'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}