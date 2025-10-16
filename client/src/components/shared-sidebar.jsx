import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "../lib/utils";
import { useAuth } from "../hooks/use-auth";
import { 
  LayoutDashboard,
  ShoppingCart,
  Package,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import ustpLogo from "../assets/ustp-logo.png";

export default function SharedSidebar({ children }) {
  const { logoutMutation } = useAuth();
  const [location] = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load sidebar state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState) {
      setIsCollapsed(JSON.parse(savedState));
    }
  }, []);

  // Save sidebar state to localStorage
  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', JSON.stringify(newState));
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Navigation items - only show implemented routes
  const navItems = [
    { id: "dashboard", label: "Seller Dashboard", icon: LayoutDashboard, path: "/dashboard", implemented: true },
    { id: "orders", label: "Order Management", icon: ShoppingCart, path: "/orders", implemented: true },
    { id: "inventory", label: "Cafeteria Inventory", icon: Package, path: "/inventory", implemented: true },
    { id: "feedback", label: "Customer Feedback", icon: MessageSquare, path: "/feedback", implemented: true },
    { id: "analytics", label: "Analytics", icon: BarChart3, path: "/analytics", implemented: true },
    { id: "settings", label: "Settings", icon: Settings, path: "/settings", implemented: true },
  ].filter(item => item.implemented); // Only show implemented routes

  return (
    <div className="flex h-screen overflow-hidden"> {/* Changed min-h-screen to h-screen and added overflow-hidden */}
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-white shadow-sm flex flex-col transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64"
        )}
        data-testid="sidebar"
      >
        {/* Logo Header */}
        <div className="p-6" style={{backgroundColor: '#9CAF88'}}>
          <div className="flex items-center space-x-3">
            <img src={ustpLogo} alt="USTP Logo" className="w-8 h-8" />
            {!isCollapsed && (
              <span className="text-white font-semibold text-lg">FASPeCC</span>
            )}
          </div>
        </div>

        {/* Toggle Button */}
        <div className="px-4 py-2 border-b">
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            data-testid="sidebar-toggle"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Management Section */}
        <div className="p-4 flex-1 overflow-y-auto">
          {!isCollapsed && (
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Management</p>
          )}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <Link key={item.id} href={item.path}>
                  <button
                    className={cn(
                      "w-full flex items-center rounded-lg text-left transition-colors",
                      isCollapsed ? "justify-center p-3" : "space-x-3 px-3 py-2",
                      isActive 
                        ? "text-white" 
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                    style={isActive ? {backgroundColor: '#9CAF88'} : {}}
                    data-testid={`nav-${item.id}`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="text-sm">{item.label}</span>
                    )}
                  </button>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sign Out */}
        <div className="p-4">
          <button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className={cn(
              "w-full flex items-center text-gray-700 hover:bg-gray-100 rounded-lg transition-colors",
              isCollapsed ? "justify-center p-3" : "space-x-3 px-3 py-2"
            )}
            data-testid="button-logout"
            title={isCollapsed ? "Sign Out" : undefined}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && (
              <span className="text-sm">{logoutMutation.isPending ? "Signing Out..." : "Sign Out"}</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-100">
        {children}
      </main>
    </div>
  );
}