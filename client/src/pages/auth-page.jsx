import { useState, useEffect } from "react";
import { useAuth } from "../hooks/use-auth";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { useToast } from "../hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, User, IdCard, Key } from "lucide-react";
import { cn } from "../lib/utils";
import ustpLogo from "../assets/ustp-logo.png";
import cafeteriaBg from "../assets/cafeteria-bg.jpg";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [authMode, setAuthMode] = useState('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      setLocation('/dashboard');
    }
  }, [user, setLocation]);

  // Sign in form
  const signinForm = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm({
    defaultValues: {
      fullname: "",
      staffId: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Forgot password form
  const forgotForm = useForm({
    defaultValues: {
      email: "",
    },
  });

  // Password strength calculation
  const getPasswordStrength = (password) => {
    const checks = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /\d/.test(password),
    ];
    return checks.filter(Boolean).length;
  };

  const passwordStrength = getPasswordStrength(registerForm.watch("password") || "");

  // Form handlers
  const handleSignIn = async (data) => {
    try {
      await loginMutation.mutate(data);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleRegister = async (data) => {
    if (!acceptTerms) {
      toast({
        title: "Terms Required",
        description: "Please accept the Terms of Service and Privacy Policy.",
        variant: "destructive",
      });
      return;
    }

    if (data.password !== data.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    try {
      await registerMutation.mutate(data);
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  const handleForgotPassword = async (data) => {
    // TODO: backend integration - implement password reset
    console.log('Forgot password for:', data.email);
    
    setTimeout(() => {
      toast({
        title: "Reset Link Sent",
        description: "Check your email for password reset instructions.",
      });
      setShowForgotModal(false);
    }, 1000);
  };

  if (user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Sage Green with Cafeteria Background */}
      <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden" style={{backgroundColor: '#9CAF88'}}>
        {/* Background Image with Less Opacity */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{backgroundImage: `url(${cafeteriaBg})`}}
        ></div>
        <div className="absolute inset-0" style={{backgroundColor: 'rgba(156, 175, 136, 0.8)'}}></div>
        
        {/* Intro Content */}
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
          <div className="text-white space-y-6 max-w-sm">
            <h1 className="text-4xl font-bold leading-tight">Welcome to USTP Cafeteria</h1>
            <p className="text-xl text-white/90">Your gateway to efficient food service management</p>
            <div className="space-y-3 text-white/80">
              <p className="flex items-center justify-center space-x-2">
                <span className="w-2 h-2 bg-white/60 rounded-full"></span>
                <span>Streamlined ordering system</span>
              </p>
              <p className="flex items-center justify-center space-x-2">
                <span className="w-2 h-2 bg-white/60 rounded-full"></span>
                <span>Real-time inventory tracking</span>
              </p>
              <p className="flex items-center justify-center space-x-2">
                <span className="w-2 h-2 bg-white/60 rounded-full"></span>
                <span>Staff coordination tools</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Authentication Forms */}
      <div className="flex-1 lg:w-3/5 flex flex-col items-center justify-center p-6 lg:p-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Logo and Header - Outside the auth box */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4">
              <img src={ustpLogo} alt="USTP Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">USTP Cafeteria</h1>
            <p className="text-gray-600 text-sm mb-6">Staff Portal - Food Ordering System</p>
          </div>

          {/* Auth Card - Only covers authentication */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-8">
            {/* Staff Access Header */}
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Staff Access</h2>
              <p className="text-gray-600 text-sm">Sign in to manage food orders and inventory</p>
            </div>

            {/* Auth Tabs */}
            <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
              <button 
                onClick={() => setAuthMode('signin')}
                className={cn(
                  "flex-1 py-3 px-4 text-sm font-medium rounded-md transition-all duration-200",
                  authMode === 'signin' 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-gray-600"
                )}
                onMouseEnter={(e) => {
                  if (authMode !== 'signin') {
                    e.currentTarget.style.backgroundColor = 'rgba(54, 87, 10, 0.5)';
                    e.currentTarget.style.color = 'white';
                  }
                }}
                onMouseLeave={(e) => {
                  if (authMode !== 'signin') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#6b7280';
                  }
                }}
                data-testid="tab-signin"
              >
                Sign In
              </button>
              <button 
                onClick={() => setAuthMode('register')}
                className={cn(
                  "flex-1 py-3 px-4 text-sm font-medium rounded-md transition-all duration-200",
                  authMode === 'register' 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-gray-600"
                )}
                onMouseEnter={(e) => {
                  if (authMode !== 'register') {
                    e.currentTarget.style.backgroundColor = 'rgba(54, 87, 10, 0.5)';
                    e.currentTarget.style.color = 'white';
                  }
                }}
                onMouseLeave={(e) => {
                  if (authMode !== 'register') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#6b7280';
                  }
                }}
                data-testid="tab-register"
              >
                Register
              </button>
            </div>

            {/* Sign In Form */}
            {authMode === 'signin' && (
              <form onSubmit={signinForm.handleSubmit(handleSignIn)} className="space-y-6" data-testid="form-signin">
                <div>
                  <Label htmlFor="signin-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      id="signin-email"
                      type="email" 
                      placeholder="staff@ustp.edu.ph"
                      className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      {...signinForm.register("email")}
                      data-testid="input-signin-email"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="signin-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Password"
                      className="pl-10 pr-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      {...signinForm.register("password")}
                      data-testid="input-signin-password"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      data-testid="button-toggle-signin-password"
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
                      data-testid="checkbox-remember-me"
                    />
                    <Label htmlFor="remember-me" className="text-sm text-gray-600">
                      Remember me
                    </Label>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setShowForgotModal(true)}
                    className="text-sm font-medium transition-colors duration-200"
                    style={{color: '#9CAF88'}}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#7a8a6e';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#9CAF88';
                    }}
                    data-testid="button-forgot-password"
                  >
                    Forgot Password?
                  </button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full text-white transition-all duration-200"
                  style={{backgroundColor: '#9CAF88'}}
                  onMouseEnter={(e) => {
                    if (!loginMutation.isPending) {
                      e.currentTarget.style.backgroundColor = '#7a8a6e';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loginMutation.isPending) {
                      e.currentTarget.style.backgroundColor = '#9CAF88';
                    }
                  }}
                  disabled={loginMutation.isPending}
                  data-testid="button-signin-submit"
                >
                  {loginMutation.isPending ? "Signing In..." : "Log In"}
                </Button>
              </form>
            )}

            {/* Register Form */}
            {authMode === 'register' && (
              <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-6" data-testid="form-register">
                <div>
                  <Label htmlFor="register-fullname" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      id="register-fullname"
                      type="text" 
                      placeholder="Enter your full name"
                      className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      {...registerForm.register("fullname")}
                      data-testid="input-register-fullname"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="register-staffid" className="block text-sm font-medium text-gray-700 mb-2">
                    Staff ID
                  </Label>
                  <div className="relative">
                    <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      id="register-staffid"
                      type="text" 
                      placeholder="Enter your staff ID"
                      className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      {...registerForm.register("staffId")}
                      data-testid="input-register-staffid"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      id="register-email"
                      type="email" 
                      placeholder="staff@ustp.edu.ph"
                      className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      {...registerForm.register("email")}
                      data-testid="input-register-email"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Password"
                      className="pl-10 pr-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      {...registerForm.register("password")}
                      data-testid="input-register-password"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      data-testid="button-toggle-register-password"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  <div className="mt-2">
                    <div className="text-xs text-gray-600">Password strength:</div>
                    <div className="mt-1 flex space-x-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div 
                          key={i}
                          className={cn(
                            "h-1 flex-1 rounded",
                            i <= passwordStrength 
                              ? passwordStrength <= 1 
                                ? "bg-red-500"
                                : passwordStrength <= 2
                                ? "bg-yellow-500"
                                : passwordStrength <= 3
                                ? "bg-blue-500"
                                : "bg-green-500"
                              : "bg-gray-300"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="register-confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      id="register-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="pl-10 pr-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      {...registerForm.register("confirmPassword")}
                      data-testid="input-register-confirm-password"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      data-testid="button-toggle-confirm-password"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="terms-agreement" 
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked)}
                    className="mt-1"
                    data-testid="checkbox-terms"
                  />
                  <Label htmlFor="terms-agreement" className="text-sm text-gray-600 leading-5">
                    I agree to the <button type="button" className="text-green-600 hover:text-green-700">Terms of Service</button> and{" "}
                    <button type="button" className="text-green-600 hover:text-green-700">Privacy Policy</button>
                  </Label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full text-white transition-all duration-200"
                  style={{backgroundColor: '#9CAF88'}}
                  onMouseEnter={(e) => {
                    if (!registerMutation.isPending) {
                      e.currentTarget.style.backgroundColor = '#7a8a6e';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!registerMutation.isPending) {
                      e.currentTarget.style.backgroundColor = '#9CAF88';
                    }
                  }}
                  disabled={registerMutation.isPending}
                  data-testid="button-register-submit"
                >
                  {registerMutation.isPending ? "Creating Account..." : "Create Staff Account"}
                </Button>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-gray-500">
            <p>&copy; 2024 University of Science and Technology of Southern Philippines</p>
            <p>Cafeteria Management System</p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Dialog open={showForgotModal} onOpenChange={setShowForgotModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4">
              <Key className="h-12 w-12 mx-auto" style={{color: '#9CAF88'}} />
            </div>
            <DialogTitle className="text-center">Reset Password</DialogTitle>
            <DialogDescription className="text-center">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={forgotForm.handleSubmit(handleForgotPassword)} className="space-y-4">
            <div>
              <Label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  id="forgot-email"
                  type="email" 
                  placeholder="staff@ustp.edu.ph"
                  className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  {...forgotForm.register("email")}
                  data-testid="input-forgot-email"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button 
                type="button" 
                variant="secondary"
                onClick={() => setShowForgotModal(false)}
                className="flex-1"
                data-testid="button-back-to-signin"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 text-white"
                style={{backgroundColor: '#9CAF88'}}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#7a8a6e';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#9CAF88';
                }}
                data-testid="button-forgot-submit"
              >
                Send Reset Link
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}