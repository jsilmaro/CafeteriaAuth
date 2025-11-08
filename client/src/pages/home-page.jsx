import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Loader2, Search, Filter, Users, DollarSign } from "lucide-react";
import { cn } from "../lib/utils";
import SharedSidebar from "../components/shared-sidebar";
import { useOrders } from "../hooks/use-orders"; // ✅ your existing hook

export default function HomePage() {
  const { orders, isLoading, error } = useOrders();
  const [searchQuery, setSearchQuery] = useState("");

  // 🧮 Compute dashboard stats dynamically
  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayOrders = orders.filter(
      (o) => new Date(o.orderTime).toISOString().split("T")[0] === today
    );

    const totalRevenueToday = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const avgOrderValue =
      todayOrders.length > 0 ? totalRevenueToday / todayOrders.length : 0;

    const activeCustomers = new Set(todayOrders.map((o) => o.studentId)).size;

    return [
      { label: "Today's Revenue", value: `₱${totalRevenueToday.toFixed(2)}`, icon: DollarSign },
      { label: "Orders Today", value: todayOrders.length, icon: Users },
      { label: "Avg Order Value", value: `₱${avgOrderValue.toFixed(2)}`, icon: DollarSign },
      { label: "Active Customers", value: activeCustomers, icon: Users },
    ];
  }, [orders]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "picked_up":
      case "completed":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "preparing":
        return "text-blue-600 bg-blue-100";
      case "ready":
        return "text-purple-600 bg-purple-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatStatus = (status) => {
    switch (status.toLowerCase()) {
      case "picked_up":
        return "Completed";
      case "pending":
        return "Pending";
      case "preparing":
        return "Preparing";
      case "ready":
        return "Ready";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };

    // 🔎 Handle search input
  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  // 🧩 Filter orders by search (matches ID or user fullName)
  const filteredOrders = orders?.filter((order) => {
    const query = searchQuery.toLowerCase();
    const customerName = order.user?.fullName?.toLowerCase() || "";
    const orderId = order.id?.toLowerCase() || "";
    return customerName.includes(query) || orderId.includes(query);
  });

  return (
    <SharedSidebar>
      {/* Top Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Seller Dashboard</h1>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-9 w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="p-4 sm:p-6">
        <div
          className="mb-6 sm:mb-8 p-4 sm:p-6 rounded-lg text-white"
          style={{ backgroundColor: "var(--accent-green)" }}
        >
          <h2 className="text-xl sm:text-2xl font-semibold">Seller Dashboard</h2>
          <p className="text-white/90 mt-1 text-sm sm:text-base">
            Manage your cafeteria operations and track performance
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="bg-white border border-gray-200">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-gray-600" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Orders Table */}
        <Card className="bg-white">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg font-semibold">
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6 sm:pt-0">
            {isLoading ? (
              <p className="text-center text-gray-500 py-6">Loading orders...</p>
            ) : error ? (
              <p className="text-center text-red-500 py-6">
                Error loading orders: {error}
              </p>
            ) : orders.length === 0 ? (
              <p className="text-center text-gray-500 py-6">No orders found.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader style={{ backgroundColor: "#E5E7A3" }}>
                    <TableRow>
                      <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">Order ID</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">Student Name</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">ID</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">Total Price</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">Order Date</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-gray-500 py-6 text-sm"
                        >
                          No matching orders found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.slice(0, 10).map((order) => (
                        <TableRow key={order.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium text-xs sm:text-sm">{order.id}</TableCell>
                          <TableCell className="text-xs sm:text-sm whitespace-nowrap">{order.studentName}</TableCell>
                          <TableCell className="text-xs sm:text-sm">{order.studentId}</TableCell>
                          <TableCell className="text-xs sm:text-sm whitespace-nowrap">
                            ₱{order.total.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm whitespace-nowrap">
                            {order.orderTime}
                          </TableCell>
                          <TableCell>
                            <span
                              className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap",
                                getStatusColor(order.status)
                              )}
                            >
                              {formatStatus(order.status)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SharedSidebar>
  );
}
