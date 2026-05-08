import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import AdminLogin from "@/pages/admin/login";
import AdminLayout from "@/pages/admin/layout";
import AdminDashboard from "@/pages/admin/dashboard";
import AccessRequests from "@/pages/admin/requests";
import WebhookSettingsPage from "@/pages/admin/webhook-settings";
import Analytics from "@/pages/admin/analytics";
import SettingsPage from "@/pages/admin/settings";
import PlaceholderPage from "@/pages/admin/placeholder";
import { adminApi } from "@/lib/admin-api";

const queryClient = new QueryClient();

function AdminApp() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    adminApi.me().then((r) => setAuthed(r.authenticated)).catch(() => setAuthed(false));
  }, []);

  if (authed === null) {
    return (
      <div className="min-h-screen bg-[#030610] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!authed) {
    return <AdminLogin onLogin={() => setAuthed(true)} />;
  }

  return (
    <AdminLayout onLogout={() => setAuthed(false)}>
      <Switch>
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/requests" component={AccessRequests} />
        <Route path="/admin/webhook" component={WebhookSettingsPage} />
        <Route path="/admin/analytics" component={Analytics} />
        <Route path="/admin/settings" component={SettingsPage} />
        <Route path="/admin/whatsapp">
          <PlaceholderPage title="WhatsApp AI Management" />
        </Route>
        <Route path="/admin/users">
          <PlaceholderPage title="User Management" />
        </Route>
        <Route path="/admin/models">
          <PlaceholderPage title="Console Models" />
        </Route>
        <Route path="/admin/knowledge">
          <PlaceholderPage title="AI Knowledge Base" />
        </Route>
        <Route path="/admin/notifications">
          <PlaceholderPage title="Notifications" />
        </Route>
        <Route component={NotFound} />
      </Switch>
    </AdminLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin">
        <AdminApp />
      </Route>
      <Route path="/admin/:rest*">
        <AdminApp />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
