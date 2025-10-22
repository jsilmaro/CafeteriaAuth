import { useAdmin } from "../hooks/use-admin";
import { useAuth } from "../hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Loader2, CheckCircle2, Users2, LogOut, BarChart3, Clock3, CheckCircle, DollarSign, Calendar, RefreshCcw, Search, Filter } from "lucide-react";
import { useState } from "react";

export default function AdminPage() {
  const { user, logoutMutation } = useAuth();
  const { pendingStaff, stats, isLoading, approveStaff, approvingId } = useAdmin();

  // Tab state
  const [activeTab, setActiveTab] = useState("overview");
  
  // Analytics state
  const [timeFilter, setTimeFilter] = useState("Today");
  const [selectedBar, setSelectedBar] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tooltip, setTooltip] = useState({
    show: false,
    day: "",
    value: 0,
    x: 0,
    y: 0,
  });

  const handleLogout = () => logoutMutation.mutate();

  // --- ANALYTICS DATA ---
  const analyticsData = {
    Today: {
      totalRevenue: 500.0,
      revenueChange: 12.55,
      totalTransactions: 50,
      averageOrderValue: 14.8,
      peakHours: "12-1 PM",
      revenueTrend: [
        { day: "Mon", value: 1800 },
        { day: "Tue", value: 1900 },
        { day: "Wed", value: 2200 },
        { day: "Thu", value: 2000 },
        { day: "Fri", value: 2500 },
        { day: "Sat", value: 2800 },
        { day: "Sun", value: 2600 },
      ],
      topSellingItems: [
        { name: "Chicken Adobo", quantity: 45 },
        { name: "Pancit Canton", quantity: 38 },
        { name: "Tocino", quantity: 24 },
      ],
      bestPerformance: { orders: 45 },
      highestRevenue: { amount: 576.0 },
      growthRate: { percentage: 12.5 },
    },
    Week: {
      totalRevenue: 3500.0,
      revenueChange: 8.2,
      totalTransactions: 250,
      averageOrderValue: 14.0,
      peakHours: "6-7 PM",
      revenueTrend: [
        { day: "Mon", value: 1800 },
        { day: "Tue", value: 1900 },
        { day: "Wed", value: 2200 },
        { day: "Thu", value: 2000 },
        { day: "Fri", value: 2500 },
        { day: "Sat", value: 2800 },
        { day: "Sun", value: 2600 },
      ],
      topSellingItems: [
        { name: "Pancit Canton", quantity: 180 },
        { name: "Chicken Adobo", quantity: 155 },
        { name: "Tocino", quantity: 120 },
      ],
      bestPerformance: { orders: 78 },
      highestRevenue: { amount: 1200.0 },
      growthRate: { percentage: 8.2 },
    },
    Month: {
      totalRevenue: 15000.0,
      revenueChange: 25.0,
      totalTransactions: 1000,
      averageOrderValue: 15.0,
      peakHours: "12-1 PM",
      revenueTrend: [
        { day: "Week 1", value: 2500 },
        { day: "Week 2", value: 3800 },
        { day: "Week 3", value: 4500 },
        { day: "Week 4", value: 4200 },
      ],
      topSellingItems: [
        { name: "Chicken Adobo", quantity: 600 },
        { name: "Tocino", quantity: 550 },
        { name: "Pancit Canton", quantity: 500 },
      ],
      bestPerformance: { orders: 150 },
      highestRevenue: { amount: 3500.0 },
      growthRate: { percentage: 25.0 },
    },
    Year: {
      totalRevenue: 180000.0,
      revenueChange: 15.0,
      totalTransactions: 12000,
      averageOrderValue: 15.0,
      peakHours: "12-1 PM",
      revenueTrend: [
        { day: "Jan", value: 2000 },
        { day: "Feb", value: 2500 },
        { day: "Mar", value: 3000 },
        { day: "Apr", value: 2800 },
        { day: "May", value: 3200 },
        { day: "Jun", value: 3500 },
        { day: "Jul", value: 4000 },
        { day: "Aug", value: 4200 },
        { day: "Sep", value: 3800 },
        { day: "Oct", value: 4100 },
        { day: "Nov", value: 3900 },
        { day: "Dec", value: 4500 },
      ],
      topSellingItems: [
        { name: "Chicken Adobo", quantity: 8000 },
        { name: "Pancit Canton", quantity: 7500 },
        { name: "Tocino", quantity: 6800 },
      ],
      bestPerformance: { orders: 2000 },
      highestRevenue: { amount: 5000.0 },
      growthRate: { percentage: 15.0 },
    },
  };

  const currentData = analyticsData[timeFilter];
  const maxValue = Math.max(...currentData.revenueTrend.map((item) => item.value));

  // --- HOVER TOOLTIP ---
  const handleMouseMove = (e, item) => {
    setTooltip({
      show: true,
      day: item.day,
      value: item.value,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, show: false }));
  };

  // --- CARD RENDER HELPER ---
  const renderAnalyticsCard = (title, mainValue, subText, icon, changeValue = null) => (
    <div className="bg-gray-100 p-3 sm:p-4 lg:p-6 rounded-lg shadow-sm flex flex-col justify-between min-h-[100px] sm:h-[120px] transition-transform hover:scale-[1.02] duration-200">
      <div className="text-gray-600 text-xs sm:text-sm">{title}</div>
      <div className="flex justify-between items-center mt-auto gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-lg sm:text-xl lg:text-2xl font-bold truncate">{mainValue}</p>
          {changeValue !== null && (
            <p className="text-xs text-gray-500">{changeValue}% {subText}</p>
          )}
          {changeValue === null && subText && (
            <p className="text-xs text-gray-500 truncate">{subText}</p>
          )}
        </div>
        <div className="text-lime-700 p-1 sm:p-2 rounded-full flex-shrink-0">{icon}</div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-3">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Users2 className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
              <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search" 
                  className="pl-10 w-full sm:w-60 md:w-80"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center gap-2 border-red-500 text-red-500 hover:bg-red-50 text-sm"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6">
        {/* Page Header */}
        <div className="bg-[#6B8E23] text-white p-4 sm:p-6 rounded-lg mb-6">
          <h2 className="text-xl sm:text-2xl font-bold">Admin Dashboard</h2>
          <p className="text-green-100 mt-1 text-sm sm:text-base">
            👋 Welcome, <span className="font-semibold">{user?.fullName || "Admin"}</span> - Manage staff and view analytics
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Users2 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6 space-y-6">
            {/* Staff Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <Card className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
                  <CardTitle className="text-sm sm:text-base font-semibold text-gray-700">
                    Total Staff
                  </CardTitle>
                  <Users2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {stats?.totalStaff || 0}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Active staff members
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
                  <CardTitle className="text-sm sm:text-base font-semibold text-gray-700">
                    Pending Approvals
                  </CardTitle>
                  <Clock3 className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {stats?.pendingStaff || 0}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Awaiting approval
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
                  <CardTitle className="text-sm sm:text-base font-semibold text-gray-700">
                    Approved Staff
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {stats?.approvedStaff || 0}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Successfully approved
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Staff Management Section */}
            <Card className="shadow-sm border border-gray-200 rounded-xl sm:rounded-2xl">
              <CardHeader className="pb-2 p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg font-semibold text-gray-800">
                  Staff Management
                </CardTitle>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Review and approve new staff accounts awaiting verification.
                </p>
              </CardHeader>

              <CardContent className="p-4 sm:p-6 pt-0">
                {pendingStaff.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 sm:py-10 text-center space-y-2">
                    <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10 text-green-500" />
                    <p className="text-gray-700 font-medium text-sm sm:text-base">
                      No pending staff approvals 🎉
                    </p>
                    <p className="text-gray-500 text-xs sm:text-sm">
                      All staff accounts have been reviewed.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:gap-4">
                    {pendingStaff.map((staff) => (
                      <div
                        key={staff.id}
                        className="flex flex-col sm:flex-row justify-between sm:items-center border rounded-lg sm:rounded-xl p-3 sm:p-4 bg-white shadow-sm hover:shadow-md transition gap-3"
                      >
                        <div className="space-y-1 flex-1">
                          <p className="font-semibold text-gray-800 text-sm sm:text-base">{staff.fullName}</p>
                          <p className="text-xs sm:text-sm text-gray-500 break-all">{staff.email}</p>
                          <p className="text-xs text-gray-400">
                            Joined: {new Date(staff.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="w-full sm:w-auto">
                          <Button
                            onClick={() => approveStaff(staff.id)}
                            disabled={approvingId === staff.id}
                            className="bg-green-500 hover:bg-green-600 transition flex items-center gap-2 justify-center w-full sm:w-auto text-sm"
                          >
                            {approvingId === staff.id ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Approving...
                              </>
                            ) : (
                              "Approve"
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6 space-y-6">
            {/* Analytics Filters */}
            <div className="flex flex-wrap gap-2">
              {["Today", "Week", "Month", "Year"].map((filter) => (
                <Button
                  key={filter}
                  className={`px-4 sm:px-6 py-2 rounded-lg text-sm ${
                    timeFilter === filter
                      ? "bg-[#9CAF88] text-black"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setTimeFilter(filter)}
                >
                  {filter}
                </Button>
              ))}
            </div>

            {/* Analytics Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {renderAnalyticsCard(
                "Total Revenue",
                `₱${currentData.totalRevenue.toFixed(2)}`,
                "vs previous period",
                <DollarSign size={24} color="#6A972E" />,
                currentData.revenueChange
              )}
              {renderAnalyticsCard(
                "Total Transactions",
                currentData.totalTransactions,
                "orders processed",
                <RefreshCcw size={24} color="#6A972E" />
              )}
              {renderAnalyticsCard(
                "Average Order Value",
                `₱${currentData.averageOrderValue.toFixed(2)}`,
                "per transaction",
                <BarChart3 size={24} color="#6A972E" />
              )}
              {renderAnalyticsCard(
                "Peak Hours",
                currentData.peakHours,
                "busiest time",
                <Calendar size={24} color="#6A972E" />
              )}
            </div>

            {/* Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div
                className="bg-white p-4 sm:p-6 rounded-lg shadow relative"
                onMouseLeave={handleMouseLeave}
              >
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Revenue Trend</h3>
                <div className="space-y-3 sm:space-y-4">
                  {currentData.revenueTrend.map((item, index) => {
                    const percentage = (item.value / maxValue) * 100;
                    const isSelected = selectedBar === index;
                    return (
                      <div
                        key={index}
                        className={`flex items-center gap-2 sm:gap-4 cursor-pointer transition-all duration-300 ${
                          isSelected ? "bg-green-50 p-2 rounded-xl" : ""
                        }`}
                        onClick={() => {
                          setSelectedBar(index);
                          setShowModal(true);
                        }}
                        onMouseMove={(e) => handleMouseMove(e, item)}
                      >
                        <span className="w-12 sm:w-16 text-xs sm:text-sm flex-shrink-0">{item.day}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden min-w-0">
                          <div
                            style={{ width: `${percentage}%` }}
                            className={`h-full rounded-full transition-all duration-300 ${
                              isSelected ? "bg-[#94c83d]" : "bg-[#6A972E]"
                            }`}
                          ></div>
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
                          ₱{item.value.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Tooltip */}
                {tooltip.show && (
                  <div
                    className="fixed bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg z-50 pointer-events-none opacity-0 animate-fade-in"
                    style={{
                      left: tooltip.x,
                      top: tooltip.y - 20,
                      transform: "translateX(-50%)",
                      transition: "all 0.1s ease-out",
                    }}
                  >
                    {tooltip.day}: ₱{tooltip.value.toLocaleString()}
                  </div>
                )}
              </div>

              {/* Top Selling Items */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Top Selling Items</h3>
                {currentData.topSellingItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 sm:gap-4 py-2">
                    <span className="text-base sm:text-lg font-bold text-gray-500 flex-shrink-0">
                      {index + 1}.
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm sm:text-base truncate">{item.name}</h4>
                      <span className="text-xs sm:text-sm text-gray-500">
                        {item.quantity} orders
                      </span>
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[60px]">
                      <div
                        style={{
                          width: `${
                            (item.quantity /
                              currentData.topSellingItems[0].quantity) *
                            100
                          }%`,
                        }}
                        className="bg-[#6A972E] rounded-full h-full"
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-2">Best Performance</h3>
                <p className="text-xl sm:text-2xl font-semibold">
                  {currentData.bestPerformance.orders} orders
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Based on this period</p>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-2">Highest Revenue</h3>
                <p className="text-xl sm:text-2xl font-semibold">
                  ₱{currentData.highestRevenue.amount.toFixed(2)}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  From a single transaction
                </p>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-2">Growth Rate</h3>
                <p className="text-xl sm:text-2xl font-semibold text-green-500">
                  +{currentData.growthRate.percentage}%
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Compared to previous period
                </p>
              </div>
            </div>
          </TabsContent>

        </Tabs>
      </div>

      {/* MODAL */}
      {showModal && selectedBar !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg w-full max-w-[400px]">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-[#6A972E]">
              Revenue Details
            </h3>
            <p className="text-sm sm:text-base text-gray-700 mb-2">
              <strong>Period:</strong> {currentData.revenueTrend[selectedBar].day}
            </p>
            <p className="text-sm sm:text-base text-gray-700 mb-2">
              <strong>Revenue:</strong> ₱
              {currentData.revenueTrend[selectedBar].value.toLocaleString()}
            </p>
            <p className="text-sm sm:text-base text-gray-700 mb-4">
              <strong>Performance:</strong>{" "}
              {(
                (currentData.revenueTrend[selectedBar].value / maxValue) *
                100
              ).toFixed(1)}
              % of the highest revenue in this {timeFilter.toLowerCase()}.
            </p>
            <Button
              className="w-full bg-[#6A972E] text-white text-sm sm:text-base"
              onClick={() => setShowModal(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}