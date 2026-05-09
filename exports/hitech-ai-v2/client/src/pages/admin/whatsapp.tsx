import { useState, useEffect } from "react";
import { adminApi } from "@/lib/admin-api";
import { MessageSquare, Save, Loader2, CheckCircle, Phone, Clock, Bot, Send } from "lucide-react";

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
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

function Field({ label, value, onChange, placeholder, multiline = false, note, prefix }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; multiline?: boolean; note?: string; prefix?: string;
}) {
  const cls = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/40 resize-none";
  return (
    <div>
      <label className="block text-sm font-medium text-white/60 mb-1.5">{label}</label>
      {prefix ? (
        <div className="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden focus-within:border-emerald-500/40">
          <span className="px-3 text-white/40 text-sm border-r border-white/10 py-3 bg-white/5">{prefix}</span>
          <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            className="flex-1 px-4 py-3 bg-transparent text-sm text-white placeholder:text-white/20 focus:outline-none" />
        </div>
      ) : multiline ? (
        <textarea rows={4} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      ) : (
        <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      )}
      {note && <p className="text-xs text-white/30 mt-1">{note}</p>}
    </div>
  );
}

export default function WhatsAppPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminApi.siteSettings.get().then(s => { setSettings(s); setLoading(false); });
  }, []);

  const set = (key: string) => (val: string) => setSettings(p => ({ ...p, [key]: val }));

  const waNumber = settings.whatsappNumber ?? "";
  const waMessage = settings.whatsappMessage ?? "Hi! I need support with my DiGiCo console.";
  const waLink = waNumber
    ? `https://wa.me/${waNumber.replace(/\D/g, "")}?text=${encodeURIComponent(waMessage)}`
    : null;

  const save = async () => {
    setSaving(true);
    await adminApi.siteSettings.save(settings);
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
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">WhatsApp Configuration</h1>
        <p className="text-sm text-white/40 mt-0.5">Set up the WhatsApp number and AI message templates</p>
      </div>

      {/* Live WA link preview */}
      {waLink && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
          <MessageSquare size={18} className="text-emerald-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-emerald-400">WhatsApp Link Active</div>
            <a href={waLink} target="_blank" rel="noreferrer" className="text-xs text-white/50 hover:text-white truncate block mt-0.5">{waLink}</a>
          </div>
          <a href={waLink} target="_blank" rel="noreferrer"
            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 shrink-0">
            <Send size={12} /> Test
          </a>
        </div>
      )}

      <Section title="WhatsApp Number" icon={Phone}>
        <Field
          label="WhatsApp Phone Number"
          value={waNumber}
          onChange={set("whatsappNumber")}
          placeholder="971501234567"
          prefix="+"
          note="Include country code, no spaces or dashes. E.g. 971501234567 for UAE."
        />
      </Section>

      <Section title="Message Templates" icon={Bot}>
        <Field
          label="Default Opening Message (pre-filled for users)"
          value={waMessage}
          onChange={set("whatsappMessage")}
          placeholder="Hi! I need support with my DiGiCo console."
          multiline
          note="This text is pre-filled when a user taps 'Start WhatsApp Support'."
        />
        <Field
          label="Support Hours Display Text"
          value={settings.supportHours ?? ""}
          onChange={set("supportHours")}
          placeholder="24/7 AI Support"
        />
      </Section>

      <Section title="Chat Preview (shown on landing page)" icon={MessageSquare}>
        <div className="space-y-2">
          {[
            { key: "chatPreview1User", placeholder: "Hi! My Quantum7 is showing routing errors on Bus 7-8. Mid-show right now 😱", label: "User message 1" },
            { key: "chatPreview1Bot", placeholder: "I'm on it. First — go to Busses > Bus 7-8 > check if the Output routing matrix has a duplicate assignment on MADI Ch 7. This causes the conflict you're seeing.", label: "AI reply 1" },
            { key: "chatPreview2User", placeholder: "Found it! Duplicate on MADI 7. Removing now...", label: "User message 2" },
            { key: "chatPreview2Bot", placeholder: "Perfect. After removing, reset the output gain to 0dB. Your bus should be clean. Let me know if the error clears!", label: "AI reply 2" },
            { key: "chatPreview3User", placeholder: "IT WORKED. You just saved the show. Thank you! 🙌", label: "User message 3" },
          ].map(({ key, placeholder, label }) => (
            <Field key={key} label={label} value={settings[key] ?? ""} onChange={set(key)} placeholder={placeholder} />
          ))}
        </div>
        <p className="text-xs text-white/30">These messages appear in the animated chat preview on the homepage hero section.</p>
      </Section>

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
        {saved ? "Saved!" : "Save WhatsApp Config"}
      </button>
    </div>
  );
}
