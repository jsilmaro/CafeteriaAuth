import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, loginSchema, forgotPasswordSchema, type InsertUser, type LoginData, type ForgotPasswordData } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, User, IdCard, Key, University, Utensils, BarChart3, Users } from "lucide-react";
import { cn } from "@/lib/utils";

type AuthMode = 'signin' | 'register' | 'forgot';

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      setLocation('/');
    }
  }, [user, setLocation]);

  // Sign in form
  const signinForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      fullname: "",
      staffId: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Forgot password form
  const forgotForm = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // Password strength calculation
  const getPasswordStrength = (password: string) => {
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
  const handleSignIn = async (data: LoginData) => {
    try {
      await loginMutation.mutateAsync(data);
      toast({
        title: "Welcome back!",
        description: "You have been successfully signed in.",
      });
    } catch (error) {
      // Error handled by mutation onError
    }
  };

  const handleRegister = async (data: InsertUser) => {
    if (!acceptTerms) {
      toast({
        title: "Terms Required",
        description: "Please accept the Terms of Service and Privacy Policy.",
        variant: "destructive",
      });
      return;
    }

    try {
      await registerMutation.mutateAsync(data);
      toast({
        title: "Account Created!",
        description: "Your staff account has been successfully created.",
      });
    } catch (error) {
      // Error handled by mutation onError
    }
  };

  const handleForgotPassword = async (data: ForgotPasswordData) => {
    // Simulate password reset
    setTimeout(() => {
      toast({
        title: "Reset Link Sent",
        description: "Check your email for password reset instructions.",
      });
      setAuthMode('signin');
    }, 1000);
  };

  if (user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-2/5 bg-ustp-green relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ustp-green to-ustp-green/80"></div>
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
          <div className="mb-8">
            {/* USTP Logo */}
            <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-lg">
              <div className="w-20 h-20 bg-ustp-green/20 rounded-full flex items-center justify-center">
                <University className="text-ustp-green text-2xl" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">USTP Cafeteria</h1>
            <p className="text-white/80 text-lg">Staff Portal - Food Ordering System</p>
          </div>
          
          <div className="space-y-6 text-white/90 max-w-md">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Utensils className="text-xl" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Order Management</h3>
                <p className="text-sm opacity-80">Process and track food orders</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="text-xl" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Inventory Control</h3>
                <p className="text-sm opacity-80">Monitor stock and supplies</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Users className="text-xl" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Staff Coordination</h3>
                <p className="text-sm opacity-80">Collaborate with team members</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Authentication Forms */}
      <div className="flex-1 lg:w-3/5 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-ustp-green rounded-full flex items-center justify-center">
              <University className="text-white text-lg" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-1">USTP Cafeteria</h1>
            <p className="text-muted-foreground">Staff Portal</p>
          </div>

          {/* Auth Card */}
          <div className="bg-card border border-border rounded-xl shadow-sm p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Staff Access</h2>
              <p className="text-muted-foreground">Sign in to manage food orders and inventory</p>
            </div>

            {/* Auth Tabs */}
            {authMode !== 'forgot' && (
              <div className="flex mb-8 bg-muted rounded-lg p-1">
                <button 
                  onClick={() => setAuthMode('signin')}
                  className={cn(
                    "flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors",
                    authMode === 'signin' 
                      ? "bg-background text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  data-testid="tab-signin"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => setAuthMode('register')}
                  className={cn(
                    "flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors",
                    authMode === 'register' 
                      ? "bg-background text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  data-testid="tab-register"
                >
                  Register
                </button>
              </div>
            )}

            {/* Sign In Form */}
            {authMode === 'signin' && (
              <form onSubmit={signinForm.handleSubmit(handleSignIn)} className="space-y-6" data-testid="form-signin">
                <div>
                  <Label htmlFor="signin-email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      id="signin-email"
                      type="email" 
                      placeholder="staff@ustp.edu.ph"
                      className="pl-10"
                      {...signinForm.register("email")}
                      data-testid="input-signin-email"
                    />
                  </div>
                  {signinForm.formState.errors.email && (
                    <p className="text-sm text-destructive mt-1">{signinForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="signin-password" className="block text-sm font-medium text-foreground mb-2">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Password"
                      className="pl-10 pr-12"
                      {...signinForm.register("password")}
                      data-testid="input-signin-password"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      data-testid="button-toggle-signin-password"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {signinForm.formState.errors.password && (
                    <p className="text-sm text-destructive mt-1">{signinForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember-me" 
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      data-testid="checkbox-remember-me"
                    />
                    <Label htmlFor="remember-me" className="text-sm text-muted-foreground">
                      Remember me
                    </Label>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setAuthMode('forgot')}
                    className="text-sm text-ustp-green hover:text-ustp-green/80 font-medium"
                    data-testid="button-forgot-password"
                  >
                    Forgot Password?
                  </button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-ustp-green text-white hover:bg-ustp-green/90"
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
                  <Label htmlFor="register-fullname" className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      id="register-fullname"
                      type="text" 
                      placeholder="Enter your full name"
                      className="pl-10"
                      {...registerForm.register("fullname")}
                      data-testid="input-register-fullname"
                    />
                  </div>
                  {registerForm.formState.errors.fullname && (
                    <p className="text-sm text-destructive mt-1">{registerForm.formState.errors.fullname.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="register-staffid" className="block text-sm font-medium text-foreground mb-2">
                    Staff ID
                  </Label>
                  <div className="relative">
                    <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      id="register-staffid"
                      type="text" 
                      placeholder="Enter your staff ID"
                      className="pl-10"
                      {...registerForm.register("staffId")}
                      data-testid="input-register-staffid"
                    />
                  </div>
                  {registerForm.formState.errors.staffId && (
                    <p className="text-sm text-destructive mt-1">{registerForm.formState.errors.staffId.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="register-email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      id="register-email"
                      type="email" 
                      placeholder="staff@ustp.edu.ph"
                      className="pl-10"
                      {...registerForm.register("email")}
                      data-testid="input-register-email"
                    />
                  </div>
                  {registerForm.formState.errors.email && (
                    <p className="text-sm text-destructive mt-1">{registerForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="register-password" className="block text-sm font-medium text-foreground mb-2">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Password"
                      className="pl-10 pr-12"
                      {...registerForm.register("password")}
                      data-testid="input-register-password"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      data-testid="button-toggle-register-password"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {registerForm.formState.errors.password && (
                    <p className="text-sm text-destructive mt-1">{registerForm.formState.errors.password.message}</p>
                  )}
                  
                  {/* Password Strength Indicator */}
                  <div className="mt-2">
                    <div className="text-xs text-muted-foreground">Password strength:</div>
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
                              : "bg-border"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="register-confirm-password" className="block text-sm font-medium text-foreground mb-2">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      id="register-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="pl-10 pr-12"
                      {...registerForm.register("confirmPassword")}
                      data-testid="input-register-confirm-password"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      data-testid="button-toggle-confirm-password"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {registerForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive mt-1">{registerForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="terms-agreement" 
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                    className="mt-1"
                    data-testid="checkbox-terms"
                  />
                  <Label htmlFor="terms-agreement" className="text-sm text-muted-foreground leading-5">
                    I agree to the <button type="button" className="text-ustp-green hover:text-ustp-green/80">Terms of Service</button> and{" "}
                    <button type="button" className="text-ustp-green hover:text-ustp-green/80">Privacy Policy</button>
                  </Label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-ustp-green text-white hover:bg-ustp-green/90"
                  disabled={registerMutation.isPending}
                  data-testid="button-register-submit"
                >
                  {registerMutation.isPending ? "Creating Account..." : "Create Staff Account"}
                </Button>
              </form>
            )}

            {/* Forgot Password Form */}
            {authMode === 'forgot' && (
              <form onSubmit={forgotForm.handleSubmit(handleForgotPassword)} className="space-y-6" data-testid="form-forgot">
                <div className="text-center mb-6">
                  <Key className="text-ustp-green text-3xl mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Reset Password</h3>
                  <p className="text-muted-foreground text-sm">Enter your email address and we'll send you a link to reset your password.</p>
                </div>

                <div>
                  <Label htmlFor="forgot-email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      id="forgot-email"
                      type="email" 
                      placeholder="staff@ustp.edu.ph"
                      className="pl-10"
                      {...forgotForm.register("email")}
                      data-testid="input-forgot-email"
                    />
                  </div>
                  {forgotForm.formState.errors.email && (
                    <p className="text-sm text-destructive mt-1">{forgotForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="flex space-x-3">
                  <Button 
                    type="button" 
                    variant="secondary"
                    onClick={() => setAuthMode('signin')}
                    className="flex-1"
                    data-testid="button-back-to-signin"
                  >
                    Back to Sign In
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-ustp-green text-white hover:bg-ustp-green/90"
                    data-testid="button-forgot-submit"
                  >
                    Send Reset Link
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-muted-foreground">
            <p>&copy; 2024 University of Science and Technology of Southern Philippines</p>
            <p>Cafeteria Management System</p>
          </div>
        </div>
      </div>
    </div>
  );
}
