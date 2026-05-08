import { useEffect, useState } from "react";
import { adminApi, type WebhookSettings } from "@/lib/admin-api";
import {
  Webhook, Save, Zap, CheckCircle, XCircle, RefreshCw,
  Eye, EyeOff, Activity, AlertCircle, Loader2,
} from "lucide-react";

export default function WebhookSettingsPage() {
  const [settings, setSettings] = useState<WebhookSettings | null>(null);
  const [url, setUrl] = useState("");
  const [label, setLabel] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [showUrl, setShowUrl] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminApi.webhook.get();
        setSettings(data);
        setUrl(data.url);
        setLabel(data.label);
        setEnabled(data.enabled);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const updated = await adminApi.webhook.save({ url, label, enabled });
      setSettings(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    if (!url) return;
    setTesting(true);
    setTestResult(null);
    try {
      const result = await adminApi.webhook.test(url);
      setTestResult(result);
    } catch {
      setTestResult({ success: false, message: "Test request failed" });
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={24} className="text-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Webhook Settings</h1>
        <p className="text-sm text-white/40 mt-0.5">Configure your n8n webhook endpoint</p>
      </div>

      {/* Status card */}
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
        enabled ? "bg-emerald-500/10 border-emerald-500/20" : "bg-white/5 border-white/10"
      }`}>
        <div className={`w-2.5 h-2.5 rounded-full ${enabled ? "bg-emerald-400 animate-pulse" : "bg-white/20"}`} />
        <div className="flex-1">
          <div className={`text-sm font-medium ${enabled ? "text-emerald-400" : "text-white/40"}`}>
            Webhook {enabled ? "Active" : "Disabled"}
          </div>
          {settings?.updatedAt && (
            <div className="text-xs text-white/30">
              Last updated: {new Date(settings.updatedAt).toLocaleString()}
            </div>
          )}
        </div>
        <Activity size={16} className={enabled ? "text-emerald-400" : "text-white/20"} />
      </div>

      {/* Main settings card */}
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <Webhook size={18} className="text-emerald-400" />
          <h2 className="font-semibold text-white">Webhook Configuration</h2>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">Webhook Label</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Primary n8n Webhook"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/40 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">Webhook URL</label>
          <div className="relative">
            <input
              type={showUrl ? "text" : "password"}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-n8n.app.n8n.cloud/webhook/..."
              className="w-full pr-10 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/40 transition-colors font-mono"
            />
            <button
              type="button"
              onClick={() => setShowUrl(!showUrl)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            >
              {showUrl ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <p className="text-xs text-white/30 mt-1.5">
            This URL receives all lead form submissions from your website.
          </p>
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <div className="text-sm font-medium text-white/80">Enable Webhook</div>
            <div className="text-xs text-white/40">Toggle to enable or disable forwarding</div>
          </div>
          <button
            onClick={() => setEnabled(!enabled)}
            className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? "bg-emerald-500" : "bg-white/10"}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${enabled ? "translate-x-7" : "translate-x-1"}`} />
          </button>
        </div>

        {/* Test result */}
        {testResult && (
          <div className={`flex items-start gap-3 p-3 rounded-xl border ${
            testResult.success
              ? "bg-emerald-500/10 border-emerald-500/20"
              : "bg-red-500/10 border-red-500/20"
          }`}>
            {testResult.success
              ? <CheckCircle size={16} className="text-emerald-400 mt-0.5 shrink-0" />
              : <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />}
            <div>
              <div className={`text-sm font-medium ${testResult.success ? "text-emerald-400" : "text-red-400"}`}>
                {testResult.success ? "Connection Successful" : "Connection Failed"}
              </div>
              <div className="text-xs text-white/50 mt-0.5">{testResult.message}</div>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleTest}
            disabled={testing || !url}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-medium text-white/70 hover:text-white transition-all disabled:opacity-40"
          >
            {testing ? <RefreshCw size={14} className="animate-spin" /> : <Zap size={14} />}
            Test Connection
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 ${
              saved
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white"
            }`}
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <CheckCircle size={14} /> : <Save size={14} />}
            {saved ? "Saved!" : "Save Settings"}
          </button>
        </div>
      </div>

      {/* Info card */}
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Activity size={14} className="text-cyan-400" />
          What gets sent to the webhook
        </h3>
        <div className="bg-black/30 rounded-xl p-4 font-mono text-xs text-emerald-300 overflow-x-auto">
          {`{
  "fullName": "Jane Smith",
  "companyName": "Acme Corp",
  "email": "jane@company.com",
  "phone": "+1 555 000 0000",
  "country": "United States",
  "requirement": "Automate WhatsApp...",
  "referralSource": "LinkedIn",
  "leadId": 42,
  "submittedAt": "2025-01-01T00:00:00.000Z"
}`}
        </div>
      </div>
    </div>
  );
}
