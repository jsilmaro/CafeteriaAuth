import { useState, useEffect } from "react";
import { useAuth } from "../hooks/use-auth";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useToast } from "../hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, Shield, ArrowLeft } from "lucide-react";
import ustpLogo from "../assets/ustp-logo.png";

export default function AdminAuthPage() {
  const { user, loginMutation } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        setLocation('/admin');
      } else {
        setLocation('/dashboard');
      }
    }
  }, [user, setLocation]);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data) => {
    try {
      // For demo purposes, check if it's an admin email
      if (!data.email.includes('admin') && !data.email.includes('administrator')) {
        toast({
          title: "Access Denied",
          description: "This login is restricted to administrators only.",
          variant: "destructive",
        });
        return;
      }

      await loginMutation.mutate(data);
    } catch (error) {
      console.error('Admin login error:', error);
    }
  };

  const handleBackToLanding = () => {
    setLocation('/');
  };

  if (user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button
          onClick={handleBackToLanding}
          variant="ghost"
          className="mb-4 sm:mb-6 text-gray-600 hover:text-gray-900 text-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Back to Landing Page</span>
          <span className="sm:hidden">Back</span>
        </Button>

        {/* Admin Auth Card */}
        <Card className="bg-white border border-red-200 shadow-xl">
          <CardHeader className="text-center pb-3 sm:pb-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <Shield className="h-7 w-7 sm:h-8 sm:w-8 text-red-600" />
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">Admin Access</CardTitle>
            <p className="text-gray-600 text-xs sm:text-sm mt-2">
              Secure administrator login for system management
            </p>
          </CardHeader>

          <CardContent className="p-4 sm:p-6">
            <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4 sm:space-y-6">
              <div>
                <Label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Administrator Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@ustp.edu.ph"
                    className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    {...form.register("email", { required: "Email is required" })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    className="pl-10 pr-12 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    {...form.register("password", { required: "Password is required" })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked)}
                  />
                  <Label htmlFor="remember-me" className="text-sm text-gray-600">
                    Remember me
                  </Label>
                </div>
                <button
                  type="button"
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Forgot Password?
                </button>
              </div>

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white transition-all duration-200"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Signing In..." : "Access Admin Panel"}
              </Button>
            </form>

            {/* Security Notice */}
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs sm:text-sm font-medium text-red-900">Security Notice</h4>
                  <p className="text-xs sm:text-sm text-red-700 mt-1">
                    This area is restricted to authorized administrators only. All access attempts are logged.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-4 sm:mt-6">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <img src={ustpLogo} alt="USTP Logo" className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-xs sm:text-sm font-medium text-gray-700">USTP Cafeteria</span>
          </div>
          <p className="text-xs text-gray-500">
            Administrator Access Portal
          </p>
        </div>
      </div>
    </div>
  );
}
