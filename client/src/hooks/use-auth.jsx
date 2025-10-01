import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "./use-toast";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock login mutation
  const loginMutation = {
    mutate: async (credentials) => {
      setIsLoading(true);
      // TODO: backend integration - replace with actual API call
      console.log('Login attempt:', credentials);
      
      // Simulate API delay
      setTimeout(() => {
        // Mock successful login - align with Prisma schema
        // Determine role based on email or other factors
        let userRole = "staff"; // Default role
        let fullName = "Staff User";
        
        if (credentials.email.includes('admin') || credentials.email.includes('administrator')) {
          userRole = "admin";
          fullName = "Admin User";
        }
        
        const mockUser = {
          id: "user-1",
          fullName: fullName,
          role: userRole,
          email: credentials.email,
          emailVerified: true,
          contact: "+63 912 345 6777",
          studentId: null,
          createdAt: new Date().toISOString(),
          verificationCode: null
        };
        setUser(mockUser);
        setIsLoading(false);
        
        toast({
          title: "Welcome back!",
          description: "You have been successfully signed in.",
        });
        
        // Note: Navigation will be handled by useEffect in auth components
      }, 1000);
    },
    isPending: isLoading
  };

  // Mock register mutation
  const registerMutation = {
    mutate: async (userData) => {
      setIsLoading(true);
      // TODO: backend integration - replace with actual API call
      console.log('Register attempt:', userData);
      
      // Simulate API delay
      setTimeout(() => {
        // Mock successful registration - align with Prisma schema
        const mockUser = {
          id: "user-2",
          fullName: userData.fullName,
          role: "staff", // This is staff auth, so always staff
          email: userData.email,
          emailVerified: false, // Staff need approval
          contact: userData.contact || null,
          studentId: null, // Staff don't have studentId
          createdAt: new Date().toISOString(),
          verificationCode: "1234" // Staff need verification
        };
        setUser(mockUser);
        setIsLoading(false);
        
        toast({
          title: "Account Created!",
          description: "Your staff account has been successfully created and is pending admin approval.",
        });
        
        // Note: Navigation will be handled by useEffect in auth components
      }, 1000);
    },
    isPending: isLoading
  };

  // Mock logout mutation
  const logoutMutation = {
    mutate: () => {
      // TODO: backend integration - replace with actual API call
      console.log('Logout attempt');
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    },
    isPending: false
  };

  // Check for existing session on mount
  useEffect(() => {
    // TODO: backend integration - check for existing session
    const mockUser = localStorage.getItem('mockUser');
    if (mockUser) {
      setUser(JSON.parse(mockUser));
    }
  }, []);

  // Save user to localStorage for persistence
  useEffect(() => {
    if (user) {
      localStorage.setItem('mockUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('mockUser');
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error: null,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}