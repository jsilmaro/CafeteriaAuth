import { useAuth } from "../hooks/use-auth";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { 
  Search, 
  Filter, 
  LayoutDashboard,
  ShoppingCart,
  Package,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Clock,
  Users,
  DollarSign
} from "lucide-react";
import { cn } from "../lib/utils";
import { useState } from "react";
import { Link, useLocation } from "wouter";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  // Temporary mock user if no user is logged in
  const mockUser = {
    fullname: "Admin User",
    staffId: "STAFF001",
    email: "admin@ustp.edu.ph"
  };

  const currentUser = user || mockUser;

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Navigation items
  const navItems = [
    { id: "dashboard", label: "Seller Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { id: "orders", label: "Order Management", icon: ShoppingCart, path: "/orders" },
    { id: "inventory", label: "Cafeteria Inventory", icon: Package, path: "/inventory" },
    { id: "feedback", label: "Customer Feedback", icon: MessageSquare, path: "/feedback" },
    { id: "analytics", label: "Analytics", icon: BarChart3, path: "/analytics" },
    { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
  ];

  // Dashboard stats
  const stats = [
    { label: "Today's Revenue", value: "₱2,450", icon: DollarSign },
    { label: "Orders Today", value: "23", icon: ShoppingCart },
    { label: "Avg Order Value", value: "₱106", icon: BarChart3 },
    { label: "Active Customers", value: "147", icon: Users },
  ];

  // Recent orders data
  const recentOrders = [
    { id: "ORD001", student: "Juan Dela Cruz", studentId: "2021-12345", total: "₱125", date: "2024-09-13", status: "Completed" },
    { id: "ORD002", student: "Maria Santos", studentId: "2021-12346", total: "₱89", date: "2024-09-13", status: "Pending" },
    { id: "ORD003", student: "Pedro Garcia", studentId: "2021-12347", total: "₱156", date: "2024-09-13", status: "In Progress" },
    { id: "ORD004", student: "Ana Rodriguez", studentId: "2021-12348", total: "₱92", date: "2024-09-13", status: "Completed" },
    { id: "ORD005", student: "Carlos Lopez", studentId: "2021-12349", total: "₱138", date: "2024-09-13", status: "Cancelled" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "text-green-600 bg-green-100";
      case "Pending": return "text-yellow-600 bg-yellow-100";
      case "In Progress": return "text-blue-600 bg-blue-100";
      case "Cancelled": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm flex flex-col">
        {/* Logo Header */}
        <div className="p-6" style={{backgroundColor: '#9CAF88'}}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-green-700 font-bold text-lg">F</span>
            </div>
            <span className="text-white font-semibold text-lg">FASPeCC</span>
          </div>
        </div>

        {/* Management Section */}
        <div className="p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Management</p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <Link key={item.id} href={item.path}>
                  <button
                    className={cn(
                      "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors",
                      isActive 
                        ? "text-white" 
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                    style={isActive ? {backgroundColor: '#9CAF88'} : {}}
                    data-testid={`nav-${item.id}`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sign Out */}
        <div className="mt-auto p-4">
          <button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm">{logoutMutation.isPending ? "Signing Out..." : "Sign Out"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-semibold text-gray-900">FASPeCC</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search" 
                  className="pl-10 w-80"
                  data-testid="input-search"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8 p-6 rounded-lg text-white" style={{backgroundColor: 'var(--accent-green)'}}>
            <h2 className="text-2xl font-semibold">Seller Dashboard</h2>
            <p className="text-white/90 mt-1">Manage your cafeteria operations and track performance</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="bg-white border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                        <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-gray-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Recent Orders Table */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader style={{backgroundColor: '#E5E7A3'}}>
                    <TableRow>
                      <TableHead className="font-semibold text-gray-700">Order ID</TableHead>
                      <TableHead className="font-semibold text-gray-700">Student Name</TableHead>
                      <TableHead className="font-semibold text-gray-700">ID</TableHead>
                      <TableHead className="font-semibold text-gray-700">Total Price</TableHead>
                      <TableHead className="font-semibold text-gray-700">Order Date</TableHead>
                      <TableHead className="font-semibold text-gray-700">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.student}</TableCell>
                        <TableCell>{order.studentId}</TableCell>
                        <TableCell>{order.total}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            getStatusColor(order.status)
                          )}>
                            {order.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}