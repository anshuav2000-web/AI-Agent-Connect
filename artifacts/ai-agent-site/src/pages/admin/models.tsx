import { useState, useEffect } from "react";
import { adminApi } from "@/lib/admin-api";
import { Cpu, Plus, Trash2, Save, Loader2, CheckCircle, GripVertical } from "lucide-react";

export default function ConsoleModelsPage() {
  const [models, setModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newModel, setNewModel] = useState("");

  useEffect(() => {
    adminApi.siteSettings.get().then(s => {
      const list = (s.consoleModels ?? "").split(",").map(m => m.trim()).filter(Boolean);
      setModels(list);
      setLoading(false);
    });
  }, []);

  const addModel = () => {
    const trimmed = newModel.trim();
    if (trimmed && !models.includes(trimmed)) {
      setModels(p => [...p, trimmed]);
      setNewModel("");
    }
  };

  const removeModel = (i: number) => setModels(p => p.filter((_, idx) => idx !== i));

  const save = async () => {
    setSaving(true);
    await adminApi.siteSettings.save({ consoleModels: models.join(",") });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Console Models</h1>
        <p className="text-sm text-white/40 mt-0.5">Manage the DiGiCo console models displayed on the website</p>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Cpu size={16} className="text-emerald-400" />
          Add New Console Model
        </h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={newModel}
            onChange={e => setNewModel(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addModel()}
            placeholder="e.g. Quantum338, SD5, S31..."
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/40"
          />
          <button
            onClick={addModel}
            className="px-4 py-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl hover:bg-emerald-500/30 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <GripVertical size={16} className="text-emerald-400" />
            Console Models ({models.length})
          </h2>
          <span className="text-xs text-white/30">Displayed on the website grid</span>
        </div>
        <div className="space-y-2">
          {models.length === 0 && (
            <div className="text-center py-8 text-white/30 text-sm">No console models added yet.</div>
          )}
          {models.map((model, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl group hover:border-white/10 transition-colors">
              <GripVertical size={14} className="text-white/20" />
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Cpu size={14} className="text-emerald-400" />
              </div>
              <span className="flex-1 text-sm font-medium text-white">{model}</span>
              <span className="text-xs text-white/30 font-mono">#{i + 1}</span>
              <button
                onClick={() => removeModel(i)}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
        <span className="text-xs text-white/30 w-full mb-1">Preview (how they appear on website)</span>
        {models.map((m, i) => (
          <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-white/70">{m}</span>
        ))}
      </div>

      <button
        onClick={save}
        disabled={saving}
        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-all ${
          saved
            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            : "bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white"
        }`}
      >
        {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <CheckCircle size={16} /> : <Save size={16} />}
        {saved ? "Saved!" : "Save Console Models"}
      </button>
    </div>
  );
}
