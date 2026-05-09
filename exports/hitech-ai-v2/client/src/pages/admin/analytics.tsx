import { useEffect, useState } from "react";
import { adminApi, type Lead } from "@/lib/admin-api";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { TrendingUp, Users, CheckCircle, Clock, Loader2 } from "lucide-react";

function groupByDay(leads: Lead[], days: number) {
  const now = new Date();
  const data = Array.from({ length: days }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (days - 1 - i));
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const dateStr = d.toISOString().slice(0, 10);
    const count = leads.filter((l) => l.createdAt.slice(0, 10) === dateStr).length;
    return { date: label, requests: count };
  });
  return data;
}

const PIE_COLORS = ["#f59e0b", "#10b981", "#ef4444"];

export default function Analytics() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminApi.leads.list({});
        setLeads(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const chartData = groupByDay(leads, 14);

  const statusData = [
    { name: "Pending", value: leads.filter((l) => l.status === "pending").length },
    { name: "Approved", value: leads.filter((l) => l.status === "approved").length },
    { name: "Rejected", value: leads.filter((l) => l.status === "rejected").length },
  ];

  const countryData = Object.entries(
    leads.reduce((acc: Record<string, number>, l) => {
      acc[l.country] = (acc[l.country] || 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([country, count]) => ({ country: country.length > 12 ? country.slice(0, 12) + "…" : country, count }));

  const referralData = Object.entries(
    leads.reduce((acc: Record<string, number>, l) => {
      const k = l.referralSource || "Unknown";
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([source, count]) => ({ source: source.length > 14 ? source.slice(0, 14) + "…" : source, count }));

  const tooltipStyle = {
    backgroundColor: "#070d1a",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    color: "#fff",
    fontSize: 12,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={24} className="text-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-sm text-white/40 mt-0.5">Insights from {leads.length} total requests</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: leads.length, icon: Users, color: "text-emerald-400" },
          { label: "Approved", value: leads.filter((l) => l.status === "approved").length, icon: CheckCircle, color: "text-cyan-400" },
          { label: "Pending", value: leads.filter((l) => l.status === "pending").length, icon: Clock, color: "text-amber-400" },
          { label: "This Week", value: leads.filter((l) => {
            const d = new Date(l.createdAt);
            return (Date.now() - d.getTime()) < 7 * 86400000;
          }).length, icon: TrendingUp, color: "text-violet-400" },
        ].map((s) => (
          <div key={s.label} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
            <s.icon size={18} className={`${s.color} mb-2`} />
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Daily requests chart */}
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
        <h2 className="font-semibold text-white mb-4">Daily Requests (Last 14 Days)</h2>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="requests" stroke="#10b981" strokeWidth={2} fill="url(#emeraldGrad)" name="Requests" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {/* Status pie */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
          <h2 className="font-semibold text-white mb-4">Status Breakdown</h2>
          {leads.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-white/30 text-sm">No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend formatter={(v) => <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Country bar */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 md:col-span-2">
          <h2 className="font-semibold text-white mb-4">Top Countries</h2>
          {countryData.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-white/30 text-sm">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={countryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis dataKey="country" type="category" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="#06b6d4" radius={[0, 4, 4, 0]} name="Requests" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Referral sources */}
      {referralData.length > 0 && (
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
          <h2 className="font-semibold text-white mb-4">Referral Sources</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={referralData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="source" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Leads" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
