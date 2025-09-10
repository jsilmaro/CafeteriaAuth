import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { University, Users, Utensils, BarChart3 } from "lucide-react";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-ustp-green text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <University className="h-8 w-8" />
              <div>
                <h1 className="text-xl font-bold">USTP Cafeteria</h1>
                <p className="text-sm text-white/80">Staff Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm">Welcome, {user?.fullname}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                data-testid="button-logout"
              >
                {logoutMutation.isPending ? "Signing Out..." : "Sign Out"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
          <p className="text-muted-foreground">Manage your cafeteria operations efficiently</p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow" data-testid="card-order-management">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <Utensils className="h-5 w-5 text-ustp-green" />
                <span>Order Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                Process and track food orders from customers
              </p>
              <Button className="w-full bg-ustp-green hover:bg-ustp-green/90" data-testid="button-manage-orders">
                Manage Orders
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow" data-testid="card-inventory-control">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-ustp-green" />
                <span>Inventory Control</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                Monitor stock levels and manage supplies
              </p>
              <Button className="w-full bg-ustp-green hover:bg-ustp-green/90" data-testid="button-manage-inventory">
                View Inventory
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow" data-testid="card-staff-coordination">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-ustp-green" />
                <span>Staff Coordination</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                Collaborate with team members and assign tasks
              </p>
              <Button className="w-full bg-ustp-green hover:bg-ustp-green/90" data-testid="button-staff-coordination">
                Team Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* User Info Card */}
        <Card data-testid="card-user-info">
          <CardHeader>
            <CardTitle>Staff Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <p className="text-foreground" data-testid="text-user-fullname">{user?.fullname}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Staff ID</label>
                <p className="text-foreground" data-testid="text-user-staffid">{user?.staffId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                <p className="text-foreground" data-testid="text-user-email">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                <p className="text-foreground" data-testid="text-user-created">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
