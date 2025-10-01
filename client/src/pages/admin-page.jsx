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
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <Users2 className="h-7 w-7 text-primary" />
            <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <p className="text-sm text-gray-600">
              👋 Welcome, <span className="font-semibold">{user?.fullName || "Admin"}</span>
            </p>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2 border-red-500 text-red-500 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* 📊 Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Staff</CardTitle>
              <BarChart3 className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Approved</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-800">{stats.approved}</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Pending</CardTitle>
              <Clock3 className="h-5 w-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-800">{stats.pending}</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Staff Section */}
        <Card className="shadow-sm border border-gray-200 rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Pending Staff Approvals
            </CardTitle>
            <p className="text-sm text-gray-500">
              Review and approve new staff accounts awaiting verification.
            </p>
          </CardHeader>

          <CardContent>
            {pendingStaff.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
                <p className="text-gray-700 font-medium">
                  No pending staff approvals 🎉
                </p>
                <p className="text-gray-500 text-sm">
                  All staff accounts have been reviewed.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {pendingStaff.map((staff) => (
                  <div
                    key={staff.id}
                    className="flex flex-col md:flex-row justify-between md:items-center border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-800">{staff.fullName}</p>
                      <p className="text-sm text-gray-500">{staff.email}</p>
                      <p className="text-xs text-gray-400">
                        Joined: {new Date(staff.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="mt-3 md:mt-0">
                      <Button
                        onClick={() => approveStaff(staff.id)}
                        disabled={approvingId === staff.id}
                        className="bg-green-500 hover:bg-green-600 transition flex items-center gap-2"
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
