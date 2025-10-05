import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "./use-toast";
import api from "../lib/api"; // ✅ axios instance

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { toast } = useToast();
  // Initialize user from localStorage immediately (synchronous)
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(true); // Start with true for initial check

  /**
   * ✅ STAFF / ADMIN LOGIN
   */
  const loginMutation = {
    mutate: async ({ email, password }) => {
      try {
        setIsLoading(true);
        const res = await api.post("/auth/login-staff", { email, password });

        const { token, user } = res.data;

        // ✅ Save token + user
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);

        toast({
          title: "Welcome back!",
          description: `Logged in as ${user.fullName || user.email}`,
        });

      } catch (err) {
        console.error("Login error:", err);
        toast({
          title: "Login failed",
          description:
            err.response?.data?.error || "Invalid credentials or server error",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    isPending: isLoading,
  };

  /**
   * ✅ STAFF REGISTRATION
   */
  const registerMutation = {
    mutate: async (formData) => {
      try {
        setIsLoading(true);
        const res = await api.post("/auth/register-staff", formData);

        toast({
          title: "Account Created!",
          description:
            res.data?.message ||
            "Your staff account has been registered. Please wait for admin approval before logging in.",
        });

        // Clear any existing auth state just in case
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);

        // Redirect to home or login (small delay to ensure state is cleared)
        setTimeout(() => {
          window.location.href = "/";
        }, 100);
      } catch (err) {
        console.error("Register error:", err);
        toast({
          title: "Registration failed",
          description:
            err.response?.data?.error || "Something went wrong",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    isPending: isLoading,
  };

  /**
   * ✅ LOGOUT
   */
  const logoutMutation = {
    mutate: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);

      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });

      setTimeout(() => {
        window.location.href = "/";
      }, 100);
    },
    isPending: false,
  };

  /**
   * ✅ RESTORE SESSION (validate token with backend)
   */
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // If no token, we're done checking
    if (!token) {
      setIsLoading(false);
      return;
    }

    // Validate token with backend
    (async () => {
      try {
        const res = await api.get("/auth/user");
        // Update user data from backend
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (err) {
        // Only clear session on auth errors (401/403), not network errors
        if (err.response?.status === 401 || err.response?.status === 403) {
          console.warn("Session invalid, clearing auth state");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        } else {
          // Network error or other issue - keep existing session
          console.warn("Session validation failed (network issue), keeping existing session:", err.message);
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        loginMutation,
        registerMutation,
        logoutMutation,
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