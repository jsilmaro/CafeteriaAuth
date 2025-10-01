import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { AuthProvider } from "./hooks/use-auth";
import HomePage from "./pages/home-page";
import NotFound from "./pages/not-found";
import AuthPage from "./pages/auth-page";
import OrderManagementPage from "./pages/order-management";
import AdminPage from "./pages/admin-page";
import LandingPage from "./pages/landing-page";
import AdminAuthPage from "./pages/admin-auth-page";
import StudentDashboard from "./pages/student-dashboard";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/admin-auth" component={AdminAuthPage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/dashboard" component={HomePage} />
      <ProtectedRoute path="/orders" component={OrderManagementPage} />
      <ProtectedRoute path="/admin" component={AdminPage} adminOnly={true} />
      <ProtectedRoute path="/student-dashboard" component={StudentDashboard} studentOnly={true} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;