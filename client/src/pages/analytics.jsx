import {
  CircleArrowUp,
  LineChart,
  DollarSign,
  ShoppingCart,
  Clock,
  LayoutGrid,
} from "lucide-react";
import SharedSidebar from "../components/shared-sidebar";
import { Button } from "../components/ui/button";
import { useState } from "react";

// Mock data for the analytics page
const analyticsData = {
  totalRevenue: 500.0,
  totalTransactions: 50,
  averageOrderValue: 14.8,
  peakHours: "12-1PM",
  revenueTrend: [
    { day: "Mon", value: 2000 },
    { day: "Tue", value: 2500 },
    { day: "Wed", value: 2000 },
    { day: "Thu", value: 2500 },
    { day: "Fri", value: 2000 },
    { day: "Sat", value: 2500 },
    { day: "Sun", value: 2000 },
  ],
  topSellingItems: [
    { name: "Chicken Rice", orders: 45 },
    { name: "Beef Burger", orders: 35 },
    { name: "Chicken Adobo", orders: 25 },
  ],
  bestPerformance: "Chicken Rice",
  highestRevenue: "Beef Burger",
  growthRate: 12.5,
};

function Analytics() {
  const [activeTab, setActiveTab] = useState("Today");

  // Helper component for metric cards
  const MetricCard = ({ title, value, icon }) => (
    <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
      <div>
        <h3 className="text-gray-600 text-sm">{title}</h3>
        <p className="text-2xl font-semibold mt-1">{value}</p>
      </div>
      <div className="bg-gray-100 p-3 rounded-full">{icon}</div>
    </div>
  );

  return (
    <SharedSidebar>
      <div className="px-12 pt-8 bg-white border-b">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#9CAF88] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">F</span>
            </div>
            <span className="text-[2rem] font-bold text-[#6A972E] tracking-tight">
              FASPeCC
            </span>
          </div>
          <div className="relative w-[340px]">
            <input
              type="search"
              placeholder="Search"
              className="pl-4 pr-12 py-2 w-full border border-[#6A972E] rounded-full focus:outline-none bg-white text-gray-900"
            />
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-8">
        <div className="bg-[#6B8E23] text-white px-8 py-6 rounded-lg shadow">
          <h2 className="text-3xl font-bold">Analytics and Reports</h2>
        </div>

        {/* Time period tabs */}
        <div className="flex gap-2">
          {["Today", "1 Week", "1 Month", "1 Year"].map((tab) => (
            <Button
              key={tab}
              variant="outline"
              className={`${
                activeTab === tab ? "bg-[#9CAF88] text-white" : "bg-white"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Revenue"
            value={`₱${analyticsData.totalRevenue.toFixed(2)}`}
            icon={<DollarSign size={24} color="#6A972E" />}
          />
          <MetricCard
            title="Total Transactions"
            value={analyticsData.totalTransactions}
            icon={<ShoppingCart size={24} color="#6A972E" />}
          />
          <MetricCard
            title="Average Order Value"
            value={`₱${analyticsData.averageOrderValue.toFixed(2)}`}
            icon={<LayoutGrid size={24} color="#6A972E" />}
          />
          <MetricCard
            title="Peak Hours"
            value={analyticsData.peakHours}
            icon={<Clock size={24} color="#6A972E" />}
          />
        </div>

        {/* Revenue Trend and Top Selling Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
            <div className="flex flex-col gap-4">
              {analyticsData.revenueTrend.map((data) => (
                <div key={data.day} className="flex items-center gap-4">
                  <span className="w-10 text-sm">{data.day}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div
                      style={{ width: `${(data.value / 2500) * 100}%` }}
                      className="bg-[#6B8E23] h-4 rounded-full"
                    ></div>
                  </div>
                  <span className="text-sm font-medium">₱{data.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Top Selling Items</h3>
            <div className="space-y-4">
              {analyticsData.topSellingItems.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#6B8E23] flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      style={{ width: `${(item.orders / 45) * 100}%` }}
                      className="bg-[#9CAF88] h-2 rounded-full"
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{item.orders} orders</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sales Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Best Performance</h3>
            <p className="text-sm text-gray-600">{analyticsData.bestPerformance}</p>
            <p className="text-xl font-bold mt-2">{analyticsData.topSellingItems.find(item => item.name === analyticsData.bestPerformance)?.orders} orders</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Highest Revenue</h3>
            <p className="text-sm text-gray-600">{analyticsData.highestRevenue}</p>
            <p className="text-xl font-bold mt-2">₱576.80</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Growth Rate</h3>
            <div className="flex items-center gap-2 mt-2">
              <CircleArrowUp size={24} className="text-green-500" />
              <span className="text-2xl font-bold text-green-600">
                +{analyticsData.growthRate}%
              </span>
            </div>
            <p className="text-sm text-gray-500">This today</p>
          </div>
        </div>
      </div>
    </SharedSidebar>
  );
}

export default Analytics;