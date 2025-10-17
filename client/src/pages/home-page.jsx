// import { useAuth } from "../hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Button } from "../components/ui/button";
import { 
  Search, 
  Filter, 
  Users,
  DollarSign
} from "lucide-react";
import { cn } from "../lib/utils";
import SharedSidebar from "../components/shared-sidebar";

export default function HomePage() {

  // Dashboard stats
  const stats = [
    { label: "Today's Revenue", value: "₱2,450", icon: DollarSign },
    { label: "Orders Today", value: "23", icon: Users },
    { label: "Avg Order Value", value: "₱106", icon: DollarSign },
    { label: "Active Customers", value: "147", icon: Users },
  ];

  // Recent orders data - aligned with Prisma schema
  const recentOrders = [
    { 
      id: "ord-001", 
      user: { fullName: "Juan Dela Cruz", studentId: "2021-12345" }, 
      totalPrice: 125, 
      createdAt: "2024-09-13T10:30:00Z", 
      status: "picked_up",
      pickupType: "dine_in",
      paymentStatus: "paid"
    },
    { 
      id: "ord-002", 
      user: { fullName: "Maria Santos", studentId: "2021-12346" }, 
      totalPrice: 89, 
      createdAt: "2024-09-13T11:15:00Z", 
      status: "pending",
      pickupType: "take_out",
      paymentStatus: "pending"
    },
    { 
      id: "ord-003", 
      user: { fullName: "Pedro Garcia", studentId: "2021-12347" }, 
      totalPrice: 156, 
      createdAt: "2024-09-13T12:00:00Z", 
      status: "preparing",
      pickupType: "dine_in",
      paymentStatus: "cash_on_pickup"
    },
    { 
      id: "ord-004", 
      user: { fullName: "Ana Rodriguez", studentId: "2021-12348" }, 
      totalPrice: 92, 
      createdAt: "2024-09-13T13:45:00Z", 
      status: "ready",
      pickupType: "take_out",
      paymentStatus: "paid"
    },
    { 
      id: "ord-005", 
      user: { fullName: "Carlos Lopez", studentId: "2021-12349" }, 
      totalPrice: 138, 
      createdAt: "2024-09-13T14:20:00Z", 
      status: "rejected",
      pickupType: "dine_in",
      paymentStatus: "pending"
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "picked_up": return "text-green-600 bg-green-100";
      case "pending": return "text-yellow-600 bg-yellow-100";
      case "preparing": return "text-blue-600 bg-blue-100";
      case "ready": return "text-purple-600 bg-purple-100";
      case "rejected": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const formatStatus = (status) => {
    switch (status) {
      case "picked_up": return "Completed";
      case "pending": return "Pending";
      case "preparing": return "Preparing";
      case "ready": return "Ready";
      case "rejected": return "Rejected";
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <SharedSidebar>
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Seller Dashboard</h1>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    placeholder="Search" 
                    className="pl-10 w-full sm:w-60 md:w-80"
                    data-testid="input-search"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 sm:p-6">
          {/* Page Header */}
          <div className="mb-6 sm:mb-8 p-4 sm:p-6 rounded-lg text-white" style={{backgroundColor: 'var(--accent-green)'}}>
            <h2 className="text-xl sm:text-2xl font-semibold">Seller Dashboard</h2>
            <p className="text-white/90 mt-1 text-sm sm:text-base">Manage your cafeteria operations and track performance</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="bg-white border border-gray-200">
                  <CardContent className="p-3 sm:p-4 lg:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">{stat.label}</p>
                        <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">{stat.value}</p>
                      </div>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Recent Orders Table */}
          <Card className="bg-white">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg font-semibold">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-6 sm:pt-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader style={{backgroundColor: '#E5E7A3'}}>
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
                    {recentOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium text-xs sm:text-sm">{order.id}</TableCell>
                        <TableCell className="text-xs sm:text-sm whitespace-nowrap">{order.user.fullName}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{order.user.studentId}</TableCell>
                        <TableCell className="text-xs sm:text-sm whitespace-nowrap">₱{order.totalPrice}</TableCell>
                        <TableCell className="text-xs sm:text-sm whitespace-nowrap">{formatDate(order.createdAt)}</TableCell>
                        <TableCell>
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap",
                            getStatusColor(order.status)
                          )}>
                            {formatStatus(order.status)}
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
    </SharedSidebar>
  );
}