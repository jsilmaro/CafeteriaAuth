import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { 
  Users, 
  Shield, 
  BookOpen, 
  ChefHat, 
  BarChart3,
  ArrowRight,
  CheckCircle,
  Clock
} from "lucide-react";
import { cn } from "../lib/utils";
import { useStats } from "../hooks/use-stats";
import ustpLogo from "../assets/ustp-logo.png";
import cafeteriaBg from "../assets/cafeteria-bg.jpg";

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const [hoveredCard, setHoveredCard] = useState(null);
  const { data: stats, isLoading } = useStats();

  const handleAdminAccess = () => {
    setLocation('/admin-auth');
  };

  const handleStaffAccess = () => {
    setLocation('/auth');
  };

  const handleStudentAccess = () => {
    window.open('https://e-faspecc.vercel.app', '_blank');
  };

  const accessTypes = [
    {
      id: 'admin',
      title: 'Admin Access',
      description: 'Manage staff, approve accounts, and oversee operations',
      icon: Shield,
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      features: [
        'Staff account approval',
        'System administration',
        'Analytics & reporting',
        'User management'
      ],
      badge: 'Administrator',
      badgeColor: 'bg-red-100 text-red-800'
    },
    {
      id: 'staff',
      title: 'Staff Access',
      description: 'Process orders, manage inventory, and serve customers',
      icon: ChefHat,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      features: [
        'Order processing',
        'Inventory management',
        'Customer service',
        'Menu updates'
      ],
      badge: 'Staff Member',
      badgeColor: 'bg-green-100 text-green-800'
    },
    {
      id: 'student',
      title: 'Student Access',
      description: 'Browse menu, place orders, and track your food',
      icon: BookOpen,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      features: [
        'Menu browsing',
        'Order placement',
        'Order tracking',
        'Feedback & ratings'
      ],
      badge: 'Student',
      badgeColor: 'bg-blue-100 text-blue-800'
    }
  ];

  const statCards = [
    { label: 'Active Staff', value: stats?.activeStaff ?? "–", icon: Users },
    { label: 'Daily Orders', value: stats?.dailyOrders ?? "–", icon: BarChart3 },
    { label: 'Menu Items', value: stats?.menuItems ?? "–", icon: ChefHat },
    { label: 'Student Users', value: stats?.studentUsers ?? "–", icon: BookOpen }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{backgroundImage: `url(${cafeteriaBg})`}}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-green-800/60"></div>
        
        <div className="relative z-10">
          {/* Header */}
          <header className="px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <img src={ustpLogo} alt="USTP Logo" className="w-10 h-10 sm:w-12 sm:h-12" />
                <div>
                  <h1 className="text-base sm:text-xl font-bold text-white">USTP Cafeteria</h1>
                  <p className="text-green-200 text-xs sm:text-sm">Management System</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                <span className="text-green-200 text-xs sm:text-sm hidden sm:inline">System Online</span>
              </div>
            </div>
          </header>

          {/* Hero Content */}
          <div className="px-4 sm:px-6 py-8 sm:py-12 lg:py-16 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
                Welcome to USTP Cafeteria
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-green-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
                Your comprehensive food service management platform. Choose your access level to get started.
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12 max-w-3xl mx-auto">
                {statCards.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                      <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-green-300 mx-auto mb-1 sm:mb-2" />
                      <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-green-200 text-xs sm:text-sm">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Access Types Section */}
      <div className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Choose Your Access Level
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Select the appropriate access level based on your role in the USTP Cafeteria system.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {accessTypes.map((access) => {
              const Icon = access.icon;
              return (
                <Card 
                  key={access.id}
                  className={cn(
                    "relative overflow-hidden transition-all duration-300 cursor-pointer group",
                    "hover:shadow-2xl hover:-translate-y-2 border-2",
                    hoveredCard === access.id ? "border-gray-400 shadow-xl" : "border-gray-200"
                  )}
                  onMouseEnter={() => setHoveredCard(access.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => {
                    if (access.id === 'admin') handleAdminAccess();
                    else if (access.id === 'staff') handleStaffAccess();
                    else if (access.id === 'student') handleStudentAccess();
                  }}
                >
                  {/* Header with Icon and Badge */}
                  <CardHeader className="pb-3 sm:pb-4">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className={cn(
                        "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white transition-all duration-300",
                        access.color,
                        hoveredCard === access.id && access.hoverColor
                      )}>
                        <Icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
                      </div>
                      <Badge className={cn(access.badgeColor, "text-xs sm:text-sm")}>
                        {access.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 group-hover:text-gray-700">
                      {access.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                      {access.description}
                    </p>
                    
                    {/* Features List */}
                    <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                      {access.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2 sm:space-x-3">
                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 text-xs sm:text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <Button 
                      className={cn(
                        "w-full transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base py-2 sm:py-3",
                        access.color,
                        access.hoverColor,
                        "hover:shadow-lg"
                      )}
                    >
                      <span>Access {access.title}</span>
                      <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </CardContent>

                  {/* Hover Effect Overlay */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-300",
                    access.color
                  )}></div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              System Features
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 px-4">
              Comprehensive tools for efficient cafeteria management
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Clock className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Real-time Orders</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Track and process orders in real-time</p>
            </div>
            
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <BarChart3 className="h-7 w-7 sm:h-8 sm:w-8 text-green-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Comprehensive reporting and insights</p>
            </div>
            
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Users className="h-7 w-7 sm:h-8 sm:w-8 text-purple-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">User Management</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Manage staff and student accounts</p>
            </div>
            
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <ChefHat className="h-7 w-7 sm:h-8 sm:w-8 text-orange-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Menu Management</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Update and manage menu items</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 sm:py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <img src={ustpLogo} alt="USTP Logo" className="w-6 h-6 sm:w-8 sm:h-8" />
            <span className="text-base sm:text-lg font-semibold">USTP Cafeteria</span>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm px-4">
            © 2024 University of Science and Technology of Southern Philippines
          </p>
          <p className="text-gray-500 text-xs mt-1 sm:mt-2">
            Food Service Management System v2.0
          </p>
        </div>
      </footer>
    </div>
  );
}
