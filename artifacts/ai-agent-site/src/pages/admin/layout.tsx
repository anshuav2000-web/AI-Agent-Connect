import { useState } from "react";
import { Link, useLocation } from "wouter";
import { adminApi } from "@/lib/admin-api";
import {
  LayoutDashboard, Users, Webhook, BarChart3, Settings, LogOut, Cpu,
  Bell, Search, Menu, X, ChevronRight, Activity, MessageSquare, Database,
  Shield, BookOpen,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Users, label: "Access Requests", path: "/admin/requests" },
  { icon: MessageSquare, label: "WhatsApp AI", path: "/admin/whatsapp" },
  { icon: Webhook, label: "Webhook Settings", path: "/admin/webhook" },
  { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
  { icon: Shield, label: "User Management", path: "/admin/users" },
  { icon: Database, label: "Console Models", path: "/admin/models" },
  { icon: BookOpen, label: "AI Knowledge Base", path: "/admin/knowledge" },
  { icon: Bell, label: "Notifications", path: "/admin/notifications" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

export default function AdminLayout({ children, onLogout }: { children: React.ReactNode; onLogout: () => void }) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifCount] = useState(3);

  const handleLogout = async () => {
    await adminApi.logout();
    localStorage.removeItem("admin_token");
    onLogout();
  };

  return (
    <div className="min-h-screen bg-[#030610] text-white flex">
      {/* Ambient grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(0,255,128,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,128,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#070d1a]/90 backdrop-blur-xl border-r border-white/5 z-30 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 border border-emerald-500/30 flex items-center justify-center">
              <Cpu size={18} className="text-emerald-400" />
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight">HiTech AI</div>
              <div className="text-xs text-white/40">Admin Panel</div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-auto lg:hidden text-white/40 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Live indicator */}
        <div className="mx-4 mt-4 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400 font-medium">System Online</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 mt-3 overflow-y-auto">
          {navItems.map((item) => {
            const active = location === item.path || (item.path !== "/admin" && location.startsWith(item.path));
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  active
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon size={16} />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight size={14} className="opacity-60" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-10 h-14 bg-[#070d1a]/80 backdrop-blur-md border-b border-white/5 flex items-center gap-4 px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-white/50 hover:text-white"
          >
            <Menu size={20} />
          </button>

          {/* Search */}
          <div className="relative flex-1 max-w-xs hidden sm:flex items-center">
            <Search size={14} className="absolute left-3 text-white/30" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/30"
            />
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Status */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <Activity size={13} className="text-emerald-400" />
              <span className="text-xs text-emerald-400 font-medium">AI Active</span>
            </div>

            {/* Notifs */}
            <button className="relative p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors">
              <Bell size={18} />
              {notifCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full text-[10px] flex items-center justify-center font-bold">
                  {notifCount}
                </span>
              )}
            </button>

            {/* Admin badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-xs font-bold">
                A
              </div>
              <span className="text-sm text-white/70 hidden md:block">Admin</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 relative">{children}</main>
      </div>
    </div>
  );
}
