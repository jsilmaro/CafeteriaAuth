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
        // Mock successful login
        const mockUser = {
          id: "user-1",
          fullname: "Admin User",
          staffId: "STAFF001",
          email: credentials.email
        };
        setUser(mockUser);
        setIsLoading(false);
        
        toast({
          title: "Welcome back!",
          description: "You have been successfully signed in.",
        });
        
        // Navigate to dashboard
        window.location.href = '/dashboard';
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
        // Mock successful registration
        const mockUser = {
          id: "user-2",
          fullname: userData.fullname,
          staffId: userData.staffId,
          email: userData.email
        };
        setUser(mockUser);
        setIsLoading(false);
        
        toast({
          title: "Account Created!",
          description: "Your staff account has been successfully created.",
        });
        
        // Navigate to dashboard
        window.location.href = '/dashboard';
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