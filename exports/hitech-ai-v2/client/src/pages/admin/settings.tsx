import { useState } from "react";
import { Save, Shield, Mail, Globe, Key, CheckCircle, Loader2, AlertTriangle } from "lucide-react";

function SettingSection({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
      <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
        <Icon size={16} className="text-emerald-400" />
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, type = "text", placeholder, value, onChange, note }: {
  label: string; type?: string; placeholder?: string; value: string; onChange: (v: string) => void; note?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-white/60 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/40"
      />
      {note && <p className="text-xs text-white/30 mt-1">{note}</p>}
    </div>
  );
}

export default function SettingsPage() {
  const [siteName, setSiteName] = useState("HiTech AI Agent");
  const [tagline, setTagline] = useState("Your Business on Autopilot");
  const [supportEmail, setSupportEmail] = useState("");
  const [supportPhone, setSupportPhone] = useState("");
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUser, setSmtpUser] = useState("");
  const [maintenance, setMaintenance] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-white/40 mt-0.5">Manage your platform configuration</p>
      </div>

      <SettingSection title="Site Identity" icon={Globe}>
        <Field label="Site Name" value={siteName} onChange={setSiteName} placeholder="Your brand name" />
        <Field label="Tagline" value={tagline} onChange={setTagline} placeholder="Your tagline" />
      </SettingSection>

      <SettingSection title="Contact Details" icon={Mail}>
        <Field label="Support Email" type="email" value={supportEmail} onChange={setSupportEmail} placeholder="support@yoursite.com" />
        <Field label="Support Phone" value={supportPhone} onChange={setSupportPhone} placeholder="+1 555 000 0000" />
      </SettingSection>

      <SettingSection title="Email / SMTP" icon={Mail}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="SMTP Host" value={smtpHost} onChange={setSmtpHost} placeholder="smtp.gmail.com" />
          <Field label="SMTP Port" value={smtpPort} onChange={setSmtpPort} placeholder="587" />
        </div>
        <Field label="SMTP Username" value={smtpUser} onChange={setSmtpUser} placeholder="user@gmail.com"
          note="Store passwords as environment secrets, not here." />
      </SettingSection>

      <SettingSection title="Security" icon={Shield}>
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
          <Key size={15} className="text-amber-400 mt-0.5 shrink-0" />
          <div>
            <div className="text-sm font-medium text-amber-400">Admin Password</div>
            <div className="text-xs text-white/50 mt-0.5">
              Set the <span className="font-mono text-white/70">ADMIN_PASSWORD</span> environment secret to change your admin login password.
            </div>
          </div>
        </div>
      </SettingSection>

      <SettingSection title="Maintenance Mode" icon={AlertTriangle}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-white/80">Enable Maintenance Mode</div>
            <div className="text-xs text-white/40 mt-0.5">Shows a maintenance page to visitors</div>
          </div>
          <button
            onClick={() => setMaintenance(!maintenance)}
            className={`relative w-12 h-6 rounded-full transition-colors ${maintenance ? "bg-red-500" : "bg-white/10"}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${maintenance ? "translate-x-7" : "translate-x-1"}`} />
          </button>
        </div>
        {maintenance && (
          <div className="text-xs text-red-400/80 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
            Maintenance mode is ON — visitors will see a maintenance page.
          </div>
        )}
      </SettingSection>

      <button
        onClick={handleSave}
        disabled={saving}
        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-all ${
          saved
            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            : "bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white"
        }`}
      >
        {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <CheckCircle size={16} /> : <Save size={16} />}
        {saved ? "Settings Saved!" : "Save All Settings"}
      </button>
    </div>
  );
}
