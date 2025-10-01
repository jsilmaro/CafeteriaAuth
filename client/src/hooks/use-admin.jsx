import { useState, useEffect } from "react";
import { useToast } from "./use-toast";

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

  // Load admin data
  useEffect(() => {
    // Mock data that aligns with the Prisma schema
    const mockStaffData = [
      {
        id: "staff-1",
        fullName: "John Doe",
        email: "john.doe@ustp.edu.ph",
        role: "staff",
        emailVerified: false,
        verificationCode: "1234",
        createdAt: new Date("2024-01-15").toISOString(),
        contact: "+63 912 345 6789",
        studentId: null,
      },
      {
        id: "staff-2",
        fullName: "Jane Smith",
        email: "jane.smith@ustp.edu.ph",
        role: "staff",
        emailVerified: false,
        verificationCode: "5678",
        createdAt: new Date("2024-01-20").toISOString(),
        contact: "+63 912 345 6780",
        studentId: null,
      },
      {
        id: "staff-3",
        fullName: "Admin User",
        email: "admin@ustp.edu.ph",
        role: "admin",
        emailVerified: true,
        verificationCode: null,
        createdAt: new Date("2024-01-01").toISOString(),
        contact: "+63 912 345 6777",
        studentId: null,
      },
    ];

    const loadAdminData = async () => {
      setIsLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        // Filter pending staff (those with emailVerified: false)
        const pending = mockStaffData.filter(staff => 
          staff.role === "staff" && !staff.emailVerified
        );
        
        // Calculate stats
        const total = mockStaffData.filter(staff => staff.role === "staff").length;
        const approved = mockStaffData.filter(staff => 
          staff.role === "staff" && staff.emailVerified
        ).length;
        const pendingCount = pending.length;

        setPendingStaff(pending);
        setStats({
          total,
          approved,
          pending: pendingCount,
        });
        
        setIsLoading(false);
      }, 1000);
    };

    loadAdminData();
  }, []);

  // Approve staff function
  const approveStaff = async (staffId) => {
    setApprovingId(staffId);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update local state
      setPendingStaff(prev => prev.filter(staff => staff.id !== staffId));
      setStats(prev => ({
        ...prev,
        approved: prev.approved + 1,
        pending: prev.pending - 1,
      }));
      
      toast({
        title: "Staff Approved",
        description: "Staff member has been successfully approved.",
      });
    } catch {
      toast({
        title: "Approval Failed",
        description: "Failed to approve staff member. Please try again.",
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
