import { useState, useEffect } from "react";
import { useToast } from "./use-toast";
import api from "../lib/api";

export function useAdmin() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [pendingStaff, setPendingStaff] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
  });
  const [approvingId, setApprovingId] = useState(null);

  // ✅ Load admin data (pending staff + stats)
  useEffect(() => {
    const loadAdminData = async () => {
      setIsLoading(true);
      try {
        // Fetch pending staff + stats in parallel
        const [pendingRes, statsRes] = await Promise.all([
          api.get("/auth/pending-staff"),
          api.get("/auth/staff-stats"), // <-- New endpoint in backend
        ]);

        const pending = Array.isArray(pendingRes.data) ? pendingRes.data : [];
        const statsData = statsRes.data || {};

        setPendingStaff(pending);
        setStats({
          total: statsData.total || 0,
          approved: statsData.approved || 0,
          pending: statsData.pending || pending.length,
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

      // Remove from pending & update stats locally
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
    isLoading,
    approveStaff,
    approvingId,
  };
}
