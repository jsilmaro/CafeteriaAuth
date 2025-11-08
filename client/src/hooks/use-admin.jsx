import { useState, useEffect } from "react";
import { useToast } from "./use-toast";
import api from "../lib/api";

export function useAdmin() {
  const [analytics, setAnalytics] = useState(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [pendingStaff, setPendingStaff] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
  });
  const [approvingId, setApprovingId] = useState(null);

  useEffect(() => {
    const loadAdminData = async () => {
      setIsLoading(true);
      try {
        // Fetch staff + transactions
        const [pendingRes, statsRes, ordersRes, paymentsRes] = await Promise.all([
          api.get("/auth/pending-staff"),
          api.get("/auth/staff-stats"),
          api.get("/orders"),
          api.get("/payments"),
        ]);

        // --- Staff ---
        const pending = Array.isArray(pendingRes.data) ? pendingRes.data : [];
        const statsData = statsRes.data || {};

        setPendingStaff(pending);
        setStats({
          total: statsData.total || 0,
          approved: statsData.approved || 0,
          pending: statsData.pending || pending.length,
        });

        // --- Orders + Payments ---
        const orders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
        const payments = Array.isArray(paymentsRes.data) ? paymentsRes.data : [];

        // Helper function: filter by time range
        const filterByTime = (list, days) => {
          const now = new Date();
          return list.filter((item) => {
            const created = new Date(item.createdAt);
            const diff = (now - created) / (1000 * 60 * 60 * 24);
            return diff <= days;
          });
        };

        const computeRevenueTrend = (payments, period) => {
          const trend = {};
          const now = new Date();

          if (period === "Today") {
            for (let h = 0; h < 24; h++) trend[h] = 0;
            payments.forEach(p => {
              const date = new Date(p.createdAt);
              const hour = date.getHours();
              trend[hour] = (trend[hour] || 0) + Number(p.amountReceived || 0);
            });
            return Object.entries(trend).map(([hour, value]) => ({ day: `${hour}:00`, value }));
          }

          if (period === "Week") {
            const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            payments.forEach(p => {
              const date = new Date(p.createdAt);
              const day = weekDays[date.getDay()];
              trend[day] = (trend[day] || 0) + Number(p.amountReceived || 0);
            });
            return Object.entries(trend).map(([day, value]) => ({ day, value }));
          }

          if (period === "Month") {
            const getWeekNumber = (d) => Math.ceil(d.getDate() / 7);
            payments.forEach(p => {
              const date = new Date(p.createdAt);
              const week = `Week ${getWeekNumber(date)}`;
              trend[week] = (trend[week] || 0) + Number(p.amountReceived || 0);
            });
            return Object.entries(trend).map(([week, value]) => ({ day: week, value }));
          }

          if (period === "Year") {
            const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
            payments.forEach(p => {
              const date = new Date(p.createdAt);
              const month = months[date.getMonth()];
              trend[month] = (trend[month] || 0) + Number(p.amountReceived || 0);
            });
            return Object.entries(trend).map(([month, value]) => ({ day: month, value }));
          }

          return [];
        };

        // --- Compute analytics by period ---
        const computeAnalytics = (filteredOrders, filteredPayments, prevTotalRevenue = 0, period = "Week") => {
          // Total Revenue
          const totalRevenue = filteredPayments.reduce(
            (sum, p) => sum + Number(p.amountReceived || 0),
            0
          );

          // Total Transactions
          const totalTransactions = filteredOrders.length;

          // Average Order Value
          const averageOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

          // --- Revenue Trend by period ---
          let revenueTrend = [];
          if (period === "Today") {
            // Hourly trend
            const hoursCount = {};
            filteredPayments.forEach((p) => {
              const hour = new Date(p.createdAt).getHours();
              hoursCount[hour] = (hoursCount[hour] || 0) + Number(p.amountReceived || 0);
            });
            revenueTrend = Array.from({ length: 24 }).map((_, i) => ({
              day: `${i}:00`,
              value: hoursCount[i] || 0,
            }));
          } else if (period === "Week") {
            // Weekday trend
            const daysCount = {};
            filteredPayments.forEach((p) => {
              const day = new Date(p.createdAt).toLocaleDateString("en-US", { weekday: "short" });
              daysCount[day] = (daysCount[day] || 0) + Number(p.amountReceived || 0);
            });
            const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            revenueTrend = weekdays.map((day) => ({ day, value: daysCount[day] || 0 }));
          } else if (period === "Month") {
            // Week 1, 2, 3, 4 trend
            const weekCount = {};
            filteredPayments.forEach((p) => {
              const date = new Date(p.createdAt);
              const weekNumber = Math.ceil(date.getDate() / 7);
              const weekLabel = `Week ${weekNumber}`;
              weekCount[weekLabel] = (weekCount[weekLabel] || 0) + Number(p.amountReceived || 0);
            });
            revenueTrend = ["Week 1", "Week 2", "Week 3", "Week 4"].map((week) => ({
              day: week,
              value: weekCount[week] || 0,
            }));
          } else if (period === "Year") {
            // Month trend
            const monthCount = {};
            filteredPayments.forEach((p) => {
              const month = new Date(p.createdAt).toLocaleDateString("en-US", { month: "short" });
              monthCount[month] = (monthCount[month] || 0) + Number(p.amountReceived || 0);
            });
            const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
            revenueTrend = months.map((month) => ({ day: month, value: monthCount[month] || 0 }));
          }

          // --- Top-selling items ---
          const itemCount = {};
          filteredOrders.forEach((order) => {
            order.orderItems?.forEach((oi) => {
              const name = oi.item?.name || "Unknown Item";
              itemCount[name] = (itemCount[name] || 0) + oi.quantity;
            });
          });
          const topSellingItems = Object.entries(itemCount)
            .map(([name, quantity]) => ({ name, quantity }))
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);

          // --- Peak Hours (only for Today) ---
          let peakHours = "N/A";
          if (period === "Today") {
            const hoursCount = {};
            filteredPayments.forEach((p) => {
              const hour = new Date(p.createdAt).getHours();
              hoursCount[hour] = (hoursCount[hour] || 0) + 1;
            });
            const peakHourEntry = Object.entries(hoursCount).reduce(
              (max, [hour, count]) => (count > max.count ? { hour, count } : max),
              { hour: null, count: 0 }
            );
            if (peakHourEntry.hour !== null) {
              peakHours = `${peakHourEntry.hour}:00 - ${Number(peakHourEntry.hour) + 1}:00`;
            }
          }

          // --- Best Performance (most orders by quantity) ---
          let bestPerformanceOrders = 0;
          filteredOrders.forEach((order) => {
            const totalItems = order.orderItems?.reduce((sum, oi) => sum + oi.quantity, 0) || 0;
            if (totalItems > bestPerformanceOrders) bestPerformanceOrders = totalItems;
          });

          // --- Highest Revenue (single payment) ---
          const highestRevenueAmount = filteredPayments.reduce(
            (max, p) => (Number(p.amountReceived || 0) > max ? Number(p.amountReceived || 0) : max),
            0
          );

          // --- Growth Rate ---
          const growthRate = prevTotalRevenue
            ? ((totalRevenue - prevTotalRevenue) / prevTotalRevenue) * 100
            : 0;

          return {
            totalRevenue,
            totalTransactions,
            averageOrderValue,
            revenueTrend,
            topSellingItems,
            peakHours,
            bestPerformance: { orders: bestPerformanceOrders },
            highestRevenue: { amount: highestRevenueAmount },
            growthRate: { percentage: growthRate.toFixed(1) },
          };
        };

        // Compute per period
        const todayOrders = filterByTime(orders, 1);
        const weekOrders = filterByTime(orders, 7);
        const monthOrders = filterByTime(orders, 30);
        const yearOrders = filterByTime(orders, 365);

        const todayPayments = filterByTime(payments, 1);
        const weekPayments = filterByTime(payments, 7);
        const monthPayments = filterByTime(payments, 30);
        const yearPayments = filterByTime(payments, 365);

        // Build analytics object for all periods
        setAnalytics({
          Today: computeAnalytics(todayOrders, todayPayments, 0, "Today"),
          Week: computeAnalytics(
            weekOrders,
            weekPayments,
            computeAnalytics(todayOrders, todayPayments, 0, "Today").totalRevenue,
            "Week"
          ),
          Month: computeAnalytics(
            monthOrders,
            monthPayments,
            computeAnalytics(weekOrders, weekPayments, computeAnalytics(todayOrders, todayPayments, 0, "Today").totalRevenue, "Week").totalRevenue,
            "Month"
          ),
          Year: computeAnalytics(
            yearOrders,
            yearPayments,
            computeAnalytics(monthOrders, monthPayments, computeAnalytics(weekOrders, weekPayments, computeAnalytics(todayOrders, todayPayments, 0, "Today").totalRevenue, "Week").totalRevenue, "Month").totalRevenue,
            "Year"
          ),
        });
      } catch (err) {
        console.error("❌ Admin data load error:", err);
        toast({
          title: "Failed to load admin data",
          description: err.response?.data?.error || "Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAdminData();
  }, [toast]);

  // ✅ Approve staff
  const approveStaff = async (staffId) => {
    setApprovingId(staffId);
    try {
      await api.post(`/auth/approve-staff/${encodeURIComponent(staffId)}`);

      setPendingStaff((prev) => prev.filter((s) => s.id !== staffId));
      setStats((prev) => ({
        total: prev.total,
        approved: prev.approved + 1,
        pending: Math.max(prev.pending - 1, 0),
      }));

      toast({
        title: "Staff Approved",
        description: "Staff member has been successfully approved.",
      });
    } catch (err) {
      console.error("❌ Approve staff error:", err);
      toast({
        title: "Approval Failed",
        description: err.response?.data?.error || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setApprovingId(null);
    }
  };

  return {
    pendingStaff,
    stats,
    analytics,
    isLoading,
    approveStaff,
    approvingId,
  };
}
