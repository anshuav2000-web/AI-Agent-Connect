import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { Users, Clock, CheckCircle, XCircle, TrendingUp, Activity, Zap, Globe } from "lucide-react";

interface Stats {
  totalRequests: number;
  approved: number;
  pending: number;
  rejected: number;
  todayRequests: number;
  weekRequests: number;
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  sub,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  sub?: string;
}) {
  const colors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400", glow: "shadow-emerald-500/10" },
    cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/20", text: "text-cyan-400", glow: "shadow-cyan-500/10" },
    amber: { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400", glow: "shadow-amber-500/10" },
    red: { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400", glow: "shadow-red-500/10" },
    violet: { bg: "bg-violet-500/10", border: "border-violet-500/20", text: "text-violet-400", glow: "shadow-violet-500/10" },
    blue: { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400", glow: "shadow-blue-500/10" },
  };
  const c = colors[color];

  return (
    <div className={`bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:bg-white/[0.04] transition-all shadow-lg ${c.glow}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
          <Icon size={18} className={c.text} />
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.bg} ${c.text}`}>Live</span>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-white/50">{label}</div>
      {sub && <div className="text-xs text-white/30 mt-1">{sub}</div>}
    </div>
  );
}

function AudioMeter({ height, color }: { height: number; color: string }) {
  return (
    <div
      className={`w-1.5 rounded-full transition-all duration-300 ${color}`}
      style={{ height: `${height}%` }}
    />
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [meters, setMeters] = useState([40, 65, 30, 80, 50, 70, 45, 60, 35, 75, 55, 85]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminApi.stats();
        setStats(data);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  // Animate audio meters
  useEffect(() => {
    const interval = setInterval(() => {
      setMeters((prev) =>
        prev.map(() => Math.floor(Math.random() * 70) + 20)
      );
    }, 500);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: "Total Requests", value: stats?.totalRequests ?? 0, icon: Users, color: "emerald", sub: `${stats?.todayRequests ?? 0} today` },
    { label: "Approved", value: stats?.approved ?? 0, icon: CheckCircle, color: "cyan", sub: "Access granted" },
    { label: "Pending Review", value: stats?.pending ?? 0, icon: Clock, color: "amber", sub: "Awaiting action" },
    { label: "Rejected", value: stats?.rejected ?? 0, icon: XCircle, color: "red", sub: "Access denied" },
    { label: "This Week", value: stats?.weekRequests ?? 0, icon: TrendingUp, color: "violet", sub: "Last 7 days" },
    { label: "AI Resolution Rate", value: "94%", icon: Zap, color: "emerald", sub: "Automated responses" },
    { label: "Active Users", value: stats?.approved ?? 0, icon: Activity, color: "cyan", sub: "Live sessions" },
    { label: "Global Reach", value: "18+", icon: Globe, color: "blue", sub: "Countries served" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-white/40 mt-0.5">HiTech AI Agent — Command Center</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/40">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live · Updated just now
        </div>
      </div>

      {/* Audio visualizer banner */}
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex items-end gap-1 h-20 overflow-hidden">
        <span className="text-xs text-white/30 mr-3 mb-1 shrink-0">AI Activity</span>
        {meters.map((h, i) => (
          <AudioMeter
            key={i}
            height={h}
            color={i % 3 === 0 ? "bg-emerald-400" : i % 3 === 1 ? "bg-cyan-400" : "bg-emerald-600"}
          />
        ))}
        <div className="ml-auto flex items-center gap-2 mb-1 shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400">LIVE</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* Recent activity */}
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Activity size={16} className="text-emerald-400" />
          Recent Activity
        </h2>
        <div className="space-y-3">
          {[
            { action: "New access request", user: "Awaiting review", time: "Just now", color: "amber" },
            { action: "Webhook triggered", user: "n8n automation fired", time: "2m ago", color: "cyan" },
            { action: "Request approved", user: "Access granted", time: "15m ago", color: "emerald" },
            { action: "AI session started", user: "WhatsApp conversation", time: "32m ago", color: "violet" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
              <div className={`w-2 h-2 rounded-full ${
                item.color === "amber" ? "bg-amber-400" :
                item.color === "cyan" ? "bg-cyan-400" :
                item.color === "emerald" ? "bg-emerald-400" : "bg-violet-400"
              }`} />
              <div className="flex-1">
                <div className="text-sm text-white/80">{item.action}</div>
                <div className="text-xs text-white/40">{item.user}</div>
              </div>
              <div className="text-xs text-white/30">{item.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
