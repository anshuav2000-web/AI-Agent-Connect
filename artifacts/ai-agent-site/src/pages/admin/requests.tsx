import { useEffect, useState } from "react";
import { adminApi, type Lead } from "@/lib/admin-api";
import {
  Search, Filter, Trash2, CheckCircle, XCircle, Eye, RefreshCw,
  Download, ChevronDown, X, Save, Loader2,
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  rejected: "bg-red-500/15 text-red-400 border-red-500/30",
};

export default function AccessRequests() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Lead>>({});
  const [saving, setSaving] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const data = await adminApi.leads.list({ status: statusFilter, search });
      setLeads(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, [statusFilter, search]);

  const handleStatus = async (id: number, status: string) => {
    await adminApi.leads.update(id, { status });
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this request?")) return;
    await adminApi.leads.delete(id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const updated = await adminApi.leads.update(selected.id, editData);
      setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
      setSelected(updated);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const exportCSV = () => {
    const rows = [
      ["ID", "Name", "Company", "Email", "Phone", "Country", "Status", "Date"],
      ...leads.map((l) => [
        l.id, l.fullName, l.companyName ?? "", l.email, l.phone,
        l.country, l.status, new Date(l.createdAt).toLocaleDateString(),
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "access-requests.csv";
    a.click();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Access Requests</h1>
          <p className="text-sm text-white/40 mt-0.5">{leads.length} total records</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            <Download size={14} /> Export CSV
          </button>
          <button
            onClick={fetchLeads}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search by name, email, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/30"
          />
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-9 pr-8 py-2.5 bg-[#070d1a] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/30 appearance-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {["Name", "Company", "Email", "Phone", "Country", "Console", "Date", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <Loader2 size={20} className="text-emerald-400 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-white/30 text-sm">
                    No requests found
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-white whitespace-nowrap">{lead.fullName}</td>
                    <td className="px-4 py-3 text-sm text-white/60 whitespace-nowrap">{lead.companyName ?? "—"}</td>
                    <td className="px-4 py-3 text-sm text-white/60 whitespace-nowrap">{lead.email}</td>
                    <td className="px-4 py-3 text-sm text-white/60 whitespace-nowrap">{lead.phone}</td>
                    <td className="px-4 py-3 text-sm text-white/60 whitespace-nowrap">{lead.country}</td>
                    <td className="px-4 py-3 text-sm text-white/60 whitespace-nowrap">{(lead as any).consoleModel ?? "—"}</td>
                    <td className="px-4 py-3 text-sm text-white/40 whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[lead.status] ?? ""}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { setSelected(lead); setEditing(false); setEditData({}); }}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                          title="View"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleStatus(lead.id, "approved")}
                          className="p-1.5 rounded-lg hover:bg-emerald-500/15 text-white/40 hover:text-emerald-400 transition-colors"
                          title="Approve"
                        >
                          <CheckCircle size={14} />
                        </button>
                        <button
                          onClick={() => handleStatus(lead.id, "rejected")}
                          className="p-1.5 rounded-lg hover:bg-red-500/15 text-white/40 hover:text-red-400 transition-colors"
                          title="Reject"
                        >
                          <XCircle size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(lead.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/15 text-white/40 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div
            className="bg-[#070d1a] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <div>
                <h2 className="font-bold text-white">{selected.fullName}</h2>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border mt-1 ${STATUS_COLORS[selected.status] ?? ""}`}>
                  {selected.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setEditing(!editing); setEditData(selected); }}
                  className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-white/60 hover:text-white border border-white/10 transition-all"
                >
                  {editing ? "Cancel Edit" : "Edit"}
                </button>
                <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {(
                [
                  ["Full Name", "fullName"],
                  ["Company", "companyName"],
                  ["Email", "email"],
                  ["Phone", "phone"],
                  ["Country", "country"],
                ] as [string, keyof Lead][]
              ).map(([label, key]) => (
                <div key={key}>
                  <label className="block text-xs text-white/40 mb-1">{label}</label>
                  {editing ? (
                    <input
                      value={(editData[key] as string) ?? ""}
                      onChange={(e) => setEditData((d) => ({ ...d, [key]: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/30"
                    />
                  ) : (
                    <div className="text-sm text-white/80">{(selected[key] as string) || "—"}</div>
                  )}
                </div>
              ))}

              <div>
                <label className="block text-xs text-white/40 mb-1">Requirement</label>
                {editing ? (
                  <textarea
                    value={editData.requirement ?? ""}
                    onChange={(e) => setEditData((d) => ({ ...d, requirement: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/30 resize-none"
                  />
                ) : (
                  <div className="text-sm text-white/80 whitespace-pre-wrap">{selected.requirement}</div>
                )}
              </div>

              <div>
                <label className="block text-xs text-white/40 mb-1">Notes</label>
                <textarea
                  value={editing ? (editData.notes ?? "") : (selected.notes ?? "")}
                  onChange={(e) => editing && setEditData((d) => ({ ...d, notes: e.target.value }))}
                  rows={2}
                  readOnly={!editing}
                  placeholder="Add admin notes..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/30 resize-none placeholder:text-white/20"
                />
              </div>

              <div>
                <label className="block text-xs text-white/40 mb-1">Status</label>
                <div className="flex gap-2">
                  {["pending", "approved", "rejected"].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatus(selected.id, s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize ${
                        selected.status === s ? STATUS_COLORS[s] : "border-white/10 text-white/40 hover:border-white/20"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {editing && (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
