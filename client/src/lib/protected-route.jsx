import { useAuth } from "../hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Route, useLocation } from "wouter";
import { useEffect, useState } from "react";

export function ProtectedRoute({ path, component: Component, adminOnly = false }) {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setShouldRender(false);
      return;
    }

    if (!user) {
      navigate('/');
      return;
    }

    if (adminOnly && user.role !== 'admin') {
      // Non-admin users trying to access admin pages go to dashboard
      navigate('/dashboard');
      return;
    }

    setShouldRender(true);
  }, [user, isLoading, navigate, adminOnly]);

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </Route>
    );
  }

  return (
    <Route path={path}>
      {shouldRender ? <Component /> : null}
    </Route>
  );
}