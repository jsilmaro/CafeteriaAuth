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

  // Load admin data from backend
  useEffect(() => {
    const loadAdminData = async () => {
      setIsLoading(true);
      try {
        const res = await api.get("/auth/pending-staff");
        const pending = Array.isArray(res.data) ? res.data : [];

        setPendingStaff(pending);
        setStats({
          total: 0, // backend does not expose total yet
          approved: 0, // backend does not expose approved yet
          pending: pending.length,
        });
      } catch (err) {
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

  // Approve staff function
  const approveStaff = async (staffId) => {
    setApprovingId(staffId);
    try {
      await api.post(`/auth/approve-staff/${encodeURIComponent(staffId)}`);

      setPendingStaff(prev => prev.filter(staff => staff.id !== staffId));
      setStats(prev => ({
        ...prev,
        approved: prev.approved + 1,
        pending: Math.max(0, prev.pending - 1),
      }));

      toast({
        title: "Staff Approved",
        description: "Staff member has been successfully approved.",
      });
    } catch (err) {
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
