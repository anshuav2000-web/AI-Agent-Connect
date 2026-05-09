import { useState, useEffect } from "react";
import { adminApi } from "@/lib/admin-api";
import { Bell, CheckCircle, Clock, XCircle, Webhook, Users, Zap, RefreshCw } from "lucide-react";

interface Lead {
  id: number;
  fullName: string;
  email: string;
  consoleModel?: string;
  status: string;
  createdAt: string;
}

type ActivityItem = {
  type: "new_lead" | "approved" | "rejected" | "webhook";
  label: string;
  sub: string;
  time: Date;
  color: string;
};

function timeAgo(d: Date) {
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const COLOR_ICON: Record<string, { icon: React.ElementType; dot: string }> = {
  emerald: { icon: CheckCircle, dot: "bg-emerald-400" },
  amber: { icon: Clock, dot: "bg-amber-400" },
  red: { icon: XCircle, dot: "bg-red-400" },
  cyan: { icon: Webhook, dot: "bg-cyan-400" },
  violet: { icon: Zap, dot: "bg-violet-400" },
};

export default function NotificationsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "new_lead" | "approved" | "rejected">("all");
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const data = await adminApi.leads.list();
      setLeads(data as Lead[]);
    } catch { /* ignore */ }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { load(); }, []);

  const refresh = () => { setRefreshing(true); load(); };

  const activities: ActivityItem[] = leads.map(l => ({
    type: (l.status === "approved" ? "approved" : l.status === "rejected" ? "rejected" : "new_lead") as ActivityItem["type"],
    label: l.status === "approved"
      ? `Access approved — ${l.fullName}`
      : l.status === "rejected"
      ? `Request rejected — ${l.fullName}`
      : `New access request — ${l.fullName}`,
    sub: `${l.email}${l.consoleModel ? ` · ${l.consoleModel}` : ""}`,
    time: new Date(l.createdAt),
    color: l.status === "approved" ? "emerald" : l.status === "rejected" ? "red" : "amber",
  })).sort((a, b) => b.time.getTime() - a.time.getTime());

  const filtered = filter === "all" ? activities : activities.filter(a => a.type === filter);

  const counts = {
    total: activities.length,
    new: activities.filter(a => a.type === "new_lead").length,
    approved: activities.filter(a => a.type === "approved").length,
    rejected: activities.filter(a => a.type === "rejected").length,
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <p className="text-sm text-white/40 mt-0.5">Live activity feed for all system events</p>
        </div>
        <button
          onClick={refresh}
          className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "All Events", value: counts.total, color: "bg-white/5 border-white/10", text: "text-white" },
          { label: "New Requests", value: counts.new, color: "bg-amber-500/10 border-amber-500/20", text: "text-amber-400" },
          { label: "Approved", value: counts.approved, color: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-400" },
          { label: "Rejected", value: counts.rejected, color: "bg-red-500/10 border-red-500/20", text: "text-red-400" },
        ].map(c => (
          <div key={c.label} className={`${c.color} border rounded-xl p-3 text-center`}>
            <div className={`text-2xl font-bold ${c.text}`}>{c.value}</div>
            <div className="text-xs text-white/40 mt-0.5">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["all", "new_lead", "approved", "rejected"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === f
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-white/5 text-white/40 border border-white/10 hover:text-white"
            }`}
          >
            {f === "all" ? "All" : f === "new_lead" ? "New Requests" : f === "approved" ? "Approved" : "Rejected"}
          </button>
        ))}
      </div>

      {/* Activity feed */}
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
          <Bell size={15} className="text-emerald-400" />
          <span className="font-semibold text-white text-sm">Activity Feed</span>
          <span className="ml-auto text-xs text-white/30">{filtered.length} events</span>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-white/30 text-sm">No activity yet</div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map((item, i) => {
              const ci = COLOR_ICON[item.color] ?? COLOR_ICON.amber;
              const Icon = ci.icon;
              return (
                <div key={i} className="flex items-start gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${ci.dot} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white/90">{item.label}</div>
                    <div className="text-xs text-white/40 mt-0.5">{item.sub}</div>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <Icon size={14} className={`text-${item.color}-400`} />
                    <span className="text-xs text-white/30">{timeAgo(item.time)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-3">
        <Users size={15} className="text-white/30 shrink-0" />
        <p className="text-xs text-white/30">
          Activity is generated from access requests in real time. Refresh to see the latest events.
        </p>
      </div>
    </div>
  );
}
