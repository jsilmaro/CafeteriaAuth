import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "./use-toast";
import api from "../lib/api"; // ✅ axios instance

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

        // ✅ Redirect after login
        window.location.href = "/dashboard";
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

        const { token, user } = res.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);

        toast({
          title: "Account Created!",
          description:
            "Your staff account has been registered. Please wait for admin approval before logging in.",
        });

        // ⚠️ Don’t redirect — approval required
        window.location.href = "/";
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

      window.location.href = "/";
    },
    isPending: false,
  };

  /**
   * ✅ RESTORE SESSION (auto-login from token)
   */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    (async () => {
      try {
        const res = await api.get("/auth/user");
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (err) {
        console.warn("Session restore failed:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
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
