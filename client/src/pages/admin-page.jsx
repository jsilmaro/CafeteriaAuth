import { useAdmin } from "../hooks/use-admin";
import { useAuth } from "../hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Loader2, CheckCircle2, Users2, LogOut, BarChart3, Clock3, CheckCircle } from "lucide-react";

export default function AdminPage() {
  const { user, logoutMutation } = useAuth();
  const { pendingStaff, stats, isLoading, approveStaff, approvingId } = useAdmin();

  const handleLogout = () => logoutMutation.mutate();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-3">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 lg:space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <Users2 className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">Admin Dashboard</h1>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <p className="text-xs sm:text-sm text-gray-600">
              👋 Welcome, <span className="font-semibold">{user?.fullName || "Admin"}</span>
            </p>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2 border-red-500 text-red-500 hover:bg-red-50 text-sm w-full sm:w-auto"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* 📊 Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <Card className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">Total Staff</CardTitle>
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.total}</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.approved}</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">Pending</CardTitle>
              <Clock3 className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.pending}</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Staff Section */}
        <Card className="shadow-sm border border-gray-200 rounded-xl sm:rounded-2xl">
          <CardHeader className="pb-2 p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg font-semibold text-gray-800">
              Pending Staff Approvals
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
      </div>
    </div>
  );
}
