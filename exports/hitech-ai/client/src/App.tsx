import { useState, useEffect, useCallback } from "react";
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
import ContentEditor from "@/pages/admin/content";
import BrandingPage from "@/pages/admin/branding";
import WhatsAppPage from "@/pages/admin/whatsapp";
import ConsoleModelsPage from "@/pages/admin/models";
import KnowledgePage from "@/pages/admin/knowledge";
import NotificationsPage from "@/pages/admin/notifications";
import SplashScreen from "@/components/SplashScreen";
import { adminApi } from "@/lib/admin-api";

const queryClient = new QueryClient();
const SPLASH_KEY = "hitech_splash_shown";

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

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />;

  return (
    <AdminLayout onLogout={() => setAuthed(false)}>
      <Switch>
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/requests" component={AccessRequests} />
        <Route path="/admin/webhook" component={WebhookSettingsPage} />
        <Route path="/admin/analytics" component={Analytics} />
        <Route path="/admin/settings" component={SettingsPage} />
        <Route path="/admin/content" component={ContentEditor} />
        <Route path="/admin/branding" component={BrandingPage} />
        <Route path="/admin/whatsapp" component={WhatsAppPage} />
        <Route path="/admin/models" component={ConsoleModelsPage} />
        <Route path="/admin/knowledge" component={KnowledgePage} />
        <Route path="/admin/notifications" component={NotificationsPage} />
        <Route component={NotFound} />
      </Switch>
    </AdminLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin"><AdminApp /></Route>
      <Route path="/admin/:rest*"><AdminApp /></Route>
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const [splashDone, setSplashDone] = useState(() => sessionStorage.getItem(SPLASH_KEY) === "1");
  const onDone = useCallback(() => { sessionStorage.setItem(SPLASH_KEY, "1"); setSplashDone(true); }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter>
          {!splashDone && <SplashScreen onDone={onDone} />}
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
